<?php

namespace Modules\Inventory\Http\Controllers;
use Modules\Inventory\Models\InventoryRights;

use Modules\Inventory\Models\Session;

use Pingpong\Modules\Routing\Controller;
use Illuminate\Http\Request;
use App\Components\Menu\Menu;
use Auth;
use Log;

class SessionController extends Controller
{
	public $menu;
	//
	public function __construct(Menu $menu)
	{
		$this->menu=$menu;
		$this->middleware('auth');
	}


	public function Sessions(Request $request)
	{
		$rights = new InventoryRights();
		if (!$rights->canViewSessions()) {
			return view('errors.403', [
				'user' => Auth::user(),
				'menu' => $this->menu
			]);
		}
		return view('modules.inventory.sessions', [
			'title' => 'Сессии абонентов',
			'user' => Auth::user(),
			'menu' => $this->menu,
		]);
	}

	public function getSessionList(Request $request, $search_string) {
		$rights = new InventoryRights();
		if (!$rights->canViewSessions()) {
			return response('403 Forbidden', 403);
		}
		$model = new Session();
		$result = $model->getSessions($search_string);
		Log::debug($result);
		return response()->json($result);
	}

	public function logoffSession(Request $request, $ip) {
		$rights = new InventoryRights();
		if (!$rights->canLogoffSession()) {
			return response('403 Forbidden', 403);
		}
		$model = new Session();
		return response()->json($model->logofSession($ip));
	}

}
