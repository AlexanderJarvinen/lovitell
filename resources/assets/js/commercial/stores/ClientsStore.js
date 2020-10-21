var AppDispatcher = require('../../common/dispatcher/AppDispatcher');
var ClientsConstants = require('../constants/ClientsConstants');
var ClientsActions = require('../actions/ClientsActions');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');
var AppActions = require('../../common/actions/AppActions');

var CHANGE_EVENT='change_event';
var PARAMS_CHANGE_EVENT = 'params_change';

var $ = require('jquery');
var React = require('react');

function fillUserData(resp) {
    AppActions.cancelLoading();
    if (resp.error==0) {
        _client = resp.data;
        ClientsStore.emit(CHANGE_EVENT);
    } else {

    }
}

function getClientData() {
    if (_client_id) {
        $.ajax({
            method: 'GET',
            url: '/commercial/ajax/client/' + _client_id,
            success: fillUserData
        });
    }
}

function handleSaveAddress(a) {
    if (a.error==0) {
        _client.address = a.address;
        ClientsStore.emit(CHANGE_EVENT);
    } else {

    }
}

function saveClientAddress() {
    if (_client_id) {
        $.ajax({
            method: 'POST',
            url: '/commercial/ajax/client/' + _client_id,
            success: handleSaveAddress
        })
    }
}

var _client_id = 0;

var _params = {
    'columns': []
};

var _client = {
    name:'',
    reg_date: '',
    ac_id: 0,
    password:'',
    balance:'',
    phone: '',
    service_status: '',
    ac_status: '',
    address: {
        full: '',
        city: '',
        region: '',
        street: '',
        build: '',
        apartment: ''
    }
};

var ClientsStore = assign({}, EventEmitter.prototype, {

    init: function(client_id) {
        _client_id = client_id;
        getClientData();
    },

    getClient: function() {return _client;},

    saveAddress: function(address) {

    },

    setParams: function(params) {
        for(let param in params) {
            _params[param] = params[param];
        }
        ClientsStore.emit(PARAMS_CHANGE_EVENT);
    },

    setColumns: function(columns) {
        _params.columns = columns;
        ClientsStore.emit(PARAMS_CHANGE_EVENT);
    },

    getColumns: function() {
        return _params.columns;
    },

    /**
     * @param {function} callback
     */
    addChangeListener: function(callback) {
        this.on(CHANGE_EVENT, callback);
    },

    addParamsChangeListener: function(callback) {
        this.on(PARAMS_CHANGE_EVENT, callback);
    },

    /**
     * @param {function} callback
     */
    removeChangeListener: function(callback) {
        this.removeListener(CHANGE_EVENT, callback);
    },

    removeParamsChangeListener: function(callback) {
        this.on(PARAMS_CHANGE_EVENT, callback);
    },
});

// Register callback to handle all updates
AppDispatcher.register(function(action) {
    console.log(action);
    switch(action.actionType) {
        case ClientsConstants.CLIENT_REQUEST:
            ClientsStore.init(action.client_id);
            break;
        case ClientsConstants.CLIENT_SAVE_ADDRESS:
            ClientsStore.saveAddress(action.address);
            break;
        case ClientsConstants.PARAMS_CHANGE:
            ClientsStore.setParams(action.params);
            break;
        default:
        // no op
    }
});

module.exports = ClientsStore;