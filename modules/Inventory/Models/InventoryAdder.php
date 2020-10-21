<?php

namespace Modules\Inventory\Models;

use \Log;
use \DB;
use Illuminate\Database\Eloquent\Model;
use Excel;
use App\Components\Helper;

class InventoryAdder extends Model
{
    protected $table='inventory_add_equipment_tmp';

    public static function loadFile($file, $user_id, $need_location=false, $address_id=null) {
        $p = Excel::load($file, function($reader) {
            $reader->formatDates(false);
            $reader->toArray();
        })->get();
        $r = DB::connection('sqlsrv')->select("exec bill..inventory_transamit 1");
        $session_id = $r[0]->id;
        Log::debug("exec bill..inventory_transamit 1");
        Log::debug("Session ID:".$r[0]->id);
        $resp['need_location'] = false;
        $resp['need_linktype'] = false;
        $adding_id = self::getAddingId();
        $model = new Equipment();
        $inventory = new Inventory();
        $systems = $model->getEquipmentSystem();
        $resp['adding_id'] = $adding_id;
        $resp['error'] = 0;
        $resp['count'] = 0;
        $resp['system_group'] = 0;
        $resp['cyr'] = false;
        $models = [];
        $result = [];
        $insert = [];
        foreach($p as $list) {
            foreach ($list as $i => $row) {
                $res_row = [];
                if (empty($row['address_id']) || intval($row['address_id']) == 0) {
                    foreach ($row as $k => $cell) { //Переписываем значение всех ячееек в таблицу-результат
                        if ($k) $res_row[$k] = $cell;
                    }
                    $res_row['error'] = -1;
                    $res_row['msg'] = 'Wrong format or empty address_id';
                    $result[] = $res_row;
                    continue;
                } elseif($address_id && $row['address_id'] != $address_id) {
                    foreach ($row as $k => $cell) { //Переписываем значение всех ячееек в таблицу-результат
                        if ($k) $res_row[$k] = $cell;
                    }
                    $res_row['error'] = -1;
                    $res_row['msg'] = 'address_id в файле не соответствует идентификатору дома, с которого производится добавление';
                    $result[] = $res_row;
                    continue;
                }
                $resp['count']++;
                if (Helper::checkCyr($row['mac'], false) ||
                    Helper::checkCyr($row['type'], false) ||
                    Helper::checkCyr($row['name'], false) ||
                    Helper::checkCyr($row['parent'], false)
                ) {
                    $resp['cyr'] = true;
                }
                $params = [
                    'address_id' => $row['address_id'],
                    'entrance' => $row['entrance'],
                    'floor' => $row['floor'],
                    'model' => $row['model'],
                    'mac' => Helper::strToMac(Helper::checkCyr($row['mac'])),
                    'type' => Helper::checkCyr($row['type']),
                    'name' => Helper::checkCyr($row['name']),
                    'name_iface' => $row['name_iface'],
                    'parent' => Helper::checkCyr($row['parent']),
                    'parent_iface' => $row['parent_iface'],
                    'ip_addr' => $row['ip_address']
                ];
                $system=null;
                $system_group=0;
                $system_group_model=0;
                if ($row['type']) {
                    foreach ($systems as $k => $sys_row) {
                        if ($sys_row->desk == trim($row['type'])) {
                            $system = $sys_row->system;
                            $system_group = $sys_row->type_mgmt;
                            $system_group_model = $sys_row->type;
                            if (!isset($models[$system_group_model])) {
                                $models[$system_group_model] = $inventory->getModels($system_group_model);
                            }
                            break;
                        }
                    }
                    if ($system_group) {
                        if (!$resp['system_group']) {
                            $resp['system_group'] = $system_group;
                        } else {
                            if ($resp['system_group'] != $system_group) {
                                $resp['system_group'] = -1;
                            }
                        }
                    }
                }
                $link_type = isset($row['link_type']) ? $row['link_type'] : '';
                if (!is_numeric($link_type)) {
                    $link_type_id = $inventory->getLinkTypeIdByPrefix($link_type);
                } else {
                    $link_type = '';
                    $link_type_id = $link_type;
                }
                $vlan_id = 0;
                if (isset($row['vlan_id'])) {
                    $vlan_id = $row['vlan_id'];
                } else if (isset($row['vid'])) {
                    $vlan_id = $inventory->getVlanIdByVid($row['vid']);
                }
                $params = array_merge($params, [
                    'vlan_id' => $vlan_id,
                    'location_id' => isset($row['location_id']) ? $row['location_id'] : 0
                ]);
                $resp['need_location'] = $resp['need_location'] || !($params['location_id'] && $params['vlan_id']);
                foreach ($row as $k => $cell) {
                    if ($k) $res_row[$k] = $cell;
                }
//                $r = DB::connection('sqlsrv')->select("exec bill..inventory_transamit 4");
  //              Log::debug($r);
                Log::debug("exec bill..inventory_transamit 2, :session_ :address_id, :entrance, :floor, :model, :mac, :type, :name, :name_iface, :parent, :parent_iface, :ip_addr, :location_id, :vlan_id");
                $r = DB::connection('sqlsrv')->select("exec bill..inventory_transamit 2, :session_id, :address_id, :entrance, :floor, :model, :mac, :type, :name, :name_iface, :parent, :parent_iface, :ip_addr, :location_id, :vlan_id", array_merge($params, ['session_id'=>$session_id]));
                Log::debug($r);
                $params['vid'] = isset($row['vid'])?$row['vid']:'';
                if (isset($r[0])) {
                    $resp['error'] = $r[0]->error != 0 ? 1 : $resp['error'];
                    $res_row['error'] = $r[0]->error;
                    $res_row['msg'] = Helper::cyr($r[0]->msg);
                } else {
                    $res_row['error'] = 0;
                    $res_row['msg'] = '';
                }
                $params['model_id'] = 0;
                if (isset($models[$system_group_model]) && is_array($models[$system_group_model])) {
                    foreach($models[$system_group_model] as $model_row) {
                        if (stripslashes($model_row['desk']) == stripslashes(trim(Helper::checkCyr($row['model'])))) {
                            $params['model_id'] = $model_row['id'];
                            break;
                        }
                    }
                }
                $params['link_type'] = $link_type_id;
                $params['link_type_prefix'] = $link_type;
                $resp['need_linktype'] = $resp['need_linktype'] || !$params['link_type'];
                $insert[] = array_merge([
                    'uid' => $user_id,
                    'adding_id' => $adding_id,
                    'system_id' => $system?$system:-99999,
                    'error' => $res_row['error'],
                    'msg' => $res_row['msg']
                ], $params);
                $result[] = $res_row;
            }
        }
        self::insert($insert);
        $resp['data'] = $result;
        return $resp;
    }

