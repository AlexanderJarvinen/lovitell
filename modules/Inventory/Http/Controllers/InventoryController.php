<?php

namespace Modules\Inventory\Http\Controllers;

use App\Components\Helper;
use App\Models\Brand;
use Auth;
use Log;
use Excel;
use App\Models\Files;
use \App\Components\Menu\Menu;
use Illuminate\Http\Request;
use Modules\Inventory\Models\Address;
use Modules\Inventory\Models\AddressRights;
use Modules\Inventory\Models\Equipment;
use Modules\Inventory\Models\EquipmentRights;
use Modules\Inventory\Models\Inventory;
use Modules\Inventory\Models\InventoryRights;
use Modules\Inventory\Models\InventorySettings;
use Pingpong\Modules\Routing\Controller;
use Modules\Inventory\Models\Revision;
use Modules\Inventory\Components\APSetup\APSetup;

use Modules\Inventory\Jobs\ChangeTemplateJob;
use Modules\Inventory\Jobs\ChangeFirmwareJob;

class InventoryController extends Controller {
	public $menu;

	public function __construct(Menu $menu)
	{
		$this->menu=$menu;
		$this->middleware('auth');
	}

	public function getRouteInfo(Request $request, $route_name)
	{
		$model = new Equipment();
		$result = $model->getRouteInfo($route_name);
		return view('modules.inventory.ajax.route_info', $result);
	}

	public function updateEquipmentParams(Request $request, $batch=null) {
		$resp = [];
		$model = new Equipment();
		if ($batch == null || $batch=='batch') {
			$params = [
				'address_id' => intval($request->input('address_id', 0)),
				'location_id' => intval($request->input('location_id', 0)),
                'location_change' => $request->input('location_change', 0),
				'entrance' => $request->input('entrance', NULL),
				'floor' => $request->input('floor', NULL),
				'apartment' => $request->input('apartment', NULL),
				'address_change' => $request->input('address_change', 0),
				'mac' => $request->input('mac', ''),
				'mac_change' => $request->input('mac_change', 0),
				'source' => $request->input('source', ''),
				'source_iface' => $request->input('source_iface', ''),
				'route_iface' => $request->input('route_iface', ''),
				'link_type' => $request->input('link_type', 0),
				'source_change' => $request->input('source_change', 0),
				'desk' => $request->input('desk', ''),
				'desk_change' => $request->input('desk_change', 0),
				'situation' => $request->input('situation', 0),
				'situation_change' => $request->input('situation_change', 0),
				'ip' => $request->input('ip', ''),
				'ip_change' => $request->input('ip_change', 0),
				'model' => $request->input('model_id', 0),
				'system' => $request->input('system_id', 0),
				'system_change' => $request->input('system_change', 0),
				'model_change' => $request->input('model_change', 0),
				'new_route' => $request->input('new_route', 0),
				'route_change' => $request->input('route_change', 0),
				'brands' => $request->input('brands', ''),
				'brand_change' => $request->input('brand_change', 0),
			];
			$commit = $request->input('commit');
			if ($batch) {
				$routes = $request->input('routes', []);
				$resp = $model->updateEquipmentBatch($routes, $params, $commit);
			} else {
				$params['route'] = $request->input('route');
				$resp = $model->updateEquipment($params, $commit);
			}
		} elseif($batch=='file') {
			$data = $request->input('params');
			$params = [];
			foreach($data as $route=>$param) {
				$route_params['route'] = $route;
				if (isset($param['address_id']) ||
					isset($param['entrance']) ||
					isset($param['floor'])
				) {
					$route_params['address_change'] = 1;
				} else {
					$route_params['address_change'] = 0;
				}
				$route_params['address_id'] = isset($param['address_id'])?$param['address_id']:'';
				$route_params['entrance'] = isset($param['entrance'])?$param['entrance']:NULL;
				$route_params['floor'] = isset($param['floor'])?$param['floor']:NULL;
				if (isset($param['mac'])) {
					$route_params['mac_change'] = 1;
					$route_params['mac'] = $param['mac'];
				} else {
					$route_params['mac_change'] = 0;
				}
				if (isset($param['ip_address'])) {
					$route_params['ip_change'] = 1;
					$route_params['ip'] = $param['ip_address'];
				} else {
					$route_params['ip_change'] = 0;
				}
				if (isset($param['location'])) {
					$route_params['location_change'] = 1;
					$route_params['location'] = $param['location'];
				} else {
					$route_params['location_change'] = 0;
				}
				$params[] = $route_params;
			}
			$resp = $model->updateEquipmentByFile($params);
		}
		return response()->json($resp);
	}

