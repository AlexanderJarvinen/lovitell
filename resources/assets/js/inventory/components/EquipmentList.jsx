var $ = require('jquery');
var React = require('react');
var ReactDOM = require('react-dom');
var Modal = require('react-modal');
var Multiselect = require('react-bootstrap-multiselect');
var classNames = require('classnames');
var Autocomplete = require('react-autocomplete');
var InventoryActions = require('../actions/InventoryActions.js');
var InventoryStore = require('../stores/InventoryStore.jsx');
var LoadBar = require('../../common/components/LoadBar.jsx');
var AppActions = require('../../common/actions/AppActions.js');
var EquipmentEditModal = require('./EquipmentEditModal.jsx');
var EquipmentEditModalBatch = require('./EquipmentEditModalBatch.jsx');
var EquipmentFileLoadModal = require('./EquipmentFileLoadModal.jsx');
var EquipmentTemplateChangeModal = require('./EquipmentTemplateChangeModal.jsx');
var EquipmentAddModal = require('./EquipmentAddModal.jsx');
var EquipmentAddFileLoadModal = require('./EquipmentAddFileLoadModal');
var BuildSelect = require('./BuildSelect.jsx');
var Pagination = require('./Pagination');

import findIndex from 'lodash/findIndex';
import * as Table from 'reactabular-table';
import * as select from 'reactabular-select';

import EquipmentJobsLog from './EquipmentJobsLog';
import EquipmentChangeFWModal from './EquipmentChangeFWModal';
import EquipmentChangeFWFileModal from './EquipmentChangeFWFileModal';

var styles = {
    item: {
        padding: '2px 6px',
        cursor: 'default'
    },

    highlightedItem: {
        color: 'white',
        background: 'hsl(200, 50%, 50%)',
        padding: '2px 6px',
        cursor: 'default'
    },

    menu: {
        border: 'solid 1px #ccc'
    }
};

var AddEquipment = React.createClass({
    getInitialState: function(){
        return {
            showModal: false,
            showFileModal: false,
            showFileFWModal: false
        }
    },
    handleClose: function() {
        this.setState({
            showModal: false
        })
    },
    handleFileClose: function() {
        this.setState({
            showFileModal: false
        })
    },
    handleAddEquipment: function() {
        this.setState({
            showModal: true
        });
    },
    handleAddFileEquipment: function() {
        this.setState({
            showFileModal: true
        });
    },
    handleModifyFileEquipment: function() {
        this.setState({
            showFileModifyModal: true
        });
    },
    handleFwFileEquipment: function() {
        this.setState({
            showFileFWModal: true
        });
    },
    handleSave: function() {
    },
    handleCloseModifyFile: function() {
        this.setState({
            showFileModifyModal: false
        });
    },
    handleCloseFwFile: function() {
        this.setState({
            showFileFWModal: false
        });
    },
    render: function() {
        return (
            <div className='add-equipment'>
                {this.props.canAddRoute?
                    <span>
                        <EquipmentAddModal
                            show={this.state.showModal}
                            handleClose={this.handleClose}
                            handleSave={this.handleSave}
                            />
                        <button
                            className='btn btn-primary'
                            onClick={this.handleAddEquipment}
                            >
                            <i className='fa fa-plus-circle' aria-hidden="true"></i> Добавить устройство
                        </button>
                        <EquipmentAddFileLoadModal
                            show={this.state.showFileModal}
                            handleClose={this.handleFileClose}
                            handleSave={this.handleSave}
                            />
                        <button
                            className='btn btn-primary'
                            onClick={this.handleAddFileEquipment}
                            >
                            <i className='fa fa-file-text-o' aria-hidden="true"></i> Добавить устройства из файла
                        </button>
                    </span>
                    :
                    null
                }
                {this.props.canModifyRoute ?
                    <span>
                        <EquipmentFileLoadModal
                            show={this.state.showFileModifyModal}
                            routes_from_file={true}
                            routes={[]}
                            handleClose={this.handleCloseModifyFile}
                            handleSave={this.handleCloseModifyFile}
                            />
                        <button
                            className='btn btn-primary'
                            onClick={this.handleModifyFileEquipment}
                            >
                            <i className='fa fa-plus-circle' aria-hidden="true"></i> Изменить устройства из файла
                        </button>
                    </span>
                    :
                    null
                }
                {this.props.canChangeFW ?
                    <span>
                    <EquipmentChangeFWFileModal
                        show={this.state.showFileFWModal}
                        handleClose={this.handleCloseFwFile}
                        handleSave={this.handleCloseFwFile}
                        />
                    <button
                        className = 'btn btn-primary'
                        onClick={this.handleFwFileEquipment}
                        >
                        <i className='fa fa-plus-circle' aria-hidden="true"></i> Сменить прошивку устройств из файла
                        </button>
                    </span>
                    :
                    null
                }
            </div>
        )
    }
});
var FormForSubmit = React.createClass({
    getInitialState: function() {
        return {
            cities: '',
            regions: '',
            street: '',
            systems: '',
            states: '',
            situations: '',
            source: '',
            mac: '',
            ip_addr: '',
            model: '',
            desk: '',
            is_init: false
        }
    },
    componentDidMount: function() {
        InventoryStore.addFilterChangeListener(this.filterChanges);
    },
    render: function() {
        if (!this.state.is_init) return null;
        return (
            <form action='/inventory/equipment/export' method='POST'>
                <input type='hidden' name={'_token'} value={$("meta[name='csrf-token']").attr('content')} />
                <input type='hidden' name={'cities'} value={this.state.cities} />
                <input type='hidden' name={'regions'} value={this.state.regions} />
                <input type='hidden' name={'street'} value={this.state.street} />
                <input type='hidden' name={'systems'} value={this.state.systems} />
                <input type='hidden' name={'situations'} value={this.state.situations} />
                <input type='hidden' name={'source'} value={this.state.source} />
                <input type='hidden' name={'mac'} value={this.state.mac} />
                <input type='hidden' name={'model'} value={this.state.model} />
                <input type='hidden' name={'states'} value={this.state.states} />
                <input type='hidden' name={'ip_addr'} value={this.state.ip_addr} />
                <input type='hidden' name={'address_id'} value={this.state.address_id} />
                <input type='hidden' name={'name'} value={this.state.name} />
                <input type='hidden' name={'location'} value={this.state.location} />
                <input type='hidden' name={'desk'} value={this.state.desk} />
                <input type='hidden' name={'build'} value={this.state.build} />
                <input type='hidden' name={'system_desk'} value={this.state.system_desk} />
                <input type='hidden' name={'situation_desk'} value={this.state.situation_desk} />
                <input type='hidden' name={'state_desk'} value={this.state.state_desk} />
                <input type="submit" value="XLS Экспорт"/>
            </form>
        );
    },
    filterChanges: function() {
        let filters = InventoryStore.getFilters();
        this.setState({
            is_init: true,
            cities: filters.cities,
            regions: filters.regions,
            street: filters.street,
            systems: filters.systems,
            situations: filters.situations,
            source: filters.source,
            mac: filters.mac,
            model: filters.model,
            ip_addr: filters.ip_addr,
            states: filters.states,
            address_id: filters.address_id,
            construction_type: filters.construction_type,
            name: filters.name,
            location: filters.location,
            desk: filters.desk,
            on_page: filters.on_page
        });
    }
});

