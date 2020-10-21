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

require('react-bootstrap-daterangepicker/css/daterangepicker.css');

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
        action: React.PropTypes.number.isRequired,
        onCLose: React.PropTypes.func.isRequired,
        onAction: React.PropTypes.func.isRequired
    },

    getInitialState: function() {
        return {
            blocktype: BLOCK_VOLUNT,
            datetime: moment()
        }
    },
    handleSubmit: function() {
        this.props.onAction(this.props.action, this.state.blocktype, this.state.datetime);
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
                    <Modal.Title>{this.props.action == 1? 'Блокировка абонента' : 'Разблокировка абонента'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="form-horizontal">
                        <div className="col-md-4">
                            <label>
                                <input type="radio"
                                       onChange={()=>{this.setState({blocktype: BLOCK_FORCE})}}
                                       value={this.state.blocktype == BLOCK_FORCE}
                                    />
                                Принудительно
                            </label>
                        </div>
                        <div className="col-md-4">
                            <label>
                                <input type="radio"
                                       onChange={()=>{this.setState({blocktype: BLOCK_VOLUNT})}}
                                       value={this.state.blocktype == BLOCK_VOLUNT}
                                    />
                                Добровольно
                            </label>
                        </div>
                        <div className="col-md-4">
                            <label>
                                <input type="radio"
                                    onChange={()=>{this.setState({blocktype: BLOCK_TEMP})}}
                                    value={this.state.blocktype == BLOCK_TEMP}
                                />
                                Приостановка
                            </label>
                        </div>
                        <div className="form-group">
                            <label className={'col-md-2'}>Провести с:</label>
                            <div className={'col-md-10'}>
                                <DateRangePicker
                                    startDate={moment()}
                                    singleDatePicker={true}
                                    timePicker={true}
                                    >
                                    <div>Click Me To Open Picker!</div>
                                </DateRangePicker>
                            </div>
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    {save_btn}
                    <button type="button" className="btn btn-default" onClick={this.props.handleClose}>Закрыть</button>
                </Modal.Footer>
            </Modal>
        )
    }
});

module.exports=BlockModal;

