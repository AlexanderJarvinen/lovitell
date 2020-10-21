<?php

namespace Modules\Commercial\Models;

use \Log;
use \DB;
use Illuminate\Database\Eloquent\Model;

class CommercialSettings extends Model
{
	protected $table='commercial_user_settings';

	protected $default_columns = [
        'brand_descr' => [
			'label' => 'Бренд',
			'selected' => 1
		],
		'client_id' => [
			'label' => 'Номер заявки на подключение',
			'selected' => 1
		],
		'client_state_desk' => [
			'label' => 'Статус заявки',
			'selected' => 1
		],
		'service_kind_desk' => [
			'label' => 'Сервис',
			'selected' => 1
		],
		'ac_id' => [
			'label' => '№ дог.',
			'selected' => 1
        ],
		'address_type' => [
			'label' => 'Тип адреса',
			'selected' => 1
        ],
    	'city' => [
			'label' => 'Город',
			'selected' => 1
        ],
		'region' => [
			'label' => 'Район',
			'selected' => 1
        ],
		'street' => [
			'label' => 'Улица',
			'selected' => 1
        ],
		'house' => [
			'label' => 'Дом',
			'selected' => 1
        ],
		'body' => [
			'label' => 'Кор.',
			'selected' => 1
        ],
		'entrance' => [
			'label' => 'П.',
			'selected' => 1
        ],
		'floor' => [
			'label' => 'Эт.',
			'selected' => 1
        ],
		'apartment' => [
			'label' => 'Кв.',
			'selected' => 1
        ],
		'client' => [
			'label' => 'ФИО',
			'selected' => 1
        ],
		'phone' => [
			'label' => 'Телефон',
			'selected' => 1
        ],
		'mobile_no' => [
			'label' => 'Абонент',
			'selected' => 1
		],
		'state' => [
			'label' => 'Статус',
			'selected' => 1
		],
		'agreement' => [
			'label' => 'Мнемоника',
			'selected' => 1
		]
	];

	public function getClientsColumns() {
		$columns = $this->clients_table_columns;
		if (!$columns) {
			$columns = $this->default_columns;
		} else {
			$columns = json_decode($columns);
			foreach($columns as $k => $col) {
				$columns->{$k}->selected = $columns->{$k}->selected == false?0:1;
			}
		}
		return $columns;
	}

	public static function getByUid($uid) {
		if (intval($uid)) {
			$settings = CommercialSettings::where(['uid'=>$uid])->first();
			if (count($settings)==0) {
				$settings = CommercialSettings::whereNull('uid')->first();
			}
			return $settings;
		} else {
			Log::error('Can`t fetch settings for uid:'.$uid);
		}
	}
}
