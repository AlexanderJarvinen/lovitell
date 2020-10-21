var SidebarDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var SidebarConstants = require('../constants/SidebarConstants');
var assign = require('object-assign');
var $ = require('jquery');

var CHANGE_EVENT = 'change';

function _loadmenu() {
    $.ajax({
        type: "POST",
        url: "/ajax/get-menu",
        data: ({
            "search_string": _menu_store.search_string
        }),
        success: function (a) {
            _setmenu(a);
            _setInit();
            SidebarStore.emitChange();
        }
    });
}

function _setmenu(menu) {
    _menu_store.menu = menu;
}
function _setInit() {
    _menu_store.isinit = true;
}

function _setSearchText(search_text) {
    _menu_store.search_string = search_text;
}

function _search(search_text) {
    _setSearchText(search_text);
    _loadmenu();
}

function _reset() {
    _setSearchText('');
    _loadmenu();
}
var _menu_store = {
    search_string: '',
    isinit: false,
    menu: {}
};

var SidebarStore = assign({}, EventEmitter.prototype, {

    /**
     * Get the entire collection of COORDs.
     * @return {object}
     */
    getMenu: function() {
        if (!_menu_store.isinit) {
            _reset();
        }
        return _menu_store;
    },

    init: function() {
        if (!_menu_store.isinit) {
            _reset();
        }
    },

    search: function(search_string) {
        _search(search_string);
    },

    emitChange: function() {
        this.emit(CHANGE_EVENT);
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
SidebarDispatcher.register(function(action) {
    var search_string;

    switch(action.actionType) {
        case SidebarConstants.CREATE_MENU:
            createmenu();
            break;
        case SidebarConstants.MENU_SEARCH:
            _search(search_string);
            break;
        case SidebarConstants.MENU_RESET:
            _reset();
            break;
        default:
        // no op
    }
});

module.exports = SidebarStore;