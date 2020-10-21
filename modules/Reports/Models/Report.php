<?php

namespace Modules\Reports\Models;

use App\Components\Helper;
use DB;
use Log;

class Report
{
	public $id;
	public $title;
	public $columns;
	public $is_init;
	public $command;
	public $params;
	public $filters;

	public static $D_TYPE_PIECHART = 'D_TYPE_PIECHART';
    public static $D_TYPE_LINECHART = 'D_TYPE_LINECHART';
    public static $D_TYPE_BARCHAR = 'D_TYPE_BARCHART';
    public static $D_TYPE_AREACHART = 'D_TYPE_AREACHART';

	public function __construct($id) {
		$this->id = $id;
		$this->init();
	}

	public function init() {
       	$this->params = [];
		try {
			$r = DB::connection('sqlsrv')->select('exec pss..create_menu 0');
		} catch(\PDOException $e) {
			Log::error("Init report false");
			$this->is_init = false;
			return;
		}
		foreach($r as $report_row) {
			if ($report_row->id == $this->id) {
				Log::debug(var_export($report_row, true));
				foreach($r as $parent_row) {
					if ($parent_row->id == $report_row->parent) {
						$this->title = iconv('cp1251', 'utf8', $parent_row->desk)." — ".iconv('cp1251', 'utf8', $report_row->desk);
						break;
					}
				}
				$this->params['title'] = $this->title;
				$this->params['is_complex'] = 0;
				$command = json_decode(iconv('cp1251', 'utf8', $report_row->command));
				$this->command = $command->cmd;
				foreach($command->header->col as $report_header_col) {
					$col = ['label'=>$report_header_col->row[0]->desk[0]];
					if (isset($report_header_col->row[1])) {
						$this->params['is_complex'] = 1;
						$col['colspan'] = count($report_header_col->row[1]->desk);
						foreach($report_header_col->row[1]->desk as $children) {
							$col['childrens'][]=$children;
						}
					}
					$this->columns[] = $col;
				}
				$this->params['filters'] = [];
				if (isset($command->input) && is_array($command->input)) {
					$date = 0;
					$text = 0;
					$select = 0;
					$select_data=[];
					foreach ($command->input as $inp_field) {
						if (is_object($inp_field)) {
							if ($inp_field->type == 'date') $date++;
							elseif($inp_field->type == 'text') $text++;
							elseif($inp_field->type == 'select') {
								$select++;
								$select_data = $inp_field->data;
							}
						} else {
							if ($inp_field == 'date') $date++;
							elseif($inp_field == 'text') $text++;
						}
					}
					if ($date == 1) {
						$this->params['filters']['date'] = [
							'is_required' => 1
						];
					} else if ($date == 2) {
						$this->params['filters']['date_range'] = [
							'is_required'=>1
						];
					}
					if ($text > 0) {
						$this->params['filters']['text'] = [
							'is_required' => 1
						];
					}
					if ($select>0) {
						$this->params['filters']['select'] = [
							'is_required' => 1,
							'data' => $select_data
						];
					}
				}
				if (isset($command->label) && is_array($command->label)) {
					foreach($command->label as $k=>$label) {
						if (isset($this->params['filters']['date_range']) && ($label=='Дата с' ||$label=='Дата по')) {
							continue;
						} elseif (isset($this->params['filters']['date']) && $label=='Дата') {
							continue;
						}
						if ($command->input[$k] == 'text') {
							$this->params['filters']['text']['label'] = $label;
						} else if (is_object($command->input[$k]) && $command->input[$k]->type == 'select') {
							$this->params['filters']['select']['label'] = $label;
						}
					}
				}
				$this->params['orientation'] = 1;
			}
		}
		$this->is_init = true;
	}

	public function title() {

		return $this->title;
	}

	public function getData() {
		return $this->getReportData();
	}

	public function	parseFilters($filters) {
		$params=[];
		foreach($this->params['filters'] as $key=>$filter) {
			switch($key) {
				case 'date_range':
					$params[] = $filters['date_range']['start_date'];
					$params[] = $filters['date_range']['end_date'];
					break;
				case 'date':
					$params[] = $filters['date'];
					break;
				case 'text':
					$params[] = $filters['text'];
					break;
				case 'select':
					$params[] = $filters['select'];
			}
		}
		$this->filters = $params;
		$this->addParamsToCommand();
	}

	public function addParamsToCommand() {
		$params_count = count($this->filters);
		if ($params_count > 0) {
			for($i=0; $i<$params_count; $i++) {
				$this->command .= ',?';
			}
		}
	}

	public function getReportColumns() {
		return $this->columns;
	}

	public function getReportParams() {
		return $this->params;
	}

	public function getReportData() {
		$resp['columns'] = $this->columns;
		$r = DB::connection('sqlsrv')->select($this->command, $this->filters);
		$resp['data']=[];
		foreach($r as $id=>$report_row) {
			$row=[];
			$i=0;
			$row['id'] = $id;
			foreach($report_row as $k=>$report_col) {
				if ($k == 'tr_bg_col') {
					$row['tr_bg_col'] = $report_col;
					continue;
				}
				$row['col'.$i++] = iconv('cp1251', 'utf8', $report_col);
			}
			$row['rowkey'] = $id;
			$resp['data'][]=$row;
		}
		return $resp;
	}

