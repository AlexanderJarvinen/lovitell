<?php

namespace Modules\Financial\Models;

use \Log;
use \DB;

class FinancialRights
{
	public function canPrintDocs()
	{
		try {
			$r = DB::connection('sqlsrv')->select("exec bill..print_docs 0, 0, 0");
		} catch (\PDOException $e) {
			return false;
		}
		if (isset($r[0]->error) && $r[0]->error == 0) {
			return 1;
		} else {
			return 0;
		}
	}

	public function checkMenuItemPermissions($href) {
		switch($href) {
			case '/financial/documents':
				return $this->canPrintDocs();
			case '/financial/capex':
				return $this->canViewCapex();

		}
	}

	public function canViewCapex() {
		try {
			$r = DB::connection('sqlsrv')->select("exec pss..capex_get 0");
		} catch (\PDOException $e) {
			return false;
		}
		return (isset($r[0]->error) && $r[0]->error == 0);
	}

	public function canAddCapex() {
		try {
			$r = DB::connection('sqlsrv')->select("exec pss..capex_set 0");
		} catch (\PDOException $e) {
			return false;
		}
		return (isset($r[0]->error) && $r[0]->error == 0);
	}

	public function canModifyCapex() {
		try {
			$r = DB::connection('sqlsrv')->select("exec pss..capex_edit 0");
		} catch (\PDOException $e) {
			return false;
		}
		return (isset($r[0]->error) && $r[0]->error == 0);
	}
}
