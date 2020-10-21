<?php

namespace App\Components\Menu;

use App\Components\Menu\MenuItem;
use Illuminate\Support\Facades\Auth;
use Pingpong\Modules\Facades\Module;
use Log;

/**
 * Class make navigation menu,
 * considering modules permissions
 *
 */
class Menu
{
    /** @var array menu items. Format:
     *  [
     *      group=><group_name>
     *      items => [
     *          name
     *          href
     *          icon
     *          submenu => [
     *              name
     *              href
     *          ]
     *      ]
        ]*/
    public $menu_items = [];

    public function __construct() {
    }

    public static function cmp($a, $b) {
        if ($a['order'] == $b['order']) {
            return 0;
        }
        return ($a['order'] < $b['order']) ? -1 : 1;
    }


    /**
     * Add menu items to store
     *
     * @param array $menu_items
     */
    public function addMenu(array $menu_items) {
        $this->menu_items[$menu_items['group']]['items'] = [];
        $this->menu_items[$menu_items['group']]['order'] = $menu_items['order'];
        foreach($menu_items['items'] as $item) {
            $this->menu_items[$menu_items['group']]['items'][] = $item;
        }
    }

    /**
     * Make menu, considering search_string.
     *
     * @param string $search_string - search_string for search in menu items names
     * @return array - return $this->menu_items
     */
    public function init($search_string='') {
        $modules = Module::all();
        $user = Auth::user();
        $order = [];
        foreach($modules as $module) {
            if ($user->checkModulePermissions($module->getLowerName())) {
                $this->addMenu($module->getMenu(), $order);
    	    }
        }
        uasort($this->menu_items, ["App\\Components\\Menu\\Menu", "cmp"]);
        $menu_items = [];
        foreach($this->menu_items as $group_name=>$group_items) {
            $menu_items[$group_name] = $group_items['items'];
            $this->menu_items = $menu_items;
        }
        $menu_items = [];
        if ($search_string) {
            mb_internal_encoding("UTF-8");
            foreach($this->menu_items as $group_name=>$group_items) {
                if (mb_stripos($group_name, $search_string) !== false) {
                    $menu_items[$group_name] = $group_items['items'];
                } else {
                    foreach($group_items['items'] as $menu_item) {
                        if (mb_stripos($menu_item['name'], $search_string) !== false) {
                            $menu_items[$group_name][] = $menu_item;
                        } else if (isset($menu_item['submenu']) && is_array($menu_item['submenu'])) {
                            $menu_item_key = -1;
                            foreach($menu_item['submenu'] as $submenu_item) {
                                if(mb_stripos($submenu_item['name'], $search_string) !== false) {
                                    if ($menu_item_key == -1) {
                                        $menu_items[$group_name][] = [
                                            'name' => $menu_item['name'],
                                            'icon' => $menu_item['icon'],
                                            'href' => $menu_item['href'],
                                            'submenu' => []
                                        ];
                                        $menu_item_key = count($menu_items[$group_name]) - 1;
                                    }
                                    $menu_items[$group_name][$menu_item_key]['submenu'][] = $submenu_item;
                                }
                            }
                        }
                    }
                }
            }
            $this->menu_items=$menu_items;
        }
        return $this->menu_items;
    }

    /**
     * Rendering menu.
     *
     * TODO Move this to view.
     * @return string
     */
    public function render() {
        $modules = Module::all();
        $user = Auth::user();
        foreach($modules as $module) {
            if ($user->checkModulePermissions($module->getLowerName())) {
                $this->addMenu($module->getMenu());
	    }
        }
        $content = '<ul class="sidebar-menu">';
        foreach($this->menu_items as $group=>$items) {
            $content .= "<li class='header'>".$group."</li>";
            foreach($items as $item) {
                if (is_array($item['submenu'])) {
                    $content .= "<li class='treeview'><a href='#'>".$item['icon']."<span>".$item['name']."</span></a>";
                    $content .= "<ul class='treeview-menu'>";
                    foreach($item['submenu'] as $submenu_item) {
                        $content .= "<li><a href='" . $submenu_item['href'] . "'><i class=\"fa fa-circle-o\"></i>" . $submenu_item['name'] . "</a></li>";
                    }
                    $content .= "</ul></li>";
                } else {
                    $content .= "<li><a href='" . $item['href'] . "'><span>" . $item['name'] . "</span></a></li>";
                }
            }
        }
        $content .= '</ul>';
        return $content;
    }


}
