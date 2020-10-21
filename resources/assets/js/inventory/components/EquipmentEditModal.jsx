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
var LocationSelect = require('./LocationSelect');
var RouteField = require('./RouteField');
var ModelSelect = require('./ModelSelect');
var VlanSelect = require('./VlanSelect');
var SystemSelect = require('./SystemSelect');
var ConfirmDeleteRouteModal = require('./ConfirmDeleteRouteModal');

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

var EquipmentEditModal = React.createClass({
    getInitialState: function() {
        return {
            new_route: this.props.route,
            route_state: 0,
            type: this.props.data.type,
            ip: this.props.data.ip,
            mac: this.props.data.mac,
            mac_state: 0,
            state: this.props.data.state,
            status: this.props.data.status,
            source: this.props.data.source,
            source_iface: this.props.data.source_iface,
            route_iface: this.props.data.route_iface,
            link_type: this.props.data.linktype || 0,
            location_id: this.props.data.location_id || 0,
            location_desk: this.props.data.location_desk || '',
            source_state: 0,
            model_id: this.props.data.model_id,
            model_desk: this.props.model_desk,
            model_state: 0,
            address_id: this.props.data.address_id || 0,
            city_id: this.props.data.city_id || 0,
            region_id: this.props.data.region_id || 0,
            street_id: this.props.data.street_id || 0,
            address_state: 0,
            floor: this.props.data.floor || '',
            build: this.props.data.build || '',
            entrance: this.props.data.entrance || '',
            apartment: this.props.data.apartment ||'',
            situation: this.props.data.situation || 0,
            situation_desk: this.props.data.situation_desk || '',
            situation_state: 0,
            system_id: 0,
            system_desk: '',
            system_group: 0,
            system_state: 0,
            save_state: 0,
            msg: ''
        }
    },
    componentDidMount: function() {
    },
    componentWillReceiveProps(np) {
        this.setState({
            route: np.data.route,
            new_route: np.data.route,
            route_state: 0,
            address_id: np.data.address_id,
            entrance: np.data.entrance,
            floor: np.data.floor,
            apartment: np.data.apartment,
            address_state: 0,
            mac: np.data.mac,
            mac_state: 0,
            model_id: np.data.model_id,
            model_desk: np.data.model_desk,
            model_state:0,
            vlan_id: np.data.vlan_id,
            vlan_desk: np.data.vlan_desk,
            ip: np.data.ip_addr,
            ip_state: 0,
            source: np.data.source,
            source_iface: np.data.source_iface,
            route_iface: np.data.target_iface,
            link_type: np.data.link_type,
            location_id: np.data.location_id,
            location_desk: np.data.location_desk,
            source_state: 0,
            situation: np.data.situation_id,
            situation_desk: np.data.situation_desk,
            situation_state: 0,
            system_id: np.data.system_id,
            system_desk: np.data.system_desk,
            system_group: np.data.system_group,
            system_state: 0,
            desk: np.data.desk,
            desk_state: 0,
            show_delete_confirm: false,
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
                model_state: this.state.model_state>0?1:this.state.model_state,
                location_state: this.state.location_state>0?1:this.state.location_state,
                desk_state: this.state.desk_state>0?1:this.state.desk_state,
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
    handleMacChange: function(new_mac) {
        this.setState({
            mac: new_mac,
            mac_state: 1
        }, this.checkParams);
    },
    handleIpChange: function(new_ip) {
        this.setState({
            ip: new_ip.ip,
            ip_auto: new_ip.ip_auto,
            ip_state: 1
        }, this.checkParams)
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
    handleLocationChange: function(new_location) {
        this.setState({
            location_id: new_location.location_id,
            location_desk: new_location.location_desk,
            location_state: 1
        }, this.checkParams);
    },
    handleRouteChange: function(route) {
        this.setState({
            new_route: route.route,
            route_state: 1
        }, this.checkParams);
    },
    handleVlanChange: function(vlan) {
        this.setState({
                vlan_id: vlan.vlan_id,
                vlan_desk: vlan.vlan_desk,
                ip: '',
                ip_state: 1
            },
            this.checkParams);
    },
    handleModelChange: function(model) {
        this.setState({
                model_id: model.model_id,
                model_desk: model.model_desk,
                model_state: 1
            },
            this.checkParams);
    },
    handleSystemChange: function(new_system) {
        this.setState({
            system_id: new_system.system_id,
            system_desk: new_system.system_desk,
            system_state: new_system.saved?0:1,
            system_group: new_system.system_group
        }, ()=>{ if(!new_system.saved) this.checkParams() } );
    },
    handleSaveAnswer: function(data) {
        if (data.commit == 1) {
            if (data.error == 0) {
                this.setState({msg:'Изменения сохранены'}, this.props.handleSave);
            } else {
                this.setState({msg:'Ошибка при сохранении изменений'});
            }
        } else {
            if (data.error == 0) {
                this.setState({
                    route_state: this.state.route_state>0?2:0,
                    location_state: this.state.location_state>0?2:0,
                    mac_state: this.state.mac_state > 0 ? 2 : 0,
                    system_state: this.state.system_state > 0 ? 2 : 0,
                    model_state: this.state.model_state > 0 ? 2 : 0,
                    address_state: this.state.address_state > 0 ? 2 : 0,
                    source_state: this.state.source_state>0? 2 : 0,
                    desk_state: this.state.desk_state>0? 2 : 0,
                    situation_state: this.state.situation_state>0? 2 : 0,
                    ip_state: this.state.ip_state>0? 2 : 0,
                    save_state: 2
                });
            } else {
                if (data.route.error != 0) {
                    this.setState({
                        route_state: -1
                    });
                }
                if (data.location.error != 0) {
                    this.setState({
                        location_state: -1
                    });
                }
                if (data.address.error != 0) {
                    this.setState({
                        address_state: -1
                    });
                } else {
                    this.setState({
                        address_state: this.state.address_state > 0 ? 2 : 0
                    })
                }
                if (data.mac.error != 0) {
                    this.setState({
                        mac_state: -1
                    });
                } else {
                    this.setState({
                        mac_state: this.state.mac_state > 0 ? 2 : 0
                    })
                }
                if (data.system.error != 0) {
                    this.setState({
                        system_state: -1
                    });
                } else {
                    this.setState({
                        system_state: this.state.system_state > 0 ? 2 : 0
                    })
                }
                if (data.source.error != 0) {
                    this.setState({
                        source_state: -1
                    });
                } else {
                    this.setState({
                        source_state: this.state.source_state>0? 2 : 0
                    });
                }
                if (data.ip.error != 0) {
                    this.setState({
                        ip_state: -1
                    });
                } else {
                    this.setState({
                        ip_state: this.state.ip_state>0? 2 : 0
                    });
                }
                if (data.model.error != 0) {
                    this.setState({
                        model_state: -1
                    });
                } else {
                    this.setState({
                        model_state: this.state.vlan_state>0? 2 : 0
                    });
                }
            }
        }
    },
    handleSaveEquipmentData: function(save) {
        save = save || 0;
        $.ajax({
            beforeSend: function (request) {
                return request.setRequestHeader('X-CSRF-Token', $("meta[name='csrf-token']").attr('content'));
            },
            type: 'POST',
            url: '/inventory/ajax/equipment/update',
            data: {
                address_id: this.state.address_id,
                floor: this.state.floor,
                entrance: this.state.entrance,
                apartment: this.state.apartment,
                address_change: this.state.address_state,
                route: this.state.route,
                new_route: this.state.new_route,
                route_change: this.state.route_state,
                mac: this.state.mac,
                mac_change: this.state.mac_state,
                ip: this.state.ip,
                ip_change: this.state.ip_state,
                model_id: this.state.model_id,
                model_change: this.state.model_state,
                source: this.state.source,
                source_iface: this.state.source_iface,
                route_iface: this.state.route_iface,
                link_type: this.state.link_type,
                source_change: this.state.source_state,
                desk: this.state.desk,
                desk_change: this.state.desk_state,
                situation: this.state.situation,
                situation_change: this.state.situation_state,
                location_id: this.state.location_id,
                location_change: this.state.location_state,
                sytem_id: this.state.system_id,
                system_change: this.state.system_change,
                commit: save
            },
            success: this.handleSaveAnswer
        });
    },
    handleDeleteAnswer: function(data) {
        if (data.error == 0) {
            this.setState({msg:'Изменения сохранены'}, this.props.handleSave);
        } else {
            this.setState({msg:'Ошибка при удалении устройства'});
        }
    },
    handleDelete: function() {
        $.ajax({
            beforeSend: function (request) {
                return request.setRequestHeader('X-CSRF-Token', $("meta[name='csrf-token']").attr('content'));
            },
            type: 'DELETE',
            url: '/inventory/ajax/equipment/'+this.state.route,
            success: this.handleDeleteAnswer,
            error: () => this.setState({show_delete_confirm: false, msg:'Непредвиденная ошибка при удалении устройства'})
        });
    },
    showDeleteConfirm: function() {
       this.setState({
           show_delete_confirm: true
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
                    <RouteField
                        new_route={this.state.new_route}
                        onChange={this.handleRouteChange}
                        state={this.state.route_state}
                    />
                    <MacField
                      mac={this.state.mac}
                      onChange={this.handleMacChange}
                      state={this.state.mac_state}
                    />
                    <SystemSelect
                        onChange={this.handleSystemChange}
                        route={this.state.route}
                        system_id={this.state.system_id}
                        system_desk={this.state.system_desk}
                        state={this.state.system_state}
                        modal_select={true}
                        />
                    <ModelSelect
                        system_group={this.state.system_group}
                        onChange={this.handleModelChange}
                        model_id={this.state.model_id}
                        model_desk={this.state.model_desk}
                        state={this.state.model_state}
                    />
                    <LocationSelect
                        location_id={this.state.location_id}
                        location_desk={this.state.location_desk}
                        onChange={this.handleLocationChange}
                        state={this.state.location_state}
                    />
                    <VlanSelect
                        onChange={this.handleVlanChange}
                        vlan_id={this.state.vlan_id}
                        state={this.state.vlan_state}
                        location={this.state.location_id}
                        system={this.state.system_id}
                        check_rights={false}
                        />
                    <IpField
                        ip={this.state.ip}
                        ip_auto={this.state.ip_auto}
                        location_id={this.state.location_id}
                        vlan_id={parseInt(this.state.vlan_id)}
                        onChange={this.handleIpChange}
                        state={this.state.ip_state}
                      />
                    <AddressSelector
                        address_id={this.state.address_id}
                        onChange={this.handleAddressChange}
                        state={this.state.address_state}
                        entrance={this.state.entrance}
                        floor={this.state.floor}
                        appartment={this.state.apartment}
                        fixModal={true}
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
                </Modal.Body>
                <Modal.Footer>
                    {this.state.msg!=''?(<div className='msg'>{this.state.msg}</div>):null}
                    {save_btn}
                    {this.props.can_deleteroute?
                        <span>
                            <button type="button" className="btn btn-danger" onClick={this.showDeleteConfirm}>Удалить</button>
                            <ConfirmDeleteRouteModal
                                show={this.state.show_delete_confirm}
                                handleClose={()=>this.setState({show_delete_confirm: false})}
                                handleConfirm={this.handleDelete}
                                route={this.state.route}
                            />
                        </span>
                     :null} <button type="button" className="btn btn-default" onClick={this.props.handleClose}>Закрыть</button>
                </Modal.Footer>
            </Modal>
        )
    }
});

module.exports=EquipmentEditModal;

