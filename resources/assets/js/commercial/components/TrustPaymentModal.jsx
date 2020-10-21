var $ = require('jquery');
var React = require('react');
var ReactDOM = require('react-dom');
//var Modal = require('react-modal');
import { Modal } from 'react-bootstrap';
import moment from 'moment';
import {BLOCK_FORCE, BLOCK_VOLUNT, BLOCK_TEMP} from '../constants/ClientsConstants.js'
var classNames = require('classnames');
var LoadBar = require('../../common/components/LoadBar.jsx');
var AppActions = require('../../common/actions/AppActions.js');
var DateRangePicker = require('react-bootstrap-daterangepicker');

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

var BlockModal = React.createClass({

    propTypes: {
        credit: React.PropTypes.string.isRequired,
        onCLose: React.PropTypes.func.isRequired,
        onSave: React.PropTypes.func.isRequired
    },
    getInitialState: function() {
        return {
            newCredit: this.props.credit,
            saveState: 0
        }
    },
    handleSubmit: function() {
        this.props.onSave(this.state.newCredit);
    },
    handleClose: function() {
        this.props.onClose();
    },
    render: function() {
        var save_btn = null;
        if (this.state.saveState == 1) {
            save_btn=(<button type="button" className="btn btn-primary" onClick={this.handleSubmit}>Сохранить</button>);
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
                    <Modal.Title>Доверительный платеж</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="form-horizontal">
                        <div className="form-group">
                            <label className={'col-md-2'}>Текущий кредит:</label>
                            <div className={'col-md-10'}>
                               <input className={'form-control'}
                                      type="text"
                                      value={this.props.credit}
                                      disabled={true}
                                   />
                            </div>
                        </div>
                        <div className="form-group">
                            <label className={'col-md-2'}>Сменить на:</label>
                            <div className={'col-md-10'}>
                                <input className={'form-control'}
                                       type="text"
                                       value={this.state.newCredit}
                                       onChange={e=>this.setState({newCredit: e.target.value, saveState: 1})}
                                    />
                            </div>
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    {save_btn}
                    <button type="button" className="btn btn-default" onClick={this.handleClose}>Закрыть</button>
                </Modal.Footer>
            </Modal>
        )
    }
});

module.exports=BlockModal;

