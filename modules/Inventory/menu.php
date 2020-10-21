<?php
namespace Modules\Inventory;

use Log;
use Modules\Inventory\Models\InventoryRights;

class InventoryMenu {
	private $menu = [
		'group' => "ТЕХНИЧЕСКИЙ",
		'order' => 2,
		'items' => [
			[
				'name' => "Inventory",
				'href' => "/inventory",
				'icon' => "fa fa-laptop",
				'submenu' => [
					[
						'name' => 'Дома',
						'href' => '/inventory/buildings'
					],
					[
						'name' => 'Улицы',
						'href' => '/inventory/streets'
					],
					[
						'name' => 'Оборудование',
						'href' => '/inventory/equipment'
					],
					[
						'name' => 'Координаты',
						'href' => '/inventory/coordinates'
					],
					[
						'name' => 'Локации',
						'href' => '/inventory/locations'
					],
					[
						'name' => 'Интерфейсы',
						'href' => '/inventory/interfaces'
					],
					[
						'name' => 'VLANs',
						'href' => '/inventory/vlans'
					],
					[
						'name' => 'ISG сервисы',
						'href' => '/inventory/services'
					],
					[
						'name' => 'Мониторинг',
						'href' => '/inventory/monitoring'
					],
					[
						'name' => 'Кадастр',
						'href' => '/inventory/cadastral'
					],
					[
						'name' => 'Сессии',
						'href' => '/inventory/sessions'
					]
				]
			],
		],
	];

	public function getMenu() {
		$menu = $this->menu;
		$model = new InventoryRights();
		$menu['items'][0]['submenu'] = [];
		foreach($this->menu['items'][0]['submenu'] as $item) {
			if ($model->checkMenuItemPermissions($item['href'])) {
				$menu['items'][0]['submenu'][] = $item;
			}
		}
		return $menu;
	}
}
