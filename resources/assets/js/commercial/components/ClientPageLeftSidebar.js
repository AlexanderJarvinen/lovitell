var $ = require('jquery');
var React = require('react');
var ReactDOM = require('react-dom');
var Modal = require('react-modal');
var ClientsStore = require('../stores/ClientsStore');
var ClientsActions = require('../actions/ClientsActions');
var ClientsConstants = require('../constants/ClientsConstants');
var AppActions = require('../../common/actions/AppActions.js');
var LoadBar = require('../../common/components/LoadBar.jsx');

import moment from 'moment';
import classNames from 'classnames';

var ClientPageLeftSidebar = React.createClass({

    propTypes: {
        client: React.PropTypes.object.isRequired
    },

    getInitialState: function () {
        return {
        };
    },

    render: function () {
        var client = this.props.client;
        console.log(client);
        return (
            <div className="b-client-page__left-sidebar col-md-3">
                <div className="box box-primary">
                    <div className="box-header">
                        <div className="box-title">Адрес</div>
                    </div>
                </div>
                <div className="box-body">
                    <AddressSelector
                        address_id={client.address_id}
                        onChange={this.handleAddressChange}
                        state={this.state.address_state}
                        entrance={client.entrance}
                        floor={client.floor}
                        appartment={client.apartment}
                        />
                    <div className="form-group">
                        <label>Контактный телефон</label>
                        <input type="text" value={client.phone1} />
                        <input type="text" value={client.phone2} />
                    </div>
                    {this.state.state == 1 ?
                        <button className="btn btn-primary">Сохранить</button>
                        :
                        null
                    }
                </div>
            </div>
        )
    }
});

module.exports = ClientPageLeftSidebar;

