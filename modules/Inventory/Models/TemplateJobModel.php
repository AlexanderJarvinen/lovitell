<?php

namespace Modules\Inventory\Models;

use DB;
use Log;
use Excel;
use Mail;
use Illuminate\Database\Eloquent\Model;
use Modules\Inventory\Models\JobTrait;

/**
 * Model class for table {{user_widgets}}
 *
 * @parameter
 * @parameter
 *
 * @parent
 * @package App\Models
 */
class TemplateJobModel extends Model
{
    use JobTrait;

    protected $table = 'inventory_change_template';
    protected $log_table = 'inventory_change_template_log';

    /**
     * @param $uid
     * @param $address_id,
     * @param $system,
     * @param $template,
     * @return mixed
     */
    public function  initJob($uid, $address_id, $system, $template, $desk, $total, $send_report=0) {
        $this->uid=$uid;
        $this->address_id=$address_id;
        $this->system=$system;
        $this->template=$template;
        $this->desk=$desk;
        $this->state=self::$STATE['IDLE'];
        $this->send_report = $send_report;
        $this->total=$total;
        $this->save();
        return $this->id;
    }

    public static function getUserJobs($address_id, $uid=0) {
        if ($address_id) {
            $template = self::where('address_id', $address_id);
            if ($uid != 0) {
                return $template->where('uid', $uid);
            }
            return $template->get();
        }  else {
            return self::get();
        }
    }

    public static function getJobDetails($job_id, $uid, $array=false) {
        if ($array) {
            $result = DB::table('inventory_change_template_log')
                ->where('job_id', $job_id)
                ->get();
            foreach($result as $key=>$row) {
                $result[$key] = (array) $row;
            }
            return $result;
        } else {
            return DB::table('inventory_change_template_log')
                ->where('job_id', $job_id)
                ->get();
        }
    }

    public static function getJobLog($job_id, $start_date) {
        date_default_timezone_set('Europe/Moscow');
        return DB::table('inventory_change_template_log')
            ->where('job_id', $job_id)
            ->where('accessed_at', '>=', date('Y-m-d H:i:s', $start_date))
            ->get();
    }

    public function sendReport($email) {
        $details = TemplateJobModel::getJobDetails($this->id, $this->uid, true);
        Log::debug($details);
        $report = Excel::create('change_template', function($excel) use($details) {
            $excel->sheet('Result', function($sheet) use($details) {
                $sheet->fromArray($details);
            });
        })->string('xlsx');
        Log::debug("Send report to $email");
        try {
        Mail::send('modules.inventory.mail.report', ['address_id' => $this->address_id, 'desc' => $this->desk], function ($message) use ($report, $email) {
            $message->from('noreplay@lovit.ru', 'crm.tut.net');

            $message->to($email)->subject('Отчет о конфигурировании ТД');

            $message->attachData($report, 'change_tempalte.xlsx');
        });
        } catch (\Exception $e) {
            Log::debug('Непредвиденная ошибка');
            Log::debug($e->getMessage());
        }
    }
}
