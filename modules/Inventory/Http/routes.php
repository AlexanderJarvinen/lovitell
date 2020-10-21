<?php

Route::group(['middleware' => 'web', 'prefix' => 'inventory', 'namespace' => 'Modules\Inventory\Http\Controllers'], function()
{
	Route::get('/', 'InventoryController@index');
	Route::any('/buildings/by-street', 'AddressController@getBuildingsByStreet');
	Route::get('/buildings-map/{range}', 'AddressController@getBuildingsMap');
	Route::get('/buildings/coordinate/{range}', 'AddressController@getBuildingsCoord');
	Route::get('/buildings/{range}/{street}', 'AddressController@getBuildings');
	Route::get('/buildings/export', 'AddressController@getEquipmentsForAddress');
	Route::get('/buildings', 'AddressController@index2');
	Route::get('/streets', 'AddressController@streets');
	Route::post('/building/', 'AddressController@addBuilding');
	Route::get('/building/{address_id}/file/{hash}', 'AddressController@getFile');
	Route::delete('/building/{address_id}/file/{hash}', 'AddressController@deleteFile');
	Route::get('/building/new', 'AddressController@newBuilding');
	Route::get('/building/types', 'AddressController@getBuildingTypes');
	Route::post('/building/search', 'AddressController@buildingSearch');
	Route::post('/building/{address_id}', 'AddressController@modifyBuilding');
	Route::get('/building/{address_id}/entrances', 'AddressController@getEntrances');
	Route::post('/building/{address_id}/entrances', 'AddressController@saveEntrances');
	Route::post('/building/{address_id}/status', 'AddressController@saveStatus');
	Route::get('/building/{address_id}/export', 'AddressController@buildingExport');
	Route::get('/building/{address_id}', 'AddressController@Building');
	Route::get('/building2/{address_id}', 'AddressController@Building2');
	Route::get('/route/{route_name}', 'InventoryController@getRouteInfo');
	Route::get('/building-view/{address_id}', 'AddressController@BuildingView');
	Route::get('/streets/{region_id}', 'AddressController@getStreets');
	Route::get('/streets/{region_id}/{city_id}', 'AddressController@getStreets');
	Route::get('/ajax/address-info/{address_id}/{construction_type}', 'AddressController@getAddressInfoByConstructionType');

	Route::post('/street/', 'AddressController@addStreet');

	Route::get('/regions/{city_id}', 'AddressController@getRegions');
	Route::get('/ajax/city/{city_id}/regions', 'AddressController@getRegions');
	Route::post('/regions/', 'AddressController@getRegionsForCities');
	Route::get('/street-types/', 'AddressController@getStreetTypes');
	Route::post('/streets', 'AddressController@streetAutocomplete');

	Route::get('/equipment2', 'EquipmentController@index2');
	Route::get('/equipment', 'EquipmentController@index');
	Route::get('/equipment3', 'EquipmentController@index3');
	Route::get('/equipment/{export}', 'EquipmentController@getEquipment');
	Route::post('/equipment/{export}', 'EquipmentController@getEquipment');
	Route::get('/equipment/list/{range}', 'EquipmentController@getEquipments');
	Route::get('/equipment/view/{equipment_id}', 'EquipmentController@getView');
	Route::get('/check-network/{address_id}', 'InventoryController@checkNetwork');
	Route::get('/check-network/{address_id}/{export}', 'InventoryController@checkNetwork');
	Route::get('/change-template/{address_id}', 'InventoryController@changeTemplate');
	Route::get('/reset-route-template/{route}', 'InventoryController@resetRouteTemplate');

	//Route::get('/coordinates', 'InventoryController@Coordinates');
	Route::get('/coordinates', 'AddressController@Coordinates');

	Route::get('/locations', 'InventoryController@Locations');

	Route::get('/vlans', 'InventoryController@Vlans');

	Route::get('/services', 'ServiceController@Services');

	Route::get('/cadastral', 'AddressController@Cadastral');

	Route::get('/flaps', 'InventoryController@Nagios');
	Route::get('/monitoring', 'EquipmentController@Monitoring');

	Route::get('/capex', 'CapexController@Capex');

	Route::get('/chart/{graph}/', 'NetworkGraphController@index');
	Route::get('/chart/{graph}/{id}', 'NetworkGraphController@index');
	Route::get('/chart/{graph}/{id}/{brand_id}', 'NetworkGraphController@index');
	Route::get('/ajax/chart/{graph}/{id}/{brand_id}', 'NetworkGraphController@getBarData');

	Route::get('/map', 'InventoryController@map');
	Route::get('/equipment/adding-revision/{adding_id}', 'EquipmentController@addingRevision');

	Route::get('/sessions/', 'SessionController@Sessions');

	Route::get('/interfaces/', 'InventoryController@Interfaces');
	Route::get('/interfaces/export/', 'InventoryController@exportInterfaces');

});
Route::post('/equipment/search/', 'EquipmentController@searchEquipment');
Route::post('/equipment/setmac', 'EquipmentController@setMac');

