var $ = require('jquery');
var React = require('react');
var ReactDOM = require('react-dom');
var Modal = require('react-modal');
var Multiselect = require('react-bootstrap-multiselect');
var classNames = require('classnames');
var Autocomplete = require('react-autocomplete');
var InventoryActions = require('../actions/InventoryActions.js');
var InventoryStore = require('../stores/InventoryStore.jsx');
<EquipmentEditModal
    data={this.state.modalData}
    show={this.state.showEdit}
    handleClose={this.handleClose}
    handleSave={this.handleSave}
/>

import * as Table from 'reactabular-table';

    var columns = [
        {
            property: 'route',
            header: {
                label: 'Name',
            }
        },
        {
            property: 'system_desk',
            header: {
                label: 'Тип'
            }
        },
        {
            property: 'ip_addr',
            header: {
                label: 'IP'
            }
        },
        {
            property: 'mac',
            header: {
                label: 'MAC',
            },
        },
        {
            property: 'source',
            header: {
                label: 'Родитель'
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
            property: 'source_iface',
            header: {
                label: 'Порт'
            },
        },
        {
            property: 'target_iface',
            header: {
                label: 'UPLINK'
            },
        },
        {
            property: 'state_desk',
            header: {
                label: 'Статус',
            },
            cell: {
                formatters: [
                    (state_desk,row) => {
                        return (
                            <div>
                                <span className={'state'+row.rowData.state}>{state_desk+'('+row.rowData.state+')'}</span>
                            </div>
                        )
                    }
                ]
            }
        },
        {
            property: 'situation_desk',
            header: {
                label: 'Состояние'
            }
        },
        {
            property: 'city_desk',
            header: {
                label: 'Город',
            },
        },
        {
            property: 'region_desk',
            header: {
                label: 'Район',
            },
        },
        {
            property: 'street_desk',
            header: {
                label: 'Улица',
            },
        },
        {
            property: 'build',
            header: {
                label: 'Дом',
            }
        },

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
}

var FilterPanel = React.createClass({
    getInitialState: function() {
        var regions=this.props.regions;
        var sel_regions = [];
        for(let i in regions) {
            if (regions[i].selected) {
                sel_regions.push(regions[i].value);
            }
        }
        let sel_cities = [];
        let cities = this.props.cities;
        for(let i in cities) {
            if (cities[i].selected) {
                sel_cities.push(cities[i].value);
            }
        }
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
            city_range: [],
            cities: this.props.cities,
            sel_cities: sel_cities,
            region: '',
            regions: this.props.regions,
            sel_regions: sel_regions,
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
            loading: false,
            source: '',
            mac: '',
            ip_addr: '',
            model: ''
            }
    },
    cityChange: function(e) {
        var cities=this.state.cities;
        var sel_cities=[];
        for(let i in cities) {
            if(cities[i].value == e.val()) {
                cities[i].selected = !cities[i].selected;
            }
            if (cities[i].selected) {
                sel_cities.push(cities[i].value);
            }
        }
        this.setState({
            cities: cities,
            sel_cities: sel_cities
        }, this.updateRegions());
    },
    regionChange: function(e) {
        console.log(e.val());
        var regions=this.state.regions;
        var sel_regions = [];
        for(let i in regions) {
            if(regions[i].value == e.val()) {
                regions[i].selected = !regions[i].selected;
            }
            if (regions[i].selected) {
                sel_regions.push(regions[i].value);
            }
        }
        this.setState({
            regions: regions,
            sel_regions: sel_regions,
            street: ''
        });
    },
    streetDataReceived: function(data) {
        this.setState({
            streets: data,
            loading: false
        })
    },
    streetChange: function(event, value) {
        this.setState({street: value});
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
                regions: this.state.sel_regions
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
        });
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
        });
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
        });
    },
    regionDataReceived: function(data) {
        console.log(data);
        let sel_regions = [];
        for(let i in data) {
            if (data[i].selected) {
                sel_regions.push(data[i].value);
            }
        }
        this.setState({
            regions: data,
            sel_regions: sel_regions,
            street: '',
            streets: []
        });
        this.refs.region_select.syncData();

    },
    searchEquipment: function() {
        InventoryActions.filterChange({
            cities: this.state.sel_cities,
            regions: this.state.sel_regions,
            street: this.state.street,
            systems: this.state.sel_systems,
            states: this.state.sel_states,
            situations: this.state.sel_situations,
            source: this.state.source
        })
    },
    updateRegions: function() {
        console.log('Update region');
        let region_interval = [];
        let cities = this.props.cities;
        for(let i in cities) {
            if(cities[i].selected) {
                region_interval.push(cities[i].value);
            }
        }
        $.ajax({
            beforeSend: function (request) {
                return request.setRequestHeader('X-CSRF-Token', $("meta[name='csrf-token']").attr('content'));
            },
            type: 'POST',
            url: '/inventory/regions/',
            data: ({
                cities: region_interval
            }),
            success: this.regionDataReceived
        });
    },
    citySelectAll: function() {
        var cities=this.state.cities;
        var sel_cities=[];
        for(let i in cities) {
            cities[i].selected = true;
            sel_cities.push(cities[i].value);
        }
        this.setState({
            cities: cities,
            sel_cities: sel_cities
        }, this.updateRegions());
    },
    cityDeselectAll: function() {
        var cities=this.state.cities;
        for(let i in cities) {
            cities[i].selected = false;
        }
        this.setState({
            cities: cities,
            sel_cities: []
        }, this.updateRegions());
    },
    regionSelectAll: function(e) {
        var regions=this.state.regions;
        var sel_regions = [];
        for(let i in regions) {
            regions[i].selected = true;
            sel_regions.push(regions[i].value);
        }
        this.setState({
            regions: regions,
            sel_regions: sel_regions,
            street: ''
        });
    },
    regionDeselectAll: function(e) {
        var regions=this.state.regions;
        var sel_regions = [];
        for(let i in regions) {
            regions[i].selected = false;
        }
        this.setState({
            regions: regions,
            sel_regions: [],
            street: ''
        });
    },
    systemsSelectAll: function(e) {
        var systems=this.state.systems;
        var sel_systems = [];
        for(let i in systems) {
            systems[i].selected = true;
            sel_systems.push(systems[i].value);
        }
        this.setState({
            systems: systems,
            sel_systems: sel_systems
        });
    },
    systemsDeselectAll: function(e) {
        var systems=this.state.systems;
        for(let i in systems) {
            systems[i].selected = false;
        }
        this.setState({
            systems: systems,
            sel_systems: []
        });
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
        });
    },
    statesDeselectAll: function(e) {
        var states=this.state.states;
        for(let i in states) {
            states[i].selected = false;
        }
        this.setState({
            states: states,
            sel_states: []
        });
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
        });
    },
    situationsDeselectAll: function(e) {
        var situations=this.state.situations;
        for(let i in situations) {
            situations[i].selected = false;
        }
        this.setState({
            situations: situations,
            sel_situations: []
        });
    },
    onChange: function() {
        this.setState({
            source: InventoryStore.getSourceVal()
        });
    },
    componentDidMount: function() {
        InventoryStore.addChangeListener(this.onChange);
    },
    render: function() {
        return (
            <div>
                <div className="filter_wrap">
                    <label for="city">Город:</label>
                    <Multiselect
                        data={this.state.cities}
                        onChange={this.cityChange}
                        onSelectAll={this.citySelectAll}
                        onDeselectAll={this.cityDeselectAll}
                        includeSelectAllOption={true}
                        multiple
                    />
                </div>
                <div className="filter_wrap">
                    <label for="regions">Район:</label>
                    <Multiselect
                        onChange={this.regionChange}
                        onSelectAll={this.regionSelectAll}
                        onDeselectAll={this.regionDeselectAll}
                        data={this.state.regions}
                        includeSelectAllOption={true}
                        ref="region_select"
                        multiple
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
                            console.log(value);
                            this.setState({ street: value, streets: [ item ] })
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
                <div className="filter_wrap">
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
                <div className="filter_wrap">
                    <label for="situation">Ситуация:</label>
                    <Multiselect
                        onChange={this.situationChange}
                        onSelectAll={this.situationsSelectAll}
                        onDeselectAll={this.situationsDeselectAll}
                        data={this.state.situations}
                        includeSelectAllOption={true}
                        multiple
                    />
                </div>
                <div className="filter_wrap">
                <label for="state">Состояние:</label>
                    <Multiselect
                        onChange={this.stateChange}
                        onSelectAll={this.statesSelectAll}
                        onDeselectAll={this.statesDeselectAll}
                        data={this.state.states}
                        includeSelectAllOption={true}
                        multiple
                    />
                </div>
                <div className="filter_wrap">
                    <label for="state">Родитель:</label>
                    <input type="text"
                        onChange={(e)=>{this.setState({source: e.target.value})}}
                        value={this.state.source}
                    />
                </div>
                <div className="filter_wrap">
                    <label for="state">IP:</label>
                    <input type="text"
                        onChange={(e)=>{this.setState({ip_addr: e.target.value})}}
                        value={this.state.ip_addr}
                    />
                </div>
                <div className="filter_wrap">
                    <label for="state">MAC:</label>
                    <input type="text"
                        onChange={(e)=>{this.setState({mac: e.target.value})}}
                        value={this.state.mac}
                    />
                </div>
                <div className="filter_wrap">
                    <label for="state">Модель:</label>
                    <input type="text"
                        onChange={(e)=>{this.setState({model: e.target.value})}}
                        value={this.state.model}
                    />
                </div>
                <button onClick={this.searchEquipment} className="btn btn-default">Пoиск</button>
            </div>
        )
    }
});

