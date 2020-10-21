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

var ClientPageHeader = React.createClass({

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
            <div className="b-client-page__header">
                <div className="col-md-3 col-sm-6 col-xs-12">
                    <div className="info-box">
                        <span className="info-box-icon bg-blue"><i className="fa fa-file-text-o"></i></span>

                        <div className="info-box-content">
                            <span className="info-box-text">№ договора</span>
                            <span className="info-box-number">{client.ac_id}</span>
                        </div>
                    </div>
                </div>
                <div className="col-md-3 col-sm-6 col-xs-12">
                    <div className="info-box">
                        <span className="info-box-icon bg-blue"><i className="fa fa-user"></i></span>

                        <div className="info-box-content">
                            <span className="info-box-text">ФИО</span>
                            <span className="info-box-number">{client.name}</span>
                        </div>
                    </div>
                </div>
                <div className="col-md-3 col-sm-6 col-xs-12">
                    <div className="info-box">
                        <span className="info-box-icon bg-blue"><i className="fa fa-rub"></i></span>

                        <div className="info-box-content">
                            <span className="info-box-text">Баланс</span>
                            <span className="info-box-number">{client.balance}</span>
                        </div>
                    </div>
                </div>
                <div className="col-md-3 col-sm-6 col-xs-12">
                    <div className="info-box">
                        <span className="info-box-icon bg-blue"><i className="fa fa-id-card-o"></i></span>

                        <div className="info-box-content">
                            <span className="info-box-text">{client.service_status}</span>
                            <span className="info-box-number">{client.ac_status}</span>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
});

module.exports = ClientPageHeader;

