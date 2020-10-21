var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var ControlbarConstants = require('../constants/ControlbarConstants');
var assign = require('object-assign');
var $ = require('jquery');

var CHANGE_EVENT = 'change';

var _tab_state = {
    active_tab: 1
}

var ControlbarStore = assign({}, EventEmitter.prototype, {

    changeActiveTab: function(active_tab) {
        _tab_state.active_tab = active_tab;
        this.emit(CHANGE_EVENT);
    },

    getTabState: function() {
        return _tab_state;
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
    switch(action.actionType) {
        case ControlbarConstants.TAB_CHANGE:
            console.log('Change tab');
            ControlbarStore.changeActiveTab(action.active_tab);
            break;
        default:
        // no op
    }
});

module.exports = ControlbarStore;