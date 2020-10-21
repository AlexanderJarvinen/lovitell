<?php

namespace Modules\Inventory\Http\Controllers\Troubles;

use Modules\Inventory\Models\Equipment;
use Modules\Inventory\Models\InventoryRights;
use Modules\Inventory\Models\EquipmentRights;

use Modules\Inventory\Models\Troubles;
use Pingpong\Modules\Routing\Controller;
use Illuminate\Http\Request;
use App\Components\Menu\Menu;
use Auth;
use Log;

/**
 * Trouble Ticket ajax controller
 */

class AjaxController extends Controller
{
	public function getTroubles(Request $request, $address_id, $type, $begin_date=null, $end_date=null) {
		$model = new Troubles();
		$troubles = $model->getTroublesByTypeForAddress($type, $address_id, $begin_date, $end_date);
		if ($troubles !== false) {
			return response()->json([
				'error'=>0,
				'data'=>$troubles
			]);
		} else {
			return response('', 403);
		}
	}

	public function getBuildTroubles(Request $request, $address_id, $begin_date=null, $end_date=null) {
		$model = new Troubles();
		$troubles = $model->getForAddress($address_id, $begin_date, $end_date);
		if ($troubles !== false) {
			return response()->json([
				'error'=>0,
				'data'=>$troubles
			]);
		} else {
			return response('', 403);
		}
	}

}