	public function checkNetwork($address_id, $export=false) {
		$model = new Inventory();
		$equipments = $model->getBuildingEquipment($address_id);
		$source_list = [];
		$apsetup_params = [];
		$names_list = [];
		foreach($equipments as  $eq_row) {
			if ($eq_row->system != -3 && $eq_row->system != 11 && $eq_row->system != -4 ) continue;
			if ($eq_row->situation<0) continue;
			if ($eq_row->source != null) {
				if (!isset($source_list[$eq_row->source])) {
					$source_list[$eq_row->source]['ip_addr'] = $eq_row->source_ip_addr;
					$apsetup_params[] = $eq_row->source_ip_addr;
					$names_list[$eq_row->source_ip_addr]=$eq_row->source;
				}
				$source_list[$eq_row->source]['routes'][] = [
					'route' => $eq_row->route,
					'mac' => $eq_row->mac,
					'src_port' => $eq_row->port,
					'ip_addr' => $eq_row->ip_addr,
					'system' => $eq_row->system,
					'system_desk' => $eq_row->system_desk,
					'state' => $eq_row->state,
					'situation' => $eq_row->situation
				];
			} else{
				$source_list['source_undef']['ip_addr'] = '';
				$source_list['source_undef']['routes'][] = [
					'route' => $eq_row->route,
					'mac' => $eq_row->mac,
					'src_port' => $eq_row->port,
					'ip_addr' => $eq_row->ip_addr,
					'system' => $eq_row->system,
					'system_desk' => $eq_row->system_desk,
					'state' => $eq_row->state,
					'situation' => $eq_row->situation
				];
			}
		}
		$resp=[];
		if (count($apsetup_params) > 0) {
			$ap_setup = new APSetup($names_list, $apsetup_params);
			foreach ($source_list as $key => $source) {
				if ($key != 'source_undef') {
					foreach ($source['routes'] as $route) {
						if ($route['system'] != -3 && $route['system'] != 11 && $route['system'] != -4 ) continue;
						if ($route['situation'] < 0) continue;
						if (trim($route['mac']) != '') {
							if ($route['src_port'] != '') {
								$ap_snmp_info = $ap_setup->checkMac($route['mac'], $route['ip_addr'], $source['ip_addr'], $route['src_port']);
								$resp[] = [
									'name' => $route['route'],
									'mac' => $route['mac'],
									'system' => $route['system'],
									'state' => $route['state'],
									'situation' => $route['situation'],
									'source' => $key,
									'port' => $route['src_port'],
									'error' => $ap_snmp_info['error'],
									'msg' => $ap_snmp_info['msg'],
									'ping' => $ap_snmp_info['ping'],
									'port_status' => $ap_snmp_info['port_status'],
									'ports' => isset($ap_snmp_info['ports'])?$ap_snmp_info['ports']:''
								];
							} else {
								$resp[] = [
									'name' => $route['route'],
									'mac' => $route['mac'],
									'system' => $route['system'],
									'state' => $route['state'],
									'situation' => $route['situation'],
									'source' => $key,
									'port' => $route['src_port'],
									'error' => 5,
									'msg' => 'SRC_PORT не заполнен'
								];
							}
						} else {
							$resp[] = [
								'name' => $route['route'],
								'mac' => $route['mac'],
								'system' => $route['system'],
								'state' => $route['state'],
								'situation' => $route['situation'],
								'source' => $key,
								'port' => $route['src_port'],
								'error' => 1,
								'msg' => 'MAC не заполнен'
							];
						}
					}
				} else {
					foreach ($source['routes'] as $route) {
						if ($route['system'] != -3 && $route['system'] != 11 && $route['system'] != -4) continue;
						$resp[] = [
							'name' => $route['route'],
							'mac' => $route['mac'],
							'system' => $route['system'],
							'state' => $route['state'],
							'situation' => $route['situation'],
							'source' => $key,
							'port' => $route['src_port'],
							'error' => 4,
							'msg' => 'Source не заполнен'
						];
					}
				}
			}
		}
		if (!$export) {
			return response()->json($resp);
		} else {
			$xls = Excel::create('revision', function($excel) use($resp) {
				$excel->sheet('Sheet1', function($sheet) use($resp) {
					$sheet->fromArray($resp);
				});
			})->export('xls');
			return $xls;
		}
	}

