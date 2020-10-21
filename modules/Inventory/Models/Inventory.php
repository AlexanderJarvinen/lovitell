<?php

namespace Modules\Inventory\Models;

use App\Components\Helper;
use \Log;
use \DB;
use Excel;

class Inventory
{

	public function getRegions() {
		$result = [];
//	  	$r = mssql_query('exec pss..addres_get_info 0', $this->connection);
		$result = DB::connection('sqlsrv')->select('exec pss..addres_get_info 0');
		foreach($result as $result_row) {
			$result_row->desk = iconv('cp1251', 'utf8', $result_row->desk);
		}
		return $result;
	}

	public function getBuildings($region_interval='') {
		$r = DB::connection('sqlsrv')->select("exec pss..addres_get_info 1,'".$region_interval."'");
		$result = [];
		foreach($r as $row) {
			$data=array();
			$data[] = iconv('cp1251', 'utf8', $row->desk);
			$data[] = iconv('cp1251', 'utf8', $row->street);
			$data[] = iconv('cp1251', 'utf8', $row->house).(($row->body != NULL)?' корп. '.iconv('cp1251', 'utf8', $row->body):'');
			$data['address_id'] = $row->address_id;
			$result['data'][] = $data;
		}
		return $result;
	}

	public function getEquipments($region_interval='') {
		$r = DB::connection('sqlsrv')->select("exec  pss..eqp_find 0,'".$region_interval."'");
		$result = array();
		foreach($result as $row) {
			$data=array();
			$data[] = iconv('cp1251', 'utf8', $row->route);
			$data[] = iconv('cp1251', 'utf8', $row->ip_addr);
			$data[] = iconv('cp1251', 'utf8', $row->mac);
			$data[] = iconv('cp1251', 'utf8', $row->desk);
			$data[] = iconv('cp1251', 'utf8', $row->street);
			$data[] = iconv('cp1251', 'utf8', $row->house).(($row->body != NULL)?' корп. '.iconv('cp1251', 'utf8', $row->body):'');
			$data[] = iconv('cp1251', 'utf8', $row->address_id);
			$data[] = iconv('cp1251', 'utf8', $row->system);
			$data[] = iconv('cp1251', 'utf8', $row->state);
			$data[] = iconv('cp1251', 'utf8', $row->entrance);
			$data[] = iconv('cp1251', 'utf8', $row->floor);
			$result['data'][] = $data;
		}
		return $result;
	}

	public function getBuildingEquipment($address_id) {
		$address_id = intval($address_id);
		$r = DB::connection('sqlsrv')->select("exec pss..addres_get_info 3,".$address_id);
		return $r;
	}

	public function getBuildingInformation($adress_id) {
		$adress_id = intval($adress_id);
		$r = DB::connection('sqlsrv')->select("exec pss..addres_get_info 3,".$adress_id);
		$addres_model = new Address();
		$entrances = $addres_model->getEntrances($adress_id);
		$result = array();
		$result['max_floor'] = 0;
		$result['min_floor'] = 0;
		foreach($entrances as $ent=>$floor) {
			$result['entrances'][$ent]['max_floor'] = $floor;
			if ($floor>$result['max_floor']) {
				$result['max_floor'] = $floor;
			}
			$result['entrances'][$ent]['min_floor'] = 0;
		}
		if (true || $r) {
			$result['error'] = 0;
			foreach($r as $row) {
				if ($row->floor == 99) {
					$result['entrances'][$row->entrance]['loft']['devices'][] = [
						'route' => $row->route,
						'html' => str_replace('-', '&#8209;', $row->route),
						'system' => $row->system,
						'state' => $row->state,
						'source' => $row->source,
						'src_html' => str_replace('-', '&#8209;', $row->source),
						'port' => $row->port,
						'source_state' => $row->source_state,
						'source_system' => $row->source_system
					];
					if(!isset($result['entrances'][$row->entrance]['max_floor'])) {
						$result['entrances'][$row->entrance]['max_floor'] = -1;
					}
				} elseif ($row->entrance == 0) {
					$result['additional']['devices'][] = [
						'route' => $row->route,
						'html' => str_replace('-', '&#8209;', $row->route),
						'system' => $row->system,
						'state' => $row->state,
						'source' => $row->source,
						'src_html' => str_replace('-', '&#8209;', $row->source),
						'port' => $row->port,
						'source_state' => $row->source_state,
						'source_system' => $row->source_system
					];
				} else {
					$result['entrances'][$row->entrance][$row->floor]['devices'][] = [
						'route' => $row->route,
						'html' => str_replace('-', '&#8209;', $row->route),
						'system' => $row->system,
						'state' => $row->state,
						'source' => $row->source,
						'src_html' => str_replace('-', '&#8209;', $row->source),
						'port' => $row->port,
						'source_state' => $row->source_state,
						'source_system' => $row->source_system
					];
					$result['entrances'][$row->entrance]['max_floor'] = (!isset($result['entrances'][$row->entrance]['max_floor']) || $result['entrances'][$row->entrance]['max_floor'] < $row->floor) ? $row->floor : $result['entrances'][$row->entrance]['max_floor'];
					$result['max_floor'] = (!isset($result['max_floor']) || $result['max_floor'] < $row->floor) ? $row->floor : $result['max_floor'];
					$result['min_floor'] = (!isset($result['min_floor']) || $result['min_floor'] > $row->floor) ? $row->floor : $result['min_floor'];
				}
			}
			$r = DB::connection('sqlsrv')->select("exec pss..addres_get_info 4," . $adress_id);
			if ($address_row = $r[0]) {
				$result['address_id'] = $adress_id;
				$result['address'] = iconv('cp1251', 'utf8', $address_row->desk) . ", " . iconv('cp1251', 'utf8', $address_row->street) . " " . $address_row->house . (($address_row->body != NULL)?' корп. '.iconv('cp1251', 'utf8', $address_row->body):'');
				$result['note'] = iconv('cp1251', 'utf8', $address_row->note);
				$result['memo'] = iconv('cp1251', 'utf8', $address_row->memo);
				$result['address_desk'] = iconv('cp1251', 'utf8', $address_row->memo);
				$result['home_desk'] = iconv('cp1251', 'utf8', $address_row->home_desk);
				$result['longitude'] = ($address_row->longitude != NULL)? $address_row->longitude : '';
				$result['latitude'] = ($address_row->longitude != NULL)? $address_row->latitude : '';
			}
		} else {
			$result['error'] = 1;
		}
		return $result;
	}

