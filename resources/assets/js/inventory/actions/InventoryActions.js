
var AppDispatcher = require('../../common/dispatcher/AppDispatcher');
var InventoryConstants = require('../constants/InventoryConstants');

var InventoryActions = {
    filterReset: function() {
        AppDispatcher.dispatch({
            actionType: InventoryConstants.FILTER_RESET
        })
    },
    filterChange: function(filter, need_update) {
        AppDispatcher.dispatch({
            actionType: InventoryConstants.FILTER_CHANGE,
            filter: filter,
            need_update
        })
    },
    search: function() {
        AppDispatcher.dispatch({
            actionType: InventoryConstants.SEARCH,
        });
    },
    pageChange: function(page) {
        AppDispatcher.dispatch({
            actionType: InventoryConstants.PAGE_CHANGE,
            page: page
        })
    },
    setParams: function(params) {
        AppDispatcher.dispatch({
            actionType: InventoryConstants.PARAMS_CHANGE,
            params: params
        });
    }
};

module.exports = InventoryActions;
