<?php

namespace Modules\Inventory\Http\Controllers;

use App\Models\Brand;
use Modules\Inventory\Models\Equipment;
use Modules\Inventory\Models\Address;

use Modules\Inventory\Models\EquipmentRights;
use Modules\Inventory\Models\InventoryAdder;
use Modules\Inventory\Models\InventorySettings;
use Modules\Inventory\Models\InventoryRights;
use Modules\Inventory\Models\Revision;
use Pingpong\Modules\Routing\Controller;
use Illuminate\Http\Request;
use App\Components\Menu\Menu;
use Auth;
use Log;
use App\Components\Helper;
use Excel;

class EquipmentController extends Controller
{
	public $menu;
    //
	public function __construct(Menu $menu)
	{
		$this->menu = $menu;
		$this->middleware('auth');
	}

	/**
	 * Display Home screen
	 *
	 * @param  Request  $request
	 * @return Response
	 */
	public function index2(Request $request)	{
		$model = new Address();
		$region_list = $model->getRegions();
		return view('modules.inventory.equipment.index', [
					'regions' => $region_list,
					'user' => Auth::user(),
					'menu' => $this->menu,
		]);
	}

	public function index(Request $request)	{
		$model = new Address();
		$user = Auth::user();
		$inventory_permissions = new EquipmentRights();
		$inventory_rights_model = new InventoryRights();
		if (!$inventory_permissions->canViewEquipments()) {
			return response()->view('errors.403',[
				'title' => 'Ошибка 403',
				'user' => $user,
				'menu' => $this->menu],
				403
			);
		}
		$inventory_settings = InventorySettings::getByUid($user->id);
		Log::debug(var_export($inventory_settings, true));
		$equipment_model = new Equipment();
		$systems = $equipment_model->getSystemsMultiselect();
		$city_list = $model->getCityListMultiselect();
		$regions = $model->getRegionListMultiselect();
		$situations = $equipment_model->getSituationTypes();
		if ($situations['error'] == 0) {
			$situations = Helper::toMultiselect($situations['data'], 'situation', 'desk', true);
		} else {
			$situations=[];
		}
		$states = Helper::toMultiselect($equipment_model->getStateTypes(), 'type', 'desk', true);
		$new_view = $request->input('view', 0);
		if ($new_view && $new_view != $inventory_settings->equipment_view) {
			if ($inventory_settings->uid) {
				$inventory_settings->equipment_view=$new_view;
				$inventory_settings->save();
			} else {
				$inventory_settings = new InventorySettings();
				$inventory_settings->uid = $user->id;
				$inventory_settings->equipment_view = $new_view;
				$inventory_settings->save();
			}
		}
		$filters = json_decode($request->input('filters', ''));
		/*if ($filters=='') {
			$filters = json_decode($inventory_settings->equipment_filter_values);
			if ($filters && isset($filters->address_id)) {
				$filters->address_id = '';
			}
		}*/
		if ($inventory_settings->equipment_view == 2) {
			return view('modules.inventory.equipment.index_3', [
				'page' => 'inventory',
				'cities' => $city_list,
				'systems' => $systems,
				'regions' => $regions,
				'situations' => $situations,
				'title' => 'Оборудование',
				'states' => $states,
				'user' => Auth::user(),
				'menu' => $this->menu,
				'pagename' => 'equipment',
				'can_viewtemplatelog' => $inventory_rights_model->canViewTemplateLog(),
				'can_addroute' => $inventory_permissions->canAddRoute(),
				'can_modifyroute' => $inventory_permissions->canModifyRoute(),
				'can_deleteroute' => $inventory_permissions->canDeleteRoute(),
				'can_changeFW' => $inventory_permissions->canChangeFirmware(),
				'filters' => $filters,
				'columns' => $inventory_settings->getInventoryColumns(),
				'filters_config' => $inventory_settings->getInventoryFilters(),
				'brands' => Brand::getBrands(),
				'controlbar_params' => ['inventory' =>
					[
						'equipment_view' => 2
					]
				]
			]);
		} else {
			return view('modules.inventory.equipment.index_4', [
				'page' => 'inventory',
				'cities' => $city_list,
				'systems' => $systems,
				'regions' => $regions,
				'situations' => $situations,
				'title' => 'Оборудование',
				'states' => $states,
				'user' => Auth::user(),
				'menu' => $this->menu,
				'pagename' => 'equipment',
				'controlbar_params' => ['inventory' =>
					[
						'equipment_view' => 1
					]
				]
			]);
		}
	}

