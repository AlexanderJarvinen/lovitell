
var AppDispatcher = require('../dispatcher/AppDispatcher');
var SidebarConstants = require('../constants/SidebarConstants');

var SidebarActions = {
    /**
     * @param  {string} search_text
     */
    search: function(search_text) {
        AppDispatcher.dispatch({
            actionType: SidebarConstants.MENU_SEARCH,
            text: search_text
        });
    },

    reset: function() {
        AppDispatcher.dispatch({
           actionType: SidebarConstants.MENU_RESET
        });
    }
};

module.exports = SidebarActions;
