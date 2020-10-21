<?php

namespace Modules\Inventory\Models;

use App\Components\Helper;
use App\Models\Brand;
use PhpParser\Error;
use DB;
use Log;
use Excel;
use Modules\Inventory\Jobs\ChangeTemplateJob;
use Auth;

class Equipment
{
	public static $params = [
		'name' => 'Имя',
		'ip_address' => 'IP',
		'mac' => 'MAC',
		'model' => 'Модель',
		'address_id' => 'address_id',
		'body' => 'Корпус',
		'entrance' => 'Подъезд',
		'floor' => 'Этаж',
	//	'apartment' => 'Квартира',
		'type' => 'Тип устройства',
		'model' => 'Модель'
	];

	public function searchEquipment($params) {
		$r = DB::connection('sqlsrv')->select("exec pss..eqp_find 1, '', '".$params['name']."', '".$params['switch']."', '".$params['port']."', '".$params['mac']."','".$params['ip']."', ''");
		$result = array();
		foreach ($r as $row) {
			$data = array();
			$data[] = iconv('cp1251', 'utf8', $row->route);
			$data[] = iconv('cp1251', 'utf8', $row->ip_addr);
			$data[] = iconv('cp1251', 'utf8', $row->mac);
			$data[] = iconv('cp1251', 'utf8', $row->desk);
			$data[] = iconv('cp1251', 'utf8', $row->street);
			$data[] = iconv('cp1251', 'utf8', $row->house) . (($row->body != NULL) ? ' корп. ' . iconv('cp1251', 'utf8', $row->body) : '');
			$data[] = iconv('cp1251', 'utf8', $row->address_id);
			$data[] = iconv('cp1251', 'utf8', $row->system);
			$data[] = iconv('cp1251', 'utf8', $row->state);
			$data[] = iconv('cp1251', 'utf8', $row->entrance);
			$data[] = iconv('cp1251', 'utf8', $row->floor);
			$result['data'][] = $data;
		}
		return $result;
	}

	public function searchEquipmentByStreet($street) {
		$params['street'] = iconv('utf8', 'cp1251', $street);
		$r_s = DB::connection('sqlsrv')->select("exec pss..eqp_find 2,'".$params['street']."'");
		$result = [];
		foreach($r_s as $street) {
			$r = DB::connection('sqlsrv')->select("exec pss..eqp_find 0, 0, ".$street->street_id);
			foreach ($r as $row) {
				$data = array();
				$data[] = iconv('cp1251', 'utf8', $row->route);
				$data[] = iconv('cp1251', 'utf8', $row->ip_addr);
				$data[] = iconv('cp1251', 'utf8', $row->mac);
				$data[] = iconv('cp1251', 'utf8', $row->desk);
				$data[] = iconv('cp1251', 'utf8', $row->street);
				$data[] = iconv('cp1251', 'utf8', $row->house) . (($row->body != NULL) ? ' корп. ' . iconv('cp1251', 'utf8', $row->body) : '');
				$data[] = iconv('cp1251', 'utf8', $row->address_id);
				$data[] = iconv('cp1251', 'utf8', $row->system);
				$data[] = iconv('cp1251', 'utf8', $row->state);
				$data[] = iconv('cp1251', 'utf8', $row->entrance);
				$data[] = iconv('cp1251', 'utf8', $row->floor);
				$result['data'][] = $data;
			}
		}
		return $result;
	}

	public function getRouteInfo($name) {
		$name = htmlspecialchars($name);
		$perm_model = new InventoryRights();
		$eq_model = new EquipmentRights();
		str_replace('‑', '-', $name);
		$r = DB::connection('sqlsrv')->select("exec pss..addres_get_info 5,'".$name."'");
		if (isset($r[0])) {
			$row = (array)$r[0];
			$row['name'] = $name;
			$row['init']=true;
			$row['group_desk'] = iconv('cp1251', 'utf8', $row['group_desk']);
			$row['model_desk'] = iconv('cp1251', 'utf8', $row['model_desk']);
			$row['address'] = iconv('cp1251', 'utf8', $row['region_desk']) . ", " . iconv('cp1251', 'utf8', $row['street']) . " " . $row['house'] . (($row['body'] != NULL) ? ' корп. ' . iconv('cp1251', 'utf8', $row['body']) : '');
			$row['situation_desk'] = iconv('cp1251', 'utf8', $row['situation_desk']);
			$row['mac_permissions'] = $perm_model->canChangeMac($row['system']);
			$row['address_id'] = $row['addres_id'];
			$row['configure_permissions'] = $eq_model->canResetRouteTemplate();
			$row['system_id'] = $row['system'];
		} else {
			$row['name'] = $name;
			$row['init'] = false;
		}
		return $row;
	}

	public function setMac($name, $mac, $system) {
		$mac = preg_replace("/[^a-fA-F0-9]/", '', $mac);
		$mac_array = str_split($mac, 2);
		$mac = strtoupper(implode(':', $mac_array));
		$system = intval($system);
		$res = DB::connection('sqlsrv')->select("exec bill..change_mac 2, ?, ?, 0", [$name, $mac]);
		$resp['error'] = $res[0]->error;
		if ($resp['error'] != 0) {
			$resp['msg'] = iconv('cp1251', 'utf8', $res[0]->msg);
		}
		return $resp;
	}

	public function getEquipmentSystem($system=0, $is_name=false) {
		$r = DB::connection('sqlsrv')->select("exec bill..route_group_get 0");
		foreach($r as $k=>$rr) {
			$r[$k]->desk = Helper::cyr($r[$k]->desk);
			$r[$k]->note = Helper::cyr($r[$k]->note);
			if ($system) {
				if (!$is_name && $r[$k]->system == $system) {
					return $r[$k];
				} else if ($is_name && Helper::cyr($r[$k]->desk) == $system ) {
					return $r[$k]->system;
				}
			}
		}
		return $r;
	}

	public function getSystemsMultiselect() {
		$r = DB::connection('sqlsrv')->select("exec bill..route_group_get 0");
		$resp=[];
		foreach($r as $k=>$rr) {
			$resp[] = ['value'=> $rr->system,
					   'label'=> iconv('cp1251', 'utf8', $r[$k]->desk),
					   'selected' =>true];
		}
		return $resp;
	}

	/**
	 * Return equipment list by search params
	 * @param $filter_params
	 * Request: inventory_get_list
	 * 1,
	 * :city,
	 * :region_id,
	 * :street_id,
	 * :system,
	 * :situation,
	 * :state,
	 * :source,
	 * :mac,
	 * :ip_addr,
	 * :model,
	 * :address_id,
	 * :route,
	 * :location,
	 * :desk,
	 * :order='route',
	 * :offset,
	 * :fetch,
	 * :house
	 * :system_desk,
	 * :situation_desk,
	 * :state_desk,
	 * :mac_route_ip_addr,
	 * :source_iface,
	 * :street_house_location,
	 * :entrance
	 * @param int $page
	 * @return array
	 */

