<?php

namespace Modules\Inventory\Http\Controllers;

use Modules\Inventory\Models\Address;
use Modules\Inventory\Models\AddressRights;
use Modules\Inventory\Models\Equipment;
use Modules\Inventory\Models\EquipmentRights;
use Modules\Inventory\Models\Inventory;
use Modules\Inventory\Models\InventoryRights;
use Modules\Inventory\Models\InventorySettings;
use App\Models\Files;
use App\Models\Brand;

use Modules\Inventory\Models\LogModel;
use Pingpong\Modules\Routing\Controller;
use Illuminate\Http\Request;
use App\Components\Menu\Menu;
use Auth;
use Log;
use App\Components\Helper;
use Excel;
use Storage;

class AddressController extends Controller
{

	public function __construct(Menu $menu)
	{
		$this->menu=$menu;
		$this->middleware('auth');
	}

	public function getPrefixes() {
		$addres_model = new Address();
		return response()->json($addres_model->getStreetTypes());
	}

	/**
	 * Display Home screen
	 *
	 * @param  Request $request
	 * @return Response
	 */
	public function index(Request $request)
	{
		$model = new Address();
		$rights = new AddressRights();
		$region_list = $model->getRegions();
		return view('modules.inventory.index', [
			'user' => Auth::user(),
			'regions' => $region_list,
			'menu' => $this->menu,
			'newbuild_rights' => $rights->newBuildRights()
		]);
	}

	public function index2(Request $request)
	{
		$model = new Address();
		$rights = new AddressRights();
		$region_list = $model->getRegions();
		return view('modules.inventory.buildings', [
			'title' => 'Дома',
			'user' => Auth::user(),
			'regions' => $region_list,
			'menu' => $this->menu,
			'newbuild_rights' => $rights->newBuildRights()
		]);
	}

	public function getBuildingsMap(Request $request, $range)
	{
		$model = new Address();
		$building_list = $model->getBuildingsMap($range);
		return response()->json($building_list);
	}

	public function Building(Request $request, $address_id)
	{
		$model = new Address();
		$user = Auth::user();
		$equipment_model = new Equipment();
		$rights_model = new AddressRights();
		$equipment_rights = new EquipmentRights();
		if (!$rights_model->canViewBuildings()) {
			return view('errors.403', [
				'user' => $user,
				'menu' => $this->menu
			]);
		}
		$rights = $rights_model->getBuildingScreenRights();
		$build = $model->getBuildingGeneralInformation($address_id);
		if (count($build) == 0) {
			return view('errors.404', [
				'user' => Auth::user(),
				'menu' => $this->menu
			]);
		}
		$hometypes=[];
		if ($rights['tab_config']) {
			$build = $model->getBuildingInformation($address_id);
			$hometypes = $model->getBuildingTypes();
		}
		$city = '';
		$region = '';
		$street = '';
		$city_list = [];
		$regions = [];
		$streets = [];
		$files = [];
		$build_statuses =[];
		$types=[];
		$equipment=[];
		$services = $model->getServiceTable($build['address_id']);
		$city_list = $model->getCityList($build['city_id'], $city);
		$regions = $model->getRegions($build['region_id'], $region);
		$streets = $model->getStreets($build['region_id'], $build['street_id'], $street);
		$creator = $model->getBuildingCreator($build['address_id']);
//		$address_ids = $model->getManagementCompanyIDs();
		$build['services'] = $model->getServicesForAddress($address_id);
		$build['companies'] = $model->getCompaniesForAddress($address_id);
		if ($rights['tab_config']) {
			if ($rights['modify_building_rights']) {
				if ($rights['companies_change']) {
					$companies = $model->getCompanies($build['address_id']);
				}
			}
			$file_model = new Files();
			$files = $file_model->getFilesForObject('build', $address_id);
			if ($rights_model->checkStatusSetRights()) {
				$build_statuses = $model->getBuildingStatuses();
			}
		}
		if ($rights['tab_equipments']) {
			$equipment = $equipment_model->getEquipmentForBuilding($address_id);
			$types = $equipment_model->getEquipmentSystem();
			$states = $equipment_model->getStateTypes();
			$situations = $equipment_model->getSituationTypes();
			$od_accepted_systems = $equipment_model->getODAcceptedSystems();
			$situations = $situations['data'];
		}
		$entrances = [];
		if ($rights['tab_entrances']) {
			$entrances = $model->getEntrances($address_id);
			$entrances_info = $model->getEntrancesParams($address_id);
		}
		return view('modules.inventory.build', [
			'user' => $user,
			'menu' => $this->menu,
			'title' => '<span style="font-weight: 600;">ID: '.$address_id.'</span> '.$build['address'],
			'address' => $build['address'],
			'build' => isset($build)?$build:'',
			'equipment' => $equipment,
			'rights' => $rights,
			'regions' => isset($regions)?$regions:[],
			'city_list' => isset($city_list)?$city_list:[],
			'region' => isset($region)?$region:'',
			'street' => isset($street)?$street:'',
			'streets' => $streets,
			'hometypes' => $hometypes,
			'build_statuses' => $build_statuses,
			'entrances' => $entrances,
			'entrances_info' => isset($entrances_info)?$entrances_info:[],
			'services' => isset($services)?$services:[],
			'companies' => isset($companies)?$companies:[],
			'files' => $files,
			'types' => $types,
			'states' => isset($states)?$states:[],
			'situations' => isset($situations)?$situations:[],
			'od_accepted_systems' => isset($od_accepted_systems)?$od_accepted_systems:[],
			'brands' => Brand::getBrands(),
			'inventory_rights' => $equipment_rights->canViewEquipments(),
			'creator' => $creator
		]);
	}

