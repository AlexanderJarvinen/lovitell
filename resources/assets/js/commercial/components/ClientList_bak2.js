var $ = require('jquery');
var React = require('react');
var ReactDOM = require('react-dom');
var Modal = require('react-modal');
var AppActions = require('../../common/actions/AppActions.js');
var LoadBar = require('../../common/components/LoadBar.jsx');
var AddressSelector = require('../../inventory/components/AddressSelector');
var Pagination = require('../../inventory/components/Pagination');
var MaskedInput = require('react-maskedinput');
var ClientsStore = require('../stores/ClientsStore');
var ClientsActions = require('../actions/ClientsActions');

import * as Table from 'reactabular-table';

import AddressSelectorAutocomplete from './AddressSelectorAutocomplete';
import moment from 'moment';
import classNames from 'classnames';

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

var ClientList = React.createClass({
    getColumns: function() {
        return [
            {
                property: 'brand_descr',
                header: {
                    label: 'Бренд'
                },
                cell: {
                    formatters:[
                        (brand_descr, row) => {
                            console.log(this.state.searchType);
                            if (this.state.searchType != 4) {
                                let link = <span className='brandname'>{row.rowData.group ?
                                    this.state.expandRow == row.rowData.true_client_id ?
                                        <i className="fa fa-minus"
                                           onClick={()=>{this.setState({expandRow: 0, client_id: 0, ac_id: 0}, this.loadData)}}></i> :
                                        <i className="fa fa-plus"
                                           onClick={()=>{this.setState({expandRow: row.rowData.true_client_id, client_id:row.rowData.client_id, ac_id: row.rowData.ac_id},this.loadData)}}></i> :
                                    ''
                                } {brand_descr}</span>;
                                return link;
                            } else return brand_descr;
                        }
                    ]
                }
            },
            {
                property: 'client_id',
                header: {
                    label: 'Номер заявки на подключение',
                }
            },
            {
                property: 'client_state_desk',
                header: {
                    label: 'Статус'
                }
            },
            {
                property: 'service_kind_desk',
                header: {
                    label: 'Сервис'
                }
            },
            {
                property: 'ac_id',
                header: {
                    label: 'ЛС'
                }
            },
            {
                property: 'address_type',
                header
                    :
                {
                    label: 'Тип адреса'
                }
            },
            {
                property: 'city',
                header
                    :
                {
                    label: 'Город'
                }
            },
            {
                property: 'region',
                header
                    :
                {
                    label: 'Район'
                }
            },
            {
                property:'street',
                header
                    :
                {
                    label: 'Улица'
                }
            },
            {
                property:'house',
                header
                    :
                {
                    label: 'Дом'
                }
            },
            {
                property:'body',
                header: {
                    label: 'Кор.'
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
                property: 'mobile_no',
                header: {
                    label: 'Абонент'
                }
            },
            {
                property: 'state',
                header: {
                    label: 'Статус'
                }
            },
            {
                property: 'agreement',
                header: {
                    label: 'Мнемоника'
                }
            }

        ]
    },
    renderColumns: function() {
        let columns = this.getColumns();
        let selected_columns = ClientsStore.getColumns();
        let result = [];
        for(let col in columns) {
            if (selected_columns[columns[col].property] && selected_columns[columns[col].property].selected) {
                result.push(columns[col])
            }
        }
        return result;
    },
    getInitialState: function() {
        return {
            searchObject: 1,
            searchType: 1,
            searchString: '',
            search_ac_id: '',
            ac_id: '',
            mobile_no: '',
            phone: '',
            company: '',
            client_id: null,
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
            expandRow: -1
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
    handleEnter: function(e) {
        if (e.keyCode == 13) {
            this.handleSearch();
        }
    },
    renderSearchString: function() {
        switch (this.state.searchType) {
            case 1:
                return <AddressSelector
                    onCityChange={this.handleCityChange}
                    onRegionChange={this.handleRegionChange}
                    onStreetChange={this.handleStreetChange}
                    onBuildChange={this.handleBuildChange}
                    onlyStreet={true}
                    skipFloor={true}
                    skipEntrance={true}
                    search={true}
                    accuracy={1}
                    />;
            case 2:
                return (<input type="text"
                                className={'form-control'}
                                value={this.state.mobile_no}
                                onChange={e=>{this.setState({mobile_no: e.target.value})}}
                                onKeyDown={this.handleEnter}
                    />);
            case 3:
                return (<input type="text"
                        className={'form-control'}
                        value={this.state.phone}
                        onChange={e=>{this.setState({phone: e.target.value})}}
                        onKeyDown={this.handleEnter}
                    />);
            case 4:
                return (<input type="text"
                               className={'form-control'}
                               value={this.state.ac_id}
                               onChange={e=>{this.setState({ac_id: e.target.value})}}
                               onKeyDown={this.handleEnter}
                    />);
            case 5:
                return (<input type="text"
                               className={'form-control'}
                               value={this.state.company}
                               onChange={e=>{this.setState({company: e.target.value})}}
                               onKeyDown={this.handleEnter}
                    />);
        }
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
            searchInit: true,
            total_rows: data.total_rows
        })
    },
    loadData() {
        this.curClientId = 0;
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
                mobile_no: this.state.mobile_no,
                phone: this.state.phone,
                company: this.state.company,
                search_type: this.state.searchType,
                ac_id: this.state.ac_id,
                client_id: this.state.client_id,
                page: this.state.page,
                on_page: this.state.on_page
            },
            success: this.setData
        });
    },
    handleSearch: function() {
        this.setState({page:1, ac_id: this.state.searchType !=4?null:this.state.ac_id, client_id: null},this.loadData);
    },
    curClientId: 0,
    curClass: 'odd-row',
    onRow: function(row, { rowIndex }) {
        this.curClass = row.true_client_id != this.curClientId? this.curClass=='odd-row' ? 'even-row':'odd-row':this.curClass;
        let rowClass = classNames(
            'client-row',
            {'collapsed':this.state.searchType!=4 && this.curClientId==row.true_client_id && this.state.expandRow != row.true_client_id},
            {'client-row__first':this.state.searchType!=4 && this.curClientId!=row.true_client_id},
            {'odd-row': this.curClass == 'odd-row'},
            {'even-row': this.curClass == 'even-row'}
        );
        this.curClientId = row.true_client_id;
        return {
            className: rowClass
        };
    },
    componentDidMount: function() {
        ClientsStore.addParamsChangeListener(this.handleParamsChange);
        ClientsStore.setColumns(this.props.columns);
        let that = this;
        /*document.onkeydown = function(e) {
            e = e || window.event;
            if (e.keyCode == 13) {
                that.handleSearch();
            }
            return true;
        }*/
    },
    componentWillUnmount: function() {
        ClientsStore.removeParamsChangeListener(this.handleParamsChange)
    },
    handleParamsChange: function() {
        this.forceUpdate();
    },
    handleChangeSearchType: function(searchType) {
        if (this.state.searchType != searchType) {
            this.setState({
                searchType,
                mobile_no: '',
                phone: '',
                company: '',
                ac_id: ''
            });
        }
    },
    render: function() {
        let build_table = null;
        if (this.state.searchInit) {
            build_table = (
                <div className="box">
                    <div className="box-header">
                        <h3 className="box-title">Найденные клиенты</h3>
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
                            columns={this.renderColumns()}
                            style={{ overflowX: 'auto' }}
                            >
                            <Table.Header />
                            {this.state.data.length > 0 ?
                                <Table.Body
                                    rows={this.state.data}
                                    rowKey="id"
                                    onRow={this.onRow}
                                    />
                                :
                                <tbody><tr><td colSpan={this.renderColumns().length}>По вашему запросу ничего не найдено</td></tr></tbody>
                            }
                            <CustomFooter
                                columns={this.renderColumns()}
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
                        <div>
                            <div className={'col-sm-6'}>
                                {this.renderSearchString()}
                            </div>
                            <div className={'col-sm-2'}>
                                <button className="btn btn-default" onClick={this.handleSearch}>Поиск</button>
                            </div>
                            <div className={'col-sm-4'}>
                                <a className={"btn btn-app search-type"+(this.state.searchType==1?' active':'')} onClick={()=>{this.handleChangeSearchType(1)}}><i className="fa fa-map-marker"></i></a>
                                <a className={"btn btn-app search-type text-icon one-line"+(this.state.searchType==2?' active':'')} onClick={()=>{this.handleChangeSearchType(2)}}><i>mac</i></a>
                                <a className={"btn btn-app search-type"+(this.state.searchType==3?' active':'')} onClick={()=>{this.handleChangeSearchType(3)}}><i className="fa fa-phone"></i></a>
                                <a className={"btn btn-app search-type text-icon"+(this.state.searchType==4?' active':'')} onClick={()=>{this.handleChangeSearchType(4)}}><i>№<br/>дог.</i></a>
                                <a className={"btn btn-app search-type"+(this.state.searchType==5?' active':'')} onClick={()=>{this.handleChangeSearchType(5)}}><i className="fa fa-user"></i></a>
                            </div>
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
    <ClientList
        columns={ClientsData.columns}
    />,
    document.getElementById('clients-list')
);