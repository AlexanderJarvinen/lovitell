import $ from 'jquery';
import React, { PropTypes, Component } from 'react';
import { Modal } from 'react-bootstrap'
import classNames from 'classnames';

import Draggable from 'react-draggable';
import ModalDialog from 'react-bootstrap/lib/ModalDialog';

class DraggableModalDialog extends Component {
    render() {
        return <Draggable handle=".modal-title"><ModalDialog
            backdrop={false}
            enforceFocus={false}
            {...this.props} /></Draggable>
    }
}

export default class NewStreetButton extends Component{
    state = {
        error: 0,
        status: 0,
        modalIsOpen: false,
        street_name: '',
        street_types: [],
        street_type: 0,
        newstreet_type: 1
    };
    makeStreetTypes = (data) => {
        for(let k=0; k<data.length; k++) {
            this.state.street_types.push(
                <option key={k+1} value={data[k].type}>{data[k].prefix}</option>
            )
        }
    };
    componentDidMount = () => {
        $.ajax({
            type: "GET",
            url: "/inventory/street-types",
            success: this.makeStreetTypes
        });
    };
    handleModalCloseRequest = () => {
        // opportunity to validate something and keep the modal open even if it
        // requested to be closed
        this.setState({modalIsOpen: false});
    };
    handleAddStreet = () => {
        this.setState({modalIsOpen: true});
    };
    handleSaveStatus = (a) => {
        if (a.error == 0) {
            this.setState({status: 1});
        } else {
            this.setState({status: -1});
        }
        this.props.handleAddNewStreet();
        setTimeout(()=> {
            this.setState({modalIsOpen: false})
        }, 500);
    };
    handleSaveStreet = (e) =>{
        $.ajax({
            beforeSend: function (request) {
                return request.setRequestHeader('X-CSRF-Token', $("meta[name='csrf-token']").attr('content'));
            },
            type: "POST",
            data: {
                street_name: this.state.street_name,
                city_id: this.props.city_id,
                street_type: this.state.newstreet_type,
                region_id: this.props.region_id
            },
            url: "/inventory/street",
            success: this._handleSaveStatus,
            error: function (xhr) {
                console.log("Save db-pass error");
            }
        });
    };
    render = () => {
        return (
            <div className="new-street">
                <button type="button" className="btn btn-default" onClick={this.handleAddStreet}>Добавить улицу</button>
                <Modal
                    dialogComponentClass={DraggableModalDialog}
                    show={this.state.modalIsOpen}
                    animation={false}
                    backdrop={false}
                    enforceFocus={false}
                    onHide={this.handleModalCloseRequest}
                >
                    <Modal.Header closeButton>
                        <Modal.Title>Добавить улицу</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="modal-body">
                            <label htmlFor='street-name'>Название улицы</label>
                            <select name='street-type' onChange={(e)=>{this.setState({newstreet_type:e.target.value});}} value={this.state.newstreet_type}>
                                {this.state.street_types}
                            </select>
                            <input name='street-name' value={this.state.street_name} onChange={(e)=>{this.setState({street_name:e.target.value})}}/>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <button type="button" className="btn btn-primary" onClick={this.handleSaveStreet} disabled={this.state.street_name==''}>Добавить</button>
                        <button type="button" className="btn btn-default" onClick={this.handleModalCloseRequest}>Закрыть</button>
                    </Modal.Footer>
                </Modal>
            </div>
        )
    }
};
