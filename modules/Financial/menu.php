<?php

namespace Modules\Financial;

use DB;
use Log;
use Modules\Financial\Models\FinancialRights;

class FinancialMenu {
    private $menu = [
        'group' => "ФИНАНСОВЫЙ",
        'order' => 3,
        'items' => [
            [
                'name' => "Документы",
                'href' => "/financial",
                'icon' => "fa fa-file-text-o",
                'submenu' => [
                    [
                        'name' => 'Отправка',
                        'href' => '/financial/documents'
                    ],
                ]
            ],
            [
                'name' => "Учет",
                'href' => "/financial",
                'icon' => "fa fa-file-text-o",
                'submenu' => [
                    [
                        'name' => 'CAPEX',
                        'href' => '/financial/capex'
                    ],
                ]
            ],
        ],
    ];
	public function getMenu() {
        $menu = $this->menu;
        $model = new FinancialRights();
        $menu['items'][0]['submenu'] = [];
        foreach($this->menu['items'][0]['submenu'] as $item) {
            if ($model->checkMenuItemPermissions($item['href'])) {
                $menu['items'][0]['submenu'][] = $item;
            }
        }
        return $menu;
	}
}
