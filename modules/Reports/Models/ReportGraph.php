<?php

namespace Modules\Reports\Models;

use App\Components\Helper;
use \Log;
use \DB;

class ReportGraph
{
	public static function getTotalWifi()
	{
		$r = [];
		try {
			$r = DB::connection('sqlsrv')->select('exec bill..www_private3 0,1');
		} catch (\PDOException $e) {
			Log::error('getTotalWifi PDO Exception');
			Log::debug($e->getMessage());
			return false;
		}
		$labels = [];
		$data_1 = [];
		$data_2 = [];
		for($i = count($r)-1; $i>=0; $i--) {
			$report_row = $r[$i];
			if ($report_row->desk == 'Total') {
				$labels[] = $report_row->date;
				$data_1[] = str_replace(' ', '', $report_row->amount);
				$data_2[] = str_replace(' ', '', $report_row->payment);
			}
		}
		$series = [
			[
				'label' => 'Выручка с НДС, руб.',
				'borderColor' => ['R'=>255,'G'=>65,'B'=>20, 'a'=>0.7],
				'data' => $data_1
			],
			[
				'label' => 'Платежи с НДС, руб.',
				'borderColor' => ['R'=>90,'G'=>180,'B'=>200, 'a'=>0.7],
				'data' => $data_2
			]
		];
		return [
			'labels' => $labels,
			'datasets' => $series,
			'type' => 'money'
		];
	}

	public static function getProceeds()
	{
		$r = [];
		try {
			$r = DB::connection('sqlsrv')->select('exec bill..www_private6 8');
		} catch (\PDOException $e) {
			Log::error('getProceeds PDO Exception');
			Log::debug($e->getMessage());
			return false;
		}
		$labels = [];
		$tv = [];
		$local = [];
		$wifi = [];
		for($i = count($r)-1; $i>=0; $i--) {
			$report_row = $r[$i];
			if ($report_row->desk == 'TV') {
				$tv[] = str_replace(' ', '', $report_row->amount);
			} else if($report_row->desk == 'Local') {
				$local[] = str_replace(' ', '', $report_row->amount);
			} else if ($report_row->desk == 'WiFi') {
				$wifi[] = str_replace(' ', '', $report_row->amount);
			} else if ($report_row->desk == 'Total') {
				$labels[] = $report_row->date;
			}
		}
		$series = [
			[
				'label' => 'КТВ',
				'borderColor' => ['R'=>0,'G'=>65,'B'=>20, 'a'=>0.7],
				'data' => $tv
			],
			[
				'label' => 'Кабельный интернет',
				'borderColor' => ['R'=>90,'G'=>180,'B'=>200, 'a'=>0.7],
				'data' => $local
			],
			[
				'label' => 'WiFi',
				'borderColor' => ['R'=>255,'G'=>65,'B'=>20, 'a'=>0.7],
				'data' => $wifi
			]
		];
		return [
			'labels' => $labels,
			'datasets' => $series,
			'type' => 'money'
		];
	}

	public static function getActive() {
		$r = [];
		try {
			$r = DB::connection('sqlsrv')->select('exec bill..www_private6 8');
		} catch (\PDOException $e) {
			Log::error('getProceeds PDO Exception');
			Log::debug($e->getMessage());
			return false;
		}
		$labels = [];
		$tv = [];
		$local = [];
		$wifi = [];
		for($i = count($r)-1; $i>=0; $i--) {
			$report_row = $r[$i];
			for($i = count($r)-1; $i>=0; $i--) {
				$report_row = $r[$i];
				if ($report_row->desk == 'Local') {
					$local[] = str_replace(' ', '', $report_row->active);
				} else if ($report_row->desk == 'WiFi') {
					$wifi[] = str_replace(' ', '', $report_row->active);
				} else if ($report_row->desk == 'Total') {
					$labels[] = $report_row->date;
				} else if ($report_row->desk == 'TV') {
					$tv[] = $report_row->active;
				}
			}
		}
		$series = [
			[
				'label' => 'Кабельный интернет',
				'borderColor' => ['R'=>85,'G'=>85,'B'=>85, 'a'=>0.7],
				'data' => $local
			],
			[
				'label' => 'КТВ',
				'borderColor' => ['R'=>25,'G'=>65,'B'=>20, 'a'=>0.7],
				'data' => $tv
			],
			[
				'label' => 'WiFi',
				'borderColor' => ['R'=>255,'G'=>65,'B'=>20, 'a'=>0.7],
				'data' => $wifi
			]
		];
		return [
			'labels' => $labels,
			'datasets' => $series,
			'type' => 'pieces'
		];
	}