	public function getBuildingsMap($region_interval='') {
		$r = DB::connection('sqlsrv')->select("exec pss..addres_get_info 1,'".$region_interval."'");
		$result = [];
		$result['type'] = 'FeatureCollection';
		$result['features'] = [];
		$i = 1;
		foreach($r as $row) {
			if ($row->latitude == null || $row->longitude == null) continue;
			$data = array();
			$data['type'] = 'Feature';
			$data['id'] = $i++;
			$data['geometry'] = [
				'type' => 'Point',
				'coordinates' => [$row->latitude, $row->longitude],
			];
			$data['properties'] =[
				'preset' => 'islands#greenDotIcon',
				'hintContent' => '<a href="/inventory/building/'.$row->address_id.'" target="_blank">Просмотреть схему дома</a>',
			];
			$result['features'][] = $data;
		}
		return $result;
	}

	public function getStreets($street) {
		$r = mssql_query("exec pss..eqp_find 2,'".$street.'"');
	}

	public function getAddressWCoord($region_interval='', $only_empty=true ) {
		if ($region_interval == '') {
			$r = DB::connection('sqlsrv')->select('exec pss..addres_get_info 0');
			$region_interval = '';
			foreach ($r as $result) {
				$region_interval .= $result->region_id . ",";
			};
			$region_interval = substr($region_interval, 0, strlen($region_interval) - 1);
		}
		$reg_city_res = DB::connection('sqlsrv')->select('exec pss..addres_get_info 6');
		$city_list = [];
		foreach($reg_city_res as $reg_city) {
			$city_list[$reg_city->region_id] = iconv('cp1251', 'utf8', $reg_city->city);
		}
		$r = DB::connection("exec pss..addres_get_info 1,'".$region_interval."'");
		$result = array();
		foreach($r as $row) {
			if ( $only_empty && ($row->longitude != NULL || $row->latitude != NULL || $row->address_type != 2)) continue;
			$data=array();
			$data['address'] = (isset($city_list[$row->region_id])?$city_list[$row->region_id]:iconv('cp1251', 'utf8', $row->desk)) . ", " . iconv('cp1251', 'utf8', $row->street) . " " . iconv('cp1251', 'utf8', $row->house) . (($row['body'] != NULL)?' корп. '.iconv('cp1251', 'utf8', $row['body']):'');
			$data['city'] = isset($city_list[$row->region_id])?$city_list[$row->region_id]: '';
			$data['region'] = iconv('cp1251', 'utf8', $row->desk);
			$data['street'] = iconv('cp1251', 'utf8', $row->street);
			$data['house'] = iconv('cp1251', 'utf8', $row->house) . (($row->body != NULL)?' корп. '.iconv('cp1251', 'utf8', $row->body):'');
			$data['address_id'] = $row->address_id;
			$data['longitude'] = $row->longitude;
			$data['latitude'] = $row->latitude;
			/*
			$coord = $this->getYandexCoord($data['address']);
			if ($coord != null) {
				$data['longitude'] = $coord[0];
				$data['latitude'] = $coord[1];
			} else {
				$data['longitude'] = '';
				$data['latitude'] = '';
			}*/
			$result[] = $data;
		}
		return $result;
	}



