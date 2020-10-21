<?php

namespace Modules\Inventory\Models;

use \Log;
use \DB;

class AddressRights
{
	public function newStreetRights() {
		try {
			$r = DB::connection('sqlsrv')->select("exec pss..new_street 0");
		} catch (\PDOException $e) {
			return 1;
		}
		if(isset($r[0]->error) && $r[0]->error == 0) {
			return 1;
		} else {
			return 1;
		}
	}

	public function newBuildRights() {
		try {
			$r = DB::connection('sqlsrv')->select("exec pss..new_house 1");
		} catch (\PDOException $e) {
			return 0;
		}
		if(isset($r[0]->error) && $r[0]->error == 0) {
			return 1;
		} else {
			return 0;
		}
	}

	public function modifyBuildRights()
	{
		try {
			$r = DB::connection('sqlsrv')->select("exec pss..set_home_desk 1");
		} catch (\PDOException $e) {
			return false;
		}
		if(isset($r[0]->error) && $r[0]->error == 0) {
			return 1;
		} else {
			return 0;
		}
	}

	public function modifyStreetRights() {
		try {
			$r = DB::connection('sqlsrv')->select("exec pss..street_city_edit 0");
		} catch (\PDOException $e) {
			return 0;
		}
		if(isset($r[0]->error) && $r[0]->error == 0) {
			return 1;
		} else {
			return 0;
		}
	}

	public function checkStatusSetRights()
	{
		try {
			$r = DB::connection('sqlsrv')->select("exec pss..set_address_state");
		} catch (\PDOException $e) {
			return false;
		}
		if(isset($r[0]->error) && $r[0]->error == 0) {
			return 1;
		} else {
			return 0;
		}
	}

	public function checkClientsViewRights() {
		try {
			$r = DB::connection('sqlsrv')->select("exec pss..get_address_client_list 2");
		} catch (\PDOException $e) {
			return 0;
		}
		if(isset($r[0]->error) && $r[0]->error == 0) {
			return 1;
		} else {
			return 0;
		}
	}

	public function checkOrdersViewRights() {
		try {
			$r = DB::connection('sqlsrv')->select("exec pss..get_order_list 0,0,2");
		} catch (\PDOException $e) {
			return 0;
		}
		if(isset($r[0]->error) && $r[0]->error == 0) {
			return 1;
		} else {
			return 0;
		}
	}

	public function checkKeysViewRights() {
		try {
			$r = DB::connection('sqlsrv')->select("exec pss..get_address_addon 2");
		} catch (\PDOException $e) {
			return 0;
		}
		if(isset($r[0]->error) && $r[0]->error == 0) {
			return 1;
		} else {
			return 0;
		}
	}

	public function checkTroublesViewRights() {
		try {
			$r = DB::connection('sqlsrv')->select("exec pss..view_troubles_itm 2");
		} catch (\PDOException $e) {
			return 0;
		}
		if(isset($r[0]->error) && $r[0]->error == 0) {
			return 1;
		} else {
			return 0;
		}
	}

	public function checkConfigViewRights() {
		try {
			$r = DB::connection('sqlsrv')->select("pss..addres_get_desk 0");
		} catch (\PDOException $e) {
			return 0;
		}
		if(isset($r[0]->error) && $r[0]->error == 0) {
			return 1;
		} else {
			return 0;
		}
	}

	public function checkEntrancesViewPermissions() {
		try {
			$r = DB::connection('sqlsrv')->select("exec pss..addres_get_entrance 0");
		} catch (\PDOException $e) {
			return 0;
		}
		if(isset($r[0]->error) && $r[0]->error == 0) {
			return 1;
		} else {
			return 0;
		}
	}

	public function checkEquipmentsViewPermissions() {
		try {
			$r = DB::connection('sqlsrv')->select("exec bill..inventory_get_list 0");
		} catch (\PDOException $e) {
			return 0;
		}
		if(isset($r[0]->error) && $r[0]->error == 0) {
			return 1;
		} else {
			return 0;
		}
	}

	public function checkCompanyPermissions() {
		try {
			$r = DB::connection('sqlsrv')->select("exec pss..address_company_new 0");
		} catch (\PDOException $e) {
			return 0;
		}
		if(isset($r[0]->error) && $r[0]->error == 0) {
			return 1;
		} else {
			return 0;
		}
	}

	public function checkServicesPermissions() {
		try {
			$r = DB::connection('sqlsrv')->select("exec pss..address_service_new 0");
		} catch (\PDOException $e) {
			return 0;
		}
		if(isset($r[0]->error) && $r[0]->error == 0) {
			return 1;
		} else {
			return 0;
		}
	}