	public function getEquipment($filter_params, $page=0) {
		$order = explode(' ', $filter_params['order']);
		if ($order[0] == 'build') {
			$filter_params['order'] = 'house '.$order[1];
		}
		Log::debug($filter_params);
		$r = DB::connection('sqlsrv')->select("exec bill..inventory_get_list 1, :cities, :regions, :street, :systems, :situations, :states, :source, :mac, :ip_addr, :model, :address_id, :name, :location, :desk, :order, :offset, :on_page, :build, :system_desk, :situation_desk, :state_desk, :params_search_string, :source_iface, :address_filter, :entrance, '', :is_monitoring", $filter_params);
		$resp = [];
		$resp['page'] = $page;
		$resp['total_rows'] = 0;
		$resp['data'] = [];
		$inventory_rights = new InventoryRights();
		$can_viewtemplatelog = $inventory_rights->canViewTemplateLog();
		foreach($r as $k=>$equipment_row) {
			$data = [];
			$data['id']=$k;
			$data['route'] = iconv('cp1251', 'utf8', $equipment_row->route);
			$data['ip_addr'] = iconv('cp1251', 'utf8', $equipment_row->ip_addr);
			$data['mac'] = $equipment_row->mac==null?'':$equipment_row->mac;
			$data['model_desk'] = Helper::cyr($equipment_row->model_desk);
			$data['model_id'] = $equipment_row->model_id;
			$data['state'] = $equipment_row->state;
			$data['system_desk'] = iconv('cp1251', 'utf8', $r[$k]->system_desk);
			$data['system_id'] = $r[$k]->system;
			$data['system_group'] = $r[$k]->system_group;
			$data['situation_id'] = iconv('cp1251', 'utf8', $r[$k]->situation_id);
			$data['situation_desk'] = iconv('cp1251', 'utf8', $r[$k]->situation_desk);
			$data['location_id'] = $r[$k]->location_id;
			$data['location_desk'] = iconv('cp1251', 'utf8', $r[$k]->location_desk);
			$data['city_desk'] = iconv('cp1251', 'utf8', $r[$k]->city_desk);
			$data['region_desk'] = iconv('cp1251', 'utf8', $r[$k]->region_desk);
			$data['street_desk'] = iconv('cp1251', 'utf8', $r[$k]->street_desk);
			$data['build'] = iconv('cp1251', 'utf8', $r[$k]->house) . (($r[$k]->body != NULL) ? ' корп. ' . iconv('cp1251', 'utf8', $r[$k]->body) : '');
			$data['source'] = $equipment_row->source==null?'':$equipment_row->source;
			$data['source_iface'] = $equipment_row->source_iface==null?'':$equipment_row->source_iface;
			$data['state_desk'] = $equipment_row->state_desk;
			$data['target_iface'] = $equipment_row->target_iface==null?'':iconv('cp1251', 'utf8',$equipment_row->target_iface);
			$data['city_id'] = $equipment_row->city_id;
			$data['region_id'] = $equipment_row->region_id;
			$data['street_id'] = $equipment_row->street_id;
			$data['address_id'] = intval($equipment_row->addres_id);
			$data['address'] = iconv('cp1251', 'utf8', $equipment_row->city_desk) . ", " . iconv('cp1251', 'utf8', $equipment_row->street_desk) . " " . iconv('cp1251', 'utf8', $equipment_row->house) . (($equipment_row->body != NULL)?' корп. '.iconv('cp1251', 'utf8', $equipment_row->body):'');
			$data['entrance'] = iconv('cp1251', 'utf8',$equipment_row->entrance);
			$data['floor'] = iconv('cp1251', 'utf8',$equipment_row->floor);
			$data['apartment'] = iconv('cp1251', 'utf8',$equipment_row->apartment);
			$data['desk'] = iconv('cp1251', 'utf8', $equipment_row->desk);
			$data['link_type'] = $equipment_row->link_type;
			$data['addition'] = str_replace('\\n', '<br>', $equipment_row->addition);
			$data['template_id'] = $equipment_row->template_id;
			$data['can_viewtemplatelog'] = $can_viewtemplatelog;
			$data['vlan_id'] = $equipment_row->vlan_id;
			$data['vlan_desk'] = Helper::cyr($equipment_row->vlan_desk);
			$data['last_tech'] = $equipment_row->last_tech;
			$data['wait_time'] = Helper::minToDHM($equipment_row->wait_time);
			if ($filter_params['is_monitoring']) {
				$data['wifi'] = $equipment_row->wifi;
				$data['local'] = $equipment_row->local;
			}
			$data['selected'] = false;
			$resp['data'][] = $data;
			$resp['total_rows'] = $equipment_row->rows_qty;
		}
		return $resp;
	}

	public function getEquipmentByName($name) {
		$r = DB::connection('sqlsrv')->select("exec bill..inventory_get_list 1, '', '', '', '', '', '', '', '', '', '', '', ?",[$name]);
		if (count($r)){
			$equipment_row = $r[0];
			$data = [];
			$data['route'] = iconv('cp1251', 'utf8', $equipment_row->route);
			$data['ip_addr'] = iconv('cp1251', 'utf8', $equipment_row->ip_addr);
			$data['mac'] = $equipment_row->mac==null?'':$equipment_row->mac;
			$data['model_desk'] = Helper::cyr($equipment_row->model_desk);
			$data['model_id'] = $equipment_row->model_id;
			$data['state'] = $equipment_row->state;
			$data['system_desk'] = iconv('cp1251', 'utf8', $equipment_row->system_desk);
			$data['system_id'] = $equipment_row->system;
			$data['system_group'] = $equipment_row->system_group;
			$data['situation_id'] = iconv('cp1251', 'utf8', $equipment_row->situation_id);
			$data['situation_desk'] = iconv('cp1251', 'utf8', $equipment_row->situation_desk);
			$data['location_id'] = $equipment_row->location_id;
			$data['location_desk'] = iconv('cp1251', 'utf8', $equipment_row->location_desk);
			$data['city_desk'] = iconv('cp1251', 'utf8', $equipment_row->city_desk);
			$data['region_desk'] = iconv('cp1251', 'utf8', $equipment_row->region_desk);
			$data['street_desk'] = iconv('cp1251', 'utf8', $equipment_row->street_desk);
			$data['build'] = iconv('cp1251', 'utf8', $equipment_row->house) . (($equipment_row->body != NULL) ? ' корп. ' . iconv('cp1251', 'utf8', $equipment_row->body) : '');
			$data['source'] = $equipment_row->source==null?'':$equipment_row->source;
			$data['source_iface'] = $equipment_row->source_iface==null?'':$equipment_row->source_iface;
			$data['state_desk'] = $equipment_row->state_desk;
			$data['target_iface'] = $equipment_row->target_iface==null?'':iconv('cp1251', 'utf8',$equipment_row->target_iface);
			$data['city_id'] = $equipment_row->city_id;
			$data['region_id'] = $equipment_row->region_id;
			$data['street_id'] = $equipment_row->street_id;
			$data['address_id'] = intval($equipment_row->addres_id);
			$data['address'] = iconv('cp1251', 'utf8', $equipment_row->city_desk) . ", " . iconv('cp1251', 'utf8', $equipment_row->street_desk) . " " . iconv('cp1251', 'utf8', $equipment_row->house) . (($equipment_row->body != NULL)?' корп. '.iconv('cp1251', 'utf8', $equipment_row->body):'');
			$data['house'] = Helper::cyr($equipment_row->house);
			$data['body'] = Helper::cyr($equipment_row->body);
			$data['entrance'] = iconv('cp1251', 'utf8',$equipment_row->entrance);
			$data['floor'] = iconv('cp1251', 'utf8',$equipment_row->floor);
			$data['apartment'] = iconv('cp1251', 'utf8',$equipment_row->apartment);
			$data['desk'] = iconv('cp1251', 'utf8', $equipment_row->desk);
			$data['link_type'] = $equipment_row->link_type;
			$data['link_type_prefix'] = Helper::cyr($equipment_row->link_type_prefix);
			$data['addition'] = str_replace('\\n', '<br>', $equipment_row->addition);
			$data['template_id'] = $equipment_row->template_id;
			$data['vlan_id'] = $equipment_row->vlan_id;
			$data['vlan_desk'] = Helper::cyr($equipment_row->vlan_desk);
			$data['vid'] = $equipment_row->vid;
			$data['login'] = $equipment_row->login;
			$data['pwd'] = $equipment_row->pwd;
			return $data;
		} else {
			return null;
		}
	}

