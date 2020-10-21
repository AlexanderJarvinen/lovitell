var $ = require('jquery');
var React = require('react');
var ReactDOM = require('react-dom');
//var Modal = require('react-modal');
import { Modal } from 'react-bootstrap';
import moment from 'moment';
import {CLIENT_BLOCK, CLIENT_UNBLOCK, BLOCK_FORCE, BLOCK_VOLUNT, BLOCK_TEMP} from '../constants/ClientsConstants.js'
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
        onHide: React.PropTypes.func.isRequired,
        onAction: React.PropTypes.func.isRequired
    },

    getInitialState: function() {
        return {
            blocktype: BLOCK_FORCE,
            datetime: moment()
        }
    },
    handleSubmit: function() {
        this.props.onAction(this.props.action, this.state.blocktype, this.state.datetime);
    },
    handleEvent: function (event, picker) {
        console.log(event);
        console.log(picker);
        this.setState({
            datetime: picker.startDate,
        });
    },
    render: function() {
        return (
            <Modal
                dialogComponentClass={DraggableModalDialog}
                show={this.props.show}
                onHide={this.props.onHide}
                animation={false}
                backdrop={false}
                enforceFocus={false}
            >
                <Modal.Header closeButton>
                    <Modal.Title>{this.props.action == CLIENT_BLOCK? 'Блокировка абонента' : 'Разблокировка абонента'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="form-horizontal">
                        <div className="form-group">
                            <div className="col-md-4">
                                <label>
                                    <input type="radio"
                                           onChange={()=>{this.setState({blocktype: BLOCK_FORCE})}}
                                           checked={this.state.blocktype == BLOCK_FORCE}
                                        />
                                    Принудительно
                                </label>
                            </div>
                            <div className="col-md-4">
                                <label>
                                    <input type="radio"
                                           onChange={()=>{this.setState({blocktype: BLOCK_VOLUNT})}}
                                           checked={this.state.blocktype == BLOCK_VOLUNT}
                                        />
                                    Добровольно
                                </label>
                            </div>
                            <div className="col-md-4">
                                <label>
                                    <input type="radio"
                                        onChange={()=>{this.setState({blocktype: BLOCK_TEMP})}}
                                        checked={this.state.blocktype == BLOCK_TEMP}
                                    />
                                    Приостановка
                                </label>
                            </div>
                        </div>
                        <div className="form-group">
                            <div className={'col-md-4'}>
                                <label className={'control-label'}>
                                    Провести с:
                                </label>
                            </div>
                            <div className={'col-md-8'}>
                                <DateRangePicker
                                    startDate={this.state.datetime}
                                    onEvent={this.handleEvent}
                                    singleDatePicker={true}
                                    timePicker={true}
                                    timePicker24Hour={true}
                                    locale={{
                                        "format": "MM/DD/YYYY",
                                        "separator": " - ",
                                        "applyLabel": "ОК",
                                        "cancelLabel": "Отмена",
                                        "fromLabel": "С",
                                        "toLabel": "По",
                                        "customRangeLabel": "Еще",
                                        "weekLabel": "Н",
                                        "daysOfWeek": [
                                            "Вс",
                                            "Пн",
                                            "Вт",
                                            "Ср",
                                            "Чт",
                                            "Пт",
                                            "Вб"
                                        ],
                                        "monthNames": [
                                            "Январь",
                                            "Февраль",
                                            "Март",
                                            "Апрель",
                                            "Май",
                                            "Июнь",
                                            "Июль",
                                            "Август",
                                            "Сентябрь",
                                            "Октябрь",
                                            "Ноябрь",
                                            "Декабрь"
                                        ],
                                        "firstDay": 1}}
                                    >
                                    <div className={'input-group date'}>
                                        <div className={'input-group-addon'}>
                                            <i className={'fa fa-calendar'}></i>
                                        </div>
                                        <div className="pull-left">
									        <input type="text" className={'form-control pull-left'} value={this.state.datetime.format('DD-MM-YYYY, HH:mm')} />
                                        </div>
                                    </div>
                                </DateRangePicker>
                            </div>
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <button type="button" className="btn btn-primary" onClick={this.handleSubmit}>Применить</button>
                    <button type="button" className="btn btn-default" onClick={this.props.onHide}>Закрыть</button>
                </Modal.Footer>
            </Modal>
        )
    }
});

module.exports=BlockModal;

