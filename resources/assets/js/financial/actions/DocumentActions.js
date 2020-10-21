
var AppDispatcher = require('../../common/dispatcher/AppDispatcher');
var DocumentConstants = require('../constants/DocumentConstants');

var DocumentActions = {
    search: function(filter) {
        AppDispatcher.dispatch({
            actionType: DocumentConstants.SEARCH,
            filter: filter
        });
    }
};

module.exports = DocumentActions;