	public function getYandexCoord($address_string) {
		$params = array(
			'geocode' => "Москва, ".$address_string, // адрес
			'format'  => 'json',                          // формат ответа
			'results' => 1,                               // количество выводимых результатов
//        'key'     => '...',                           // ваш api key
		);
		$response = json_decode(file_get_contents('http://geocode-maps.yandex.ru/1.x/?' . http_build_query($params, '', '&')));

		if ($response->response->GeoObjectCollection->metaDataProperty->GeocoderResponseMetaData->found > 0)
		{
			$geo =  explode(' ', $response->response->GeoObjectCollection->featureMember[0]->GeoObject->Point->pos);
			$geo['address'] = $response->response->GeoObjectCollection->featureMember[0]->GeoObject->metaDataProperty->GeocoderMetaData->text;
			\Log::info($geo[0].";".$geo[1]);
			return $geo;
		} else {
			return null;
		}
	}

	public function getGoogleCoord($address_string) {
		$params = [
			'address' => $address_string,
		];
		$response = json_decode(file_get_contents('https://maps.googleapis.com/maps/api/geocode/json?'.http_build_query($params, '', '&')));
		$geo = [];
		if ($response->status == "OK") {
			$geo[0] = $response->results[0]->geometry->location->lng;
			$geo[1] = $response->results[0]->geometry->location->lat;
			$geo['address'] = $response->results[0]->formatted_address;
		}
		return $geo;
	}

	public function get2GisCoord($address_string) {
		$params = [
			'q' => $address_string,
			'types' => 'house',
			'version' => 1.3
		];
		$response = json_decode(file_get_contents('http://catalog.api.2gis.ru/geo/search?'.http_build_query($params, '', '&')));
		$geo = [];
		print_r($response);
		if ($response->response_code = 200) {
			preg_match('/POINT\(([0-9]{2}\.[0-9]+) ([0-9]{2}\.[0-9]+)\)/', $response->result[0]->centroid, $matches);
			$geo[0] = $response->result[0]->geometry->location->lng;
			$geo[1] = $response->result[0]->geometry->location->lat;
			$geo['address'] = $response->result[0]->name;
		}
		return $geo;
	}

	public function getCoordBuildings() {
		$r = DB::connection('sqlsrv')->select("exec pss..addres_get_info 1,'1'");
		$result = array();
		$i = 0;
		foreach($r as $row) {
			$data=array();
			$data['address_id'] = $row['address_id'];
			$data['address'] = iconv('cp1251', 'utf8', $row['desk']) . ", " . iconv('cp1251', 'utf8', $row['street']) . " " . $row['house'] . (($row['body'] != NULL)?' корп. '.iconv('cp1251', 'utf8', $row['body']):'');
			$data['longitude'] = ($row['longitude'] != NULL)? $row['longitude'] : '';
			$data['latitude'] = ($row['longitude'] != NULL)? $row['latitude'] : '';
			$result[] = $data;
		}
		return $result;
	}

	public function saveCoordinates($address_id, $longitude, $latitude) {
		$r = DB::connection('sqlsrv')->select("exec pss..geo_get 3, '".$address_id."','','','','', '".$longitude."', '".$latitude."'");
		$resp = mssql_fetch_assoc($r);
		if ($resp['error'] != 0) {
			$resp['msg'] = iconv('cp1251', 'utf8', $resp['msg']);
		}
		return $resp;
	}


	public function canChangeAddress() {
		try {
			DB::connection('sqlsrv')->select("exec bill..inventory_set_address 0");
			return true;
		} catch (\PDOException $e) {
			return false;
		}
	}

	public function canChangeMac() {
		try {
			DB::connection('sqlsrv')->select("exec bill..change_mac 0");
			return true;
		} catch (\PDOException $e) {
			return false;
		}
	}

	public function canChangeIp() {
		return false;
		try {
			DB::connection('sqlsrv')->select("exec bill..change_mac 0");
			return true;
		} catch (\PDOException $e) {
			return false;
		}
	}

	public function canChangeSource() {
		try {
			DB::connection('sqlsrv')->select("exec bill..inventory_set_source 0");
			return true;
		} catch (\PDOException $e) {
			return false;
		}
	}

	public function canChangeDesk() {
		try {
			DB::connection('sqlsrv')->select("exec bill..inventory_set_desk 0");
			return true;
		} catch (\PDOException $e) {
			return false;
		}
	}

