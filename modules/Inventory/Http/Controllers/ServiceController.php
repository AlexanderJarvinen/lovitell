<?php

namespace Modules\Inventory\Http\Controllers;

use Modules\Inventory\Models\Services;
use Modules\Inventory\Models\InventoryRights;

use Pingpong\Modules\Routing\Controller;
use Illuminate\Http\Request;
use App\Components\Menu\Menu;
use Auth;
use Log;

class ServiceController extends Controller
{
	public $menu;
	//
	public function __construct(Menu $menu)
	{
		$this->menu=$menu;
		$this->middleware('auth');
	}

	public function Services(Request $request) {
		$rights_model = new InventoryRights();
		if (!$rights_model->canViewServices()) {
			return view('errors.403', [
				'user' => Auth::user(),
				'menu' => $this->menu
			]);
		}
		return view('modules.inventory.services', [
			'title' => 'ISG Сервисы',
			'can_modifyservice' => intval($rights_model->canModifyService()),
			'can_addservice' => intval($rights_model->canAddService()),
			'can_modifyserviceoption' => intval($rights_model->canModifyServiceOptions()),
			'user' => Auth::user(),
			'menu' => $this->menu,
		]);
	}

	public function getServicesList(Request $request) {
		$model = new Services();
		return response()->json([
			'error' => 0,
			'data' => $model->getServicesList()
		]);
	}

	public function getServiceInfo(Request $request, $service_id) {
		$model = new Services();
		$service = $model->getServiceInfo($service_id);
		if (true || $service) {
			return response()->json([
				'error' => 0,
				'service' => $service
			]);
		} else {
			return response()->json([
					'error' => 'Not found.
				'], 404);
		}
	}

	public function addService(Request $request) {
		$rights_model = new InventoryRights();
		if (!$rights_model->canAddService()) {
			return view('errors.403', [
				'user' => Auth::user(),
				'menu' => $this->menu
			]);
		}
		$model = new Services();
		$name = $request->input('name');
		$descr = $request->input('desc');
		return response()->json($model->addService($name, $descr));
	}

	public function modifyService(Request $request, $id) {
		$rights_model = new InventoryRights();
		if (!$rights_model->canModifyService()) {
			return view('errors.403', [
				'user' => Auth::user(),
				'menu' => $this->menu
			]);
		}
		$model = new Services();
		Log::debug($request->input());
		$name = $request->input('name');
		$descr = $request->input('desc');
		return response()->json($model->modifyService($id, $name, $descr));
	}

	public function addServiceOption(Request $request, $id) {
		$rights_model = new InventoryRights();
		if (!$rights_model->canModifyServiceOptions()) {
			return response()->json(['error' => 'Not authorized.'], 403);
		}
		$params = [
			'id' => $id,
			'option' => $request->input('option', ''),
			'operator' => $request->input('operator', ''),
			'value' => $request->input('value', '')
		];
		$model = new Services();
		return response()->json($model->addServiceOption($params));
	}

	public function modifyServiceOption(Request $request, $id, $option_id) {
		$rights_model = new InventoryRights();
		if (!$rights_model->canModifyServiceOptions()) {
			return response()->json(['error' => 'Not authorized.'], 403);
		}
		$params = [
			'id' => $id,
			'option' => $request->input('option', ''),
			'operator' => $request->input('operator', ''),
			'value' => $request->input('value', ''),
			'option_id' => $option_id
		];
		$model = new Services();
		return response()->json($model->modifyServiceOption($params));
	}

	public function deleteServiceOption(Request $request, $id, $option_id) {
		$rights_model = new InventoryRights();
		if (!$rights_model->canModifyServiceOptions()) {
			return response()->json(['error' => 'Not authorized.'], 403);
		}
		$model = new Services();
		return response()->json($model->deleteServiceOption($id, $option_id));
	}

}
