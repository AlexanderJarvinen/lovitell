<?php

namespace Modules\Reports\Models;

use App\Components\Helper;
use DB;
use Log;

class ReportRights
{
	public function checkMenuItemPermissions($href) {
		switch($href) {
			case '/reports/chart/proceeds':
				return $this->canViewProceeds();
			case '/reports/chart/active':
				return $this->canViewActive();
			case '/reports/chart/proceeds-groups':
				return $this->canViewProceedsGroups();
		}
	}

	public function canViewProceeds() {
		try {
			$r = DB::connection('sqlsrv')->select("exec bill..www_private6 5");
		} catch (\PDOException $e) {
			return 0;
		}
		if(isset($r[0]->error) && $r[0]->error == 0) {
			return 1;
		} else {
			return 0;
		}
	}

	public function canViewActive() {
		try {
			$r = DB::connection('sqlsrv')->select("exec bill..www_private3 5");
		} catch (\PDOException $e) {
			return 0;
		}
		if(isset($r[0]->error) && $r[0]->error == 0) {
			return 1;
		} else {
			return 0;
		}
	}

	public function canViewProceedsGroups() {
		try {
			$r = DB::connection('sqlsrv')->select("exec bill..dev1302 1");
		} catch (\PDOException $e) {
			return 0;
		}
		if(isset($r[0]->error) && $r[0]->error == 0) {
			return 1;
		} else {
			return 0;
		}
	}

	public function canViewArrears() {
		try {
			$r = DB::connection('sqlsrv')->select("exec bill..report_det_new 2");
		} catch (\PDOException $e) {
			return 0;
		}
		if(isset($r[0]->error) && $r[0]->error == 0) {
			return 1;
		} else {
			return 0;
		}
	}
}