	public static function getProceedsByGroups() {
		$r = [];
		try {
			$r = DB::connection('sqlsrv')->select('exec bill..dev1302 0');
		} catch (\PDOException $e) {
			Log::error('getProceedsByGroups PDO Exception');
			Log::debug($e->getMessage());
			return false;
		}
		$labels = [];
		$local_cable_fl = [];
		$molnia = [];
		$infrastructure= [];
		$ktv = [];
		$pik = [];
		$other_b2b = [];
		$wifi = [];
		foreach($r as $report_row) {
			$local_cable_fl[] = $report_row->local_cable_fl;
			$molnia[] = $report_row->molnia;
			$infrastructure[] = $report_row->infrastrukture;
			$ktv[] = $report_row->ktv;
			$pik[] = $report_row->pik;
			$other_b2b[] = $report_row->other_b2b;
			$wifi[] = $report_row->wifi;
			$labels[] = $report_row->date;
		}
		$series = [
			[
				'label' => 'Выручка от ФЛ',
				'borderColor' => ['R'=>40,'G'=>220,'B'=>40, 'a'=>0.7],
				'data' => $local_cable_fl
			],
			[
				'label' => 'Выручка Молния',
				'borderColor' => ['R'=>90,'G'=>180,'B'=>200, 'a'=>0.7],
				'data' => $molnia
			],
			[
				'label' => 'Выручка от инфраструктуры',
				'borderColor' => ['R'=>255,'G'=>0,'B'=>0, 'a'=>0.7],
				'data' => $infrastructure
			],
			[
				'label' => 'КТВ',
				'borderColor' => ['R'=>25,'G'=>65,'B'=>20, 'a'=>0.7],
				'data' => $ktv
			],
			[
				'label' => 'Выручка ГК "ПИК"',
				'borderColor' => ['R'=>0,'G'=>0,'B'=>0, 'a'=>0.7],
				'data' => $pik
			],
			[
				'label' => 'Выручка от иных B2B',
				'borderColor' => ['R'=>85,'G'=>85,'B'=>85, 'a'=>0.7],
				'data' => $other_b2b
			],
			[
				'label' => 'Выручка WiFi',
				'borderColor' => ['R'=>255,'G'=>120,'B'=>40, 'a'=>0.7],
				'data' => $wifi
			]
		];
		return [
			'labels' => $labels,
			'datasets' => $series,
			'type' => 'money'
		];
	}

	public static function getProceedsByGroups2() {
		$r = [];
		try {
			$r = DB::connection('sqlsrv')->select('exec bill..dev1302 0');
		} catch (\PDOException $e) {
			Log::error('getProceedsByGroups PDO Exception');
			Log::debug($e->getMessage());
			return false;
		}
		$labels = [];
		$local_cable_fl = [];
		$infrastructure= [];
		$ktv = [];
		$wifi = [];
		foreach($r as $report_row) {
			$local_cable_fl[] = $report_row->local_cable_fl;
			$infrastructure[] = $report_row->infrastrukture;
			$ktv[] = $report_row->ktv;
			$wifi[] = $report_row->wifi;
			$labels[] = $report_row->date;
		}
		$series = [
			[
				'label' => 'Выручка от ФЛ',
				'borderColor' => ['R'=>0,'G'=>0,'B'=>0, 'a'=>0.7],
				'data' => $local_cable_fl
			],
			[
				'label' => 'Выручка от инфраструктуры',
				'borderColor' => ['R'=>255,'G'=>0,'B'=>0, 'a'=>0.7],
				'data' => $infrastructure
			],
			[
				'label' => 'КТВ',
				'borderColor' => ['R'=>25,'G'=>65,'B'=>20, 'a'=>0.7],
				'data' => $ktv
			],
			[
				'label' => 'Выручка WiFi',
				'borderColor' => ['R'=>255,'G'=>120,'B'=>40, 'a'=>0.7],
				'data' => $wifi
			]
		];
		return [
			'labels' => $labels,
			'datasets' => $series,
			'type' => 'money'
		];
	}

	public static function getArrears($brand_id=0) {
		$r = [];
		try {
			$r = DB::connection('sqlsrv')->select('exec bill..report_det_new 1, ?', [$brand_id]);
		} catch(\PDOException $e) {
			Log::error('getProceedsByGroups PDO Exception');
			Log::debug($e->getMessage());
			return false;
		}
		$series = [];
		$labels = [];
		$i = 0;
		foreach($r as $k=>$report_row) {
			$dataset = [];
			foreach($report_row as $rk => $data) {
				if ($rk != 'name' && $rk != 'brand') {
					if ($i == 0) $labels[] = $rk;
					$dataset[] = (string)$data;
				}
			}
			$series_row = [
				'label' => ($brand_id==0?Helper::cyr($report_row->brand).' - ':'').Helper::cyr($report_row->name),
				'borderColor' => Helper::colorToBorder(Helper::getColor($i), 0.7),
				'data' => $dataset
			];
			$i++;
			$series[] = $series_row;
		}
		return [
			'labels' => $labels,
			'datasets' => $series,
			'type' => 'money'
		];
	}
}