	public function index3(Request $request)	{
		$model = new Address();
		$equipment_model = new Equipment();
		$systems = $equipment_model->getSystemsMultiselect();
		$city_list = $model->getCityListMultiselect();
		$regions = $model->getRegionListMultiselect();
		$situations = $equipment_model->getSituationTypes();
		if ($situations['error'] == 0) {
			$situations = Helper::toMultiselect($situations['data'], 'situation', 'desk', true);
		} else {
			$situations=[];
		}
		$states = Helper::toMultiselect($equipment_model->getStateTypes(), 'type', 'desk', true);
		return view('modules.inventory.equipment.index_4', [
			'page' => 'inventory',
			'cities' => $city_list,
			'systems' => $systems,
			'regions' => $regions,
			'situations' => $situations,
			'title' => 'Оборудование',
			'states' => $states,
			'user' => Auth::user(),
			'menu' => $this->menu,
		]);
	}

	public function getEquipments(Request $request, $range)	{
		$model = new Address();
		$equipment_list  = $model->getEquipments($range);
		if (count($equipment_list) == 0) {
			$equipment_list = [
				"sEcho" => 1,
				"iTotalRecords" => "0",
				"iTotalDisplayRecords" => "0",
				"aaData" => []
			];
		}
		return response()->json($equipment_list);
	}

	public function searchEquipment(Request $request)
	{
		$search_params  = [
			'name' => $request->input('name'),
			'ip' => $request->input('ip'),
			'mac' => $request->input('mac'),
			'switch' => $request->input('switch'),
			'port' => $request->input('port'),
			'street' => $request->input('street'),
		];
		$equipment_list = [];
		$model = new Equipment();
		$eq = false;
		foreach($search_params as $key=>$param) {
			if ($param != '' && $key != 'street') {
				$eq=true;
				break;
			}
		}
		if ($eq) {
			$equipment_list = $model->searchEquipment($search_params);
		} elseif ($search_params['street'] != '') {
			$equipment_list = $model->searchEquipmentByStreet($search_params['street']);
		}
		if (count($equipment_list) == 0) {
			$equipment_list = [
				"sEcho" => 1,
				"iTotalRecords" => "0",
				"iTotalDisplayRecords" => "0",
				"aaData" => []
			];
		}
		return response()->json($equipment_list);
	}

	public function getView(Request $request, $route) {
		$model = new Equipment();
		$equipment = $model->getRouteInfo($route);
		$ports = $model->getSwitchPorts($route);
		if (empty($ports['error'])) {
			$equipment['ports'] = $ports;
		}
		$equipment['user'] = Auth::user();
		$equipment['menu'] = $this->menu;
		return view('modules.inventory.equipment.view', $equipment);
	}

	public function setMac(Request $request) {
		$model = new Equipment();
		$resp = $model->setMac($request->input('route'), $request->input('mac'), $request->input('system'));
		return response()->json($resp);
	}

