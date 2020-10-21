var AppDispatcher = require('../../common/dispatcher/AppDispatcher');
var ReportConstants = require('../constants/ReportConstants');
var ReportActions = require('../actions/ReportActions');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');
var AppStore = require('../../common/stores/AppStore');

var $ = require('jquery');
var React = require('react');
var CHANGE_EVENT = 'change';
var FILTER_CHANGE_EVENT = 'filter_change';
var FILTER_CHANGE_EVENT2 = 'filter_change2';

import moment from 'moment';

function checkboxSelect(id, e) {
    ReportActions.selectLine(id);
}

function columnRadioSelect(e) {
    ReportActions.selectColumn();
}

var _columns = [];
var _rows = [];

function fillData(data) {
    let fcolumns = data.columns;
    if (fcolumns.length > 0) {
        _columns = [];
        if (_chart_options.orientation) {
            _columns.push({
                property: 'selected',
                header: {
                    label: 'V'
                },
                cell: {
                    formatters:[
                        function (selected, row) {
                            var id = row.rowData.id;
                            return (<input type="checkbox"
                                value={id}
                                onChange={checkboxSelect.bind(this, id)}
                                checked={row.rowData.selected}
                            />)
                        }
                    ]
                }
            });
        }
        let data_item=0;
        fcolumns.forEach((e,i) =>
        {
            if (typeof e.childrens != 'undefined') {
                let childrens = [];
                if (e.childrens .length > 0) {
                    for (let i in e.childrens) {
                        childrens.push({
                            header: {
                                label: e.childrens[i],
                            },
                            cell: {
                                formatters:[
                                    (v) => {
                                        return (<span dangerouslySetInnerHTML={{__html: v}}></span>)
                                    }
                                ]
                            },
                            property: 'col' + data_item++
                        });
                    }
                }
                _columns.push({
                    header: {
                        label: e.label
                    },
                    children: childrens
                })
            } else {
                _columns.push({
                    header: {
                        label: e.label,
                        formatters: [
                            (name) => {
                                let radio = '';
                                if (_chart_options.type == ReportConstants.D_TYPE_PIECHART) {
                                    radio = <input
                                        type="radio"
                                        onClick={(name)=> {
                                            columnRadioSelect(name)
                                        }}
                                        style={{width: '20px'}}
                                    />
                                }
                                return (<div>
                                {radio}
                                    <span>{name}</span>
                                </div>)
                            }
                        ]
                    },
                    cell: {
                        formatters:[
                            (v) => {
                                return(<span dangerouslySetInnerHTML={{__html:v}}></span>)
                            }
                        ]
                    },
                    property: 'col'+data_item++
                })
            }
        });
        _rows = data.data;
        AppStore.setLoading(false);
        ReportStore.emit(CHANGE_EVENT);
    }
}

function getTableData() {
    if (_report_id) {
        if (_state.table_data && _filter_values.isInit) {
            AppStore.setLoading(true);
            $.ajax({
                type: "POST",
                url: "/reports/" + _report_id + "/table-data",
                data: {
                    filters: JSON.stringify(_filter_values)
                },
                success: function (a) {
                    fillData(a);
                }
            });
        }
    }
}

function getChartData() {
    if (_report_id) {
        if (_state.chart_data && _filter_values.isInit) {
            var lines = getSelectedLines();
            $.ajax({
                type: "POST",
                url: "/reports/" + _report_id + "/chart-data/",
                data: {
                    lines: JSON.stringify(lines),
                    columns: selected_column,
                    type: _chart_options.type
                },
                success: function (a) {
                    _chart_data = a.data;
                    setChartOptions(a.options);
                    ReportStore.emit(CHANGE_EVENT);
                }
            });
        }
    }
}

function setChartOptions(options) {
    for (var key in options) {
        _chart_options[key] = options[key];
    }
    ReportStore.emit(CHANGE_EVENT);
}

function setOptions(options) {
    for (var key in options) {
        _options[key] = options[key];
    }
    ReportStore.emit(CHANGE_EVENT);
}

function getSelectedLines() {
    var lines = [];
    _rows.forEach(function(item, i){
        if (item.selected) {
            lines.push(item.id);
        }
    });
    return lines;
}

function selectLine(id) {
    _rows[id].selected = _rows[id].selected==1?0:1;
    getChartData(_report_id);
}

function changeDtype(dtype) {
    _chart_options.type = dtype;
    getChartData(_report_id);
}

var _report_id = '';

var _lines = [];
var _chart_data = [];
var selected_column = null;
var _options = {
    h_scrollbar: 0
};

var _state = {
    table_data: 0,
    chart_data: 0
};
var _report_params = {
    orientation: 1,
    filters: {}
};
var _filter_values = {
    date: moment().format('DD.MM.YYYY'),
    date_range: {
        start_date: moment().format('DD.MM.YYYY'),
        end_date: moment().format('DD.MM.YYYY')
    }
};

