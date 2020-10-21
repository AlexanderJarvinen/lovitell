<?php

namespace Modules\Commercial\Http\Controllers;

use Illuminate\Support\Facades\Log;
use Modules\Commercial\Models\Client;
use Modules\Commercial\Models\CommercialSettings;
use Pingpong\Modules\Routing\Controller;
use Illuminate\Http\Request;
use App\Components\Menu\Menu;
use Auth;
use DB;

class ClientController extends Controller {

	public $menu;

	public function __construct(Menu $menu)
	{
		$this->menu=$menu;
		$this->middleware('auth');
	}

	public function main(Request $request) {
		$user = Auth::user();
		$settings_model = CommercialSettings::getByUid($user->id);
		if (!$settings_model) {
			$settings_model = new CommercialSettings();
		}
        return view('modules.commercial.clients', [
                'user' => Auth::user(),
                'menu' => $this->menu,
                'title'=> 'Поиск клиентов',
                'pagename' => 'clients',
				'columns' => $settings_model->getClientsColumns(),
				'controlbar_params' => ['clients' =>
					[]
				]
            ]
        );
	}

	public function clientPage(Request $request, $client_id)
	{
		return view('modules.commercial.client', [
				'user' => Auth::user(),
				'menu' => $this->menu,
				'title'=> 'Карточка клиента',
				'pagename' => 'clients',
				'client_id' => $client_id
			]
		);
	}

    public function getClients(Request $request) {
		$mobile_no = $request->input('mobile_no', NULL);
		$phone = $request->input('phone', NULL);
		$ac_id = $request->input('ac_id', NULL);
		$company = $request->input('company', NULL);
		$client_id = $request->input('client_id', NULL);
		$city = $request->input('city', NULL);
		$region = $request->input('region', NULL);
		$street = $request->input('street', NULL);
		$build = $request->input('build', NULL);
		$apartment = $request->input('apartment', NULL);
		$params = [
			'mobile_no' => $mobile_no?$mobile_no:NULL,
			'phone' => $phone?$phone:NULL,
			'ac_id' => $ac_id?$ac_id:NULL,
			'company' => $company?$company:NULL,
			'client_id' => $client_id?$client_id:NULL,
			'city' => $city!=''?$city:NULL,
			'region' => $region!=''?$region:NULL,
			'street' => $street!=''?$street:NULL,
			'build' => $build!=''?$build:NULL,
			'apartment' => $apartment?$apartment:NULL
		];
		$page = $request->input('page', 1);
		$line_on_page = $request->input('on_page', 9999);
		Log::debug($params);
		$clients = Client::searchClients($page, $line_on_page, $params);
		return response()->json($clients);
    }

	public function getClientInfo(Request $request, $client_id) {
		$model = new Client($client_id);
		$model->init();
		return response()->json(['error'=>0, 'data'=>$model]);
	}
}