	public function getODAcceptedSystems() {
		$resp = [];
		try {
			$r = DB::connection('sqlsrv')->select("exec bill..inventory_set_situation_5 2");
			foreach($r as $s_row) {
				$resp[] = [
					'system' => $s_row->system,
					'desk' => iconv('cp1251', 'utf8', $s_row->desk)
				];
			}
		} catch(\PDOException $e) {
			Log::error('DB Exception when try get OD accepted systems');
		}
		return $resp;
	}

	public function getEquipmentForBuilding($address_id) {
		$r = DB::connection('sqlsrv')->select("exec pss..addres_get_route 1, ?", [$address_id]);
		$accepted_systems = $this->getODAcceptedSystems();
		$result = array();
		if (true || $r) {
			$result['error'] = 0;
			$result['equipment_total'] = 0;
			$result['equipment_up'] = 0;
			$result['equipment_down'] = 0;
			$addres_model = new Address();
			$entrances = $addres_model->getEntrances($address_id);
			$result['max_floor'] = 0;
			$result['min_floor'] = 0;
			foreach($entrances as $ent=>$floor) {
				$result['entrances'][$ent]['max_floor'] = $floor;
				if ($floor>$result['max_floor']) {
					$result['max_floor'] = $floor;
				}
				$result['entrances'][$ent]['min_floor'] = 0;
			}
			foreach ($r as $row) {
				$result['equipment_total']++;
				if ($row->situation == 4) {
					foreach($accepted_systems as $s_row) {
						if ($s_row['system'] == $row->system) {
							$result['accepted_od'][$row->system] = 1;
						}
					}
				}
				$result['change_state'][$row->system] = 1;
				if ($row->state == 1) {
					$result['equipment_up']++;
				} else if ($row->state == -1) {
					$result['equipment_down']++;
				}
				if ($row->floor == 99) {
					$result['entrances'][$row->entrance]['loft']['devices'][] = [
						'route' => $row->route,
						'html' => '<nobr>'.$row->route.'</nobr>', //str_replace('-', '&#8209;', $row->route),
						'system' => $row->system,
						'state' => $row->state,
						'situation' => $row->situation,
						'source' => $row->source,
						'src_html' => '<nobr>'.$row->source.'</nobr>', //str_replace('-', '&#8209;', $row->source),
						'port' => $row->port,
						'source_state' => $row->source_state,
						'source_system' => $row->source_system
					];
					if (!isset($result['entrances'][$row->entrance]['max_floor'])) {
						$result['entrances'][$row->entrance]['max_floor'] = -1;
					}
				} elseif ($row->entrance == 0 || $row->floor == 0) {
					$result['additional']['devices'][] = [
						'route' => $row->route,
						'html' => '<nobr>'.$row->route.'</nobr>', //str_replace('-', '&#8209;', $row->route),
						'system' => $row->system,
						'state' => $row->state,
						'situation' => $row->situation,
						'source' => $row->source,
						'src_html' => '<nobr>'.$row->source.'</nobr>',//str_replace('-', '&#8209;', $row->source),
						'port' => $row->port,
						'source_state' => $row->source_state,
						'source_system' => $row->source_system
					];
				} else {
					$result['entrances'][$row->entrance][$row->floor]['devices'][] = [
						'route' => $row->route,
						'html' => '<nobr>'.$row->route.'</nobr>',// str_replace('-', '&#8209;', $row->route),
						'system' => $row->system,
						'state' => $row->state,
						'situation' => $row->situation,
						'source' => $row->source,
						'src_html' => '<nobr>'.$row->source.'</nobr>',//str_replace('-', '&#8209;', $row->source),
						'port' => $row->port,
						'source_state' => $row->source_state,
						'source_system' => $row->source_system
					];
					$result['entrances'][$row->entrance]['max_floor'] = (!isset($result['entrances'][$row->entrance]['max_floor']) || $result['entrances'][$row->entrance]['max_floor'] < $row->floor) ? $row->floor : $result['entrances'][$row->entrance]['max_floor'];
					$result['max_floor'] = (!isset($result['max_floor']) || $result['max_floor'] < $row->floor) ? $row->floor : $result['max_floor'];
					$result['min_floor'] = (!isset($result['min_floor']) || $result['min_floor'] > $row->floor) ? $row->floor : $result['min_floor'];
				}
			}
		}
		return $result;
	}

	public function getEquipmentForBuildingExport($address_id) {
		$address = new Address();
		$address_info = $address->getAddressInformation($address_id, true);
		$r = DB::connection('sqlsrv')->select("exec pss..addres_get_route 1, ?", [$address_id]);
		$result = [];
		foreach($r as $equipment_row) {
			$result[] = [
				'address_id' => $address_id,
				'street' => $address_info['street'],
				'house' => $address_info['build'],
				'body' => $address_info['body'],
				'entrance' => $equipment_row->entrance,
				'floor' => $equipment_row->floor,
				'model' => iconv('cp1251', 'utf8', $equipment_row->model),
				'mac' => $equipment_row->mac,
				'type' => $equipment_row->system_desk,
				'name' => $equipment_row->route,
				'name_iface' => $equipment_row->target_iface,
				'parent' => $equipment_row->source,
				'parent_iface' => $equipment_row->port,
				'ip_address' => $equipment_row->ip_addr
			];
		}
		return $result;
	}

	public function getEquipmentAddressExport($filter_params) {
		$filter_params = [
			'city' => iconv('utf8', 'cp1251', $filter_params['city']),
			'region' => iconv('utf8', 'cp1251', $filter_params['region']),
			'street' => iconv('utf8', 'cp1251', $filter_params['street']),
			'build' => iconv('utf8', 'cp1251', $filter_params['build'])
		];
		$r = DB::connection('sqlsrv')->select("exec bill..inventory_get_list 1, :city, :region, :street, '', '', '', '', '', '', '', 0, '', '', '', 'route asc', 0, 999999, :build", $filter_params);
		$result = [];
		foreach($r as $k=>$equipment_row) {
			$result[] = [
				'address_id' => $equipment_row->addres_id,
				'street' => iconv('cp1251', 'utf8', $equipment_row->street_desk),
				'house' => iconv('cp1251', 'utf8', $equipment_row->house),
				'body' => iconv('cp1251', 'utf8', $equipment_row->body),
				'entrance' => $equipment_row->entrance,
				'floor' => $equipment_row->floor,
				'model' => iconv('cp1251', 'utf8', $equipment_row->model_desk),
				'mac' => $equipment_row->mac,
				'type' => iconv('cp1251', 'utf8', $equipment_row->system_desk),
				'name' => $equipment_row->route,
				'name_iface' => $equipment_row->target_iface,
				'parent' => $equipment_row->source,
				'parent_iface' => $equipment_row->source_iface,
				'ip_address' => $equipment_row->ip_addr,
				'location' => $equipment_row->location_id,
				'vid' => $equipment_row->vid,
				'link_type' => $equipment_row->link_type_prefix
			];
		}
		return $result;
	}

