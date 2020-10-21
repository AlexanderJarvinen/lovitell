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

var EquipmentTemplateChangeModal = React.createClass({
    getInitialState: function() {
        return {
            route: '',
            template_log: ''
        }
    },
    componentDidMount: function() {
    },
    componentWillReceiveProps(np) {
        if (np.route != this.state.route) {
            this.setState({
                route: np.route
            },
            this.getTemplateLog);
        }
    },
    fillTemplateLog: function(a) {
        if (a.error == 0) {
            let templates = [];
            for(let i in a.data) {
                templates.push(<li key={'template-'+i}>{a.data[i].started} - {a.data[i].desk}</li>);
            }
            this.setState({
                template_log: templates
            });
        }

    },
    getTemplateLog: function() {
        if (this.state.route) {
            $.ajax({
                url: '/inventory/ajax/template-log/' + this.state.route,
                method: 'GET',
                success: this.fillTemplateLog
            })
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
                    <Modal.Title>Шаблоны устройства {this.state.route}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <ul>
                    {this.state.template_log}
                    </ul>
                </Modal.Body>
                <Modal.Footer>
                    <button type="button" className="btn btn-default" onClick={this.props.handleClose}>Закрыть</button>
                </Modal.Footer>
            </Modal>
        )
    }
});

module.exports=EquipmentTemplateChangeModal;

