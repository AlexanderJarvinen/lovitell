var $ = require('jquery');
var React = require('react');
var ReactDOM = require('react-dom');
var Modal = require('react-modal');
var classNames = require('classnames');
var AppActions = require('../../common/actions/AppActions.js');
var LoadBar = require('../../common/components/LoadBar.jsx');
var AddressSelector = require('./AddressSelector');
var Pagination = require('./Pagination');
import StreetModifyModal from './StreetModifyModal';

import * as Table from 'reactabular-table';

var columns = [
    {
        property: 'street_id',
        header: {
            label: 'ID'
        }
    },
    {
        property: 'desk',
        header: {
            label: 'Улица'
        },
        cell: {
            formatters:[
                (street_desk, row) => {
                    return <span>{row.rowData.prefix} {street_desk}</span>
                }
            ]
        }
    },
    {
        property: 'regions',
        header: {
            label: 'Район'
        },
        cell: {
            formatters:[
                (regions, row) => {
                    return (
                        <ul>
                            {
                                regions.map(function (region) {
                                        return (<li>{region.region_desk}</li>)
                                    }
                                )
                            }
                        </ul>
                    )
                }
            ]
        }
    },
    {
        property: 'city_desk',
        header: {
            label: 'Город'
        }
    }
];

var StreetsList = React.createClass({
    getInitialState: function() {
        return {
            city_id: 0,
            region_id: 0,
            street: '',
            selectedStreet: null,
            showStreetModal: false,
            data: [],
            selected_street: {},
            show_street_change: false,
            show_street_add: false,
            columns: columns,
            save_state: 0,
            msg: ''
        }
    },
    handleCityChange: function(city) {
        this.setState({
            city_id: city.city_id,
            city: city.city
        }, this.checkParams);
    },
    handleRegionChange: function(region) {
        this.setState({
            region: region.region,
            region_id: region.region_id
        }, this.checkParams);
    },
    handleStreetChange: function(street) {
        this.setState({
            street: street.street,
            street_id: street.street_id,
            build: ''
        }, this.checkParams);
    },
    checkParams: function() {
        if (this.state.city_id != 0 ||
            this.state.region_id != 0 ||
            this.state.street_id != 0 ) {
            this.setState({
                can_search: true
            })
        } else {
            this.setState({
                can_search: false
            });
        }
    },
    hideModal: function() {
        this.setState({
            show_street_change: false,
            show_street_add: false
        })
    },
    setData: function(data) {
        AppActions.cancelLoading();
        this.setState({
            data: data.data,
        })
    },
    loadData: function(city_id, region_id) {
        AppActions.initLoading();
        $.ajax({
            type: "POST",
            beforeSend: function (request) {
                return request.setRequestHeader('X-CSRF-Token', $("meta[name='csrf-token']").attr('content'));
            },
            url: "/inventory/ajax/streets/search",
            data: {
                city_id: city_id || this.state.city_id,
                region_id: region_id || this.state.region_id,
                street: this.state.street
            },
            success: this.setData
        });
    },
    handleSearch: function() {
        this.loadData();
    },
    handleStreetModify: function() {
        this.loadData();
    },
    onSelectRow: function(row) {
        if (this.props.modify_street_rights) {
            this.setState({
                selectedStreet: {
                    id: row.street_id,
                    desk: row.desk,
                    city_id: row.city_id,
                    city: row.city_desk,
                    prefix_id: row.prefix_id,
                    regions: row.regions.map((region) => {
                        return region.id
                    })
                }, showStreetModal: true
            });
        }
    },
    curClass: 'odd-row',
    onRow: function(row, { rowIndex }) {
        this.curClass = this.curClass=='odd-row'?'even-row':'odd-row';
        return {
            className: classNames(
                this.curClass,
                {'selected-row':row.selected}
            ),
            onDoubleClick: () => this.onSelectRow(row)
        };
    },
    handleStreetSave: function(street, close) {
        let url = '/inventory/ajax/street/'+(street.id != 0?street.id:'');
        $.ajax({
            method: street.id != 0?'POST':'PUT',
            url: url,
            beforeSend: function (request) {
                return request.setRequestHeader('X-CSRF-Token', $("meta[name='csrf-token']").attr('content'));
            },
            data: {
                street_name: street.desk,
                street_type: street.prefix,
                regions: street.regions,
                city_id: street.city_id,
                region_changed: street.region_changed,
                desk_changed: street.desk_changed
            },
            success: (data) => {
                this.handleStreetSaveSuccess(data, street, close)
            }
        });
    },
    handleStreetSaveSuccess: function(data, street, stayOpened) {
        if (data.error == 0) {
            this.setState({
                selectedStreet: null,
                city_id: street.city_id || 0,
                region_id: street.regions[0] || 0,
                save_state: 2,
                showStreetModal: stayOpened
            });
            if (!stayOpened) {
                this.loadData(street.city_id, street.regions[0])
            }
        } else {
            this.setState({
                selectedStreet: {
                    street_id: 0,
                    desk: street.desk,
                    city_id: street.city_id,
                    prefix_id: street.prefix,
                    regions: street.regions
                },
                save_state: -1,
                msg: data.msg
            })
        }
    },
    render: function() {
        let street_table = null;
        if (this.state.data.length>0) {
            street_table = (
                <div className="box">
                    <div className="box-header">
                        <h3 className="box-title">Найденные улицы <a href={'/inventory/streets/export?city_id='+this.state.city_id+'&region_id='+this.state.region_id+'&street='+this.state.street}><i className="fa fa-download"></i></a></h3>
                    </div>
                    <div className="box-body">
                        <Table.Provider
                            className="table table-bordered table-hover dataTable"
                            columns={this.state.columns}
                            style={{ overflowX: 'auto' }}
                        >
                        <Table.Header />

                        <Table.Body
                            rows={this.state.data}
                            rowKey="street_id"
                            onRow={this.onRow}
                        />
                        </Table.Provider>
                    </div>
                </div>
            );
        }
        return (
            <div>
                <div className="box">
                    <div className="box-body">
                        <AddressSelector
                            onCityChange={this.handleCityChange}
                            onRegionChange={this.handleRegionChange}
                            onStreetChange={this.handleStreetChange}
                            search={true}
                            accuracy={0}
                        />
                        <div>
                            <button className="btn btn-default" onClick={this.handleSearch}>Поиск</button>
                        </div>
                    </div>
                </div>
                {street_table}
                <LoadBar />
                {this.props.new_street_rights?<button
                    onClick={()=>this.setState({
                            showStreetModal: !this.showStreetModal,
                            selectedStreet: null,
                            save_state: 0,
                            msg: ''
                        })}
                        className={'btn btn-primary'}
                    >
                    Добавить улицу
                </button>:null}
                {this.props.new_street_rights || this.props.modify_street_rights?
                <StreetModifyModal
                    street={this.state.selectedStreet}
                    show={this.state.showStreetModal}
                    onHide={()=>{this.setState({showStreetModal: false})}}
                    onSave={this.handleStreetSave}
                    state={this.state.save_state}
                    msg={this.state.msg}
                    />
                    :null}
            </div>
        )
    }
});

ReactDOM.render(
    <StreetsList
        prefixes={Street.prefixes}
        new_street_rights={Street.new_street_rights}
        modify_street_rights={Street.modify_street_rights}
        />,
    document.getElementById('streets-list')
);