	public function Building2(Request $request, $address_id)
	{
		$model = new Address();
		$equipment_model = new Equipment();
		$rights_model = new AddressRights();
		$rights = $rights_model->getBuildingScreenRights();
		$build = $model->getBuildingGeneralInformation($address_id);
		if ($rights['tab_config']) {
			$build = $model->getBuildingInformation($address_id);
		}
		$city = '';
		$region = '';
		$street = '';
		$city_list = [];
		$regions = [];
		$streets = [];
		$hometypes=[];
		$files = [];
		$build_statuses =[];
		$types=[];
		$equipment=[];
		if ($rights['modify_building_rights']) {
			$city_list = $model->getCityList($build['city_id'], $city);
			$regions = $model->getRegions($build['region_id'], $region);
			$streets = $model->getStreets($build['region_id'], $build['street_id'], $street);
		}
		$hometypes = $model->getBuildingTypes();
		$build_statuses = $model->getBuildingStatuses();
		if ($rights['tab_equipments']) {
			$equipment = $equipment_model->getEquipmentForBuilding($address_id);
			$file_model = new Files();
			$files = $file_model->getFilesForObject('build', $address_id);
			$types = $equipment_model->getEquipmentSystem();
			$states = $equipment_model->getStateTypes();
			$situations = $equipment_model->getSituationTypes();
			$situations = $situations['data'];
		}
		$entrances = [];
		if ($rights['tab_entrances']) {
			$entrances = $model->getEntrances($address_id);
		}
		return view('modules.inventory.build2', [
			'user' => Auth::user(),
			'menu' => $this->menu,
			'title' => $address_id.'_'.$build['address'],
			'address' => $build['address'],
			'build' => isset($build)?$build:'',
			'equipment' => $equipment,
			'rights' => $rights,
			'regions' => isset($regions)?$regions:[],
			'city_list' => isset($city_list)?$city_list:[],
			'region' => isset($region)?$region:'',
			'street' => isset($street)?$street:'',
			'streets' => $streets,
			'hometypes' => $hometypes,
			'build_statuses' => $build_statuses,
			'entrances' => $entrances,
			'files' => $files,
			'types' => $types,
			'states' => isset($states)?$states:[],
			'situations' => isset($situations)?$situations:[]
		]);
	}

	public function buildingExport(Request $request, $address_id) {
		$equipment = new Equipment();
		$equipment = $equipment->getEquipmentForBuildingExport($address_id);
		return Excel::create('equipment_'.$address_id, function($excel) use($equipment) {
			$excel->sheet('Result', function($sheet) use($equipment) {
				$sheet->fromArray($equipment);
			});
		})->export('xlsx');
	}

	public function getBuildings(Request $request, $range, $street='')
	{
		$model = new Address();
		$range=$range=='all'?'':$range;
		$street=$street=='all'?'':$street;
		$building_list = $model->getBuildings($range, $street);
		if (count($building_list) == 0) {
			$building_list = [
				"sEcho" => 1,
				"iTotalRecords" => "0",
				"iTotalDisplayRecords" => "0",
				"aaData" => []
			];
		}
		return response()->json($building_list);
	}

