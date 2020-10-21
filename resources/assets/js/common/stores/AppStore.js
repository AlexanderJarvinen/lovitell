var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var AppConstants = require('../constants/AppConstants');
var assign = require('object-assign');
const CHANGE_EVENT='change';

var app_state = {
    loading: false,
    error: {
        code: 0,
        msg: ''
    }
};

var AppStore = assign({}, EventEmitter.prototype, {

    setLoading: function(loading) {
        app_state.loading = loading;
        AppStore.emit(CHANGE_EVENT);
    },
    getLoading: function() {
        return app_state.loading;
    },
    setError: function(error) {
        app_state.error=error;
        AppStore.emit(CHANGE_EVENT);
    },
    getError: function() {
        return app_state.error;
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
        case AppConstants.INIT_LOADING:
            AppStore.setLoading(true);
            break;
        case AppConstants.CANCEL_LOADING:
            AppStore.setLoading(false);
            break;
        case AppConstants.INIT_ERROR:
            AppStore.setError(action.error);
            break;
        case AppConstants.FLUSH_ERROR:
            AppStore.setError({code:0, msg: ''});
            break;
        default:
        // no op
    }
});

module.exports = AppStore;