var FilterPanel = React.createClass({
    getInitialState: function() {
        let {systems, states, situations, filters} = this.props;
        let sel_systems = [];
        if (filters && filters.systems) {
            sel_systems = filters.systems;
            systems = this.checkMultiselect(systems, sel_systems);
        } else {
            for (let i in systems) {
                if (systems[i].selected) {
                    sel_systems.push(systems[i].value);
                }
            }
        }
        let sel_situations = [];
        if (filters && filters.situations) {
                sel_situations = filters.situations;
                situations = this.checkMultiselect(situations, sel_situations);
        } else {
            for (let i in situations) {
                if (situations[i].selected) {
                    sel_situations.push(situations[i].value);
                }
            }
        }
        let sel_states = [];
        if (filters && filters.states) {
            sel_states = this.props.filters.states;
            states = this.checkMultiselect(states, sel_states);
        } else {
            for (let i in states) {
                if (states[i].selected) {
                    sel_states.push(states[i].value);
                }
            }
        }
        return {
            cities: filters.cities || '',
            city: filters.cities || '',
            clear: 0,
            region: filters.regions || '',
            region_id: filters.region_id || 0,
            system: 0,
            systems: systems,
            sel_systems: sel_systems,
            states: states,
            sel_states: sel_states,
            situations: situations,
            sel_situations: sel_situations,
            street: filters.street || '',
            street_req: false,
            street_req_timer: null,
            streets: [],
            street_id: filters.street_id || 0,
            loading: false,
            source: filters.source || '',
            mac: filters.mac || '',
            ip_addr: filters.ip_addr || '',
            model: filters.model || '',
            name: filters.name || '',
            address_id: filters.address_id || 0,
            construction_type: 2,
            location: filters.location || '',
            desk: filters.desk || '',
            show_extended: false,
            on_page: parseInt(filters.on_page) > 0? parseInt(filters.on_page):10,
            page: parseInt(filters.page) > 0? parseInt(filters.page):1,
            filters_config: InventoryStore.getFiltersConfig()
        }
    },
    streetDataReceived: function(data) {
        this.setState({
            streets: data,
            loading: false,
            address_id: 0
        })
    },
    streetChange: function(event, value) {
        this.setState({street: value}, this.storeFilters);
        if(value.length < 3) {
            return;
        }
        if (!this.state.street_req) {
            clearTimeout(this.state.street_req_timer);
            let t = setTimeout(this.setState({street_req: true}), 2000);
            this.setState({street_req_timer: t});
            return;
        }
        let t = setTimeout(this.setState({street_req: true}), 2000);
        this.setState({ value, loading: true, street_req_timer: t, street_req: false});
        $.ajax({
            beforeSend: function (request) {
                return request.setRequestHeader('X-CSRF-Token', $("meta[name='csrf-token']").attr('content'));
            },
            type: 'POST',
            url: '/inventory/streets/',
            data: ({
                street: value,
                regions: this.state.region
            }),
            success: this.streetDataReceived
        });
    },
    systemChange: function(e) {
        var s=this.state.systems;
        var sel_systems = []
        for(let i in s) {
            if(s[i].value == e.val()) {
                s[i].selected = !s[i].selected;
            }
            if (s[i].selected) {
                sel_systems.push(s[i].value)
            }
        }
        this.setState({
            systems: s,
            sel_systems: sel_systems
        },
        this.storeFilters);
    },
    stateChange: function(e) {
        var s=this.state.states;
        var sel_states = []
        for(let i in s) {
            if(s[i].value == e.val()) {
                s[i].selected = !s[i].selected;
            }
            if (s[i].selected) {
                sel_states.push(s[i].value)
            }
        }
        this.setState({
            states: s,
            sel_states: sel_states
        },
        this.storeFilters);
    },
    situationChange: function(e) {
        var s=this.state.situations;
        var sel_situations = []
        for(let i in s) {
            if(s[i].value == e.val()) {
                s[i].selected = !s[i].selected;
            }
            if (s[i].selected) {
                sel_situations.push(s[i].value)
            }
        }
        this.setState({
            situations: s,
            sel_situations: sel_situations
        },
        this.storeFilters);
    },
    storeFilters: function(initial) {
        InventoryActions.filterChange({
            cities: this.state.city,
            regions: this.state.region,
            region_id: this.state.region_id,
            street: this.state.street,
            street_id: this.state.street_id,
            systems: this.state.sel_systems,
            states: this.state.sel_states,
            situations: this.state.sel_situations,
            source: this.state.source,
            mac: this.state.mac,
            ip_addr: this.state.ip_addr,
            model: this.state.model,
            address_id: this.state.address_id,
            construction_type: this.state.construction_type,
            name: this.state.name,
            location: this.state.location,
            desk: this.state.desk,
            on_page: this.state.on_page,
            page: initial?this.state.page:1
        });
    },
    searchEquipment: function(initial) {
        this.storeFilters(initial);
        AppActions.initLoading();
        InventoryActions.search();
    },
    systemsSelectAll: function(select) {
        var systems=this.state.systems;
        var sel_systems = [];
        for(let i in systems) {
            systems[i].selected = select;
            if (select) {
                sel_systems.push(systems[i].value);
            }
        }
        this.setState({
                systems: systems,
                sel_systems: sel_systems
            },
            this.storeFilters);
    },
    checkMultiselect: function(list, selected) {
        for(let i in list) {
            if (selected.indexOf(list[i].value.toString()) !== -1 || selected.indexOf(list[i].value) !== -1) {
                list[i].selected = true
            } else {
                list[i].selected = false;
            }
        }
        return list;
    },
    statesSelectAll: function(select) {
        var states=this.state.states;
        var sel_states = [];
        for(let i in states) {
            states[i].selected = select;
            if (select) {
                sel_states.push(states[i].value);
            }
        }
        this.setState({
            states: states,
            sel_states: sel_states
        },
        this.storeFilters);
    },
    situationsSelectAll: function(select) {
        var situations=this.state.situations;
        var sel_situations = [];
        for(let i in situations) {
            situations[i].selected = select;
            if (select) {
                sel_situations.push(situations[i].value);
            }
        }
        this.setState({
            situations: situations,
            sel_situations: sel_situations
        },
        this.storeFilters);
    },
    onChange: function() {
        this.setState({
            source: InventoryStore.getSourceVal()
        });
    },
    filterReset: function() {
        this.setState({
            cities: '',
            city: '',
            clear: 0,
            region: '',
            region_id: 0,
            system: 0,
            street: '',
            street_req: false,
            street_req_timer: null,
            streets: [],
            street_id: 0,
            loading: false,
            source: '',
            mac: '',
            ip_addr: '',
            model: '',
            name: '',
            address_id: 0,
            construction_type: 2,
            location: '',
            desk: '',
            show_extended: false,
            on_page: 10,
            page: 1
        }, this.storeFilters);
    },
    filterChange: function() {
        let filters = InventoryStore.getFilters();
        let systems = this.checkMultiselect(this.state.systems, filters.systems);
        let states = this.checkMultiselect(this.state.states, filters.states);
        let situations = this.checkMultiselect(this.state.situations, filters.situations);
        this.setState({
            cities: filters.cities,
            regions: filters.regions,
            street: filters.street,
            source: filters.source,
            mac: filters.mac,
            model: filters.model,
            ip_addr: filters.ip_addr,
            address_id: filters.address_id,
            construction_type: filters.construction_type,
            name: filters.name,
            location: filters.location,
            desk: filters.desk,
            on_page: filters.on_page,
            sel_systems: filters.systems,
            systems: systems,
            sel_situations: filters.situations,
            situations: situations,
            sel_states: filters.states,
            collapseFilters: false,
            closeFilters: false,
            states: states
        });
    },
    checkClear: function() {
        let clear = this.state.clear+1;
        this.setState({
            clear
        });
        if (clear>2) {
            this.filterReset();
        }
    },
    componentDidMount: function() {
        this.filterChange();
        InventoryStore.addChangeListener(this.onChange);
        InventoryStore.addFilterChangeListener(this.filterChange);
        InventoryStore.addParamsChangeListener(this.paramsChange);
        setInterval(()=>{
            this.setState({
                clear: 0
            })}, 1000);
        let that = this;
        document.onkeydown = function(e) {
            e = e || window.event;
            if (e.keyCode == 27) {
                that.checkClear();
            }
            return true;
        }
    },
    paramsChange: function() {
        this.setState({
            filters_config: InventoryStore.getFiltersConfig()
        });
    },
    buildChange: function(address) {
        this.setState({
            address_id: address.id,
            construction_type: address.construction_type
        },
        this.storeFilters)
    },
    render: function() {
        let filters = this.state.filters_config;
        let favCounter = 0;
        for (let i in filters) {
            if (filters[i].favorites) {favCounter++};
        }
        return (
            <div className={classNames('box', 'filters', {'collapsed-box': this.state.collapseFilters},{'show-extended': this.state.show_extended}, {'closed-box': this.state.closeFilters})}>
                <div className={classNames('box-header')}>
                    <h4 className="box-title"><a onClick={()=>{this.setState({collapseFilters: !this.state.collapseFilters})}}>Фильтры</a> <a title={!this.state.show_extended?'Показать все фильтры':'Показать только избранные фильтры'}>
                        <i className={classNames('fa', 'link', {'fa-eye': !this.state.show_extended}, {'fa-eye-slash': this.state.show_extended})} aria-hidden="true" onClick={()=>{this.setState({show_extended: !this.state.show_extended})}} /></a>
                    </h4>
                    {favCounter == 0 && !this.state.show_extended ?
                        <span className="hint"><i className="icon fa fa-info"></i> Нет избранных фильтров. Выберите их через панель
                            настроек (кликните на <i className="fa fa-gears"/> в правом верхнем углу экрана).</span>
                        :
                        ''
                    }
                    <div className="box-tools pull-right">
                        <button onClick={()=>{this.setState({collapseFilters: !this.state.collapseFilters})}} type="button" className="btn btn-box-tool"><i className="fa fa-minus"></i></button>
                        <button onClick={()=>{this.setState({closeFilters: !this.state.closeFilters})}} type="button" className="btn btn-box-tool"><i className="fa fa-times"></i></button>
                    </div>
                </div>
                <div className="box-body">
                    <div className={
                        classNames(
                            'address',
                            'filter',
                            {'favorites': filters.address && filters.address.favorites},
                            {'extended': filters.address && !filters.address.favorites}
                        )
                    }>
                        <div className="filter_wrap">
                            <label for="city">Город:</label>
                            <input type="text"
                                onChange={(e)=>{this.setState({city: e.target.value})}}
                                value={this.state.city}
                            />
                        </div>
                        <div className="filter_wrap">
                            <label for="regions">Район:</label>
                            <input type="text"
                                onChange={(e)=>{this.setState({region: e.target.value})}}
                                value={this.state.region}
                            />
                        </div>
                        <div className="filter_wrap">
                            <label for="street">Улица:</label>
                            <Autocomplete
                                inputProps={{name: "Улица", id: "streets-autocomplete"}}
                                ref="autocomplete"
                                value={this.state.street}
                                items={this.state.streets}
                                getItemValue={(item) => item.value}
                                onSelect={(value, item) => {
                                    // set the menu to only the selected item
                                    let street_info = value.split(' - ');
                                    let street_id = item.key.split('-');
                                    this.setState({
                                        street: value,
                                        streets: [ item ],
                                        city: street_info[0],
                                        region: street_info[1],
                                        region_id: street_id[1],
                                        street_id: street_id[2]
                                    },
                                    this.storeFilters);
                                    // or you could reset it to a default list again
                                    // this.setState({ unitedStates: getStates() })
                                }}
                                onChange={this.streetChange}
                                renderItem={(item, isHighlighted) => (
                                    <div
                                        style={isHighlighted ? styles.highlightedItem : styles.item}
                                        key={item.key}
                                        id={item.key}
                                    >{item.value}</div>
                                )}
                            />
                        </div>
                        <BuildSelect
                            street_id={this.state.street_id}
                            region_id={this.state.region_id}
                            address_id={this.state.address_id}
                            construction_type={this.state.construction_type}
                            disableWhenRegionEmpty = {true}
                            className={'filter_wrap'}
                            onChange={this.buildChange}
                        />
                    </div>
                    <div className={classNames(
                        'filter_wrap',
                        'filter',
                        {'favorites': filters.system && filters.system.favorites},
                        {'extended': filters.system && !filters.system.favorites}
                    )}>
                        <label for="system" >Тип:</label>
                        <Multiselect
                            onChange={this.systemChange}
                            onSelectAll={this.systemsSelectAll}
                            onDeselectAll={this.systemsDeselectAll}
                            data={this.state.systems}
                            includeSelectAllOption={true}
                            multiple
                        />
                    </div>
                    <div className={classNames(
                        'filter_wrap',
                        'filter',
                        {'favorites': filters.state && filters.state.favorites},
                        {'extended': filters.state && !filters.state.favorites}
                    )}>
                    <label for="state">Статус:</label>
                        <Multiselect
                            onChange={this.stateChange}
                            onSelectAll={this.statesSelectAll}
                            onDeselectAll={this.statesDeselectAll}
                            data={this.state.states}
                            includeSelectAllOption={true}
                            multiple
                        />
                    </div>
                    <div className={classNames(
                        'filter_wrap',
                        'filter',
                        {'favorites': filters.situation && filters.situation.favorites},
                        {'extended': filters.situation && !filters.situation.favorites}
                    )}>
                        <label for="situation">Состояние:</label>
                        <Multiselect
                            onChange={this.situationChange}
                            onSelectAll={this.situationsSelectAll}
                            onDeselectAll={this.situationsDeselectAll}
                            data={this.state.situations}
                            includeSelectAllOption={true}
                            multiple
                        />
                    </div>
                    <div className={classNames(
                        'filter_wrap',
                        'filter',
                        {'favorites': filters.situation && filters.source.favorites},
                        {'extended': filters.situation && !filters.source.favorites}
                    )}>
                        <label for="state">Родитель:</label>
                        <input type="text"
                            onChange={(e)=>{this.setState({source: e.target.value})}}
                            value={this.state.source}
                        />
                    </div>
                    <div className={classNames(
                        'filter_wrap',
                        'filter',
                        {'favorites': filters.ip_addr && filters.ip_addr.favorites},
                        {'extended': filters.ip_addr && !filters.ip_addr.favorites}
                    )}>
                        <label for="state">IP:</label>
                        <input type="text"
                            onChange={(e)=>{this.setState({ip_addr: e.target.value})}}
                            value={this.state.ip_addr}
                        />
                    </div>
                    <div className={classNames(
                        'filter_wrap',
                        'filter',
                        {'favorites': filters.mac && filters.mac.favorites},
                        {'extended': filters.mac && !filters.mac.favorites}
                    )}>
                        <label for="state">MAC:</label>
                        <input type="text"
                            onChange={(e)=>{this.setState({mac: e.target.value})}}
                            value={this.state.mac}
                        />
                    </div>
                    <div className={classNames(
                        'filter_wrap',
                        'filter',
                        {'favorites': filters.model && filters.model.favorites},
                        {'extended': filters.model && !filters.model.favorites}
                    )}>
                        <label for="state">Модель:</label>
                        <input type="text"
                            onChange={(e)=>{this.setState({model: e.target.value})}}
                            value={this.state.model}
                        />
                    </div>
                    <div className={classNames(
                        'filter_wrap',
                        'filter',
                        {'favorites': filters.name && filters.name.favorites},
                        {'extended': filters.name && !filters.name.favorites}
                    )}>
                        <label for="state">Имя:</label>
                        <input type="text"
                            onChange={(e)=>{this.setState({name: e.target.value})}}
                            value={this.state.name}
                        />
                    </div>
                    <div className={classNames(
                        'filter_wrap',
                        'filter',
                        {'favorites': filters.location && filters.location.favorites},
                        {'extended': filters.location && !filters.location.favorites}
                    )}>
                        <label for="state">Локация:</label>
                        <input type="text"
                            onChange={(e)=>{this.setState({location: e.target.value})}}
                            value={this.state.location}
                        />
                    </div>
                    <div className={classNames(
                        'filter_wrap',
                        'filter',
                        {'favorites': filters.descr && filters.descr.favorites},
                        {'extended': filters.descr && !filters.descr.favorites}
                    )}>
                        <label for="state">Описание:</label>
                        <input type="text"
                            onChange={(e)=>{this.setState({desk: e.target.value})}}
                            value={this.state.desk}
                        />
                    </div>
                    <div className="filters__btn-pan">
                        <button onClick={this.searchEquipment} className="btn btn-primary"><i className='fa fa-search'/> Пoиск</button>
                        <button onClick={this.filterReset} title="Сбросить фильтр" className="btn btn-default"><i className='fa fa-times'/> Очистить</button>
                    </div>
                </div>
            </div>
        )
    }
});