var _chart_options = {
    hline: 1,
    vline: 1,
    legend: true,
    ymax: 200,
    type: ReportConstants.D_TYPE_BARCHART
};
function parseParams(params) {
    _report_params = params;
}
function parseFilters(filters) {
    _report_params.filters = filters;
    let _filters = {};
    for(let i in filters) {
        switch (i) {
            case 'date_range':
                _filters.date_range = {
                    start_date: moment().format('DD.MM.YYYY'),
                    end_date: moment().format('DD.MM.YYYY')
                };
                break;
            case 'date':
                _filters.date = moment().format('DD.MM.YYYY');
                break;
            case 'text':
                _filters.text = '';
                break;
            case 'select':
                _filters.select = filters[i].data[0].value;
        }
    }
    _filters.isInit =  false;
    _filter_values = _filters;
    ReportStore.emit(FILTER_CHANGE_EVENT);
}

function checkParams() {
    _state = {
        table_data: 1,
        chart_data: 1
    };
    if (Object.keys(_report_params.filters).length >0) {
        for(let i in _report_params.filters) {
            let filter = _report_params.filters[i];
            switch(i) {
                case 'date_range':
                    if (filter.is_required) {
                        if (!checkDateRange()) {
                            _state = {
                                table_data: 0,
                                chart_data: 0
                            }
                        }

                    }
                    break;
                case 'date':
                    if (filter.is_required) {
                        if (!checkDate()) {
                            _state = {
                                table_data: 0,
                                chart_data: 0
                            }
                        }
                    }
            }
        }
    } else {
        _filter_values.isInit = true;
    }
}
function checkDateRange() {
    let res = false;
    if (_filter_values.date_range.start_date &&
        _filter_values.date_range.end_date) {
        res = true
    } else {
        res = false
    }
    return res;
}

function checkDate() {
    let res = false;
    if (_filter_values.date) {
        res = true
    } else {
        res = false
    }
    return res;
}

function setFilterValues(new_val) {
    for(let i in new_val) {
        _filter_values[i] = new_val[i];
    }
    ReportStore.emit(FILTER_CHANGE_EVENT2);
    checkParams();
}

function load(){
    _filter_values.isInit = true;
    ReportStore.emit(CHANGE_EVENT);
    getTableData();
    getChartData();
}

var ReportStore = assign({}, EventEmitter.prototype, {

    init: function(report_id, params, filters) {
        _report_id = report_id;
        parseParams(params);
        parseFilters(filters)
        checkParams();
        getTableData();
        getChartData();
    },

    getRows: function() {
        return _rows;
    },

    getColumns: function() {
        return _columns;
    },

    getScrollBar: function() {
        return _options.h_scrollbar || 0;
    },

    getChartData: function() {
        return _chart_data;
    },

    getChartOptions: function() {
        return _chart_options;
    },

    getExportLink: function() {
        return '/reports/' + _report_id + '/export?filters=' + JSON.stringify(_filter_values);
        if (_rows.length>0) {
            return '/reports/' + _report_id + '/export?filters=' + JSON.stringify(_filter_values);
        } else {
            return '';
        }
    },

    getFilters: function() {
        return _report_params.filters;
    },

    getFiltersValue: function() {
        return _filter_values;
    },

    /**
     * @param {function} callback
     */
    addChangeListener: function(callback) {
        this.on(CHANGE_EVENT, callback);
    },
    /**
     * @param {function} callback
     */
    removeChangeListener: function(callback) {
        this.removeListener(CHANGE_EVENT, callback);
    },

    /**
     * @param {function} callback
     */
    addFilterChangeListener: function(callback) {
        this.on(FILTER_CHANGE_EVENT, callback);
    },

    /**
     * @param {function} callback
     */
    removeFilterChangeListener: function(callback) {
        this.removeListener(FILTER_CHANGE_EVENT, callback);
    },

    /**
     * @param {function} callback
     */
    addFilterChangeListener2: function(callback) {
        this.on(FILTER_CHANGE_EVENT2, callback);
    },

    /**
     * @param {function} callback
     */
    removeFilterChangeListener2: function(callback) {
        this.removeListener(FILTER_CHANGE_EVENT2, callback);
    }
});

// Register callback to handle all updates
AppDispatcher.register(function(action) {
    switch(action.actionType) {
        case ReportConstants.FILTERS_CHANGE:
            setFilterValues(action.filter_values);
            break;
        case ReportConstants.CHART_OPTIONS_CHANGE:
            setChartOptions(action.options);
            break;
        case ReportConstants.SELECT_LINE:
            selectLine(action.id);
            break;
        case ReportConstants.CHANGE_DTYPE:
            changeDtype(action.dtype);
            break;
        case ReportConstants.OPTIONS_SET:
            setOptions(action.options);
            break;
        case ReportConstants.START_LOAD:
            load();
            break;
        default:
        // no op
    }
});

module.exports = ReportStore;