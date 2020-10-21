<?php

namespace Modules\Inventory\Models;

use \Log;
use \DB;

class InventoryGraph
{
	public $month=array('Янв','Фев','Мар','Апр','Май','Июн','Июл','Авг','Сен','Окт','Ноя','Дек');
	public $week=array("вс", "пн","вт","ср","чт","пт","сб");

	public function getTotal($id, $type, $group, $start, $end, $brand_id) {
		$params = [
			'start' => iconv('utf8', 'cp1251', $start),
			'end' => iconv('utf8', 'cp1251', $end),
			'type' => $type,
			'group' => $group,
			'brand_id' => $brand_id
		];
		$resp = [];
		if ($id != 222 && $id != 99999) {
			$params['id'] = $id;
			Log::debug('exec bill..report_avaiable_total 0, '.$params['start'].', '.$params['end'].', '.$params['id'].', '.$params['type'].', '.$params['group'].', '.$params['brand_id']);
			$resp = DB::connection('sqlsrv')->select("exec bill..report_avaiable_total 0, :start, :end, :id, :type, :group, :brand_id", $params);
		} else {
			Log::debug('exec bill..report_avaiable_total 9999, '.$params['start'].', '.$params['end'].', '.$params['id'].', '.$params['type'].', '.$params['group'].', '.$params['brand_id']);
			$resp = DB::connection('sqlsrv')->select("exec bill..report_avaiable_total 99999, :start, :end, 1, :type, :group, :brand_id", $params);
		}
		return $resp;
	}

	function getAmount($type, $group, $brand_id){
		$params = [
			'type' => $type,
			'group' => $group,
			'brand_id' => $brand_id
		];
		Log::debug('exec bill..report_avaiable_amount 0, '.$params['type'].', '.$params['group'].', '.$params['brand_id']);
		$resp = DB::connection('sqlsrv')->select("exec bill..report_avaiable_amount 0, :type, :group, :brand_id", $params);
		foreach($resp as $k=>$row) {
			$resp[$k]->desk = iconv('cp1251', 'utf8', $row->desk);
		}
		return $resp;
	}

