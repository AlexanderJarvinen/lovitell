var $ = require('jquery');
var React = require('react');
var ReactDOM = require('react-dom');
var Modal = require('react-modal');
var classNames = require('classnames')
var DateRangeSelect = require('../../common/components/DateRangeSelect');

import * as Table from "reactabular-table";

const columns = [
    {
        property: 'id',
        header: {
            label: 'N'
        },
    },
    {
        property: 'apartment',
        header: {
            label: 'Кв.'
        }
    },
    {
        property: 'client',
        header: {
            label: 'Ф.И.О (Название)'
        }
    },
    {
        property: 'desk',
        header: {
            label: 'Статус'
        }
    },
    {
        property: 'ac_id',
        header: {
            label: 'Договор'
        }
    },
    {
        property: 'date',
        header: {
            label: 'Заявка'
        }
    },
    {
        property: 'started',
        header: {
            label: 'Подключен'
        }
    }
];

var Clients = React.createClass({
    propTypes: {
        address_id: React.PropTypes.number
    },
    getInitialState: function() {
        return {
            clients: []
        }
    },
    makeClientList: function(a) {
        if (a.error == 0) {
            this.setState({
                clients: a.data
            })
        } else {

        }
    },
    componentDidMount: function() {
        this.loadClients(this.props.address_id)
    },
    loadClients: function(address_id) {
        $.ajax({
            type: 'GET',
            url: '/inventory/ajax/building/'+address_id+'/clients/',
            success: this.makeClientList
        })
    },
    render: function() {
        let tbody = this.state.clients.length ?
            (<Table.Body
                rows={this.state.clients}
                rowKey="id"
                />)
            :
            (<tbody><tr><td colSpan={7}>Нет информации о клиентах</td></tr></tbody>);
        return(
            <div className="col-md-8">
                <Table.Provider
                  className="table table-bordered table-hover dataTable"
                  columns={columns}
                  style={{ overflowX: 'auto' }}
                  >
                    <Table.Header />
                    {tbody}
                </Table.Provider>
            </div>
        )
    }
});

ReactDOM.render(
    <Clients address_id={BuildingData.address_id}/>,
    document.getElementById('clients-list')
);