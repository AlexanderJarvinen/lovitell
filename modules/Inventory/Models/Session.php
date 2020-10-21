<?php

namespace Modules\Inventory\Models;

use App\Components\BusConnector;
use App\Components\Helper;
use \Log;
use \DB;
use \Storage;

class Session
{
	public function getSessions($search_string)
	{
		$search_string = trim($search_string);
		$resp = [
			'error' => 0,
			'data' => []
		];
		if (Helper::checkIp($search_string)) {
			$info = $this->getSessionByIp($search_string);
		} else {
			$info= $this->getSessionsByMac($search_string);
		}
		Log::debug($info);
		if ($info) {
			$resp['data'][]=$info;
		}
		Log::debug('RESP:');
		Log::debug($resp);
		return $resp;
	}

	public function getSessionByIp($ip)
	{
		$resp = BusConnector::request('bras/get_session_info',['ip_address'=>$ip]);
		if ($resp['error'] == 0) {
			$resp = $resp['data'];
			if (isset($resp->data) && $resp->data && is_object($resp->data)) {
				$data = $resp->data;
				if ($data->traffic_info[0]->acl_traffic_direction == 'in') {
					$in = [
						'bytes' => $data->traffic_info[0]->acl_traffic_bytes,
						'pockets' => $data->traffic_info[0]->acl_traffic_packets
					];
					$out = [
						'bytes' => $data->traffic_info[1]->acl_traffic_bytes,
						'pockets' => $data->traffic_info[1]->acl_traffic_packets
					];
				} else {
					$out = [
						'bytes' => $data->traffic_info[0]->acl_traffic_bytes,
						'pockets' => $data->traffic_info[0]->acl_traffic_packets
					];
					$in = [
						'bytes' => $data->traffic_info[1]->acl_traffic_bytes,
						'pockets' => $data->traffic_info[1]->acl_traffic_packets
					];
				}
				$services = [];
				if (is_array($data->services_info)) {
					foreach ($data->services_info as $service) {
						$services[] = $service;
					}
				} else {
					$services[] = $data->services_info;
				}
				return [
					'ip_addr' => $data->ipv4,
					'mac' => Helper::strToMac($data->mac, false, '.'),
					'session_time' => $data->session_uptime,
					'rental_time' => (isset($data->dhcp_lease_info) && isset($data->dhcp_lease_info->expiration))?$data->dhcp_lease_info->expiration:'',
					'status' => $data->status,
					'location' => (isset($data->location_info) && $data->location_info->name)?$data->location_info->name:'',
					'active_service' => $services,
					'traffic' => [
						'IN' => 'IN',
						'OUT' => 'OUT'
					],
					'bytes_count' => [
						'in' => $in['bytes'],
						'out' => $out['bytes']
					],
					'pockets_count' => [
						'in' => $in['pockets'],
						'out' => $out['pockets']
					]
				];
			} else {
				return [];
			}
		} else {
			return [];
		}
	}

	public function getSessionsByMac($mac)
	{
		$mac = strtolower(implode('.', str_split(preg_replace("/[^a-fA-F0-9]/", '', $mac), 4)));
		$resp = BusConnector::request('bras/get_session_info',['mac'=>$mac]);
		if ($resp['error'] == 0) {
			$resp = $resp['data'];
			if (isset($resp->data) && $resp->data && is_object($resp->data)) {
				$data = $resp->data;
				if ($data->traffic_info[0]->acl_traffic_direction == 'in') {
					$in = [
						'bytes' => $data->traffic_info[0]->acl_traffic_bytes,
						'pockets' => $data->traffic_info[0]->acl_traffic_packets
					];
					$out = [
						'bytes' => $data->traffic_info[1]->acl_traffic_bytes,
						'pockets' => $data->traffic_info[1]->acl_traffic_packets
					];
				} else {
					$out = [
						'bytes' => $data->traffic_info[0]->acl_traffic_bytes,
						'pockets' => $data->traffic_info[0]->acl_traffic_packets
					];
					$in = [
						'bytes' => $data->traffic_info[1]->acl_traffic_bytes,
						'pockets' => $data->traffic_info[1]->acl_traffic_packets
					];
				}
				$services = [];
				if (is_array($data->services_info)) {
					foreach ($data->services_info as $service) {
						$services[] = $service;
					}
				} else {
					$services[] = $data->services_info;
				}
				return [
					'ip_addr' => $data->ipv4,
					'mac' => Helper::strToMac($data->mac),
					'session_time' => $data->session_uptime,
					'rental_time' => (isset($data->dhcp_lease_info) && isset($data->dhcp_lease_info->expiration))?$data->dhcp_lease_info->expiration:'',
					'status' => $data->status,
					'location' => (isset($data->location_info) && $data->location_info->name)?$data->location_info->name:'',
					'active_service' => $services,
					'traffic' => [
						'IN' => 'IN',
						'OUT' => 'OUT'
					],
					'bytes_count' => [
						'in' => $in['bytes'],
						'out' => $out['bytes']
					],
					'pockets_count' => [
						'in' => $in['pockets'],
						'out' => $out['pockets']
					]
				];
			} else {
				return [];
			}
		} else {
			return [];
		}
	}

	/**
	 * Logoff session by IP
	 */
	public function logofSession($ip) {
		Log::debug("Logoff");
		if (Helper::checkIp($ip)) {
			$resp = BusConnector::request('bras/account_logoff', ['username' => $ip]);
			if ($resp['error'] == 0) {
				$resp = $resp['data'];
				if (isset($resp->metadata) && isset($resp->metadata->result)) {
					if ($resp->metadata->result == "1") {
						return [
							'error' => 0,
							'msg' => 'OK'
						];
					} else {
						return [
							'error' => 1,
							'msg' => $resp->metadata->reason
						];
					}
				} else {
					return [
						'error' => -2,
						'Неожиданный ответ ESB'
					];
				}
			} else {
				return $resp;
			}
		} else {
			return [
				'error' => -1,
				'Передан не правильный IP'
			];
		}
	}

}
