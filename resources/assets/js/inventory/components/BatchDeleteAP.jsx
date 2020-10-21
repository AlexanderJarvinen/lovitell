import React, { PropTypes, Component } from 'react';
import Multiselect from 'react-bootstrap-multiselect';
import FormTextField from '../../common/components/FormTextField.jsx';
import FormSelectField from '../../common/components/FormSelectField.jsx';
import ReactDOM from 'react-dom';
import Draggable from 'react-draggable';
import ModalDialog from 'react-bootstrap/lib/ModalDialog';
import { Modal } from 'react-bootstrap';

function declOfNum(number, titles)
{
  let cases = [2, 0, 1, 1, 1, 2];
  return titles[ (number%100>4 && number%100<20)? 2 : cases[(number%10<5)?number%10:5] ];
}

class DraggableModalDialog extends React.Component {
    render() {
        return <Draggable handle=".modal-title"><ModalDialog
          backdrop={false}
          enforceFocus={false}
          {...this.props} /></Draggable>
    }
}

class BatchDeleteModal extends React.Component {
  static propTypes = {
    show: PropTypes.bool.isRequired,
    onHide: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired
  };

  render = () => {
    return (<Modal
      dialogComponentClass={DraggableModalDialog}
      show={this.props.show}
      onHide={this.props.onHide}
      animation={false}
      backdrop={false}
      enforceFocus={false}
      >
      <Modal.Header closeButton>
        <Modal.Title>{'Удаление точек доступа'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div>
          {this.props.state < 0 ?
            <div className="alert alert-danger">
              <h4><i className="icon fa fa-ban"></i> Удаление невозможно!</h4>
              {this.props.msg}
            </div>
            : ''
          }
          {
            this.props.state == 1 ?
              <div className="alert alert-success">
                <h4><i className="icon fa fa-check"></i> Устройства удалены!</h4>
              </div>
              : ''
          }
          {
            this.props.state == 0?
              <div className="alert alert-danger">
                <h4><i className="icon fa fa-check"></i> Будет удалено {this.props.equipmentCount} {declOfNum(this.props.equipmentCount, ['устройство', 'устройства', 'устройств'])}!</h4>
              </div>
              : ''

          }
        </div>
      </Modal.Body>
      <Modal.Footer>
        {
          this.props.state == 0 && this.props.equipmentCount ?
            <button type="button" className="btn btn-danger" onClick={()=>this.props.onDelete()}>Удалить</button>
            :
            null
        }
        <button type="button" className="btn btn-default" onClick={this.props.onHide}>Закрыть</button>
      </Modal.Footer>
    </Modal>
    )
  }
};

export default class BatchDeleteAP extends React.Component {
  static propTypes = {
    addressId: PropTypes.number.isRequired
  };
  state = {
    showDeleteModal: false,
    equipmentCount: 0,
    state: 0,
    msg:''
  };
  getDeletedRoutes = () => {
    fetch('/inventory/ajax/building/'+this.props.addressId+'/delete-routes', {method: 'GET', credentials: 'include'})
      .then(resp => resp.json())
      .then((resp)=>{
        if (resp.error == 0) {
          if (resp.data == 0) {
            this.setState({state: -1, msg: 'Нет устройств для удаления'});
          } else {
            this.setState({state: 0, equipmentCount: resp.data});
          }
        } else {
          this.setState({state: -1, msg:resp.msg});
        }
      })
  };
  deleteRoutes = () => {
    fetch('/inventory/ajax/building/'+this.props.addressId+'/delete-routes', {
      method: 'DELETE',
      credentials: 'include',
      headers: {
        'X-CSRF-Token': document.querySelector("meta[name='csrf-token']")?document.querySelector("meta[name='csrf-token']").getAttribute('content'):'',
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })
      .then(resp => resp.json())
      .then((resp)=>{
        if (resp.error == 0) {
          this.setState({state: 1});
          location.reload();
        } else {
          this.setState({state: -1});
        }
      })
  };
  handleClick = () => {
    this.getDeletedRoutes();
    this.setState({showDeleteModal: true});
  };
  handleDelete = () => {
    this.deleteRoutes();
  };

  render = () => {
    return (<div>
        <h3>Удаление точек доступа</h3>
        <BatchDeleteModal
          equipmentCount={this.state.equipmentCount}
          show={this.state.showDeleteModal}
          state={this.state.state}
          msg={this.state.msg}
          onHide={()=>{this.setState({equipmentCount: 0, showDeleteModal: false})}}
          onDelete={this.handleDelete}
          />
        <button
          onClick={this.handleClick}
          className="btn btn-danger col-md-4"><i className="fa fa-trash-o" aria-hidden="true"></i>Удалить точки доступа</button>
      </div>
    )
  }
};

ReactDOM.render(
  <BatchDeleteAP
    addressId={BuildingData.address_id}
    />,
  document.getElementById('batch-delete-ap')
);