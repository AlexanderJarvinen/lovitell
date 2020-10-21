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
var SystemSelect = require('./SystemSelect');
var ModelSelect = require('./ModelSelect');
var SituationField = require('./SituationField');
var LocationSelect = require('./LocationSelect');
var VlanSelect = require('./VlanSelect');
var RouteField = require('./RouteField');

import BrandField from './BrandField';
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
            new_route: '',
            brands: '',
            brand_state: 0,
            route_auto: '',
            route_state: 0,
            type: '',
            ip: '',
            ip_auto: 0,
            mac: '',
            mac_state: 0,
            state: 0,
            status: 0,
            source: '',
            source_iface: '',
            route_iface: '',
            link_type: 0,
            location_id: 0,
            location_desk: '',
            location_state: 0,
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
            vlan_id: 0,
            vlan_desk: '',
            vlan_state: 0,
            model_id: 0,
            model_desk: '',
            model_state: 0,
            desk: '',
            desk_state: '',
            addr_desk: '',
            addr_desk_state: '',
            system_desk: '',
            system_id: 99999,
            system_state: 0,
            system_group: 0,
            save_state: 0,
            msg: '',
            force_save: ''
        }
    },
    componentDidMount: function() {
    },
    componentWillReceiveProps(np) {
        if (this.props.show == false && np.show == true) {
            this.setState(this.getInitialState());
        }
    },
    checkParams: function() {
        if (this.state.route_state != 0 &&
            this.state.address_id != 0 &&
            this.state.location_id != 0 &&
            this.state.system_id != 99999 &&
            this.state.situation != 0 &&
            this.state.model_id != ''
        ) {
            this.setState({
                can_save: true,
                save_state: 1,
                msg: ''
            });
        } else {
            this.setState({
                can_save: false,
                save_state: 0,
                msg: ''
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
            ip_state: 1,
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
    handleAddrDeskChange: function(new_desk) {
        this.setState({
            addr_desk:new_desk,
            addr_desk_state: 1
        }, this.checkParams)
    },
    handleSystemChange: function(new_system) {
        this.setState({
            system_id: new_system.system_id,
            system_desk: new_system.system_desk,
            system_state: 1,
            system_group: new_system.system_group
        }, this.checkParams);
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
            route_auto: route.route_auto,
            route_state: 1
        },this.checkParams);
    },
    handleVlanChange: function(vlan) {
        this.setState({
            vlan_id: vlan.vlan_id,
            vlan_desk: vlan.vlan_desk,
            vlan_state: 1
        },
        this.checkParams);
    },
    handleModelChange: function(model) {
        this.setState({
                model_id: model.model_id,
                model_desk: model.model_desk,
                models_state: 1
            },
            this.checkParams);
    },
    handleSaveAnswer: function(data) {
        if (data.commit == 1) {
            if (data.error == 0) {
                this.setState({
                    msg:'Изменения сохранены',
                    save_state: 0,
                    new_route: '',
                    route_auto: 0,
                    ip: '',
                    ip_auto: 0,
                    source: '',
                    source_iface: '',
                    route_iface: '',
                    link_type: 0,
                    route_state: 0,
                    mac_state: 0,
                    address_state: 0,
                    source_state: 0,
                    desk_state: 0,
                    situation_state: 0,
                    ip_state: 0,
                    location_state: 0,
                    vlan_state: 0
                }, this.props.handleSave);
            } else {
                this.setState({msg:'Ошибка: '+data.msg});
            }
        } else {
            if (data.error == 0) {
                this.setState({
                    route_state: this.state.route_state>0?2:0,
                    mac_state: this.state.mac_state > 0 ? 2 : 0,
                    address_state: this.state.address_state > 0 ? 2 : 0,
                    source_state: this.state.source_state>0? 2 : 0,
                    desk_state: this.state.desk_state>0? 2 : 0,
                    situation_state: this.state.situation_state>0? 2 : 0,
                    ip_state: this.state.ip_state>0? 2 : 0,
                    location_state: this.state.location_state>0? 2:0,
                    vlan_state: this.state.vlan_state>0? 2:0,
                    save_state: 2
                });
            } else {
                if (typeof data.new_route != 'undefined' && data.route.error !=0 ) {
                    this.setState({route_state: -1});
                }
                if (typeof data.mac != 'undefined' && data.mac.error != 0) {
                    this.setState({mac_state: -1});
                }
                if (typeof data.address != 'undefined' && data.address != 0) {
                    this.setState({address_state: -1});
                }
                if (typeof data.source != 'undefined' && data.source.error != 0) {
                    this.setState({source_state: -1});
                }
                if (typeof  data.situation != 'undefined' && data.situation.model.error != 0) {
                    this.setState({situation_state: -1});
                }
                if (typeof data.model != 'undefined' && data.model.error != 0) {
                    this.setState({model_state: -1});
                }
                if (typeof data.location != 'undefined' && data.location.error != 0) {
                    this.setState({location_state: -1});
                }
                if (typeof data.ip_addr != 'undefined' && data.ip_addr.error != 0) {
                    this.setState({ip_state: -1});
                }
                if (typeof data.vlan != 'undefined' && data.vlan.error != 0) {
                    this.setState({vlan_state: -1});
                }
                if (typeof data.brand != 'undefined' && data.brand.error != 0) {
                    this.setState({brand_state: -1});
                }
                this.setState({
                    save_state: -1,
                    msg: 'Ошибка: '+data.msg
                });
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
            url: '/inventory/ajax/equipment/add',
            data: {
                address_id: this.state.address_id,
                floor: this.state.floor,
                entrance: this.state.entrance,
                apartment: this.state.apartment,
                system_id: this.state.system_id,
                model_id: this.state.model_id,
                route: this.state.new_route,
                brands: this.state.brands,
                mac: this.state.mac,
                ip: this.state.ip,
                source: this.state.source,
                source_iface: this.state.source_iface,
                route_iface: this.state.route_iface,
                link_type: this.state.link_type,
                desk: this.state.desk,
                addr_desk: this.state.addr_desk,
                situation_id: this.state.situation,
                vlan_id: this.state.vlan_id,
                location_id: this.state.location_id,
                ignore_error: this.state.force_save?1:0,
                commit: save
            },
            success: this.handleSaveAnswer
        });
    },
    render: function() {
        var save_btn = null;
        if (this.state.save_state == 1) {
            save_btn=(<button type="button" className="btn btn-primary" onClick={this.handleSaveEquipmentData.bind(null,0)}>Проверить</button>);
        } else if (this.state.save_state == 2 || (this.state.save_state == -1 && this.state.force_save)) {
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
                    <Modal.Title>Добавление нового оборудования</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <RouteField
                        new_route={this.state.new_route}
                        route_auto={this.state.route_auto}
                        onChange={this.handleRouteChange}
                        state={this.state.route_state}
                        check_rights={false}
                    />

                    <MacField
                        mac={this.state.mac}
                        onChange={this.handleMacChange}
                        state={this.state.mac_state}
                        check_rights={false}
                    />
                    <SystemSelect
                        system_id={this.state.system_id}
                        system_desk={this.state.system_desk}
                        onChange={this.handleSystemChange}
                        state={this.state.system_state}
                        check_rights={false}
                    />
                    <ModelSelect
                        system_group={this.state.system_group}
                        onChange={this.handleModelChange}
                        model_id={this.state.model_id}
                        model_desk={this.state.model_desk}
                        state={this.state.model_state}
                        check_rights={false}
                    />
                    <LocationSelect
                        location_id={this.state.location_id}
                        location_desk={this.state.location_desk}
                        onChange={this.handleLocationChange}
                        state={this.state.location_state}
                        check_rights={false}
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
                        check_rights={false}
                    />
                    <AddressSelector
                        address_id={this.state.address_id}
                        onChange={this.handleAddressChange}
                        state={this.state.address_state}
                        entrance={this.state.entrance}
                        floor={this.state.floor}
                        appartment={this.state.apartment}
                        check_rights={false}
                        fixModal={true}
                    />
                    <SourceFieldset
                        onChange={this.handleSourceChange}
                        state={this.state.source_state}
                        source={this.state.source}
                        source_iface={this.state.source_iface}
                        route_iface={this.state.route_iface}
                        link_type={this.state.link_type}
                        check_rights={false}
                    />
                    <SituationField
                        onChange={this.handleSituationChange}
                        situation={this.state.situation}
                        situation_desk={this.state.situation_desk}
                        state={this.state.situation_state}
                        check_rights={false}
                    />
                    <DeskField
                        onChange={this.handleDeskChange}
                        state={this.state.desk_state}
                        desk={this.state.desk}
                    />
                    <DeskField
                        onChange={this.handleAddrDeskChange}
                        title={"Комментарии по установке"}
                        state={this.state.addr_desk_state}
                        desk={this.state.addr_desk}
                    />
                    {this.state.msg!=''?(<div className='msg'>{this.state.msg}</div>):null}
                    {this.state.save_state==-1?(<div>
                        <input
                            type='checkbox'
                            value={this.state.force_save}
                            onChange={(e)=>{this.setState({force_save: !this.state.force_save})}}
                        />
                        <label>Игнорировать ошибки</label>
                    </div>):null}
                </Modal.Body>
                <Modal.Footer>
                    {save_btn}
                    <button type="button" className="btn btn-default" onClick={this.props.handleClose}>Закрыть</button>
                </Modal.Footer>
            </Modal>
        )
    }
});

module.exports=EquipmentEditModal;

