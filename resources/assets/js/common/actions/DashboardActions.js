
var AppDispatcher = require('../dispatcher/AppDispatcher');
var DashboardConstants = require('../constants/DashboardConstants');

var DashboardActions = {

    delete_widget: function() {
        AppDispatcher.dispatch({
            actionType: DashboardConstants.WIDGET_DELETE
        });
    },

    addWidget: function(id) {
        console.log("Dispatch addWidget");
        AppDispatcher.dispatch({
            actionType: DashboardConstants.WIDGET_ADD,
            id: id
        });
    }

};

module.exports = DashboardActions;
