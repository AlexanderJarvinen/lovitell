<?php

namespace Modules\Inventory\Models;

use DB;
use Log;
use Illuminate\Database\Eloquent\Model;

/**
 * Model class for table {{user_widgets}}
 *
 * @parameter
 * @parameter
 *
 * @parent
 * @package App\Models
 */
class InventoryJobModel
{
    public static $STATE=[
        'IDLE' => 'IDLE',
        'INPROGRESS' => 'INPROGRESS',
        'COMPLETE' => 'COMPLETE',
        'FAIL' => 'FAIL',
        'STOPPED' => 'STOPPED'
    ];

    public static $JOB_MODELS=[
        ['type' => 'template', 'class' => '\Modules\Inventory\Models\TemplateJobModel'],
        ['type' => 'firmware', 'class' => '\Modules\Inventory\Models\FirmwareJobModel'],
    ];

    public function log($route, $error, $msg, $number=0) {
        Log::debug("Log error $route $error $msg");
        DB::table($this->log_table)->insert([
            'job_id' => $this->id,
            'accessed_at' => DB::raw('now()'),
            'route' => $route,
            'error' => $error,
            'msg' => $msg,
            'number' => $number
        ]);
    }

    public static function jobOrderFunction($job1, $job2) {
        if ($job1->updated_at == $job2->updated_at) return 0;
        return strcmp($job1->updated_at, $job2->updated_at);
    }

    public static function getUserJobs($address_id, $uid=0) {
        $jobs = [];
        foreach(self::$JOB_MODELS as $job_model_class) {
            $jclass = $job_model_class['class'];
            $model_jobs = $jclass::getUserJobs($address_id, $uid);
            foreach($model_jobs as $job) {
                $jobs[] = $job;
            }
        }
        return $jobs;
    }

    public static function getJobs($filters){
        $jobs = [];
        foreach(self::$JOB_MODELS as $job_model_class) {
            $jclass = $job_model_class['class'];
            $jtype = $job_model_class['type'];
            if (array_search($jtype, $filters['types']) !== false) {
                $model_jobs = $jclass::getJobs($filters);
                foreach($model_jobs as $job) {
                    $jobs[] = $job;
                }
            }
        }
        return $jobs;
    }

    public static function getJobDetails($job_id, $uid, $array=false) {
        if ($array) {
            $result = DB::table('inventory_change_firmware_log')
                ->where('job_id', $job_id)
                ->get();
            foreach($result as $key=>$row) {
                $result[$key] = (array) $row;
            }
            return $result;
        } else {
            return DB::table('inventory_change_firmware_log')
                ->where('job_id', $job_id)
                ->get();
        }
    }

    public static function getJobLog($job_id, $start_date) {
        date_default_timezone_set('Europe/Moscow');
        return DB::table('inventory_change_firmware_log')
            ->where('job_id', $job_id)
            ->where('accessed_at', '>=', date('Y-m-d H:i:s', $start_date))
            ->get();
    }
}