const CustomFooter = ({ columns, rows_count }) => {
    return (
        <tfoot>
            <tr>
                <td key={'footer'} colSpan={columns.length}>Total rows: {rows_count}</td>
            </tr>
        </tfoot>
    );
};


var EquipmentTable = React.createClass({
    getInitialState: function() {
        return {
            data: [],
            columns: columns
        }
    },
    componentDidMount: function() {
        InventoryStore.addChangeListener(this.onChange);
    },
    onChange: function() {
        this.setState({data: InventoryStore.getTableRows()});
    },
    render: function() {
        return(
            <div>
            <Table.Provider
                className="pure-table pure-table-striped"
                columns={this.state.columns}
                style={{ overflowX: 'auto' }}
            >
                <Table.Header />

                <Table.Body rows={this.state.data} rowKey="id" />

                <CustomFooter columns={this.state.columns} rows_count={this.state.data.length}/>

            </Table.Provider>
        </div>
        )
    }
})

var EquipmentList = React.createClass({
    getInitialState: function() {
        return {
            equipment: [],
            regions: []
        }
    },
    componentDidMount: function() {
    },
    render: function() {
        console.log(this.props.cities);
        return (
            <div className="equipment-list">
                <FilterPanel
                    cities={this.props.cities}
                    systems={this.props.systems}
                    regions={this.props.regions}
                    situations={this.props.situations}
                    states={this.props.states}
                />
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