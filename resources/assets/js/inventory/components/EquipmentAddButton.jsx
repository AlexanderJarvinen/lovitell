import React, { PropTypes, Component } from 'react';
import Multiselect from 'react-bootstrap-multiselect';
import ReactDOM from 'react-dom';
import { Modal } from 'react-bootstrap';
var EquipmentAddFileLoadModal = require('./EquipmentAddFileLoadModal');

export default class EquipmentAddButton extends React.Component {
  static propTypes= {
    addressId: PropTypes.number.isRequired
  };

  state = {
    showFileLoad: false
  };

  handleClose = () => {
    this.setState({showFileLoad: false});
  };
  handleSave = () => {

  };
  handleClick = () => {
    this.setState({
      showFileLoad: true
    });
  };
  render = () => {
    return (
      <div>
        <h3>Добавление оборудования</h3>
        <EquipmentAddFileLoadModal
          show={this.state.showFileLoad}
          handleClose={this.handleClose}
          handleSave={this.handleSave}
          addressId={this.props.addressId}
          />
        <button
          onClick={this.handleClick}
          className="btn btn-primary col-md-4"><i className="fa fa-plus-circle" aria-hidden="true"></i> Добавить точки доступа из файла</button>
      </div>
    )
  }
}

ReactDOM.render(
  <EquipmentAddButton
    addressId={BuildingData.address_id}
    />,
  document.getElementById('add-equipment')
);


