<?php

namespace Modules\Inventory\Models;

use App\Components\Helper;
use \Log;
use \DB;

class ClientsRights
{
	function canViewClients() {
		try {
			$r = DB::connection('sqlsrv')->select("exec get_address_client_list 2");
		} catch (\PDOException $e) {
			return false;
		}
		return (isset($r[0]->error) && $r[0]->error == 0);
	}
}