Route::group(['middleware' => ['apiauth'], 'prefix' => 'inventory', 'namespace' => 'Modules\Inventory\Http\Controllers'], function () {
	Route::post('/equipment2/search', 'EquipmentController@searchEquipment');
	Route::post('/equipment2/setmac', 'EquipmentController@setMac');

	Route::post('/update-template/{address_id}', 'InventoryController@changeTemplate');

	Route::post('/ajax/equipment/add', 'EquipmentController@addEquipment');
	Route::post('/ajax/equipment/update/{batch}', 'InventoryController@updateEquipmentParams');
	Route::post('/ajax/equipment/update', 'InventoryController@updateEquipmentParams');
	Route::any('/ajax/equipment/', 'EquipmentController@getEquipment');
	Route::post('/ajax/equipment/firmware', 'InventoryController@changeFirmware');

	Route::post('/ajax/equipment/set-system', 'EquipmentController@setSystem');
	Route::get('/ajax/cities', 'AddressController@getCities');
	Route::get('/ajax/street/prefixes', 'AddressController@getPrefixes');
	Route::get('/ajax/street/{street}', 'AddressController@searchStreet');
	Route::post('/get-yandex-coord/', 'AddressController@getYandexCoord');
	Route::post('/get-google-coord/', 'AddressController@getGoogleCoord');
	Route::post('/get-2gis-coord/', 'AddressController@get2GisCoord');
	Route::post('/save-coord', 'AddressController@saveCoordinate');
	Route::get('/ajax/city/', 'AddressController@getCities');
	Route::get('/ajax/cities/', 'AddressController@getCities');

	Route::get('/ajax/locations/', 'InventoryController@getLocations');
	Route::get('/ajax/locations/params', 'InventoryController@getLocationsParams');
	Route::get('/ajax/location-list/', 'InventoryController@getLocationsList');
	Route::get('/ajax/location-list/{search_string}', 'InventoryController@getLocationsList');

	Route::get('/ajax/get-address-info/{address_id}', 'AddressController@getAddressInfo');
	Route::get('/ajax/linktype/', 'EquipmentController@getLinkTypes');
	Route::post('/ajax/revision/load', 'InventoryController@loadForRevision');
	Route::post('/ajax/{address_id}/batch-mac-change', 'InventoryController@batchMacChange');
	Route::get('/ajax/templates/{system}', 'EquipmentController@getTemplateGroups');
	Route::get('/ajax/template-log/{route}', 'EquipmentController@getTemplates');

	Route::post('/ajax/buildings/get', 'AddressController@getBuildingsList');

	Route::post('/ajax/streets', 'AddressController@getStreetsList');

	Route::get('/ajax/situations', 'EquipmentController@getSituations');
	Route::get('/ajax/systems', 'InventoryController@getSystems');
    Route::get('/ajax/models/{group}', 'InventoryController@getModels');
	Route::get('/ajax/vlans/{location}/{system}', 'InventoryController@getVlans');
	Route::get('/ajax/vlans/{location}/sg/{system_group}/', 'InventoryController@getVlansSG' );
	Route::get('/ajax/iplist/{location}/{vlan}', 'InventoryController@getIpList');

	Route::get('/ajax/checkrights/address/change', 'InventoryRightsController@canChangeAddress');
	Route::get('/ajax/checkrights/mac/change', 'InventoryRightsController@canChangeMac');
	Route::get('/ajax/checkrights/ip/change', 'InventoryRightsController@canChangeIp');
	Route::get('/ajax/checkrights/source/change', 'InventoryRightsController@canChangeSource');
	Route::get('/ajax/checkrights/desk/change', 'InventoryRightsController@canChangeDesk');
	Route::get('/ajax/checkrights/location/change', 'InventoryRightsController@canChangeLocation');
	Route::get('/ajax/checkrights/route/change', 'InventoryRightsController@canChangeRoute');
	Route::get('/ajax/checkrights/ip/viewlist', 'InventoryRightsController@canViewIpList');
	Route::get('/ajax/checkrights/model/change', 'InventoryRightsController@canChangeModel');
	Route::get('/ajax/checkrights/vlan/change', 'InventoryRightsController@canChangeVlan');
	Route::get('/ajax/checkrights/system/change', 'InventoryRightsController@canChangeSystem');
	Route::get('/ajax/checkrights/location/modify', 'InventoryRightsController@canModifyLocation');
	Route::get('/ajax/checkrights/location/add', 'InventoryRightsController@canAddLocation');
	Route::get('/ajax/checkrights/location/delete', 'InventoryRightsController@canDeleteLocation');
	Route::get('/ajax/checkrights/vlan/modify', 'InventoryRightsController@canModifyVlan');
	Route::get('/ajax/checkrights/vlan/add', 'InventoryRightsController@canAddVlan');
	Route::get('/ajax/checkrights/cadastral/modify', 'InventoryRightsController@canModifyСadastral');
	Route::get('/ajax/checkrights/cadastral/add', 'InventoryRightsController@canAddСadastral');
	Route::get('/ajax/checkrights/interface/modify', 'InventoryRightsController@canModifyInterface');
	Route::get('/ajax/checkrights/interface/add', 'InventoryRightsController@canAddInterface');
	Route::get('/ajax/checkrights/interface/delete', 'InventoryRightsController@canDeleteInterface');
	Route::get('/ajax/checkrights/capex/add', 'InventoryRightsController@canAddCapex');
	Route::get('/ajax/checkrights/buildingtab/add', 'InventoryRightsController@canAddBuildingRecord');
	Route::get('/ajax/checkrights/canresetap', 'InventoryRightsController@canResetAp');
	Route::get('/ajax/checkrights/changeaptemplate', 'InventoryRightsController@canChangeAp');


	Route::get('/ajax/jobs/{type}/', 'JobController@getJobs');
	Route::get('/ajax/jobs/{type}/{address_id}', 'JobController@getJobs');
	Route::get('/ajax/job/{type}/{job_id}', 'JobController@getJobDetails');
	Route::get('/ajax/job/{type}/{job_id}/stop', 'JobController@stopJob');
	Route::get('/ajax/job/{type}/{job_id}/log/{start_date}', 'JobController@getJobLog');

	Route::get('/ajax/jobs2/', 'JobController@getJobs2');

	Route::get('/ajax/info/locations/', 'InventoryController@getLocations');
	Route::get('/ajax/location/{location_id}', 'InventoryController@getLocation');
	Route::post('/ajax/location/{location_id}', 'InventoryController@modifyLocation');
	Route::put('/ajax/location/', 'InventoryController@modifyLocation');
	Route::delete('/ajax/location/{location_id}', 'InventoryController@deleteLocation');

	Route::get('/ajax/vlans/', 'InventoryController@searchVlans');
	Route::get('/ajax/vlans/{search_string}', 'InventoryController@searchVlans');
	Route::get('/ajax/vlan/{vlan_id}', 'InventoryController@getVlan');
	Route::post('/ajax/vlan/{vlan_id}', 'InventoryController@modifyVlan');
	Route::put('/ajax/vlan/', 'InventoryController@modifyVlan');


	Route::get('/ajax/cadastral/types', 'AddressController@getCadastralTypes');
	Route::get('/ajax/cadastrals/', 'AddressController@getCadastral');
	Route::get('/ajax/cadastrals/{search_string}', 'AddressController@getCadastral');
	Route::post('/ajax/cadastral/{cadastral_id}', 'AddressController@modifyCadastral');
	Route::put('/ajax/cadastral/', 'AddressController@modifyCadastral');

	Route::get('/ajax/services/', 'ServiceController@getServicesList');

	Route::get('/ajax/service/{service_id}', 'ServiceController@getServiceInfo');

	Route::get('/ajax/nagios/crashes', 'InventoryController@getNagiosCrashes');
	Route::get('/ajax/nagios/flaps/{system}', 'InventoryController@getNagiosFlaps');

	Route::post('/ajax/service/add', 'ServiceController@addService');
	Route::post('/ajax/service/{id}/modify', 'ServiceController@modifyService');
	Route::put('/ajax/service/{id}/option', 'ServiceController@addServiceOption');
	Route::post('/ajax/service/{id}/option/{option_id}', 'ServiceController@modifyServiceOption');
	Route::delete('/ajax/service/{id}/option/{option_id}', 'ServiceController@deleteServiceOption');

	Route::get('/building/{address_id}/accept/ncc/{system}', 'InventoryController@batchAcceptNCC');
	Route::get('/building/{address_id}/accept/od/{system}', 'InventoryController@batchAcceptOD');
	Route::post('/building/{address_id}/change_state/{system}/{state}', 'InventoryController@batchChangeState');
	Route::get('/building/{address_id}/address/exchange', 'AddressController@exchangeAddress');
	Route::get('/ajax/building/{address_id}/delete-routes', 'EquipmentController@getAddressDeletedRoutes');
	Route::delete('/ajax/building/{address_id}/delete-routes', 'EquipmentController@batchDeleteAP');

	Route::get('/ajax/building/{address_id}/services', 'AddressController@getBuildingServices');
	Route::post('/ajax/building/{address_id}/services', 'AddressController@saveBuildingServices');

	Route::get('/ajax/building/{address_id}/building-tab-list/', 'AddressController@getBuildingTabList');
	Route::get('/ajax/building/{address_id}/building-tab-list/systems', 'AddressController@getBuildingTabSystems');
	Route::get('/ajax/building/{address_id}/building-tab-list/companies', 'AddressController@getBuildingTabCompanies');
	Route::get('/ajax/building/{address_id}/building-tab-list/states', 'AddressController@getBuildingTabStates');

	Route::put('/ajax/building/{address_id}/building-tab-record/', 'AddressController@addBuildingTabRecord');
	Route::post('/ajax/building/{address_id}/building-tab-record/', 'AddressController@modifyBuildingTabRecord');

	Route::get('/ajax/start-apscan/{address_id}', 'InventoryController@startAPScan');

	Route::get('/ajax/start-apscan/{address_id}', 'InventoryController@startAPScan');

	Route::get('/job/{type}/{job_id}/{export}', 'JobController@getJobDetails');

	Route::get('/ajax/eqp/coord1', 'EquipmentController@getEquipmentCoord');

	Route::get('/ajax/equipment/getparams', 'EquipmentController@getChangedParams');
	Route::post('/ajax/equipment/paramsfile', 'EquipmentController@uploadParamsFile');

	Route::delete('/ajax/equipment/{route}', 'EquipmentController@equipmentDelete');

	Route::post('/ajax/equipment/addfile', 'EquipmentController@addEquipmentFile');
	Route::post('/ajax/equipment/addfile/{adding_id}/save', 'EquipmentController@equipmentSaveFromFile');

	Route::get('/ajax/building/{address_id}/troubles/{type}/', 'Troubles\AjaxController@getTroubles');
	Route::get('/ajax/building/{address_id}/troubles/{type}/{start_date}/{end_date}', 'Troubles\AjaxController@getTroubles');

	Route::post('/ajax/street/{street_id}', 'AddressController@saveStreet');
	Route::post('/ajax/streets/search', 'AddressController@searchStreets');

	Route::get('/ajax/building/{address_id}/clients/', 'Clients\AjaxController@searchClients');
	Route::get('/building/{address_id}/clients/{export}', 'Clients\HomeController@exportClients');

	Route::get('/ajax/troubles/{type}/{start_date}/{end_date}', 'Troubles\AjaxController@getTroubles');

	Route::get('/ajax/settings/{param}/{val}', 'InventoryController@setSetting');
	Route::post('/ajax/settings/monitoring-table-columns', 'InventoryController@setMonitoringTableColumns');
	Route::post('/ajax/settings/inventory-table-columns', 'InventoryController@setInventoryTableColumns');
	Route::post('/ajax/settings/monitoring-filters', 'InventoryController@setMonitoringFilters');
	Route::post('/ajax/settings/equipment-filters', 'InventoryController@setInventoryFilters');
	Route::post('/ajax/settings/monitoring-filter-values', 'InventoryController@setMonitoringFilterValues');
	Route::post('/ajax/settings/equipment-filter-values', 'InventoryController@setInventoryFilterValues');

	Route::put('/ajax/street/', 'AddressController@addStreet2');
	Route::post('/ajax/street/{street_id}', 'AddressController@modifyStreet');

	Route::get('/ajax/cities/acmp/', 'AddressController@cityAutocomplete');
	Route::get('/ajax/cities/acmp/{city_string}', 'AddressController@cityAutocomplete');
	Route::get('/ajax/regions/acmp/{city_string}/{region_string}', 'AddressController@regionAutocomplete');
	Route::get('/ajax/streets/acmp/{city_string}/{region_string}/{street_string}', 'AddressController@streetAutocomplete2');

	Route::get('/ajax/building/{address_id}/files', 'AddressController@getFiles');
	Route::post('/ajax/building/{address_id}/file', 'AddressController@uploadFile');
	Route::get('/ajax/building/file/groups/', 'AddressController@getFileGroups');
	Route::get('/ajax/building/file/group/{group_id}/subgroups', 'AddressController@getFileSubgroups');

	Route::post('/ajax/equipment-file', 'InventoryController@equipmentFile');

	Route::get('/ajax/permits/{search_string}', 'AddressController@searchPermits');
	Route::post('/ajax/permit/', 'AddressController@addPermit');

	Route::get('/ajax/interfaces/', 'InventoryController@getInterfacesList');
	Route::get('/ajax/interfaces/{search_string}', 'InventoryController@getInterfacesList');
	Route::put('/ajax/interface', 'InventoryController@addInterface' );
	Route::post('/ajax/interface/{id}', 'InventoryController@editInterface' );
	Route::delete('/ajax/interface/{id}', 'InventoryController@deleteInterface' );

	Route::get('/ajax/building/{address_id}/buildingtab/list', 'AddressController@getBuildingTabList');
	Route::get('/ajax/building/{address_id}/buildingtab/list/{search_string}', 'AddressController@getBuildingTabList');
    Route::get('/ajax/building/{address_id}/buildingtab/systems', 'AddressController@getBuildingTabSystems');
	Route::get('/ajax/building/{address_id}/buildingtab/statuses', 'AddressController@getBuildingTabStatuses');
	Route::get('/ajax/building/{address_id}/buildingtab/contractors/{search_string}', 'AddressController@getBuildingTabContractors');

	Route::get('/ajax/building/{address_id}/configure-route/{route}', 'InventoryController@configureRouteOnBuild');
	Route::get('/ajax/configure-route/{route}', 'InventoryController@configureRoute');
});

Route::group(['middleware' => ['apisession'], 'prefix' => 'inventory', 'namespace' => 'Modules\Inventory\Http\Controllers'], function () {
	Route::get('/ajax/sessions/{search_string}', 'SessionController@getSessionList');
	Route::delete('/ajax/session/{ip}', 'SessionController@logoffSession');
});
