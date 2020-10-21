import React, { PropTypes, Component } from 'react';
import ModalDialog from 'react-bootstrap/lib/ModalDialog';
import Draggable from 'react-draggable';
var classNames = require('classnames');

import { Modal } from 'react-bootstrap';

class DraggableModalDialog extends Component {
    render() {
        return <Draggable handle=".modal-title"><ModalDialog
            backdrop={false}
            enforceFocus={false}
            {...this.props} /></Draggable>
    }
}

export default class ConfirmModal extends Component {
    static propTypes = {
        handleClose: PropTypes.func.isRequired,
        handleConfirm: PropTypes.func.isRequired,
        msg: PropTypes.string.isRequired
    };
    render() {
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
                    <Modal.Title>Подтверждение удаления</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="alert alert-danger"><h4><i className="icon fa fa-exclamation-triangle"></i> Внимание!</h4>
                        {this.props.msg}
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <button type="button" className="btn btn-danger" onClick={this.props.handleConfirm}>Удалить!</button>
                    <button type="button" className="btn btn-default" onClick={this.props.handleClose}>Закрыть</button>
                </Modal.Footer>
            </Modal>
        );
    }
}

