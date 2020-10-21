
var AppDispatcher = require('../dispatcher/AppDispatcher');
var AppConstants = require('../constants/AppConstants');

var AppActions = {
    /**
     * @param  {string} search_text
     */
    initLoading: function() {
        AppDispatcher.dispatch({
            actionType: AppConstants.INIT_LOADING
        });
    },

    cancelLoading: function() {
        AppDispatcher.dispatch({
            actionType: AppConstants.CANCEL_LOADING
        });
    },

    initError: function(error) {
        AppDispatcher.dispatch({
            actionType: AppConstants.INIT_ERROR,
            error: error
        })
    },

    flushError: function() {
        AppDispatcher.dispatch({
            actionType: AppConstants.FLUSH_ERROR
        })
    }

};

module.exports = AppActions;