	public function changeTemplate(Request $request, $address_id) {
		$model = new Inventory();
		$eq_model = new Equipment();
		$inventory_rights = new InventoryRights();
		$system_id = $request->input('system');
		$system = $eq_model->getEquipmentSystem($system_id);
		$group_id = $request->input('template');
		$to_all = $request->input('to_all', false) == 'true';
		$template = $eq_model->getTemplateGroups($system_id, '', $group_id);
		$routes = $request->input('routes', []);
		$to_all_desk = $to_all?'для всех':'';
		$desk = "Применение шаблона ".$template->desk." для ".$system->desk." ".$to_all_desk;
		if ($inventory_rights) {
			$job = new ChangeTemplateJob($address_id, $system_id, $group_id, Auth::user(), $desk, $to_all, $routes);
			dispatch($job);
		}
		return response()->json(['error'=>0]);
	}

	public function loadForRevision(Request $request) {
		$resp = [];
		if ($request->file()) {
			$file = $request->file('revision');
			$revision_model = new Revision();
			$resp = $revision_model->loadFile($file);
		}
		return Excel::create('revision', function($excel) use($resp) {
			$excel->sheet('Result', function($sheet) use($resp) {
				$sheet->fromArray($resp);
			});
		})->export('xlsx');
	}


	public function batchAcceptNCC(Request $request, $address_id, $system) {
		$model = new Equipment();
		$error = $model->batchAcceptNCCEquipment($address_id, $system);
		return response()->json(['error' => $error]);
	}

	public function batchAcceptOD(Request $request, $address_id, $system) {
		$model = new Equipment();
		$error = $model->batchAcceptODEquipment($address_id, $system);
		return response()->json(['error' => $error]);
	}

	public function batchChangeState(Request $request, $address_id, $system, $state) {
		$routes = $request->input('routes');
		$model = new Equipment();
		$error = 0;
		if (count($routes)) {
			$error = $model->batchChangeState($routes, $address_id, $system, $state);
		}
		return response()->json(['error' => $error]);
	}

	public function batchMacChange(Request $request, $address_id) {
		$resp = [];
		if ($request->file()) {
			$file = $request->file('macchange');
			$inventory_model = new Inventory();
			$resp = $inventory_model->batchMacChange($file, $address_id);
		}

		return Excel::create('revision', function($excel) use($resp) {
			$excel->sheet('Result', function($sheet) use($resp) {
				$sheet->fromArray($resp);
			});
		})->export('xlsx');
	}

	public function map(Request $request) {
		$model = new InventoryRights();
		if (!$model->canViewMap()) {
			return view('errors.403', [
				'user' => Auth::user(),
				'menu' => $this->menu
			]);
		}
		return view('modules.inventory.map',[
			'title' => 'Карта оборудования',
			'user' => Auth::user(),
			'menu' => $this->menu
		]);
	}

	public function getLocations(Request $request) {
		$model_rights = new InventoryRights();
		if (!$model_rights->canGetLocations()) {
			return response(403);
		}
		$model = new Inventory();
		return response()->json(['error' => 0, 'data' => $model->getLocations()]);
	}

	public function getLocationsParams(Request $request) {
		$model = new Inventory();
		return response()->json(['error'=>0, 'data' => $model->getLocationParams()]);
	}

	public function getVLans(Request $request, $location, $system) {
		$model_rights = new InventoryRights();
		if (!$model_rights->canGetVlans()) {
			return response(403);
		}
		$model = new Inventory();
		return response()->json([
            'error' => 0,
            'data' => $model->getVLans($location, $system)
        ]);
	}

