var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');
var $ = require('jquery');

var CHANGE_EVENT = 'change';

var _widgets = [
    {
        offset: 0,
        height: 250,
        width: 6,
        collapse: false,
        title: 'Виджет 1',
        name: 'W1',
        content: '<img src="http://crm.tut.net/includes/chart_img.php?id=2&start=05.02.2016&end=07.06.2016&type=0&group=2" style="width:100%;">'
    },
    {
        offset: 0,
        height: 250,
        width: 6,
        collapse: false,
        title: 'Виджет 2',
        name: 'W2',
        content: '<img src="http://crm.tut.net/includes/chart_img.php?id=3&start=01.01.2016&end=07.06.2016&type=-3" style="width:100%;">'
    },
    {
        offset: 0,
        height: 250,
        width: 6,
        collapse: false,
        title: 'Виджет 3',
        name: 'W3',
        content: '<img src="http://crm.tut.net/includes/chart_img.php?id=3&start=01.01.2016&end=07.06.2016&type=11" style="width:100%;">'
    },
    {
        offset: 0,
        height: 250,
        width: 6,
        collapse: false,
        title: 'Виджет 4',
        name: 'W4',
        content: '<img src="http://crm.tut.net/includes/chart_img.php?id=2&start=05.02.2016&end=07.06.2016&type=0&group=2" style="width:100%;">'
    }
];

var WidgetStore = assign({}, EventEmitter.prototype, {

    getWidget: function(id) {
        return _widgets[id];
    }
});

// Register callback to handle all updates
AppDispatcher.register(function(action) {

    switch(action.actionType) {
        default:
        // no op
    }
});

module.exports = WidgetStore;