var Modify =  React.createClass({
    render: function() {
        var modify = null;
        if (this.props.selected) {
            modify = (
                <span>{this.props.selected} выделено&nbsp;
                <a onClick={this.props.onModifyHandler} title="Редактировать"><i className={'fa fa-edit'}></i></a>&nbsp;
                <a onClick={this.props.onLoadHandler} title="Загрузить из файла"><i className={'fa fa-upload'}></i></a>&nbsp;
                <a onClick={this.props.onLoadFW} title="Загрузить прошивку"><i className={'fa fa-gear'}></i></a>&nbsp;
            </span>);
        }
        return modify;
    }
});


const CustomFooter = ({ columns, page, rows_count, on_page, onChange, selected, onModifyHandler, onLoadHandler, onLoadFW }) => {
    return (
        <tfoot>
            <tr>
                <td key={'footer'} colSpan={columns.length}>
                    <Modify
                        selected={selected}
                        onModifyHandler={onModifyHandler}
                        onLoadHandler={onLoadHandler}
                        onLoadFW={onLoadFW}
                    />
                    <Pagination
                        page={page}
                        on_page={on_page}
                        rows={rows_count}
                        onChange={onChange}
                    />
                    Всего строк: {rows_count}
                </td>
            </tr>
        </tfoot>
    );
};
const BodyWrapper = props => <tbody {...props} />;
BodyWrapper.shouldComponentUpdate = true;
const RowWrapper = props => <tr {...props} />;
RowWrapper.shouldComponentUpdate = true

