<?php

namespace Modules\Reports\Http\Controllers;

use App\Components\Helper;
use Illuminate\Support\Facades\Log;
use Modules\Reports\Models\ReportRights;
use Modules\Reports\Models\ReportSettings;
use Pingpong\Modules\Routing\Controller;
use Illuminate\Http\Request;
use Modules\Reports\Models\Report;
use Modules\Reports\Models\Chart;
use App\Components\Menu\Menu;
use Auth;
use Excel;

class ReportsController extends Controller {

	public $menu;

	public function __construct(Menu $menu)
	{
		$this->menu=$menu;
		$this->middleware('auth');
	}

	public function index()
	{
		return view('reports::index');
	}

	public function showReport(Request $request, $name)
	{
		$model = new Report($name, $request->user()->getBillingConnection());
		try {
			$data = $model->getData();
		} catch (\ErrorException $e) {
			return view('errors.report');
		}
		return view('modules.reports.report', [
			'report_name' => $name,
			'params' => $model->getReportParams(),
			'title' => 'Отчеты',
			'data' => $data,
			'user' => Auth::user(),
			'menu' => $this->menu,
			'pagename' => 'report'
		]);
	}

	public function showReport2(Request $request, $id)
	{
		$model = new Report($id);
		$params = $model->getReportParams();
		$settings = ReportSettings::getByUid(Auth::user()->id);
		return view('modules.reports.report2', [
			'report_id' => $id,
			'params' => $params,
			'filters' => $params['filters'],
			'title' => 'Отчеты',
			'user' => Auth::user(),
			'menu' => $this->menu,
			'pagename' => 'report',
			'controlbar_params' => [
				'h_scrollbar' => ($settings)?$settings->h_scrollbar:0
			]
		]);
	}

	public function showChart(Request $request, $name, $params=null)
	{
		$rigths_model = new ReportRights();
		$can_view = false;
		$user = Auth::user();
		switch($name) {
			case 'proceeds':
				$can_view = $rigths_model->canViewProceeds();
				break;
			case 'active':
				$can_view = $rigths_model->canViewActive();
				break;
			case 'proceeds-groups':
				$can_view = $rigths_model->canViewProceedsGroups();
				break;
			case 'proceeds-groups2':
				$can_view = $rigths_model->canViewProceedsGroups();
				break;
			case 'arrears':
				$can_view = $rigths_model->canViewArrears();
				break;
			case 'arrears-lealta':
				$can_view = $rigths_model->canViewArrears();
				break;
			case 'arrears-c2':
				$can_view = $rigths_model->canViewArrears();
				break;
			case 'arrears-lovit':
				$can_view = $rigths_model->canViewArrears();
				break;
			case 'arrears-molnia':
				$can_view = $rigths_model->canViewArrears();
				break;
		}
		if (!$can_view) {
			return response()->view('errors.403',[
				'title' => 'Ошибка 403',
				'user' => $user,
				'menu' => $this->menu
			],
				403
			);
		}
		$model = new Chart($name);
		$settings = ReportSettings::getByUid(Auth::user()->id);
		return view('modules.reports.chart', [
			'title' => $model->getTitle(),
			'name' => $name,
			'user' => $user,
			'menu' => $this->menu,
			'pagename' => 'report',
			'controlbar_params' => [
				'h_scrollbar' => ($settings)?$settings->h_scrollbar:0
			]
		]);
	}

	public function exportReport(Request $request, $id) {
		$filters = $request->input('filters');
		$filters = json_decode($filters, true);
		$model = new Report($id);
		$model->parseFilters($filters);
		$columns = $model->getReportColumns();
		$params = $model->getReportParams();
		try {
			$data = $model->getReportDataExport();
		} catch (\ErrorException $e) {
			Log::error($e);
			return view('errors.report');
		}
		$colors = $data['colors'];
		$format = $data['format'];
		$data = $data['data'];
		$xls = Excel::create('report'.$id, function($excel) use($data, $columns, $params, $colors, $format) {
			$excel->sheet('Sheet1', function($sheet) use($data, $columns, $params, $colors, $format) {
				$sheet->setColumnFormat($format);
				$sheet->fromArray($data, null, 'A1', false, false);
				if ($params['is_complex']) {
					$col_num = 0;
					foreach($columns as $k=>$col) {
						if (isset($col['colspan'])) {
							$sheet->mergeCells(Helper::getCharByNumber($col_num).'1:'.Helper::getCharByNumber($col_num+$col['colspan']-1).'1');
							$col_num += $col['colspan'];
						} else {
							$sheet->mergeCells(Helper::getCharByNumber($col_num).'1:'.Helper::getCharByNumber($col_num).'2');
							$col_num++;
						}
					}
				}
				foreach($colors as $color) {
					$sheet->cell($color['cell'], function($cell) use($color){
						$cell->setFontColor($color['color']);
					});
				}
			});
		})->export('xls');
		return $xls;
	}

	public function chartReport(Request $request, $name) {
		$lines = json_decode($request->input('lines'));
		$type = $request->input('type');
		$model = new Report($name, $request->user()->getBillingConnection());
		$resp = [];
		try {
			switch($type) {
				case Report::$D_TYPE_LINECHART:
					$resp = $model->getLinechartData($lines);
					break;
				case Report::$D_TYPE_PIECHART:
					$column_name = $request->input('column');
					$column_name = 'qty_total';
					$resp = $model->getPiechartData($lines, $column_name);
					break;
				case Report::$D_TYPE_BARCHAR:
					$resp = $model->getBarchartData($lines);
					break;
				case Report::$D_TYPE_AREACHART:
					$resp = $model->getAreachartData($lines);
					break;
			}
		} catch (\ErrorException $e) {
			return view('errors.report');
		}
		return response()->json($resp);
	}

	public function tableReport(Request $request, $id) {
		$filters = $request->input('filters');
		$filters = json_decode($filters, true);
		$model = new Report($id);
		$model->parseFilters($filters);
		try {
			$data = $model->getData();
		} catch (\PDOException $e) {
			Log::debug("Access restricted");
			Log::debug($e->getMessage());
		}
		return response()->json($data);
	}

	public function changeHScrollbar(Request $request, $scrollbar) {
		$scrollbar = intval($scrollbar);
		$settings = ReportSettings::getByUid(Auth::user()->id);
		if ($settings) {
			$settings->h_scrollbar = $scrollbar;
			$settings->save();
		} else {
			$settings = new ReportSettings();
			$settings->uid = Auth::user()->id;
			$settings->h_scrollbar = $scrollbar;
			$settings->save();
		}
	}
	
}