	public function getAddressInfoByConstructionType(Request $request, $address_id, $construction_type) {
		$model = new Address();
		return response()->json($model->getAddressInfoByConstrunctionType($address_id, $construction_type));
	}

	public function getBuildingsList(Request $request) {
		$address = new Address();
		$page = $request->input('page', 1);
		$on_page = $request->input('on_page', 25);
		$params = [
			'city_id' => $request->input('city_id', 0),
			'region_id' => $request->input('region_id', 0),
			'street_id' => $request->input('street_id', 0),
			'build' => $request->input('build', ''),
			'address_id' => $request->input('address_id', 0),
			'offset' => (($page-1)*$on_page<0)?0:($page-1)*$on_page,
			'on_page' => $on_page,
		];
		$res = $address->getBuildingsList($params, $page);
		return response()->json($res);
	}

	public function addStreet(Request $request) {
		$city_id = $request->input('city_id');
		$region_id = $request->input('region_id', null);
		$street_name = $request->input('street_name');
		$street_type = $request->input('street_type');
		$model = new Address();
		return ['error' => 0];
		if ($model->addStreet($street_name, $city_id, $street_type, $region_id)) {
			return response()->json(['error'=>0]);
		} else {
			return response()->json(['error'=>1]);
		}
	}

	public function addStreet2(Request $request) {
		$city_id = $request->input('city_id');
		$regions = $request->input('regions', []);
		$street_name = $request->input('street_name');
		$street_type = $request->input('street_type');
		$model = new Address();
		return response()->json($model->addStreet($street_name, $city_id, $street_type, $regions));
	}

	public function getStreetTypes(Request $request) {
		$model = new Address();
		return response()->json($model->getStreetTypes());
	}

	public function getStreets(Request $request, $region_id, $city_id=0) {
		$model = new Address();
		$data=[];
		if (intval($region_id) != 0) {
			$data = $model->getStreets($region_id);
		} else if($city_id != 0) {
			$data = $model->getCitysStreet($city_id);
		}
		return response()->json($data);
	}

	public function getRegions(Request $request, $city_id) {
		$model = new Address();
		return response()->json($model->getRegionsForCities([$city_id]));
	}

	public function getBuildingTypes(Request $request) {
		$model = new Address();
		return response()->json($model->getBuildingTypes());
	}

	public function getEntrances(Request $request, $address_id) {
		$model = new Address();
		return response()->json($model->getEntrancesParams($address_id));
	}

	public function saveEntrances(Request $request, $address_id) {
		$entrances = $request->input('entrances');
		$model = new Address();
		if ($model->saveEntrances($address_id, $entrances)) {
			return response()->json(['error'=>0]);
		} else {
			return response()->json(['error' => 1]);
		}
	}

	public function getCities(Request $request) {
		$model = new Address();
		return response()->json($model->getCityList());
	}

	public function saveStatus(Request $request, $address_id) {
		$status = $request->input('status');
		$model = new Address();
		$resp = $model->saveStatus($address_id, $status);
		return response()->json($resp);
	}

	public function getBuildingsByStreet(Request $request) {
		$region_id = $request->input('region_id');
		$street_id = $request->input('street_id');
		$build = $request->input('build');
		$body = $request->input('body');
		$construction_type = $request->input('construction_type', 0);
		$model = new Address();
		return response()->json($model->searchBuild($region_id, $street_id, $build, $body, $construction_type));
	}

	public function searchStreet(Request $request, $street) {
		$model = new Address();
		return response()->json($model->searchStreet($street));
	}

	public function getRegionsForCities(Request $request) {
		$cities = $request->input('cities', []);
		$model = new Address();
		return response()->json(Helper::toMultiselect($model->getRegionsForCities($cities), 'id', 'desk', true));
	}

	public function streetAutocomplete(Request $request) {
		$region_id = $request->input('region_id', 0);
		$city_id = $request->input('city_id', 0);
		$street = $request->input('street', '');
		$street_only = $request->input('street_only', 0);
		$model = new Address();
		return response()->json($model->searchStreet($street, $region_id, $city_id, $street_only));
	}

