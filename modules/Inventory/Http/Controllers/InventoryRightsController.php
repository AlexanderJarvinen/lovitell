<?php

namespace Modules\Inventory\Http\Controllers;

use Modules\Inventory\Models\Equipment;
use Modules\Inventory\Models\InventoryRights;
use Modules\Inventory\Models\EquipmentRights;
use Modules\Inventory\Models\AddressRights;

use Pingpong\Modules\Routing\Controller;
use Illuminate\Http\Request;
use App\Components\Menu\Menu;
use Auth;
use Log;

class InventoryRightsController extends Controller
{
	//
	public function __construct(Menu $menu)
	{
		$this->middleware('auth');
	}

	public function canChangeAddress(Request $request)
	{
		$model = new InventoryRights();
		return response()->json($model->canChangeAddress());
	}

	public function canChangeMac(Request $request)
	{
		$model = new InventoryRights();
		return response()->json($model->canChangeMac());
	}

	public function canChangeSystem(Request $request)
	{
		$model = new InventoryRights();
		return response()->json($model->canChangeSystem());
	}

	public function canChangeIp(Request $request)
	{
		$model = new EquipmentRights();
		return response()->json($model->canChangeIp());
	}

	public function canChangeSource(Request $request)
	{
		$model = new InventoryRights();
		return response()->json($model->canChangeSource());
	}

	public function canChangeDesk(Request $request) {
		$model = new InventoryRights();
		return response()->json($model->canChangeDesk());
	}

	public function canChangeSituation(Request $request) {
		$model = new InventoryRights();
		return response()->json($model->canChangeSituation());
	}

	public function canChangeRoute(Request $request) {
		$model = new EquipmentRights();
		return response()->json($model->canChangeRoute());
	}

	public function canViewIpList(Request $request) {
		$model = new InventoryRights();
		return response()->json($model->canViewIpList());
	}

	public function canChangeModel(Request $request) {
		$model = new InventoryRights();
		return response()->json(true);//$model->canChangeModel());
	}

	public function canChangeVlan(Request $request) {
		$model = new InventoryRights();
		return response()->json(true);//$model->canChangeModel());
	}

	public function canAddLocation(Request $request) {
		$model = new InventoryRights();
		return response()->json($model->canAddLocation());
	}

	public function canDeleteLocation(Request $request) {
		$model = new InventoryRights();
		return response()->json($model->canDeleteLocation());
	}

	public function canModifyLocation(Request $request) {
		$model = new InventoryRights();
		return response()->json($model->canModifyLocation());
	}

	public function canAddVlan(Request $request) {
		$model = new InventoryRights();
		return response()->json($model->canAddLocation());
	}

	public function canModifyVlan(Request $request) {
		$model = new InventoryRights();
		return response()->json($model->canModifyLocation());
	}

	public function canAddСadastral(Request $request) {
		$model = new AddressRights();
		return response()->json($model->canAddСadastral());
	}

	public function canModifyСadastral(Request $request) {
		$model = new AddressRights();
		return response()->json($model->canModifyСadastral());
	}

	public function canAddInterface(Request $request) {
		$model = new InventoryRights();
		return response()->json($model->canAddInterface());
	}

	public function canModifyInterface(Request $request) {
		$model = new InventoryRights();
		return response()->json($model->canModifyInterface());
	}

	public function canDeleteInterface(Request $request) {
		$model = new InventoryRights();
		return response()->json($model->canDeleteInterface());
	}

	public function canAddBuildingRecord(Request $request) {
		$model = new AddressRights();
		return response()->json($model->canBuildingTabAdd());
	}

	public function canResetAp(Request $request) {
		$model = new EquipmentRights();
		return response()->json($model->canResetRouteTemplate());
	}

	public function canChangeAp(Request $request) {
		$model = new InventoryRights();
		return response()->json($model->canSetTemplates());
	}
}
