<?php

namespace App\Http\Controllers\Profile;

use App\Equipment;
use App\User;
use Illuminate\Http\Request;

use App\Http\Controllers\Controller;
use App\Http\Requests;
use App\Address;
use Auth;
use Log;
use Hash;
use Illuminate\Support\Facades\Crypt;
use Input;
use Image;
use \App\Components\Menu\Menu;

class UserSettingsController extends Controller
{
	//
	public function __construct(Menu $menu)
	{
		parent::__construct($menu);
		$this->middleware('auth');
	}

	/**
	 * Display Summary User Settings
	 *
	 * @param  Request  $request
	 * @return Response
	 */
	public function index(Request $request)	{
		$user = Auth::user();
		return view('profile.user_settings', [
					'user' => $user,
					'title' => 'Настройки пользователя',
					'menu' => $this->menu
		]);
	}

	public function saveName(Request $request) {
		$user = Auth::user();
		$user->fullname = $request->input('name');
		$user->email = $request->input('email');
		if ($user->save()) {
			$resp['error'] = 0;
			$resp['msg'] = "Данные успешно сохранены";
		} else {
			$resp['error'] = 1;
			$resp['msg'] = "При сохранении произошла ошибка";
		}
		return response()->json($resp);
	}

	public function dbSaveModal(Request $request) {
		$title = "Подтверждение";
		$content =  "Для сохранения введите пароль от вашей учетной записи:<br>".
							"<input type='text' name='my_password'>";
		$buttons = [
			['name' => 'Закрыть', 'action' => 'close'],
			['name' => 'Сохранить', 'action' => 'custom', 'id'=>'save_db_password']
		];
		return view('modals.default', [
			'title' => $title,
			'content' => $content,
			'buttons' => $buttons
		]);
	}

	public function uploadAvatar(Request $request) {
		if ($request->file()) {
			$image = $request->file('avatar');
			$user = Auth::user();
			$filename = $user->name . '.' . strtolower($image->getClientOriginalExtension());
			$path = config('filesystems.upload_path.image') . '/avatar';
			//Image::make($image->getRealPath())->resize(200, 200)->save($path);
			$image->move($path, $filename);
			$user->avatar = $path."/".$filename;
			$user->save();
		}
	}

	public function deleteAvatar(Request $request) {
		$user = Auth::User();
		if ($user->deleteAvatar()) {
			$resp['error'] = 0;
			$resp['msg'] = "Аватар удален";
		} else {
			$resp['error'] = 1;
			$resp['msg'] = "При удалении аватара произошла ошибка";
		}
		return response()->json($resp);
	}

	public function setDbPassword(Request $request) {
		$db_login = $request->input('dbLogin');
		$db_password = $request->input('dbPass');
		$master_password = $request->input('masterPass');
		$user = Auth::user();
		if ($user->checkPassword($master_password)) {
			$user->db_password=$db_password;
			$user->db_login=$db_login;
			if ($user->initDbConnection() == 1) {
				if ($user->save()) {
					$resp['error'] = 0;
					$resp['msg'] = "Пароль для базы данных сохранен";
				} else {
					$resp['error'] = 1;
					$resp['msg'] = "При сохранении пароля произошла ошибка";
				}
			} else {
				$resp['error'] = 2;
				$resp['msg'] = "Не удается установить соединение с БД с введенным паролем";
			}
		} else {
			$resp['error'] = 3;
			$resp['msg'] = "Мастер пароль не верен";
		}
		return response()->json($resp);
	}

	public function getEquipments(Request $request, $range)	{
		$model = new Address($request->user()->getBillingConnection());
		$equipment_list  = $model->getEquipments($range);
		if (count($equipment_list) == 0) {
			$equipment_list = [
				"sEcho" => 1,
				"iTotalRecords" => "0",
				"iTotalDisplayRecords" => "0",
				"aaData" => []
			];
		}
		return response()->json($equipment_list);
	}

	public function searchEquipment(Request $request)
	{
		$search_params  = [
			'name' => $request->input('name'),
			'ip' => $request->input('ip'),
			'mac' => $request->input('mac'),
			'switch' => $request->input('switch'),
			'port' => $request->input('port'),
			'street' => $request->input('street'),
		];
		$equipment_list = [];
		$model = new Equipment($request->user()->getBillingConnection());
		$eq = false;
		foreach($search_params as $key=>$param) {
			if ($param != '' && $key != 'street') {
				$eq=true;
				break;
			}
		}
		if ($eq) {
			$equipment_list = $model->searchEquipment($search_params);
		} elseif ($search_params['street'] != '') {
			$equipment_list = $model->searchEquipmentByStreet($search_params['street']);
		}
		if (count($equipment_list) == 0) {
			$equipment_list = [
				"sEcho" => 1,
				"iTotalRecords" => "0",
				"iTotalDisplayRecords" => "0",
				"aaData" => []
			];
		}
		return response()->json($equipment_list);
	}

	public function getView(Request $request, $route) {
		$model = new Equipment($request->user()->getBillingConnection());
		$equipment = $model->getRouteInfo($route);
		return view('equipment.view', $equipment);
	}

	public function setMac(Request $request) {
		$model = new Equipment($request->user()->getBillingConnection());
		$resp = $model->setMac($request->input('route'), $request->input('mac'));
		return response()->json($resp);
	}


}
