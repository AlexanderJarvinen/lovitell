<?php

namespace Modules\Documentation\Http\Controllers;

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

class InventoryController extends Controller {

	public $menu;

	public function __construct(Menu $menu)
	{
		$this->menu=$menu;
		$this->middleware('auth');
	}

	public function index()
	{
		return view('modules.documentation.inventory.index', [
				'title' => 'Помощь и поддержка',
				'user' => Auth::user()
			]
		);
	}

	public function Equipment()
	{
		return view('modules.documentation.inventory.equipment', [
			'title' => 'Модуль работы с оборудованием',
			'user' => Auth::user()
		]);
	}

	public function Monitoring()
	{
		return view('modules.documentation.inventory.monitoring', [
			'title' => 'Модуль мониторинга за оборудованием',
			'user' => Auth::user()
		]);
	}

}