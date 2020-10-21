var AppDispatcher = require('../../common/dispatcher/AppDispatcher');
var DocumentConstants = require('../constants/DocumentConstants');
var DocumentActions = require('../actions/DocumentActions');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');
var $ = require('jquery');
var React = require('react');
var CHANGE_EVENT = 'change';


var state = 0;
var error = '';
var msg = '';
var template_route = '';

var _filters = {
};

function filterReset() {
    _filters = {
        date: '',
        type: '',
        customer_group: '',
        start_ac_id: '',
        end_ac_id: ''
    }
};

filterReset();

var data = [];

function load() {
    $.ajax({
        type: "POST",
        beforeSend: function (request) {
            return request.setRequestHeader('X-CSRF-Token', $("meta[name='csrf-token']").attr('content'));
        },
        url: "/financial/ajax/documents/get/",
        data: {
            date: _filters.date,
            type: _filters.type,
            customer_group: _filters.customer_group,
            start_ac_id: _filters.start_ac_id,
            end_ac_id: _filters.end_ac_id
        },
        success: function (a) {
            setData(a);
        }
    });
}

function setFilterState(options) {
    for (var key in options) {
        _filters[key] = options[key];
    }
}

function setData(newdata) {
    data = newdata;
    DocumentStore.emit(CHANGE_EVENT);
}

var DocumentStore = assign({}, EventEmitter.prototype, {
    setState: function(state) {
        setFilterState(state);
        load();
    },
    init: function() {
        load();
    },
    getData: function() {return data},

    getFilters: function() {return _filters},
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
        case DocumentConstants.SEARCH:
            DocumentStore.setState(action.filter);
            break;
        default:
        // no op
    }
});

module.exports = DocumentStore;