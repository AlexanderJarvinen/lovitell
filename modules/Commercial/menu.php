<?php

namespace Modules\Commercial;

use DB;
use Log;

class CommercialMenu {

    private $menu = [
        'group' => "КОММЕРЧЕСКИЙ",
        'order' => 1,
        'items' => [
            [
                'name' => "Клиенты",
                'href' => "/commercial/clients",
                'icon' => "fa fa-user",
                'submenu' => [
                    [
                        'name' => 'Поиск',
                        'href' => '/commercial/clients'
                    ],
                ]
            ],
        ],
    ];
	public function getMenu() {
        $menu = $this->menu;
        return $menu;
	}
}
