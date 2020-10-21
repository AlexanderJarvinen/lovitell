<?php

namespace Modules\Inventory\Models;

use App\Components\Helper;
use \Log;
use \DB;
use Excel;

class Services
{
	public function getServicesList() {
		$services = [];
		try {
			$r = DB::connection('sqlsrv')->select("exec bill..isg_service_get 1");
			foreach($r as $service_row) {
				if (isset($services[$service_row->id])) {
					$services[$service_row->id]['options'][] = $service_row->attribute.' '.$service_row->op.' '.$service_row->value;
				} else {
					$services[$service_row->id] = [
						'service_id' => $service_row->id,
						'name' => Helper::cyr($service_row->name),
						'desc' => Helper::cyr($service_row->desk),
						'username' => Helper::cyr($service_row->username),
						'options' => $service_row->attribute?[$service_row->attribute.' '.$service_row->op.' '.$service_row->value]:[]
					];
				}
			}
		} catch(\PDOException $e) {
			Log::error('getServicesList EXCEPTION');
		}
		$resp=[];
		foreach($services as $service) {
			$resp[] = $service;
		}
		return $resp;
	}

	public function getServiceInfo($service_id) {
		$service = [];
		try {
			$r = DB::connection('sqlsrv')->select("exec bill..isg_service_get 1, ?", [$service_id]);
			if ($r) {
				foreach($r as $service_row) {
					if (count($service) == 0) {
						$service = [
							'service_id' => $service_row->id,
							'name' => Helper::cyr($service_row->name),
							'desc' => Helper::cyr($service_row->desk),
							'username' => Helper::cyr($service_row->username),
							'options' => []
						];
                        if ($service_row->option_rec_id) {
                            $service['options'][] = [
                                'option_id' => $service_row->option_rec_id,
								'option' => $service_row->attribute,
								'operator' => $service_row->op,
								'value' => $service_row->value,
                                'option_desk' => $service_row->attribute.' '.$service_row->op.' '.$service_row->value
                            ];
                        }
					} else {
                        $service['options'][] = [
                            'option_id' => $service_row->option_rec_id,
                            'option' => $service_row->attribute.$service_row->op.$service_row->value,
							'operator' => $service_row->op,
							'value' => $service_row->value,
							'option_desk' => $service_row->attribute.' '.$service_row->op.' '.$service_row->value
                        ];
					}
				}
                return $service;
			} else {
				return false;
			}
		} catch(\PDOException $e) {
			Log::error("getServiceInfo EXCEPTION. Id: $service_id");
		}
	}

	public function addService($name, $desc) {
		try {
			$r = DB::connection('sqlsrv')->select('exec bill..isg_service_desk_new 1,0, ?, ?', [Helper::cyr1251($name), Helper::cyr1251($desc)]);
			if (isset($r[0])) {
				if ($r[0]->error == 0) {
					return [
						'error'=>0,
						'msg'=>'OK'
					];
				} else {
					return [
						'error' => $r[0]->error,
						'msg' => $r[0]->msg
					];
				}
			} else {
				return [
					'error' => -1,
					'msg' => 'Unexpected error'
				];
			}
		} catch(\PDOException $e) {
			Log::error("addService EXCEPTION. Name: $name, Descr: $desc");
			return [
				'error' => -1,
				'msg' => 'Unexpected error'
			];
		}
	}

	public function modifyService($id, $name, $desc) {
		try {
			$r = DB::connection('sqlsrv')->select('exec bill..isg_service_desk_modify 1, ?, ?, ?', [$id, Helper::cyr1251($name), Helper::cyr1251($desc)]);
			if (isset($r[0])) {
				if ($r[0]->error == 0) {
					return [
						'error'=>0,
						'msg'=>'OK'
					];
				} else {
					return [
						'error' => $r[0]->error,
						'msg' => $r[0]->msg
					];
				}
			} else {
				return [
					'error' => -1,
					'msg' => 'Unexpected error'
				];
			}
		} catch(\PDOException $e) {
			Log::error("modifyService EXCEPTION. Id: $id Name: $name, Desc: $desc");
			return [
				'error' => -1,
				'msg' => 'Unexpected error'
			];
		}
	}

	public function addServiceOption($params) {
		if (strlen($params['option'])>64) {
			Log::error("modifyService ERROR. Param 'option' length > 64");
			return [
				'error' => -2,
				'msg' => 'Длина значения поля attribute должно быть меньше 64 символов'
			];
		}
		try {
			$r = DB::connection('sqlsrv')->select('exec bill..isg_service_option_set 1, :id, :option, :operator, :value', $params);
			Log::debug($r);
			if (isset($r[0])) {
				if ($r[0]->error == 0) {
					return [
						'error'=>0,
						'msg'=>'OK'
					];
				} else {
					return [
						'error' => $r[0]->error,
						'msg' => $r[0]->msg
					];
				}
			} else {
				return [
					'error' => -1,
					'msg' => 'Unexpected error'
				];
			}
		} catch(\PDOException $e) {
			Log::error("addOptionToService EXCEPTION. Params:");
			Log::error($e->getMessage());
			Log::error($params);
			return [
				'error' => -1,
				'msg' => 'Unexpected error'
			];
		}
	}

	public function modifyServiceOption($params) {
		if (strlen($params['option'])>64) {
			Log::error("modifyService ERROR. Param 'attribute' length > 64");
			return [
				'error' => -2,
				'msg' => 'Длина значения поля attribute должно быть меньше 64 символов'
			];
		}
		try {
			$r = DB::connection('sqlsrv')->select('exec bill..isg_service_option_set 2, :id, :option, :operator, :value, :option_id', $params);
			Log::debug($r);
			if (isset($r[0])) {
				if ($r[0]->error == 0) {
					return [
						'error'=>0,
						'msg'=>'OK'
					];
				} else {
					return [
						'error' => $r[0]->error,
						'msg' => $r[0]->msg
					];
				}
			} else {
				return [
					'error' => -1,
					'msg' => 'Unexpected error'
				];
			}
		} catch(\PDOException $e) {
			Log::error("modifyServiceOption EXCEPTION.");
			return [
				'error' => -1,
				'msg' => 'Unexpected error'
			];
		}
	}

	public function deleteServiceOption($id, $option_id) {
		try {
			$r = DB::connection('sqlsrv')->select("exec bill..isg_service_option_set 3, ?, '', '', '', ?", [$id, $option_id]);
			Log::debug($r);
			if (isset($r[0])) {
				if ($r[0]->error == 0) {
					return [
						'error'=>0,
						'msg'=>'OK'
					];
				} else {
					return [
						'error' => $r[0]->error,
						'msg' => $r[0]->msg
					];
				}
			} else {
				return [
					'error' => -1,
					'msg' => 'Unexpected error'
				];
			}
		} catch(\PDOException $e) {
			Log::error("deleteServiceOption EXCEPTION.");
			return [
				'error' => -1,
				'msg' => 'Unexpected error'
			];
		}
	}

}
