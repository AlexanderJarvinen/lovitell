var $ = require('jquery');
var React = require('react');
var ReactDOM = require('react-dom');
//var Modal = require('react-modal');
import { Modal } from 'react-bootstrap'
var classNames = require('classnames');
var LoadBar = require('../../common/components/LoadBar.jsx');
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

var ServiceModifyModal = React.createClass({
    getInitialState: function() {
        return {
            count: 0,
            service_name: this.props.service!=null?this.props.service.service_name:'',
            service_name_state: 0,
            service_desc: this.props.service!=null?this.props.service.service_desc:'',
            service_desc_state: 0,
            state: 0
        }
    },
    checkParams: function() {
        if (this.state.service_name != '' &&
            this.state.service_desc != '') {
            this.setState({
                state: 1
            });
        }
    },
    handleSaveResponse: function(a) {
        if (a.error == 0) {
            this.setState({
                state: 3,
                msg: ''
            }, setInterval(this.props.onSave, 1000));
        } else {
            this.setState({
                state: -1,
                msg: a.msg
            });
        }
    },
    componentWillReceiveProps: function(np) {
        if (np.service) {
            this.setState({
                service_name: np.service.service_name,
                service_desc: np.service.service_desc
            })
        }
    },
    handleSave: function() {
        $.ajax({
            beforeSend: function(request) {
                return request.setRequestHeader('X-CSRF-Token', $("meta[name='csrf-token']").attr('content'));
            },
            type: "POST",
            url: "/inventory/ajax/service/"+this.props.service.service_id+"/modify/",
            data: {
                name: this.state.service_name,
                desc: this.state.service_desc
            },
            success: this.handleSaveResponse,
            error: ()=>AppActions.initError({code: 1, msg:''})
        });
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
                    <Modal.Title>Добавление ISG-сервиса</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className={style}>
                        <label>Название</label>
                        <input className={'form-control'}
                               value={this.state.service_name}
                               onChange={e=>this.setState({service_name: e.target.value}, this.checkParams)}/>
                    </div>
                    <div className={style}>
                        <label>Описание</label>
                        <textarea className={'form-control'}
                               onChange={e=>this.setState({service_desc: e.target.value}, this.checkParams)}
                               value={this.state.service_desc}
                        >
                        </textarea>
                    </div>
                    <i className='fa fa-file-text-o' aria-hidden="true"></i> Добавить параметр
                    {this.state.msg && this.state.state<0?
                        <div className="alert alert-danger">
                            {this.state.msg}
                        </div>
                        :
                        null
                    }
                    {this.state.state==3?
                        <div className="alert alert-success">
                            <h4><i className="icon fa fa-check"></i> Изменения сохранены!</h4>
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

module.exports=ServiceModifyModal;