	public function batchMacChange($file, $address_id)
	{
		$p = Excel::load($file, function ($reader) {
		})->get();
		$equipment = new Equipment();
		$systems = (array) $equipment->getEquipmentSystem();
		$error = 0;
		$action = 0;
		while ($action < 2 && $error == 0 ) {
			$result = [];
			foreach($p as $list) {
				foreach ($list as $i => $row) {
					$res_row = [];
					if (!isset($row['address_id']) || !isset($row['name']) || !isset($row['mac']) || !isset($row['type'])) {
						foreach ($row as $k => $cell) {
							if ($k) $res_row[$k] = $cell;
						}
						$res_row['error'] = -1;
						$res_row['msg'] = 'Не правильный формат файла';
						$result[] = $res_row;
						continue;
					}
					$row['address_id'] = intval($row['address_id']);
					if ($row['address_id'] == 0 || intval($row['address_id']) != $address_id) {
						foreach ($row as $k => $cell) {
							if ($k) $res_row[$k] = $cell;
						}
						$res_row['error'] = -1;
						$res_row['msg'] = 'Неправильный формат файла или пустой address_id';
						$result[] = $res_row;
						continue;
					}
					$device_info = $equipment->getRouteInfo(Helper::checkCyr($row['name']));
					if (!isset($device_info['address_id'])) {
						foreach ($row as $k => $cell) {
							if ($k) $res_row[$k] = $cell;
						}
						$res_row['error'] = -3;
						$res_row['msg'] = 'Устройства с таким именем нет в базе';
						$result[] = $res_row;
						continue;
					} elseif ($row['address_id'] != $device_info['address_id']) {
						foreach ($row as $k => $cell) {
							if ($k) $res_row[$k] = $cell;
						}
						$res_row['error'] = -2;
						$res_row['msg'] = 'Неправильный address_id';
						$result[] = $res_row;
						continue;
					}
					$k = array_search($row['type'], array_column($systems, 'desk'));
					Log::debug("MAC change: action $action, route " . Helper::checkCyr($row['name']) . ", mac " . Helper::checkCyr($row['mac']) . ", system:" . $systems[$k]->system);
					$resp = $equipment->equipmentChangeMac([
						'action' => $action,
						'route' => Helper::checkCyr($row['name']),
						'mac' => strtolower(Helper::checkCyr($row['mac']))
					], $action);
					foreach ($row as $k => $cell) {
						if ($k) $res_row[$k] = $cell;
					}
					if ($resp['error']) {
						$error = 1;
					}
					$res_row['error'] = $resp['error'];
					if ($res_row['error']) {
						$res_row['msg'] = $resp['msg'];
					} else {
						$res_row['error'] = 'OK';
					}
					$result[] = $res_row;
				}
				$action++;
			}
		}
		return $result;
	}

	public function setTemplate($name, $template_id) {
		try {
			$r = DB::connection('sqlsrv')->select("exec bill..route_template_set 1, ?, ?", [$name, $template_id]);
			if ($r[0]->error == 0) {
				return [
					'error' => 0,
					'msg' => 'OK'
				];
			} else {
				if (isset($r[0]->msg)) {
					return [
						'error' => $r[0]->error,
						'msg' => $r[0]->msg
					];
				} else {
					return [
						'error' => $r[0]->error,
						'msg' => 'Непредвиденная ошибка'
					];
				}
				Log::error("setTemplate error. Name: $name, template_id: $template_id");
			}
		} catch(\PDOException $e) {
			Log::error("setTemplate EXCEPTION. Name: $name, template_id: $template_id");
			Log::debug($e);
		}
	}

	public function getLocations() {
		$resp=[];
		try {
			$r = DB::connection('sqlsrv')->select("exec bill..locations_get_list 1");
			foreach($r as $row) {
				$resp[] = [
					'id' => $row->location_id,
					'desk' => $row->location_id." ".Helper::cyr($row->name),
				];
			}
		} catch(\PDOException $e) {
			Log::error('getLocations EXCEPTION.');
		}
		return $resp;
	}

	public function getVLans($location, $system, $system_group=null) {
		$resp=[];
		try {
			if ($system_group) {
				$r = DB::connection('sqlsrv')->select("exec bill..vlan_get 1, ?, -99999, ?", [$location, $system_group]);
			} else {
				$r = DB::connection('sqlsrv')->select("exec bill..vlan_get 1, ?, ?", [$location, $system]);
			}
			foreach($r as $vlan_row) {
				$resp[] = [
					'id'=>$vlan_row->vlan_id,
					'desk' => Helper::cyr($vlan_row->name),
				];
			}
		} catch(\PDOException $e) {
			Log::error('getVlans EXCEPTION');
		}
		return $resp;
	}

	public function getModels($group) {
		$resp=[];
		try {
			$r = DB::connection('sqlsrv')->select("exec bill..route_model_get 1, ?", [$group]);
			foreach($r as $model_row) {
				$resp[] = [
					'id' => $model_row->model_id,
					'desk' => Helper::cyr($model_row->desk),
				];
			}
		} catch(\PDOException $e) {
			Log::error('getModels EXCEPTION');
		}
		return $resp;
	}

	public function getIpList($location, $vlan) {
		$resp=[];
		try {
			$r = DB::connection('sqlsrv')->select("exec bill..inventory_get_ip 1, ?, ?, ?, ?", [$location, $vlan, 0, 0]);
			foreach($r as $ip_row) {
				$resp[] = [
					'ip_addr' => $ip_row->ip_addr,
					'location_id' => $ip_row->location_id,
					'location_desk' => Helper::cyr($ip_row->location_desk),
					'vlan_id' => Helper::cyr($ip_row->vid),
					'vlan_desk' => Helper::cyr($ip_row->vlan_name)
				];
			}
		} catch(\PDOException $e) {
			Log::error('getIpList EXCEPTION');
		}
		return $resp;
	}

