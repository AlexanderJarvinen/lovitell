<?php

namespace Modules\Financial\Http\Controllers;

use App\Components\Helper;
use Illuminate\Support\Facades\Log;
use Modules\Financial\Models\FinancialRights;
use Pingpong\Modules\Routing\Controller;
use Illuminate\Http\Request;
use Modules\Financial\Models\Document;
use Modules\Financial\Models\SendDocJobModel;
use Modules\Financial\Jobs\SendDocJob;
use App\Components\Menu\Menu;
use Auth;
use Excel;
use PDF;
use DB;
use Config;
use Mail;

class FinancialRightsController extends Controller {

	public $menu;

	public function __construct(Menu $menu)
	{
		$this->menu=$menu;
		$this->middleware('auth');
	}

	public function canAddCapex(Request $request) {
		$model = new FinancialRights();
		return response()->json($model->canAddCapex());
	}

	public function canModifyCapex(Request $request) {
		$model = new FinancialRights();
		return response()->json($model->canModifyCapex());
	}
}