	public function getEquipmentForExport($filter_params)
	{
		$filter_params['offset']=0;
		$filter_params['on_page']=999999;
		$r = DB::connection('sqlsrv')->select("exec bill..inventory_get_list 1, :cities, :regions, :street, :systems, :situations, :states, :source, :mac, :ip_addr, :model, :address_id, :name, :location, :desk, :order, :offset, :on_page, :build, :system_desk, :situation_desk, :state_desk, :params_search_string, :source_iface, :address_filter, :entrance, '', :is_monitoring", $filter_params);
		$resp = [];
		foreach($r as $k=>$equipment_row) {
			$data = [];
			$data['N'] = $k + 1;
			$data['Name'] = iconv('cp1251', 'utf8', $equipment_row->route);
			$data['Тип'] = iconv('cp1251', 'utf8', $r[$k]->system_desk);
			$data['IP'] = iconv('cp1251', 'utf8', $equipment_row->ip_addr);
			$data['MAC'] = $equipment_row->mac;
			$data['Родитель'] = $equipment_row->source;
			$data['Локация'] = iconv('cp1251', 'utf8', $r[$k]->location_desk);
			$data['Порт'] = $equipment_row->source_iface;
			$data['Uplink'] = $equipment_row->target_iface;
			$data['Статус'] = $equipment_row->state;
			$data['Состояние'] = iconv('cp1251', 'utf8', $equipment_row->situation_desk);
			$data['Город'] = iconv('cp1251', 'utf8', $r[$k]->city_desk);
			$data['Район'] = iconv('cp1251', 'utf8', $r[$k]->region_desk);
			$data['Улица'] = iconv('cp1251', 'utf8', $r[$k]->street_desk);
			$data['Дом'] = iconv('cp1251', 'utf8', $r[$k]->house) . (($r[$k]->body != NULL) ? ' корп. ' . iconv('cp1251', 'utf8', $r[$k]->body) : '');
			$data['Подъезд'] = iconv('cp1251', 'utf8',$equipment_row->entrance);
			$data['Этаж'] = iconv('cp1251', 'utf8',$equipment_row->floor);
			$data['Квартира'] = iconv('cp1251', 'utf8',$equipment_row->apartment);
			$data['Дополнение'] = str_replace('\\n', '|', $equipment_row->addition);
			$data['Описание'] = iconv('cp1251', 'utf8', $equipment_row->desk);
			$resp[] = $data;
		}
		return $resp;
	}

	public function getSituationTypes() {
		$resp['error'] = 0;
		$resp['msg']='';
		try {
			$r = DB::connection('sqlsrv')->select('exec bill..route_situation_type_get 0');
		} catch(\PDOException $e) {
			Log::error('getSituationTypes PDOException');
			$resp['error'] = -1;
			$resp['msg'] = 'Непредвиденная ошибка';
		}
		if ($resp['error'] == 0) {
			$resp['data'] = [];
			foreach ($r as $k => $rr) {
				$resp['data'][] = ['situation' => $rr->situation,
					'desk' => iconv('cp1251', 'utf8', $rr->desk)];
			}
		}
		return $resp;
	}

	public function getMonitoringSituationTypes() {
		$resp['error'] = 0;
		$resp['msg']='';
		try {
			$r = DB::connection('sqlsrv')->select('exec bill..route_situation_type_get 0');
		} catch(\PDOException $e) {
			Log::error('getSituationTypes PDOException');
			Log::debug($e);
			$resp['error'] = -1;
			$resp['msg'] = 'Непредвиденная ошибка';
		}
		if ($resp['error'] == 0) {
			$resp['data'] = [];
			foreach ($r as $k => $rr) {
				$resp['data'][] = [
					'value' => $rr->situation,
					'label' => iconv('cp1251', 'utf8', $rr->desk),
					'selected' => $rr->is_monitor == 1
				];
			}
		}
		return $resp;
	}

	public function getStateTypes() {
		$resp = [
			['type' => -1, 'desk' => 'Не доступен'],
			['type' => 0, 'desk' => 'Не определен'],
			['type' => 1, 'desk' => 'Доступен']
		];
		return $resp;
	}

	public function getMonitoringStateTypes() {
		$resp = [
			['value' => -1, 'label' => 'Не доступен', 'selected' => true],
			['value' => 0, 'label' => 'Не определен'],
			['value' => 1, 'label' => 'Доступен']
		];
		return $resp;
	}

	public function equipmentChangeAddress($params, $commit=false) {
		$params['action'] = $commit?2:1;
		$resp = [];
		Log::error($params);
		if (!$params['address_id']) {
			$info = $this->getRouteInfo($params['route']);
			$params['address_id'] = $info['address_id'];
		}
		if ($params['route'] != '') {
			Log::debug('exec bill..inventory_set_address :action, :route, :address_id, :entrance, :floor, :apartment');
			$r=DB::connection('sqlsrv')->select('exec bill..inventory_set_address :action, :route, :address_id, :entrance, :floor, :apartment', $params);
			Log::debug($params);
			Log::debug($r);
			$resp['error'] = $r[0]->error;
		} else {
			$resp['error'] = -1;
			$resp['msg'] = "Route is empty";
			Log::error('equipmentSetAddress error. Route is empty. Action='.$params['action']);
		}
		return $resp;
	}

	public function equipmentChangeMac($params, $commit=false) {
		$params['mac'] = Helper::strToMac($params['mac'], true);
		$params['action'] = $commit?2:1;
		$resp = [];
		Log::error($params);
		if($params['route'] != '') {
			if ($params['mac']) {
				Log::debug("exec exec bill..change_mac :action, :route, :mac");
				$r = DB::connection('sqlsrv')->select('exec bill..change_mac :action, :route, :mac', $params);
				Log::debug($resp);
				$resp['error'] = $r[0]->error;
				if ($resp['error']) {
					$resp['msg'] = Helper::cyr($r[0]->msg);
				}
			} else {
				$resp['error'] = -1;
				$resp['msg'] = "MAC имеет неправильный формат";
				Log::error('equipmentSetMac error. MAC has wrong format. Action='.$params['action']);
			}
		} else {
			$resp['error'] = -1;
			$resp['msg'] = "Route is empty";
			Log::error('equipmentSetMac error. Route is empty. Action='.$params['action']);
		}
		return $resp;
	}

	public function equipmentChangeSystem($params, $commit=false) {
		$params['action'] = $commit?2:1;
		$resp = [];
		Log::error($params);
		if($params['route'] != '') {
			try {
				Log::debug("exec exec bill..change_system :action, :route, :system");
				$r = DB::connection('sqlsrv')->select('exec bill..inventory_set_system :action, :route, :system', $params);
				$resp['error'] = $r[0]->error;
				if ($resp['error']) {
					$resp['msg'] = Helper::cyr($r[0]->msg);
				} else {
					$resp['msg'] = 'OK';
				}
			} catch(\PDOException $e) {
				Log::debug($e->getMessage());
			}
		} else {
			$resp['error'] = -1;
			$resp['msg'] = "Route is empty";
			Log::error('equipmentSetSystem error. Route is empty. Action='.$params['action']);
		}
		Log::debug($resp);
		return $resp;
	}
	public function equipmentChangeModel($params, $commit=false) {
		$params['action'] = $commit?2:1;
		$resp = [];
		Log::error($params);
		if($params['route'] != '') {
			Log::debug("exec bill..inventory_set_model :action, :route, :model");
			$r=DB::connection('sqlsrv')->select('exec bill..inventory_set_model :action, :route, :model', $params);
			Log::debug($r);
			$resp['error'] = $r[0]->error;
			if ($resp['error']) {
				$resp['msg'] = Helper::cyr($r[0]->msg);
			}
		} else {
			$resp['error'] = -1;
			$resp['msg'] = "Route is empty";
			Log::error('equipmentChangeModel error. Route is empty. Action='.$params['action']);
		}
		return $resp;
	}

