var $ = require('jquery');
var React = require('react');
var ReactDOM = require('react-dom');
var classNames = require('classnames');
var AppStore = require('../stores/AppStore.js');
var AppActions = require('../../common/actions/AppActions.js');
import { Modal } from 'react-bootstrap';
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

var ErrorMsg = React.createClass({
    getInitialState: function() {
        return {
            show: false,
            msg: ''
        }
    },
    componentDidMount: function() {
        AppStore.addChangeListener(this.onChange);
    },
    componentWillUnmount: function() {
        AppStore.removeChangeListener(this.onChange);
    },
    handleClose: function() {
        AppActions.flushError();
    },
    render: function() {
        if (!this.state.show) return null;
        return (<Modal
            dialogComponentClass={DraggableModalDialog}
            show={this.state.show}
            onHide={this.handleClose}
            animation={false}
            backdrop={false}
            enforceFocus={false}
            >
            <Modal.Header>
                <Modal.Title>
                    <i className="icon fa fa-ban"></i> Ошибка!
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="alert alert-danger">
                    {this.state.msg || 'Непредвиденная ошибка'}
                </div>
            </Modal.Body>
            <Modal.Footer>
                <div className="col-md-12 text-center">
                    <button type="button" className="btn btn-primary" onClick={this.handleClose}>ОК</button>
                </div>
            </Modal.Footer>
        </Modal>);
    },
    onChange: function() {
        let error = AppStore.getError();
        if (error.code != 0) {
            this.setState({
                show: true,
                msg: error.msg
            });
        } else {
            this.setState({
                show: false,
                msg: ''
            });
        }
    }
});

module.exports=ErrorMsg;