<?php

namespace App\Models;

use DB;
use Log;
use Illuminate\Database\Eloquent\Model;

/**
 * Model class for table {{user_widgets}}
 *
 * @parameter
 * @parameter
 *
 * @parent
 * @package App\Models
 */
class Widget extends Model
{
    protected $table = 'user_widgets';
    protected $gallery_table = 'widget_gallery';
    public $uid = null;

    /**
     * @param null $uid
     * @return mixed
     */
    public function  getWidgets($uid=null, $dashboard_id=null, $kit_id=0) {
        $uid = intval($uid);
        $widgets = [];
        if ($uid != 0) {
            $widgets = Widget::where(['uid' => $uid])->where('dashboard_id', $dashboard_id)->orderBy('order', 'asc')->get();
        } elseif($this->uid != null) {
            $widgets = Widget::where(['uid' => $this->uid])->where('dashboard_id', $dashboard_id)->orderBy('order', 'asc')->get();
        }
        if (count($widgets)==0) {
            $widgets = Widget::whereNull('uid')->
            where('dashboard_id', $dashboard_id)->
            where('dashboard_kit_id', $kit_id)->
            orderBy('order', 'asc')->
            get();
        }
        $resp = [];
        foreach ($widgets as $key=>$widget) {
            if ($this->checkWidgetPermissions($widget->permission_request)) {
                $view = view(['template' => $widget['content']]);
                $widget['content'] = $view->render();
                $resp[] = $widget;
            }
        }
        return $resp;
    }

    public function checkWidgetPermissions($request) {
        if (trim($request) != '') {
            try {
                $r = DB::connection('sqlsrv')->select("exec " . $request);
            } catch (\PDOException $e) {
                return false;
            }
            return isset($r[0]->error) && $r[0]->error == 0;
        } else {
            return true;
        }
    }

    /**
     * Batch deleted selected widgets
     * @param $delete_list - widget ids list
     */

    public function deleteList($delete_list) {
        foreach($delete_list as $delete) {
            DB::table($this->table)->where(['id'=>$delete])->delete();
        }
    }

    /**
     * Update params for list of widgets
     * @param $widgets
     */
    public function updateList($widgets) {
        foreach($widgets as $key=>$widget) {
            if (isset($widget['id'])) {
                DB::table($this->table)
                    ->where(['id' => $widget['id']])
                    ->update(['order' => $key,
                        'collapse' => filter_var ($widget['collapse'], FILTER_VALIDATE_BOOLEAN),
                        'width' => $widget['width'],
                        'height' => $widget['height']
                    ]);
            }
        }
    }

    public function forUser($uid) {
        $uid = intval($uid);
        if ($uid>0) {
            $this->uid = $uid;
        }
    }

    /**
     * Remove and update widgets for current User
     *
     * @param $widget_storage - array, that contain list of deleted
     * widgets ($widget_storage['deleted']) and widgets list form param updating.
     */
    public function saveAll($widget_storage, $uid)
    { //TODO сделать транзакцию'
        if (isset($widget_storage['deleted'])) {
            $this->deleteList($widget_storage['deleted']);
        }
        $this->updateList($widget_storage['widgets']);
    }

    /**
     * Return widgets for user, which can be added to dashboard.
     * @return array
     */
    public function getWidgetGallery($dashboard_id=0) {
        return DB::table($this->gallery_table)->where(['uid'=>$this->uid])->orWhereNull('uid')->get();
    }

}
