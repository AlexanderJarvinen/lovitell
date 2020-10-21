var AppDispatcher = require('../../common/dispatcher/AppDispatcher');
var ReportConstants = require('../constants/ReportConstants');
var ReportActions = require('../actions/ReportActions');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');
var $ = require('jquery');
var React = require('react');

var CHANGE_EVENT = 'change';
var ROUTE_CHANGE_EVENT = 'route_change';

function checkboxSelect(id, e) {
    ReportActions.selectLine(id);
}

function columnRadioSelect(e) {
    ReportActions.selectColumn();
}

function fillColumns(fcolumns) {
    if (fcolumns.length > 0) {
        if (_chart_options.orientation) {
            _columns.push({
                property: 'selected',
                header: {
                    label: 'V'
                },
                cell: {
                    formatters: [
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
        fcolumns.forEach((e,i) =>
        {
            _columns.push({
                header: {
                    label: e,
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
                        return (
                            <div>
                                {radio}
                                <span>{name}</span>
                            </div>
                        )}
                    ]
                },
                cell: {
                    formatters: [
                        (v) => {
                            return(<span dangerouslySetInnerHTML={{__html:v}}></span>)
                        }
                    ]
                },
                property: 'col'+i
            })
        });
    }
}

function getTableData(report_id) {
    $.ajax({
        type: "GET",
        url: "/reports/"+report_id+"/table-data",
        success: function(a) {
            _rows = a.data;
            _report_options = a.options;
            fillColumns(a.columns);
            getChartData(report_id);
        }
    });
}

function getChartData(report_id) {
    var lines = getSelectedLines();
    $.ajax({
        type: "POST",
        url: "/reports/"+report_id+"/chart-data/",
        data: {
            lines: JSON.stringify(lines),
            columns: selected_column,
            type: _chart_options.type
        },
        success: function(a) {
            _chart_data = a.data;
            setChartOptions(a.options);
            ReportStore.emit(CHANGE_EVENT);
        }
    });
}

function setChartOptions(options) {
    for (var key in options) {
        _chart_options[key] = options[key];
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
    console.log(lines);
    return lines;
}

function selectLine(id) {
    console.log("Select line"+id);
    _rows[id].selected = _rows[id].selected==1?0:1;
    getChartData(_report_id);
}

function changeDtype(dtype) {
    _chart_options.type = dtype;
    getChartData(_report_id);
}

var _report_id = '';
var _rows = [];
var _lines = [];
var _chart_data = [];
var selected_column = null;
var _columns = [];
var _report_options = {
    orientation: 1
};
var _chart_options = {
    hline: 1,
    vline: 1,
    legend: true,
    ymax: 200,
    type: ReportConstants.D_TYPE_BARCHART
};

var ReportStore = assign({}, EventEmitter.prototype, {

    init: function(report_id) {
        console.log("init report_id:" + report_id);
        _report_id = report_id;
        getTableData(report_id);
    },

    getRows: function() {
        return _rows;
    },

    getColumns: function() {
        console.log(_columns);
        return _columns;
    },

    getChartData: function() {
        return _chart_data;
    },

    getChartOptions: function() {
        return _chart_options;
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
    }
});

// Register callback to handle all updates
AppDispatcher.register(function(action) {
    console.log(action);
    switch(action.actionType) {
        case ReportConstants.CHART_OPTIONS_CHANGE:
            setChartOptions(action.options);
            break;
        case ReportConstants.SELECT_LINE:
            selectLine(action.id);
            break;
        case ReportConstants.CHANGE_DTYPE:
            changeDtype(action.dtype);
            break;
        default:
        // no op
    }
});

module.exports = ReportStore;