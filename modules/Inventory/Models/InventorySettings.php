<?php

namespace Modules\Inventory\Models;

use \Log;
use \DB;
use Illuminate\Database\Eloquent\Model;

class InventorySettings extends Model
{
	protected $table='inventory_user_settings';
	protected $default_columns = [
		'selected' => [
			'label' => 'Чекбоксы',
			'selected' => 1
		],
		'route' => [
			'label' => 'Name',
			'selected' => 1
		],
		'brands_descr' => [
			'label' => 'Бренд',
			'selected' => 1
		],
		'system_desk' => [
			'label' => 'Тип',
			'selected' => 1
		],
		'ip_addr' => [
			'label' => 'IP',
			'selected' => 1
		],
		'mac' => [
			'label' => 'MAC',
			'selected' => 1
		],
		'model_desk' => [
			'label' => 'Модель',
			'selected' => 1,
		],
		'source' => [
			'label' => 'Родитель',
			'selected' => 1,
		],
		'location_desk' => [
			'label' => 'Локация',
			'selected' => 1,
		],
		'source_iface' => [
			'label' => 'Порт',
			'selected' => 1,
		],
		'target_iface' => [
			'label' => 'UPLINK',
			'selected' => 1
		],
		'state_desk' => [
			'label' => 'Статус',
			'selected' => 1
		],
		'situation_desk' => [
			'label' => 'Состояние',
			'selected' => 1,
		],
		'template_id' => [
			'label' => 'Шаблон',
			'selected' => 1
		],
		'city_desk' => [
			'label' => 'Город',
			'selected' => 1
		],
		'region_desk' => [
			'label' => 'Район',
			'selected' => 1
		],
		'street_desk' => [
			'label' => 'Улица',
			'selected' => 1
		],
		'build' => [
			'label' => 'Дом',
			'selected' => 1
		],
		'entrance' => [
			'label' => 'Подъезд',
			'selected' => 1
		],
		'floor' => [
			'label' => 'Этаж',
			'selected' => 1
		],
		'apartment' => [
			'label' => 'Квартира',
			'selected' => 1
		],
		'desk' => [
			'label' => 'Описание',
			'selected' => 1
		],
		'addition' => [
			'label' => 'Дополнение',
			'selected' => 1
		],
		'last_tech' => [
			'label' => 'Дата',
			'selected' => 1
		],
		'wait_time' => [
			'label' => 'Время простоя',
			'selected' => 1
		],

	];

	protected $default_filters = [
		'address' => [
			'label' => 'Адрес',
			'favorites' => 1
		],
		'system' => [
			'label' => 'Тип',
			'favorites' => 1
		],
		'state' => [
			'label' => 'Статус',
			'favorites' => 1
		],
		'situation' => [
			'label' => 'Ситуация',
			'favorites' => 1
		],
		'source' => [
			'label' => 'Родитель',
			'favorites' => 1
		],
		'ip_addr' => [
			'label' => 'IP',
			'favorites' => 1
		],
		'mac' => [
			'label' => 'MAC',
			'favorites' => 1
		],
		'model' => [
			'label' => 'Модель',
			'favorites' => 1
		],
		'name' => [
			'label' => 'Имя',
			'favorites' => 1
		],
		'location' => [
			'label' => 'Локация',
			'favorites' => 1
		],
		'descr' => [
			'label' => 'Описание',
			'favorites' => 1
		],
	];

	public function getInventoryFilters() {
		$filters = $this->equipment_filters;
		if (!$filters) {
			$filters = $this->default_filters;
		} else {
			$filters = json_decode($filters);
			foreach($filters as $k => $col) {
				$filters->{$k}->favorites = $filters->{$k}->favorites == false?0:1;
			}
		}
		return $filters;
	}

	public function getMonitoringFilters() {
		$filters = $this->monitoring_filters;
		if (!$filters) {
			$filters = $this->default_filters;
		} else {
			$filters = json_decode($filters);
			foreach($filters as $k => $col) {
				$filters->{$k}->favorites = $filters->{$k}->favorites == false?0:1;
			}
		}
		return $filters;
	}

	public function getInventoryColumns() {
		$columns = $this->equipment_table_columns;
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

	public function getMonitoringColumns() {
		$columns = $this->monitoring_table_columns;
		if (!$columns) {
			$columns = $this->default_columns;
			$columns['wifi'] = [
				'label' => 'Активно (WiFi)',
				'selected' => 1
			];
			$columns['local'] = [
				'label' => 'Активно (Кабель)',
				'selected' => 1
			];
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
			$settings = InventorySettings::where(['uid'=>$uid])->first();
			if (count($settings)==0) {
				$def_settings = InventorySettings::whereNull('uid')->first();
				$settings = $def_settings->replicate();
				$settings->uid = $uid;
			}
			return $settings;
		} else {
			Log::error('Can`t fetch settings for uid:'.$uid);
		}
	}
}