	public function getBuildingScreenRights() {
		$inventory_model = new InventoryRights();
        $equipment_model = new EquipmentRights();
		$rights = [];
		$rights['modify_building_rights'] = $this->modifyBuildRights();
		$rights['new_street'] = $this->newStreetRights();
		$rights['status_rights'] = $this->checkStatusSetRights();
		$rights['companies_change'] = $this->checkCompanyPermissions();
		$rights['services_change'] = $this->checkServicesPermissions();
		$rights['tab_config'] = $this->checkConfigViewRights();
		$rights['tab_entrances'] = $this->checkEntrancesViewPermissions();
		$rights['tab_equipments'] = $this->checkEquipmentsViewPermissions();
		$rights['check_network_rights'] = $inventory_model->canCheckNetwork();
		$rights['can_accept_ncc'] = $inventory_model->canAcceptNCC();
		$rights['can_accept_od'] = $inventory_model->canAcceptOD();
		$rights['can_exploit'] = $inventory_model->canExploit();
		$rights['can_transmit'] = $inventory_model->canTransmit();
		$rights['can_changemac'] = $inventory_model->canChangeMac();
		$rights['can_changetemplate'] = $inventory_model->canSetTemplates() || $equipment_model->canResetRouteTemplate();
		$rights['can_startapscan'] = $inventory_model->canStartAPScan();
		$rights['tab_clients'] = $this->checkClientsViewRights();
		$rights['tab_orders'] = $this->checkOrdersViewRights();
		$rights['tab_keys'] = $this->checkKeysViewRights();
		$rights['tab_troubles'] = $this->checkTroublesViewRights();
		$rights['tab_services'] = $this->checkConfigViewRights();
		$rights['tab_files'] = $this->checkFilesListRights();
		$rights['tab_building'] = $this->canBuildingTabList();
		$rights['can_addfile'] = $this->checkFilesAddRights();
		$rights['can_viewfiles'] = $this->checkFilesListRights();
		$rights['can_addresschange'] = $this->canChangeAddress();
		$rights['can_batchdelete'] = $equipment_model->canBatchDeleteAP();
		$rights['can_addequipment'] = $equipment_model->canAddRoute();
		$rights['can_edit_entrances'] = $this->canEditEntrances();
		return $rights;
	}

	public function getBuildingScreenAsBool() {
		return $this->checkClientsViewRights() ||
			$this->checkOrdersViewRights() ||
			$this->checkKeysViewRights() ||
			$this->checkTroublesViewRights() ||
			$this->checkConfigViewRights() ||
			$this->checkEntrancesViewPermissions() ||
			$this->checkEquipmentsViewPermissions();
	}

	public function canViewBuildings() {
		try {
			$r = DB::connection('sqlsrv')->select("exec pss..get_home_list 2");
		} catch (\PDOException $e) {
			return 0;
		}
		if(isset($r[0]->error) && $r[0]->error == 0) {
			return 1;
		} else {
			return 0;
		}
	}

	public function canViewInventory() {
		try {
			$r = DB::connection('sqlsrv')->select("exec pss..addres_get_info 10");
		} catch (\PDOException $e) {
			return 0;
		}
		if(isset($r[0]->error) && $r[0]->error == 0) {
			return 1;
		} else {
			return 0;
		}
	}


	public function canViewStreets() {
		try {
			$r=DB::connection('sqlsrv')->select("exec pss..street_city_list_get 0");
		} catch (\PDOException $e) {
			return false;
		}
		return (isset($r[0]->error) && $r[0]->error == 0);
	}

	public function checkFilesAddRights() {
		try {
			$r=DB::connection('sqlsrv')->select("exec bill..inventory_documentation_get 0");
		} catch (\PDOException $e) {
			return false;
		}
		return (isset($r[0]->error) && $r[0]->error == 0);
	}

	public function checkFilesListRights() {
		try {
			$r=DB::connection('sqlsrv')->select("exec bill..inventory_documentation_get 0");
		} catch (\PDOException $e) {
			return false;
		}
		return (isset($r[0]->error) && $r[0]->error == 0);
	}

	public function canChangeAddress() {
		try {
			$r=DB::connection('sqlsrv')->select("exec pss..address_construction_type_change 0");
		} catch (\PDOException $e) {
			return false;
		}
		return (isset($r[0]->error) && $r[0]->error == 0);
	}


	public function canViewСadastral()
	{
		try {
			$r = DB::connection('sqlsrv')->select("exec pss..cadastral_number_get 0");
		} catch (\PDOException $e) {
			return false;
		}
		return (isset($r[0]->error) && $r[0]->error == 0);
	}

	public function canAddСadastral()
	{
		try {
			$r = DB::connection('sqlsrv')->select("exec pss..cadastral_number_set 0");
		} catch (\PDOException $e) {
			return false;
		}
		return (isset($r[0]->error) && $r[0]->error == 0);
	}

	public function canModifyСadastral()
	{
		try {
			$r = DB::connection('sqlsrv')->select("exec pss..cadastral_number_set 0");
		} catch (\PDOException $e) {
			return false;
		}
		return (isset($r[0]->error) && $r[0]->error == 0);
	}

	public function canViewPermit() {
		try {
			$r = DB::connection('sqlsrv')->select("exec pss..permit_get 0");
		} catch (\PDOException $e) {
			return false;
		}
		return (isset($r[0]->error) && $r[0]->error == 0);
	}

	public function canViewBuildCreator() {
		try {
			$r = DB::connection('sqlsrv')->select("exec pss..address_list_creator_get 0");
		} catch (\PDOException $e) {
			return false;
		}
		return (isset($r[0]->error) && $r[0]->error == 0);
	}

	public function canEditEntrances() {
		try {
			$r = DB::connection('sqlsrv')->select("exec pss..addres_floor_set 0");
		} catch(\PDOException $e) {
			return false;
		}
		return (isset($r[0]->error) && $r[0]->error == 0);
	}

	public function canBuildingTabList() {
		try {
			$r = DB::connection('sqlsrv')->select("exec pss..addres_floor_set 0");
		} catch(\PDOException $e) {
			return false;
		}
		return (isset($r[0]->error) && $r[0]->error == 0);
	}

	public function canBuildingTabAdd() {
		try {
			$r = DB::connection('sqlsrv')->select("exec pss..addres_floor_set 0");
		} catch(\PDOException $e) {
			return false;
		}
		return (isset($r[0]->error) && $r[0]->error == 0);
	}
}
