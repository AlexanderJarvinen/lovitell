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
trait JobTrait
{
    public static $STATE=[
        'IDLE'=>'IDLE',
        'INPROGRESS'=>'INPROGRESS',
        'COMPLETE'=>'COMPLETE',
        'FAIL'=>'FAIL',
        'STOPPED'=>'STOPPED'
    ];

    public function getLogTable() {
        return $this->log_table;
    }

    /**
     * @param $uid
     * @param $address_id,
     * @param $system,
     * @param $template,
     * @return mixed
     */
    public function  initJob($uid, $address_id, $system, $template, $desk, $total) {
        $this->uid=$uid;
        $this->desk=$desk;
        $this->state=self::$STATE['IDLE'];
        $this->save();
        return $this->id;
    }

    public function start() {
        $this->started_at=DB::raw('now()');
        $this->state=self::$STATE['INPROGRESS'];
        $this->save();
    }

    public function fail() {
        $this->stopped_at=DB::raw('now()');
        $this->state=self::$STATE['FAIL'];
        $this->save();
    }

    public function stop() {
        $this->stopped_at=DB::raw('now()');
        $this->state=self::$STATE['STOPPED'];
        $this->save();
    }

    public function stopped() {
        return $this->state==self::$STATE['STOPPED'];
    }

    public function complete() {
        $this->stopped_at=DB::raw('now()');
        $this->state=self::$STATE['COMPLETE'];
        $this->save();
    }

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

    public static function getJobs($filters) {
        $table = ((new self)->getTable());
        $log_table = ((new self)->getLogTable());
        $template = DB::table($table);
        if (isset($filters['address_id']) && $filters['address_id']) {
            $template->where($table.'.address_id', $filters['address_id']);
        }
        if (isset($filters['uid'])) {
            $template->where($table.'.uid', $filters['uid']);
        }
        if (isset($filters['states'])) {
            $template->whereIn($table.'.state', $filters['states']);
        }
        if (isset($filters['dates'])) {
            if (isset($filters['dates']['start'])) {
                $filters['dates']['start'] = date('Y-m-d', strtotime($filters['dates']['start']));
                $template->where('created_at', '>=', $filters['dates']['start']);
            }
            if (isset($filters['dates']['end'])) {
                $filters['dates']['end'] = date('Y-m-d', strtotime($filters['dates']['end'])+86400);
                $template->where('created_at', '<=', $filters['dates']['end']);
            }
        }
        if (isset($filters['routes'])) {
            if (is_array($filters['routes']) && count($filters['routes'])>0) {
                $template->join($log_table, $table.'.id', '=', $log_table.'.job_id')
                    ->whereIn($log_table.'.route', [$filters['routes']]);
            }
        }
        $jobs = $template->get();
        return $jobs;
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
        $log_table = ((new self)->getLogTable());
        if ($array) {
            $result = DB::table($log_table)
                ->where('job_id', $job_id)
                ->get();
            foreach($result as $key=>$row) {
                $result[$key] = (array) $row;
            }
            return $result;
        } else {
            return DB::table($log_table)
                ->where('job_id', $job_id)
                ->get();
        }
    }

    public static function getJobLog($job_id, $start_date) {
        date_default_timezone_set('Europe/Moscow');
        return DB::table($log_table = ((new self)->getLogTable()))
            ->where('job_id', $job_id)
            ->where('accessed_at', '>=', date('Y-m-d H:i:s', $start_date))
            ->get();
    }

    public function saveRoutes($routes) {
        $query_list = [];
        foreach($routes as $route) {
            $query_list[] = [
                'job_id' => $this->id,
                'accessed_at' => DB::RAW('NOW()'),
                'route' => $route,
            ];
        };
        if (count($query_list)>0) {
            DB::table((new self)->getLogTable())
                ->insert($query_list);
        } else {
            LOG::DEBUG('Rout list is empty');
        }
    }

    public function getRoutes() {
        $resp = [];
        if ($this->id) {
            $data = DB::table((new self)->getLogTable())
                ->where('job_id', $this->id)
                ->get();
        }
        foreach($data as $row) {
            $resp[] = $row->route;
        }
        return $resp;
    }
}
