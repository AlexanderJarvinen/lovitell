<?php

namespace Modules\Inventory\Jobs;

use App\Jobs\Job;
use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;
use Modules\Inventory\Models\Equipment;
use Modules\Inventory\Models\Inventory;
use Log;
use App\Components\Helper;
use Modules\Inventory\Components\APSetup\APSetup;
use Modules\Inventory\Models\TemplateJobModel;

class ChangeTemplateJob extends Job implements ShouldQueue
{
    use InteractsWithQueue, SerializesModels;

    public $address_id;
    public $system;
    public $group_id;
    public $to_all;
    public $user;
    public $id;
    public $routes;

    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct($address_id, $system, $group_id, $user, $desk, $to_all, $routes, $send_report=0)
    {
        $this->address_id = $address_id;
        $this->system = $system;
        $this->group_id = $group_id;
        $this->user = $user;
        $this->to_all = $to_all;
        $this->routes = $routes;
        $this->send_report = $send_report;
        $job_model = new TemplateJobModel();
        $total = 0;
        $model = new Inventory();
        $equipments = $model->getBuildingEquipment($address_id);
        foreach($equipments as $eq_row) {
            if ($eq_row->system != $system) continue;
            if (!$this->to_all && $eq_row->group_template_id == $this->group_id) continue;
            if (array_search($eq_row->route, $routes) === false) continue;
            $total++;
        }
        $this->id = $job_model->initJob($user->id, $address_id, $system, $group_id, $desk, $total, $send_report);

    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        $job_model = TemplateJobModel::find($this->id);
        if ($this->attempts() > 1) {
            $this->delete();
            $job_model->fail();
        } else {
            Log::debug("start ChangeTemplateWork. $this->id $this->address_id $this->system $this->group_id");
            if (!$job_model->stopped()) {
                $job_model->start();
            } else {
                Log::debug('job stopped before start');
                return;
            }
            try {
                $this->user->initDbConnection();
                $model = new Inventory();
                $eq_model = new Equipment();
                $address_id = $this->address_id;
                $system = $this->system;
                $group_id = $this->group_id;
                $routes = $this->routes;
                $equipments = $model->getBuildingEquipment($address_id);
                $resp = [];
                $num = 0;
                $has_error = 0;
                if ($system != 0 && $group_id != 0) {
                    foreach ($equipments as $eq_row) {
                        Log::debug('JOB State:'.$job_model->state);
                        $job_model = $job_model->fresh();
                        if ($job_model->stopped()) {
                            $job_model->log($resp['name'], 0, 'STOPPED', $num);
                            continue;
                        }
                        if ($eq_row->system != $system) continue;
                        if (!$this->to_all && $eq_row->group_template_id == $this->group_id) continue;
                        if (array_search($eq_row->route, $routes) === false) continue;
                        $error = 1;
                        $num++;
                        $msg = '';
                        if (Helper::pingAddress($eq_row->ip_addr)) {
                            Log::debug($eq_row->ip_addr . ' Ping OK');
                            $ap_info = APSetup::getAPInfo($eq_row->ip_addr, $eq_row->login, $eq_row->pwd);
                            if ($ap_info['error'] != 0) {
                                Log::error('Can`t get AP info');
                                $resp = [
                                    'name' => $eq_row->route,
                                    'template' => $group_id,
                                    'error' => $ap_info['error'],
                                    'msg' => $ap_info['msg']
                                ];
                                $job_model->log($resp['name'], $resp['error'], $resp['msg'], $num);
                                continue;
                            }
                        } else {
                            Log::debug($eq_row->ip_addr . ' Ping error');
                            $resp = [
                                'name' => $eq_row->route,
                                'template' => $group_id,
                                'error' => -3,
                                'msg' => 'Устройство недоступно'
                            ];
                            $job_model->log($resp['name'], $resp['error'], $resp['msg'], $num);
                            continue;
                        }
                        $template = $eq_model->getTemplateForModel($eq_row->route, $group_id, $ap_info['model'], $ap_info['fw']);
                        $attempt = 0;
                        if ($template) {
                            for ($i = 1; $i <= config('inventory.ap_config_change_trying'); $i++) {
                                Log::debug("Trying to change config $i");
                                if ($error == 0) break;
                                $change_result = APSetup::changeTemplate($eq_row->ip_addr, $ap_info['fw'], $template->template, $eq_row->login, $eq_row->pwd);
                                if ($change_result['error'] != 0) {
                                    $error = $change_result['error'];
                                    $msg .= 'try('.$i.') '.$change_result['msg'].' ';
                                } else {
                                    $error = 0;
                                    $msg = 'OK';
                                    $attempt = $i;
                                }
                            }
                        } else {
                            $error = -1;
                            $msg = 'Нет шаблона для данной группы, модели, версии: '.$ap_info['model'];
                        }
                        if ($error == 0) {
                            $result = $model->setTemplate($eq_row->route, $template->template_id);
                            if ($result['error'] == 0) {
                                $resp = [
                                    'name' => $eq_row->route,
                                    'template' => $group_id,
                                    'error' => 0,
                                    'msg' => 'OK'."(c $attempt попытки)"
                                ];
                            } else {
                                $resp = [
                                    'name' => $eq_row->route,
                                    'template' => $group_id,
                                    'error' => $result['error'],
                                    'msg' => 'Ошибка при записи в биллинг'
                                ];
                            }
                        } else {
                            $resp = [
                                'name' => $eq_row->route,
                                'template' => $group_id,
                                'error' => $error,
                                'msg' => $msg
                            ];
                        }
                        if ($resp['error'] != 0) $has_error++;
                        $job_model->log($resp['name'], $resp['error'], $resp['msg'], $num);
                    }
                }
                if (!$job_model->stopped()) {
                    $job_model->complete();
                }
                if (($job_model->send_report == 1 && $has_error != 0) || $job_model->send_report == 2) {
                    $owner = $this->user->getUserInfo();
                    if ($owner && $owner['email'] != '') {
                        $job_model->sendReport($owner['email']);
                    }
                }
                $this->user->closeConnection();
            } catch (\Exception $e) {
                $job_model->fail();
                Log::debug($e);
            }
        }
    }
}
