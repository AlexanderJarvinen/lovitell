var AppDispatcher = require('../../common/dispatcher/AppDispatcher');
var InventoryConstants = require('../constants/InventoryConstants');
var InventoryActions = require('../actions/InventoryActions');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');
var $ = require('jquery');
var React = require('react');
var CHANGE_EVENT = 'change';
var FILTER_CHANGE_EVENT = 'filter_change';
var ROUTE_CHANGE_EVENT = 'route_change';
var PARAMS_CHANGE_EVENT = 'params_change';


var state = 0;
var error = '';
var msg = '';
var template_route = '';

var _filters = {
};

var _params = {
    'columns': [],
    'filters': [],
    'update_duration': 1
};

function filterReset() {
    _filters = {
        cities: [],
        city: '',
        regions: [],
        region: '',
        street: '',
        build: '',
        construction_type: 2,
        ip_addr: '',
        model: '',
        mac: '',
        floor: '',
        entrance: '',
        parent: '',
        systems: [],
        situations: [],
        states: [],
        status: '',
        source: '',
        source_iface: '',
        location: '',
        desk: '',
        order: 'route',
        order_direction: 'asc',
        on_page: 10,
        params_search_string: '',
        address_filter: '',
        is_monitoring: 0
    }
};

filterReset();

var data = [];

function setLocation(curLoc){
    location.hash = '#' + curLoc;
}

