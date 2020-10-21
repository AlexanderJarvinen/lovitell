<?php

namespace Modules\Inventory\Models;

use \Log;
use \DB;

class InventoryRights
{

	public function canChangeAddress() {
		try {
			DB::connection('sqlsrv')->select("exec bill..inventory_set_address 0");
			return true;
		} catch (\PDOException $e) {
			return false;
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

	public function canChangeSource() {
		try {
			DB::connection('sqlsrv')->select("exec bill..inventory_set_source 0");
			return true;
		} catch (\PDOException $e) {
			return false;
		}
	}

	public function canChangeDesk() {
		try {
			DB::connection('sqlsrv')->select("exec bill..inventory_set_desk 0");
			return true;
		} catch (\PDOException $e) {
			return false;
		}
	}

	public function canChangeSituation() {
		try {
			$r=DB::connection('sqlsrv')->select("exec bill..inventory_set_situation 0");
		} catch (\PDOException $e) {
			return false;
		}
		if(isset($r[0]->error) && $r[0]->error == 0) {
			return 1;
		} else {
			return 0;
		}
	}

	public function canChangeSystem() {
		try {
			$r=DB::connection('sqlsrv')->select("exec bill..inventory_set_system 0");
		} catch (\PDOException $e) {
			return false;
		}
		if(isset($r[0]->error) && $r[0]->error == 0) {
			return 1;
		} else {
			return 0;
		}
	}

	public function canChangeModel() {
		try {
			$r=DB::connection('sqlsrv')->select("exec inventory_set_model 0");
		} catch (\PDOException $e) {
			return false;
		}
		return (isset($r[0]->error) && $r[0]->error == 0);
	}

	public function canViewCoordinates() {
		try {
			$r = DB::connection('sqlsrv')->select("exec pss..addres_get_info_for_map 10");
		} catch (\PDOException $e) {
			return 0;
		}
		if(isset($r[0]->error) && $r[0]->error == 0) {
			return 1;
		} else {
			return 0;
		}
	}

	public function checkMenuItemPermissions($href) {
		$address = new AddressRights();
		$equipment = new EquipmentRights();
		switch($href) {
			case '/inventory/buildings':
				return $address->canViewBuildings();
			case '/inventory/streets':
				return $address->canViewStreets();
			case '/inventory/equipment':
				return $equipment->canViewEquipments();
			case '/inventory/coordinates':
				return $this->canViewCoordinates();
			case '/inventory/locations':
				return $this->canViewLocations();
			case '/inventory/services':
				return $this->canViewServices();
			case '/inventory/monitoring':
				return $this->canViewMonitoring();
			case '/inventory/vlans':
				return $this->canViewVlansList();
			case '/inventory/cadastral':
				return $address->canViewСadastral();
			case '/inventory/sessions':
				return $this->canViewSessions();
			case '/inventory/interfaces':
				return $this->canViewInterfaces();
			case '/inventory/capex':
				return $this->canViewCapex();
		}
	}

	public function canCheckNetwork() {
		try {
			$r = DB::connection('sqlsrv')->select("exec bill..route_setup_get 1");
		} catch (\PDOException $e) {
			return 0;
		}
		if(isset($r[0]->error) && $r[0]->error == 0) {
			return 1;
		} else {
			return 0;
		}
	}

	public function canTransmit() {
		try {
			$r = DB::connection('sqlsrv')->select("exec bill..inventory_transamit 0");
		} catch (\PDOException $e) {
			return 0;
		}
		if(isset($r[0]->error) && $r[0]->error == 0) {
			return 1;
		} else {
			return 0;
		}
	}

	public function canViewTemplates() {
		try {
			$r = DB::connection('sqlsrv')->select("exec bill..route_template_get 0");
		} catch (\PDOException $e) {
			return 0;
		}
		if(isset($r[0]->error) && $r[0]->error == 0) {
			return 1;
		} else {
			return 0;
		}
	}

	public function canSetTemplates() {
		try {
			$r = DB::connection('sqlsrv')->select("exec bill..route_template_set 0");
		} catch (\PDOException $e) {
			return 0;
		}
		if(isset($r[0]->error) && $r[0]->error == 0) {
			return 1;
		} else {
			return 0;
		}
	}

	public function canStartAPScan() {
		try {
			$r = DB::connection('sqlsrv')->select("exec bill..inventory_get_param_ap 0");
		} catch (\PDOException $e) {
			return 0;
		}
		if(isset($r[0]->error) && $r[0]->error == 0) {
			return 1;
		} else {
			return 0;
		}
	}
	public function canExploit() {
		try {
			$r=DB::connection('sqlsrv')->select("exec bill..inventory_set_situation_1 0");
		} catch (\PDOException $e) {
			return false;
		}
		if(isset($r[0]->error) && $r[0]->error == 0) {
			return 1;
		} else {
			return 0;
		}
	}

	public function canAcceptNCC() {
		try {
			$r=DB::connection('sqlsrv')->select("exec bill..inventory_set_situation_4 0");
		} catch (\PDOException $e) {
			return false;
		}
		if(isset($r[0]->error) && $r[0]->error == 0) {
			return 1;
		} else {
			return 0;
		}
	}

	public function canAcceptOD() {
		try {
			$r=DB::connection('sqlsrv')->select("exec bill..inventory_set_situation_5 0");
		} catch (\PDOException $e) {
			return false;
		}
		if(isset($r[0]->error) && $r[0]->error == 0) {
			return 1;
		} else {
			return 0;
		}
	}

	public function canViewAllJobs() {
		try {
			$r=DB::connection('sqlsrv')->select("exec bill..inventory_tasks_show 0");
		} catch (\PDOException $e) {
			return false;
		}
		if(isset($r[0]->error) && $r[0]->error == 0) {
			return 1;
		} else {
			return 0;
		}
	}

	public function canViewTemplateLog() {
		try {
			$r=DB::connection('sqlsrv')->select("exec bill..inventory_tasks_show 0");
		} catch (\PDOException $e) {
			return false;
		}
		if(isset($r[0]->error) && $r[0]->error == 0) {
			return 1;
		} else {
			return 0;
		}
	}

	public function canViewMap() {
		try {
			$r=DB::connection('sqlsrv')->select("exec pss..nagios_points 3");
		} catch (\PDOException $e) {
			return false;
		}
		if(isset($r[0]->error) && $r[0]->error == 0) {
			return 1;
		} else {
			return 0;
		}
	}

	public function canViewLocations() {
		try {
			$r=DB::connection('sqlsrv')->select("exec bill..inventory_get_locations 0");
		} catch (\PDOException $e) {
			return false;
		}
		return (isset($r[0]->error) && $r[0]->error == 0);
	}

	public function canGetLocations() {
		try {
			$r=DB::connection('sqlsrv')->select("exec bill..locations_get_list 0");
		} catch (\PDOException $e) {
			return false;
		}
		return (isset($r[0]->error) && $r[0]->error == 0);
	}

	public function canGetVlans() {
		try {
			$r=DB::connection('sqlsrv')->select("exec bill..locations_get_list 0");
		} catch (\PDOException $e) {
			return false;
		}
		return (isset($r[0]->error) && $r[0]->error == 0);
	}

	public function canGetModels() {
		try {
			$r=DB::connection('sqlsrv')->select("exec bill..route_model_get 0");
		} catch (\PDOException $e) {
			return false;
		}
		return (isset($r[0]->error) && $r[0]->error == 0);
	}

	public function canViewIpList() {
		try {
			$r=DB::connection('sqlsrv')->select("exec bill..inventory_get_ip 0");
		} catch (\PDOException $e) {
			return false;
		}
		return (isset($r[0]->error) && $r[0]->error == 0);
	}

	public function canViewServices() {
		try {
			$r=DB::connection('sqlsrv')->select("exec bill..isg_service_get 0");
		} catch (\PDOException $e) {
			return false;
		}
		return (isset($r[0]->error) && $r[0]->error == 0);
	}

    public function canModifyService() {
        try {
            $r=DB::connection('sqlsrv')->select("exec bill..isg_service_desk_modify 0");
        } catch (\PDOException $e) {
            return true;//false;
        }
        return (isset($r[0]->error) && $r[0]->error == 0);
    }

    public function canAddService() {
        try {
            $r=DB::connection('sqlsrv')->select("exec bill..isg_service_desk_new 0");
        } catch (\PDOException $e) {
            return true;//false;
        }
        return (isset($r[0]->error) && $r[0]->error == 0);
    }

	public function canModifyServiceOptions() {
		try {
			$r=DB::connection('sqlsrv')->select("exec bill..isg_service_option_set 0");
		} catch (\PDOException $e) {
			return true;//false;
		}
		return (isset($r[0]->error) && $r[0]->error == 0);
	}

	public function canViewNagiosData() {
		try {
			$r = DB::connection('sqlsrv')->select("exec bill..report_alert 3");
		} catch (\PDOException $e) {
			return false;
		}
		return (isset($r[0]->error) && $r[0]->error == 0);
	}

	public function canViewMonitoring() {
		try {
			$r = DB::connection('sqlsrv')->select("exec bill..inventory_monitor 0");
		} catch (\PDOException $e) {
			return false;
		}
		return (isset($r[0]->error) && $r[0]->error == 0);
	}

	public function canViewLogProgramTypes() {
		try {
			$r = DB::connection('sqlsrv')->select("exec bill..programm_type_log_desk_get 0");
		} catch (\PDOException $e) {
			return false;
		}
		return (isset($r[0]->error) && $r[0]->error == 0);
	}

	public function canAddLog() {
		try {
			$r = DB::connection('sqlsrv')->select("exec bill..programm_type_log_desk_set 0");
		} catch (\PDOException $e) {
			return false;
		}
		return (isset($r[0]->error) && $r[0]->error == 0);
	}

	public function canAddLocation() {
		try {
			$r = DB::connection('sqlsrv')->select("exec bill..inventory_location_create 0");
		} catch (\PDOException $e) {
			return false;
		}
		return (isset($r[0]->error) && $r[0]->error == 0);
	}

	public function canModifyLocation() {
		try {
			$r = DB::connection('sqlsrv')->select("exec bill..inventory_location_edit 0");
		} catch (\PDOException $e) {
			return false;
		}
		return (isset($r[0]->error) && $r[0]->error == 0);
	}

	public function canDeleteLocation() {
		try {
			$r = DB::connection('sqlsrv')->select("exec bill..inventory_location_delete 0");
		} catch (\PDOException $e) {
			return false;
		}
		return (isset($r[0]->error) && $r[0]->error == 0);
	}

	public function canViewVlansList() {
		try {
			$r = DB::connection('sqlsrv')->select("exec bill..inventory_get_vlans 0");
		} catch (\PDOException $e) {
			return false;
		}
		return (isset($r[0]->error) && $r[0]->error == 0);
	}

	public function canViewSessionsSupport() {
		try {
			$r = DB::connection('sqlsrv')->select("exec pss..brass_api_access2 0");
		} catch (\PDOException $e) {
			return false;
		}
		return (isset($r[0]->error) && $r[0]->error == 0);
	}

	public function canViewSessionsCall() {
		try {
			$r = DB::connection('sqlsrv')->select("exec pss..brass_api_access1 0");
		} catch (\PDOException $e) {
			return false;
		}
		return (isset($r[0]->error) && $r[0]->error == 0);
	}

	public function canLogoffSession() {
		return true;
		try {
			$r = DB::connection('sqlsrv')->select("exec pss..brass_api_access2 0");
		} catch (\PDOException $e) {
			return false;
		}
		return (isset($r[0]->error) && $r[0]->error == 0);
	}

	public function canViewSessions() {
		return $this->CanViewSessionsCall() || $this->CanViewSessionsSupport();
	}

	public function canViewInterfaces() {
		try {
			$r = DB::connection('sqlsrv')->select("exec bill..inventory_iface_nas_get 0");
		} catch (\PDOException $e) {
			return false;
		}
		return (isset($r[0]->error) && $r[0]->error == 0);
	}

	public function canAddInterface() {
		try {
			$r = DB::connection('sqlsrv')->select("exec bill..inventory_location_iface_nas_set 0");
		} catch (\PDOException $e) {
			return false;
		}
		return (isset($r[0]->error) && $r[0]->error == 0);
	}

	public function canModifyInterface() {
		try {
			$r = DB::connection('sqlsrv')->select("exec bill..inventory_location_iface_nas_edit 0");
		} catch (\PDOException $e) {
			return false;
		}
		return (isset($r[0]->error) && $r[0]->error == 0);
	}

	public function canDeleteInterface() {
		try {
			$r = DB::connection('sqlsrv')->select("exec bill..inventory_location_iface_nas_delete 0");
		} catch (\PDOException $e) {
			return false;
		}
		return (isset($r[0]->error) && $r[0]->error == 0);
	}
}
