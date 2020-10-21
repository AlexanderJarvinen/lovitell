<?php

namespace Modules\Inventory\Jobs;

use App\Jobs\Job;
use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;
use Modules\Inventory\Models\Equipment;
use Modules\Inventory\Models\FirmwareJobModel;
use Modules\Inventory\Models\Inventory;
use Modules\Inventory\Models\LogModel;
use Log;
use App\Components\Helper;
use Modules\Inventory\Components\APSetup\APSetup;
use Modules\Inventory\Models\TemplateJobModel;

class ChangeFirmwareJob extends Job implements ShouldQueue
{
    use InteractsWithQueue, SerializesModels;

    public $user;
    public $id;
    public $routes;
    public $firmware_path;
    public $firmware;

    /**
     * Create a new job instance.
     *
     * @param $routes array List of devices for firmware changing
     * @param $user \App\User User, which initial job
     * @param $firmware string firmware file name
     * @param $firmware_path string Absolute path for firmware file
     * @param $desk string Job description
     *
     */

    public function __construct($routes, $user, $firmware, $firmware_path, $desk)
    {
        $this->user = $user;
        $this->routes = $routes;
        $this->firmware = $firmware;
        $this->firmware_path = $firmware_path;
        $job_model = new FirmwareJobModel();
        $total = count($routes);
        $this->id = $job_model->initJob($user->id, $firmware, $firmware_path, $desk, $total);
        $job_model->saveRoutes($routes);
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        $job_model = FirmwareJobModel::find($this->id);
        if ($this->attempts() > 1) {
            $this->delete();
            $job_model->fail();
        } else {
            Log::debug("start ChangeFirmwareJob $this->id. $job_model->descr");
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
                $log_model = new LogModel();
                $routes = $job_model->getRoutes();
                Log::debug($routes);
                $firmware = $this->firmware;
                $firmware_path = $this->firmware_path;
                $resp = [];
                $num = 0;
                $error = 0;
                Log::debug('JOB State:'.$job_model->state);
                foreach($routes as $route) {
                    $job_model = $job_model->fresh();
                    if ($job_model->stopped()) {
                        $job_model->log($resp['name'], 0, 'STOPPED', $num);
                        continue;
                    }
                    $error = 1;
                    $num++;
                    $msg = '';
                    $route_info = $eq_model->getEquipmentByName($route);
                    Log::debug($route_info);
                    if (Helper::pingAddress($route_info['ip_addr'])) {
                        Log::debug($route_info['ip_addr'] . ' Ping OK');
                        $ap_info = APSetup::getAPInfo($route_info['ip_addr'], $route_info['login'], $route_info['pwd']);
                        if (!$ap_info) {
                            Log::error('Can`t get AP info');
                            $resp = [
                                'name' => $route_info['route'],
                                'firmware' => $firmware,
                                'error' => -3,
                                'msg' => 'Не удалось получить версию прошивки AP'
                            ];
                            $log_model->addLog(LogModel::$LOGTYPE['CHANGE_FIRMWARE'], $resp['name'], $resp['msg'], $resp['error']);
                            $job_model->log($resp['name'], $resp['error'], $resp['msg'], $num);
                            continue;
                        }
                    } else {
                        Log::debug($route_info['ip_addr'] . ' Ping error');
                        $resp = [
                            'name' => $route_info['route'],
                            'firmware' => $firmware,
                            'error' => -3,
                            'msg' => 'Устройство недоступно'
                        ];
                        $log_model->addLog(LogModel::$LOGTYPE['CHANGE_FIRMWARE'], $resp['name'], $resp['msg'], $resp['error']);
                        $job_model->log($resp['name'], $resp['error'], $resp['msg'], $num);
                        continue;
                    }
                    $firmware_result = APSetup::changeFirmware($route_info['ip_addr'], $firmware_path, $route_info['model_desk'], $route_info['login'], $route_info['pwd']);
                    if ($firmware_result['error'] == 0) {
                        $result = $log_model->addLog(LogModel::$LOGTYPE['CHANGE_FIRMWARE'], $route_info['route'], 'OK', 0);
                        if ($result['error'] == 0) {
                            $resp = [
                                'name' => $route_info['route'],
                                'firmware' => $firmware,
                                'error' => 0,
                                'msg' => 'OK'
                            ];
                        } else {
                            $resp = [
                                'name' => $route_info['route'],
                                'firmware' => $firmware,
                                'error' => $result['error'],
                                'msg' => 'Ошибка при записи в биллинг'
                            ];
                        }
                    } else {
                        $resp = [
                            'name' => $route_info['route'],
                            'firmware' => $firmware,
                            'error' => $firmware_result['error'],
                            'msg' => $firmware_result['msg']
                        ];
                        $log_model->addLog(LogModel::$LOGTYPE['CHANGE_FIRMWARE'], $resp['name'], $resp['error'], $resp['msg']);
                    }

                    $job_model->log($resp['name'], $resp['error'], $resp['msg'], $num);
                }
                $this->user->closeConnection();
                if (!$job_model->stopped()) {
                    $job_model->complete();
                }
            } catch (\Exception $e) {
                $job_model->fail();
                Log::debug($e);
            }
        }
    }
}