	public function getEquipment(Request $request, $export=false) {
		$eq_model = new Equipment();
		$address = new Address();
		$cities = $request->input('cities', '');
		$regions = $request->input('regions', '');
		$street = $request->input('street', '');
		if ($street != '') {
			if (strripos($street, ' - ') !== false) {
				$street = explode(' - ', $street);
				$street = $street[count($street) - 1];
			}
			$prefix_array = $address->getStreetTypes();
			$prefixes = [];
			foreach ($prefix_array as $prefix) {
				$prefixes[] = $prefix->prefix;
			}
			$street = str_replace($prefixes,'', $street);
			$street = iconv('utf8', 'cp1251', $street);
		}
		$situations = $request->input('situations', '');
		$states = $request->input('states', '');
		$systems = $request->input('systems', '');
		$source = $request->input('source', '');
		$source_iface = $request->input('source_iface', '');
		$mac = Helper::strToMac($request->input('mac', ''));
		$model = $request->input('model', '');
		$ip_addr = $request->input('ip_addr', '');
		$address_id = $request->input('address_id', 0);
		$name = $request->input('name', '');
		$location = $request->input('location', '');
		$desk = $request->input('desk', '');
		$order = $request->input('order', 'route');
		$page = $request->input('page', 1);
		$on_page = $request->input('on_page', 10);
		$build = $request->input('build', '');
		$system_desk = $request->input('system_desk', '');
		$situation_desk = $request->input('situation_desk', '');
		$state_desk = $request->input('state_desk', '');
		$params_search_string = Helper::strToMac($request->input('params_search_string', ''));
		$address_filter = $request->input('address_filter', '');
		$entrance = $request->input('entrance', '');
		$is_monitoring = $request->input('is_monitoring', 0);
		$filter_params = [
			'cities' => iconv('utf8', 'cp1251', $cities),
			'regions' => iconv('utf8', 'cp1251', $regions),
			'street' => $street,
			'systems' => $systems,
			'situations' => $situations,
			'states' => $states,
			'source' => $source,
			'source_iface' => $source_iface,
			'mac' => $mac,
			'ip_addr' => $ip_addr,
			'model' => Helper::cyr1251($model),
			'address_id' => $address_id,
			'name' => $name,
			'location' => iconv('utf8', 'cp1251', $location),
			'desk' => iconv('utf8', 'cp1251', $desk),
			'order' => $order,
			'offset' => ($page-1)*$on_page,
			'on_page' => $on_page,
			'build' => $build,
			'system_desk' => $system_desk,
			'situation_desk' => iconv('utf8', 'cp1251', $situation_desk),
			'state_desk' => iconv('utf8', 'cp1251', $state_desk),
			'params_search_string' => iconv('utf8', 'cp1251', $params_search_string),
			'address_filter' => iconv('utf8', 'cp1251', $address_filter),
			'entrance' => $entrance,
			'is_monitoring' => $is_monitoring
		];
		if (!$export) {
			$res = $eq_model->getEquipment($filter_params, $page);
			return response()->json($res);
		} else {
			$data = $eq_model->getEquipmentForExport($filter_params);
			$xls = Excel::create('inventory', function($excel) use($data) {
				$excel->sheet('Sheet1', function($sheet) use($data) {
					$sheet->fromArray($data);
				});
			})->export('xls');
			return $xls;
		}
	}

	public function exportEquipment(Request $request) {
		$eq_model = new Equipment();
		$cities = $request->input('cities', '');
		$regions = $request->input('regions', '');
		$street = $request->input('street', '');
		if ($street != '') {
			$street = explode(' - ', $street);
			$street = $street[count($street)-1];
			$street = explode('. ', $street);
			$street = $street[1];
		}
		$situations = $request->input('situations', '');
		$states = $request->input('states', '');
		$systems = $request->input('systems', '');
		$source = $request->input('source', '');
		$mac = $request->input('mac', '');
		$model = $request->input('model', '');
		$ip_addr = $request->input('ip_addr', '');
		$address_id = $request->input('address_id', 0);
		$name = $request->input('name', '');
		$location = $request->input('location', '');
		$filter_params = [
			'cities' => iconv('utf8', 'cp1251', $cities),
			'regions' => iconv('utf8', 'cp1251', $regions),
			'street' => $street,
			'systems' => $systems,
			'situations' => $situations,
			'states' => $states,
			'source' => $source,
			'mac' => $mac,
			'ip_addr' => $ip_addr,
			'model' => $model,
			'address_id' => $address_id,
			'name' => $name,
			'location' => $location
		];
		$data = $eq_model->getEquipmentForExport($filter_params);
		$xls = Excel::create('inventory', function($excel) use($data) {
			$excel->sheet('Sheet1', function($sheet) use($data) {
				$sheet->fromArray($data);
			});
		})->export('xls');
		return $xls;
	}

	public function getLinkTypes(Request $request) {
		$model=new Equipment();
		return response()->json($model->getLinkType());
	}

	public function getSituations(Request $request) {
		$model=new Equipment();
		$rights = new InventoryRights();
		if ($rights->canChangeSituation()) {
			$resp = $model->getSituationTypes();
			$resp['data'] = Helper::toMultiselect($resp['data'], 'situation', 'desk');
		} else {
			$resp = [
				'error' => 1,
				'msg'   => 'Недостаточно прав'
			];
		}
		return response()->json($resp);
	}

