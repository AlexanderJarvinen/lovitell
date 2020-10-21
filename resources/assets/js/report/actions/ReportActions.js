
var AppDispatcher = require('../../common/dispatcher/AppDispatcher');
var ReportConstants = require('../constants/ReportConstants');

var ReportActions = {
    changeFilter: function(filter_values) {
        console.log("Dispatch changeFilter");
        AppDispatcher.dispatch({
            actionType: ReportConstants.FILTERS_CHANGE,
            filter_values: filter_values
        });
    },
    setChartOptions: function(options) {
        console.log("Dispatch setChartOptions");
        AppDispatcher.dispatch({
            actionType: ReportConstants.CHART_OPTIONS_CHANGE,
            options: options
        });
    },
    selectLine: function(id) {
        console.log("Dispatch selectLine");
        AppDispatcher.dispatch({
            actionType: ReportConstants.SELECT_LINE,
            id: id
        });
    },

    changeDtype: function(dtype) {
        console.log("Dispatch change dtype");
        AppDispatcher.dispatch({
            actionType: ReportConstants.CHANGE_DTYPE,
            dtype: dtype
        });
    },
    setOptions: function(options) {
        console.log("Dispatch setChartOptions");
        AppDispatcher.dispatch({
            actionType: ReportConstants.OPTIONS_SET,
            options: options
        });
    },
    load: function() {
        console.log("Dispatch load");
        AppDispatcher.dispatch({
            actionType: ReportConstants.START_LOAD
        });
    }
};

module.exports = ReportActions;
