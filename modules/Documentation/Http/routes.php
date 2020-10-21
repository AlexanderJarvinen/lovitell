<?php

Route::group(['middleware' => 'web', 'prefix' => 'documentation', 'namespace' => 'Modules\Documentation\Http\Controllers'], function()
{
	Route::get('/', 'MainController@index');
	Route::get('/general/enter', 'MainController@Enter');
	Route::get('/general/user-settings', 'MainController@UserSettings');
	Route::get('/inventory/equipment', 'InventoryController@Equipment');
	Route::get('/inventory/monitoring', 'InventoryController@Monitoring');
});

