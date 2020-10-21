var $ = require('jquery');
var React = require('react');
import ModalDialog from 'react-bootstrap/lib/ModalDialog';
import Draggable from 'react-draggable';
var classNames = require('classnames');

import * as Table from 'reactabular-table';

import { Modal } from 'react-bootstrap';

class DraggableModalDialog extends React.Component {
    render() {
        return <Draggable handle=".modal-title"><ModalDialog
            backdrop={false}
            enforceFocus={false}
            {...this.props} /></Draggable>
    }
}

var ConfirmDeleteRouteModal = React.createClass({
    getInitialState: function() {
        return {
            delete_confirm: false,
        }
    },
    render: function() {
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
                    <div className="alert alert-danger">
                        <h4><i className="icon fa fa-exclamation-triangle"></i> Внимание!</h4>
                        Удаление необратимо! Вы уверены, что хотите удалить устройство <b>{this.props.route}</b>?
                    </div>
                    <div className="form-group">
                        <input
                            name="agree"
                            type="checkbox"
                            checked={this.state.delete_confirm}
                            onChange={()=>this.setState({delete_confirm: !this.state.delete_confirm})}
                        /> <label for="agree">Я подтверждаю удаление устройства <b>{this.props.route}</b></label>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    {this.state.delete_confirm?
                        <button type="button" className="btn btn-primary" onClick={this.props.handleConfirm}>ОК</button>
                        :
                        null
                    }
                    <button type="button" className="btn btn-default" onClick={this.props.handleClose}>Закрыть</button>
                </Modal.Footer>
            </Modal>
        );
    }
});

module.exports=ConfirmDeleteRouteModal;