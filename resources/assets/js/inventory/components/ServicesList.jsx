var $ = require('jquery');
var React = require('react');
var classNames = require('classnames');
var AppActions = require('../../common/actions/AppActions.js');
var LoadBar = require('../../common/components/LoadBar.jsx');
var ErrorMsg = require('../../common/components/ErrorMsg.jsx');
var ReactDOM = require('react-dom');
var ServiceAddModal = require('./ServiceAddModal');
var ServiceModifyModal = require('./ServiceModifyModal');

import * as Table from 'reactabular-table';

var ServicesList = React.createClass({
    getColumns: function() {
        return [
            {
                property: 'service_id',
                header: {
                    label: 'ID'
                }
            },
            {
                property: 'name',
                header: {
                    label: 'Имя'
                },
                cell: {
                    formatters:[
                        function (service, row) {
                            if (this.props.canModifyService) return (<a onClick={this.selectService.bind(null,row)}>{service}</a>);
                            return <span>{service}</span>
                        }.bind(this)
                    ]
                }
            },
            {
                property: 'desc',
                header: {
                    label: 'Описание'
                }
            },
            {
                property: 'options',
                header: {
                    label: 'Атрибуты'
                },
                cell: {
                    formatters:[
                        function (options, row) {
                            return (
                                <ul>
                                {
                                    options.map(function (option) {
                                            return (<li>{option}</li>)
                                        }
                                    )
                                }
                                </ul>
                            )
                        }
                    ]
            },

            }
        ];
    },
    getInitialState: function() {
        return {
            items: [],
            selected:null,
            showAddService: false,
            showModifyService: false
        }
    },
    setData: function(a) {
        if (a.error == 0) {
            this.setState({
                items: a.data
            })
        }
        AppActions.cancelLoading();
    },
    selectService: function(row) {
        console.log(row);
        this.setState({
            selected: {
                service_id: row.rowData.service_id,
                service_name: row.rowData.name,
                service_desc: row.rowData.desc
            },
            showModifyService: true
        });
    },
    componentDidMount: function() {
        AppActions.initLoading();
        $.ajax({
            type: "GET",
            url: "/inventory/ajax/services",
            success: this.setData
        });
    },
    handleServiceModifySave: function() {
        this.setState({
            selected: {},
            showModifyService: false,
            showAddService: false
        });
        AppActions.initLoading();
        $.ajax({
            type: "GET",
            url: "/inventory/ajax/services",
            success: this.setData
        });
    },
    render: function() {
        return (
            <div className="box">
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
                                rowKey="service_id"
                                />
                            :
                            <tbody><tr><td colSpan={this.getColumns().length}>Нет данных</td></tr></tbody>}
                    </Table.Provider>
                    <ServiceModifyModal
                        service={this.state.selected}
                        show={this.state.showModifyService}
                        can_modifyserviceoption={this.props.can_modifyserviceoption}
                        onSave={this.handleServiceModifySave}
                        onHide={()=>this.setState({
                            selected: {},
                            showModifyService: false
                        })}
                    />
                    {this.props.canAddService?
                        <div className="table-buttons">
                            <ServiceAddModal
                                show={this.state.showAddService}
                                onHide={()=>{this.setState({showAddService: false})}}
                                onSave={this.handleServiceModifySave}
                                />
                            <button
                                className='btn btn-primary add-equipment'
                                onClick={()=>{this.setState({showAddService:true})}}
                                >
                                <i className='fa fa-plus-circle' aria-hidden="true"></i> Добавить ISG-сервис
                            </button>
                        </div>
                        :
                        null
                    }
                </div>
            </div>
        )
    }
});

ReactDOM.render(
    <ServicesList
        canAddService={serviceParams.can_addservice || 0}
        canModifyService={serviceParams.can_modifyservice || 0}
        can_modifyserviceoption={serviceParams.can_modifyserviceoption || 0}
        />,
    document.getElementById('services-list')
);