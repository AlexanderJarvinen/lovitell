<?php

Route::group(['middleware' => 'web', 'prefix' => 'reports', 'namespace' => 'Modules\Reports\Http\Controllers'], function()
{
	Route::get('/', 'ReportsController@index');
//	Route::get('/{name}', 'ReportsController@showReport');
	Route::get('/{id}', 'ReportsController@showReport2');
	Route::get('/{id}/export', 'ReportsController@exportReport');
	//Route::get('/chart/{id}', 'ReportsController@chartReport');
	Route::get('/chart/{name}', 'ReportsController@showChart');
});

Route::group(['middleware' => 'apiauth', 'prefix' => 'reports', 'namespace' => 'Modules\Reports\Http\Controllers'], function()
{
	Route::any('/{id}/table-data', 'ReportsController@tableReport');
	Route::any('/{id}/chart-data', 'ReportsController@chartReport');

	Route::any('/graph/wifitotal', 'ReportsGraphController@getGraphWifiTotal');

	Route::any('/graph/proceeds', 'ReportsGraphController@getGraphProceeds');
	Route::any('/graph/active', 'ReportsGraphController@getGraphActive');
	Route::any('/graph/proceeds-groups', 'ReportsGraphController@getGraphProceedsGroups');
	Route::any('/graph/proceeds-groups2', 'ReportsGraphController@getGraphProceedsGroups2');
	Route::any('/graph/arrears', 'ReportsGraphController@getGraphArrears');
	Route::any('/graph/arrears-lealta', 'ReportsGraphController@getGraphArrearsLealta');
	Route::any('/graph/arrears-c2', 'ReportsGraphController@getGraphArrearsC2');
	Route::any('/graph/arrears-lovit', 'ReportsGraphController@getGraphArrearsLovit');
	Route::any('/graph/arrears-molnia', 'ReportsGraphController@getGraphArrearsMolnia');

	Route::get('/settings/scrollbar/{scrollbar}', 'ReportsController@changeHScrollbar');
});