<?php

namespace Modules\Inventory\Http\Controllers\Clients;

use Modules\Inventory\Models\ClientsRights;
use Modules\Inventory\Models\Clients;
use Excel;

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

	public function exportClients(Request $request, $address_id) {
		$right_model = new ClientsRights();
		if (!$right_model->canViewClients()) {
			return response('', 403);
		}
		$model = new Clients();
		$params = [
			'region_id' => $request->input('region_id', '0'),
			'type' => $request->input('type', -1),
			'address_id' => $address_id?$address_id:$request->input('address_id', 0),
			'street_id' => $request->input('street_id', 0),
			'apartment' => $request->input('apartment', ''),
			'ac_id' => $request->input('ac_id', 0),
			'company' => $request->input('company', ''),
			'start_date' => $request->input('start_date', ''),
			'end_date' => $request->input('end_date', ''),
			'client_id' => $request->input('client_id', 0),
			'order' => $request->input('order', 'id asc'),
			'is_comp' => $request->input('is_comp', '0')
		];
		$resp = $model->getClientsByParams($params);
		return Excel::create('revision', function($excel) use($resp) {
			$excel->sheet('Export', function($sheet) use($resp) {
				$sheet->fromArray($resp);
			});
		})->export('xlsx');
	}

}
