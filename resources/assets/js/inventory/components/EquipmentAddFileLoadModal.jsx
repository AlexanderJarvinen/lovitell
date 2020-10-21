var $ = require('jquery');
var React = require('react');
var ReactDOM = require('react-dom');
//var Modal = require('react-modal');
import { Modal } from 'react-bootstrap'
var classNames = require('classnames');
var Multiselect = require('react-bootstrap-multiselect');
var InventoryActions = require('../actions/InventoryActions.js');
var InventoryStore = require('../stores/InventoryStore.jsx');
var LoadBar = require('../../common/components/LoadBar.jsx');
var AppActions = require('../../common/actions/AppActions.js');
var ErrorMsg = require('../../common/components/ErrorMsg.jsx');
var LocationSelect = require('./LocationSelect');
var VlanSelect = require('./VlanSelect');
var LinkType = require('./LinkType');

import Draggable from 'react-draggable';
import ModalDialog from 'react-bootstrap/lib/ModalDialog';

var UploadForm = React.createClass({
    getInitialState: function() {
        return {

        }
    },
    changeFile: function() {
        if (typeof this.props.fileField != 'undefined') {
            this.props.fileField(this.refs.equipmentFile.files[0]);
        }
    },
    render: function() {
        return (
            <div className="upload_form">
                <div>
                    <label>Файл с настройками</label>
                    <input type="file"
                        name="paramsFile"
                        title="Загрузить параметры"
                        ref="equipmentFile"
                        accept="application/excel"
                        onChange={this.changeFile}
                    />
                </div>
            </div>
        )
    }
});

class DraggableModalDialog extends React.Component {
    render() {
        return <Draggable handle=".modal-title"><ModalDialog
            backdrop={false}
            enforceFocus={false}
            {...this.props} /></Draggable>
    }
}

