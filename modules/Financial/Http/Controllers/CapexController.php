<?php

namespace Modules\Financial\Http\Controllers;
use Modules\Financial\Models\FinancialRights;

use Modules\Financial\Models\Capex;

use Pingpong\Modules\Routing\Controller;
use Illuminate\Http\Request;
use App\Components\Menu\Menu;
use Auth;
use Log;

class CapexController extends Controller
{
	public $menu;

	public function __construct(Menu $menu)
	{
		$this->menu=$menu;
		$this->middleware('auth');
	}

	public function Capex(Request $request)
	{
		$rights_model = new FinancialRights();
		if (!$rights_model->canViewCapex()) {
			return view('errors.403', [
				'user' => Auth::user(),
				'menu' => $this->menu
			]);
		}
		return view('modules.inventory.capex', [
			'title' => 'CAPEX',
			'user' => Auth::user(),
			'menu' => $this->menu,
		]);
	}

	public function getCapexList(Request $request, $searchString='') {
		Log::debug('get-capex-list');
		$rights_model = new FinancialRights();
		if (!$rights_model->canViewCapex()) {
			return reponse('403 Forbidden', 403);
		}
		$model = new Capex();
		$result = $model->getCapexList($searchString);
		return response()->json($result);
	}

	public function addCapex(Request $request) {
		$rights_model = new FinancialRights();
		if (!$rights_model->canAddCapex()) {
			return reponse('403 Forbidden', 403);
		}
		Log::debug($request->input());
		$params['code'] = $request->input('code');
		$params['agreement'] = $request->input('agreement');
		$params['amount'] = $request->input('amount');
		$params['type'] = $request->input('type');
		$model = new Capex();
		return response()->json($model->addCapex($params));
	}

	public function modifyCapex(Request $request, $capex_id) {
		$rights_model = new FinancialRights();
		if (!$rights_model->canModifyCapex()) {
			return reponse('403 Forbidden', 403);
		}
		$params['id'] = intval($capex_id);
		$params['code'] = $request->input('code');
		$params['agreement'] = $request->input('agreement');
		$params['amount'] = $request->input('amount');
		$params['type'] = $request->input('type');
		$model = new Capex();
		return response()->json($model->modifyCapex($params));
	}

	public function getSystems(Request $request) {
		$model = new Capex();
		return response()->json($model->getSystems());
	}

	public function getWorks(Request $request) {
		$model = new Capex();
		return response()->json($model->getWorks());
	}

	public function deleteCapex() {

	}

	public function getContractorByAC(Request $request, $ac_id)
	{
		$model = new Capex();
		return response()->json($model->getContractorByAC($ac_id));
	}

	public function getAddressInfoByConstructionType(Request $request, $address_id, $construction_type) {
		$model = new Capex();
		return response()->json($model->getAddressInfoByConstrunctionType($address_id, $construction_type));
	}
}
