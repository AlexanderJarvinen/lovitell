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

class MainController extends Controller {

	public $menu;

	public function __construct(Menu $menu)
	{
		$this->menu=$menu;
		$this->middleware('auth');
	}

	public function index()
	{
		return view('modules.documentation.index', [
				'title' => 'Помощь и поддержка',
				'user' => Auth::user()
			]
		);
	}

	public function Enter()
	{
		return view('modules.documentation.general.enter', [
			'title' => 'Регистрация и вход',
			'user' => Auth::user()
		]);
	}

	public function UserSettings()
	{
		return view('modules.documentation.general.user-settings', [
			'title' => 'Настройка пользователя',
			'user' => Auth::user()
		]);
	}

}