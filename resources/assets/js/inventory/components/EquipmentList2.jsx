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
var Pagination = require('./Pagination');
var AddressSelector = require('./AddressSelector');

import findIndex from 'lodash/findIndex';
import { Tabs, Tab } from 'react-bootstrap';

import * as Table from 'reactabular-table';
import { byArrowKeys } from 'reactabular-select';

var select_column = [
        {
            property: 'selected',
            header: {
                label: 'V'
            },
            cell: {
                formatters: [
                    function (selected, row) {
                        var id = row.rowData.id;
                        return (<input type="checkbox"
                            value={id}
                            onChange={checkboxSelect.bind(this, id)}
                            checked={row.rowData.selected}
                        />)
                    }
                ]
            }
        }
];

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
            build: '',
            system_desk: '',
            situation_desk: '',
            state_desk: '',
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
            name: filters.name,
            location: filters.location,
            desk: filters.desk,
            on_page: filters.on_page,
            state_desk: filters.state_desk,
            situation_desk: filters.situation_desk,
            system_desk: filters.system_desk
        });
    }
});

var FilterPanel = React.createClass({
    getInitialState: function() {
        let sel_systems = [];
        let systems = this.props.systems;
        for(let i in systems) {
            if (systems[i].selected) {
                sel_systems.push(systems[i].value);
            }
        }
        let sel_situations = [];
        let situations = this.props.situations;
        for(let i in situations) {
            if (situations[i].selected) {
                sel_situations.push(situations[i].value);
            }
        }
        let sel_states = [];
        let states = this.props.states;
        for(let i in states) {
            if (states[i].selected) {
                sel_states.push(states[i].value);
            }
        }
        return {
            params_search_string: '',
            address_search_string: '',
            city: '',
            region: '',
            region_id: 0,
            system: 0,
            systems: this.props.systems,
            sel_systems: sel_systems,
            states: this.props.states,
            sel_states: sel_states,
            situations: this.props.situations,
            sel_situations: sel_situations,
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
            address_id: '',
            location: '',
            desk: '',
            build: '',
            entrance: ''
        }
    },
    streetDataReceived: function(data) {
        this.setState({
            streets: data,
            loading: false
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
        console.log(sel_states);
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
    storeFilters: function() {
        InventoryActions.filterChange({
            cities: this.state.city,
            regions: this.state.region,
            street: this.state.street,
            systems: this.state.sel_systems,
            states: this.state.sel_states,
            situations: this.state.sel_situations,
            source: this.state.source,
            mac: this.state.mac,
            ip_addr: this.state.ip_addr,
            model: this.state.model,
            address_id: this.state.address_id,
            name: this.state.name,
            location: this.state.location,
            desk: this.state.desk,
            page: 1
        })
    },
    searchEquipment: function() {
        this.storeFilters();
        AppActions.initLoading();
        InventoryActions.search();
    },
    searchByString: function() {
        InventoryActions.filterReset();
        InventoryActions.filterChange({
            params_search_string: this.state.params_search_string,
            cities: '',
            regions: '',
            street: '',
            build: '',
            entrance: '',
            page: 1
        });
        AppActions.initLoading();
        InventoryActions.search();
    },
    searchByAddress: function() {
        InventoryActions.filterReset();
        InventoryActions.filterChange({
            cities: this.state.city,
            regions: this.state.region,
            street: this.state.street,
            build: this.state.build,
            entrance: this.state.entrance,
            params_search_string: '',
            page: 1
        });
        AppActions.initLoading();
        InventoryActions.search();
    },
    systemsDeselectAll: function(e) {
        var systems=this.state.systems;
        for(let i in systems) {
            systems[i].selected = false;
        }
        this.setState({
            systems: systems,
            sel_systems: []
        },
        this.storeFilters);
    },
    statesSelectAll: function(e) {
        var states=this.state.states;
        var sel_states = [];
        for(let i in states) {
            states[i].selected = true;
            sel_states.push(states[i].value);
        }
        this.setState({
            states: states,
            sel_states: sel_states
        },
        this.storeFilters);
    },
    statesDeselectAll: function(e) {
        var states=this.state.states;
        for(let i in states) {
            states[i].selected = false;
        }
        this.setState({
            states: states,
            sel_states: []
        },
        this.storeFilters);
    },
    situationsSelectAll: function(e) {
        var situations=this.state.situations;
        var sel_situations = [];
        for(let i in situations) {
            situations[i].selected = true;
            sel_situations.push(situations[i].value);
        }
        this.setState({
            situations: situations,
            sel_situations: sel_situations
        },
        this.storeFilters);
    },
    situationsDeselectAll: function(e) {
        var situations=this.state.situations;
        for(let i in situations) {
            situations[i].selected = false;
        }
        this.setState({
            situations: situations,
            sel_situations: []
        },
        this.storeFilters);
    },
    onChange: function() {
        this.setState({
            source: InventoryStore.getSourceVal()
        });
    },
    componentDidMount: function() {
        InventoryStore.addChangeListener(this.onChange);
    },
    handleCityChange: function(city) {
        this.setState({
            city: city.city,
            region: '',
            street: ''
        })
    },
    handleRegionChange: function(region) {
        this.setState({
            region: region.region,
            street: ''
        })
    },
    handleStreetChange: function(street) {
        this.setState({
            street: street.street,
            build: ''
        })
    },
    handleBuildChange: function(build) {
        this.setState({
            build: build
        })
    },
    handleAddressChange: function(address) {
        this.setState({
            entrance: address.entrance
        })
    },
    render: function() {
        return (
            <div className='col-xs-7 equipment_filter_panel'>
                <Tabs defaultActiveKey={1} id="uncontrolled-tab-example" animation={false}>
                    <Tab eventKey={1} title="Поиск по параметрам">
                        <input type="text" value={this.state.params_search_string} onChange={(e)=>{this.setState({params_search_string: e.target.value})}}/>
                        <button onClick={this.searchByString}  className="btn btn-default">Поиск</button>
                    </Tab>
                    <Tab eventKey={2} title="Поиск по адресу">
                        <AddressSelector
                            onCityChange={this.handleCityChange}
                            onRegionChange={this.handleRegionChange}
                            onStreetChange={this.handleStreetChange}
                            onBuildChange={this.handleBuildChange}
                            onAddressChange={this.handleAddressChange}
                            address_id={this.state.address_id}
                            onChange={this.handleAddressChange}
                            state={this.state.address_state}
                            search={true}
                            accuracy={2}
                            skip_region={true}
                        />
                        <button onClick={this.searchByAddress} className="btn btn-default">Пoиск</button>
                    </Tab>
                </Tabs>
            </div>
        )
    }
});

const CustomFooter = ({ columns, page, rows_count, on_page, onChange }) => {
    console.log(columns, page, rows_count, on_page);
    return (
        <tfoot>
            <tr>
                <td key={'footer'} colSpan={columns.length}>
                    <Pagination
                        page={page}
                        on_page={on_page}
                        rows={rows_count}
                        onChange={onChange}
                    />
                    Total rows: {rows_count}
                </td>
            </tr>
        </tfoot>
    );
};


var EquipmentTable = React.createClass({
    format: function(label, header) {
            return (<div>
                <span>{label}</span>
                <input type="text" value={this.state[header.property]} onChange={(e)=>{
                    let state=[];
                    state[header.property]=e.target.value;
                    this.setState(state)}}
                    onKeyPress={this.handleKeyPress}
                />
            </div>)
    },
    columns: function() {
        return [
        {
            property: 'route',
            header: {
                label: 'Имя',
                formatters: [this.format]
            }
        },
        {
            property: 'ip_addr',
            header: {
                label: 'IP',
                formatters:[this.format]
            }
        },
        {
            property: 'mac',
            header: {
                label: 'MAC',
                formatters:[this.format]
            }
        },
        {
            property: 'system_desk',
            header:
            {
                label: 'Тип',
                formatters:[this.format]
            }
        },
        {
            property: 'model_desk',
            header:
            {
                label: 'Модель',
                formatters:[this.format]
            }
        },
        {
            property: 'source',
            header:
            {
                label: 'Родитель',
                formatters:[this.format]
            },
            cell: {
                formatters:[
                    source => {
                        return (
                            <span>
                                <a onClick={()=> {
                                    InventoryStore.setSourceVal(source, true)
                                }}>{source}</a>
                            </span>
                        )
                    }
                ]
            }
        },
        {
            property: 'source_iface',
            header:
            {
                label: 'Интерфейс',
                formatters: [this.format]
            }
        },
        {
            property: 'address',
            header:
            {
                label: 'Адрес',
                formatters: [this.format]
            },
            cell: {
                formatters:[
                    (address, row) => {
                        return (
                            <span>
                                <a href={"/inventory/building/"+row.rowData.address_id} target="_blank">{address}</a>
                            </span>
                        )
                    }
                ]
            }
        },
        {
            property: 'state_desk',
            header:
            {
                label: 'Статус',
                formatters: [this.format]
            },
            cell: {
                formatters:[
                    (state_desk, row) => {
                        return (
                            <div>
                                <span className={'state' + row.rowData.state}>{state_desk}</span>
                            </div>
                        )
                    }
                ]
            }
        },
        {
            property: 'situation_desk',
            header:
            {
                label: 'Состояние',
                formatters: [this.format]
            }
        },
        {
            property: 'addition',
            cell:
            {
                formatters:[
                    (addition) => {
                        return (<span dangerouslySetInnerHTML={{__html: addition}}></span>)
                    }
                ]
            },
            header: {
                label: 'Дополнение',
                formatters: [this.format]
            }
        }
        ]
    },
    getInitialState: function() {
        return {
            data: [],
            columns: this.columns(),
            selectedRow: {},
            modalData: {},
            showEdit: false,
            page: 1,
            on_page: 10,
            total_rows: 0,
            route: '',
            ip_addr: '',
            mac: '',
            system_desk: '',
            desk_2: '',
            source: '',
            source_iface: '',
            address: '',
            state_desk: '',
            situation_desk: '',
            addition: '',
            export_link: '',
            mode: 0
        }
    },
    componentDidMount: function() {
        InventoryStore.addChangeListener(this.onChange);
    },
    handleKeyPress: function(e) {
        if (e.charCode == 13) {
            InventoryActions.filterChange({
                name: this.state.route,
                ip_addr: this.state.ip_addr,
                mac: this.state.mac,
                system_desk: this.state.system_desk,
                model: this.state.desk_2,
                source: this.state.source,
                source_iface: this.state.source_iface,
                address_filter: this.state.address,
                state_desk: this.state.state_desk,
                situation_desk: this.state.situation_desk,
                desk: this.state.addition,
                page: 1
            });
            AppActions.initLoading();
            InventoryActions.search();
        }
    },
    onChange: function() {
        this.setState({
            data: InventoryStore.getTableRows(),
            page: InventoryStore.getTablePage(),
            total_rows: InventoryStore.getTableTotalRows(),
            export_link: InventoryStore.getExportLink(),
            mode: 1
        },
        AppActions.cancelLoading);
    },
    pageChange: function(new_page) {
        InventoryActions.pageChange(new_page);
    },
    render: function() {
        if (this.state.mode==0) return null;
        let on_page = InventoryStore.getOnPage();
        const selectedRowIndex = this.getSelectedRowIndex(this.state.selectedRow);

        return byArrowKeys({
                rows: this.state.data,
                selectedRowIndex,
                onSelectRow: this.onSelectRow
            })(
                <div className="equipment_table__wrap box">
                    <div className="box-header">
                        <h3 className="box-title">Найденное оборудование <a href={this.state.export_link}><i className="fa fa-download"></i></a></h3>
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
                        <Table.Provider
                            className="table table-bordered table-hover dataTable"
                            columns={this.state.columns}
                        >
                            <Table.Header />

                            <Table.Body
                                rows={this.state.data}
                                rowKey="id"
                                onRow={this.onRow}
                            />

                            <CustomFooter
                                columns={this.state.columns}
                                page={this.state.page}
                                rows_count={this.state.total_rows}
                                on_page={on_page}
                                onChange={this.pageChange}
                            />

                        </Table.Provider>
                    </div>
                    <EquipmentEditModal
                        data={this.state.modalData}
                        show={this.state.showEdit}
                        handleClose={this.handleClose}
                        handleSave={this.handleSave}
                    />
                </div>
            )
    },
    handleClose: function() {
        this.setState({
           showEdit: false
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
    onRow: function(row, { rowIndex }) {
        return {
            className: classNames(
                rowIndex % 2 ? 'odd-row' : 'even-row',
                row.selected && 'selected-row'
            ),
            onDoubleClick: () => this.onSelectRow(rowIndex)
        };
    },
    onSelectRow: function (selectedRowIndex) {
        const rows = this.state.data;
        const selectedRowId = this.state.selectedRow;
        let selectedRow = select.row({
                rows,
                selectedRowId: rows[selectedRowIndex].id
        });
        console.log(selectedRow);
        this.setState({
            selectedRow,
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
        return {
            equipment: [],
            regions: [],
            state: 0
        }
    },
    componentDidMount: function() {
        InventoryActions.filterReset();
    },
    render: function() {
        return (
            <div className="equipment-list">
                <FilterPanel
                    cities={this.props.cities}
                    systems={this.props.systems}
                    regions={this.props.regions}
                    situations={this.props.situations}
                    states={this.props.states}
                />
                <LoadBar />
                <EquipmentTable />
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
    />,
    document.getElementById('equipment-list')
);