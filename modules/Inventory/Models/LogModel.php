<?php

namespace Modules\Inventory\Models;

use App\Components\Helper;
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
class LogModel
{

    public static $STATE=[
        'IDLE'=>'IDLE',
        'INPROGRESS'=>'INPROGRESS',
        'COMPLETE'=>'COMPLETE',
        'FAIL'=>'FAIL',
        'STOPPED'=>'STOPPED'
    ];

    public static $PROGRAM = [
        'INVENTORY' => 1
    ];

    public static $LOGTYPE=[
        'CHANGE_FIRMWARE' => 1
    ];

    /**
     * Get Log's programs descriptions
     *
     * @return array - Job id identifier
     */
    public function getLogProgramDescr() {
        try {
            $r = DB::connection('sqlsrv')->select("exec bill..programm_type_log_desk_get 1");
        } catch (\PDOException $e) {
            Log::debug('getLogDescription EXCEPTION');
            return [];
        }
        $resp = [];
        foreach($r as $program_row) {
            $resp[] = [
                'program_id' => $program_row->programm_id,
                'descr' => Helper::cyr($program_row->programm_desk)
            ];
        }
        return $resp;
    }

    /**
     * Get Log's actions descriptions
     *
     * @return array
     *
     */

    public function getLogActionDescr() {
        try {
            $r = DB::connection('sqlsrv')->select("exec bill..programm_type_log_desk_get 2");
        } catch (\PDOException $e) {
            Log::debug('getLogDescription EXCEPTION');
            return [];
        }
        $resp = [];
        foreach($r as $program_row) {
            $resp[] = [
                'type' => $program_row->type,
                'descr' => Helper::cyr($program_row->desk)
            ];
        }
        return $resp;
    }

    public function addLogActionDescr($action_descr) {
        try {
            $r = DB::connection('sqlsrv')->select("exec bill..programm_type_log_desk_set 1, ?", [Helper::cyr1251($action_descr)]);
        } catch (\PDOException $e) {
            Log::debug("addLogActionDescr EXCEPTION. Descr: $action_descr");
            return [
                'error' => -1,
                'msg' => "addLogActionDescr EXCEPTION. Descr: $action_descr"
            ];
        }
        return [
            'error' => $r[0]->error,
            'msg' => $r[0]->msg
        ];
    }

    /**
     * Set Log action description
     *
     * @param $type string - type of action
     * @param $action_descr string - description of actions
     *
     * @return array
     */
    public function setLogActionDescr($type, $action_descr) {
        try {
            $r = DB::connection('sqlsrv')->select("exec bill..programm_type_log_desk_set 2, ?, ?", [Helper::cyr1251($action_descr), $type]);
        } catch (\PDOException $e) {
            Log::debug("setLogActionDescr EXCEPTION. Type: $type,  Descr: $action_descr");
            return [
                'error' => -1,
                'msg' => "setLogActionDescr EXCEPTION. Type: $type,  Descr: $action_descr"
            ];
        }
        return [
            'error' => $r[0]->error,
            'msg' => $r[0]->msg
        ];
    }

    /**
     * Add log row
     *
     * @param $action_type integer - type of actions of log
     * @param $route string - name of device
     * @param $note string - log row content
     * @param $error integer -  error code
     *
     * @return object ['error' - error code (0 if OK), 'msg' - error msg ('OK' if OK ^) )]
     */

    public function addLog($action_type, $route, $note, $error) {
        try {
            $r = DB::connection('sqlsrv')->select("exec bill..log_set 1, ?, ?, ?, ?, ?", [$action_type, $route, Helper::cyr1251($note), $error, self::$PROGRAM['INVENTORY']]);
        } catch(\PDOException $e) {
            Log::error("addLog EXCEPTION. Type: $action_type, route: $route, note: $note, error: $error");
            Log::debug($e->getMessage());
            return [
                'error' => -1,
                'msg' => "addLog EXCEPTION. Type: $action_type, route: $route, note: $note, error: $error"
            ];
        }
        return [
            'error' => $r[0]->error,
            'msg' => isset($r[0]->msg)?$r[0]->msg:'OK'
        ];
    }
}