    public static function getAddingId() {
        return self::max('adding_id') + 1;
    }

    public function saveResult($result) {
        Log::debug('Save result');
        Log::debug($result);
        if (isset($result['data'])) {
            $this->name = empty($result['data']['route']) ? 0 : $result['data']['route'];
            $this->address_id = empty($result['data']['address_id']) ? 0 : $result['data']['address_id'];
            $this->street = empty($result['data']['street_desk']) ? '' : $result['data']['street_desk'];
            $this->house = empty($result['data']['house']) ? '' : $result['data']['house'];
            $this->body = empty($result['data']['body']) ? '' : $result['data']['body'];
            $this->entrance = empty($result['data']['entrance']) ? 0 : $result['data']['entrance'];
            $this->floor = empty($result['data']['floor']) ? 0 : $result['data']['floor'];
            $this->model = empty($result['data']['model_desk']) ? '' : $result['data']['model_desk'];
            $this->model_id = empty($result['data']['model_id']) ? '' : $result['data']['model_id'];
            $this->mac = empty($result['data']['mac']) ? '' : $result['data']['mac'];
            $this->type = empty($result['data']['system_desk']) ? '' : $result['data']['system_desk'];
            $this->system_id = empty($result['data']['system_id']) ? '' : $result['data']['system_id'];
            $this->parent = empty($result['data']['source']) ? '' : $result['data']['source'];
            $this->parent_iface = empty($result['data']['source_iface']) ? '' : $result['data']['source_iface'];
            $this->name_iface = empty($result['data']['target_iface']) ? '' : $result['data']['target_iface'];
            $this->ip_addr = empty($result['data']['ip_addr']) ? '' : $result['data']['ip_addr'];
            $this->link_type = empty($result['data']['link_type_id']) ? '' : $result['data']['link_type_id'];
            $this->link_type_prefix = empty($result['data']['link_type_prefix']) ? '' : $result['data']['link_type_prefix'];
            $this->vlan_id = empty($result['data']['vlan_id']) ? '' : $result['data']['vlan_id'];
            $this->vid = empty($result['data']['vid']) ? '' : $result['data']['vid'];
        }
        $this->error = empty($result['error'])?0:$result['error'];
        $this->msg = empty($result['msg'])?0:$result['msg'];
        $this->save();
    }

