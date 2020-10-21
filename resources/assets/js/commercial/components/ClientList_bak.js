var $ = require('jquery');
var React = require('react');
var ReactDOM = require('react-dom');
var Modal = require('react-modal');
var AppActions = require('../../common/actions/AppActions.js');
var LoadBar = require('../../common/components/LoadBar.jsx');
var AddressSelector = require('../../inventory/components/AddressSelector');
var Pagination = require('../../inventory/components/Pagination');

import * as Table from 'reactabular-table';

import moment from 'moment';
import classNames from 'classnames';

var columns = [
    {
        property: 'brand',
        header: {
            label: 'Бренд'
        }
    },
    {
        property: 'ac_',
        header: {
            label: 'Договор'
        }
    },
    {
        property:'street',
        header: {
            label: 'Улица'
        }
    },
    {
        property:'house',
        header: {
            label: 'Д.'
        }
    },
    {
        property:'body',
        header: {
            label: 'К.'
        }
    },
    {
        property: 'entrance',
        header: {
            label: 'Под'
        }
    },
    {
        property: 'floor',
        header: {
            label: 'Эт.'
        }
    },
    {
        property:'apartment',
        header: {
            label: 'Кв.'
        }
    },
    {
        property: 'client',
        header: {
            label: 'Клиент'
        }
    },
    {
        property: 'phone',
        header: {
            label: 'Телефон'
        }
    }
];

var ClientList = React.createClass({
    getInitialState: function() {
        return {
            city_id: 0,
            city: '',
            region_id: 0,
            region: '',
            street_id: 0,
            street: '',
            build: '',
            can_search: false,
            data: [],
            page: 1,
            total_rows: 0,
            on_page: 25,
            columns: columns
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
    handleBuildChange: function(build) {
        this.setState({
            build: build
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
    pageChange: function(new_page) {
        this.setState({page: new_page},
            this.loadData);
    },
    setData: function(data) {
        AppActions.cancelLoading();
        this.setState({
            data: data.data,
            total_rows: data.total_rows
        })
    },
    loadData() {
        AppActions.initLoading();
        $.ajax({
            type: "POST",
            beforeSend: function (request) {
                return request.setRequestHeader('X-CSRF-Token', $("meta[name='csrf-token']").attr('content'));
            },
            url: "/commercial/ajax/clients/get",
            data: {
                city_id: this.state.city_id,
                city: this.state.city,
                region_id: this.state.region_id,
                region: this.state.region,
                street_id: this.state.street_id,
                street: this.state.street,
                build: this.state.build,
                page: this.state.page,
                on_page: this.state.on_page
            },
            success: this.setData
        });
    },
    handleSearch: function() {
        this.setState({page:1},this.loadData);
    },
    render: function() {
        let build_table = null;
        if (this.state.data.length>0) {
            build_table = (
                <div className="box">
                    <div className="box-header">
                        <h3 className="box-title">Найденные клиенты <a href={'/inventory/buildings/export?city='+this.state.city+'&region='+this.state.region+'&street='+this.state.street+'&build='+this.state.build}><i className="fa fa-download"></i></a></h3>
                    </div>
                    <div className="box-body">
                        <label for="on_page">Строк на странице:</label>
                        <select name="on_page"
                                value={this.state.on_page}
                                onChange={(e)=>{this.setState({on_page: e.target.value, page: 1}, this.loadData)}}>
                            <option value={10}>10</option>
                            <option value={25}>25</option>
                            <option value={50}>50</option>
                            <option value={100}>100</option>
                            <option value={999999}>Все</option>
                        </select>
                        <Table.Provider
                            className="table table-bordered table-hover dataTable"
                            columns={this.state.columns}
                            style={{ overflowX: 'auto' }}
                            >
                            <Table.Header />

                            <Table.Body
                                rows={this.state.data}
                                rowKey="id"
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
                            onBuildChange={this.handleBuildChange}
                            search={true}
                            accuracy={1}
                            />
                        <div>
                            <button className="btn btn-default" onClick={this.handleSearch}>Поиск</button>
                        </div>
                    </div>
                </div>
                {build_table}
                <LoadBar />
            </div>
        )
    }
});

ReactDOM.render(
    <ClientList />,
    document.getElementById('clients-list')
);