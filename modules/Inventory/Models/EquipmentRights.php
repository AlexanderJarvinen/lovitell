<?php

namespace Modules\Inventory\Models;

use \Log;
use \DB;

class EquipmentRights
{
	public function canViewEquipments() {
		try {
			$r = DB::connection('sqlsrv')->select("exec  bill..inventory_get_list_adm 0");
		} catch (\PDOException $e) {
			return 0;
		}
		if(isset($r[0]->error) && $r[0]->error == 0) {
			return 1;
		} else {
			return 0;
		}
	}

	public function canChangeIp() {
		try {
			$r = DB::connection('sqlsrv')->select("exec bill..inventory_set_ipa 0");
		} catch (\PDOException $e) {
			return 0;
		}
		if(isset($r[0]->error) && $r[0]->error == 0) {
			return 1;
		} else {
			return 0;
		}
	}

	public function canChangeMac($system=3) {
		try {
			$r=DB::connection('sqlsrv')->select("exec bill..change_mac 0, '', '', ?", [$system]);
		} catch (\PDOException $e) {
			return false;
		}
		if(isset($r[0]->error) && $r[0]->error == 0) {
			return 1;
		} else {
			return 0;
		}
	}

	public function canChangeAddress() {
		try {
			DB::connection('sqlsrv')->select("exec bill..inventory_set_address 0");
			return true;
		} catch (\PDOException $e) {
			return false;
		}
	}

	public function canChangeRoute() {
		try {
			$r=DB::connection('sqlsrv')->select("exec inventory_route_name_edit 0");
		} catch (\PDOException $e) {
			return true;//false;
		}
		if(isset($r[0]->error) && $r[0]->error == 0) {
			return 1;
		} else {
			return 0;
		}
	}

	public function canModifyRoute() {
		return $this->canChangeAddress() || $this->canChangeIp() || $this->canChangeMac() || $this->canChangeRouteName();
	}

	public function canAddRoute() {
		try {
			$r=DB::connection('sqlsrv')->select("bill..invenotory_route_create 0");
		} catch (\PDOException $e) {
			return false;
		}
		return (isset($r[0]->error) && $r[0]->error == 0);
	}


	public function canChangeRouteName() {
		try {
			$r = DB::connection('sqlsrv')->select("exec bill..inventory_set_route 0");
		} catch (\PDOException $e) {
			return false;
		}
		return (isset($r[0]->error) && $r[0]->error == 0);
	}

	public function canDeleteRoute() {
		try {
			$r = DB::connection('sqlsrv')->select("exec bill..inventory_route_delete 0");
		} catch (\PDOException $e) {
			return false;
		}
		return (isset($r[0]->error) && $r[0]->error == 0);
	}

	public function canChangeFirmware() {
		try {
			$r = DB::connection('sqlsrv')->select("exec bill..inventory_fw_set 0");
		} catch (\PDOException $e) {
			return false;
		}
		return (isset($r[0]->error) && $r[0]->error == 0);
	}

	public function canBatchDeleteAP() {
		try {
			$r = DB::connection('sqlsrv')->select("exec bill..inventory_delete_route_address 0");
		} catch (\PDOException $e) {
			return false;
		}
		return (isset($r[0]->error) && $r[0]->error == 0);
	}

	public function canResetRouteTemplate() {
		try {
			$r = DB::connection('sqlsrv')->select("exec bill..route_template_delete 0");
		} catch (\PDOException $e) {
			return false;
		}
		return (isset($r[0]->error) && $r[0]->error == 0);
	}
}
