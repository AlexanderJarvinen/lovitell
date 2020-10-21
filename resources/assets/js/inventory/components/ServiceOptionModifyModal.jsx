var $ = require('jquery');
var React = require('react');
var ReactDOM = require('react-dom');
//var Modal = require('react-modal');
import { Modal } from 'react-bootstrap'
var classNames = require('classnames');
var LoadBar = require('../../common/components/LoadBar.jsx');
var ErrorMsg = require('../../common/components/ErrorMsg.jsx');
var AppActions = require('../../common/actions/AppActions.js');
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

var ServiceOptionModifyModal = React.createClass({
    getDefaultProps: function() {
        return {
            option_id: 0
        }
    },
    getInitialState: function() {
        return {
            option: this.props.option || '',
            option_state: 0,
            value: this.props.value || '',
            value_state: 0,
            operator: this.props.operator || '=',
            operator_state: 0,
            state: 0
        }
    },
    checkParams: function() {
        if (this.state.option != '' &&
            this.state.value != '') {
            this.setState({
                state: 1
            });
        }
    },
    componentWillReceiveProps: function(np) {
        if (this.props.option_id != np.option_id) {
            this.setState({
                value: np.value,
                value_state: 0,
                option: np.option,
                option_state: 0,
                operator: np.operator,
                operator_state: 0,
                state: 0
            });
        }
    },
    handleSaveResponse: function(a) {
        if (a.error == 0) {
            this.setState({
                state: 3,
                msg: ''
            }, setTimeout(this.props.onSave, 1000));
        } else {
            this.setState({
                state: -1,
                msg: a.msg
            });
        }
    },
    handleSave: function() {
        if (this.props.service_id) {
            if (this.props.option_id) {
                $.ajax({
                    beforeSend: function (request) {
                        return request.setRequestHeader('X-CSRF-Token', $("meta[name='csrf-token']").attr('content'));
                    },
                    type: "POST",
                    url: "/inventory/ajax/service/" + this.props.service_id + "/option/" + this.props.option_id,
                    data: {
                        option: this.state.option,
                        operator: this.state.operator,
                        value: this.state.value
                    },
                    success: this.handleSaveResponse,
                    error: ()=>AppActions.initError({code: 1, msg: ''})
                });
            } else {
                $.ajax({
                    beforeSend: function (request) {
                        return request.setRequestHeader('X-CSRF-Token', $("meta[name='csrf-token']").attr('content'));
                    },
                    type: "PUT",
                    url: "/inventory/ajax/service/" + this.props.service_id + "/option",
                    data: {
                        option: this.state.option,
                        operator: this.state.operator,
                        value: this.state.value
                    },
                    success: this.handleSaveResponse,
                    error: ()=>AppActions.initError({code: 1, msg: ''})
                });
            }
        }
    },
    handleClose: function() {
        this.setState(this.getInitialState);
        this.props.onHide();
    },
    render: function() {
        let style = classNames(
            'form-group',
            {'changed': this.props.state==1},
            {'cansave': this.props.state==2},
            {'saved': this.props.state==3},
            {'error': this.props.state==-1}
        );
        var save_btn = null;
        switch (this.state.state) {
            case 1:
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
                        <Modal.Title>{this.props.option_id?'Редактирование параметра '+this.props.option_id:'Добавление параметра для ISG-сервиса'}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className={style}>
                            <label>Название</label>
                            <input className={'form-control'}
                                   value={this.state.option}
                                   onChange={e=>this.setState({option: e.target.value}, this.checkParams)}/>
                        </div>
                        <div className={style}>
                            <label>Оператор</label>
                            <select
                                value={this.state.operator}
                                onChange={(e)=>this.setState({operator: e.target.value}, this.checkParams)}
                            >
                                <option>=</option>
                                <option>+=</option>
                            </select>
                        </div>
                        <div className={style}>
                            <label>Значение</label>
                            <input className={'form-control'}
                                   onChange={e=>this.setState({value: e.target.value}, this.checkParams)}
                                   value={this.state.value}
                            />
                        </div>
                        {this.state.msg && this.state.state<0?
                            <div className="alert alert-danger">
                                {this.state.msg}
                            </div>
                            :
                            null
                        }
                        {this.state.state==3?
                            <div className="alert alert-success">
                                <h4><i className="icon fa fa-check"></i> {this.props.option_id?'Параметр успешно изменен':'Параметр успешно добавлен!'}</h4>
                            </div>
                            :
                            null
                        }
                    </Modal.Body>
                    <Modal.Footer>
                        {save_btn}
                        <button type="button" className="btn btn-default" onClick={this.handleClose}>Закрыть</button>
                    </Modal.Footer>
                </Modal>
        )
    }
});

module.exports=ServiceOptionModifyModal;

