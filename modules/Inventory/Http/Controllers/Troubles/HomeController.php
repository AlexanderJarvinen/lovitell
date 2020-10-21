<?php

namespace Modules\Inventory\Http\Controllers\Troubles;

use Modules\Inventory\Models\Equipment;
use Modules\Inventory\Models\InventoryRights;
use Modules\Inventory\Models\EquipmentRights;

use Pingpong\Modules\Routing\Controller;
use Illuminate\Http\Request;
use App\Components\Menu\Menu;
use Auth;
use Log;

class HomeController extends Controller
{
	//
	public function __construct(Menu $menu)
	{
		$this->middleware('auth');
	}

	public function clientsSearch(Request $request)	{
		$model = new ClientsRights();
		if ($model->canSearchClients()) {
			return view('errors.403', [
				'user' => Auth::user(),
				'menu' => $this->menu
			]);
		};
		return response()->json($model->canChangeAddress());
	}

	public function clientPage(Request $request) {
		$model = new ClientsRights();
		if ($model->canViewClient()) {
			return view('errors.403', [
				'user' => Auth::user(),
				'menu' => $this->menu
			]);
		}
	}

}
