<?php

namespace Modules\Financial\Models;

use App\Components\Helper;
use \Log;
use \DB;

class Capex
{
	/**
	 * Get lsit of capex identifiers
	 *
	 * @return array
	 */
	public function getCapexList($searchString) {
		$searchString = Helper::cyr1251($searchString);
		try {
			$r = DB::connection('sqlsrv')->select("exec pss..capex_get 1, ?", [$searchString]);
			$resp = [
				'data' => [],
				'error' => 0
			];
			foreach($r as $row) {
				$row->code = str_replace('—', '-', Helper::cyr($row->code));
				$parsed = $this->parseCapexCode($row->code);
				$city_id = 0;
				if ($parsed['region']) {
					$city_id = $this->getCityForRegion($parsed['region']);
				}
				Log::debug($parsed);
				$resp['data'][] = [
					'capex_id' => Helper::cyr($row->id),
					'code' => $row->code,
					'agreement' => Helper::cyr($row->agreement),
					'amount' => str_replace('.', ',', Helper::cyr(round($row->amount, 2))),
					'type' => Helper::cyr($row->type),
					'work' => $parsed?$parsed['work']:'0',
					'system' => $parsed?$parsed['system']:0,
					'city' => $city_id,
					'region' => $parsed?$parsed['region']:0,
					'address' => $parsed?$parsed['address']:0
				];
			}
			return $resp;
		} catch(\PDOException $e) {
			Log::error('getCapexList exception');
			Log::debug($e->getMessage());
			return [
				'error' => -1,
				'mag' => 'Непредвиденная ошибка'
			];
		}
	}

	/**
	 * Add CAPEX idntifier
	 * @param array $params - params of Capex
	 *
	 * @return array ['error', 'msg'] - error 0 if OK, msg - error msg
	 */
	public function addCapex($params) {
		$params['code'] = Helper::cyr1251(str_replace(' ', '', $params['code']));
		$params['agreement'] = Helper::cyr1251($params['agreement']);
		$params['amount'] = str_replace(',', '.', Helper::cyr1251($params['amount']));
		$params['type'] = Helper::cyr1251($params['type']);
		Log::debug($params);
		try {
			$r = DB::connection('sqlsrv')->select("exec pss..capex_set 1,
				:code,
				:agreement,
				:amount,
				:type
			", $params);
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
			Log::error('addCapex exception');
			Log::debug($e->getMessage());
			return [
				'error' => -1,
				'msg' => 'Ошибка при добавлении CAPEX-идентификатора'
			];
		}
	}

	/**
	 * Modify CAPEX
	 * @param array $params - params of Capex
	 *
	 * @return array ['error', 'msg'] - error 0 if OK, msg - error msg
	 */
	public function modifyCapex($params) {
		$params['code'] = Helper::cyr1251(str_replace(' ', '', $params['code']));
		$params['agreement'] = Helper::cyr1251($params['agreement']);
		$params['amount'] = str_replace(',', '.', Helper::cyr1251($params['amount']));
		$params['type'] = Helper::cyr1251($params['type']);
		Log::debug($params);
		try {
			$r = DB::connection('sqlsrv')->select("exec pss..capex_edit 1,
				:id,
				:code,
				:agreement,
				:amount,
				:type
			", $params);
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
			Log::error('addCapex exception');
			Log::debug($e->getMessage());
			return [
				'error' => -1,
				'msg' => 'Ошибка при добавлении CAPEX-идентификатора'
			];
		}
	}

	public function getSystems() {
		try {
			$r = DB::connection('sqlsrv')->select("exec pss..system_type_get 1");
			$resp = [];
			$resp[] = [
				'value' => '0',
				'descr' => 'Не выбрана'
			];
			foreach($r as $row) {
				$resp[] = [
					'value' => Helper::cyr($row->type),
					'descr' => Helper::cyr($row->desk)
				];
			}
			return $resp;
		} catch(\PDOException $e) {
			Log::error('getSystems exception');
			Log::debug($e->getMessage());
			return [];
		}
	}

	public function getWorks() {
		try {
			$r = DB::connection('sqlsrv')->select("exec pss..work_type_get 1");
			$resp = [];
			foreach($r as $row) {
				$resp[] = [
					'value' => Helper::cyr($row->type),
					'descr' => Helper::cyr($row->desk)
				];
			}
			return $resp;
		} catch(\PDOException $e) {
			Log::error('getWorks exception');
			Log::debug($e->getMessage());
			return [];
		}
	}

	public function parseCapexCode($capexCode) {
		Log::debug($capexCode);
		if (preg_match('/^([А-Я])([А-Я0-9]{3})([0-9]?[0-9])(-(\d+))?$/u', $capexCode, $matches)) {
			Log::debug($matches);
			return[
				'work' => $matches[1],
				'system' => $matches[2],
				'region' => intval($matches[3]),
				'address' => isset($matches[5])?intval($matches[5]):0
			];
		}
	}

	public function getCityForRegion($region_id) {
		$region_id = intval($region_id);
		if ($region_id) {
			try {
				$r = DB::connection('sqlsrv')->select("exec pss..addres_get_info 7,?", [$region_id]);
				if ($r[0] && $r[0]->city_id) {
					return $r[0]->city_id;
				}
			} catch (\PDOException $e) {
				Log::error('getCityForRegion exception');
				Log::debug($e->getMessage());
			}
		} else {
			Log::info('Wrong region ID: '.$region_id);
			return 0;
		}
	}

	public function getContractorByAC($ac_id) {
		$ac_id = Helper::cyr1251($ac_id);
		try {
			$r = DB::connection('sqlsrv')->select("exec bill..acfind 0, ?", [$ac_id]);
			if (isset($r[0])) {
				return [
					'error' => 0,
					'data' => Helper::cyr($r[0]->company)
				];
			} else {
				return [
					'error' => 0,
					'data' => false
				];
			}
		} catch(\PDOException $e) {
			Log::error("getContractorByAC EXCEPTION");
			Log::debug($e->getMessage());
			return [
				'error' => -1,
				'msg' => 'Непредвиденная ошибка'
			];
		}
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
}