	public function equipmentChangeSource($params, $commit=false) {
		$params['action'] = $commit?2:1;
		$resp = [];
		Log::error($params);
		if($params['route'] != '') {
			Log::debug("exec bill..inventory_set_source $commit, :route, :source, :source_iface, :route_iface, :link_type");
			$r=DB::connection('sqlsrv')->select('exec bill..inventory_set_source :action, :route, :source, :source_iface, :route_iface, :link_type', $params);
			Log::debug($params);
			Log::debug($r);
			$resp['error'] = Helper::cyr($r[0]->error);
		} else {
			$resp['error'] = -1;
			$resp['msg'] = "Route is empty";
			Log::error('equipmentChangeSource error. Route is empty. Action='.$params['action']);
		}
		return $resp;
	}

	public function equipmentChangeDesk($params, $commit=false) {
		$params['action'] = $commit?2:1;
		$resp = [];
		Log::error($params);
		if($params['route'] != '') {
			Log::debug("exec bill..inventory_set_desk $commit, :route, :desk");
			$r=DB::connection('sqlsrv')->select('exec bill..inventory_set_desk :action, :route, :desk', $params);
			Log::debug($params);
			Log::debug($r);
			$resp['error'] = Helper::cyr($r[0]->error);
		} else {
			$resp['error'] = -1;
			$resp['msg'] = "Route is empty";
			Log::error('equipmentChangeDesk error. Route is empty. Action='.$params['action']);
		}
		return $resp;
	}

	public function equipmentChangeSituation($params, $commit=false) {
		$params['action'] = $commit?1:2;
		$resp = [];
		Log::error($params);
		if($params['route'] != '') {
			Log::debug("exec bill..inventory_set_situation $commit, ".$params['route'].", ".$params['situation']."");
			$r=DB::connection('sqlsrv')->select('exec bill..inventory_set_situation :action, :route, :situation', $params);
			$resp['error'] = Helper::cyr($r[0]->error);
		} else {
			$resp['error'] = -1;
			$resp['msg'] = "Route is empty";
			Log::error('equipmentChangeSituation error. Route is empty. Action='.$params['action']);
		}
		return $resp;
	}

	public function equipmentChangeIp($params, $commit=false) {
		$params['action'] = $commit?2:1;
		$params['ip'] = trim($params['ip']);
		$resp = [];
		Log::error($params);
		if($params['route'] != '') {
			Log::debug("exec bill..inventory_set_ip $commit, ".$params['route'].", ".trim($params['ip'])."");
			$r=DB::connection('sqlsrv')->select('exec bill..inventory_set_ip :action, :route, :ip', $params);
			$resp['error'] = $r[0]->error;
		} else {
			$resp['error'] = -1;
			$resp['msg'] = "Route is empty";
			Log::error('equipmentChangeIp error. Route is empty. Action='.$params['action']);
		}
		return $resp;
	}

	public function equipmentChangeRoute($params, $commit=false) {
		$params['action'] = $commit?2:1;
		$resp = [];
		Log::error($params);
		if($params['route'] != '') {
			Log::debug("exec inventory_set_route $commit, ".$params['route'].", ".$params['new_route']."");
			$r=DB::connection('sqlsrv')->select('exec bill..inventory_set_route :action, :route, :new_route', $params);
			Log::debug($r);
			$resp['error'] = $r[0]->error;
		} else {
			$resp['error'] = -1;
			$resp['msg'] = "Route is empty";
			Log::error('equipmentChangeRoute error. Route is empty. Action='.$params['action']);
		}
		return $resp;
	}

	public function equipmentChangeLocation($params, $commit=false) {
		$params['action'] = $commit?2:1;
		$resp = [];
		Log::error($params);
		if($params['route'] != '') {
			Log::debug("exec bill..inventory_set_location $commit, ".$params['route'].", ".$params['location_id']);
			$r=DB::connection('sqlsrv')->select('exec bill..inventory_set_location :action, :route, :location_id', $params);
			Log::debug($r);
			$resp['error'] = $r[0]->error;
		} else {
			$resp['error'] = -1;
			$resp['msg'] = "Route is empty";
			Log::error('equipmentChangeLocation error. Route is empty. Action='.$params['action']);
		}
		return $resp;
	}

	public function equipmentChangeBrand($params, $commit=false) {
		$params['action'] = $commit?2:1;
		Log::debug('ChangeBrand');
		Log::error($params);
		return [
			'error' => 0,
			'msg' => 'OK'
		];
	}

	public function equipmentAcceptNCC($route) {
		Log::debug('exec bill..inventory_set_situation_4 1, '.$route);
		try {
			$r = DB::connection('sqlsrv')->select('exec bill..inventory_set_situation_4 1, ?', [$route]);
			if (isset($r[0]->error) && $r[0]->error == 0) {
				return true;
			} else {
				Log::error("NCC Accept equipment error: ".$r[0]->error.", ".$r[0]->msg);
			}
		} catch(\ErrorException $e) {
			Log::error("NCC Accept equipment Exception");
			Log::debug($e);
			return false;
		}
	}

	public function equipmentAcceptOD($route) {
		Log::debug('exec bill..inventory_set_situation_5 1, '.$route);
		try {
			$r = DB::connection('sqlsrv')->select('exec bill..inventory_set_situation_5 1, ?', [$route]);
			if (isset($r[0]->error) && $r[0]->error == 0) {
				return true;
			} else {
				Log::error("NCC Accept equipment error: ".$r[0]->error.", ".$r[0]->msg);
			}
		} catch(\ErrorException $e) {
			Log::error("NCC Accept equipment Exception");
			Log::debug($e);
			return false;
		}
	}

	public function equipmentExploit($route) {
		Log::debug('exec bill..inventory_set_situation_1 1,'.$route);
		try {
			$r = DB::connection('sqlsrv')->select('exec bill..inventory_set_situation_1 1, ?', [$route]);
			if (isset($r[0]->error) && $r[0]->error == 0) {
				return true;
			} else {
				Log::error("Exploit equipment error: ".$r[0]->error.", ".$r[0]->msg);
			}
		} catch(\ErrorException $e) {
			Log::error("Exploit equipment Exception");
			Log::debug($e);
			return false;
		}
	}