	public function getLocationsList($search_string='') {
		$resp = [];
		$search_string = Helper::cyr1251($search_string);
		try {
			$r = DB::connection('sqlsrv')->select("exec bill..inventory_get_locations 2, ?", [$search_string]);
			$param_types = $this->getLocationParams();
			foreach($r as $i=>$location_row) {
				$params = explode(';',Helper::cyr($location_row->location_parameters));
				unset($params[0]);
				$params_list = [];
				foreach($params as $param) {
					$param = explode('=', $param);
					foreach($param_types as $pt) {
						if ($pt['name'] == $param[0]) {
							$params_list[$pt['type']] = [
								'name'=>$param[0],
								'value'=>$param[1]
							];
							break;
						}
					}

				}
				$resp[] = [
					'key' => 'loc-'.$i,
					'location_id' => $location_row->id,
					'name' => Helper::cyr($location_row->name),
					'desk' => Helper::cyr($location_row->desk),
					'params' => $params_list
				];
			};
		} catch(\PDOException $e) {
			Log::error('getLocationsList EXCEPTION');
		}
		return $resp;
	}

	public function getServicesList() {
		$resp = [];
		try {
			$r = DB::connection('sqlsrv')->select("exec bill..isg_service_get 1");
			foreach($r as $location_row) {
				$resp[] = [
					'service_id' => $location_row->id,
					'name' => Helper::cyr($location_row->name),
					'desc' => Helper::cyr($location_row->desk),
					'username' => Helper::cyr($location_row->username),
					'attribute' => $location_row->attribute,
					'op' => Helper::cyr($location_row->op),
					'value' => Helper::cyr($location_row->value),
				];
			}
		} catch(\PDOException $e) {
			Log::error('getServicesList EXCEPTION');
		}
		return $resp;
	}

	public function getLinkTypeIdByPrefix($prefix) {
		$prefix = trim(Helper::checkCyr($prefix));
		try {
			$r = DB::connection('sqlsrv')->select("exec bill..route_direction_type_get 1, ?", [$prefix]);
			return isset($r[0])?$r[0]->type:0;
		} catch(\PDOException $e) {
			Log::error("getLinkTypeIdByPrefix EXCEPTION. Prefix: $prefix");
			return 0;
		}
	}

	public function getVlanIdByVid($vid) {
		try {
			$r = DB::connection('sqlsrv')->select("exec bill..vlan_info_get 1, '', ?", [$vid]);
			return isset($r[0])?$r[0]->id:0;
		} catch(\PDOException $e) {
			Log::error("getVlanIdByVid EXCEPTION. Prefix: $vid");
			return 0;
		}
	}

	public function addService($name, $desc) {
		try {
			$r = DB::connection('sqlsrv')->select('exec bill..isg_service_desk_new 1,0, ?, ?', [Helper::cyr1251($name), Helper::cyr1251($desc)]);
			if (isset($r[0])) {
				if ($r[0]->error == 0) {
					return [
						'error'=>0,
						'msg'=>'OK'
					];
				} else {
					return [
						'error' => $r[0]->error,
						'msg' => $r[0]->msg
					];
				}
			} else {
				return [
					'error' => -1,
					'msg' => 'Unexpected error'
				];
			}
		} catch(\PDOException $e) {
			Log::error("addService EXCEPTION. Name: $name, Descr: $desc");
			return [
				'error' => -1,
				'msg' => 'Unexpected error'
			];
		}
	}

	public function modifyService($id, $name, $desc) {
		try {
			$r = DB::connection('sqlsrv')->select('exec bill..isg_service_desk_modify 1, ?, ?, ?', [$id, Helper::cyr1251($name), Helper::cyr1251($desc)]);
			if (isset($r[0])) {
				if ($r[0]->error == 0) {
					return [
						'error'=>0,
						'msg'=>'OK'
					];
				} else {
					return [
						'error' => $r[0]->error,
						'msg' => $r[0]->msg
					];
				}
			} else {
				return [
					'error' => -1,
					'msg' => 'Unexpected error'
				];
			}
		} catch(\PDOException $e) {
			Log::error("modifyService EXCEPTION. Id: $id Name: $name, Desc: $desc");
			return [
				'error' => -1,
				'msg' => 'Unexpected error'
			];
		}
	}

	public function getNagiosCrashes() {
		$resp = [];
		try {
			$r = DB::connection('sqlsrv')->select('exec bill..report_alert 0');
			foreach($r as $k=>$crash_row) {
				$resp[] = [
					'id' => $k,
					'route' => $crash_row->route,
					'last_tech' => $crash_row->last_tech,
					'system' => $crash_row->system,
					'region' => Helper::cyr($crash_row->region_desk),
					'street' => Helper::cyr($crash_row->street),
					'house' => iconv('cp1251', 'utf8', $crash_row->house).(($crash_row->body != NULL)?' корп. '.iconv('cp1251', 'utf8', $crash_row->body):''),
					'qty' => $crash_row->qty,
					'ip_addr' => $crash_row->ip_addr,
					'duration' => $crash_row->duration
				];
			}
		} catch(\PDOException $e) {
			Log::error("getNagiosCrash exception");
		}
		return $resp;
	}

