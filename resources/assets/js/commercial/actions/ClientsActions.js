
var AppDispatcher = require('../../common/dispatcher/AppDispatcher');
var ClientsConstants = require('../constants/ClientsConstants');

var ClientsActions = {
    clientRequest: function(client_id) {
        AppDispatcher.dispatch({
            actionType: ClientsConstants.CLIENT_REQUEST,
            client_id: client_id
        })
    },

    clientBlock: function() {
        AppDispatcher.dispatch({
            actionType: ClientsConstants.CLIENT_BLOCK
        })
    },

    clientUnblock: function() {
        AppDispatcher.dispatch({
            actionType: ClientsConstants.CLIENT_UNBLOCK
        })
    },

    clientSetCredit: function() {
        AppDispatcher.dispatch({
            actionType: ClientsConstants.CLIENT_SET_CREDIT
        })
    },

    setParams: function(params) {
        console.log('SetParams');
        AppDispatcher.dispatch({
            actionType: ClientsConstants.PARAMS_CHANGE,
            params: params
        });
    }
};

module.exports = ClientsActions;
