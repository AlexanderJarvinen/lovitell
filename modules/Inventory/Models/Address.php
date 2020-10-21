<?php

namespace Modules\Inventory\Models;

use App\Components\Helper;
use \Log;
use \DB;
use \Storage;

class Address
{
	public function getRegions($region_id = 0, &$region = '')
	{
		$result = [];
//	  	$r = mssql_query('exec pss..addres_get_info 0', $this->connection);
		$r = DB::connection('sqlsrv')->select('exec pss..addres_get_info 0');
		foreach ($r as $key => $r_row) {
			$r[$key]->desk = iconv('cp1251', 'utf8', $r_row->desk);
			if ($region_id && $region_id == $r_row->region_id) {
				$region = $r[$key]->desk;
			}
		}
		return $r;
	}

	public function getRegionsForCities($cities)
	{

		$resp = [];
		foreach ($cities as $city_id) {
			$city_id = intval($city_id);
			$r = DB::connection('sqlsrv')->select("exec pss..addres_get_info 0,?", [$city_id]);
			foreach ($r as $k => $r_row) {
				$resp[] = ['desk' => iconv('cp1251', 'utf8', $r_row->desk),
					'region_id' => $r_row->region_id];
			}
		}
		return $resp;
	}

	public function getBuildings($region_interval = '', $street_string = '')
	{
		$r = DB::connection('sqlsrv')->select("exec addres_get_info 1, ?, ?", [$region_interval, $street_string]);
		$result = [];
		foreach ($r as $row) {
			if (isset($region_list) && count($region_list)) {
				if (array_search($row->region_id, $region_list) === false) continue;
			}
			$data = array();
			$data[] = iconv('cp1251', 'utf8', $row->region_desk);
			$data[] = iconv('cp1251', 'utf8', $row->prefix).' '.iconv('cp1251', 'utf8', $row->street_desk);
			$data[] = iconv('cp1251', 'utf8', $row->house) . (($row->body != NULL) ? ' корп. ' . iconv('cp1251', 'utf8', $row->body) : '');
			$data['address_id'] = $row->address_id;
			$result['data'][] = $data;
		}
		return $result;
	}

