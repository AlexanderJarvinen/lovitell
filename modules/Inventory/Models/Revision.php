<?php

namespace Modules\Inventory\Models;

use Log;
use DB;
use Excel;
use App\Components\Helper;

class Revision {
    public function loadFile($file) {
        $p = Excel::load($file, function($reader) {
        })->get();
        $r = DB::connection('sqlsrv')->select("exec bill..inventory_transamit 1");
        $resp['need_location'] = false;
        $result = [];
        foreach($p as $i=>$row) {
            $res_row = [];
            if (intval($row['address_id']) == 0) {
                foreach($row as $k=>$cell) { //Переписываем значение всех ячееек в таблицу-результат
                    if ($k) $res_row[$k] = $cell;
                }
                $res_row['error'] = -1;
                $res_row['msg'] = 'Wrong format or empty address_id';
                $result[] = $res_row;
                continue;
            }
            $params=[
                'address_id' => $row['address_id'],
                'entrance' => $row['entrance'],
                'floor' => $row['floor'],
                'model' => $row['model'],
                'mac' => Helper::checkCyr($row['mac']),
                'type' => $row['type'],
                'route' => Helper::checkCyr($row['name']),
                'route_iface' => $row['name_iface'],
                'source' => Helper::checkCyr($row['parent']),
                'source_iface' => $row['parent_iface'],
                'ip_addr' => $row['ip_address']
            ];
            $r = DB::connection('sqlsrv')->select("exec bill..inventory_transamit 2, :address_id, :entrance, :floor, :model, :mac, :type, :route, :route_iface, :source, :source_iface, :ip_addr", $params);
            foreach($row as $k=>$cell) {
                if ($k) $res_row[$k] = $cell;
            }
            $res_row['error'] = $r[0]->error;
            $res_row['msg'] = $r[0]->msg;
            $result[] = $res_row;
        }
        $resp['data'] = $result;
        return $resp;
    }
}
