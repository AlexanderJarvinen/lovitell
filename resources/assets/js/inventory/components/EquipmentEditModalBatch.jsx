var $ = require('jquery');
var React = require('react');
var ReactDOM = require('react-dom');
//var Modal = require('react-modal');
import { Modal } from 'react-bootstrap'
var classNames = require('classnames');
var InventoryActions = require('../actions/InventoryActions.js');
var InventoryStore = require('../stores/InventoryStore.jsx');
var LoadBar = require('../../common/components/LoadBar.jsx');
var AppActions = require('../../common/actions/AppActions.js');
var AddressSelector = require('./AddressSelector');
var MacField = require('./MacField');
var IpField = require('./IpField');
var SourceFieldset = require('./SourceFieldset');
var DeskField = require('./DeskField');
var SituationField = require('./SituationField');
import Draggable from 'react-draggable';
import ModalDialog from 'react-bootstrap/lib/ModalDialog';

class DraggableModalDialog extends React.Component {
    render() {
        return <Draggable handle=".modal-title"><ModalDialog
            backdrop={false}
            enforceFocus={false}
            {...this.props} /></Draggable>
    }
}

var EquipmentEditModalBatch = React.createClass({
    getInitialState: function() {
        return {
            state: 0,
            status: 0,
            source: '',
            source_iface: '',
            route_iface: '',
            link_type: 0,
            source_state: 0,
            model: '',
            address_id: 0,
            city_id: 0,
            region_id: 0,
            street_id: 0,
            address_state: 0,
            floor: '',
            build: '',
            entrance: '',
            apartment: '',
            situation: 0,
            situation_desk: '',
            situation_state: 0,
            save_state: 0,
            msg: ''
        }
    },
    componentDidMount: function() {
    },
    componentWillReceiveProps: function(np) {
        this.setState({
            state: 0,
            status: 0,
            source: '',
            source_iface: '',
            route_iface: '',
            link_type: 0,
            source_state: 0,
            model: '',
            address_id: 0,
            city_id: 0,
            region_id: 0,
            street_id: 0,
            address_state: 0,
            floor: '',
            build: '',
            entrance: '',
            apartment: '',
            situation: 0,
            situation_desk: '',
            situation_state: 0,
            save_state: 0,
            msg: ''
        });
    },
    checkParams: function() {
        if (this.state.address_state != 0 ||
            this.state.mac_state != 0 ||
            this.state.source_state != 0) {
            this.setState({
                can_save: true,
                save_state: 1,
                address_state: this.state.address_state>0?1:this.state.address_state,
                mac_state: this.state.mac_state>0?1:this.state.mac_state,
                source_state: this.state.source_state>0?1:this.state.source_state,
                desk_state: this.state.desk_state>0?1:this.state.desk_state
            });
        } else {
            this.setState({
                can_save: false,
                save_state: 1
            })
        }
    },
    handleAddressChange: function(new_address) {
        this.setState({
            address_id: new_address.address_id,
            entrance: new_address.entrance,
            floor: new_address.floor,
            apartment: new_address.apartment,
            address_state: 1
        }, this.checkParams);
    },
    handleSourceChange: function(new_source) {
        this.setState({
            source: new_source.source,
            source_iface: new_source.source_iface,
            route_iface: new_source.route_iface,
            link_type: new_source.link_type,
            source_state: 1
        }, this.checkParams)
    },
    handleSituationChange: function(situation) {
        this.setState({
            situation: situation.situation,
            situation_desk: situation.situation_desk,
            situation_state: 1
        }, this.checkParams)
    },
    handleDeskChange: function(new_desk) {
        this.setState({
            desk:new_desk,
            desk_state: 1
        }, this.checkParams)
    },
    handleSaveAnswer: function(data) {
        console.log(data);
        if (data.commit == 1) {
            if (data.error == 0) {
                this.setState({msg:'Изменения сохранены'}, this.props.handleSave);
            } else {
                this.setState({msg:'Ошибка при сохранении изменений'});
            }
        } else {
            if (data.error == 0) {
                this.setState({
                    mac_state: this.state.mac_state > 0 ? 2 : 0,
                    address_state: this.state.address_state > 0 ? 2 : 0,
                    source_state: this.state.source_state>0? 2 : 0,
                    desk_state: this.state.desk_state>0? 2 : 0,
                    situation_state: this.state.situation_state>0? 2 : 0,
                    save_state: 2
                });
            } else {
                if (data.address.error != 0) {
                    this.setState({
                        address_state: -1
                    });
                }
                if (data.mac.error != 0) {
                    this.setState({
                        mac_state: -1
                    });
                }
                if (data.source.error != 0) {
                    this.setState({
                        source_state: -1
                    });
                }
            }
        }
    },
    handleSaveEquipmentData: function(save) {
        save = save || 0;
        console.log(save);
        $.ajax({
            beforeSend: function (request) {
                return request.setRequestHeader('X-CSRF-Token', $("meta[name='csrf-token']").attr('content'));
            },
            type: 'POST',
            url: '/inventory/ajax/equipment/update/batch',
            data: {
                routes: this.props.routes,
                address_id: this.state.address_id,
                floor: this.state.floor,
                entrance: this.state.entrance,
                apartment: this.state.apartment,
                address_change: this.state.address_state,
                route: this.state.route,
                source: this.state.source,
                source_iface: this.state.source_iface,
                route_iface: this.state.route_iface,
                link_type: this.state.link_type,
                source_change: this.state.source_state,
                desk: this.state.desk,
                desk_change: this.state.desk_state,
                situation: this.state.situation,
                situation_change: this.state.situation_state,
                commit: save
            },
            success: this.handleSaveAnswer
        });
    },
    render: function() {
        var save_btn = null;
        if (this.state.save_state == 1) {
            save_btn=(<button type="button" className="btn btn-primary" onClick={this.handleSaveEquipmentData.bind(null,0)}>Проверить</button>);
        } else if (this.state.save_state == 2) {
            save_btn=(<button type="button" className="btn btn-primary" onClick={this.handleSaveEquipmentData.bind(null,1)}>Сохранить</button>);
        }
        return (
            <Modal
                dialogComponentClass={DraggableModalDialog}
                show={this.props.show}
                onHide={this.props.handleClose}
                animation={false}
                backdrop={false}
                enforceFocus={false}
            >
                <Modal.Header closeButton>
                    <Modal.Title>Оборудование {this.state.route}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <AddressSelector
                        address_id={this.state.address_id}
                        onChange={this.handleAddressChange}
                        state={this.state.address_state}
                        entrance={this.state.entrance}
                        floor={this.state.floor}
                        appartment={this.state.apartment}
                    />
                    <SourceFieldset
                        onChange={this.handleSourceChange}
                        state={this.state.source_state}
                        source={this.state.source}
                        source_iface={this.state.source_iface}
                        route_iface={this.state.route_iface}
                        link_type={this.state.link_type}
                    />
                    <SituationField
                        onChange={this.handleSituationChange}
                        situation={this.state.situation}
                        situation_desk={this.state.situation_desk}
                        state={this.state.situation_state}
                    />
                    <DeskField
                        onChange={this.handleDeskChange}
                        state={this.state.desk_state}
                        desk={this.state.desk}
                    />
                    {this.state.msg!=''?(<div className='msg'>{this.state.msg}</div>):null}
                </Modal.Body>
                <Modal.Footer>
                    {save_btn}
                    <button type="button" className="btn btn-default" onClick={this.props.handleClose}>Закрыть</button>
                </Modal.Footer>
            </Modal>
        )
    }
});

module.exports=EquipmentEditModalBatch;

