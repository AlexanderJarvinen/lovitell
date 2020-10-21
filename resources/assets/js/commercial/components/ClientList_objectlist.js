var $ = require('jquery');
var React = require('react');
var ReactDOM = require('react-dom');
var Modal = require('react-modal');
var AppActions = require('../../common/actions/AppActions.js');
var LoadBar = require('../../common/components/LoadBar.jsx');
var AddressSelector = require('../../inventory/components/AddressSelector');
var Pagination = require('../../inventory/components/Pagination');
var ClientSearchPanel = require('./');

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
        property: 'ac_id',
        header: {
            label: 'Договор'
        }
    },
    {
        property: 'city',
        header: {
            label: 'Город'
        }
    },
    {
        property: 'region',
        header: {
            label: 'Район'
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
            label: 'П.'
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
            label: 'ФИО'
        }
    },
    {
        property: 'phone',
        header: {
            label: 'Телефон'
        }
    },
    {
        property: 'status',
        header: {
            label: 'Статус'
        }
    }
];

var ClientList = React.createClass({
    getInitialState: function() {
        return {
            searchBase: 0,
            searchButton: 1,
            searchString: '',
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
            data: data.data
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
                search_string: this.state.search_string,
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
                        <select value={this.state.searchBase} onChange={(e)=>{this.setState({searchBase: e.target.value})}}>
                            <option value={1}>Дома</option>
                            <option value={2}>Заявки</option>
                            <option value={3}>Биллинг</option>
                            <option value={4}>Проблемы</option>
                            <option value={5}>Обращения</option>
                            <option value={6}>Наряды</option>
                        </select>
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