<?php

namespace Modules\Inventory\Http\Controllers;

use App\Components\Helper;
use Auth;
use Log;
use Excel;
use App\Models\Files;
use \App\Components\Menu\Menu;
use Illuminate\Http\Request;
use Modules\Inventory\Models\Inventory;
use Modules\Inventory\Models\InventoryGraph;
use Pingpong\Modules\Routing\Controller;
use Modules\Inventory\Components\ImageChart\ImageChart;

class NetworkGraphController extends Controller {
	public $menu;

	public function __construct(Menu $menu)
	{
		$this->menu=$menu;
		$this->middleware('auth');
	}

	public function index(Request $request, $graph='total', $id=0, $brand_id=0)
	{
		$type = $request->input('type');
		$group = $request->input('group');
		if ($graph == 'total') {
			$start = $request->input('start');
			$end = $request->input('end');
			if ($group != 2) {
				$group = 0;
			} else {
				$group = 2;
				$type = 255;
			}
			$chart = new ImageChart();
			$chart->makeTotalChart($id, $type, $group, $start, $end, $brand_id);
		}
		else if ($graph == 'amount') {
			$chart = new ImageChart();
			$chart->makeAmountChart($type, $group, $brand_id);
		}
	}

	public function getBarData(Request $request, $graph='total', $id=0, $brand_id=0) {
		$type = $request->input('type');
		$group = $request->input('group');
		if ($graph == 'total') {
			$start = date('m.d.Y', strtotime($request->input('start')));
			$end = date('m.d.y', strtotime($request->input('end')));
			if ($group != 2) {
				$group = 0;
			} else {
				$group = 2;
				$type = 255;
			}
			$model = new InventoryGraph();
			$data = $model->getTotalChartjs($id, $type, $group, $start, $end, $brand_id);
			return response()->json($data);
		}
        else if ($graph == 'amount') {
            $model = new InventoryGraph();
            $data = $model->getAmountChartjs($type, $group, $brand_id);
            return response()->json($data);
		}
	}

}