	public function getNagiosFlaps($type) {
		$resp = [];
		try {
			$r = DB::connection('sqlsrv')->select('exec bill..report_alert 1, ?',[$type]);
			foreach($r as $crash_row) {
				$resp[] = [
					'route' => $crash_row->route,
					'system' => $crash_row->system,
					'region' => Helper::cyr($crash_row->region_desk),
					'street' => Helper::cyr($crash_row->street),
					'house' => iconv('cp1251', 'utf8', $crash_row->house).(($crash_row->body != NULL)?' корп. '.iconv('cp1251', 'utf8', $crash_row->body):''),
					'qty' => $crash_row->qty,
					'last_date' => $crash_row->last_date,
					'lost_time' => $crash_row->lost_time,
					'ip_addr' => $crash_row->ip_addr,
				];
			}
		} catch(\PDOException $e) {
			Log::error("getNagiosCrash exception");
		}
		return $resp;
	}

	public function getNagiosReportTypes() {
		$resp=[];
		try {
			$r = DB::connection('sqlsrv')->select('exec bill..report_alert 2');
			foreach($r as $r_type) {
				$resp[] = [
					'type' => $r_type->type,
					'desk' => Helper::cyr($r_type->desk)
				];
			}
		} catch(\PDOException $e) {
			Log::error("getNagiosReportTypes exception");
		}
		return $resp;
	}

	public function equipmentList($file) {
		$p = Excel::load($file, function($reader) {
			$reader->formatDates(false);
			$reader->toArray();
		})->get();
		$error = 0;
		$msg = 'OK';
		$data = [];
		foreach($p as $list) {
			foreach ($list as $i => $row) {
				if (isset($row['name'])) {
					if ($row['name'] != '') {
						$data[] = $row['name'];
					} else {
						$error = -1;
						$msg = 'В файле не заполнено поле name';
					}
				} else {
					$error = -2;
					$msg = 'В файле отсутствует поле name';
					break;
				}
			}
		}
		return [
			'error' => $error,
			'msg' => $msg,
			'data' => $data
		];
	}

	public function addLocation($name, $desk, $params) {
		try {
			$r = DB::connection('sqlsrv')->select('exec bill..inventory_location_create 1, ?, ?', [Helper::cyr1251($name), Helper::cyr1251($desk)]);
			Log::debug("exec bill..inventory_location_create 1, $name, $desk");
			if (isset($r[0]->error)) {
				if ($r[0]->error == 0) {
					$error = 0;
					$msg = '';
					foreach($params as $k=>$param) {
						$resp = $this->addLocationParam($r[0]->location_id, $k, $param);
						if ($resp['error']!=0) {
							$error = 1;
							$msg .= $resp['msg'].'; ';
						}
					}
					if ($error == 0) {
						return [
							'error' => 0,
							'msg' => 'OK'
						];
					} else {
						return [
							'error' => -1,
							'msg' => 'При сохранении параметров возникли ошибки: '.$msg
						];
					}
				} else {
					return [
						'error' => $r[0]->error,
						'msg' => $r[0]->msg
					];
				}
			} else {
				Log::error('addLocation error. Undefined error field');
				return [
					'error' => -1,
					'msg' => 'Ошибка при добавлении локации'
				];
			}
		} catch(\PDOException $e) {
			Log::error('addLocation PDO exception.');
			Log::debug($e->getMessage());
		}
	}

	public function modifyLocation($location_id, $name, $desk, $params) {
		try {
    		$r = DB::connection('sqlsrv')->select('exec bill..inventory_location_edit 1, ?, ?, ?', [$location_id, Helper::cyr1251($name), Helper::cyr1251($desk)]);
			Log::debug("exec bill..inventory_location_edit 1, $location_id, $name, $desk");
			if (isset($r[0]->error)) {
				if ($r[0]->error == 0) {
					$error = 0;
					$msg = '';
					foreach($params as $k=>$param) {
						$resp = $this->addLocationParam($location_id, $k, $param);
						if ($resp['error']!=0) {
							$error = 1;
							$msg .= $resp['msg'].'; ';
						}
					}
					if ($error == 0) {
						return [
							'error' => 0,
							'msg' => 'OK'
						];
					} else {
						return [
							'error' => -1,
							'msg' => 'При сохранении параметров возникли ошибки: '.$msg
						];
					}
				} else {
					return [
						'error' => $r[0]->error,
						'msg' => $r[0]->msg
					];
				}
			} else {
				Log::error('modifyLocation error. Undefined error field');
				return [
					'error' => -1,
					'msg' => 'Ошибка при редактировании локации'
				];
			}
		} catch(\PDOException $e) {
			Log::error('modifyLocation PDO exception.');
			Log::debug($e->getMessage());
			return [
				'error' => -1,
				'msg' => 'Ошибка при редактировании локации'
			];
		}
	}