	public function getAddressInfo(Request $request, $address_id) {
		$model = new Address();
		$inv_model = new Inventory();
		$resp = [
			'error' => 0,
			'address' => $model->getAddressInformation($address_id),
			'rights' => $inv_model->canChangeAddress()
		];
		return response()->json($resp);
	}

	public function buildingSearch(Request $request) {
		$region_id = $request->input('region_id');
		$street_id = $request->input('street_id');
		$build = $request->input('build');
		$body = $request->input('body');
		$model = new Address($request->user()->getBillingConnection());
		return response()->json($model->searchBuild($region_id, $street_id, $build, $body));
	}

	public function BuildingView(Request $request, $address_id)
	{
		$model = new Address();
		$build = $model->getBuildingInformation($address_id);
		return view('modules.inventory.build_view', [
			'address' => $build['address'],
			'build' => $build
		]);
	}

	public function getYandexCoord(Request $request)
	{
		$address_string = $request->input("address_string");
		$address_id = $request->input("address_id", null);
		$model = new Address();
		$ya_resp = $model->getYandexCoord($address_string);
		$ya_resp['address_id'] = $address_id;
		return response()->json($ya_resp);
	}

	public function getGoogleCoord(Request $request)
	{
		$address_string = $request->input("address_string");
		$model = new Address();
		$go_resp = $model->getGoogleCoord($address_string);
		return response()->json($go_resp);
	}

	public function get2GisCoord(Request $request)
	{
		$address_string = $request->input("address_string");
		$model = new Address();
		$go_resp = $model->get2GisCoord($address_string);
		return response()->json($go_resp);
	}
	/*
        public function Coordinates(Request $request)
        {
            $model = new Address();
            $buildings = $model->getAddressWCoord();
            return view('inventory.coordinate', ['buildings' => $buildings]);
        }
    */
	public function Coordinates(Request $request)
	{
		$model = new Address();
		$region_list = $model->getRegions();
		return view('modules.inventory.coordinate', [
			'user' => Auth::user(),
			'menu' => $this->menu,
			'regions' => $region_list
		]);
	}

	public function Coordinates_react(Request $request)
	{
		$model = new Address();
		$buildings = $model->getAddressWCoord();
		return view('inventory.coordinate_react', ['buildings' => $buildings]);
	}

	public function getBuildingsCoord(Request $request, $range)
	{
		$empty = $request->input("empty");
		$model = new Address();
		$building_list['data'] = $model->getAddressWCoord($range, $empty);
		if (count($building_list) == 0) {
			$building_list = [
				"sEcho" => 1,
				"iTotalRecords" => "0",
				"iTotalDisplayRecords" => "0",
				"aaData" => []
			];
		}
		return response()->json($building_list);
	}

	public function saveCoordinate(Request $request) {
		$address_id = $request->input('address_id');
		$latitude = $request->input('latitude');
		$longitude = $request->input('longitude');
		$model = new Address();
		$resp = $model->saveCoordinates($address_id, $longitude, $latitude);
		return response()->json($resp);
	}

	public function newBuilding(Request $request) {
		$model = new Address();
		$rights_model = new AddressRights();
		$address['city_id'] = $request->input('city_id', 0);
		$address['region_id'] = $request->input('region_id', 0);
		$address['street_id'] = $request->input('street_id', 0);
		$address['address_id'] = $request->input('address_id', 0);
		$city_list = $model->getCityList();
		$types = $model->getBuildingTypes();
		$services = $model->getServices(46133);
		if ($rights_model->newBuildRights()) {
			$user = Auth::user();
			$rights['new_street'] = $rights_model->newStreetRights($user->login);
			return view('modules.inventory.build_create', [
				'title' => 'Добавить новый дом',
				'page' => 'new-building',
				'city_list' => $city_list,
				'address' => $address,
				'services' => $services,
				'rights' => $rights,
				'types' => $types,
				'user' => Auth::user(),
				'menu' => $this->menu
			]);
		} else {
			return view('errors.access');
		}
	}

	public function ajaxStreetSearch(Request $request) {
		$street_string = $request->input('street');
		$resp=[];
		if (strlen($street_string)>2) {
			$model = new Address();
			$resp = $model->getBuildingsByStreet($street_string);
		}
		return response()->json($resp);
	}

