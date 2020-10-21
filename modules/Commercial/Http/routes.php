<?php

Route::group(['middleware' => 'web', 'prefix' => 'commercial', 'namespace' => 'Modules\Commercial\Http\Controllers'], function()
{
    Route::get('/clients/', 'ClientController@main');
    Route::get('/client/{client_id}', 'ClientController@clientPage');
});

Route::group(['middleware' => 'apiauth', 'prefix' => 'commercial', 'namespace' => 'Modules\Commercial\Http\Controllers'], function()
{
    Route::get('/ajax/client/{client_id}', 'ClientController@getClientInfo');
    Route::any('/ajax/clients/get', 'ClientController@getClients');

    Route::post('/ajax/settings/clients-table-columns/', 'CommercialSettingsController@setClientsTableColumns');
});
