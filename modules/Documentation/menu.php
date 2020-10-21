<?php

namespace Modules\Documentation;

use DB;
use Log;

class DocumentationMenu {
    private $menu = [
        'group' => "Помощь и поддержка",
        'order' => 5,
        'items' => [
            [
                'name' => "Основное",
                'href' => "/documentation",
                'icon' => "fa fa-question-circle-o",
                'submenu' => [
                    [
                        'name' => 'Регистрация и вход',
                        'href' => '/documentation/general/enter'
                    ],
                    [
                        'name' => 'Настройка пользователя',
                        'href' => '/documentation/general/user-settings'
                    ]
                ]
            ],
            [
                'name' => "Inventory",
                'href' => "/documentation/inventory",
                'icon' => "fa fa-question-circle-o",
                'submenu' => [
                    [
                        'name' => 'Оборудование',
                        'href' => '/documentation/inventory/equipment'
                    ],
                    [
                        'name' => 'Мониторинг',
                        'href' => '/documentation/inventory/monitoring'
                    ]
                ]
            ],
            [
                'name' => "Отчеты",
                'href' => "/documentation/reports",
                'icon' => "fa fa-question-circle-o",
                'submenu' => [
                    [
                        'name' => 'Оборудование',
                        'href' => '/documentation/inventory/equipment'
                    ],
                    [
                        'name' => 'Мониторинг',
                        'href' => '/documentation/inventory/monitoring'
                    ]
                ]
            ]
        ],
    ];
	public function getMenu() {
        $menu = $this->menu;
        return $menu;
	}
}
