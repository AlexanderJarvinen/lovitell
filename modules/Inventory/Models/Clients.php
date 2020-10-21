<?php

namespace Modules\Inventory\Models;

use App\Components\Helper;
use \Log;
use \DB;

class Clients
{
	/**
	 * Return clients array with selected params
	 *
	 * @param array $params
	 * :region_id int
	 * :type int
	 * :street_id int
	 * :apartment string
	 * :ac_id int
	 * :company string
	 * :start_date string
	 * :end_date string
	 * :client_id 0
	 * :order string
	 * :is_comp int 0 or 1
	 *
	 * @return array or false
	 */
	function getClientsByParams(array $params) {
		try {
			$r = DB::connection('sqlsrv')->select("exec get_address_client_list 1,
				'',
				:region_id,
				:type,
				:address_id,
				:street_id,
				:apartment,
				:ac_id,
				:company,
				:start_date,
				:end_date,
				:client_id,
				:order,
				:is_comp",
				$params
			);
		} catch(\PDOException $e) {
			Log::error('GetClients EXCEPTION');
			Log::debug($e->getMessage());
			return false;
		}
		$resp = [];
		foreach ($r as $client_row) {
			$resp[] = [
				'id' => $client_row->id,
				'desk' => Helper::cyr($client_row->desk),
				'street' => Helper::cyr($client_row->street),
				'house' => $client_row->house,
				'body' => '',
				'apartment' => $client_row->appartment,
				'client' => Helper::cyr($client_row->client),
				'phone' => $client_row->phone,
				'address_id' => $client_row->address_id,
				'type' => Helper::cyr($client_row->type),
				'started' => $client_row->started,
				'is_comp' => $client_row->is_comp,
				'ac_id' => $client_row->ac_id,
				'date'=> $client_row->date
			];
		}
		return $resp;
	}

	public function getClientFullInformation($id) {
		$r = DB::connection('sqlsrv')->select("exec get_address_client_list 1");
	}

	public function blockClient($id) {
		$r = DB::connection('sqlsrv')->select("exec get_address_client_list 1");
	}


}