	public function getVLansSG(Request $request, $location, $system_group) {
		$model_rights = new InventoryRights();
		if (!$model_rights->canGetVlans()) {
			return response(403);
		}
		$model = new Inventory();
		return response()->json([
			'error' => 0,
			'data' => $model->getVLans($location, 99999, $system_group)
		]);
	}

	public function getSystems(Request $request) {
        $model = new Equipment();
        return response()->json([
            'error' => 0,
            'data' => $model->getEquipmentSystem()
        ]);
    }

    public function getModels(Request $request, $group) {
        $model_rights = new InventoryRights();
        if (!$model_rights->canGetModels()) {
            return response(403);
        }
        $model = new Inventory();
        return response()->json([
            'error' => 0,
            'data' => $model->getModels($group)
        ]);
    }

	public function getIpList(Request $request, $location, $vlan) {
		$inventory_model = new Inventory();
		return response()->json([
			'error' => 0,
			'data' => $inventory_model->getIpList($location, $vlan)
		]);
	}

	public function Locations(Request $request) {
		$rights_model = new InventoryRights();
		if (!$rights_model->canViewLocations()) {
			return view('errors.403', [
				'user' => Auth::user(),
				'menu' => $this->menu
			]);
		}
		return view('modules.inventory.locations', [
			'title' => 'Локации',
			'user' => Auth::user(),
			'menu' => $this->menu,
		]);
	}

	public function getLocationsList(Request $request, $search_string='') {
		$inventory_model = new Inventory();
		return response()->json([
			'error' => 0,
			'data' => $inventory_model->getLocationsList($search_string)
		]);
	}

	public function Nagios(Request $request) {
		$rights_model = new InventoryRights();
		if (!$rights_model->canViewNagiosData()) {
			return view('errors.403', [
				'user' => Auth::user(),
				'menu' => $this->menu
			]);
		}
		$model = new Inventory();
		return view('modules.inventory.nagios', [
			'title' => 'Статус устройств',
			'types' => $model->getNagiosReportTypes(),
			'user' => Auth::user(),
			'menu' => $this->menu,
		]);
	}

	public function getNagiosCrashes(Request $request) {
		$rights_model = new InventoryRights();
		if (!$rights_model->canViewNagiosData()) {
			return response(403);
		}
		$model = new Inventory();
		return response()->json([
			'error' => 0,
			'data' => $model->getNagiosCrashes()
		]);

	}

	public function getNagiosFlaps(Request $request, $system) {
		$rights_model = new InventoryRights();
		if (!$rights_model->canViewNagiosData()) {
			return response(403);
		}
		$model = new Inventory();
		return response()->json([
			'error' => 0,
			'data' => $model->getNagiosFlaps($system)
		]);

	}

	public function setSetting(Request $request, $param, $val) {
		$user = Auth::user();
		$setting = InventorySettings::getByUid($user->id);
		$param = str_replace('-', '_', $param);
		$setting->{$param} = $val;
		$setting->save();
	}

	public function setMonitoringTableColumns(Request $request) {
		$columns = $request->input('columns', NULL);
		$user = Auth::user();
		$setting = InventorySettings::getByUid($user->id);
		if ($columns) {
			foreach($columns as $k=>$col) {
				$columns[$k]['selected'] = $columns[$k]['selected'] != 0;
			}
			$setting->monitoring_table_columns = json_encode($columns);
			$setting->save();
		}
	}

	public function setInventoryTableColumns(Request $request) {
		$columns = $request->input('columns', NULL);
		$user = Auth::user();
		$setting = InventorySettings::getByUid($user->id);
		if ($columns) {
			foreach($columns as $k=>$col) {
				$columns[$k]['selected'] = $columns[$k]['selected'] != '0';
			}
			$setting->equipment_table_columns = json_encode($columns);
			$setting->save();
		}
	}

	public function setMonitoringFilters(Request $request) {
		$filters = $request->input('filters', NULL);
		$user = Auth::user();
		$setting = InventorySettings::getByUid($user->id);
		if ($filters) {
			foreach($filters as $k=>$col) {
				$filters[$k]['favorites'] = $filters[$k]['favorites'] != '0';
			}
			$setting->monitoring_filters = json_encode($filters);
			$setting->save();
		}
	}

