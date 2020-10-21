import * as jquery from 'jquery';
import React, { Component, PropTypes } from 'react'
//var Modal = require('react-modal');
import { Modal } from 'react-bootstrap'
import { classNames } from 'classnames';

import Draggable from 'react-draggable';
import ModalDialog from 'react-bootstrap/lib/ModalDialog';

import UploadForm from '../../common/components/UploadForm';

class DraggableModalDialog extends React.Component {
    render() {
        return <Draggable handle=".modal-title"><ModalDialog
            backdrop={false}
            enforceFocus={false}
            {...this.props} /></Draggable>
    }
}

function declOfNum(number, titles)
{
    let cases = [2, 0, 1, 1, 1, 2];
    return titles[ (number%100>4 && number%100<20)? 2 : cases[(number%10<5)?number%10:5] ];
}

export default class EquipmentChangeFWModal extends Component {

    static PropTypes = {
        onClose: PropTypes.func.isRequired,
        onSave: PropTypes.func.isRequired,
        routes: PropTypes.array.isRequired
    };

    state = {
        params: [],
        file_field: null,
        loaded: false,
        new_params: [],
        table_rows: [],
        state: 0
    };

    componentDidMount = () => {};

    componentWillReceiveProps = (np) => {};

    checkParams = () => {};

    handleChangeParams = (params) => {
        this.setState({
            params: params,
            new_params: []
        });
    };

    handleUploadFile = () => {
        if (this.state.file_field) {
            var file = this.state.file_field;
            if (file) {
                this.upload(file);
            }
        }
    };

    handleFWFileUpload = (data) => {
        if (data.error==0) {
            this.setState({
                state: 1,
            });
        } else {
            this.setState({
                state: -1,
                msg: data.msg
            });
            //Throw error
        }
    };

    upload = (file) => {

        if (!file) return;

        var fd = new FormData();
        fd.append("firmware", file);
        fd.append("routes", this.props.routes.join(','));

        $.ajax({
            beforeSend: function(request) {
                return request.setRequestHeader('X-CSRF-Token', $("meta[name='csrf-token']").attr('content'));
            },
            type: "POST",
            url: "/inventory/ajax/equipment/firmware",
            data: fd,
            contentType: false,
            processData: false,
            success: this.handleFWFileUpload,
            error: function(data) {
                console.log("Upload file error");
            }
        });
    };

    fwFileField = (file_field) => {
        this.setState({
            file_field: file_field
        });
    };

    handleClose = () => {
        this.props.onClose();
//        this.setState(this.getInitialState(), this.props.onClose);
    };

    renderUpload = () => {

    };

    renderDevice = (count) => {

    };

    render = () => {
        let content = null;
        let save_btn = null;
        let msg = null;
        switch (this.state.state) {
            case 0:
                content = (
                    <div>
                        <div className="alert alert-success">
                            <h4><i className="icon fa fa-cogs"></i> {this.props.routes.length} {declOfNum(this.props.routes.length, ['устройство', 'устройства', 'устройств'])} выбрано для смены прошивки!</h4>
                            Выберите файл прошивки и нажмите кнопку "Загрузить"
                        </div>
                        <UploadForm
                            title='Файл прошивки'
                            fieldName='fwFile'
                            fileField={this.fwFileField}
                        />
                    </div>);
                if (this.state.file_field) {
                    save_btn = (<button type="button" className="btn btn-primary" onClick={this.handleUploadFile}>Загрузить</button>);
                }
            break;
            case 1:
                content = (
                  <div>
                      <div className="alert alert-success">
                          <h4><i className="icon fa fa-check"></i> Задание на смену прошивки добавлено в очередь на выполнение.</h4>
                          Вы можете следить за выполнением заданий в нижней части этого экрана
                      </div>
                  </div>
                );
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
                    <Modal.Title>Обновление прошивки устройств</Modal.Title>
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
}