	public function getTemplateGroups(Request $request, $system) {
		$model=new Equipment();
		$template = $model->getTemplateGroups($system);
		return response()->json($template);
	}

	public function getTemplates(Request $request, $route) {
		$inventory_rights_model = new InventoryRights();
		if (!$inventory_rights_model->canViewTemplateLog()) {
			Log::error('getTemplates access restricted');
			return response()->json(['error' => 1]);
		}
		$equipment_model = new Equipment();
		$templates = $equipment_model->getTemplateLog($route);
		return response()->json([
			'data' => $templates,
			'error' => 0
		]);
	}

	public function getEquipmentCoord(Request $request) {
		$model = new Equipment();
		return response()->json($model->getCoords());
	}

	public function getChangedParams(Request $request) {
		$model = new Equipment();
		$resp = [
			'error' => 0,
			'data' => $model->getParams()
		];
		return response()->json($resp);
	}

	public function uploadParamsFile(Request $request) {
		$routes = $request->input('routes', NULL);
		if ($routes) {
			$routes = explode(',', $request->input('routes', ''));
		}
		$params = explode(',', $request->input('params', ''));
		Log::debug('uploadParamsFile');
		Log::debug($_FILES);
		Log::debug($routes);
		Log::debug($params);
		if ($request->file()) {
			$params_file = $request->file('paramsFile');
			$model = new Equipment();
			$resp = $model->loadParamsFromFile($routes, $params, $params_file);
		}
		return response()->json($resp);
	}

	public function addEquipment(Request $request) {
		$rights_model = new EquipmentRights();
		if (!$rights_model->canAddRoute()) {
			return response('', 403);
		}
		$model = new Equipment();
		$params = [
			'route' => $request->input('route', ''),
			'desk_note' => $request->input('desk_note', ''),
			'addr_note' => $request->input('addr_note', ''),
			'model_id' => $request->input('model_id', 0),
			'address_id' => intval($request->input('address_id', 0)),
			'entrance' => $request->input('entrance', ''),
			'floor' => $request->input('floor', ''),
			'ip_addr' => $request->input('ip', ''),
			'mac' => $request->input('mac', ''),
			'apartment' => $request->input('apartment', ''),
			'location_id' => $request->input('location_id', 0),
			'source' => $request->input('source', ''),
			'route_iface' => $request->input('route_iface', ''),
			'source_iface' => $request->input('source_iface', ''),
			'link_type' => $request->input('link_type', 0),
			'situation_id' => $request->input('situation_id', 0),
			'vlan_id' => $request->input('vlan_id', 0),
            'system_id' => $request->input('system_id', 0),
			'ignore_error' => $request->input('ignore_error', 0)
		];
		$commit = $request->input('commit', 0);
        $resp = $model->addEquipment($params, $commit);
        $resp['commit'] = $commit;
        return response()->json($resp);
	}

	public function addEquipmentFile(Request $request) {
		$resp=[];
		$address_id = $request->input('address_id', null);
		if ($request->file()) {
			$equipment_file = $request->file('equipmentFile');
			$model = new InventoryAdder();
			$user = Auth::user();
			$resp = $model->loadFile($equipment_file, $user->id, false, $address_id);
		}
		return response()->json($resp);
	}

	public function addingRevision(Request $request, $adding_id) {
		$data = InventoryAdder::getAddingRevision($adding_id);
		return Excel::create('inventory', function($excel) use($data) {
			$excel->sheet('Sheet1', function($sheet) use($data) {
				$sheet->fromArray($data);
			});
		})->export('xls');
	}

	public function equipmentSaveFromFile(Request $request, $adding_id) {
		Log::debug('Save params:');
		Log::debug($request->input());
		$commit = $request->input('commit',0);
		$need_location = filter_var($request->input('need_location',false), FILTER_VALIDATE_BOOLEAN);
		$need_linktype = filter_var($request->input('need_linktype', false), FILTER_VALIDATE_BOOLEAN);
		$params=[];
		$user = Auth::user();
		if (!$commit) {
			if ($need_location) {
				$params['location_id'] = $request->input('location_id', 0);
				$params['vlan_id'] = $request->input('vlan_id', 0);
			}
			if ($need_linktype) {
				$params['link_type'] = $request->input('link_type', 0);
			}
			Log::debug($params);
			if (count($params) > 0) {
				InventoryAdder::fillEmptyParams($adding_id, $user->id, $params);
			}
			$resp = InventoryAdder::checkAddedEquipment($adding_id, $user->id, $commit);
		} else {
			$ignore_error = $request->input('ignore_error', []);
			$resp = InventoryAdder::saveAddedEquipment($adding_id, $user->id, $commit, $ignore_error);
		}
		return $resp;
	}