var EquipmentTable = React.createClass({

    orderFormatter: function(label, col) {
        const order = InventoryStore.getFilter('order');
        const order_direction = InventoryStore.getFilter('order_direction');
        return <a onClick={
                    () => {this.setOrder(col.property)}}
                >{label}
                {order==col.property?
                    order_direction=='asc'?
                        <i className="fa fa-arrow-up"></i>
                        :
                        <i className="fa fa-arrow-down"></i>:
                    ''
                }</a>
    },

    getColumns: function() {
        let columns = [
            {
                property: 'selected',
                header: {
                    label: 'test',
                    formatters: [
                        () => {
                        return(<input type="checkbox"
                                      checked={InventoryStore.getSelectAll()}
                                      onChange={InventoryStore.selectAll}
                            />)
                        }
                    ]
                },
                cell: {
                    formatters: [
                        (selected, row) => {
                            return (<input type="checkbox"
                                       checked={row.rowData.selected}
                                       onChange={InventoryStore.select.bind(null, row.rowData.route)}
                            />)
                        }
                    ]
                }
            },
            {
                property: 'route',
                header: {
                    label: 'Name',
                    formatters: [
                        this.orderFormatter,
                    ]
                },
                cell: {
                    formatters: [
                        (route, row) => {
                            return (<span
                                className={'system'+row.rowData.system_id}
                                >
                                    {route}
                                </span>)
                        }
                    ]
                }
            },
            {
                property: 'brands_descr',
                header: {
                    label: 'Бренд',
                }
            },
            {
                property: 'system_desk',
                header: {
                    label: 'Тип',
                    formatters: [this.orderFormatter]
                }
            },
            {
                property: 'ip_addr',
                header: {
                    label: 'IP',
                    formatters: [this.orderFormatter]
                }
            },
            {
                property: 'mac',
                header: {
                    label: 'MAC',
                    formatters: [this.orderFormatter]
                }
            },
            {
                property: 'model_desk',
                header: {
                    label: 'Модель',
                    formatters: [this.orderFormatter]
                }
            },
            {
                property: 'source',
                header: {
                    label: 'Родитель',
                    formatters: [this.orderFormatter]
                },
                cell: {
                    formatters: [
                        source => {
                            return (
                            <span>
                                <a onClick={()=>{InventoryStore.setSourceVal(source, true)}}>{source}</a>
                            </span>
                            )
                        }
                    ]
                },
            },
            {
                property: 'location_desk',
                header: {
                    label: 'Локация',
                    formatters: [this.orderFormatter]
                },
            },
            {
                property: 'source_iface',
                header: {
                    label: 'Порт',
                    formatters: [this.orderFormatter]
                },
            },
            {
                property: 'target_iface',
                header: {
                    label: 'UPLINK',
                    formatters: [this.orderFormatter]
                },
            },
            {
                property: 'state_desk',
                header: {
                    label: 'Статус',
                    formatters: [this.orderFormatter]
                },
                cell: {
                    format: (state_desk,row) => {
                        return (
                            <div>
                                <span className={'state'+row.rowData.state}>{state_desk}</span>
                            </div>
                        )
                    }
                }
            },
            {
                property: 'situation_desk',
                header: {
                    label: 'Состояние',
                    formatters: [this.orderFormatter]
                }
            },
            {
                property: 'template_id',
                header: {
                    label: 'Шаблон',
                    formatters: [this.orderFormatter]
                },
                cell: {
                    formatters: [
                        (template, row) => {
                            let t = template;
                            if (row.rowData.can_viewtemplatelog) {
                                t = (
                                    <a onClick={()=>{InventoryStore.setSelectedRoute(row.rowData.route)}}>{template}</a>);
                            }
                            return (
                                <span>
                                {t}
                                </span>
                            )
                        }
                    ]
                }
            },
            {
                property: 'city_desk',
                header: {
                    label: 'Город',
                    formatters: [this.orderFormatter]
                }
            },
            {
                property: 'region_desk',
                header: {
                    label: 'Район',
                    formatters: [this.orderFormatter]
                }
            },
            {
                property: 'street_desk',
                header: {
                    label: 'Улица',
                    formatters: [this.orderFormatter]
                }
            },
            {
                property: 'build',
                header: {
                    label: 'Дом',
                    formatters: [this.orderFormatter]
                },
                cell: {
                    formatters: [
                        (build, row) => {
                            return (
                                <span>
                                    <a href={"/inventory/building/"+row.rowData.address_id} target="_blank">{build}</a>
                                </span>
                            )
                        }
                    ]
                }
            },
            {
                property: 'entrance',
                header: {
                    label: 'Подъезд',
                    formatters: [this.orderFormatter]
                }
            },
            {
                property: 'floor',
                header: {
                    label: 'Этаж',
                    formatters: [this.orderFormatter]
                }
            },
            {
                property: 'apartment',
                header: {
                    label: 'Квартира',
                    formatters: [this.orderFormatter]
                }
            },
            {
                property: 'desk',
                header: {
                    label: 'Описание',
                    formatters: [this.orderFormatter]
                }
            },
            {
                property: 'addition',
                cell: {
                    formatters: [
                        (addition) => {
                            return (<span dangerouslySetInnerHTML={{__html: addition}}></span>)
                        }
                    ]
                },
                header: {
                    label: 'Дополнение',
                    formatters: [this.orderFormatter]
                }
            },

        ];
        if (this.props.is_monitoring) {
            columns.push({
                property: 'wifi',
                header: {
                    label: 'Активно (WiFi)',
                    formatters: [this.orderFormatter]
                }
            });
            columns.push({
                property: 'local',
                header: {
                    label: 'Активно (Кабель)',
                    formatters: [this.orderFormatter]
                }
            });
            columns.push({
                property: 'last_tech',
                header: {
                    label: 'Дата',
                    formatters: [this.orderFormatter]
                }
            });
            columns.push({
                property: 'wait_time',
                header: {
                    label: 'Время простоя',
                    formatters: [this.orderFormatter]
                }
            });
        }
        return columns;
    },
    setOrder: function(col) {
        let order = InventoryStore.getFilter('order');
        if (order == col) {
            let order_direction = InventoryStore.getFilter('order_direction');
            InventoryStore.setFilter('order_direction', order_direction=='asc'?'desc':'asc');
        } else {
            InventoryStore.setFilter('order', col);
        }
        InventoryActions.search();
    },
    getInitialState: function() {
        return {
            data: [],
            selectedCount: 0,
            selectedRow: {},
            routesFromFile: false,
            modalData: {},
            showEdit: false,
            showTemplate: false,
            showBatchEdit: false,
            showFileLoad: false,
            showFW: false,
            page: this.props.page || 1,
            on_page: this.props.on_page || 10,
            total_rows: 0,
            mode: 0
        }
    },
    componentDidMount: function() {
        InventoryStore.addChangeListener(this.onChange);
        InventoryStore.addParamsChangeListener(this.handleParamsChange);
        InventoryStore.addRouteChangeListener(this.onRouteChange);
    },
    handleParamsChange: function() {
        this.forceUpdate();
    },
    onChange: function() {
        let selected = InventoryStore.getSelectedCount();
        let update = selected != this.state.selected;
        this.setState({
                selectedCount: selected,
                data: InventoryStore.getTableRows(),
                page: InventoryStore.getTablePage(),
                total_rows: InventoryStore.getTableTotalRows(),
                export_link: InventoryStore.getExportLink(),
                mode: 1
            },
            AppActions.cancelLoading);
        if (update) {
            this.forceUpdate();
        }
    },
    onRouteChange: function() {
        let route = InventoryStore.getSelectedRoute();
        this.setState({
            route: route,
            showTemplate: route != ''
        });
    },
    pageChange: function(new_page) {
        InventoryActions.pageChange(new_page);
    },
    onModifyHandler: function() {
        this.setState({
            showBatchEdit: true
        });
    },
    onLoadHandler: function() {
        this.setState({
            showFileLoad: true
        });
    },
    renderColumns: function() {
        let columns = this.getColumns();
        let selected_columns = InventoryStore.getColumns();
        let result = [];
        for(let col in columns) {
            if (selected_columns[columns[col].property] && (selected_columns[columns[col].property].selected==true || selected_columns[columns[col].property]==1)) {
                result.push(columns[col])
            }
        }
        return result;
    },
    handleCloseFW: function() {
        this.setState({showFW:false});
    },
    handleLoadFW: function() {
        this.setState({showFW:true});
    },
    render: function() {
        if (this.state.mode==0) return null;
        let on_page = InventoryStore.getOnPage();
        const selectedRowIndex = this.getSelectedRowIndex(this.state.selectedRow);
        return (
                <div className="equipment_table__wrap box">
                    <div className="box-header">
                        <h4 className="box-title">Найденное оборудование <a href={this.state.export_link}><i className="fa fa-download"></i></a></h4>
                    </div>
                    <div className="box-body">
                        <label for="on_page">Строк на странице:</label>
                        <select name="on_page"
                            value={this.state.on_page}
                            onChange={(e)=>{
                                this.setState({on_page: e.target.value});
                                InventoryActions.filterChange({on_page: e.target.value});
                                AppActions.initLoading();
                                InventoryActions.search();
                            }}>
                            <option value={10}>10</option>
                            <option value={25}>25</option>
                            <option value={50}>50</option>
                            <option value={100}>100</option>
                            <option value={999999}>Все</option>
                        </select>
                        {this.props.is_monitoring?
                            <div>До обновления осталось {this.props.duration_counter} сек.</div>
                            :
                            null
                        }
                        <span>
                        </span>
                        <Table.Provider
                            className="table table-bordered table-hover dataTable"
                            columns={this.renderColumns()}
                            components={{
                                body: {
                                    wrapper: BodyWrapper,
                                    row: RowWrapper
                                }
                            }}
                            style={{ overflowX: 'auto' }}
                        >
                            <Table.Header />

                            {this.state.data.length > 0?
                                <Table.Body
                                rows={this.state.data}
                                rowKey="id"
                                onRow={this.onRow}
                                />:
                                <tbody><tr><td colSpan={this.renderColumns().length}>По вашему запросу оборудование не найдено</td></tr></tbody>
                            }

                            <CustomFooter
                                columns={this.renderColumns()}
                                page={this.state.page}
                                rows_count={this.state.total_rows}
                                on_page={on_page}
                                onChange={this.pageChange}
                                selected={this.state.selectedCount}
                                onModifyHandler={this.onModifyHandler}
                                onLoadHandler={this.onLoadHandler}
                                onLoadFW={this.handleLoadFW}
                            />

                        </Table.Provider>
                    </div>
                    <EquipmentEditModal
                        data={this.state.modalData}
                        show={this.state.showEdit}
                        handleClose={this.handleClose}
                        handleSave={this.handleSave}
                        can_deleteroute={this.props.can_deleteroute}
                    />
                    <EquipmentEditModalBatch
                        show={this.state.showBatchEdit}
                        routes={InventoryStore.getSelected()}
                        handleClose={this.handleCloseBatch}
                        handleSave={this.handleSaveBatch}
                    />
                    <EquipmentFileLoadModal
                        show={this.state.showFileLoad}
                        routes_from_file={this.state.routesFromFile}
                        routes={InventoryStore.getSelected()}
                        handleClose={this.handleCloseFile}
                        handleSave={this.handleSaveFromFile}
                    />
                    <EquipmentTemplateChangeModal
                        route={this.state.route}
                        show={this.state.showTemplate}
                        handleClose={this.handleCloseTemplate}
                    />
                    <EquipmentChangeFWModal
                        routes={InventoryStore.getSelected()}
                        show={this.state.showFW}
                        onClose={this.handleCloseFW}
                        />
                </div>
            )
    },
    handleClose: function() {
        this.setState({
           showEdit: false
        });
    },
    handleCloseTemplate: function() {
        this.setState({
            showTemplate: false,
            route: ''
        });
    },
    handleCloseBatch: function() {
        this.setState({
            showBatchEdit: false
        });
    },
    handleCloseFile: function() {
        this.setState({
            showFileLoad: false,
            routesFromFile: false
        });
    },
    handleSave: function() {
        AppActions.initLoading();
        InventoryActions.search();
//        this.onChange();
        this.setState({
            showEdit: false
        });
    },
    handleSaveBatch: function() {
        AppActions.initLoading();
        InventoryActions.search();
        this.setState({
            showBatchEdit: false,
            routesFromFile: false
        });
    },
    handleSaveFromFile: function() {
        AppActions.initLoading();
       // InventoryActions.search();
        this.setState({
            showFileLoad: false
        });
    },
    onRow: function(row, { rowIndex }) {
        return {
            className: classNames(
                rowIndex % 2 ? 'odd-row' : 'even-row',
                {'selected-row':row.selected}
            ),

            onDoubleClick: () => this.onSelectRow(rowIndex)
        };
    },
    onSelect: function(selectedRowIndex) {
        const rows = this.state.data;
        InventoryStore.select(rows[selectedRowIndex].route);
    },
    onSelectRow: function (selectedRowIndex) {
        const rows = this.state.data;
        const selectedRowId = this.state.selectedRow;
        this.setState({
            modalData: rows[selectedRowIndex],
            showEdit: true
        });
    },
    getSelectedRowIndex(selectedRow) {
        return findIndex(this.state.rows, {
            id: selectedRow.id
        });
    }
});

