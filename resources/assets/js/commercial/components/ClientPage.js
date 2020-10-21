var $ = require('jquery');
var React = require('react');
var ReactDOM = require('react-dom');
var Modal = require('react-modal');
var ClientsStore = require('../stores/ClientsStore');
var ClientsActions = require('../actions/ClientsActions');
var ClientsConstants = require('../constants/ClientsConstants');
var AppActions = require('../../common/actions/AppActions.js');
var LoadBar = require('../../common/components/LoadBar.jsx');
var ClientPageHeader = require('./ClientPageHeader.js');
var ClientPageFinancial = require('./ClientPageFinancial.js');
var ClientPageAddressBox = require('./ClientPageAddressBox.js');

import moment from 'moment';
import classNames from 'classnames';

var ClientPage = React.createClass({

    getInitialState: function () {
        return {
            client: {}
        };
    },

    componentDidMount: function () {
        AppActions.initLoading();
        ClientsStore.addChangeListener(this.onChange);
        ClientsActions.clientRequest(this.props.client_id);
    },

    componentWillUnmount: function () {
        ClientsStore.removeChangeListener(this.onChange);
    },
    onChange: function () {
        this.setState({
            client: ClientsStore.getClient()
        });
    },
    render: function () {
        return (
            <div className="b-client-page">
                <LoadBar />
                <ClientPageHeader client={this.state.client} />
                <div className="row">
                    <ClientPageAddressBox
                        client={this.state.client}
                    />
                    <ClientPageFinancial
                        client={this.state.client}
                    />
                </div>
            </div>
        )
    }
});

ReactDOM.render(
    <ClientPage
        client_id={client_id}
    />,
    document.getElementById('client-page')
);