	public function updateEquipment($equipment_params, $commit=0) {
		$resp = [];
		$resp['commit'] = $commit;
		Log::debug($commit);
		Log::debug($equipment_params);
		if ($equipment_params['route'] != '') {
			if ($equipment_params['address_change'] >= 1) {
				$address['route'] = $equipment_params['route'];
				$address['address_id'] = intval($equipment_params['address_id']);
				if (isset($equipment_params['entrance'])) {
					$address['entrance'] = $equipment_params['entrance'];
				} else {
					$address['entrance'] = NULL;
				}
				if (isset($equipment_params['floor'])) {
					$address['floor'] = $equipment_params['floor'];
				} else {
					$address['floor'] = NULL;
				}
				if (isset($address['apartment'])) {
					$address['apartment'] = $equipment_params['apartment'];
				} else {
					$address['apartment'] = NULL;

				}
				$resp['address'] = $this->equipmentChangeAddress($address, $commit);
			} else {
				$resp['address']['error'] = 0;
			}
			if ($equipment_params['location_change'] >= 1) {
				$location['route'] = $equipment_params['route'];
				$location['location_id'] = intval($equipment_params['location_id']);
				$resp['location'] = $this->equipmentChangeLocation($location, $commit);
			} else {
				$resp['location']['error'] = 0;
			}
			if (!empty($equipment_params['mac_change'])) {
				$mac['route'] = $equipment_params['route'];
				$mac['mac'] = $equipment_params['mac'];
				$resp['mac'] = $this->equipmentChangeMac($mac, $commit);
			} else {
				$resp['mac']['error'] = 0;
			}
			if (!empty($equipment_params['system_change'])) {
				$system['route'] = $equipment_params['route'];
				$system['system'] = $equipment_params['system'];
				$resp['system'] = $this->equipmentChangeSystem($system, $commit);
			} else {
				$resp['system']['error'] = 0;
			}
			if (!empty($equipment_params['source_change'])) {
				$source['route'] = $equipment_params['route'];
				$source['source'] = $equipment_params['source'];
				$source['source_iface'] = $equipment_params['source_iface'];
				$source['route_iface'] = $equipment_params['route_iface'];
				$source['link_type'] = $equipment_params['link_type'];
				$resp['source'] = $this->equipmentChangeSource($source, $commit);
			} else {
				$resp['source']['error'] = 0;
			}
			if (!empty($equipment_params['ip_change'])) {
				$ip['route'] = $equipment_params['route'];
				$ip['ip'] = $equipment_params['ip'];
				$resp['ip'] = $this->equipmentChangeIp($ip, $commit);
			} else {
				$resp['ip']['error'] = 0;
			}
			if (!empty($equipment_params['desk_change'])) {
				$desk['route'] = $equipment_params['route'];
				$desk['desk']=iconv('utf8', 'cp1251', $equipment_params['desk']);
				$resp['desk'] = $this->equipmentChangeDesk($desk, $commit);
			} else {
				$resp['desk']['error'] = 0;
			}
			if (!empty($equipment_params['situation_change'])) {
				$situation['route'] = $equipment_params['route'];
				$situation['situation']= $equipment_params['situation'];
				$resp['situation'] = $this->equipmentChangeSituation($situation, $commit);
			} else {
				$resp['situation']['error'] = 0;
			}
			if (!empty($equipment_params['model_change'])) {
				$model['route'] = $equipment_params['route'];
				$model['model'] = $equipment_params['model'];
				$resp['model'] = $this->equipmentChangeModel($model, $commit);
			} else {
				$resp['model']['error'] = 0;
			}
			if (!empty($equipment_params['route_change'])) {
				$route['route'] = $equipment_params['route'];
				$route['new_route'] = $equipment_params['new_route'];
				$resp['route'] = $this->equipmentChangeRoute($route, $commit);
			} else {
				$resp['route']['error'] = 0;
			}
		}
		if ($resp['address']['error'] != 0 ||
			$resp['location']['error'] != 0 ||
			$resp['mac']['error'] != 0 ||
			$resp['system']['error'] != 0 ||
			$resp['source']['error'] != 0 ||
			$resp['desk']['error'] != 0 ||
			$resp['situation']['error'] != 0 ||
			$resp['ip']['error'] != 0 ||
			$resp['model']['error'] != 0 ||
			$resp['route']['error'] != 0 ) {
			$resp['error'] = 1;
		} else {
			$resp['error'] = 0;
		}
		return $resp;
	}

	public function updateEquipmentBatch($routes, $params, $commit) {
		$resp=[
			'commit' => $commit,
			'error' => 0,
			'msg' => 'OK',
			'address' => [
				'error' => 0
			],
			'source' => [
				'error' => 0
			],
			'desk' => [
				'error' => 0
			],
			'situation' => [
				'error' => 0
			]
		];
		foreach($routes as $route) {
			$params['route'] = $route;
			$result = $this->updateEquipment($params, $commit);
			if ($result['error']) {
				$resp['error'] = 1;
				$resp['msg'] = 'При сохранении возникли ошибки';
			}
			if (isset($result['address']['error']) && $result['address']['error']) {
				$resp['address']['error'] = 1;
			}
			if (isset($result['source']['error']) && $result['source']['error']) {
				$resp['source']['error'] = 1;
			}
			if (isset($result['desk']['error']) && $result['desk']['error']) {
				$resp['desk']['error'] = 1 ;
			}
			if (isset($result['situation']['error']) && $result['situation']['error']) {
				$resp['situation']['error'] = 1;
			}
		}
		return $resp;
	}

	public function updateEquipmentByFile($params) {
		$resp=[
			'commit' => 1,
			'error' => 0,
			'msg' => 'OK',
			'address' => [
				'error' => 0
			],
			'source' => [
				'error' => 0
			],
			'desk' => [
				'error' => 0
			],
			'situation' => [
				'error' => 0
			]
		];
		foreach($params as $route_params) {
			$result = $this->updateEquipment($route_params, 1);
			if ($result['error']) {
				$resp['error'] = 1;
				$resp['msg'] = 'При сохранении возникли ошибки';
			}
			if (isset($result['address']['error']) && $result['address']['error']) {
				$resp['address']['error'] = 1;
			}
			if (isset($result['source']['error']) && $result['source']['error']) {
				$resp['source']['error'] = 1;
			}
			if (isset($result['desk']['error']) && $result['desk']['error']) {
				$resp['desk']['error'] = 1 ;
			}
			if (isset($result['situation']['error']) && $result['situation']['error']) {
				$resp['situation']['error'] = 1;
			}
		}
		return $resp;
	}

	public function getLinkType() {
		$r = DB::connection('sqlsrv')->select('exec bill..route_group_get 2');
		$resp=[];
		foreach($r as $k=>$rr) {
			$resp[] = ['id' => $rr->type,
				'desk' => iconv('cp1251', 'utf8', $rr->desk)];
		}
		return $resp;
	}

	public function getCommunity($route) {
		$r = DB::connection('sqlsrv')->select('exec bill..route_setup_get 0, ?, ?', [$route, 'community']);
		return isset($r[0]->value1)?$r[0]->value1:'public_sw';
	}

	public function getTemplateGroups($system, $route='', $group_id=0) {
		try {
			$r = DB::connection('sqlsrv')->select('exec bill..route_template_get 1, ?, ?', [$system, $route]);
			$resp=[];
			foreach($r as $row) {
				if ($row->group_id == $group_id) {
					$row->desk = iconv('cp1251', 'utf8', $row->desk);
					return $row;
				}
				$resp[] = [
					'desk' => iconv('cp1251', 'utf8', $row->desk),
					'value' => $row->group_id
				];
			}
			return $resp;
		} catch(\PDOException $e) {
			Log::error('Equipment::getTemplates EXCEPTION');
			Log::debug($e);
		}
	}

	public function getTemplateForModel($route, $group_id, $model, $fw) {
		$route = iconv('utf8', 'cp1251', $route);
		$model = iconv('utf8', 'cp1251', $model);
		$fw = iconv('utf8', 'cp1251', $fw);
		try {
			$r = DB::connection('sqlsrv')->select('exec bill..route_template_get 2, 0, ?, ?, ?, ?', [$route, $group_id, $model, $fw]);
			$resp=[];
			if (count($r) != 0) {
				if ((!isset($r[0]->error) || $r[0]->error != 0) && (isset($r[0]->template) && $r[0]->template)) {
					$r[0]->desk = iconv('cp1251', 'utf8', $r[0]->desk);
					$r[0]->model = iconv('cp1251', 'utf8', $r[0]->model);
					$r[0]->fw = iconv('cp1251', 'utf8', $r[0]->fw);
					$r[0]->template = iconv('cp1251', 'utf8', $r[0]->template);
					return $r[0];
				} else {
					Log::error("Template request return error code: ".$r[0]->error.". route: $route , group_id: $group_id , model: $model , fw: $fw");
					return false;
				}
			} else {
				Log::debug("Template request return empty result. route: $route , group_id: $group_id , model: $model , fw: $fw");
				return false;
			}
		} catch(\PDOException $e) {
			Log::error('Equipment::getTemplates EXCEPTION');
			Log::debug($e->getMessage());
			return false;
		}
	}

