<?php

namespace Modules\Reports\Models\Widgets;

use Log;
use Modules\Reports\Models\Report;

class Chart {
    //$params = $id, date, graph_chart,

    public function init($id, $data_params, $chart_type, $chart_params) {

    }

    public function initLineChart($id, $chart_params) {
        $model = new Report($id);
        $data = $model->getLinechartData($chart_params['lines']);
        return
    }

    public function initBarChart {}
} 