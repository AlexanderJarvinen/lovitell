<?php

namespace Modules\Commercial\Http\Controllers;

use Illuminate\Support\Facades\Log;
use Modules\Commercial\Models\CommercialSettings;
use Pingpong\Modules\Routing\Controller;
use Illuminate\Http\Request;
use App\Components\Menu\Menu;
use Auth;
use DB;

class CommercialSettingsController extends Controller {

	public function __construct(Menu $menu)
	{
		$this->menu=$menu;
		$this->middleware('auth');
	}

	public function setClientsTableColumns(Request $request) {
		$columns = $request->input('columns', NULL);
		$user = Auth::user();
		$setting = CommercialSettings::getByUid($user->id);
		if (!$setting) {
			$setting = new CommercialSettings();
			$setting->uid = $user->id;
		}
		if ($columns) {
			foreach($columns as $k=>$col) {
				$columns[$k]['selected'] = $columns[$k]['selected'] != 0;
			}
			$setting->clients_table_columns = json_encode($columns);
			$setting->save();
		}
	}

}