	public function getReportDataExport() {
		Log::debug(var_export($this, true));
		$r = DB::connection('sqlsrv')->select($this->command, $this->filters);
		$resp=[];
		if ($this->params['is_complex']) {
			$col_num=0;
			$first_row=[];
			$second_row=[];
			foreach($this->columns as $col) {
				$first_row[] = $col['label'];
				if (isset($col['childrens'])) {
					$col_num += $col['colspan'];
					for($i=0;$i<$col['colspan']-1;$i++) $first_row[]='';
					foreach ($col['childrens'] as $child) {
						$second_row[]=$child;
					}
				} else {
					$second_row[]='';
					$col_num++;
				}
			}
			$resp[]=$first_row;
			$resp[]=$second_row;
		} else {
			$col_num = count($this->columns);
			$row=[];
			foreach($this->columns as $col) {
				$row[] = $col['label'];
			}
			$resp[]=$row;
		}
		$colors = [];
		$offset = ($this->params['is_complex'])?3:2;
		$format = [];
		$first = true;
		foreach ($r as $id => $report_row) {
			$row = [];
			$i = 0;
			foreach ($report_row as $col) {
				if ($i >= $col_num) break;
				if (preg_match('/^<font color=(.*)>(.*)<\/font>$/', iconv('cp1251', 'utf8', $col), $match)) {
					if (preg_match('/^[0-9 ]+$/', $match[2])) {
						$match[2] = str_replace(' ', '', $match[2]);
					}
					if ($first) {
						if ($match[2] == intval($match[2])) {
							$format[Helper::getCharByNumber($i)] = '@';
						} else if ($match[2] == floatval($match[2])) {
							$format[Helper::getCharByNumber($i)] = '0.00';
						} else {
							$format[Helper::getCharByNumber($i)] = '@';
						}
					}
					$colors[] = ['cell' => Helper::getCharByNumber($i) . ($id+$offset), 'color' => ($match[1]=='red')?'#880000':'#00FF00'];
				} else {
					if (preg_match('/^[0-9 ]+$/', $col)) {
						$col = str_replace(' ', '', $col);
					}
					if ($col == intval($col)) {
						$format[Helper::getCharByNumber($i)] = '@';
					} else if ($col == floatval($col)) {
						$format[Helper::getCharByNumber($i)] = '0.00';
					} else {
						$format[Helper::getCharByNumber($i)] = '@';
					}
					$row[] = $col==NULL?'':iconv('cp1251', 'utf8', $col);
				}
				$i++;
			}
			$first = false;
			$resp[] = $row;
		}
		$resp['data'] = $resp;
		$resp['colors'] = $colors;
		$resp['format'] = $format;
		return $resp;
	}

	public function getreport_trouble_fin() {
		$result = [];
		$r = DB::connection('sqlsrv')->select('exec pss..report_trouble_fin 0');
//		$r = mssql_query('pss..user_auth_', $this->connection);
		foreach($r as $key=>$row) {
			$row = (array) $row;
			$row['trouble_desk'] = iconv('cp1251', 'utf8', $row['trouble_desk']);
			$row['desk'] = iconv('cp1251', 'utf8', $row['desk']);
			$row['id'] = $key;
			if($row['id'] <= 4) {
				$row['selected'] = 1;
			} else {
				$row['selected'] = 0;
			}
			$result[] = $row;
		}
		return $result;
	}

	public function getLinechartData($lines) {
		$data = $this->getData();
		$resp = [];
		$y_max=0;
		foreach($lines as $line) {
			$chart_data=[];
			for($i=1; $i<=12; $i++) {
				if ($data[$line]['qty'.$i]>$y_max) $y_max = $data[$line]['qty'.$i];
				$chart_data[] = ['x'=>$i, 'y'=>$data[$line]['qty'.$i]];
			}
			$resp['data'][] = ['name' => $data[$line]['trouble_desk'], 'values'=>$chart_data];
		}
		$resp['options']['ymax'] = $y_max;
		return $resp;
	}

	public function getPiechartData($lines, $column_name='qty_total') {
		$data = $this->getData();
		$resp = [];
		foreach($lines as $line) {
			$resp['data'][] = ['label' => $data[$line]['trouble_desk'], 'value'=> $data[$line][$column_name]];
		}
		return $resp;
	}

	public function getAreachartData($lines) {
		$data = $this->getData();
		$resp = [];
		$y_max=0;
		foreach($lines as $line) {
			$chart_data=[];
			for($i=1; $i<=12; $i++) {
				if ($data[$line]['qty'.$i]>$y_max) $y_max = $data[$line]['qty'.$i];
				$chart_data[] = [$i, $data[$line]['qty'.$i]];
			}
			$resp['data'][] = ['name' => $data[$line]['trouble_desk'], 'values'=>$chart_data];
		}
		for($i=1; $i<=12; $i++) {
			$sum = 0;
			foreach($lines as $line) {
				$sum += $data[$line]['qty'.$i];
			}
			if ($sum>$y_max) $y_max = $sum;
		}
		$resp['options']['ymax'] = $y_max+5;
		return $resp;
	}

	public function getBarchartData($lines) {
		$data = $this->getData();
		$resp = [];
		$y_max=0;
		$chart_data = [];
		$i=1;
		foreach($lines as $line) {
			$chart_data[] = ['x'=>$i++, 'y'=>intval($data[$line]['qty_total'])];
			if ($data[$line]['qty_total']>$y_max) $y_max = $data[$line]['qty_total'];
		}
		$resp['data'][] = ['name' => 'Total', 'values'=>$chart_data];
		$resp['options']['ymax'] = $y_max+5;
		return $resp;
	}

}
