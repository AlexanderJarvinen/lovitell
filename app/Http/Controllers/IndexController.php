<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Auth;
use App\Http\Requests;
use App\Components\Menu\Menu;
use App\Models\UserSettings;
use App\Report;
use Session;
use Log;

class IndexController extends Controller
{
    //
	public function __construct(Menu $menu)
	{
		$this->middleware('auth');
		parent::__construct($menu);
	}

	/**
	 * Display Home screen and main dashboard
	 *
	 * @param  Request  $request
	 * @return Response
	 */
	public function index(Request $request)
	{
		$data['title'] = 'Панель отчетов | Главная';
		$user = Auth::user();
		$data['user'] = $user;
		$data['menu'] = $this->menu;
		$data['pagename'] = 'dashboard';
		$user_settings = UserSettings::getByUid($user->id);
		$kit = $request->input('dashboard_kit', -1);
		if ($kit != -1 && $kit != $user_settings->dashboard_kit_id) {
			if ($user_settings->uid) {
				$user_settings->dashboard_kit_id=$kit;
				$user_settings->save();
			} else {
				$user_settings = new UserSettings();
				$user_settings->uid = $user->id;
				$user_settings->dashboard_kit_id = $kit;
				$user_settings->save();
			}
		}
		$data['kit_id'] = $user_settings->dashboard_kit_id;
		$data['controlbar_params'] = [
			'widgettabpane' =>
			[
				'dashboard_kit' => $data['kit_id']
			]
		];
		return view('index', $data);
	}
}