	public function getEquipments($region_interval = '')
	{
		$r = DB::connection('sqlsrv')->select("exec  pss..eqp_find 0,'" . $region_interval . "'");
		$result = array();
		foreach ($result as $row) {
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

	public function getAddressInformation($address_id, $split_build = false)
	{
		$address_id = intval($address_id);
		$resp = [];
		$r = DB::connection('sqlsrv')->select("exec pss..addres_get_info 4," . $address_id);
		if ($address_row = $r[0]) {
			$resp['address_id'] = $address_id;
			$resp['address'] = iconv('cp1251', 'utf8', $address_row->desk) . ", " . iconv('cp1251', 'utf8', $address_row->street) . " " . iconv('cp1251', 'utf8', $address_row->house) . (($address_row->body != NULL) ? ' корп. ' . iconv('cp1251', 'utf8', $address_row->body) : '');
			$resp['street'] = iconv('cp1251', 'utf8', $address_row->street);
			$resp['street_id'] = $address_row->street_id;
			$resp['city_id'] = $address_row->city_id;
			$resp['city'] = 'Москва';//iconv('cp1251', 'utf8', $address_row->city_desk);
			$resp['region_id'] = $address_row->region_id;
			$resp['region'] = iconv('cp1251', 'utf8', $address_row->desk);
			$resp['construction_type'] = $address_row->construction_type;
			if ($split_build) {
				$resp['build'] = iconv('cp1251', 'utf8', $address_row->house);
				$resp['body'] = iconv('cp1251', 'utf8', $address_row->body);
			} else {
				$resp['build'] = iconv('cp1251', 'utf8', $address_row->house) . (($address_row->body != NULL) ? ' корп. ' . iconv('cp1251', 'utf8', $address_row->body) : '');
			}
		}
		return $resp;
	}

	public function getBuildingGeneralInformation($address_id)
	{
		$address_id = intval($address_id);
		$r = DB::connection('sqlsrv')->select("exec pss..addres_get_desk_for_all 1," . $address_id);
		$result = [];
		foreach($r as $address_row) {
			$result['address_id'] = $address_id;
			$result['city_id'] = $address_row->city_id;
			$result['region_id'] = $address_row->region_id;
			$result['street_id'] = $address_row->region_id;
			$result['address'] = iconv('cp1251', 'utf8', $address_row->desk) . ", " . iconv('cp1251', 'utf8', $address_row->street) . " " . iconv('cp1251', 'utf8', $address_row->house) . (($address_row->body != NULL) ? ' корп. ' . iconv('cp1251', 'utf8', $address_row->body) : '');
			$result['error'] = 0;
			if ($address_row->construction_type==2) break;
		}
		return $result;
	}

	public function getBuildingInformation($address_id)
	{
		$address_id = intval($address_id);
		$r = DB::connection('sqlsrv')->select("exec pss..addres_get_desk_for_all 1," . $address_id);
		$result = [
			'militia_params' => null,
			'building_params' => null
		];
		foreach($r as $address_row) {
			if (isset($address_row->construction_type)) {
				if ($address_row->construction_type == 1) {
					$building_params = [];
					$building_params['address_id'] = $address_id;
					$building_params['address'] = iconv('cp1251', 'utf8', $address_row->desk) . ", " . iconv('cp1251', 'utf8', $address_row->street) . " " . iconv('cp1251', 'utf8', $address_row->house) . (($address_row->body != NULL) ? ' корп. ' . iconv('cp1251', 'utf8', $address_row->body) : '');
					$building_params['street'] = iconv('cp1251', 'utf8', $address_row->street);
					$building_params['street_id'] = $address_row->street_id;
					$building_params['city_id'] = $address_row->city_id;
					$building_params['city'] = iconv('cp1251', 'utf8', $address_row->city_desk);
					$building_params['region_id'] = $address_row->region_id;
					$building_params['region'] = iconv('cp1251', 'utf8', $address_row->desk);
					$building_params['clients'] = $address_row->clients;
					$building_params['price'] = iconv('cp1251', 'utf8', $address_row->price);
					$building_params['build'] = iconv('cp1251', 'utf8', $address_row->house);
					$building_params['body'] = iconv('cp1251', 'utf8', $address_row->body);
					$building_params['entrance'] = $address_row->entrances;
					$building_params['floors'] = $address_row->max_floor;
					$building_params['hometype'] = $address_row->home_type;
					$building_params['hometype_desk'] = iconv('cp1251', 'utf8', $address_row->home_desk);
					$building_params['note'] = iconv('cp1251', 'utf8', $address_row->note);
					$building_params['memo'] = iconv('cp1251', 'utf8', $address_row->memo);
					$building_params['build_status'] = $address_row->address_type;
					$building_params['build_status_desk'] = iconv('cp1251', 'utf8', $address_row->address_desk);
					$building_params['address_desk'] = iconv('cp1251', 'utf8', $address_row->memo);
					$building_params['home_desk'] = iconv('cp1251', 'utf8', $address_row->home_desk);
					$building_params['longitude'] = ($address_row->longitude != NULL) ? $address_row->longitude : '';
					$building_params['latitude'] = ($address_row->longitude != NULL) ? $address_row->latitude : '';
					$result['building_params'] = $building_params;
				} elseif ($address_row->construction_type == 2) {
					$militia_params = [];
					$militia_params['address_id'] = $address_id;
					$militia_params['address'] = iconv('cp1251', 'utf8', $address_row->desk) . ", " . iconv('cp1251', 'utf8', $address_row->street) . " " . iconv('cp1251', 'utf8', $address_row->house) . (($address_row->body != NULL) ? ' корп. ' . iconv('cp1251', 'utf8', $address_row->body) : '');
					$militia_params['street'] = iconv('cp1251', 'utf8', $address_row->street);
					$militia_params['street_id'] = $address_row->street_id;
					$militia_params['city_id'] = $address_row->city_id;
					$militia_params['city'] = iconv('cp1251', 'utf8', $address_row->city_desk);
					$militia_params['region_id'] = $address_row->region_id;
					$militia_params['region'] = iconv('cp1251', 'utf8', $address_row->desk);
					$militia_params['clients'] = $address_row->clients;
					$militia_params['price'] = iconv('cp1251', 'utf8', $address_row->price);
					$militia_params['build'] = iconv('cp1251', 'utf8', $address_row->house);
					$militia_params['body'] = iconv('cp1251', 'utf8', $address_row->body);
					$militia_params['entrance'] = $address_row->entrances;
					$militia_params['floors'] = $address_row->max_floor;
					$militia_params['hometype'] = $address_row->home_type;
					$militia_params['hometype_desk'] = iconv('cp1251', 'utf8', $address_row->home_desk);
					$militia_params['note'] = iconv('cp1251', 'utf8', $address_row->note);
					$militia_params['memo'] = iconv('cp1251', 'utf8', $address_row->memo);
					$militia_params['build_status'] = $address_row->address_type;
					$militia_params['build_status_desk'] = iconv('cp1251', 'utf8', $address_row->address_desk);
					$militia_params['address_desk'] = iconv('cp1251', 'utf8', $address_row->memo);
					$militia_params['home_desk'] = iconv('cp1251', 'utf8', $address_row->home_desk);
					$militia_params['longitude'] = ($address_row->longitude != NULL) ? $address_row->longitude : '';
					$militia_params['latitude'] = ($address_row->longitude != NULL) ? $address_row->latitude : '';
					$result['militia_params'] =$militia_params;
				}
			}
		}
		$result['address_id'] = $address_id;
		if ($result['militia_params'] || $result['building_params']) {
			$result['address'] = $result['militia_params']?$result['militia_params']['address']:$result['building_params']['address'];
			$result['city_id'] = $result['militia_params']?$result['militia_params']['city_id']:$result['building_params']['city_id'];
			$result['region_id'] = $result['militia_params']?$result['militia_params']['region_id']:$result['building_params']['region_id'];
			$result['street_id'] = $result['militia_params']?$result['militia_params']['street_id']:$result['building_params']['street_id'];
			$result['build_status'] = $result['militia_params']?$result['militia_params']['build_status']:$result['building_params']['build_status'];
			$result['build_status_desk'] = $result['militia_params']?$result['militia_params']['build_status_desk']:$result['building_params']['build_status_desk'];
			$result['address_desk'] = $result['militia_params']?$result['militia_params']['address_desk']:$result['building_params']['address_desk'];
			$result['error'] = 0;
		}
		return $result;
	}

	public function getAddressInfoByConstrunctionType($address_id, $construction_type) {
		$address_info = $this->getBuildingInformation($address_id);
		if ($construction_type == 1 && isset($address_info['building_params'])) {
			return $address_info['building_params'];
		} else if ($construction_type == 2 && isset($address_info['militia_params'])) {
			return $address_info['militia_params'];
		}
		return false;
}

	public function getBuildingsMap($region_interval = '')
	{
		$r = DB::connection('sqlsrv')->select("exec pss..addres_get_info 1,'" . $region_interval . "'");
		$result = [];
		$result['type'] = 'FeatureCollection';
		$result['features'] = [];
		$i = 1;
		foreach ($r as $row) {
			if ($row->latitude == null || $row->longitude == null) continue;
			$data = array();
			$data['type'] = 'Feature';
			$data['id'] = $i++;
			$data['geometry'] = [
				'type' => 'Point',
				'coordinates' => [$row->latitude, $row->longitude],
			];
			$data['properties'] = [
				'preset' => 'islands#greenDotIcon',
				'hintContent' => '<a href="/inventory/building/' . $row->address_id . '" target="_blank">Просмотреть схему дома</a>',
			];
			$result['features'][] = $data;
		}
		return $result;
	}

	public function getStreets($region_id, $street_id = 0, &$street = '')
	{
		$region_id = intval($region_id);
		$r = [];
		if ($region_id) {
			$r = DB::connection('sqlsrv')->select('exec pss..get_street_list 1,null, ?,0', [$region_id]);
			foreach ($r as $k => $street_row) {
				$r[$k]->street = iconv('cp1251', 'utf8', $r[$k]->street);
				$r[$k]->prefix = iconv('cp1251', 'utf8', $r[$k]->prefix);
				$r[$k]->region_desk = iconv('cp1251', 'utf8', $r[$k]->region_desk);
				$r[$k]->city_desk = iconv('cp1251', 'utf8', $r[$k]->city_desk);
				if ($street_id && $r[$k]->id == $street_id) {
					$street = $r[$k]->street;
				}
			}
		}
		return $r;
	}

	public function getCitysStreets($city_id) {
		$r = [];
		if ($city_id) {
			$r = DB::connection('sqlsrv')->select('exec pss..get_street_list 1,null, ?,0', [$city_id]);
			foreach ($r as $k => $street_row) {
				$r[$k]->street = iconv('cp1251', 'utf8', $r[$k]->street);
				$r[$k]->prefix = iconv('cp1251', 'utf8', $r[$k]->prefix);
				$r[$k]->region_desk = iconv('cp1251', 'utf8', $r[$k]->region_desk);
				$r[$k]->city_desk = iconv('cp1251', 'utf8', $r[$k]->city_desk);
			}
		}
		return $r;
	}

	public function searchStreet($street_string, $region_id = 0, $city_id = 0, $street_only = false)
	{
		$street_string = iconv('utf8', 'cp1251', $street_string);
		$resp = [];
		if ($street_string == '') {
			$street_only = true;
			if ($region_id != 0) {
				$r = DB::connection('sqlsrv')->select('exec pss..get_street_list 1,null, ?,0', [$region_id]);
				foreach ($r as $k => $rrow) {
					if ($street_only) {
						$resp[] = [
							'key' => $rrow->id,
							'value' => iconv('cp1251', 'utf8', $rrow->prefix . " " . $rrow->street),
						];
					} else {
						$resp[] = [
							'key' => $rrow->city_id . "-" . $rrow->region_id . "-" . $rrow->street_id,
							'value' => iconv('cp1251', 'utf8', $rrow->city_desk . " - " . $rrow->region_desk . " - " . $rrow->prefix . " " . $rrow->street_desk),
						];
					}
				}
			} else if ($city_id != 0) {
				$r = DB::connection('sqlsrv')->select('exec pss..get_street_list 2, null, ?', [$city_id]);
				foreach ($r as $k => $rrow) {
					if ($street_only) {
						$resp[] = [
							'key' => $rrow->id,
							'value' => iconv('cp1251', 'utf8', $rrow->prefix . " " . $rrow->street),
						];
					} else {
						$resp[] = [
							'key' => $rrow->city_id . "-" . $rrow->region_id . "-" . $rrow->street_id,
							'value' => iconv('cp1251', 'utf8', $rrow->city_desk . " - " . $rrow->region_desk . " - " . $rrow->prefix . " " . $rrow->street_desk),
						];
					}
				}
			}
		} else if ($street_string != '') {
			$r = DB::connection('sqlsrv')->select("exec pss..street_filter 0, ?", [$street_string]);
			foreach ($r as $k => $rrow) {
				if ($street_only) {
					$resp[] = [
						'key' => $rrow->street_id,
						'value' => iconv('cp1251', 'utf8', $rrow->prefix . " " . $rrow->street_desk),
					];
				} else {
					$resp[] = [
						'key' => $rrow->city_id . "-" . $rrow->region_id . "-" . $rrow->street_id,
						'value' => iconv('cp1251', 'utf8', $rrow->city_desk . " - " . $rrow->region_desk . " - " . $rrow->prefix . " " . $rrow->street_desk),
					];
				}
			}
		}
		return $resp;
	}

	/**
	 * Adding new street
	 *
	 * @param $street_name string Street`s name
	 * @param $city_id integer Identifier of city, in which streets added
	 * @param $street_type integer Identifier of type of street
	 * @param $regions array List of regions identifier`s in which streets added
	 *
	 * @return array
	 */
	public function addStreet($street_name, $city_id, $street_type, $regions=null)
	{
		$street_name = iconv('utf8', 'cp1251', $street_name);
		$city_id = intval($city_id);
		Log::debug("$street_name, $city_id, $street_type");
		Log::debug($regions);
		if ($street_name != '' && $city_id) {
			try {
				$r = DB::connection('sqlsrv')->select('exec pss..new_street 1, ?, ?, ?', [$city_id, $street_name, $street_type]);
			} catch(\PDOException $e) {
				Log::error('addStreet undefined exception');
				Log::debug(func_get_args ());
			}
			if (isset($r[0]->error) && $r[0]->error == 0){
				Log::info('Street added:'.$r[0]->street_id);
				if ($regions) {
					$resp = $this->addStreetToRegions($r[0]->street_id, $regions);
					return $resp;
				} else {
					return [
						'error' => 0,
						'msg' => 'OK'
					];
				}
			} else {
				Log::error('Add street error: '.$r[0]->error.', msg:'.$r[0]->msg);
				return [
					'error' => isset($r[0]->error)?$r[0]->error:-1,
					'msg' => isset($r[0]->msg)?$r[0]->msg:'Запрос вернул пустой ответ'
				];
			}
		} else {
			return [
				'error' => -2,
				'msg' => 'Зполненый не все параметры'
			];
		}
	}

	/**
	 * Modify street
	 *
	 * @param $street_id string Street`s name
	 * @param $params array
	 *
	 * @return array
	 */
	public function modifyStreet($street_id, $params)
	{
		Log::debug($params);
		if ($street_id) {
			$resp = [];
			if ($params['desk_changed']) {
				$resp['desk'] = $this->modifyStreetDesk($street_id, $params['desk'], $params['type']);
			} else {
				$resp['desk'] = ['error' => 0];
			}
			if (is_array($params['regions']) && $params['region_changed']) {
				$this->removeStreetFromRegions($street_id);
				$resp['regions'] = $this->addStreetToRegions($street_id, $params['regions']);
			} else {
				$resp['regions'] = ['error' => 0];
			}
			if ($resp['desk']['error'] == 0 &&
				$resp['regions']['error'] == 0) {
				$resp['error'] = 0;
			} else {
				$resp['error'] = 1;
			}
			return $resp;
		}
	}

	/**
	 * Modifying street`s description and type
	 *
	 * @param $street_id integer street`s identifier
	 * @param $name string new name of street
	 * @param $type integer identifier of street`s type
	 *
	 *
	 * exec pss..street_city_edit 1, @street_id,@desk,@type
	 *
	 * @return array [
	 *
	 * ]
	 */

	public function modifyStreetDesk($street_id, $name, $type) {
		Log::debug('step5');
		if ($street_id) {
			$name = Helper::cyr1251($name);
			try {
				Log::debug("$street_id, $name, $type");
				$r = DB::connection('sqlsrv')->select('exec pss..street_city_edit 1, ?, ?, ?', [$street_id, $name, $type]);
				Log::debug('step4');
				if (isset($r[0]->error) && $r[0]->error == 0) {
					$resp = [
						'error' => 0,
						'msg' => 'OK'
					];
				} else {
					$resp = [
						'error' => $r[0]->error,
						'msg' => $r[0]->msg
					];
				}
			} catch(\PDOException $e) {
				Log::error('Modifying street error. Street ID is empty');
				Log::debug("$street_id, $name, $type");
				$resp = [
					'error' => '-1',
					'msg' => 'Modifying street exception'
				];
			}
		} else {
			Log::error('Modifying street error. Street ID is empty');
			Log::debug("$street_id, $name, $type");
			$resp = [
				'error' => '-2',
				'msg' => 'Street_id is empty'
			];
		}
		return $resp;
	}

	/**
	 * Add street to regions
	 *
	 * @param $street_id integer Street identifier
	 * @param $regions array list of regions identifiers
	 *
	 * @return array [
	 *  'error' => 'Error code',
	 *  'msg' => 'Error msg'
	 * ]
	 */
	public function addStreetToRegions($street_id, $regions) {
		$error = 0;
		$resp = [];
		Log::debug('addStreetToRegions');
		foreach($regions as $region_id) {
			try {
				$r = DB::connection('sqlsrv')->select('exec pss..street_region_add 1, ?, ?', [$street_id, $region_id]);
				if (isset($r[0]->error) && $r[0]->error == 0) {
				} else {
					$error -= 1;
					$resp[] = [
						'error' => $r[0]->error,
						'msg' => $r[0]->msg
					];
				}
			} catch (\PDOException $e) {
				Log::error('addStreetToRegions EXCEPTION');
				Log::debug($e->getMessage());
				$resp[] = [
					'error' => -1,
					'msg' => 'Exception when adding street to region'
				];
			}
		}
		return [
			'error' => $error,
			'additional' => $resp
		];
	}


	/**
	 * Removing street from all regions
	 *
	 * @param $street_id integer Street identifier
	 *
	 * @return array [
	 * 	'error' => 'Error code',
	 *  'msg' => 'Error msg'
	 * ]
	 *
	 * @info exec pss..street_region_add 1, :street_id, 0
	 */
	public function removeStreetFromRegions($street_id) {
		try {
			$r = DB::connection('sqlsrv')->select('exec pss..street_region_add 1, ?, 0', [$street_id]);
			if (isset($r->error) && $r->error == 0) {
				return [
					'error' => '0',
					'msg' => 'OK'
				];
			}
		} catch(\PDOException $e) {
			Log::error('removeStreetFormRegions EXCEPTION');
			Log::debug($e->getMessage());
		}
	}


	public function getAddressWCoord($region_interval = '', $only_empty = true)
	{
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
		foreach ($reg_city_res as $reg_city) {
			$city_list[$reg_city->region_id] = iconv('cp1251', 'utf8', $reg_city->city);
		}
		$r = DB::connection('sqlsrv')->select("exec pss..addres_get_info_for_map 1,'" . $region_interval . "'");
		$result = array();
		foreach ($r as $row) {
			if ($only_empty && ($row->longitude != NULL || $row->latitude != NULL)) continue;
			$data = array();
			$data['address'] = (isset($city_list[$row->region_id]) ? $city_list[$row->region_id] : iconv('cp1251', 'utf8', $row->desk)) . ", " . iconv('cp1251', 'utf8', $row->street_desk) . " " . iconv('cp1251', 'utf8', $row->house) . (($row->body != NULL) ? ' корп. ' . iconv('cp1251', 'utf8', $row->body) : '');
			$data['city'] = isset($city_list[$row->region_id]) ? $city_list[$row->region_id] : '';
			$data['region'] = iconv('cp1251', 'utf8', $row->region_desk);
			$data['street'] = iconv('cp1251', 'utf8', $row->street_desk);
			$data['house'] = iconv('cp1251', 'utf8', $row->house) . (($row->body != NULL) ? ' корп. ' . iconv('cp1251', 'utf8', $row->body) : '');
			$data['type'] = iconv('cp1251', 'utf8', $row->home_type_desk);
			$data['state'] = iconv('cp1251', 'utf8', $row->home_state_desk);
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


	public function getYandexCoord($address_string)
	{
		$params = array(
			'geocode' => "Москва, " . $address_string, // адрес
			'format' => 'json',                          // формат ответа
			'results' => 1,                               // количество выводимых результатов
//        'key'     => '...',                           // ваш api key
		);
		$response = json_decode(file_get_contents('http://geocode-maps.yandex.ru/1.x/?' . http_build_query($params, '', '&')));

		if ($response->response->GeoObjectCollection->metaDataProperty->GeocoderResponseMetaData->found > 0) {
			$geo = explode(' ', $response->response->GeoObjectCollection->featureMember[0]->GeoObject->Point->pos);
			$geo['address'] = $response->response->GeoObjectCollection->featureMember[0]->GeoObject->metaDataProperty->GeocoderMetaData->text;
			\Log::info($geo[0] . ";" . $geo[1]);
			return $geo;
		} else {
			return null;
		}
	}

	public function getGoogleCoord($address_string)
	{
		$params = [
			'address' => $address_string,
		];
		$response = json_decode(file_get_contents('https://maps.googleapis.com/maps/api/geocode/json?' . http_build_query($params, '', '&')));
		$geo = [];
		if ($response->status == "OK") {
			$geo[0] = $response->results[0]->geometry->location->lng;
			$geo[1] = $response->results[0]->geometry->location->lat;
			$geo['address'] = $response->results[0]->formatted_address;
		}
		return $geo;
	}

	public function get2GisCoord($address_string)
	{
		$params = [
			'q' => $address_string,
			'types' => 'house',
			'version' => 1.3
		];
		$response = json_decode(file_get_contents('http://catalog.api.2gis.ru/geo/search?' . http_build_query($params, '', '&')));
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

	public function getCoordBuildings()
	{
		$r = DB::connection('sqlsrv')->select("exec pss..addres_get_info 1,'1'");
		$result = array();
		$i = 0;
		foreach ($r as $row) {
			$data = array();
			$data['address_id'] = $row['address_id'];
			$data['address'] = iconv('cp1251', 'utf8', $row['desk']) . ", " . iconv('cp1251', 'utf8', $row['street']) . " " . $row['house'] . (($row['body'] != NULL) ? ' корп. ' . iconv('cp1251', 'utf8', $row['body']) : '');
			$data['longitude'] = ($row['longitude'] != NULL) ? $row['longitude'] : '';
			$data['latitude'] = ($row['longitude'] != NULL) ? $row['latitude'] : '';
			$result[] = $data;
		}
		return $result;
	}

	public function saveCoordinates($address_id, $longitude, $latitude)
	{
		Log::debug("exec pss..geo_get 3, '" . $address_id . "','','','','', '" . $longitude . "', '" . $latitude . "'");
		try {
			$r = DB::connection('sqlsrv')->select("exec pss..geo_get 3, '" . $address_id . "','','','','', '" . $longitude . "', '" . $latitude . "'");
		} catch(\PDOException $e) {
			Log::debug('Save coordinates exception');
			Log::debug($e->getMessage());
			return [
				'error' => -1,
				'msg' => "DB Excdeption"
			];
		}
		if (isset($r[0]) && isset($r[0]->error) && $r[0]->error != 0) {
			$resp['error'] = $r->error;
			$resp['msg'] = iconv('cp1251', 'utf8', $r->msg);
		}
		$resp['error'] = 0;
		return $resp;
	}

	public function getBuildingTypes()
	{
		$r = DB::connection('sqlsrv')->select("exec pss..get_address_list_type 0");
		foreach ($r as $k => $r_row) {
			$r[$k]->desk = iconv('cp1251', 'utf8', $r_row->desk);
		}
		return $r;
	}

	public function getBuildingStatuses()
	{
		$r = DB::connection('sqlsrv')->select("exec pss..get_address_type 1, '', 0");
		foreach ($r as $k => $r_row) {
			$r[$k]->desk = iconv('cp1251', 'utf8', $r_row->desk);
		}
		return $r;
	}

	public function addBuilding($_params)
	{
		$params['region_id'] = intval($_params['region_id']);
		$params['street_id'] = intval($_params['street_id']);
		$params['address_id'] = isset($_params['address_id'])?$_params['address_id']:0;
		$params['build'] = $_params['build'] != ''? iconv('utf8', 'cp1251', $_params['build']):'';
		$params['body'] = $_params['body'] != ''? iconv('utf8', 'cp1251', $_params['body']):'';
		$params['floors'] = (($b = intval($_params['floors'])) > 0) ? $b : '';
		$params['entrance'] = (($b = intval($_params['entrance'])) > 0) ? $b : '';
		$params['clients'] = (($b = intval($_params['clients'])) > 0) ? $b : '';
		$params['note'] = iconv('utf8', 'cp1251', $_params['note']);
		$params['memo'] = iconv('utf8', 'cp1251', $_params['memo']);
		$params['build_type'] = intval($_params['build_type']);
		$params['price'] = $_params['price'];
		$params['construction_type'] = $_params['construction_type'];
		Log::debug($_params);
		Log::debug("exec pss..new_house 0, null, {$params['region_id']}, {$params['street_id']}, {$params['build']}, {$params['body']}, {$params['floors']}, {$params['entrance']}, {$params['clients']}, 0, 0, {$params['price']}, {$params['note']}, {$params['memo']}, {$params['build_type']}, 0, {$params['construction_type']}, {$params['address_id']}");
		try {
			$r = DB::connection('sqlsrv')->
			select("exec pss..new_house 0, null, :region_id, :street_id, :build, :body, :floors, :entrance, :clients, 0, 0, :price, :note, :memo, :build_type, 0, :construction_type, :address_id", $params);
			Log::debug($r);
		} catch(\PDOException $e) {
			Log::error("addBuilding Exception");
			Log::debug($e->getMessage());
			return [
				'error' => -1,
				'msg' => 'Ошибка сервера'
			];
		}
		if ($r[0]->error != 0) {
			Log::error("Ошибка при сохранении дома. Error code" . $r[0]->error);
			$resp['error'] = $r[0]->error;
			$resp['msg'] = ($r[0]->msg!='')?$r[0]->msg:'';
			return $resp;
		} else {
			foreach ($_params['services'] as $service) {
				if ($service['date'] != '') {
					$this->addServiceToAddress($service['id'], $r[0]->address_id, 0, $service['date']);
				}
			}
			$this->saveCoordinates($r[0]->address_id, $_params['lng'], $_params['lat']);
			$resp['error'] = 0;
			$resp['address_id'] = $r[0]->address_id;
		}
		return $resp;
	}

	public function getStreetTypes()
	{
		$r = DB::connection('sqlsrv')->select("exec pss..street_type_get 0");
		foreach ($r as $k => $r_row) {
			$r[$k]->desk = iconv('cp1251', 'utf8', $r_row->desk);
			$r[$k]->prefix = iconv('cp1251', 'utf8', $r_row->prefix);
		}
		return $r;
	}

	public function saveCompanies(Array $companies, $address_id) {
		$resp = [
			'error' => 0,
			'msg' => 'OK'
		];
		foreach($companies as $company) {
			if (isset($company['added']) && $company['added']) {
				$result = $this->addCompanyToAddress($company['id'], $address_id);
			} else if (isset($company['deleted']) && $company['deleted']) {
				$result = $this->deleteCompanyFromAddress($company['id'], $address_id);
			}
			if (isset($result['error']) && $result['error'] != 0) {
				$resp = $result;
			}
		}
		return $resp;
	}

	public function addPermitToBuilding($address_id, $service_id, $permit_id) {
		try {
			$r = DB::connection('sqlsrv')->select("exec pss..address_operating_permit_create 1, ?, ?, ?", [$address_id, $service_id, $permit_id]);
			if ($r[0]->error=0) {
				return [
					'error'	=> 0,
					'msg' => 'OK'
				];
			} else {
				return [
					'error'=> $r[0]->error,
					'msg' => $r[0]->msg
				];
			}
		} catch(\PDOException $e) {
			Log::error('addPermitBuilding EXCEPTION');
			Log::debug($e->getMessage());
		}
	}

	public function saveServices(Array $services, $address_id) {
		$resp = [
			'error' => 0,
			'msg' => 'OK',
			'state' => []
		];
		foreach($services as $service) {
			if (isset($service['changed']) && $service['changed']=='true') {
				foreach($service as $k=>$param) {
					if (preg_match('/^date_(\d+)$/', $k, $state) && $param['state'] == 1){
						if ($param['value'] != '') {
							$result = $this->addServiceToAddress($service['id'], $address_id, $state[1], $param['value']);
						} else if ($param['value'] == '') {
							$result = $this->deleteServiceFromAddress($service['id'], $address_id, $state[1]);
						} else {
							continue;
						}
						$resp['state'][$service['id']][$k] = $result;
						if ($result['error'] != 0) {
							$resp['error'] = 1;
							$resp['msg'] = "Ошибка при сохранении услуг";
						}
					} else if ($k == 'permit') {
						if ($param['state'] == 1 && $param['value'] != '') {
							$result = $this->addPermitToBuilding($address_id, $service['id'], $param['id']);
						} else {
							continue;
						}
						$resp['state']['permit'] = $result;
					}
				}
			}
		}
		return $resp;
	}

	public function saveParams($params) {
		$params['address_id'] = isset($params['address_id'])?$params['address_id']:0;
		Log::debug($params);
		try {
			Log::debug("exec pss..set_home_desk 0, '', :address_id, :note, :street_id, :build, :body, :floors, :entrance, :clients, 0, 0, :price, :memo, :build_type, :construction_type");
			$r = DB::connection('sqlsrv')->
			select("exec pss..set_home_desk 0, '', :address_id, :note, :street_id, :build, :body, :floors, :entrance, :clients, 0, 0, :price, :memo, :build_type, :construction_type", $params);
			Log::debug($r);
		} catch (\PDOEsception $e) {
			Log::error("Ошибка при сохранении дома.");
			return ['error' => -1, 'msg' => 'Ошибка базы данных'];
		}
		if (isset($r[0]->error)) {
			if ($r[0]->error == 0) {
				return ['error' => 0, 'msg' => 'OK'];
			} else {
				Log::error("Save params error. Code: ".$r[0]->error. "msg: ".$r[0]->msg);
				return ['error' => $r[0]->error, 'msg' => $r[0]->msg];
			}
		} else {
			Log::error("Save params UNEXPECTED error");
			return ['error' => -2, 'msg' => 'Непредвиденная ошибка'];
		}
	}

	public function modifyBuild($_params)
	{
		$resp['error']=0;
		if ($_params['building_params_changed']) {
			$params['address_id'] = intval($_params['address_id']);
			$params['street_id'] = intval($_params['building_params']['street_id']);
			$params['build'] = $_params['building_params']['build'] != '' ? iconv('utf8', 'cp1251', $_params['building_params']['build']) : '';
			$params['body'] = $_params['building_params']['body'] != '' ? iconv('utf8', 'cp1251', $_params['building_params']['body']) : '';
			$params['floors'] = $_params['building_params']['floors'];
			$params['entrance'] = $_params['building_params']['entrance'];
			$params['clients'] = intval($_params['building_params']['clients']);
			$params['note'] = iconv('utf8', 'cp1251', $_params['building_params']['note']);
			$params['memo'] = iconv('utf8', 'cp1251', $_params['building_params']['memo']);
			$params['build_type'] = intval($_params['building_params']['build_type']);
			$params['price'] = htmlspecialchars($_params['building_params']['price']);
			$params['construction_type'] = 1;
			$resp['building_params'] = $this->saveParams($params);
		} else {
			$resp['building_params']['error'] = 0;
		}
		if ($_params['militia_params_changed']) {
			$params['address_id'] = intval($_params['address_id']);
			$params['street_id'] = intval($_params['militia_params']['street_id']);
			$params['build'] = $_params['militia_params']['build'] != '' ? iconv('utf8', 'cp1251', $_params['militia_params']['build']) : '';
			$params['body'] = $_params['militia_params']['body'] != '' ? iconv('utf8', 'cp1251', $_params['militia_params']['body']) : '';
			$params['floors'] = $_params['militia_params']['floors'];
			$params['entrance'] = $_params['militia_params']['entrance'];
			$params['clients'] = intval($_params['militia_params']['clients']);
			$params['note'] = iconv('utf8', 'cp1251', $_params['militia_params']['note']);
			$params['memo'] = iconv('utf8', 'cp1251', $_params['militia_params']['memo']);
			$params['build_type'] = intval($_params['militia_params']['build_type']);
			$params['price'] = htmlspecialchars($_params['militia_params']['price']);
			$params['construction_type'] = 2;
			$resp['militia_params'] = $this->saveParams($params);
		} else {
			$resp['militia_params']['error'] = 0;
		}
		if ($_params['companies_changed']) {
			$resp['companies'] = $this->saveCompanies($_params['companies'], $_params['address_id']);
		} else {
			$resp['companies']['error'] = 0;
		}
		if ($_params['status_changed'])
		{
			$resp['status'] = $this->saveStatus($_params['address_id'], $_params['status']);
		} else {
			$resp['status']['error'] = 0;
		}
		if ($resp['companies']['error'] != 0 ||
			$resp['status']['error'] != 0 ||
			$resp['building_params']['error'] != 0 ||
			$resp['militia_params']['error'] != 0
		) {
			$resp['error'] = 1;
			$resp['msg'] = 'При сохранении возникли ошибки';
		} else {
			$resp['error'] = 0;
			$resp['msg'] = 'Изменения успешно сохранены';
		}
		return $resp;
	}

	public function getEntrances($address_id)
	{
		$address_id = intval($address_id);
		$resp = [];
		if ($address_id > 0) {
			$data = DB::connection('sqlsrv')->select("pss..addres_get_entrance 1, ?", [$address_id]);
			foreach ($data as $e_row) {
				$resp[$e_row->entrances] = $e_row->floors;
			}
			return $resp;
		}
		return $resp;
	}

	public function getEntrancesParams($address_id)
	{
		$address_id = intval($address_id);
		$resp = [];
		if ($address_id > 0) {
			$data = DB::connection('sqlsrv')->select("pss..addres_get_entrance 1, ?", [$address_id]);
			foreach ($data as $e_row) {
				$resp[$e_row->entrances] = [
					'floors' => $e_row->floors,
					'interior' => $e_row->decoration
				];
			}
			return $resp;
		}
		return $resp;
	}

	public function deleteEntrance($address_id, $entrance_id)
	{
		$address_id = intval($address_id);
		$entrance_id = intval($entrance_id);
		if ($address_id && $entrance_id) {
			try {
				$r = Db::connection('sqlsrv')->select("exec pss..addres_floor_set 2, ?, ?", [$address_id, $entrance_id]);
				if (isset($r[0]->error) && $r[0]->error = 0) {
					return true;
				} else {
				}
			} catch (\PDOException $e) {
				Log::debug("Deleting entrance error. DB Error. Message:" . $e->getMessage() . ". Address_id: $address_id, entrance_id: $entrance_id");
			}
		} else {
			Log::debug("Deleting entrance error. Input data is incorrect. Address_id: $address_id, entrance_id: $entrance_id");
		}
	}

	public function changeEntrance($address_id, $entrance_id, $floors, $interior)
	{
		$address_id = intval($address_id);
		$entrance_id = intval($entrance_id);
		$floors = intval($floors);
		if ($address_id > 0 && $entrance_id > 0 && $floors > 0) {
			try {
				Log::debug([$address_id, $entrance_id, $floors, $interior?1:0]);
				$r = Db::connection('sqlsrv')->select("exec pss..addres_floor_set 1, ?, ?, ?, ?", [$address_id, $entrance_id, $floors, $interior?1:0]);
				if (isset($r[0]->error) && $r[0]->error = 0) {
					return true;
				} else {
					Log::debug("Deleting entrance error. Code:" . $r[0]->error . ". Address_id: $address_id, entrance_id: $entrance_id");
					return false;
				}
			} catch (\PDOException $e) {
				Log::debug("Changing entrance error. DB Error. Message:" . $e->getMessage() . ". Address_id: $address_id, entrance_id: $entrance_id");
			}
		} else {
			Log::debug("Deleting entrance error. Input data is incorrect. Address_id: $address_id, entrance_id: $entrance_id");
		}
	}

	public function saveEntrances($address_id, $entrances)
	{
		$error = false;
		foreach ($entrances as $k => $e_row) {
			if (!isset($e_row['floors'])) continue;
			if ($e_row['deleted']) {
				if (!$this->deleteEntrance($address_id, $k)) {
					$error = true;
				}
			} elseif ($e_row['is_changed']) {
				if (!$this->changeEntrance($address_id, $k, $e_row['floors'], $e_row['interior'])) {
					$error = true;
				}

			}
		}
		return $error;
	}

	public function saveStatus($address_id, $status)
	{
		$address_id = intval($address_id);
		$status = intval($status);
		if ($address_id > 0 && $status >= 0) {
			try {
				$r = Db::connection('sqlsrv')->select("exec pss..set_address_state '', ?, ?, 1", [$address_id, $status]);
				if (isset($r[0]->error) && $r[0]->error == 0) {
					return ['error' => 0, 'msg' => 'Статус успешно сохранен'];
				} else {
					$code = isset($r[0]->error) ? $r[0]->error : '';
					return ['error' => $code, 'msg' => isset($r[0]->msg) ? $r[0]->msg : ''];
				}
			} catch (\PDOException $e) {
				return ['error' => -2, 'msg' => 'У вас нет прав для изменения статуса'];
			}
		} else {
			return ['error' => -1, 'msg' => 'У вас нет прав для изменения статуса'];
		}
	}

	public function getCityList($city_id = 0, &$city = null)
	{
		$r = DB::connection('sqlsrv')->select('exec pss..city_get_list 0');
		foreach ($r as $k => $city_row) {
			$r[$k]->desk = iconv('cp1251', 'utf8', $city_row->desk);
			if ($city_id && $r[$k]->id == $city_id) {
				$city = $r[$k]->desk;
			}
		}
		return $r;
	}

	public function getCityListMultiselect()
	{
		$r = DB::connection('sqlsrv')->select('exec pss..city_get_list 0');
		$resp = [];
		foreach ($r as $k => $city_row) {
			$resp[] = ['value' => $city_row->id,
				'label' => iconv('cp1251', 'utf8', $city_row->desk),
				'selected' => true];
		}
		return $resp;
	}

	public function getRegionListMultiselect()
	{
		$r = DB::connection('sqlsrv')->select('exec pss..addres_get_info 0');
		$resp = [];
		foreach ($r as $k => $region_row) {
			$resp[] = ['value' => $region_row->region_id,
				'label' => iconv('cp1251', 'utf8', $region_row->desk),
				'selected' => true];
		}
		return $resp;
	}

	public function searchBuild($region_id, $street_id, $build, $body, $construction_type=0)
	{
		$region_id = intval($region_id);
		$street_id = intval($street_id);
		$build = Helper::cyr1251($build);
		$body = intval($body);
		$address_id = 0;
		$resp = [];
		if ($street_id > 0) {
			if ($build) {
				Log::debug("exec pss..get_home_list_all 0,'', $region_id, $street_id, $build, $body");
				$r = DB::connection('sqlsrv')->select("exec pss..get_home_list_all 0,'', ?, ?, ?, ?", [$region_id, $street_id, $build, $body]);
				if (isset($r[0]->address)) {
					$resp[0]['address'] = $r[0]->address;
					$resp[0]['home'] = iconv('cp1251', 'utf8', $r[0]->home).($r[0]->construction_type==1?" (стр.)":'');
					$resp[0]['construction_type'] = $r[0]->construction_type;
					$resp[0]['construction_desk'] = Helper::cyr($r[0]->construction_desk);
				}
			} else {
				Log::debug("exec pss..get_home_list_all 0,'', $region_id, $street_id, $build, $body");
				$r = DB::connection('sqlsrv')->select("exec pss..get_home_list_all 0,'', ?, ?", [$region_id, $street_id]);
				foreach ($r as $k => $r_r) {
					if ($construction_type && $r[$k]->construction_type != $construction_type) continue;
					$resp[] = [
						'address' => $r[$k]->address,
						'home' => iconv('cp1251', 'utf8', $r[$k]->home).($r[$k]->construction_type==1?" (стр.)":''),
						'construction_type' => $r[$k]->construction_type,
						'construction_desk' => Helper::cyr($r[$k]->construction_desk)
					];
				}
			}
		}
		return ['error' => 0, 'builds' => $resp];
	}

	public function getBuildingsByStreet($street_string)
	{
		$result = [];
		if (strlen($street_string) != '') {
			$r = DB::connection('sqlsrv')->select("exec pss..street_filter 0, ?", [$street_string]);
			foreach ($r as $street) {
				$r_build = DB::connection('sqlsrv')->select("exec pss..get_home_list_all 0,'', ?, ?", [$street['region_id'], $street['street_id']]);
				foreach ($r_build as $brow) {
					$data = array();
					$data[] = iconv('cp1251', 'utf8', $brow->desk);
					$data[] = iconv('cp1251', 'utf8', $brow->street);
					$data[] = iconv('cp1251', 'utf8', $brow->house) . (($brow->body != NULL) ? ' корп. ' . iconv('cp1251', 'utf8', $brow->body) : '');
					$data['address_id'] = $brow->address_id;
					$result['data'][] = $data;
				}
			}
		}
		return $result;
	}

	public function getBuildingsList($params, $page)
	{
		$params['build'] = Helper::cyr1251($params['build']);
		$rights_model = new AddressRights();
		$r = DB::connection('sqlsrv')->select("exec pss..get_home_list_all 0,'', :region_id, :street_id, :build, 0, :city_id, :address_id, 'street_desk,address,construction_type', :offset, :on_page", $params);
		$result = [];
		$result['page'] = $page;
		$result['total_rows'] = 0;
		$result['data'] = [];
		$rights = $rights_model->getBuildingScreenRights() ? 1 : 0;
		foreach ($r as $k => $row) {
			$data = [];
			$data['id'] = $k;
			$data['region'] = iconv('cp1251', 'utf8', $row->region_desk);
			$data['street'] = iconv('cp1251', 'utf8', $row->street_desk);
			$data['house'] = iconv('cp1251', 'utf8', $row->home);
			$data['construction_desk'] = Helper::cyr($row->construction_desk);
			$data['address_id'] = $row->address;
			$data['region_id'] = $row->region_id;
			$data['view_permissions'] = $rights;
			$data['home_type_desk'] = iconv('cp1251', 'utf8', $row->home_type_desk);
			$data['home_status_desk'] = iconv('cp1251', 'utf8', $row->home_status_desk);
			$data['clients'] = $row->clients;
			$data['location_desk'] = Helper::cyr($row->location_desk);
			$result['data'][] = $data;
			$result['total_rows'] = $row->rows_qty;
		}
		return $result;
	}

	public function getStreetsList($params, $page=0)
	{
		$rights_model = new AddressRights();
		$r = DB::connection('sqlsrv')->select("exec pss..street_city_list_get 1, :city_id, :region_id, :street", $params);
		$result = [];
		$result['page'] = $page;
		$result['total_rows'] = 0;
		$result['data'] = [];
		$data = [];
		foreach ($r as $k => $row) {
			if (isset($data[$row->street_id])) {
				$data[$row->street_id]['regions'][] = [
					'region_id' => $row->region_id,
					'region_desk' => Helper::cyr($row->region_desk)
				];
			} else {
				$data[$row->street_id] = [
					'street_id' => $row->street_id,
					'desk' => Helper::cyr($row->street_desk),
					'city_id' => $row->city_id,
					'city_desk' => Helper::cyr($row->city_desk),
					'prefix' => Helper::cyr($row->prefix),
					'prefix_id' => $row->street_type,
					'regions' => $row->region_id?[[
						'region_id' => $row->region_id,
						'region_desk' => Helper::cyr($row->region_desk)
					]]:[]
				];
			}
	//		$result['total_rows'] = $row->rows_qty;
		}
		foreach($data as $data_row) {
			$result['data'][] = $data_row;
		}
		return $result;
	}

	public function getCompaniesForAddress($address_id)
	{
		$address_id = intval($address_id);
		$resp = [];
		if ($address_id) {
			$r = DB::connection('sqlsrv')->select('exec pss..address_company_get 1, ?', [$address_id]);
			foreach ($r as $company) {
				$resp[] = ['id' => $company->id,
					'name' => iconv('cp1251', 'utf8', $company->company),
					'address_id_other' => $company->address_id_other
				];
			}
		}
		return $resp;
	}

	public function getCompanies($address_id, $string='') {
		$resp = [];
		$r = DB::connection('sqlsrv')->select('exec pss..address_company_new 1, ?, 0, ?', [$address_id, $string]);
		foreach($r as $company) {
			$resp[] = ['id' => $company->id,
				'name' => iconv('cp1251', 'utf8', $company->company)];
		}
		return $resp;
	}

	public function addCompanyToAddress($company_id, $address_id) {
		$result['error'] = 0;
		try {
			$r = DB::connection('sqlsrv')->select('exec pss..address_company_new 2, ?, ?', [$address_id, $company_id]);
			if (isset($r[0]->error)) {
				if ($r[0]->error == 0) {
					$result['error'] = 0;
					$result['msg'] = 'OK';
				} else {
					$result['error'] = $r[0]->error;
					$result['msg'] = $r[0]->msg;
					Log::error("Adding company error. Code: " . $result['error'], ", msg: " . $r['msg']);
				}
			}
		} catch(\PDOException $e) {
			$result['error'] = 1;
			$result['msg'] = "DB Error";
			Log::error("Adding company EXCEPTION");
		}
		return $result;
	}

	public function deleteCompanyFromAddress($company_id, $address_id) {
		$result['error'] = 0;
		try {
			$r = DB::connection('sqlsrv')->select('exec pss..address_company_new 3, ?, ?', [$address_id, $company_id]);
			if (isset($r['error'])) {
				if ($r['error'] == 0) {
					$result['error'] = 0;
					$result['msg'] = 'OK';
				} else {
					$result['error'] = $r['error'];
					$result['msg'] = $r['msg'];
					Log::error("Deleting company error. Code: " . $result['error'], ", msg: " . $r['msg']);
				}
			}
		} catch(\PDOException $e) {
			$result['error'] = 1;
			$result['msg'] = "DB Error";
			Log::error("Deleting company EXCEPTION");
		}
		return $result;
	}

	public function getServices($address_id) {
		$address_id = intval($address_id);
		$resp = [];
		if ($address_id) {
			$r = DB::connection('sqlsrv')->select('address_service_get 3, ?', [$address_id]);
			foreach ($r as $company) {
				$resp[] = ['id' => $company->service_id,
					'name' => iconv('cp1251', 'utf8', $company->desk)];
			}
		}
		return $resp;
	}

	public function getServicesForAddress($address_id)
	{
		$address_id = intval($address_id);
		$resp = [];
		if ($address_id) {
			$r = DB::connection('sqlsrv')->select('exec address_service_get 1, ?', [$address_id]);
			foreach ($r as $service) {
				$resp[] = ['service_id' => $service->service_id,
					'service_name' => iconv('cp1251', 'utf8', $service->desk),
					'status' => $service->type,
					'status_desk' => iconv('cp1251', 'utf8', $service->status_desk),
					'started' => date('Y-m-d', strtotime($service->started))
				];
			}
		}
		return $resp;
	}

	public function addServiceToAddress($service_id, $address_id, $type, $date) {
		$result = [
			'error' => 0,
			'msg' => 'OK'
		];
		Log::debug("exec pss..address_service_new 2, $service_id , $address_id , $type , $date");
		try {
			$r = DB::connection('sqlsrv')->select('exec pss..address_service_new 2, ?, ?, ?, ?', [$address_id, $service_id, $type, $date]);
			if (isset($r[0]->error)) {
				if ($r[0]->error == 0) {
					$result['error'] = 0;
					$result['msg'] = 'OK';
				} else {
					$result['error'] = $r[0]->error;
					$result['msg'] = Helper::cyr($r[0]->msg);
					Log::error("Adding service error. Code: " . $result['error']. ", msg: " . $result['msg']);
				}
			}
		} catch(\PDOException $e) {
			$result['error'] = 1;
			$result['msg'] = "DB Error";
			Log::error("Adding service EXCEPTION");
		}
		return $result;
	}

	public function deleteServiceFromAddress($service_id, $address_id, $state) {
		$result['error'] = 0;
		try {
			$r = DB::connection('sqlsrv')->select('exec pss..address_service_new 3 , ?, ?, ?', [$address_id, $service_id, $state]);
			if (isset($r['error'])) {
				if ($r['error'] == 0) {
					$result['error'] = 0;
					$result['msg'] = 'OK';
				} else {
					$result['error'] = $r['error'];
					$result['msg'] = $r['msg'];
					Log::error("Deleting service error. Code: " . $result['error'], ", msg: " . $r['msg']);
				}
			}
		} catch(\PDOException $e) {
			$result['error'] = 1;
			$result['msg'] = "DB Error";
			Log::error("Deleting service EXCEPTION");
			Log::debug(var_export($e, true));
		}
		return $result;
	}

	public function getServicesStatuses() {
		try {
			$r = DB::connection('sqlsrv')->select('exec pss..address_service_get 2');
			$resp = [];
			foreach($r as $k=>$status) {
				$resp[] = [
					'type' => $status->type,
					'desk' => iconv('cp1251', 'utf8', $status->desk)
				];
			}
			return $resp;
		} catch(\PDOException $e) {
			$result['error'] = 1;
			$result['msg'] = "DB Error";
			Log::error("getService EXCEPTION");
			Log::debug(var_export($e, true));
		}
	}

	public function getServicesPermits($address_id) {
		$resp = [];
		try {
			$r = DB::connection('sqlsrv')->select('exec pss..address_operating_permit_get 1, ?', [$address_id]);
			foreach($r as $k=>$status) {
				$resp[] = [
					'address_id' => $status->type,
					'service_id' => $status->desk,
					'document_id' => $status->document_id,
					'closed' => $status->closed
				];
			}
			return $resp;
		} catch(\PDOException $e) {
			Log::error("getService EXCEPTION");
			Log::debug($e->getMessage());
		}
		return $resp;
	}

	public function getServiceTable($address_id) {
		$services = $this->getServices($address_id);
		$statuses = $this->getServicesStatuses();
		$service_statuses = $this->getServicesForAddress($address_id);
		$services_permits = $this->getServicesPermits($address_id);
		foreach($services as $k=>$service) {
			foreach($statuses as $sk=>$status) {
				foreach($service_statuses as $sstatus) {
					if ($service['id'] == $sstatus['service_id'] && $status['type'] == $sstatus['status']) {
						$services[$k]['date_'.$status['type']] = [
								'value' => $sstatus['started'],
								'state' => 0,
								'msg' => ''
							];
					} else {
						if (!isset($services[$k]['date_'.$status['type']])) $services[$k]['date_'.$status['type']] = ['value'=>'', 'state'=>0, 'msg'=>''];
					}
				}
			}
			foreach($services_permits as $service_permit) {
				if ($service_permit['service_id'] == $service['id']) {
					$services[$k]['permit'] = [
						'value' => $service_permit['document_id'],
						'state' => 0,
						'msg' => ''
					];
					$services[$k]['permit_date_from'] = [
						'value' => date('Y-m-d', strtotime($service_permit['date'])),
						'state' => 0,
						'msg' => ''
					];
					$services[$k]['permit_date_to'] = [
						'value' => date('Y-m-d', strtotime($service_permit['closed'])),
						'state' => 0,
						'msg' => ''
					];
				}
			}
			if (!isset($services[$k]['permit'])) {
				$services[$k]['permit'] = ['value'=>'', 'state'=>0, 'msg'=>''];
				$services[$k]['permit_from'] = ['value'=>'', 'state'=>0, 'msg'=>''];
				$services[$k]['permit_to'] = ['value'=>'', 'state'=>0, 'msg'=>''];
			}
		}
		Log::debug($services);
		return $services;
	}

	public function addRegionToStreet($street_id, $region_id) {
		$result['error'] = 0;
		$result['msg'] = 'OK';
		try {
			$r = DB::connection('sqlsrv')->select('exec pss..street_region_add 1, ?, ?', [$street_id, $region_id]);
			if (isset($r['error'])) {
				if ($r['error'] == 0) {
					$result['error'] = 0;
					$result['msg'] = 'OK';
				} else {
					$result['error'] = $r['error'];
					$result['msg'] = $r['msg'];
					Log::error("Adding region error. Code: " . $result['error'], ", msg: " . $r['msg']);
				}
			}
		} catch(\PDOException $e) {
			$result['error'] = 1;
			$result['msg'] = "DB Error";
			Log::error("Adding region EXCEPTION");
		}
		return $result;
	}

	public function deleteRegionFromStreet($street_id, $region_id)
	{
		$result['error'] = 0;
		$result['msg'] = 'OK';
		try {
			$r = DB::connection('sqlsrv')->select('exec pss..street_region_add 2, ?, ?', [$street_id, $region_id]);
			if (isset($r['error'])) {
				if ($r['error'] == 0) {
					$result['error'] = 0;
					$result['msg'] = 'OK';
				} else {
					$result['error'] = $r['error'];
					$result['msg'] = $r['msg'];
					Log::error("Deleting region error. Code: " . $result['error'], ", msg: " . $r['msg']);
				}
			}
		} catch (\PDOException $e) {
			$result['error'] = 1;
			$result['msg'] = "DB Error";
			Log::error("Deleting region EXCEPTION");
		}
		return $result;
	}

	public function changeStreetDesk($street_id, $desk, $prefix_id) {
		$result['error'] = 0;
		$result['msg'] = 'OK';
		try {
			$r = DB::connection('sqlsrv')->select('exec pss..street_city_edit 1, ?, ?, ?', [$street_id, $desk, $prefix_id]);
			if (isset($r['error'])) {
				if ($r['error'] == 0) {
					$result['error'] = 0;
					$result['msg'] = 'OK';
				} else {
					$result['error'] = $r['error'];
					$result['msg'] = $r['msg'];
					Log::error("Deleting region error. Code: " . $result['error'], ", msg: " . $r['msg']);
				}
			}
		} catch (\PDOException $e) {
			$result['error'] = 1;
			$result['msg'] = "DB Error";
			Log::error("Change street description EXCEPTION");
		}
		return $result;
	}

	public function changeStreetRegions($street_id, $regions) {
		$msg = '';
		if (is_array($regions)) {
			foreach($regions as $region) {
				if ($region['deleted']) {
					Log::debug('Delete region '.$region['value'].' from street '.$street_id);
					$result = $this->deleteRegionFromStreet($street_id, $region['value']);
					if ($result['error'] != 0) {
						$msg .= 'Ошибка '.$result['error'].' при удалении района '.$region['value'];
					}
				} else if ($region['selected']) {
					Log::debug('Add region '.$region['value'].' to street '.$street_id);
					$result = $this->addRegionToStreet($street_id, $region['value']);
					if ($result['error'] != 0) {
						$msg .= 'Ошибка '.$result['error'].' при добавлении района '.$region['value'];
					}
				}
			}
		}
		return  [
			'error' => $msg != ''? 1 : 0,
			'msg' => $msg != ''? $msg : 'OK'
		];
	}

	public function saveStreet($street_id, $params) {
		$resp = [
			'error' => 0,
			'msg' => 'OK'
		];
		if ($params['desk_change']) {
			$resp['desk'] = $this->changeStreetDesk($street_id, $params['desk'], $params['prefix_id']);
		} else {
			$resp['desk']['error'] = 0;
		}
		if ($params['region_change']) {
			$resp['region'] = $this->changeStreetRegions($street_id, $params['regions']);
		} else {
			$resp['region']['error'] = 0;
		}
		if ($resp['desk']['error'] != 0 || $resp['region']['error'] != 0) {
			$resp['error'] = 1;
			$resp['msg'] = 'При сохранении возникли ошибки';
		}
		return $resp;
	}

	public function cityAutocomplete($city_string) {
		$resp = [];
		$city_string = Helper::cyr1251($city_string);
		try {
			$r = DB::connection('sqlsrv')->select('exec find_object 1, ?', [$city_string]);
			Log::debug($r);
		} catch(\PDOException $r) {
			Log::error('cityAutocomplete EXCEPTION');
		}
		foreach($r as $city) {
			$resp[] = [
				'key' => $city->id,
				'value' => Helper::cyr($city->desk)
			];
		}
		return $resp;
	}

	public function regionAutocomplete($city_string, $region_string) {
		$resp = [];
		$city_string = Helper::cyr1251($city_string);
		$region_string = Helper::cyr1251($region_string);
		try {
			$r = DB::connection('sqlsrv')->select('exec find_object 2, ?, ?', [$city_string, $region_string]);
		} catch(\PDOException $r) {
			Log::error('regionAutocomplete EXCEPTION');
		}
		foreach($r as $region) {
			$resp[] = [
				'key' => $region->region_id,
				'value' => Helper::cyr($region->region_desk)
			];
		}
		return $resp;
	}

	public function streetAutocomplete($city_string, $region_string, $street_string) {
		$resp = [];
		$city_string = Helper::cyr1251($city_string);
		$region_string = Helper::cyr1251($region_string);
		$street_string = Helper::cyr1251($street_string);
		try {
			$r = DB::connection('sqlsrv')->select('exec find_object 3, ?, ?, ?', [$city_string, $region_string, $street_string]);
			Log::debug($r);
		} catch(\PDOException $r) {
			Log::error('streetAutocomplete EXCEPTION');
		}
		foreach($r as $street) {
			$resp[] = [
				'key' => $street->street_id,
				'value' => Helper::cyr($street->street_desk)
			];
		}
		return $resp;
	}

	public function getBuildingFiles($address_id) {
		$resp = [];
		try {
			$r = DB::connection('sqlsrv')->select('exec bill..inventory_documentation_get 1,?', [$address_id]);
		} catch(\PDOException $e) {
			Log::error('streetAutocomplete EXCEPTION');
			return $resp;
		}
		$rights = new AddressRights();
		$can_delete = $rights->checkFilesAddRights();
		foreach($r as $file) {
			$hash = base64_encode($file->id.';'.Helper::cyr($file->file_name).';'.$file->date);
			$resp[] = [
				'id' => $file->id,
				'address_id' => $file->address_id,
				'group_id' => $file->group_id,
				'group_desk' => Helper::cyr($file->group_desk),
				'subgroup_id' => $file->type_id,
				'subgroup_desk' => Helper::cyr($file->type_desk),
				'date' => $file->date,
				'note' => Helper::cyr($file->note),
				'file_name' => Helper::cyr($file->file_name),
				'href' => '/inventory/building/'.$address_id.'/file/'.$hash,
				'owner' => Helper::cyr($file->name),
				'can_delete' => $can_delete
			];
		}
		return $resp;
	}

	public function uploadFile($address_id, $params, $file) {
		$params['address_id'] = $address_id;
		$params['note'] = Helper::cyr1251($params['note']);
		$params['file_name'] = isset($params['file_name'])?Helper::cyr1251($params['file_name']):'';
		Log::debug($params);
		try {
			$r = DB::connection('sqlsrv')->select('exec bill..inventory_documentation_set 1, :address_id, :subgroup_id, :note, :file_name', $params);
			Log::debug($r);
			if (isset($r[0]) && isset($r[0]->id) && $file) {
				$file_storage_name = str_replace('.'.$file->getClientOriginalExtension(), '', $file->getClientOriginalName()).'_'.$r[0]->id.($file->getClientOriginalExtension() != ''?'.'.$file->getClientOriginalExtension():'');
				if (Storage::put('build/'.$address_id.'/'.$file_storage_name, file_get_contents($file->getRealPath()))) {
					return [
						'error' => 0,
						'msg' => 'OK'
					];
				} else {
					Log::error('Can`t save file');
					DB::connection('sqlsrv')->select('exec bill..inventory_documentation_set 2, ?', [$r[0]->id]);
					return [
						'error' => '-2',
						'msg' => 'Can`t save file to storage',
					];
				}
			} else {
				return [
					'error' => '-2',
					'msg' => 'Billing request return empty result'
				];
			}
		} catch(\PDOException $e) {
			Log::error('uploadFile EXCEPTION');
			return [
				'error' => -1,
				'msg' => 'uploadFile EXCEPTION'
			];
		}
	}

	public function deleteFile($address_id, $fileInfo) {
		$fileNameInfo = pathinfo($fileInfo['name']);
		Log::info("Deleting file for $address_id: ".'build/'.$address_id.'/'.$fileNameInfo['filename'].'_'.strtotime($fileInfo['date']).(isset($fileNameInfo['extension'])?'.'.$fileNameInfo['extension']:''));
		if (Storage::delete('build/'.$address_id.'/'.$fileNameInfo['filename'].'_'.$fileInfo['id'].(isset($fileNameInfo['extension'])?'.'.$fileNameInfo['extension']:''))) {
			try {
				$r = DB::connection('sqlsrv')->select('exec bill..inventory_documentation_delete 1, ?', [$fileInfo['id']]);
			} catch (\PDOException $e) {
				Log::error('deleteFileException Exception');
				Log::error($e->getMessage());
				return [
					'error' => -1,
					'msg' => 'Exception'
				];
			}
			if (isset($r[0]) && isset($r[0]->error)) {
				return [
					'error' => 0,
					'msg' => 'OK'
				];
			} else {
				return [
					'error' => -2,
					'msg' => 'DB Request return empty result'
				];
			}
		} else {
			Log::error('Storage delete return false result');
			return [
				'error' => -3,
				'msg' => 'Storage delete return false result'
			];
		}
	}

	public function getFileGroups() {
		$resp = [];
		try {
			$r = DB::connection('sqlsrv')->select('exec bill..inventory_documentation_group_get 1');
			foreach($r as $group_row) {
				$resp[] = [
					'id' => $group_row->group_id,
					'name' => Helper::cyr($group_row->group_desk)
				];
			}
		} catch(\PDOException $e) {
			Log::error('getFileGroups Exception');
		}
		return $resp;
	}

	public function getFileSubgroups($group_id=null) {
		$resp = [];
		try {
			$r = DB::connection('sqlsrv')->select('exec bill..inventory_documentation_group_get 2, ?', [$group_id]);
			foreach($r as $group_row) {
				$resp[] = [
					'id' => $group_row->group_id,
					'name' => Helper::cyr($group_row->type_desk)
				];
			}
		} catch(\PDOException $e) {
			Log::error('getFileGroups Exception');
		}
		return $resp;
	}


	public function exchangeAddress($address_id) {
		try {
			$r = DB::connection('sqlsrv')->select('exec pss..address_construction_type_change 1, ?', [$address_id]);

		} catch(\PDOException $e) {
			Log::error('exchangeAddress EXCEPTION');
		}
		return true;
	}

	public function searchCadastral($search_string) {
		$search_string = Helper::cyr1251($search_string);
		$resp = [
			'data' => [],
			'error' => 0,
			'msg' => '',
		];
		try {
			$data = [];
			$r = DB::connection('sqlsrv')->select('exec pss..cadastral_number_get 1, ?', [$search_string]);
			foreach($r as $row) {
				$data[] = [
					'cadastral_id' => $row->id,
					'type' => $row->type,
					'type_descr' => Helper::cyr($row->type_desk),
					'number' => Helper::cyr($row->number),
					'cadastral_descr' => Helper::cyr($row->cadastral_desk),
					'url' => Helper::cyr($row->url),
					'region_id' => Helper::cyr($row->region_id),
					'region_descr' => Helper::cyr($row->region_desk)
				];
			}
			$resp['data'] = $data;
		} catch(\PDOException $e) {
			Log::error('searchCadastral PDO exception.');
			Log::debug($e->getMessage());
			$resp['error'] = -1;
			$resp['msg'] = 'Непредвиденная ошибка';
		}
		return $resp;
	}

	public function getCadastralTypes() {
		$resp = [
			'data' => [],
			'error' => 0,
			'msg' => '',
		];
		try {
			$data = [];
			$r = DB::connection('sqlsrv')->select('exec pss..cadastral_type_get 1');
			foreach($r as $row) {
				$data[] = [
					'type' => $row->type,
					'descr' => Helper::cyr($row->desk),
				];
			}
			$resp['data'] = $data;
		} catch(\PDOException $e) {
			Log::error('getCadastralTypes PDO exception.');
			Log::debug($e->getMessage());
			$resp['error'] = -1;
			$resp['msg'] = 'Непредвиденная ошибка';
		}
		return $resp;
	}

	public function addCadastral($type, $number, $descr, $url, $regions) {
		try {
			$r = DB::connection('sqlsrv')->select("exec pss..cadastral_number_set 1, 0, ?, ?, ?, ?", [$type, Helper::cyr1251($number), Helper::cyr1251($descr), Helper::cyr1251($url)]);
			Log::debug("exec pss..cadastral_number_set 1, 0, $type, $number, $descr, $url");
			if (isset($r[0]->error)) {
				if ($r[0]->error == 0) {
					$cadastral_id = $r[0]->msg;
				} else {
					return [
						'error' => $r[0]->error,
						'msg' => $r[0]->msg
					];
				}
			} else {
				Log::error('addCadastral error. Undefined error field');
				return [
					'error' => -1,
					'msg' => 'Ошибка при добавлении кадастрового номера'
				];
			}
		} catch(\PDOException $e) {
			Log::error('addCadastral PDO exception.');
			Log::debug($e->getMessage());
			return [
				'error' => -1,
				'msg' => 'Непредвиденная ошибка при добавлении кадастрового номера'
			];
		}
		if ($cadastral_id) {
			$error = 0;
			Log::debug($regions);
			foreach($regions as $region_id) {
				try {
					DB::connection('sqlsrv')->select("exec pss..cadastral_number_set 2, ?, ?", [$cadastral_id, $region_id]);
					Log::debug("exec pss..cadastral_number_set 2, $cadastral_id, $region_id");
					if (false && $r[0]->error != 0) {
						$error++;
					}
				} catch(\PDOException $e) {
					Log::error('addCadastral PDO exception.');
					Log::debug($e->getMessage());
					$error++;
				}
			}
			if ($error == 0) {
				return [
					'error' => 0,
					'msg' => 'OK'
				];
			} else {
				return [
					'error' => -4,
					'msg' => 'Ошибка при добавлении '.$error.' районов для кадастрового номера'
				];
			}
		} else {
			return [
				'error' => -3,
				'msg' => 'Ошибка при добавлении кадастрового номера'
			];
		}
	}
	public function modifyCadastral($cadastral_id, $type, $number, $descr, $url, $regions) {
		try {
			$r = DB::connection('sqlsrv')->select("exec pss..cadastral_number_set 1, ?, ?, ?, ?, ?", [$cadastral_id, $type, Helper::cyr1251($number), Helper::cyr1251($descr), Helper::cyr1251($url)]);
			Log::debug("exec pss..cadastral_number_set 1, $cadastral_id, $type, $number, $descr, $url");
			$r = [
				0 => new \stdClass
			];
			$r[0]->error = 0;
			$r[0]->msg = 123;
			if (isset($r[0]->error)) {
				if ($r[0]->error == 0) {
					$cadastral_id = $r[0]->msg;
				} else {
					return [
						'error' => $r[0]->error,
						'msg' => $r[0]->msg
					];
				}
			} else {
				Log::error('modifyCadastral error. Undefined error field');
				return [
					'error' => -1,
					'msg' => 'Ошибка при редактировании кадастрового номера'
				];
			}
		} catch(\PDOException $e) {
			Log::error('modifyCadastral PDO exception.');
			Log::debug($e->getMessage());
			return [
				'error' => -1,
				'msg' => 'Непредвиденная ошибка при редактировании кадастрового номера '.$cadastral_id
			];
		}
		if ($cadastral_id) {
			$error = 0;
			foreach($regions as $region_id) {
				try {
					$r = DB::connection('sqlsrv')->select("exec pss..cadastral_number_set 2, ?, ?", [$cadastral_id, $region_id]);
					Log::debug("exec pss..cadastral_number_set 2, $cadastral_id, $region_id");
					if ($r[0]->error != 0) {
						$error++;
					}
				} catch(\PDOException $e) {
					Log::error('modifyCadastral PDO exception.');
					Log::debug($e->getMessage());
					$error++;
				}
			}
			if ($error == 0) {
				return [
					'error' => 0,
					'msg' => 'OK'
				];
			} else {
				return [
					'error' => -4,
					'msg' => 'Ошибка при добавлении '.$error.' районов для кадастрового номера '.$cadastral_id
				];
			}
		} else {
			return [
				'error' => -3,
				'msg' => 'Ошибка при добавлении кадастрового номера'
			];
		}
	}

	public function searchPermits($search_string) {
		$search_string = Helper::cyr1251($search_string);
		$resp = [
			'data' => [],
			'error' => 0,
			'msg' => '',
		];
		try {
			$data = [];
			$r = DB::connection('sqlsrv')->select('exec pss..permit_get 1, ?', [$search_string]);
			foreach($r as $row) {
				$data[] = [
					'permit_id' => $row->id,
					'number' => $row->number,
					'date_from' => date('Y-m-d', strtotime(Helper::cyr($row->date))),
					'date_to' => date('Y-m-d', strtotime(Helper::cyr($row->closed)))
				];
			}
			$resp['data'] = $data;
		} catch(\PDOException $e) {
			Log::error('searchPermits PDO exception.');
			Log::debug($e->getMessage());
			$resp['error'] = -1;
			$resp['msg'] = 'Непредвиденная ошибка';
		}
		return $resp;
	}

	public function addPermit($number, $date_from, $date_to) {
		$number = Helper::cyr1251($number);
		try {
			$r = DB::connection('sqlsrv')->select('exec pss ..operating_permit_create 1, ?, ?, ?', [$number, $date_from, $date_to]);
			Log::debug("exec pss ..operating_permit_create 1, $number, $date_from, $date_to");
			if (isset($r[0]->error) && $r[0]->error == 0) {
				return [
					'error' => 0,
					'msg' => 'OK',
					'id' => $r[0]->msg
				];
			} else {
				return [
					'error' => $r[0]->error,
					'msg' => Helper::cyr($r[0]->msg)
				];
			}
		} catch(\PDOException $e) {
			Log::error('addPermits PDO exception.');
			Log::debug($e->getMessage());
			$resp['error'] = -1;
			$resp['msg'] = 'Непредвиденная ошибка';
		}
	}

	public function getBuildingCreator($address_id) {
		try {
			$r = DB::connection('sqlsrv')->select('exec pss..address_list_creator_get 1,?', [$address_id]);
			return [
				'name' => Helper::cyr($r[0]->name),
				'date' => $r[0]->created
			];
		} catch(\PDOException $e) {
			Log::error('getBuildingCreator PDO exception.');
			Log::debug($e->getMessage());
			return false;
		}
	}

	/**
	 * Get list for Building tab on build screen
	 * @see /inventory/building/{address_id}
	 *
	 * @return array
	 */
	public function getBuildingTabList($address_id) {
		Log::debug($address_id);
		$resp=[];
		try {
			$r = DB::connection('sqlsrv')->select('exec pss..address_doc_get 1, ?', [$address_id]);
			foreach($r as $row) {
				$resp[]=[
					'address_id' => $row->address_id,
					'system_building_type' => Helper::cyr($row->system_building_type),
					'work_documents' => Helper::cyr($row->work_documents),
					'company' => Helper::cyr($row->company),
					'agreement_expense' => Helper::cyr($row->agreement_expence),
					'agreement_income' => Helper::cyr($row->agreement_income),
					'doc_link' => Helper::cyr($row->doc_link),
					'date' => Helper::cyr(date('d.m.Y', strtotime($row->date))),
					'doc_link_ao' => Helper::cyr($row->doc_link_ao),
					'doc_link_pk' => Helper::cyr($row->doc_link_pk),
					'state_desk' => Helper::cyr($row->state_desk)
				];
			}
			return [
				'error' => 0,
				'data' => $resp
			];
		} catch(\PDOException $e) {
			Log::error('getBuildingTabList PDO exception.');
			Log::debug($e->getMessage());
			return [
				'error' => -1,
				'data' => []
			];
		}
	}

	public function getBuildingTabSystems() {
		$resp=[];
		try {
			$r = DB::connection('sqlsrv')->select('exec pss..system_building_type_get 1');
			foreach($r as $row) {
				$resp[] =[
					'value'=>Helper::cyr($row->type),
					'descr'=>Helper::cyr($row->desk)
				];
			}
			return [
				'error' => 0,
				'data' => $resp
			];
		} catch(\PDOException $e) {
			Log::error('getBuildingCreator PDO exception.');
			Log::debug($e->getMessage());
			return ['error'=>-1];
		}
	}

	public function getBuildingTabContractors($search_string) {
		$search_string = Helper::cyr1251($search_string);
		Log::debug($search_string);
		$resp=[];
		try {
			$r = DB::connection('sqlsrv')->select('exec pss..company_get 1,0,?', [$search_string]);
			foreach($r as $row) {
				$resp[] =[
					'value'=>$row->id,
					'descr'=>Helper::cyr($row->company)
				];
			}
			return [
				'error' => 0,
				'data' => $resp
			];
		} catch(\PDOException $e) {
			Log::error('getBuildingCreator PDO exception.');
			Log::debug($e->getMessage());
			return ['error'=>-1];
		}
	}

	public function getBuildingTabStatuses() {
		$resp=[];
		try {
			$r = DB::connection('sqlsrv')->select('exec pss..work_status_get 1');
			foreach($r as $row) {
				$resp[] =[
					'value'=>$row->type,
					'descr'=>Helper::cyr($row->desk)
				];
			}
			return [
				'error' => 0,
				'data' => $resp
			];
		} catch(\PDOException $e) {
			Log::error('getBuildingCreator PDO exception.');
			Log::debug($e->getMessage());
			return ['error'=>-1];
		}
	}

	public function addBuildingTabRecord($address_id, $params) {
		$params['address_id'] = $address_id;
		$params['system'] = Helper::cyr1251($params['system']);
		$params['rd'] = Helper::cyr1251($params['rd']);
		$params['agreement_expense'] = Helper::cyr1251($params['agreement_expense']);
		$params['agreement_income'] = Helper::cyr1251($params['agreement_income']);
		$params['doc_link'] = Helper::cyr1251($params['doc_link']);
		$params['doc_link_ao'] = Helper::cyr1251($params['doc_link_ao']);
		$params['doc_link_pk'] = Helper::cyr1251($params['doc_link_pk']);
		Log::debug($params);
		try {
			Log::debug("exec pss..address_doc_set 1,
				{$params['address_id']},
				{$params['system']},
				{$params['rd']},
				{$params['contractor']},
				{$params['agreement_expense']},
				{$params['agreement_income']},
				{$params['doc_link']},
				{$params['date']},
				{$params['doc_link_ao']},
				{$params['doc_link_pk']},
				{$params['status']}");
			$r = DB::connection('sqlsrv')->select('exec pss..address_doc_set 1,
				:address_id,
				:system,
				:rd,
				:contractor,
				:agreement_expense,
				:agreement_income,
				:doc_link,
				:date,
				:doc_link_ao,
				:doc_link_pk,
				:status',  $params);
			Log::debug($r);
			if (isset($r[0]->error) && $r[0]->error == 0) {
				return [
					'error' => 0,
					'msg' => 'OK',
					'id' => $r[0]->msg
				];
			} else {
				return [
					'error' => $r[0]->error,
					'msg' => Helper::cyr($r[0]->msg)
				];
			}
		} catch(\PDOException $e) {
			Log::error('addBuildingTabRecord PDO exception.');
			Log::debug($e->getMessage());
			$resp['error'] = -1;
			$resp['msg'] = 'Непредвиденная ошибка';
		}
	}

	public function getManagementCompanyIDs($address_id) {
		try {
			$r = DB::connection('sqlsrv')->select('exec address_list_other_get 1, ?',	[$address_id]);
			Log::debug($r);
			$resp = [];
			foreach($r as $id_row) {
				$resp[] = [
					'address_id' => $id_row->address_id,
					'address_id_other' => Helper::cyr($id_row->address_id_other),
					'company_id' => $id_row->company_id,
					'prefix' => Helper::cyr($id_row->prefix),
					'company' => Helper::cyr($id_row->company)
				];
			}
			return $resp;
		} catch(\PDOException $e) {
			Log::error('getManagementCompanyIDs PDO exception.');
			Log::debug($e->getMessage());
			$resp['error'] = -1;
			$resp['msg'] = 'Непредвиденная ошибка';
		}
	}

	public function addManagementCompanyID($address_id, $another_address_id, $company_id, $system=0) {
		try {
			Log::debug("exec address_id_other_set 1,
				$address_id,
				$another_address_id,
				$company_id,
				$system");
			$r = DB::connection('sqlsrv')->select('exec address_id_other_set 1,	?, ?, ?, ?',
				[
					$address_id,
					$another_address_id,
					$company_id,
					$system
				]);
			Log::debug($r);
			if (isset($r[0]->error) && $r[0]->error == 0) {
				return [
					'error' => 0,
					'msg' => 'OK',
					'id' => $r[0]->msg
				];
			} else {
				return [
					'error' => $r[0]->error,
					'msg' => Helper::cyr($r[0]->msg)
				];
			}
		} catch(\PDOException $e) {
			Log::error('addManagementCompanyID PDO exception.');
			Log::debug($e->getMessage());
			$resp['error'] = -1;
			$resp['msg'] = 'Непредвиденная ошибка';
		}
	}
}