var EquipmentList = React.createClass({
    getInitialState: function() {
        let hash = this.parseHash();
        let filters = {};
        if (hash.current != '' && hash.param.filters) {
            try {
                filters = JSON.parse(decodeURI(hash.param.filters));
                if (filters.is_monitoring) delete filters.is_monitoring;
            } catch(e) {
                console.log('Filters is not valid json');
            }
        } else if (this.props.filters && Object.keys(this.props.filters).length>0) {
            filters = this.props.filters;
        } else {
            let {systems, situations, states} = this.props;
            filters.systems = [];
            filters.states = [];
            filters.situations = [];
            for(let i in systems) {
                filters.systems.push(systems[i].value);
            }
            for(let i in states) {
                filters.states.push(states[i].value);
            }
            for(let i in situations) {
                filters.situations.push(situations[i].value);
            }
        }
        if (this.props.is_monitoring) {
            filters.is_monitoring = 1;
        }
        console.log('Initial state:');
        console.log(filters);
        return {
            equipment: [],
            regions: [],
            routes: [],
            interval: null,
            filters: filters,
            update_duration: this.props.update_duration,
            duration_counter: this.props.update_duration*60,
            state: 0
        }
    },
    parseHash: function() {
        let href = window.location.href.split('#');
        let hash = {};
        hash.param = {};

        if(href[1]) {
            var tmp = href[1].split('&');

            for(let i in tmp)
            {
                hash.param[tmp[i].split('=')[0]] = tmp[i].split('=')[1];
            }
        }

        hash.current = href[1];
        return hash;
    },
    componentDidMount: function() {
        InventoryStore.setParams({update_duration: this.props.update_duration || 0 });
        InventoryStore.addParamsChangeListener(this.handleParamsChange);
        InventoryStore.addChangeListener(this.onChange);
        InventoryStore.setColumns(this.props.columns);
        InventoryStore.setFiltersConfig(this.props.filters_config);
        let filters = this.state.filters;
            if (filters.order && filters.order.indexOf(' ') !== -1) {
                let orderVal = filters.order.split(' ');
                filters.order = orderVal[0];
                filters.order_direction = orderVal[1];
            }
        filters.is_monitoring = this.props.is_monitoring?1:0;
        if (this.props.is_monitoring) {
            if (!this.state.filters) {
                filters.order = 'wait_time';
                filters.order_direction = 'desc';
            }
        } else {
            if (!this.state.filters) {
                filters.order = 'route';
                filters.order_direction = 'asc';
            }
        };
        console.log('Didmount filters:');
        console.log(filters);
        InventoryActions.filterChange(filters, this.props.is_monitoring == 1);
        let update_duration = InventoryStore.getParam('update_duration');
        if (this.props.is_monitoring) {
            this.state.update_duration = update_duration;
            if (update_duration > 0) {
                let interval = setInterval(()=> {
                    InventoryActions.search();
                    console.log('Timer');
                    this.setState({duration_counter: update_duration * 60})
                }, update_duration * 60 * 1000);
                setInterval(()=> {
                    this.setState({duration_counter: this.state.duration_counter - 1})
                }, 1000);
                this.setState({interval: interval});
            }
        }
    },
    componentWillUnmount: function() {
        InventoryStore.removeChangeListener(this.onChange);
        InventoryStore.removeParamsChangeListener(this.handleParamsChange);
    },
    handleParamsChange: function() {
        let is_monitoring = InventoryStore.getFilter('is_monitoring');
        if (is_monitoring) {
            let update_duration = InventoryStore.getParam('update_duration');
            if (update_duration && this.state.update_duration != update_duration) {
                if (this.state.interval) {
                    clearInterval(this.state.interval);
                    this.state.interval = null;
                }
                if (update_duration > 0) {
                    let interval = setInterval(()=> {
                        InventoryActions.search();
                        console.log('Timer');
                        this.setState({duration_counter: update_duration * 60})
                    }, update_duration * 60 * 1000);
                    this.setState({
                        interval: interval,
                        update_duration: update_duration,
                        duration_counter: update_duration * 60
                    });
                }
            }
        }
    },
    onChange: function() {
        this.setState({
            routes: InventoryStore.getRoutes()
        });
    },
    render: function() {
        let addroute = null;
        return (
            <div className="equipment-list">
                <FilterPanel
                    cities={this.props.cities}
                    systems={this.props.systems}
                    regions={this.props.regions}
                    situations={this.props.situations}
                    states={this.props.states}
                    filters={this.state.filters}
                />
                <LoadBar />
                <EquipmentTable
                    can_deleteroute={this.props.can_deleteroute}
                    is_monitoring={this.props.is_monitoring}
                    duration_counter={this.state.duration_counter}
                    on_page={this.state.filters.on_page}
                    page={this.state.filters.page}
                    />
                <AddEquipment
                    canAddRoute={this.props.can_addroute}
                    canModifyRoute={this.props.can_modifyroute}
                    canChangeFW={this.props.can_changeFW}
                    />
                {!this.props.is_monitoring ?
                  <EquipmentJobsLog
                    routes={this.state.routes}
                    />
                  :null
                }
            </div>
        )
    }
});

ReactDOM.render(
    <EquipmentList
        filtersLists={InventoryData}
        cities={InventoryData.cities}
        systems={InventoryData.systems}
        regions={InventoryData.regions}
        situations={InventoryData.situations}
        states={InventoryData.states}
        filters={InventoryData.filters}
        brands={InventoryData.brands}
        can_addroute={InventoryData.can_addroute}
        can_modifyroute={InventoryData.can_modifyroute}
        can_deleteroute={InventoryData.can_deleteroute}
        can_changeFW={InventoryData.can_changeFW}
        is_monitoring={InventoryData.is_monitoring}
        update_duration={InventoryData.update_duration}
        columns={InventoryData.columns}
        filters_config={InventoryData.filters_config}
    />,
    document.getElementById('equipment-list')
);