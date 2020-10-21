<?php

namespace App\Http\Controllers;

use App\Models\Brand;
use App\Models\Widget;
use Illuminate\Http\Request;
use Auth;
use App\Http\Requests;
use App\Components\Menu\Menu;
use App\Report;
use Illuminate\Support\Facades\Log;

class AjaxController extends Controller
{
	public function __construct(Menu $menu)
	{
		parent::__construct($menu);
		$this->middleware('auth');
	}

	/**
	 * Return menu items
     * @type AJAX
	 *
	 * @param  Request  $request
     * @param search_string string contain's
     * in GET request
     *
     * TODO Make menu controller. Move this function to menu controller
	 * @return Response JSON
	 */
	public function getMenu(Request $request)
	{
		$search_string = $request->input('search_string', '');
		$menu_items = $this->menu->init($search_string);

		return response()->json($menu_items);
	}

    /**
     * Get widget's list for current user
     *
     * TODO create WidgetController. Move this function there.
     * @type AJAX
     * @param Request $request
	 * @param int $dashboard_id
     * @return mixed JSON
     */
	public function getWidgets(Request $request, $dashboard_id=0, $kit_id=0)
	{
		$user = Auth::user();
		$model = new Widget();
		$widgets = $model->getWidgets($user->id, $dashboard_id, $kit_id);
		return response()->json($widgets);
	}

    /**
     * Save currents state of user dashboard
     * @param array widgets. Contains in POST data
 	 * @param int $dashboard_id
     * TODO create Widget Controller. Move this function there
     * @param Request $request
     */
	public function saveAllWidgets(Request $request, $dashboard_id) {
		$new_widgets = $request->input('widgets');
		$user = Auth::user();
		$widget = new Widget();
		$widget->saveAll($new_widgets, $user->id);
	}

    /**
     * Add new widget to dashboard of the current user
     *
     * TODO create WidgetController. Move this function there.
     * Add returned value.
     * @param object widget - new widget. Contains in POST data
  	 * @param int $dashboard_id
     * @param Request $request
     */
	public function addWidget(Request $request, $dashboard_id=0)  {
		$w = $request->input('widget');
		$user = Auth::user();
		$widget = new Widget();
		$widget->dashboard_id = $dashboard_id;
		$widget->offset = $w['offset'];
		$widget->width = $w['width'];
		$widget->height = $w['height'];
		$widget->collapse = $w['collapse'];
		$widget->uid = $user->id;
		$widget->name = $w['name'];
		$widget->title = $w['title'];
		$widget->content = $w['content'];
		$widget->save();
	}

    /**
     * Get widgets, that user can add to dashboard
     * @type AJAX
     *
     * TODO create widgetController. Move this function there
     * @param Request $request
	 * @param int $dashboard_id
     * @return mixed JSON
     */
	public function getWidgetGallery(Request $request, $dashboard_id=0) {
		$user = Auth::user();
		$model = new Widget();
		$model->forUser($user->id);
		$widgets = $model->getWidgetGallery();
		return response()->json($widgets);
	}

	/**
	 * Get brands list
	 * @type AJAX
	 *
	 * @param $request Request
	 */

	public function getBrands(Request $request) {
		return response()->json([
			'data' => Brand::getBrands(),
			'error' => 0
		]);
	}
}