    public static function getAddingRevision($adding_id) {
        $data = self::where('adding_id', $adding_id)->get();
        $resp = [];
        foreach($data as $equipment) {
            $resp[] = [
                'address_id' => $equipment->address_id,
                'street' => $equipment->street,
                'house' => $equipment->house,
                'body' => $equipment->body,
                'entrance' => $equipment->entrance,
                'floor' => $equipment->floor,
                'model' => $equipment->model,
                'mac' => $equipment->mac,
                'type' => $equipment->type,
                'name' => $equipment->name,
                'name_iface' => $equipment->name_iface,
                'parent' => $equipment->parent,
                'parent_iface' => $equipment->parent_iface,
                'ip_address' => $equipment->ip_addr,
                'link_type' => $equipment->link_type_prefix?$equipment->link_type_prefix:$equipment->link_type,
                'vid' => $equipment->vid,
                'location_id' => $equipment->location_id,
                'error' => $equipment->error,
                'msg' => $equipment->msg,
            ];
        }
        return $resp;
    }

    public static function fillEmptyParams($adding_id, $uid, $params) {
        self::where('adding_id', $adding_id)
            ->where('uid', $uid)
            ->update($params);
    }

    public static function checkAddedEquipment($adding_id, $uid, $commit) {
        $resp = [
            'error' => 0,
            'commit' => $commit,
            'error_list' => []
        ];
        $saved_equipment = self::where('adding_id', $adding_id)->where('uid', $uid)->get();
        if (count($saved_equipment)>0) {
            $model = new Equipment();
            foreach ($saved_equipment as $k=>$equipment) {
                $params = [
                    'address_id' => $equipment->address_id,
                    'entrance' => $equipment->entrance,
                    'floor' => $equipment->floor,
                    'model_id' => $equipment->model_id,
                    'mac' => $equipment->mac,
                    'system_id' => $equipment->system_id,
                    'desk_note' => '',
                    'addr_note' => '',
                    'route' => $equipment->name,
                    'route_iface' => $equipment->name_iface,
                    'source' => $equipment->parent,
                    'source_iface' => $equipment->parent_iface,
                    'link_type' => $equipment->link_type,
                    'ip_addr' => $equipment->ip_addr,
                    'vlan_id' => $equipment->vlan_id,
                    'location_id' => $equipment->location_id,
                    'apartment' => '',
                    'situation_id' => 3,
                    'ignore_error' => 0
                ];
                $result = $model->addEquipment($params, $commit);
                $equipment->saveResult($result);
                $result['is_critical'] = self::isCritical($result['error']);
                if ($result['error']) {
                    $resp['error']++;
                    $resp['error_list'][] = array_merge(['name'=>$equipment->name],   $result);
                    if ($result['error'] == -1) {
                        break;
                    }
                }
                usleep(500);
            }
        }
        return $resp;
    }

    public static function saveAddedEquipment($adding_id, $uid, $commit, $ignore_list=[]) {
        $resp = [
            'error' => 0,
            'commit' => $commit,
            'error_list' => []
        ];
        $saved_equipment = self::where('adding_id', $adding_id)->where('uid', $uid)->get();
        if (count($saved_equipment)>0) {
            $model = new Equipment();
            foreach ($saved_equipment as $equipment) {
                $ignore = 0;
                if ($equipment->error != 0) {
                    if (array_search($equipment->name, $ignore_list) !== false) {
                        $ignore = 1;
                    } else {
                        continue;
                    };
                }
                $params = [
                    'address_id' => $equipment->address_id,
                    'entrance' => $equipment->entrance,
                    'floor' => $equipment->floor,
                    'model_id' => $equipment->model_id,
                    'mac' => $equipment->mac,
                    'system_id' => $equipment->system_id,
                    'desk_note' => '',
                    'addr_note' => '',
                    'route' => $equipment->name,
                    'route_iface' => $equipment->name_iface,
                    'source' => $equipment->parent,
                    'source_iface' => $equipment->parent_iface,
                    'link_type' => $equipment->link_type,
                    'ip_addr' => $equipment->ip_addr,
                    'vlan_id' => $equipment->vlan_id,
                    'location_id' => $equipment->location_id,
                    'apartment' => '',
                    'situation_id' => 3,
                    'ignore_error' => $ignore
                ];
                $result = $model->addEquipment($params, 1);
                $result['is_critical'] = self::isCritical($result['error']);
                $equipment->saveResult($result);
                if ($result['error']) {
                    $resp['error']++;
                    $resp['error_list'][] = array_merge(['route'=>$equipment->name],   $result);
                    if ($result['error'] == -1) {
                        break;
                    }
                }
                usleep(500);
            }
        }
        return $resp;
    }

    public static function isCritical($error_code) {
        if ($error_code != 0) {
            if ($error_code == 32) {
                return 0;
            } else {
                return 1;
            }
        } else {
            return 0;
        }
    }
}
