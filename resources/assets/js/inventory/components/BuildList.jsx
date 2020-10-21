var $ = require('jquery');
var React = require('react');
var ReactDOM = require('react-dom');
var Modal = require('react-modal');
var classNames = require('classnames');
var AppActions = require('../../common/actions/AppActions.js');
var LoadBar = require('../../common/components/LoadBar.jsx');
var CitySelect = require('./CitySelect.jsx');
var RegionSelect = require('./RegionSelect.jsx');
var StreetSelect = require('./StreetSelect.jsx');
var BuildSelect = require('./BuildSelect.jsx');
var AddressSelector = require('./AddressSelector');
var Pagination = require('./Pagination');

import * as Table from 'reactabular-table';

var columns = [
    {
        property: 'region_id',
        header: {
            label: 'REG_ID-ID'
        },
        cell: {
            formatters: [
                (region, row) => {
                    return (<span>{region}-{row.rowData.address_id}</span>);
                }
            ]
        }
    },
    {
        property: 'construction_desk',
        header: {
            label: 'Тип адреса'
        }
    },
    {
        property: 'region',
        header: {
            label: 'Район'
        }
    },
    {
        property: 'street',
        header: {
            label: 'Улица'
        }
    },
    {
        property:'house',
        cell: {
            formatters:[
                (house, row) => {
                    let link = <span>{house}</span>;
                    if (row.rowData.view_permissions) {
                        link = (<a target="_blank" href={'/inventory/building/' + row.rowData.address_id}>{house}</a>)
                    }
                    return link;
                }
            ]
        },
        header: {
            label: 'Дом'
        }
    },
    {
        property: 'home_type_desk',
        header: {
            label: 'Тип'
        }
    },
    {
        property: 'home_status_desk',
        header: {
            label: 'Статус'
        }
    },
    {
        property: 'clients',
        header: {
            label: 'Помещений'
        }
    },
    {
        property: 'location_desk',
        header: {
            label: 'Локация'
        }
    }
];

const CustomFooter = ({ columns, page, rows_count, on_page, onChange }) => {
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

var BuildList = React.createClass({
    getInitialState: function() {
        return {
            address_id: '',
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
    handleAddrIdChange: function(e) {
        let address_id = e.target.value.replace(/[^0-9]/g, '')
        this.setState({
            address_id
        })
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
            this.state.street_id != 0 ||
            this.state.address_id) {
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
            url: "/inventory/ajax/buildings/get",
            data: {
                city_id: this.state.city_id,
                city: this.state.city,
                region_id: this.state.region_id,
                region: this.state.region,
                street_id: this.state.street_id,
                street: this.state.street,
                build: this.state.build,
                address_id: this.state.address_id,
                page: this.state.page,
                on_page: this.state.on_page
            },
            success: this.setData
        });
    },
    handleSearch: function() {
        this.setState({page:1},this.loadData);
    },
    curRegId: 0,
    curClass: 'odd-row',
    onRow: function(row, { rowIndex }) {
        console.log(this.curRegId+" "+row.address_id+" "+this.curClass);
        let rowClass = classNames(
            row.address_id==this.curRegId ? this.curClass : this.curClass=='odd-row'?'even-row':'odd-row',
            {'selected-row':row.selected}
        );
        this.curClass = row.address_id!=this.curRegId? this.curClass=='odd-row' ?'even-row':'odd-row':this.curClass;
        this.curRegId = row.address_id;
        return {
            className: rowClass
        };
    },
    render: function() {
        let build_table = null;
        if (this.state.data.length>0) {
            build_table = (
                <div className="box">
                    <div className="box-header">
                        <h3 className="box-title">Найденные дома <a href={'/inventory/buildings/export?city='+this.state.city+'&region='+this.state.region+'&street='+this.state.street+'&build='+this.state.build}><i className="fa fa-download"></i></a></h3>
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
                            onRow={this.onRow}
                        />

                        <CustomFooter
                            columns={this.state.columns}
                            page={this.state.page}
                            rows_count={this.state.total_rows}
                            on_page={this.state.on_page}
                             onChange={this.pageChange}
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
                        <div className="build inputrow">
                            <label>ID дома:</label>
                            <input type="text" value={this.state.address_id} onChange={this.handleAddrIdChange} />
                        </div>
                        <AddressSelector
                            onCityChange={this.handleCityChange}
                            onRegionChange={this.handleRegionChange}
                            onStreetChange={this.handleStreetChange}
                            onBuildChange={this.handleBuildChange}
                            search={true}
                            accuracy={1}
                        />
                        <div>
                            <button className="btn btn-primary" onClick={this.handleSearch}>Поиск</button>
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
    <BuildList />,
    document.getElementById('build_list')
);