	public function addLocationParam($location_id, $type, $value) {
		Log::debug("addLocationParam $location_id, $type, $value");
		$params = $this->getLocationParams();
		$name = '';
		foreach($params as $param) {
			if ($type == $param['type']) {
				$name = $param['name'];
				break;
			}
		}
		try {
			$r = DB::connection('sqlsrv')->select('exec bill..inventory_location_parameter_set 1, ?, ?, ?',[$location_id, $type, $value]);
			Log::debug("exec bill..inventory_location_parameter_set 1, $location_id, $type, $value");
			if (isset($r[0]->error)) {
				if ($r[0]->error == 0) {
					return [
						'error' => 0,
						'msg' => 'OK'
					];
				} else {
					return [
						'error' => $r[0]->error,
						'msg' => $name.': '.$r[0]->msg
					];
				}
			} else {
				Log::error('addLocation error. Undefined error field');
				return [
					'error' => -1,
					'msg' => 'Ошибка при добавлении параметра'
				];
			}
		} catch(\PDOException $e) {
			Log::error('addLocationParam PDO exception.');
			Log::debug($e->getMessage());
		}
	}

	/**
	 * Delete location
	 *
	 * @param $location_id
	 *
	 * @return array
	 */
	public function deleteLocation($location_id) {
		Log::debug("exec bill..inventory_location_delete 1, $location_id");
		try {
			$r = DB::connection('sqlsrv')->select('exec bill..inventory_location_delete 1, ?', [$location_id]);
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
			Log::error("deleteLocation EXCEPTION");
			Log::debug($e->getMessage());
			return [
				'error' => -1,
				'msg' => 'Ошибка при удалении локации'
			];
		}
	}

	public function getLocationParams() {
		$resp = [];
		try {
			$r = DB::connection('sqlsrv')->select('exec bill..location_parameter_type_desk_get 1');
			foreach($r as $row) {
				$resp[] = [
					'type' => $row->type,
					'name' => Helper::cyr($row->name),
					'descr' => Helper::cyr($row->desk),
					'format' => $row->format
				];
			}
		} catch(\PDOException $e) {
			Log::error('modifyLocation PDO exception.');
			Log::debug($e->getMessage());
		}
		return $resp;
	}

	public function searchVlans($search_string) {
		$search_string = Helper::cyr1251($search_string);
		$resp = [
			'data' => [],
			'error' => 0,
			'msg' => '',
		];
		try {
			$data = [];
			$r = DB::connection('sqlsrv')->select('exec bill..inventory_get_vlans 1, ?', [$search_string]);
			foreach($r as $row) {
				$data[] = [
					'id' => $row->id,
					'vid' => $row->vid,
					'name' => Helper::cyr($row->name),
					'desk' => Helper::cyr($row->desk),
					'prefix' => Helper::cyr($row->prefix)
				];
			}
			$resp['data'] = $data;
		} catch(\PDOException $e) {
			Log::error('modifyLocation PDO exception.');
			Log::debug($e->getMessage());
			$resp['error'] = -1;
			$resp['msg'] = 'Непредвиденная ошибка';
		}
		return $resp;
	}

	public function addVlan($name, $desk, $vid, $brand) {
		try {
			$r = DB::connection('sqlsrv')->select('exec bill..inventory_new_vlans 1, ?, ?, ?, ?', [$vid, Helper::cyr1251($name), Helper::cyr1251($desk), $brand]);
			Log::debug("exec bill..inventory_new_vlans 1, $vid, $name, $desk, $brand");
			if (isset($r[0]->error)) {
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
			} else {
				Log::error('modifyLocation error. Undefined error field');
				return [
					'error' => -1,
					'msg' => 'Ошибка при редактировании VLANa'
				];
			}
		} catch(\PDOException $e) {
			Log::error('addVlan PDO exception.');
			Log::debug($e->getMessage());
			return [
				'error' => -1,
				'msg' => 'Ошибка при редактировании VlANa'
			];
		}
	}

	public function modifyVlan($vlan_id, $name, $desk, $vid, $brand) {
		try {
			$r = DB::connection('sqlsrv')->select('exec inventory_set_cadastral 1, ?, ?, ?, ?, ?', [$vlan_id, $vid, Helper::cyr1251($name), Helper::cyr1251($desk), $brand]);
			Log::debug("exec bill..inventory_new_vlans 1, $vid, $name, $desk, $brand");
			if (isset($r[0]->error)) {
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
			} else {
				Log::error('modifyLocation error. Undefined error field');
				return [
					'error' => -1,
					'msg' => 'Ошибка при редактировании VLANa'
				];
			}
		} catch(\PDOException $e) {
			Log::error('addVlan PDO exception.');
			Log::debug($e->getMessage());
			return [
				'error' => -1,
				'msg' => 'Ошибка при редактировании VlANa'
			];
		}
	}