	public function setInventoryFilters(Request $request) {
		$filters = $request->input('filters', NULL);
		$user = Auth::user();
		$setting = InventorySettings::getByUid($user->id);
		$saved_filters = json_decode($setting->equipment_filters, true);
		foreach($saved_filters as $k=>$filter) {
			if ($filters != NULL && $filters[$k]) {
				$saved_filters[$k]['favorites'] = $filters[$k]['favorites'] != '0';
			}
		}
		$setting->equipment_filters = json_encode($saved_filters);
		$setting->save();
	}

	public function setInventoryFilterValues(Request $request)
	{
		$filters = $request->input('filters', NULL);
		Log::debug($filters);
		$user = Auth::user();
		$setting = InventorySettings::getByUid($user->id);
		$setting->equipment_filter_values = json_encode($filters);
		$setting->save();
	}

	public function setMonitoringFilterValues(Request $request)
	{
		$filters = $request->input('filters', NULL);
		Log::debug($filters);
		$user = Auth::user();
		$setting = InventorySettings::getByUid($user->id);
		$setting->monitoring_filter_values = json_encode($filters);
		$setting->save();
	}
	public function changeFirmware(Request $request) {
		$model = new Inventory();
		$eq_model = new Equipment();
		$inventory_rights = new EquipmentRights();
		if (!$inventory_rights->canChangeFirmware()) {
			response('Доступ запрещен', 403);
		}
		$routes = $request->input('routes', NULL);
		if ($routes) {
			$routes = explode(',', $request->input('routes', ''));
		}
		Log::debug($routes);
		if ($request->file()) {
			$firmware_file = $request->file('firmware');
			$path = storage_path(config('inventory.firmware_path'));
			Log::debug($firmware_file);
			$filename = $firmware_file->getClientOriginalName();
			$filename = pathinfo($filename);
			$new_filename = $filename['filename'].'_'.time().($filename['extension']?'.'.$filename['extension']:'');
			$firmware_file->move($path, $new_filename);
			Log::debug($path.'/'.$new_filename);
			$total = count($routes);
			$desk = "Смена прошивки (".$filename['filename'].") для ".count($routes)." ".Helper::declOfNum($total, ['устройство', 'устройства', 'устройств']);
			$job = new ChangeFirmwareJob($routes, Auth::user(), $filename['filename'], $path.'/'.$new_filename, $desk);
			dispatch($job);
		}
		return response()->json(['error'=>0]);
	}
	public function changeFirmwareList(Request $request) {
			$resp=[];
			if ($request->file()) {
				$equipment_file = $request->file('equipmentList');
				$model = new Inventory();
				$user = Auth::user();
				$resp = $model->equipmentList($equipment_file, $user->id);
			}
			return response()->json($resp);
	}

	public function equipmentFile(Request $request) {
		$resp=[];
		if ($request->file()) {
			$equipment_file = $request->file('equipmentList');
			$model = new Inventory();
			$user = Auth::user();
			$resp = $model->equipmentList($equipment_file, $user->id);
		}
		return response()->json($resp);
	}

	public function modifyLocation(Request $request, $location_id=null) {
		$model = new Inventory();
		$name = $request->input('name');
		$desk = $request->input('desk');
		$params = $request->input('params', []);
		if ($location_id) {
			$resp = $model->modifyLocation($location_id, $name, $desk, $params);
		} else {
			$resp = $model->addLocation($name, $desk, $params);
		}
		return response()->json($resp);
	}

	public function deleteLocation(Request $request, $location_id) {
		$rights_model = new InventoryRights();
		if (!$rights_model->canDeleteLocation()) {
			reponse('403 Forbidden', 403);
		}
		$model = new Inventory();
		return  response()->json($model->deleteLocation($location_id));
	}

	public function Vlans(Request $request) {
		$rights_model = new InventoryRights();
		if (!$rights_model->canViewVlansList()) {
			return view('errors.403', [
				'user' => Auth::user(),
				'menu' => $this->menu
			]);
		}
		$model = new Inventory();
		return view('modules.inventory.vlans', [
			'title' => 'VLANы',
			'user' => Auth::user(),
			'menu' => $this->menu,
		]);
	}

	public function searchVlans(Request $request, $search_string='') {
		$model = new Inventory();
		return response()->json($model->searchVlans($search_string));
	}

