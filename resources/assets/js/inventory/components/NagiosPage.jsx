var $ = require('jquery');
var React = require('react');
var ReactDOM = require('react-dom');
//var Modal = require('react-modal');
import { Modal } from 'react-bootstrap'
var classNames = require('classnames');
var LoadBar = require('../../common/components/LoadBar.jsx');
var ErrorMsg = require('../../common/components/ErrorMsg.jsx');
var AppActions = require('../../common/actions/AppActions.js');
import Draggable from 'react-draggable';
import ModalDialog from 'react-bootstrap/lib/ModalDialog';

import * as Table from 'reactabular-table';


var NagiosCrashesTable = React.createClass({
    getColumns: function() {
        return [
            {
                property: 'route',
                header: {
                    label: 'Имя'
                },
                cell: {
                    formatters:[
                        (route, row) => {
                            return (<span className={'system system'+row.rowData.system}>{route}</span>);
                        }
                    ]
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
                property: 'house',
                header: {
                    label: 'Д.'
                }
            },
            {
                property:'qty',
                header: {
                    label: 'Количество'
                }
            },
            {
                property: 'duration',
                header: {
                    label: 'Простой (мин.)'
                }
            }
        ];
    },
    getInitialState: function() {
        return {
            items: []
        }
    },
    handleFlapsInfo: function(a) {
        if (a.error==0) {
            this.setState({
                items: a.data
            })
        }
    },
    getCrashesInfo: function() {
        $.ajax({
            method: "GET",
            url: "/inventory/ajax/nagios/crashes",
            success: this.handleFlapsInfo
        })
    },
    componentDidMount: function() {
        this.getCrashesInfo();
        setInterval(this.getCrashesInfo, 60000);
    },
    onRow: function(row, rowIndex) {
        return {
            className: rowIndex.rowIndex % 2 ? 'odd-row' : 'even-row'
        }
    },
    render: function() {
        return (
            <div className="col-md-6 col-sm-12 nagios-table__wrap">
                <div className="box">
                    <div className="box-header">
                        <h3>Текущие аварии</h3>
                    </div>
                    <div className="box-body">
                        <Table.Provider
                            className="table table-bordered table-hover dataTable"
                            columns={this.getColumns()}
                            style={{ overflowX: 'auto' }}
                            >
                            <Table.Header />
                            {this.state.items.length>0?
                                <Table.Body
                                    rows={this.state.items}
                                    rowKey="id"
                                    onRow={this.onRow}
                                    />
                                :
                                <tbody><tr><td colSpan={this.getColumns().length}>Нет данных</td></tr></tbody>}
                        </Table.Provider>
                    </div>
                </div>
            </div>
        )
    }
});

var NagiosFlapsTable = React.createClass({
    getColumns: function() {
        return [
            {
                property: 'route',
                header: {
                    label: 'Имя'
                },
                cell: {
                    formatters:[
                        (route, row) => {
                            return (<span className={'system system'+row.rowData.system}>{route}</span>);
                        }
                    ]
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
                property: 'house',
                header: {
                    label: 'Д.'
                }
            },
            {
                property:'qty',
                header: {
                    label: 'Количество'
                }
            },
            {
                property: 'last_date',
                header: {
                    label: 'Последняя дата'
                }
            }
        ];
    },
    getInitialState: function() {
        return {
            items: []
        }
    },
    handleFlapsInfo: function(a) {
        if (a.error==0) {
            this.setState({
                items: a.data
            })
        }
    },
    getFlapsInfo: function() {
        $.ajax({
            method: "GET",
            url: "/inventory/ajax/nagios/flaps/"+this.state.type,
            success: this.handleFlapsInfo
        })
    },
    componentDidMount: function() {
        this.getFlapsInfo();
        setInterval(this.getFlapsInfo, 60000);
    },
    onRow: function(row, rowIndex) {
        return {
            className: rowIndex.rowIndex % 2 ? 'odd-row' : 'even-row'
        }
    },
    render: function() {
        return (
            <div className="col-md-6 col-sm-12 nagios-table__wrap">
                <div className="box">
                    <div className="box-header">
                        <h3>Количество включений/отключений за последние 24 часа (30 худших)</h3>
                    </div>
                    <div className="box-body">
                        <div className="form-group form-horizontal">
                            <label className="control-label col-sm-4 col-lg-3">
                                Тип устройства:
                            </label>
                            <div className="col-sm-8 col-lg-9">
                                <select
                                    value={this.state.type}
                                    onChange={(e)=>{this.setState({type: e.target.value}, this.getFlapsInfo)}}>
                                        {this.props.types.map(function(item) {
                                            return <option value={item.type}>{item.desk}</option>
                                        })}
                                </select>
                            </div>
                        </div>
                        <Table.Provider
                            className="table table-bordered table-hover dataTable"
                            columns={this.getColumns()}
                            style={{ overflowX: 'auto' }}
                            >
                            <Table.Header />
                            {this.state.items.length>0?
                                <Table.Body
                                    rows={this.state.items}
                                    rowKey="id"
                                    onRow={this.onRow}
                                    />
                                :
                                <tbody><tr><td colSpan={this.getColumns().length}>Нет данных</td></tr></tbody>}
                        </Table.Provider>
                    </div>
                </div>
            </div>
        )
    }
});

var NagiosPage = React.createClass({
    render: function() {
        return (
            <div className="row">
                <NagiosCrashesTable />
                <NagiosFlapsTable
                    types={this.props.types}
                />
                <ErrorMsg />
            </div>
        )
    }
});

ReactDOM.render(
    <NagiosPage
        types={NagiosData.types}
    />,
    document.getElementById('nagios-wrap')
);