	/**
	 * Return list of interface
	 *
	 * @param string $search_string - search string for interface
	 *
	 * @return array
	 */
	public function getInterfaces($search_string, $export=false) {
		$search_string = Helper::cyr1251($search_string);
		try {
			$r = DB::connection('sqlsrv')->select('exec bill..inventory_iface_nas_get 1, ?', [$search_string]);
			$data=[];
			foreach($r as $row) {
				if ($export) {
					$data[] = [
						'ID' => $row->rec_id,
						'Интерфейс' => Helper::cyr($row->iface),
						'NAS_PORT_ID' => Helper::cyr($row->nas_port_id),
						'Бренд' => 	Helper::cyr($row->prefix),
						'Локация' => Helper::cyr($row->location_name),
						'Название' => Helper::cyr($row->iface_name),
						'Описание' => Helper::cyr($row->iface_desk),
					];
				} else {
					$data[] = [
						'id' => $row->rec_id,
						'location_id' => $row->location_id,
						'location_name' => Helper::cyr($row->location_name),
						'iface' => Helper::cyr($row->iface),
						'nas_port_id' => Helper::cyr($row->nas_port_id),
						'iface_name' => Helper::cyr($row->iface_name),
						'iface_descr' => Helper::cyr($row->iface_desk),
						'brand_id' => $row->brand_id,
						'brand_descr' => Helper::cyr($row->prefix)
					];
				}
			}
			$resp = [
				'data' => $data,
				'error' => 0
			];
			return $resp;
		} catch(\PDOException $e) {
			Log::error('getInterfaces PDO exception.');
			Log::debug($e->getMessage());
			return [
				'error' => -1,
				'msg' => 'Ошибка при получении списка интерфейсов'
			];
		}
	}

	/**
	 * adding interface
	 *
	 * @param array $params
	 *
	 * @return array
	 */
	public function addInterface($params) {
		Log::debug($params);
		Log::debug("exec bill..inventory_location_iface_nas_set 1,
			:location_id,
			:name,
			:descr,
			:brand_id,
			:iface,
			:nas_port_id");
		$params['name'] = Helper::cyr1251($params['name']);
		$params['descr'] = Helper::cyr1251($params['descr']);
		$params['iface'] = Helper::cyr1251($params['iface']);
		try {
			$r = DB::connection('sqlsrv')->select('exec bill..inventory_location_iface_nas_set 1,
			:location_id,
			:name,
			:descr,
			:brand_id,
			:iface,
			:nas_port_id', $params);
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
						'msg' => Helper::cyr($r[0]->msg)
					];
				}
			} else  {
				return [
					'error' => -1,
					'msg' => 'Непредвиденная ошибка'
				];
			}
		} catch(\PDOException $e) {
			Log::error("addInterface EXCEPTION");
			Log::debug($e->getMessage());
			return [
				'error' => -1,
				'msg' => 'Ошибка при добавлении интерфейса'
			];
		}
	}

	/**
	 * Edit interface
	 *
	 * @param array $params
	 *
	 * @return array
	 */
	public function editInterface($params) {
		Log::debug($params);
		$params['name'] = Helper::cyr1251($params['name']);
		$params['descr'] = Helper::cyr1251($params['descr']);
		$params['iface'] = Helper::cyr1251($params['iface']);
		Log::debug("exec bill..inventory_location_iface_nas_edit 1,
			:id,
			:location_id,
			:name,
			:descr,
			:brand_id,
			:iface,
			:nas_port_id");
		try {
			$r = DB::connection('sqlsrv')->select('exec bill..inventory_location_iface_nas_edit 1,
			:id,
			:location_id,
			:name,
			:descr,
			:brand_id,
			:iface,
			:nas_port_id', $params);
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
						'msg' => Helper::cyr($r[0]->msg)
					];
				}
			} else  {
				return [
					'error' => -1,
					'msg' => 'Непредвиденная ошибка'
				];
			}
		} catch(\PDOException $e) {
			Log::error("editInterface EXCEPTION");
			Log::debug($e->getMessage());
			return [
				'error' => -1,
				'msg' => 'Ошибка при редактировании интерфейса'
			];
		}
	}

	/**
	 * Delete interface
	 *
	 * @param $iface_id
	 *
	 * @return array
	 */
	public function deleteInterface($iface_id) {
		Log::debug("exec bill..inventory_location_iface_nas_edit 2, $iface_id");
		try {
			$r = DB::connection('sqlsrv')->select('exec bill..inventory_location_iface_nas_edit 2, ?', [$iface_id]);
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
			Log::error("deleteInterface EXCEPTION");
			Log::debug($e->getMessage());
			return [
				'error' => -1,
				'msg' => 'Ошибка при удалении интерфейса'
			];
		}
	}


}
