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
var BlockModal = require('./BlockModal.js');
var TrustPaymentModal = require('./TrustPaymentModal.js');
var NotificationModal = require('./TrustPaymentModal.js');
var TrustPaymentListModal = require('./TrustPaymentModal.js');
var PaymentsTryingListModal = require('./TrustPaymentModal.js');
var BalanceList = require('./TrustPaymentModal.js');
var PaymentsListModal = require('./TrustPaymentModal.js');

export const BLOCK_FORCE='block_force';
export const BLOCK_VOLUNT='block_volunt';
export const BLOCK_TEMP='block_temp';

import moment from 'moment';
import classNames from 'classnames';

var ClientPageFinancial = React.createClass({

    propTypes: {
        client: React.PropTypes.object.isRequired,
        state: React.PropTypes.object.isRequired
    },

    getInitialState: function () {
        return {
            address_id: this.props.client.address_id,
            entrance: this.props.entrance,
            floor: this.props.floor,
            apartment: this.props.client.apartment,
            phone1: this.props.client.phone1,
            phone2: this.props.client.phone2,

            action: ClientsConstants.CLIENT_BLOCK,
            action_type: ClientsConstants.CLIENT_BLOCK,
            showBlock: false,
            showTrustPayment: false
        };
    },
    handleSaveClick: function() {
        const {address_id, entrance, floor, apartment, phone1, phone2} = this.state;
        ClientsActions.saveAddress({
            address_id,
            entrance,
            floor,
            apartment,
            phone1,
            phone2
        });
    },
    handleActionBlock: function(action, type, date) {
        if (action == ClientsConstants.CLIENT_BLOCK) {
            ClientsActions.clientBlock(type, date);
        } else {
            ClientsActions.clientUnblock(type, date);
        }
    },
    render: function () {
        var client = this.props.client;
        return (
            <div className="b-client-page__financial col-md-3">
                <div className="box box-primary">
                    <div className="box-header">
                        <div className="box-title">Финансы</div>
                    </div>
                    <div className="box-body">
                        <div className='b-client-page__financial-controls'>
                            <BlockModal
                                action={this.state.action}
                                show={this.state.showBlock}
                                onHide={()=>{this.setState({showBlock:false})}}
                                onActionBlock={()=>{}}
                                />
                            <button className={'btn btn-block btn-primary'} onClick={()=>{this.setState({action: ClientsConstants.CLIENT_BLOCK, showBlock: true })}}>Блокировать</button>
                            <button className={'btn btn-block btn-primary'} onClick={()=>{this.setState({action: ClientsConstants.CLIENT_UNBLOCK, showBlock: true })}}>Разблокировать</button>
                            <TrustPaymentModal
                                show={this.state.showTrustPayment}
                                onHide={()=>{this.setState({showTrustPayment:false})}}
                                onSave={(credit)=>{
                                        ClientsActions.clientSetCredit(credit);}
                                    }
                                />
                            <button className={'btn btn-block btn-primary'} onClick={()=>{this.setState({showTrustPayment: true})}}>Доверительный платеж</button>
                        </div>
                        <div className='b-client-page__financial-info'>
                            <ul className='list-group b-client-page__financial-menu'>
                                <li className='list-group-item'><i className={'fa fa-user'}></i>Логин к лк: {this.props.client.ac_id || ''}</li>
                                <li className='list-group-item'><i className={'fa fa-unlock-alt'}></i>Пароль к лк: {this.props.client.password || ''}</li>
                                <NotificationModal
                                    show={this.state.showNotifyList}
                                    onHide={()=>{this.setState({showNotifyList:false})}}
                                    onSave={(credit)=>{
                                        ClientsActions.clientSetCredit(credit);}
                                    }
                                    />
                                <li className='list-group-item link' onClick={()=>{this.setState({showNotifyList: true})}}><i className={'fa fa-bell'}></i>Уведомления</li>
                                <TrustPaymentListModal
                                    show={this.state.showTrustPaymentList}
                                    onHide={()=>{this.setState({showTrustPaymentList:false})}}
                                    onSave={(credit)=>{
                                        ClientsActions.clientSetCredit(credit);}
                                    }
                                    />
                                <li className='list-group-item link' onClick={()=>{this.setState({showTrustPaymentList: true})}}><i className={'fa fa-handshake-o'}></i>Доверительный платеж</li>
                                <PaymentsTryingListModal
                                    show={this.state.showPaymentsTryingList}
                                    onHide={()=>{this.setState({showPaymentsTryingList:false})}}
                                    onSave={(credit)=>{
                                        ClientsActions.clientSetCredit(credit);}
                                    }
                                    />
                                <li className='list-group-item link' onClick={()=>{this.setState({showPaymentsTryingList: true})}}><i className={'fa fa-credit-card'}></i>Попытки оплаты</li>
                                <BalanceList
                                    show={this.state.showBalanceList}
                                    onHide={()=>{this.setState({showBalanceList:false})}}
                                    onSave={(credit)=>{
                                        ClientsActions.clientSetCredit(credit);}
                                    }
                                    />
                                <li className='list-group-item link' onClick={()=>{this.setState({showBalanceList: true})}}><i className={'fa'}>$</i>История балансов</li>
                                <PaymentsListModal
                                    show={this.state.showPaymentsListModal}
                                    onHide={()=>{this.setState({showPaymentsListModal:false})}}
                                    onSave={(credit)=>{
                                        ClientsActions.clientSetCredit(credit);}
                                    }
                                    />
                                <li className='list-group-item link' onClick={()=>{this.setState({showPaymentsListModal: true})}}><i className={'fa fa-list-alt'}></i>История платежей</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
});

module.exports = ClientPageFinancial;