	public function modifyVlan(Request $request, $vlan_id=null) {
		$model = new Inventory();
		$vid = $request->input('vid');
		$name = $request->input('name');
		$desk = $request->input('desk');
		$brand = $request->input('brand');
		if ($vlan_id) {
			$resp = $model->modifyVlan($vlan_id, $name, $desk, $vid, $brand);
		} else {
			$resp = $model->addVlan($name, $desk, $vid, $brand);
		}
		return $resp;
	}

	public function Interfaces(Request $request) {
		$rights_model = new InventoryRights();
		if (!$rights_model->canViewInterfaces()) {
			return view('errors.403', [
				'user' => Auth::user(),
				'menu' => $this->menu
			]);
		}
		$model = new Inventory();
		return view('modules.inventory.interfaces', [
			'title' => 'Интерфейсы',
			'user' => Auth::user(),
			'menu' => $this->menu,
		]);
	}

	public function getInterfacesList(Request $request, $search_string="") {
		$rights_model = new InventoryRights();
		if (!$rights_model->canViewInterfaces()) {
			return view('errors.403', [
				'user' => Auth::user(),
				'menu' => $this->menu
			]);
		}
		$model = new Inventory();
		return response()->json($model->getInterfaces($search_string));
	}

	public function addInterface(Request $request) {
		$rights_model = new InventoryRights();
		if (!$rights_model->canAddInterface()) {
			reponse('403 Forbidden', 403);
		}
		$params['location_id'] = $request->input('location_id',0);
		$params['name'] = $request->input('name');
		$params['descr'] = $request->input('descr');
		$params['brand_id'] = $request->input('brand_id');
		$params['iface'] = $request->input('iface');
		$params['nas_port_id'] = $request->input('nas_port_id');
		$model = new Inventory();
		return response()->json($model->addInterface($params));
	}

	public function editInterface(Request $request, $id) {
		$rights_model = new InventoryRights();
		if (!$rights_model->canModifyInterface()) {
			reponse(403)->json([
				'error'=>'1',
				'msg' => 'Недостаточно прав'
			]);
		}
		$params['id'] = $id;
		$params['location_id'] = $request->input('location_id',0);
		$params['name'] = $request->input('name');
		$params['descr'] = $request->input('descr');
		$params['brand_id'] = $request->input('brand_id');
		$params['iface'] = $request->input('iface');
		$params['nas_port_id'] = $request->input('nas_port_id');
		$model = new Inventory();
		return response()->json($model->editInterface($params));
	}

	public function deleteInterface(Request $request, $id) {
		$rights_model = new InventoryRights();
		if (!$rights_model->canDeleteInterface()) {
			reponse(403)->json([
				'error'=>'1',
				'msg' => 'Недостаточно прав'
			]);
		}
		$model = new Inventory();
		return response()->json($model->deleteInterface($id));
	}

	public function exportInterfaces(Request $request) {
		$rights_model = new InventoryRights();
		if (!$rights_model->canViewInterfaces()) {
			return view('errors.403', [
				'user' => Auth::user(),
				'menu' => $this->menu
			]);
		}
		$search_string=$request->input('search_string', '');
		$model = new Inventory();
		$resp = $model->getInterfaces($search_string, true);
		$xls = Excel::create('revision', function($excel) use($resp) {
			$excel->sheet('Sheet1', function($sheet) use($resp) {
				$sheet->fromArray($resp['data']);
			});
		})->export('xls');
		return $xls;
	}

	public function configureRoute(Request $request, $route) {
		$right_model = new EquipmentRights();
		if (!$right_model->canResetRouteTemplate()) {
			reponse()->json([
				'error'=>'-1',
				'msg' => 'Недостаточно прав'
			], 403);
		}
		$model = new Equipment();
		return response()->json($model->configureRoute($route));
	}

	public function configureRouteOnBuild(Request $request, $address_id, $route) {
		$right_model = new EquipmentRights();
		if (!$right_model->canResetRouteTemplate()) {
			reponse()->json([
				'error'=>'-1',
				'msg' => 'Недостаточно прав'
			], 403);
		}
		$model = new Equipment();
		return response()->json($model->configureRoute($route, $address_id));
	}

}
