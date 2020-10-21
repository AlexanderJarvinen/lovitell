<?php

namespace Modules\Reports;

use DB;
use Log;
use Modules\Reports\Models\ReportRights;

class ReportsMenu {
	public function getMenu() {
		$r = DB::connection('sqlsrv')->select('exec pss..create_menu 0');
		$menu = [];
		$menu['group'] = "ОТЧЕТЫ";
		$items = [];
		foreach($r as $menu_item) {
			if ($menu_item->parent == 0) continue;
			if ($menu_item->parent == 1) {
				$submenu = [];
				foreach($r as $submenu_item) {
					if ($submenu_item->parent == $menu_item->id) {
						$cmd = json_decode(iconv('cp1251', 'utf8', $submenu_item->command));
						if (isset($cmd->cmd) && strripos($cmd->cmd, 'url=') !== false) {
							$submenu[] = [
								'name' => iconv('cp1251', 'utf8', $submenu_item->desk),
								'href' => substr($cmd->cmd, 4),
								'note' => iconv('cp1251', 'utf8', $submenu_item->note)
							];
						} else {
							$submenu[] = [
								'name' => iconv('cp1251', 'utf8', $submenu_item->desk),
								'href' => '/reports/' . $submenu_item->id,
								'note' => iconv('cp1251', 'utf8', $submenu_item->note)
							];
						}
					}
				}
				if (count($submenu)>0) {
					$items[] = [
						'icon' => "fa fa-pie-chart",
						'name' => iconv('cp1251', 'utf8', $menu_item->desk),
						'href' => '/reports/' . $menu_item->id,
						'submenu' => $submenu
					];
				} else{
					$items[] = [
						'icon' => "fa fa-pie-chart",
						'name' => iconv('cp1251', 'utf8', $menu_item->desk),
						'href' => '/reports/' . $menu_item->id
					];
				}

			}
		}
		$submenu = [];
		$rights_model = new ReportRights();

		if ($rights_model->canViewProceeds()) {
			$submenu[] = [
				'name' => 'График по выручке',
				'href' => '/reports/chart/proceeds',
				'note' => 'График по выручке c НДС'
			];
		}
		if ($rights_model->canViewActive()) {
			$submenu[] = [
				'name' => 'Активные абоненты',
				'href' => '/reports/chart/active',
				'note' => 'Активные абоненты'
			];
		}
		if ($rights_model->canViewProceedsGroups()) {
			$submenu[] = [
				'name' => 'Начисления по группам',
				'href' => '/reports/chart/proceeds-groups',
				'note' => 'Активные абоненты'
			];
		}
		if ($rights_model->canViewProceedsGroups()) {
			$submenu[] = [
				'name' => 'Начисления по группам КТВ, WiFI, ФЛ, Инфра',
				'href' => '/reports/chart/proceeds-groups2',
				'note' => 'Активные абоненты'
			];
		}
		/*if ($rights_model->canViewArrears()) {
			$submenu[] = [
				'name' => 'Динамика задолженности',
				'href' => '/reports/chart/arrears',
				'note' => 'Динамика дебиторской задолженности'
			];
		}*/

		if ($rights_model->canViewArrears()) {
			$submenu[] = [
				'name' => 'Задолженноть - Леальта',
				'href' => '/reports/chart/arrears-lealta',
				'note' => 'Динамика дебиторской задолженности по бренду Леальта'
			];
		}

		if ($rights_model->canViewArrears()) {
			$submenu[] = [
				'name' => 'Задолженноть - C2',
				'href' => '/reports/chart/arrears-c2',
				'note' => 'Динамика дебиторской задолженности по бренду C2'
			];
		}

		if ($rights_model->canViewArrears()) {
			$submenu[] = [
				'name' => 'Задолженноть - Lovit',
				'href' => '/reports/chart/arrears-lovit',
				'note' => 'Динамика дебиторской задолженности по бренду Lovit'
			];
		}

		if ($rights_model->canViewArrears()) {
			$submenu[] = [
				'name' => 'Задолженноть - Молния',
				'href' => '/reports/chart/arrears-molnia',
				'note' => 'Динамика дебиторской задолженности по бренду Молния'
			];
		}

		$items[] = [
			'icon' => "fa fa-pie-chart",
			'name' => "Графики",
			'href' => '',
			'submenu' => $submenu
		];
		$menu['items'] = $items;
		$menu['order'] = 4;
		return $menu;
	}
}