	public function addBuilding(Request $request) {
		$model = new Address();
		$params['address_id'] = $request->input('address_id', 0);
		$params['region_id'] = $request->input('region_id');
		$params['street_id'] = $request->input('street_id');
		$params['construction_type'] = $request->input('construction_type');
		$params['build'] = $request->input('build');
		$params['build_type'] = $request->input('build_type');
		$params['body'] = $request->input('body');
		$params['entrance'] = $request->input('entrance');
		$params['floors'] = $request->input('floors');
		$params['memo'] = $request->input('memo');
		$params['note'] = $request->input('note');
		$params['clients'] = $request->input('clients');
		$params['price'] = $request->input('price');
		$params['memo'] = $request->input('memo');
		$params['note'] = $request->input('note');
		$params['services'] = $request->input('services', []);
		$params['services_changed'] = $request->input('services_changed', 0);
		$params['companies'] = $request->input('companies', []);
		$params['companies_changed'] = $request->input('companies_changed', 0);
		$params['status'] = $request->input('status', 0);
		$params['status_changed'] = $request->input('status_changed', 0);
		$params['services'] = $request->input('services', []);
		$params['lat'] = $request->input('lat', 0);
		$params['lng'] = $request->input('lng', 0);
		return response()->json($model->addBuilding($params));
	}

	public function modifyBuilding(Request $request, $address_id) {
		$params['address_id'] = $address_id;
		$params['region_id'] = $request->input('region_id');
		$params['street_id'] = $request->input('street_id');
		$params['building_params'] = $request->input('building_params');
		$params['building_params_changed'] = $request->input('building_params_changed', 0);
		$params['militia_params'] = $request->input('militia_params');
		$params['militia_params_changed'] = $request->input('militia_params_changed', 0);
		$params['companies'] = $request->input('companies', []);
		$params['companies_changed'] = $request->input('companies_changed', 0);
		$params['status'] = $request->input('status', 0);
		$params['status_changed'] = $request->input('status_changed', 0);
		Log::debug($params);
		$model = new Address();
		return response()->json($model->modifyBuild($params));
	}

	public function saveBuildingServices(Request $request, $address_id) {
		$services = $request->input('services', []);
		$model = new Address();
		return response()->json($model->saveServices($services, $address_id));
	}

	public function getStreetsList(Request $request) {
		$address = new Address();
//		$page = $request->input('page', 1);
//		$on_page = $request->input('on_page', 25);
		$params = [
			'city_id' => $request->input('city_id', 0),
			'region_id' => $request->input('region_id', 0),
			'street_id' => $request->input('street_id', 0)
//			'build' => $request->input('build', ''),
//			'offset' => ($page-1)*$on_page,
//			'on_page' => $on_page,
		];
		$res = $address->getStreetsList($params);
		return response()->json($res);
	}

	public function streets(Request $request) {
		$rights_model = new AddressRights();
		if (!$rights_model->canViewStreets()) {
			return view('errors.403', [
				'user' => Auth::user(),
				'menu' => $this->menu
			]);
		}
		$address_model = new Address();
		return view('modules.inventory.streets',[
			'title' => 'Улицы',
			'page' => 'streets',
			'new_street_rights' => $rights_model->newStreetRights(),
			'modify_street_rights' => $rights_model->modifyStreetRights(),
			'prefixes' => $address_model->getStreetTypes(),
			'cities' => $address_model->getCityList(),
			'user' => Auth::user(),
			'menu' => $this->menu,
		]);
	}

	public function searchStreets(Request $request) {
		$rights_model = new AddressRights();
		if (!$rights_model->canViewStreets()) {
			response(403);
		}
		$city_id = $request->input('city_id');
		$region_id = $request->input('region_id');
		$street = $request->input('street', '');

		$address_model = new Address();
		$prefix_array = $address_model->getStreetTypes();
		$prefixes = [];
		if ($street != '') {
			foreach ($prefix_array as $prefix) {
				$prefixes[] = $prefix->prefix;
			}
			$street = str_replace($prefixes,'', $street);
			if (strpos($street, ' - ')) {
				$str = explode(' - ', $street);
				$street = $str[count($str)-1];
			}
		}
		return response()->json($address_model->getStreetsList([
			'city_id'=> $city_id,
			'region_id' => $region_id,
			'street' => $street
		]));
	}

