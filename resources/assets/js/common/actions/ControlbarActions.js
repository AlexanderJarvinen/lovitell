
var AppDispatcher = require('../dispatcher/AppDispatcher');
var ControlbarConstants = require('../constants/ControlbarConstants');
var DashboardConstants = require('../constants/DashboardConstants');

var ControlbarActions = {

    changeTab: function(active_tab) {
        AppDispatcher.dispatch({
            actionType: ControlbarConstants.TAB_CHANGE,
            active_tab: active_tab
        })
    }
};

module.exports = ControlbarActions;