	public function clearRouteTemplateInfo($route) {
		try {
			$r = DB::connection('sqlsrv')->select('exec bill..route_template_delete 1, ?', [$route]);
			Log::debug($r);
			if (isset($r[0])) {
				if ($r[0]->error == 0) {
					return [
						'error' => 0,
						'msg' => 'OK'
					];
				} else {
					return [
						'error' => $r[0]->error,
						'msg' => $r[0]->msg
					];
				}
			} else  {
				return [
					'error' => -1,
					'msg' => 'Непредвиденная ошибка'
				];
			}
		} catch(\PDOException $e) {
			Log::error('clearRouteTemplateInfo EXCEPTION');
			Log::debug($e->getMessage());
		}
	}

	public function batchAcceptNCCEquipment($address_id, $system) {
		$address_model = new Inventory();
		$equipments = $address_model->getBuildingEquipment($address_id);
		$error = 0;
		foreach($equipments as $equipment) {
			if ($equipment->situation != -240 && $equipment->system==$system)
				if (!$this->equipmentAcceptNCC($equipment->route))
					$error++;
		}
		return $error;
	}

	public function batchAcceptODEquipment($address_id, $system) {
		$address_model = new Inventory();
		$equipments = $address_model->getBuildingEquipment($address_id);
		$error = 0;
		foreach($equipments as $equipment) {
			if ($equipment->situation == 4 && $equipment->system==$system)
				if (!$this->equipmentAcceptOD($equipment->route))
					$error++;
		}
		return $error;
	}

	public function batchChangeState($routes, $address_id, $system, $state)
	{
		$address_model = new Inventory();
		$equipments = $address_model->getBuildingEquipment($address_id);
		$error = 0;
		foreach ($equipments as $equipment) {
			if (array_search($equipment->route, $routes) !== false && $equipment->system == $system) {
				if ($state == 1) {
					if (!$this->equipmentExploit($equipment->route)) $error++;
				}
				if ($state == 4) {
					if (!$this->equipmentAcceptNCC($equipment->route)) $error++;
				}
			}
		}
		return $error;
	}

	public function getTemplateLog($route) {
		Log::debug("Route: ".$route);
		$r = DB::connection('sqlsrv')->select('exec bill..template_desk_get 2,0, ?', [$route]);
		$resp = [];
		foreach($r as $template) {
			$resp[] = [
				'desk' => iconv('cp1251', 'utf8', $template->desk),
				'started' => $template->started
			];
		}
		return $resp;
	}

	public function getCoords() {
		$resp = [
			'type' => 'FeatureCollection',
		];
		$features = [];
		$r = DB::connection('sqlsrv')->select('exec pss..nagios_points 0, 0, 1');
		foreach($r as $k=>$coord) {
			if(trim($coord->longitude)) {
				$body = $coord->body?' к. '.iconv('cp1251', 'utf8', $coord->body):'';
				$text = 'ул.'. iconv('cp1251', 'utf8', $coord->street) . " д.".iconv('cp1251', 'utf8', $coord->street).$body;
				$features[] = [
					'type' => 'Feature',
					'id' => $k,
					'geometry' => [
						'type' => 'Point',
						'coordinates' => [
							$coord->latitude,
							$coord->longitude
						]
					],
					'properties' => [
						'preset' => 'islands#greenDotIcon',
						'hintContent' => $text
					]
				];
			}
		}
		$resp['features'] = $features;
		return $resp;
	}

	public function getParams() {
		$resp = [];
		$right_model = new EquipmentRights();
		foreach(self::$params as $k=>$param) {
			switch($k) {
				case 'address_id':
				case 'street':
				case 'entrance':
				case 'floor':
				case 'apartment':
					if ($right_model->canChangeAddress()) $resp[] = [
						'value' => $k,
						'label' => $param
					];
					break;
				case 'ip_address':
					if ($right_model->canChangeIp()) $resp[] = [
						'value' => $k,
						'label' => $param
					];
					break;
				case 'mac':
					if ($right_model->canChangeMac()) $resp[] = [
						'value' => $k,
						'label' => $param
					];
					break;
				case 'desk':
					if ($right_model->canChangeDesk()) $resp[] = [
						'value' => $k,
						'label' => $param
					];
					break;
				case 'situation':
					if ($right_model->canChangeSituation()) $resp[] = [
						'value' => $k,
						'label' => $param
					];
					break;
			}
		}
		return $resp;
	}

	public function loadParamsFromFile($routes, $params, $file) {
		$file = Excel::load($file, function($reader) {})->get();
		$resp = [];
		if ($routes) {
			foreach($file as $p) {
				foreach ($p as $i => $r_row) {
					$route = Helper::checkCyr($r_row['name']);
					if (array_search($route, $routes) !== false) {
						$resp_row = [];
						$info = $this->getRouteInfo($route);
						Log::debug($info);
						$resp_row['route'] = $info['name'];
						$resp_row['isinit'] = $info['init'];
						if ($info['init'])
							foreach ($params as $param) {
								$resp_row['params'][$param] = [
									'old' => $info[$param],
									'new' => $r_row[$param],
									'changed' => $info[$param] != $r_row[$param]
								];
							}
						$resp[$route] = $resp_row;
					}
				}
			}
		} else {
			foreach($file as $p) {
				foreach ($p as $i => $r_row) {
					$route = Helper::checkCyr($r_row['name']);
					$resp_row = [];
					$info = $this->getRouteInfo($route);
					Log::debug($info);
					$resp_row['route'] = $info['name'];
					$resp_row['isinit'] = $info['init'];
					if ($info['init'])
						foreach ($params as $param) {
							$resp_row['params'][$param] = [
								'old' => $info[$param],
								'new' => $r_row[$param],
								'changed' => $info[$param] != $r_row[$param]
							];
						}
					$resp[$route] = $resp_row;
				}
			}
		}
		Log::debug('Resp::');
		Log::debug($resp);
		return $resp;
	}

