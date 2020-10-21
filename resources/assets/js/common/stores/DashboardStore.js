var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var DashboardConstants = require('../constants/DashboardConstants');
var WidgetStore = require('../stores/WidgetStore')
var assign = require('object-assign');
var $ = require('jquery');

var CHANGE_EVENT = 'change';
var DRAG_START_EVENT = 'dragg_start';
var DRAG_STOP_EVENT = 'dragg_stop';

function _save() {
    $.ajax({
        type: "POST",
        url: "/ajax/widgets/"+_widget_store.dashboard_id+"/"+_widget_store.kit_id+"/save",
        data:{
            'widgets': _widget_store
        },
        success: function() {
            DashboardStore.noChanges();
        }
    });
}

function _add(id) {
    var w = WidgetStore.getWidget(id);
    $.ajax({
        type: "POST",
        url: "/ajax/widgets/"+_widget_store.dashboard_id+"/"+_widget_store.kit_id,
        data: {
            widget: w
        }
    })
}

function _load() {
    $.ajax({
        type: "GET",
        url: "/ajax/widgets/"+_widget_store.dashboard_id+"/"+_widget_store.kit_id,
        success: function (a) {
            _setWidgets(a);
            _setInit();
            DashboardStore.emit(CHANGE_EVENT);
        }
    });
}

function _delete(widget_id) {
    _widget_store.deleted.push(_widget_store.widgets[widget_id].id);
    delete _widget_store.widgets[widget_id];
    DashboardStore.emit(CHANGE_EVENT);
}

function _collapse(widget_id, collapse) {
    console.log('Collapse '+collapse+" "+widget_id);
    _widget_store.widgets[widget_id].collapse = collapse;
}

function _setWidgets(widgets) {
    _widget_store.widgets = widgets;
}

function _setInit() {
    _widget_store.isinit = true;
}

function _reset() {
    _load();
}

function _swap_widget(w1, w2) {
    console.log("swap "+w1+" "+w2);
    var tmp = _widget_store.widgets[w1];
    _widget_store.widgets[w1] = _widget_store.widgets[w2];
    _widget_store.widgets[w2] = tmp;
}

var tmp = null;

var _widget_store = {
    dashboard_id,
    kit_id: 0,
    isinit: false,
    dragg: false,
    ischanged: false,
    deleted: [],
    widgets: []
};

var new_place = 0;
var DashboardStore = assign({}, EventEmitter.prototype, {

    /**
     * Get the entire collection of COORDs.
     * @return {object}
     */
    getWidgets: function() {
        if (!_widget_store.isinit) {
            _reset();
        }
        return _widget_store;
    },

    draggingStart: function(widget_id) {
        console.log('Dragging start '+widget_id);
        _widget_store.dragg = widget_id;
        this.emit(DRAG_START_EVENT);
    },

    draggingStop: function() {
        console.log('Dragging stop');
        if (new_place !== false && _widget_store.dragg != new_place) {
            _swap_widget(_widget_store.dragg, new_place);
            _widget_store.ischanged = true;
        }
        _widget_store.dragg = false;
        new_place = false;
        this.emit(DRAG_STOP_EVENT);
        this.emit(CHANGE_EVENT);
    },

    saveWidgets: function() {
        console.log('Save widgets');
        _save();
    },

    reset: function() {
        _reset();
        this.noChanges();
        this.emit(CHANGE_EVENT);
    },

    resize: function(widget_id, width, height) {
        console.log('set_width '+widget_id+' '+width);
        _widget_store.widgets[widget_id].width = width;
        _widget_store.widgets[widget_id].height = height;
        _widget_store.ischanged = true;
        this.emit(CHANGE_EVENT);
    },

    init: function(dashboard_id, kit_id) {
        _widget_store.dashboard_id = dashboard_id;
        _widget_store.kit_id = kit_id || 0;
        _reset();
    },

    dragOnWidget: function(widget_id) {
        console.log(widget_id);
        new_place = widget_id;
    },

    noChanges: function() {
        _widget_store.ischanged = false;
        this.emit(CHANGE_EVENT);
    },

    removeWidget: function(widget_id) {
        _delete(widget_id);
        _widget_store.ischanged = true;
        this.emit(CHANGE_EVENT);
    },

    collapseWidget: function(widget_id, collapse) {
        _widget_store.ischanged = true;
        _collapse(widget_id, collapse);
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
    },

    /**
     * @param {function} callback
     */
    addDragStartListener: function(callback) {
        this.on(DRAG_START_EVENT, callback);
    },

    /**
     * @param {function} callback
     */
    removeDragStartListener: function(callback) {
        this.removeListener(DRAG_START_EVENT, callback);
    },

    /**
     * @param {function} callback
     */
    addDragStopListener: function(callback) {
        this.on(DRAG_STOP_EVENT, callback);
    },

    /**
     * @param {function} callback
     */
    removeDragStopListener: function(callback) {
        this.removeListener(DRAG_STOP_EVENT, callback);
    }

});

// Register callback to handle all updates
AppDispatcher.register(function(action) {
    switch(action.actionType) {
        case DashboardConstants.WIDGET_DELETE:
            _load();
            break;
        case DashboardConstants.WIDGET_ADD:
            console.log("Add widget");
            _add(action.id);
            _reset();
            break;
        default:
        // no op
    }
});

module.exports = DashboardStore;