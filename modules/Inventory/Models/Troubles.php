<?php

namespace Modules\Inventory\Models;

use App\Components\Helper;
use \Log;
use \DB;

class Troubles
{
	/**
	 * Return list of Trouble Tickets for current Building and type
	 *
	 * @param $type
	 * @param $address_id - Address ID
	 * @param string $order - sort order
	 * @param string $begin_date - begin date of date range
	 * @param string $end_date - end date of date range
	 * @return array - List of Trouble Tickets
	 */
	function getTroublesByTypeForAddress($type,$address_id, $begin_date='', $end_date='',$order='priority desc') {
		$r = [];
		$resp = [];
		try {
			$r = DB::connection('sqlsrv')
				->select("exec pss..view_troubles_itm 0, '',
				:type,
				:address_id,
				:order,
				:begin_date,
				:end_date",
				[
					'type'=>$type,
					'address_id'=>$address_id,
					'order'=>$order,
					'begin_date'=>$begin_date,
					'end_date'=>$end_date
				]);
		} catch(\PDOException $e) {
			Log::error('GetTroublesByType EXCEPTION');
			Log::debug($e->getMessage());
			return false;
		}
		foreach ($r as $trouble_row) {
			$resp[] = [
				'id' => $trouble_row->id,
				'subject' => Helper::cyr($trouble_row->subject),
				'create_date' => $trouble_row->create_date,
				'close_date' => $trouble_row->close_date,
				'type_desk' => Helper::cyr($trouble_row->type_desk),
				'type' => $trouble_row->type,
				'type_object' => $trouble_row->type_object,
				'r_id' => $trouble_row->r_id,
				'creator' => $trouble_row->creator,
				'cr_name' => Helper::cyr($trouble_row->cr_name),
				'trouble_state' => $trouble_row->trouble_state,
				'close_desk' => Helper::cyr($trouble_row->close_desk),
				'man' => $trouble_row->man,
				'priority' => $trouble_row->priority,
			];
		}
		return $resp;
	}

	/**
	 * Return list of Trouble Tickets for current Building and type
	 *
	 * @param $type
	 * @param $address_id - Address ID
	 * @param string $order - sort order
	 * @param string $begin_date - begin date of date range
	 * @param string $end_date - end date of date range
	 * @return array - List of Trouble Tickets
	 */
	function getTroublesForAddress($type,$address_id, $begin_date='', $end_date='',$order='priority desc') {
		$resp = [
			'1'=>[],
			'2'=>[]
		];
		$r = [];
		try {
			$r = DB::connection('sqlsrv')->select("exec pss..view_troubles_itm 0, '', 1, ?, ?, ?, ?", [$address_id, $type, $order, $begin_date, $end_date]);
		} catch(\PDOException $e) {
			Log::error('GetTroublesByType EXCEPTION');
			return false;
		}
		foreach ($r as $trouble_row) {
			$resp[1][] = [
				'id' => $trouble_row->id,
				'subject' => Helper::cyr($trouble_row->subject),
				'create_date' => $trouble_row->create_date,
				'close_date' => $trouble_row->close_date,
				'type_desk' => Helper::cyr($trouble_row->type_desk),
				'type' => $trouble_row->type,
				'type_object' => $trouble_row->type_object,
				'r_id' => $trouble_row->r_id,
				'creator' => $trouble_row->creator,
				'cr_name' => Helper::cyr($trouble_row->cr_name),
				'trouble_state' => $trouble_row->trouble_state,
				'close_desk' => Helper::cyr($trouble_row->close_desk),
				'man' => $trouble_row->man,
				'priority' => $trouble_row->priority,
			];
		}
		try {
			$r = DB::connection('sqlsrv')->select("exec bill..view_troubles_itm 0, '', 2, ?, ?, ?, ?", [$address_id, $order, $begin_date, $end_date]);
		} catch(\PDOException $e) {
			Log::error('GetTroublesByType EXCEPTION');
			return false;
		}
		foreach ($r as $trouble_row) {
			$resp[2][] = [
				'id' => $trouble_row->id,
				'subject' => Helper::cyr($trouble_row->subject),
				'create_date' => $trouble_row->create_date,
				'close_date' => $trouble_row->close_date,
				'type_desk' => Helper::cyr($trouble_row->type_desk),
				'type' => $trouble_row->type,
				'type_object' => $trouble_row->type_object,
				'r_id' => $trouble_row->r_id,
				'creator' => $trouble_row->creator,
				'cr_name' => Helper::cyr($trouble_row->cr_name),
				'trouble_state' => $trouble_row->trouble_state,
				'close_desk' => Helper::cyr($trouble_row->close_desk),
				'man' => $trouble_row->man,
				'priority' => $trouble_row->priority,
			];
		}
		return $resp;
	}
}