	/**
	 * @param $params Array Contains equipments params for SQL request
	 * :system Integer Equipment type
	 * :route String Equipment name
	 * :desk_note Text Equipment description
	 * :adres_note Text Installation notes
	 * :model_id Integer ID of equipments model @see
	 * :address_id integer Address ID
	 * :entrance String (Integer often) Entrance
	 * :floor String (Integer often) Entrance
	 * :ip_addr String Ip Address
	 * :mac String MAC Address
	 * :apartment String (Integer often) Equipment apartment
	 * :location_id Integer Locations ID of Equipment
	 * :source String Name of parent equipment
	 * :route_iface String(Integer often) Name or number of equipments interfaces,
	 * which connected to parent
	 * :source_iface String(Integer often) Name or number of parent equipment interface,
	 * which connected to this equipment
	 * :link_type Integer type of link before equipment and parent
	 * :vlan_id	String ID's of vlan
	 * :comp_id ID of equipment's owner company
	 * :show_error Show error flag
	 * @return array
	 */
	public function addEquipment($params, $commit) {
		$params['status'] = $commit == 1?2:1;
		$params['mac'] = Helper::strToMac($params['mac']);
		$resp = [
			'error' => 0,
			'msg' => 'OK'
		];
		Log::debug($params);
		Log::debug("exec bill..invenotory_route_create ".$params['status'].",".
			$params['system_id'].",".
			$params['route'].",".
			$params['desk_note'].",".
			$params['addr_note'].",".
			$params['model_id'].",".
			$params['address_id'].",".
			$params['entrance'].",".
			$params['floor'].",".
			$params['ip_addr'].",".
			$params['mac'].",".
			$params['apartment'].",".
			$params['location_id'].",".
			$params['source'].",".
			$params['route_iface'].",".
			$params['source_iface'].",".
			$params['link_type'].",".
			$params['situation_id'].",".
			$params['vlan_id'].",
			1,
			1,
			".$params['ignore_error']);
		try {
			$r = DB::connection('sqlsrv')->select('exec bill..invenotory_route_create :status,
			:system_id,
			:route,
			:desk_note,
			:addr_note,
			:model_id,
			:address_id,
			:entrance,
			:floor,
			:ip_addr,
			:mac,
			:apartment,
			:location_id,
			:source,
			:route_iface,
			:source_iface,
			:link_type,
			:situation_id,
			:vlan_id,
			1,
			1,
			:ignore_error', $params);
			Log::debug($r);
			if (isset($r[0]->error) && $r[0]->error != 0) {
				$errors = explode(',', $r[0]->error);
                $resp = [
                    'error' => $r[0]->error,
                    'msg' => Helper::cyr($r[0]->msg." (".$r[0]->error.")")
                ];
				foreach($errors as $error) {
					switch ($error) {
						case 1:
						case 5:
						case 6:
						case 7:
							$resp['route']['error'] = 1;
							break;
						case 2:
							$resp['mac']['error'] = 1;
							break;
						case 3:
						case 4:
							$resp['address']['error'] = 1;
							break;
						case 10:
							$resp['situation']['error'] = 1;
							break;
						case 11:
							$resp['model']['error'] = 1;
							break;
						case 12:
						case 15:
						case 16:
						case 19:
						case 22:
							$resp['ip_addr']['error'] = 1;
							break;
						case 13:
						case 9:
							$resp['source']['error'] = 1;
							break;
						case 14:
						case 21:
							$resp['location']['error'] = 1;
							break;
						case 17:
							$resp['mac']['error'] = 1;
							break;
						case 18:
							$resp['vlan']['error'] = 1;
							break;
					}
				}
			} else {
				$resp = [
					'error' => 0,
					'msg' => 'OK'
				];
				if ($commit && isset($r[0]->route) && $r[0]->route != '') {
					$data = $this->getEquipmentByName($r[0]->route);
					if ($data && $data['route'] != '') {
						$resp['data'] = $data;
					}

				}
            }
		} catch(\PDOException $e) {
			Log::error('AddEquipment Exception');
            Log::debug($e->getMessage());
			$resp = [
				'error' => -1,
				'msg' => 'Не достаточно прав'
			];
		}
        Log::debug($resp);
		return $resp;
	}

	public function deleteEquipment($route) {
		try{
			$r = DB::connection('sqlsrv')->select('exec bill..inventory_route_delete 1, ?', [$route]);
		} catch (\PDOException $e) {
			Log::error('DeleteEquipment Exception');
			Log::debug($e->getMessage());
			return [
				'error' => -1,
				'msg' => 'Не достаточно прав'
			];
		}
		if (isset($r[0]->error)) {
			if ($r[0]->error == 0) {
				return [
					'error' => 0,
					'msg' => 'OK'
				];
			} else {
				return [
					'error' => 0,
					'msg' => Helper::cyr($r[0]->error)
				];
			}
		} else {
			Log::error('deleteEquipment UNEXEPECTED Error');
			Log::error($r);
			return [
				'error' => -1,
				'msg' => 'Непредвиденная ошибка'
			];
		}
	}

	public function getSwitchPorts($route) {
		$resp = [];
		try{
			$r = DB::connection('sqlsrv')->select('exec bill..inventory_get_route_port 1, ?', [$route]);
		} catch (\PDOException $e) {
			Log::error('getSwitchPorts Exception');
			Log::debug($e->getMessage());
			return [
				'error' => -1,
				'msg' => 'Не достаточно прав'
			];
		}
		foreach($r as $port) {
			$resp[] = [
				'port' => $port->iface,
				'target' => $port->target,
				'target_iface' => $port->target_iface
			];
		}
		return $resp;
	}

	public function batchDeleteAP($address_id) {
		$address_id = intval($address_id);
		if ($address_id) {
			try {
				$r = DB::connection('sqlsrv')->select('exec bill..inventory_delete_route_address 1, ?', [$address_id]);
			} catch (\PDOException $e) {
				Log::error('batchDeleteAP Exception');
				Log::debug($e->getMessage());
				return [
					'error' => -1,
					'msg' => 'Не достаточно прав'
				];
			}
			if (isset($r[0]->error)) {
				if ($r[0]->error == 0) {
					return [
						'error' => 0,
						'msg' => 'OK'
					];
				} else {
					return [
						'error' => 0,
						'msg' => Helper::cyr($r[0]->error)
					];
				}
			} else {
				Log::error('batchDeleteAP UNEXEPECTED Error');
				Log::error($r);
				return [
					'error' => -1,
					'msg' => 'Непредвиденная ошибка'
				];
			}
		} else {
			Log::error('batchDeleteAP error. Undefined address_id');
			return [
				'error' => -2,
				'msg' => 'Адрес не определен'
			];
		}
	}

	public function getDeletedAP($address_id) {
		$address_id = intval($address_id);
		/*return [
			'error' => 0,
			'msg' => '',
			'data' => [
				[
					'route' => 'ad',
					'system' => 3
				],
				[
					'route' => 'ad',
					'system' => 3
				]
			]
		];*/
		if ($address_id) {
			try {
				$r = DB::connection('sqlsrv')->select('exec bill..inventory_delete_route_address 2, ?', [$address_id]);
			} catch (\PDOException $e) {
				Log::error('getDeletedAP Exception');
				Log::debug($e->getMessage());
				return [
					'error' => -1,
					'msg' => 'Не достаточно прав'
				];
			}
			if (isset($r[0]->error) && $r[0]->error != 0) {
				return [
					'error' => $r[0]->error,
					'msg' => Helper::cyr($r[0]->msg)
				];
			} else {
				return [
					'error' => 0,
					'msg' => 'OK',
					'data' => $r[0]->qty
				];
			}
		} else {
			Log::error('batchDeleteAP error. Undefined address_id');
			return [
				'error' => -2,
				'msg' => 'Адрес не определен'
			];
		}
	}

	public function configureRoute($route, $address_id=null) {
		if (trim($route) !='') {
			$routeInfo = $this->getEquipmentByName($route);
			if ($routeInfo) {
				if ($routeInfo['ip_addr']) {
					if ($address_id && $routeInfo['address_id']) {
						if ($address_id != $routeInfo['address_id']) {
							return [
								'error' => -2,
								'msg' => 'ТД не пренадлежит этому дому'
							];
						}
					} else {
						return [
							'error' => -1,
							'msg' => 'Отсутствует физический адрес устройства'
						];
					}
					if ($routeInfo['situation_id'] != 1 && $routeInfo['situation_id'] != 6) {
						return [
							'error' => -1,
							'msg' => 'ТД должна находиться в состоянии "В эксплуатации"'
						];
					}
					if (Helper::pingAddress($routeInfo['ip_addr'])) {
						$system_id = $routeInfo['system_id'];
						$address_id = $routeInfo['address_id'];
						$group_id = 2;
						$to_all = true;
						$routes = [$route];
						$desk = "Конфигурирование ТД $route";
						$this->clearRouteTemplateInfo($route);
						$this->equipmentChangeSituation(['situation'=>6,'route'=>$route], 1);
						$job = new ChangeTemplateJob($address_id, $system_id, $group_id, Auth::user(), $desk, $to_all, $routes, 1);
						dispatch($job);
						return [
							'error' => 0,
							'msg' => 'OK'
						];
					} else {
						return [
							'error' => -1,
							'msg' => 'Устройство недоступно'
						];
					}
				} else {
					return [
						'error' => -1,
						'msg' => 'Отсутствует IP адрес ТД'
					];
				}
			} return [
				'error' => -4,
				'msg' => 'ТД не найдена в Inventory'
			];
		} else {
			return [
				'error' => -1,
				'msg' => 'Пустое имя устройства'
			];
		}

	}
}
