var $ = require('jquery');
var React = require('react');
var classNames = require('classnames');
import { Modal } from 'react-bootstrap'

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

var SystemSelectModal = React.createClass({
    getDefaultProps: function() {
        return {
            system_id: 99999,
            system_desk: ''
        }
    },
    getInitialState: function() {
        return {
            system_id: this.props.system_id,
            system_group: this.props.system_group,
            msg: '',
            state: 0
        }
    },
    makeSystemList: function(data) {
        if (data.error == 0) {
            let systems = [];
            systems.push(<option key={0} id={0} value={99999}>Не выбран</option>);
            for (var i = 0; i < data.data.length; i++) {
                var option = data.data[i];
                systems.push(
                    <option key={i + 1} value={option.system} data-group={option.type}>{option.desk}</option>
                );
            }
            this.setState({
                rights: true,
                systems: systems
            });
        } else {
            this.setState({
                rights: false
            })
        }
    },
    handleSaveAnswer: function(data) {
        if (data.error == 0) {
            this.setState({
                state: this.state.state==1?2:3,
                msg: this.state.state==2?'Изменения сохранены. Окно закроется через 5 секунд.':''
            }, ()=>{
                if (this.state.state==3) {
                    this.props.onSave({
                        system_id: this.state.system_id,
                        system_desk: this.state.system_desk,
                        system_group: this.state.system_group
                    });
                    this.handleClose();
                }
            });
        } else {
            this.setState({
                state: -1,
                msg: data.msg
            });
        }
    },
    handleSystemSave: function(save) {
        save = save || 0;
        $.ajax({
            beforeSend: function (request) {
                return request.setRequestHeader('X-CSRF-Token', $("meta[name='csrf-token']").attr('content'));
            },
            type: 'POST',
            url: '/inventory/ajax/equipment/set-system',
            data: {
                route: this.props.route,
                system: this.state.system_id,
                commit: save
            },
            success: this.handleSaveAnswer
        });
    },
    handleSystemChange: function(e) {
        let index = e.nativeEvent.target.selectedIndex;
        this.setState({
            system_desk: e.nativeEvent.target[index].text,
            system_id: e.target.value,
            system_group: e.nativeEvent.target[index].getAttribute('data-group'),
            state: 1
        });
    },
    handleClose: function() {
        this.setState({
            system_id: this.props.system_id,
            system_group: this.props.system_group,
            msg: '',
            state: 0
        });
        if (typeof this.props.onHide != 'undefined') {
            this.props.onHide();
        }
    },
    render: function() {
        let style = classNames(
            'inputrow',
            {'changed': this.state.state==1},
            {'cansave': this.state.state==2},
            {'saved': this.state.state==3},
            {'error': this.state.state==-1}
        );
        let save_btn = null;
        if (this.state.state == 1) {
            save_btn=(<button type="button" className="btn btn-primary" onClick={this.handleSystemSave.bind(null,0)}>Проверить</button>);
        } else if (this.state.state == 2) {
            save_btn=(<button type="button" className="btn btn-primary" onClick={this.handleSystemSave.bind(null,1)}>Сохранить</button>);
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
                    <Modal.Title>Выбор типа устройства</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className={style}>
                        <label htmlFor="city">Тип:</label>
                        <select onChange={this.handleSystemChange} value={this.state.system_id}>
                            {this.props.systems}
                        </select>
                        <div>{this.state.msg}</div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    {save_btn}
                    <button type="button" className="btn btn-default" onClick={this.handleClose}>Закрыть</button>
                </Modal.Footer>
            </Modal>
        );
    }
});

module.exports=SystemSelectModal;