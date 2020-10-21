<?php

namespace Modules\Inventory\Http\Controllers\Clients;

use Modules\Inventory\Models\ClientsRights;

use Pingpong\Modules\Routing\Controller;
use Illuminate\Http\Request;
use Modules\Inventory\Models\Clients;
use App\Components\Menu\Menu;
use Auth;
use Log;

class AjaxController extends Controller
{
	public function searchClients(Request $request, $address_id=0) {
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
		$clients = $model->getClientsByParams($params);
		if ($clients) {
			return response()->json(['error' => 0, 'data' => $clients]);
		} else {
			return response()->json(['error'=>1, 'date'=>[]]);
		}
	}
}