	public function getTotalChartjs($id, $type, $group, $start, $end, $brand_id) {
		$params = [
			'start' => iconv('utf8', 'cp1251', $start),
			'end' => iconv('utf8', 'cp1251', $end),
			'type' => $type,
			'group' => $group,
			'brand_id' => $brand_id
		];
		$resp = [];
		if ($id != 222 && $id != 99999) {
			$params['id'] = $id;
			Log::debug('exec bill..report_avaiable_total 0, '.$params['start'].', '.$params['end'].', '.$params['id'].', '.$params['type'].', '.$params['group'].', '.$params['brand_id']);
			$resp = DB::connection('sqlsrv')->select("exec bill..report_avaiable_total 0, :start, :end, :id, :type, :group, :brand_id", $params);
		} else {
			Log::debug('exec bill..report_avaiable_total 9999, '.$params['start'].', '.$params['end'].', 1, '.$params['type'].', '.$params['group'].', '.$params['brand_id']);
			$resp = DB::connection('sqlsrv')->select("exec bill..report_avaiable_total 99999, :start, :end, 1, :type, :group, :brand_id", $params);
		}
		$palette = [];
		$data = [];
		$labels = [];
		foreach($resp as $data_row) {
			$data_row = (array)$data_row;
			if ($id == 222 || $id == 99999) {
				$type = 'pieces';
				$utf_desk = explode(PHP_EOL, trim(str_replace(['ЮАО', 'Красногорск.', 'Люберцы.'],'', iconv('cp1251', 'utf8', $data_row['desk']))));
				array_push($labels, $utf_desk);
			} else {
				$mon = 0 + substr($data_row['started'], 4, 2);
				if ($id == 3) {
					$ddate = $this->month[$mon - 1] . ' ' . substr($data_row['started'], 2, 2) . ' ';
				} else if ($id == 2) {
					$ddate = substr($data_row['started'], 6, 2) . ' ' . $this->month[$mon - 1] . ' ' . substr($data_row['started'], 2, 2) . ' ';
				} else {
					//$week[date("w",mktime (0, 0, 0, substr($row['started'],4,2), substr($row['started'],6,2), substr($row['started'],0,4)))];
					//$week[date("w",mktime (0, 0, 0,'11','11', '2015'))];
					//$date=explode("-", $date);
					//$week = date("w", mktime(0, 0, 0, $date[1], $date[2], $date[0]));
					$dnum = date("w", mktime(0, 0, 0, substr($data_row['started'], 4, 2), substr($data_row['started'], 6, 2), substr($data_row['started'], 0, 4)));
					$ddate = '      ' . $this->week[$dnum] . '
' . substr($data_row['started'], 6, 2) . ' ' . $this->month[$mon - 1] . ' ' . substr($data_row['started'], 2, 2) . ' ';
				}
				array_push($labels, $ddate);
			}
			if ($type == -3 or $type == 11) {
				$type = 'percent';
				array_push($data, $data_row['avaiables']);
				if ($data_row['avaiables'] >= 97)
					array_push($palette, array("R" => 78, "G" => 186, "B" => 111));    # зеленый
				else if ($data_row['avaiables'] >= 96)
					array_push($palette, array("R" => 244, "G" => 194, "B" => 9,));    # желтый
				else if ($data_row['avaiables'] >= 95)
					array_push($palette, array("R" => 220, "G" => 152, "B" => 1));    # оранжеывй
				else
					array_push($palette, array("R" => 176, "G" => 1, "B" => 6));    # красный
			} else	{
				$type = 'percent';
				array_push($data, $data_row['avaiables']);
				if($data_row['avaiables'] >= 99.8)
					array_push($palette, array("R"=>78,"G"=>186,"B"=>111,"Alpha"=>100));	# зеленый
				else if ($data_row['avaiables'] >= 99.7)
					array_push($palette, array("R"=>244,"G"=>194,"B"=>9,"Alpha"=>100));	# желтый
				else if ($data_row['avaiables'] >= 99.5)
					array_push($palette, array("R"=>220,"G"=>152,"B"=>1,"Alpha"=>100));	# оранжеывй
				else
					array_push($palette, array("R"=>176,"G"=>1,"B"=>6,"Alpha"=>100));	# красный
			}
		}
		return [
            'labels' => $labels,
			'type' => $type,
            'datasets' => [
                [
    			    'palette' => $palette,
                    'data' => $data
                ]
            ]
		];
	}

	function getAmountChartjs($type, $group, $brand_id){
		$params = [
			'type' => $type,
			'group' => $group,
			'brand_id' => $brand_id
		];
		Log::debug('exec bill..report_avaiable_amount 0, '.$params['type'].', '.$params['group'].', '.$params['brand_id']);
		$resp = DB::connection('sqlsrv')->select("exec bill..report_avaiable_amount 0, :type, :group, :brand_id", $params);
		$region = [];
		$total = [];
		$off = [];
		$palette_t=[];
		$palette_o=[];
		foreach($resp as $k=>$row) {
			if ($row->region == 0) continue;

            $region[] = explode(PHP_EOL, trim(str_replace(['ЮАО', 'Красногорск.', 'Люберцы.'],'', iconv('cp1251', 'utf8', $row->desk))));
			$palette_t[] = array("R"=>78,"G"=>186,"B"=>111,"Alpha"=>100);
			$palette_o[] = array("R"=>176,"G"=>1,"B"=>6,"Alpha"=>100);
            $total[] = $row->total;
            $off[] = $row->state_off;
        }
        return [
            'labels' => $region,
			'type' => 'pieces',
            'datasets' => [
                [
                    'palette' => $palette_t,
                    'data'=>$total
                ],
                [
                    'palette' => $palette_o,
                    'data'=>$off
                ]
            ]
       ];
	}
}