var EquipmentAddFileLoadModal = React.createClass({
    getInitialState: function() {
        return {
            count: 0,
            need_location: 0,
            need_linktype: 0,
            error_list: [],
            location_id: 0,
            location_desk: '',
            location_state: 0,
            vlan_id: 0,
            vlan_desk: 0,
            vlan_state: 0,
            link_type: 0,
            file_field: null,
            state: 0,
            system_group: 0,
            ignore_error: [],
            adding_id: 0,
        }
    },
    componentDidMount: function() {
    },
    componentWillReceiveProps: function(np) {
    },
    checkParams: function() {
        if (((this.state.vlan_id !=0 &&
            this.state.location_id !=0)
            || !this.state.need_location) &&
            (this.state.link_type != 0 || !this.state.need_linktype)) {
            this.setState({
                state: 2
            })
        }
    },
    handleUploadFile: function(e) {
        if (this.state.file_field) {
            var file = this.state.file_field;
            if (file) {
                this.upload(file);
            }
        }
    },
    upload: function(file) {
        AppActions.initLoading();
        if (!file) return;
        var fd = new FormData();
        fd.append("equipmentFile", file);
        fd.append("params", this.state.params);
        if (this.props.addressId) {
            fd.append('address_id', this.props.addressId);
        }
        $.ajax({
            beforeSend: function(request) {
                return request.setRequestHeader('X-CSRF-Token', $("meta[name='csrf-token']").attr('content'));
            },
            type: "POST",
            url: "/inventory/ajax/equipment/addfile",
            data: fd,
            contentType: false,
            processData: false,
            success: this.handleFileUploadSuccess,
            error: ()=>AppActions.initError({code: 1, msg:''})
        });
    },
    handleFileUploadSuccess: function(data) {
        AppActions.cancelLoading();
        this.setState({
            need_location: data.need_location,
            need_linktype: data.need_linktype,
            ignore_error: [],
            state: data.error?-1:!data.need_location && ! data.need_linktype? 2: data.system_group>0?1:-3,
            count: data.count,
            adding_id: data.adding_id,
            system_group: data.system_group,
            cyr: data.cyr
        });
    },
    handleLocationChange: function(new_location) {
        this.setState({
            location_id: new_location.location_id,
            location_desk: new_location.location_desk,
            location_state: 1
        }, this.checkParams);
    },
    handleVlanChange: function(vlan) {
        this.setState({
              vlan_id: vlan.vlan_id,
              vlan_desk: vlan.vlan_desk,
              vlan_state: 1
          }, this.checkParams);
    },
    handleLinkTypeChange: function(link_type) {
        this.setState({link_type}, this.checkParams);
    },
    handleSaveResponse: function(data) {
        AppActions.cancelLoading();
        if (data.commit == 1) {
            this.setState({state: data.error==0?4:-2});
        } else {
            let el = data.error_list;
            for(let i in el) {
                el[i].ignore = true;
            }
            this.setState({state: 3, error_list: el});
        }
    },
    handleSave: function() {
        AppActions.initLoading();
        $.ajax({
            beforeSend: function(request) {
                return request.setRequestHeader('X-CSRF-Token', $("meta[name='csrf-token']").attr('content'));
            },
            type: "POST",
            url: "/inventory/ajax/equipment/addfile/"+this.state.adding_id+"/save",
            data: {
                commit: this.state.state==3?1:0,
                ignore_error: this.state.error_list.map(function(x) { if(x.ignore) return x.name; }),
                need_location: this.state.need_location,
                need_linktype: this.state.need_linktype,
                location_id: this.state.location_id,
                link_type: this.state.link_type,
                vlan_id: this.state.vlan_id,
                error_list: this.state.error_list,
                adding_id: this.state.adding_id
            },
            success: this.handleSaveResponse,
            error: ()=>AppActions.initError({code: 1, msg:''})
        });
    },
    fileField: function(file_field) {
        this.setState({
            file_field: file_field
        });
    },
    handleIgnore: function(i, e) {
        this.state.error_list[i].ignore = !this.state.error_list[i].ignore;
    },
    handleClose: function() {
        this.setState(this.getInitialState);
        this.props.handleClose();
    },
    render: function() {
        let content = null;
        switch (this.state.state) {
            case 0:
            content = (
                <UploadForm
                  fileField={this.fileField}
                />);
                break;
            case -1:
            content = (<div className="alert alert-danger">
                    <h4><i className="icon fa fa-ban"></i> Ошибка!</h4>
                        При проверки загружаемого файла c оборудованием возникли ошибки.
                        Скачать результат в XLS <a href={"/inventory/equipment/adding-revision/"+this.state.adding_id} target="_blank"><i className="fa fa-download"></i></a>
                </div>);
                break;
            case -2:
            content =  (<div className="alert alert-danger">
                    <h4><i className="icon fa fa-ban"></i> Ошибка!</h4>
                        При сохранении возникли ошибки.
                        Скачать результат в XLS <a href={"/inventory/equipment/adding-revision/"+this.state.adding_id} target="_blank"><i className="fa fa-download"></i></a>
                </div>);
                break;
            case -3:
                content =  (<div className="alert alert-danger">
                    <h4><i className="icon fa fa-ban"></i> Ошибка!</h4>
                    В файле присутствуют устройства разных типов.
                    Пожалуйста, укажите локацию и VLAN в явном виде и повторите попытку.
                </div>);
                break;
            case 1:
            case 2:
                content = (<div>
                <p><b>{this.state.count}</b> устройств для внесения</p>
                {this.state.need_location?
                    <div>
                        <LocationSelect
                          location_id={this.state.location_id}
                          location_desk={this.state.location_desk}
                          onChange={this.handleLocationChange}
                          state={this.state.location_state}
                        />
                        <VlanSelect
                          vlan_id={this.state.vlan_id}
                          vlan_desk={this.state.vlan_desk}
                          vlan_state={this.state.vlan_state}
                          location={this.state.location_id}
                          system_group={this.state.system_group}
                          onChange={this.handleVlanChange}
                        />
                    </div>
                :null
                }
                {this.state.need_linktype ?
                    <div>
                        <LinkType
                            link_type={this.state.link_type}
                            onChange={this.handleLinkTypeChange}
                            rights={true}
                            />
                    </div>
                    : null
                }
                    {this.state.cyr ?
                        <div className="alert alert-danger">
                            Параметры устройств содержат кириллические символы,
                            которые будут заменены на латинские автоматически.
                        </div>
                     :null
                    }
                </div>);
                break;
            case 3:
                if (this.state.error_list.length>0) {
                    let error_list = this.state.error_list;
                    let table = [];
                    for(let i in error_list) {
                        table.push(
                          <tr key={error_list[i].name+'-error'}>
                              <td>{error_list[i].name}</td>
                              <td className={error_list[i].is_critical?'env-adder__error-critical':''}>{error_list[i].msg+' ('+error_list[i].error+')'}</td>
                              <td><input type='checkbox' checked={error_list[i].ignore} onClick={this.handleIgnore.bind(null, i)}/></td>
                          </tr>
                        );
                    }
                    content=(
                      <div>
                        <h4>Во время проверки были выявлены следующие ошибки:</h4>
                        <table>
                            <thead>
                               <tr><th>Название</th><th>Ошибка</th><th>Игнор.</th></tr>
                            </thead>
                            <tbody>
                                {table}
                            </tbody>
                        </table>
                      </div>
                    );
                } else {
                    content=(
                            <div className="alert alert-success">
                                <h4><i className="icon fa fa-check"></i> Проверка прошла успешно!</h4>
                                Нажмите кнопку "Сохранить" для внесения оборудования.
                            </div>
                    );
                }
                break;
            case 4:
                content = (
                    <div className="alert alert-success">
                        <h4><i className="icon fa fa-check"></i> Изменения сохранены! </h4>
                        Скачать результат в XLS <a href={"/inventory/equipment/adding-revision/"+this.state.adding_id} target="_blank"><i className="fa fa-download"></i></a>
                    </div>
                );
                break;

        }
        var save_btn = null;
        switch (this.state.state) {
            case 0:
                if (this.state.file_field != null) {
                    save_btn = (
                      <button type="button" className="btn btn-primary" onClick={this.handleUploadFile}>
                          Загрузить</button>);
                }
                break;
            case 2:
                save_btn = (
                  <button type="button" className="btn btn-primary" onClick={this.handleSave}>Проверить</button>);
                break;
            case 3:
                save_btn = (
                  <button type="button" className="btn btn-primary" onClick={this.handleSave}>Сохранить</button>);
                break;
        }
        return (
                <Modal
                    dialogComponentClass={DraggableModalDialog}
                    show={this.props.show}
                    onHide={this.handleClose}
                    animation={false}
                    backdrop={false}
                    enforceFocus={false}
                >
                    <Modal.Header closeButton>
                        <Modal.Title>Внесение устройств из файла</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {content}
                    </Modal.Body>
                    <Modal.Footer>
                        {save_btn}
                        <button type="button" className="btn btn-default" onClick={this.handleClose}>Закрыть</button>
                    </Modal.Footer>
                </Modal>

        )
    }
});

module.exports=EquipmentAddFileLoadModal;

