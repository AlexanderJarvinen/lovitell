<?php

namespace App\Models;

use \Log;
use \DB;
use Illuminate\Database\Eloquent\Model;

class UserSettings extends Model
{
	protected $table='user_settings';

	public static function getByUid($uid) {
		if (intval($uid)) {
			$settings = self::where(['uid'=>$uid])->first();
			if (count($settings)==0) {
				$settings = self::whereNull('uid')->first();
			}
			return $settings;
		} else {
			Log::error('Can`t fetch settings for uid:'.$uid);
		}
	}
}