function load() {
    let json = JSON.stringify(_filters);
    delete json['is_monitoring'];
    setLocation("filters="+json);
    $.ajax({
        type: "POST",
        beforeSend: function (request) {
            return request.setRequestHeader('X-CSRF-Token', $("meta[name='csrf-token']").attr('content'));
        },
        url: "/inventory/ajax/equipment/",
        data: {
            cities: _filters.cities,
            regions: _filters.regions,
            street: _filters.street,
            systems: _filters.systems.join(),
            situations: _filters.situations.join(),
            states: _filters.states.join(),
            source: _filters.source,
            source_iface: _filters.source_iface,
            mac: _filters.mac,
            model: _filters.model,
            ip_addr: _filters.ip_addr,
            location: _filters.location,
            desk: _filters.desk,
            page: _filters.page,
            address_id: _filters.address_id,
            construction_type: _filters.construction_type,
            build: _filters.build,
            order: _filters.order+' '+_filters.order_direction,
            on_page: _filters.on_page,
            name: _filters.name,
            system_desk: _filters.system_desk,
            situation_desk: _filters.situation_desk,
            state_desk: _filters.state_desk,
            params_search_string: _filters.params_search_string,
            address_filter: _filters.address_filter,
            entrance: _filters.entrance,
            is_monitoring: _filters.is_monitoring
        },
        success: function (a) {
            setData(a);
        }
    });
    $.ajax({
        type: "POST",
        beforeSend: function (request) {
            return request.setRequestHeader('X-CSRF-Token', $("meta[name='csrf-token']").attr('content'));
        },
        url: "/inventory/ajax/settings/"+(_filters.is_monitoring?'monitoring':'equipment')+"-filter-values",
        data: {
            filters:
            {
                cities: _filters.cities,
                regions: _filters.regions,
                street: _filters.street,
                systems: _filters.systems,
                situations: _filters.situations,
                states: _filters.states,
                source: _filters.source,
                source_iface: _filters.source_iface,
                mac: _filters.mac,
                model: _filters.model,
                ip_addr: _filters.ip_addr,
                location: _filters.location,
                desk: _filters.desk,
                page: _filters.page,
                address_id: _filters.address_id,
                construction_type: _filters.construction_type,
                build: _filters.build,
                order: _filters.order + ' ' + _filters.order_direction,
                on_page: _filters.on_page,
                name: _filters.name,
                system_desk: _filters.system_desk,
                situation_desk: _filters.situation_desk,
                state_desk: _filters.state_desk,
                params_search_string: _filters.params_search_string,
                address_filter: _filters.address_filter,
                entrance: _filters.entrance,
            }
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
    InventoryStore.emit(FILTER_CHANGE_EVENT);
}

function setPage(page) {
    _filters.page = page;
    load();
}

function setData(newdata) {
    data = newdata;
    data.selectall=false;
    InventoryStore.emit(CHANGE_EVENT);
}

var InventoryStore = assign({}, EventEmitter.prototype, {
    setState: function(state) {
        setFilterState(state);
    },
    init: function() {
        load();
    },
    initFiltersLists: function(filters_lists) {
        setFiltersLists(filters_lists);
    },
    select: function(route, e) {
        let selected = 0;
        let selectall = true;
        for(let i in data.data) {
            if (data.data[i].route == route) {
                data.data[i].selected = !data.data[i].selected;
            }
            if (data.data[i].selected) {
                selected++;
            } else {
                selectall = false;
            }
        }
        data.selected = selected;
        data.selectall = selectall;
        InventoryStore.emit(CHANGE_EVENT);
    },
    getCityId: function() {return _filters.city_id;},
    getRegionId: function() {return _filters.region_id;},
    getStreeId: function() {return _filters.street_id;},
    getBuild: function() {return _filters.build;},
    getBody: function() {return _filters.body;},
    getIpAddr: function() {return _filters.ip_addr;},
    getMac: function() {return _filters.mac;},
    getFloor: function() {return _filters.floor;},
    getEntrance: function() {return _filters.entrance;},
    getParentParam: function() {return _filters.parent;},
    getTypeParam: function() {return _filters.type;},
    getStatusParam: function() {return _filters.status;},
    getCityFilterList: function() {
        return _filters_lists.city
    },
    getSystemFilterList: function() {return _filters.system;},
    getSourceVal: function() {return _filters.source;},
    getOnPage: function() {return _filters.on_page;},
    setSourceVal: function(source, reload) {
        reload = reload || false;
        _filters.source = source;
        if(reload) {
            load();
        }
    },
    getSelected: function() {
        let selected = [];
        for(let i in data.data) {
            if (data.data[i].selected) {
                selected.push(data.data[i].route);
            }
        }
        return selected;
    },
    getSelectedCount: function() {
        return data.selected;
    },
    getSelectAll: function() {
        return data.selectall;
    },
    selectAll: function() {
        data.selectall = !data.selectall;
        let selected = 0;
        for(let i in data.data) {
            data.data[i].selected = data.selectall;
            selected++;
        }
        data.selected = data.selectall?selected:0;
        InventoryStore.emit(CHANGE_EVENT);
    },
    setFilter: function(name, val) {
        switch (name) {
            case 'name':
                _filters.name=val;
                break;
            case 'ip_addr':
                _filters.ip_addr=val;
                break;
            case 'mac':
                _filters.mac=val;
                break;
            case 'system_desk':
                _filters.system_desk=val;
                break;
            case 'model':
                _filters.model=val;
                break;
            case 'source':
                _filters.source=val;
                break;
            case 'source_iface':
                _filters.source_iface=val;
                break;
            case 'state_desk':
                _filters.state_desk=val;
                break;
            case 'situation_desk':
                _filters.situation_desk=val;
                break;
            case 'desk':
                _filters.desk=val;
                break;
            case 'address_filter':
                _filters.address_filter=val;
                break;
            case 'is_monitoring':
                _filters.is_monitoring=val;
                break;
            case 'order':
                _filters.order=val;
                break;
            case 'order_direction':
                _filters.order_direction=val;
                break;
            default:
                console.log('Set: Undefined filter '+name);
        }
    },
    getFilter: function(name) {
        switch (name) {
            case 'name':
                return _filters.name;
            case 'ip_addr':
                return _filters.ip_addr;
            case 'mac':
                return _filters.mac;
            case 'system_desk':
                return _filters.system_desk;
            case 'model':
                return _filters.model;
            case 'source':
                return _filters.source;
            case 'source_iface':
                return _filters.source_iface;
            case 'state_desk':
                return _filters.state_desk;
            case 'situation_desk':
                return _filters.situation_desk;
            case 'desk':
                return _filters.desk;
            case 'address_filter':
                return _filters.address_filter;
            case 'order':
                return _filters.order;
            case 'order_direction':
                return _filters.order_direction;
            default:
                console.log('Get: Undefined filter '+name);
        }
    },
    setParams: function(params) {
        for(let param in params) {
            _params[param] = params[param];
        }
        InventoryStore.emit(PARAMS_CHANGE_EVENT);
    },
    getParam: function(name) {
        switch (name) {
            case 'update_duration':
                return _params.update_duration;
            default:
                console.log('Undefined param '+name);
        }
    },
    getTableRows: function() {return data.data},
    getRoutes: function() {return data.data.map(val=>val.route)},
    getFilters: function() {return _filters},
    getTablePage: function() {return data.page},
    getTableTotalRows: function() {return data.total_rows},
    getExportLink: function() {
        let link='/inventory/equipment/export';
        let params = (_filters.cities?'&cities='+_filters.cities:'')+
            (_filters.regions?'&regions='+_filters.regions:'')+
            (_filters.street?'&street='+_filters.street:'')+
            (_filters.systems.length>0?'&systems='+_filters.systems.join():'')+
            (_filters.situations.length>0?'&situations='+_filters.situations.join():'')+
            (_filters.states.length>0?'&states='+_filters.states.join():'')+
            (_filters.source?'&source='+_filters.source:'')+
            (_filters.source_iface?'&source_iface='+_filters.source_iface:'')+
            (_filters.mac?'&mac='+_filters.mac:'')+
            (_filters.model?'&model='+_filters.model:'')+
            (_filters.ip_addr?'&ip_addr='+_filters.ip_addr:'')+
            (_filters.location?'&loacation='+_filters.location:'')+
            (_filters.desk?'&desk='+_filters.desk:'')+
            (_filters.address_id?'&address_id='+_filters.address_id:'')+
            (_filters.build?'&build='+_filters.build:'')+
            (_filters.name?'&name='+_filters.name:'')+
            (_filters.system_desk?'&system_desk='+_filters.system_desk:'')+
            (_filters.situation_desk?'&situation_desk='+_filters.situation_desk:'')+
            (_filters.state_desk?'&state_desk='+_filters.state_desk:'')+
            (_filters.params_search_string?'&params_search_string='+_filters.params_search_string:'')+
            (_filters.address_filter?'&address_filter='+_filters.address_filter:'')+
            (_filters.entrance?'&entrance='+_filters.entrance:'');
        link = link+(params!=''?'?'+params:'');
        return link;
    },
    setSelectedRoute: function(route) {
        if (route != template_route) {
            template_route = route;
        }
        InventoryStore.emit(ROUTE_CHANGE_EVENT);
    },
    getSelectedRoute: function() {
        return template_route;
    },
    setFilters: function(filters, need_search) {
        setFilterState(filters);
        InventoryStore.emit(FILTER_CHANGE_EVENT);
        if (need_search) {
            load();
        }
    },
    setColumns: function(columns) {
        _params.columns = columns;
        InventoryStore.emit(PARAMS_CHANGE_EVENT);
    },
    getColumns: function() {
        return _params.columns;
    },

    setFiltersConfig: function(filters) {
        _params.filters = filters;
        InventoryStore.emit(PARAMS_CHANGE_EVENT);
    },

    getFiltersConfig: function() {
        return _params.filters;
    },

    /**
     * @param {function} callback
     */
    addChangeListener: function(callback) {
        this.on(CHANGE_EVENT, callback);
    },

    addFilterChangeListener: function(callback) {
        this.on(FILTER_CHANGE_EVENT, callback);
    },

    addRouteChangeListener: function(callback) {
        this.on(ROUTE_CHANGE_EVENT, callback);
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

    removeFilterChangeListener: function(callback) {
        this.removeListener(FILTER_CHANGE_EVENT, callback);
    },

    removeRouteChangeListener: function(callback) {
        this.removeListener(ROUTE_CHANGE_EVENT, callback);
    },

    removeParamsChangeListener: function(callback) {
        this.removeListener(PARAMS_CHANGE_EVENT, callback);
    }
});

// Register callback to handle all updates
AppDispatcher.register(function(action) {
    switch(action.actionType) {
        case InventoryConstants.STATE_CHANGE:
            setFilterState(action.options);
            break;
        case InventoryConstants.FILTER_RESET:
            filterReset();
            break;
        case InventoryConstants.FILTER_CHANGE:
            InventoryStore.setFilters(action.filter, action.need_update);
            break;
        case InventoryConstants.PARAMS_CHANGE:
            InventoryStore.setParams(action.params);
            break;
        case InventoryConstants.SEARCH:
            load();
            break;
        case InventoryConstants.PAGE_CHANGE:
            setPage(action.page);
            break;
        default:
        // no op
    }
});

module.exports = InventoryStore;