<?php

namespace Modules\Reports\Http\Controllers;

use App\Components\Helper;
use Modules\Reports\Models\ReportGraph;
use Pingpong\Modules\Routing\Controller;
use Illuminate\Http\Request;
use Auth;

class ReportsGraphController extends Controller {
	public function __construct()
	{
		$this->middleware('auth');
	}

	public function getGraphWifiTotal(Request $request) {
		$model = new ReportGraph();
		return response()->json($model->getTotalWifi());
	}

	public function getGraphProceeds(Request $request) {
		$model = new ReportGraph();
		return response()->json($model->getProceeds());
	}

	public function getGraphProceedsGroups(Request $request) {
		$model = new ReportGraph();
		return response()->json($model->getProceedsByGroups());
	}

	public function getGraphProceedsGroups2(Request $request) {
		$model = new ReportGraph();
		return response()->json($model->getProceedsByGroups2());
	}

	public function getGraphActive(Request $request) {
		$model = new ReportGraph();
		return response()->json($model->getActive());
	}

	public function getGraphArrears(Request $request) {
		$model = new ReportGraph();
		return response()->json($model->getArrears());
	}

	public function getGraphArrearsLealta(Request $request) {
		$model = new ReportGraph();
		return response()->json($model->getArrears(1));
	}

	public function getGraphArrearsC2(Request $request) {
		$model = new ReportGraph();
		return response()->json($model->getArrears(2));
	}

	public function getGraphArrearsLovit(Request $request) {
		$model = new ReportGraph();
		return response()->json($model->getArrears(3));
	}

	public function getGraphArrearsMolnia(Request $request) {
		$model = new ReportGraph();
		return response()->json($model->getArrears(4));
	}

}