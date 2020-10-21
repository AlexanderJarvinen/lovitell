var $ = require('jquery');
var React = require('react');
var ReactDOM = require('react-dom');
var Modal = require('react-modal');
var ClientsStore = require('../stores/ClientsStore');
var ClientsActions = require('../actions/ClientsActions');
var ClientsConstants = require('../constants/ClientsConstants');
var AppActions = require('../../common/actions/AppActions.js');
var LoadBar = require('../../common/components/LoadBar.jsx');
var MaskedInput = require('react-maskedinput');
var AddressSelector = require('../../common/components/AddressSelector.jsx');

import moment from 'moment';
import classNames from 'classnames';

var ClientPageAddressBox = React.createClass({

    propTypes: {
        client: React.PropTypes.object.isRequired
    },

    getInitialState: function () {
        return {
            address_id: this.props.client.address_id,
            entrance: this.props.entrance,
            floor: this.props.floor,
            apartment: this.props.client.apartment,
            phone1: this.props.client.phone1,
            phone2: this.props.client.phone2
        };
    },
    handleSaveClick: function() {
        ClientsActions.saveAddress(this.state);
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
                    <div className="box-body">
                        <AddressSelector
                            address_id={client.address_id}
                            onChange={this.handleAddressChange}
                            state={this.state.address_state}
                            entrance={client.entrance}
                            floor={client.floor}
                            appartment={client.apartment}
                            />
                        <div className="form-group phones">
                            <label>Контактный телефон</label>
                            <MaskedInput className={'form-control'} mask="(111)-111-1111" name="phone1" placeholder="(___)-___-____" onChange={this.handlePhone1Change}/>
                            <MaskedInput className={'form-control'} mask="(111)-111-1111" name="phone2" placeholder="(___)-___-____" onChange={this.handlePhone2Change}/>
                        </div>
                        {this.state.state == 1 ?
                            <button className="btn btn-primary" onClick={this.handleSaveClick}>Сохранить</button>
                            :
                            null
                        }
                    </div>
                </div>
            </div>
        )
    }
});

module.exports = ClientPageAddressBox;

