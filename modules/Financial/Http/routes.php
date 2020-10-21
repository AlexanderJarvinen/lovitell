<?php

Route::group(['middleware' => 'web', 'prefix' => 'financial', 'namespace' => 'Modules\Financial\Http\Controllers'], function()
{
	Route::get('/documents', 'DocumentController@index');
	Route::get('/documents/export/{type}/{ac_id}/{date}/{id}', 'DocumentController@printDocExport')->where('id', '(.*)');
	Route::get('/documents/{type}/{ac_id}/{date}/{id}', 'DocumentController@printDoc')->where('id', '(.*)');
	Route::get('/documents/job/{job_id}/export', 'DocumentController@exportJobDocs');
	Route::post('/documents/job/send', 'DocumentController@sendDocuments');
	Route::get('/documents/sorry', 'DocumentController@sorry');
	Route::get('/receipt/', 'DocumentController@receipt');

	Route::get('/capex', 'CapexController@Capex');
});

Route::group(['middleware' => 'apiauth', 'prefix' => 'financial', 'namespace' => 'Modules\Financial\Http\Controllers'], function()
{
	Route::post('/ajax/documents/get', 'DocumentController@getDocs');
	Route::get('/ajax/documents/jobs', 'DocumentController@getSendDocJobs');
	Route::get('/ajax/documents/job/{job_id}/log/{start_date}', 'DocumentController@getJobLog');

	Route::get('/ajax/checkrights/capex/add', 'FinancialRightsController@canAddCapex');
	Route::get('/ajax/checkrights/capex/modify', 'FinancialRightsController@canModifyCapex');

	Route::get('/ajax/capex-list', 'CapexController@getCapexList');
	Route::get('/ajax/capex-list/{searchString}', 'CapexController@getCapexList');
	Route::get('/ajax/capex/systems', 'CapexController@getSystems');
	Route::get('/ajax/capex/works', 'CapexController@getWorks');
	Route::put('/ajax/capex', 'CapexController@addCapex');
	Route::post('/ajax/capex/{capex_id}', 'CapexController@modifyCapex');
	Route::delete('/ajax/capex/{code}', 'CapexController@deleteCapex');

	Route::get('/ajax/address-info/{address_id}/{construction_type}', 'CapexController@getAddressInfoByConstructionType');

	Route::get('/ajax/acid/{ac_id}', 'CapexController@getContractorByAC');
});