	public function modifyStreet(Request $request, $street_id) {
		$params = [
			'type' => $request->input('street_type', 0),
			'desk' => $request->input('street_name', 0),
			'desk_changed' => $request->input('desk_changed', false),
			'regions' => $request->input('regions', []),
			'region_changed' => $request->input('region_changed', false)
		];
		$address_model = new Address();
		return response()->json($address_model->modifyStreet($street_id, $params));
	}

	public function cityAutocomplete(Request $request, $city_string) {
		$address_model = new Address();
		return response()->json($address_model->cityAutocomplete($city_string));
	}

	public function regionAutocomplete(Request $request, $city_string, $region_string) {
		$address_model = new Address();
		return response()->json($address_model->regionAutocomplete($city_string, $region_string));
	}

	public function streetAutocomplete2(Request $request, $city_string, $region_string, $street_string) {
		$address_model = new Address();
		Log::debug($city_string);
		Log::debug($region_string);
		Log::debug($street_string);
		return response()->json($address_model->streetAutocomplete($city_string, $region_string, $street_string));
	}

	public function getFiles(Request $request, $address_id) {
		$address_rights = new AddressRights();
		if (!$address_rights->checkFilesListRights()) {
			return response()->json(['error'=>403, 'msg'=>'Доступ запрещен'], 403);
		}
		$address_model = new Address();
		return response()->json([
			'error' => 0,
			'data' => $address_model->getBuildingFiles($address_id)
		]);
	}

	public function uploadFile(Request $request, $address_id) {
		$address_rights = new AddressRights();
		if (!$address_rights->checkFilesAddRights()) {
			return response()->json(['error'=>403, 'msg'=>'Доступ запрещен'], 403);
		}
		$address_model = new Address();
		$params = [
			'subgroup_id' => $request->input('subgroup_id', 0),
			'note' => $request->input('note', ''),
		];
		$file = $request->file('file', null);
		if ($file) {
			$params['file_name'] = $file->getClientOriginalName();
			Log::debug($params);
		}
		return response()->json($address_model->uploadFile($address_id, $params, $file));
	}

	public function deleteFile(Request $request, $address_id, $hash) {
		$file = base64_decode($hash);
		$fileInfo = explode(';', $file);
		$fileInfo = [
			'id' => $fileInfo[0],
			'name' => $fileInfo[1],
			'date' => $fileInfo[2]
		];
		$address_rights = new AddressRights();
		if (!$address_rights->checkFilesAddRights()) {
			return response()->json(['error'=>403, 'msg'=>'Доступ запрещен'], 403);
		}
		$address_model = new Address();
		$address_model->deleteFile($address_id, $fileInfo);
	}

	public function getFile(Request $request, $address_id, $hash) {
		$file = base64_decode($hash);
		$fileInfo = explode(';', $file);
		$fileInfo = [
			'id' => $fileInfo[0],
			'name' => $fileInfo[1],
			'date' => $fileInfo[2]
		];
		Log::debug($fileInfo);
		$fileNameInfo = pathinfo($fileInfo['name']);
		$storageFilename = $fileNameInfo['filename'].'_'.$fileInfo['id'].(isset($fileNameInfo['extension'])?'.'.$fileNameInfo['extension']:'');
		$path = 'build/'.$address_id.'/'.$storageFilename;
		if ($file = Storage::get($path)) {
			$finfo = new \finfo(FILEINFO_MIME);
			return response($file, 200)->
				header('Content-Disposition', "inline; filename=\"".$fileInfo['name']."\"; filename*=utf-8''%name")->
				header('Content-Type', $finfo->buffer($file));

		} else {
			return response(404);
		}
	}

	public function getFileGroups(Request $request) {
		$address_model = new Address();
		return response()->json([
			'error' => 0,
			'data' => $address_model->getFileGroups()
		]);
	}

	public function getFileSubgroups(Request $request, $group_id) {
		$address_model = new Address();
		return response()->json([
			'error' => 0,
			'data' => $address_model->getFileSubgroups($group_id)
		]);
	}

	public function exchangeAddress(Request $request, $address_id) {
		$address_model = new Address();
		$address_model->exchangeAddress($address_id);
	}

