<?php

namespace Modules\Inventory\Models;

use DB;
use Log;
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
class FirmwareJobModel extends Model
{
    use JobTrait;
    protected $table = 'inventory_change_firmware';
    protected $log_table = 'inventory_change_firmware_log';

    /**
     * Initial job
     *
     * @param $uid - Initial job user identifier
     * @param $firmware - name of firmware
     * @param $firmware_path - path to firmware file
     * @param $descr - description of job
     * @param $total - total devices for firmware changing
     *
     * @return $id - Job id identifier
     */
    public function initJob($uid, $firmware, $firmware_path, $desk, $total) {
        $this->uid = $uid;
        $this->firmware = $firmware;
        $this->firmware_path = $firmware_path;
        $this->desk = $desk;
        $this->state = self::$STATE['IDLE'];
        $this->total = $total;
        $this->save();
        return $this->id;
    }

}