	public function setSystem(Request $request) {
		Log::debug($request->input());
		$route = $request->input('route', '');
		$system = $request->input('system', 0);
		$commit = $request->input('commit', 0);
		$resp = [
			'error' => 0,
			'msg' => 'OK'
		];
		if ($route && $system != 9999) {
			$model = new Equipment();
			$params = [
				'route' => $route,
				'system' => $system
			];
			$resp = $model->equipmentChangeSystem($params, $commit);
		} else {
			$resp = [
				'error' => -1,
				'msg' => 'Missing params error'
			];
		}
		Log::debug($resp);
		return response()->json($resp);
	}

	public function equipmentDelete(Request $request, $route) {
		$rights_model = new EquipmentRights();
		if (!$rights_model->canDeleteRoute()) {
			$request->response(403);
		}
		$model = new Equipment();
		$resp = $model->deleteEquipment($route);
		Log::debug($resp);
		return response()->json($resp);
	}

	public function Monitoring(Request $request) {
		$model = new Address();
		$user = Auth::user();
		$inventory_permissions = new EquipmentRights();
		$inventory_rights_model = new InventoryRights();
		if (!$inventory_rights_model->canViewMonitoring()) {
			return response()->view('errors.403',[
				'title' => 'Ошибка 403',
				'user' => $user,
				'menu' => $this->menu],
				403
			);
		}
		$monitoring_settings = InventorySettings::getByUid($user->id);
		$equipment_model = new Equipment();
		$systems = $equipment_model->getSystemsMultiselect();
		$city_list = $model->getCityListMultiselect();
		$regions = $model->getRegionListMultiselect();
		$situations = $equipment_model->getMonitoringSituationTypes();
		$situations = $situations['data'];
		$states = $equipment_model->getMonitoringStateTypes();
		$filters = json_decode($monitoring_settings->monitoring_filter_values);
		if ($filters && isset($filters->address_id)) {
			$filters->address_id = '';
		}
		return view('modules.inventory.monitoring', [
			'page' => 'inventory',
			'cities' => $city_list,
			'systems' => $systems,
			'regions' => $regions,
			'situations' => $situations,
			'title' => 'Мониторинг',
			'states' => $states,
			'user' => Auth::user(),
			'menu' => $this->menu,
			'pagename' => 'monitoring',
			'can_viewtemplatelog' => $inventory_rights_model->canViewTemplateLog(),
			'can_addroute' => $inventory_permissions->canAddRoute(),
			'can_deleteroute' => $inventory_permissions->canDeleteRoute(),
			'can_modifyroute' => $inventory_permissions->canModifyRoute(),
			'can_changeFW' => $inventory_permissions->canChangeFirmware(),
			'update_duration' => $monitoring_settings->monitoring_update_duration,
			'columns' => $monitoring_settings->getMonitoringColumns(),
			'filters_config' => $monitoring_settings->getMonitoringFilters(),
			'filters' => json_decode($monitoring_settings->monitoring_filter_values),
			'controlbar_params' => ['monitoring' =>
				[
					'update_duration' => $monitoring_settings->monitoring_update_duration
				]
			]
		]);
	}

	public function batchDeleteAP(Request $request, $address_id) {
		$right_model = new EquipmentRights();
		if (!$right_model->canBatchDeleteAP()) {
			response('Access restricted', 403);
		}
		$model = new Equipment();
		$resp = $model->batchDeleteAP($address_id);
		return response()->json($resp);
	}


	public function getAddressDeletedRoutes(Request $request, $address_id) {
		$right_model = new EquipmentRights();
		if (!$right_model->canBatchDeleteAP()) {
			response('Access restricted', 403);
		}
		$model = new Equipment();
		$resp = $model->getDeletedAP($address_id);
		return response()->json($resp);
	}

}