	public function getEquipmentsForAddress(Request $request) {
		$city_id = $request->input('city_id', 0);
		$city = $request->input('city', '');
		$region_id = $request->input('region_id', 0);
		$region = $request->input('region', '');
		$street_id = $request->input('street_id', 0);
		$street = $request->input('street', 0);
		$build = $request->input('build', '');
		$address = new Address();
		$prefix_array = $address->getStreetTypes();
		$prefixes = [];
		if ($street != '') {
			foreach ($prefix_array as $prefix) {
				$prefixes[] = $prefix->prefix;
			}
			$street = str_replace($prefixes,'', $street);
			if (strpos($street, ' - ')) {
				$str = explode(' - ', $street);
				$street = $str[count($str)-1];
			}
		}
		$inventory = new Equipment();
		$resp = $inventory->getEquipmentAddressExport([
			'city'=> $city,
			'region' => $region,
			'street' => $street,
			'build' => $build
		]);
		return Excel::create('revision', function($excel) use($resp) {
			$excel->sheet('Export', function($sheet) use($resp) {
				$sheet->fromArray($resp);
			});
		})->export('xlsx');
	}

	public function Cadastral(Request $request) {
		$rights_model = new AddressRights();
		if (!$rights_model->canViewСadastral()) {
			return view('errors.403', [
				'user' => Auth::user(),
				'menu' => $this->menu
			]);
		}
		return view('modules.inventory.cadastral', [
			'title' => 'Кадастр',
			'user' => Auth::user(),
			'menu' => $this->menu,
		]);
	}

	public function getCadastral(Request $request, $search_string='') {
		$rights_model = new AddressRights();
		if (!$rights_model->canViewСadastral()) {
			return view('errors.403', [
				'user' => Auth::user(),
				'menu' => $this->menu
			]);
		}
		$model = new Address();
		return response()->json($model->searchCadastral($search_string));
	}

	public function getCadastralTypes(Request $request) {
		$model = new Address();
		return response()->json($model->getCadastralTypes());
	}

	public function modifyCadastral(Request $request, $cadastral_id = 0) {
		$rights_model = new AddressRights();
		if (!$rights_model->canAddСadastral()) {
			return view('errors.403', [
				'user' => Auth::user(),
				'menu' => $this->menu
			]);
		}
		$type = $request->input('type', 0);
		$number = $request->input('number', '');
		$descr = $request->input('descr', '');
		$url = $request->input('url', '');
		$regions = $request->input('regions', []);
		$model = new Address();
		$resp = [];
		if ($cadastral_id) {
			$resp = $model->modifyCadastral($cadastral_id, $type, $number, $descr, $url, $regions);
		} else {
			$resp = $model->addCadastral($type, $number, $descr, $url, $regions);
		}
		return response()->json($resp);
	}

	public function getBuildingServices(Request $request, $address_id) {
		$model = new Address();
		return response()->json($model->getServiceTable($address_id));
	}

	public function searchPermits(Request $request, $search_string) {
		$model = new Address();
		return response()->json($model->searchPermits($search_string));
	}

	public function addPermit(Request $request) {
		$model = new Address();
		$number = $request->input('number');
		$date_from = $request->input('date_from');
		$date_to = $request->input('date_to');
		return response()->json($model->addPermit($number, $date_from, $date_to));
	}

	public function getBuildingTabList(Request $request, $address_id) {
		$model_rights = new AddressRights();
		if (!$model_rights->canBuildingTabList()) {
			return response()->json(['error'=>403, 'msg'=>'Доступ запрещен'], 403);
		}
		$model = new Address();
		return response()->json($model->getBuildingTabList($address_id));
	}

	public function getBuildingTabSystems(Request $request) {
		$model = new Address();
		return response()->json($model->getBuildingTabSystems());
	}

	public function getBuildingTabContractors(Request $request, $address_id, $search_string) {
		$model = new Address();
		return response()->json($model->getBuildingTabContractors($search_string));
	}

	public function getBuildingTabStatuses(Request $request) {
		$model = new Address();
		return response()->json($model->getBuildingTabStatuses());
	}

	public function addBuildingTabRecord(Request $request, $address_id) {
		$model_rights = new AddressRights();
		if (!$model_rights->canManagementCompanyID()) {
			return response()->json(['error'=>403, 'msg'=>'Доступ запрещен'], 403);
		}
		$another_address_id = $request->input('another_address_id', 0);
		$company_id = $request->input('company_id', 0);
		$system = $request->input('system', 0);
		$model = new Address();
		return response()->json($model->addManagementCompanyID($address_id, $another_address_id, $company_id, $system));
	}

}

