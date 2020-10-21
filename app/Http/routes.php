<?php

/*
|--------------------------------------------------------------------------
| Routes File
|--------------------------------------------------------------------------
|
| Here is where you will register all of the routes in an application.
| It's a breeze. Simply tell Laravel the URIs it should respond to
| and give it the controller to call when that URI is requested.
|
*/

Route::get('/', 'HomeController@index');

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| This route group applies the "web" middleware group to every route
| it contains. The "web" middleware group is defined in your HTTP
| kernel and includes session state, CSRF protection, and more.
|
*/


Route::group(['middleware' => ['web']], function () {
    //Routes for IndexController
    Route::get('/', 'IndexController@index');

    //Routes for FileController
    Route::get('/file/{href}', 'FileController@getFile');
    Route::post('/file/{type}/{id}', 'FileController@putFileForObject');
    Route::delete('/file/{href}', 'FileController@deleteFile');
    Route::get('/file-list/{type}/{id}', 'FileController@getFileList');

    //Routes for Profile/UserSettingsController
    Route::get('/profile/user-settings', 'Profile\UserSettingsController@index');
    Route::post('/profile/user-settings/save-name', 'Profile\UserSettingsController@saveName');
    Route::post('/profile/user-settings/db-pass', 'Profile\UserSettingsController@setDbPassword');
    Route::delete('/profile/user-settings/avatar', 'Profile\UserSettingsController@deleteAvatar');
    Route::post('/profile/user-settings/avatar', 'Profile\UserSettingsController@uploadAvatar');

    //Auth Routes
    Route::auth();
});



Route::group(['middleware' => ['apiauth']], function () {
    //Routes for AjaxController
    Route::post('/ajax/get-menu', 'AjaxController@getMenu');
    Route::get('/ajax/widgets/{dashboard_id}/{kit_id}', 'AjaxController@getWidgets');
    Route::post('/ajax/widgets/{dashboard_id}/save', 'AjaxController@saveAllWidgets');
    Route::post('/ajax/widgets/{dashboard_id}', 'AjaxController@addWidget');
    Route::get('/ajax/widget-gallery/{dashboard_id}', 'AjaxController@getWidgetGallery');

    Route::get('/ajax/brands', 'AjaxController@getBrands');
});

