import React, { PropTypes, Component } from 'react';
import Multiselect from 'react-bootstrap-multiselect';
import FormTextField from '../../common/components/FormTextField.jsx';
import FormSelectField from '../../common/components/FormSelectField.jsx';
import FormMultiselectField from '../../common/components/FormMultiselectField.jsx';
import ConfirmDeleteModal from './ConfirmDeleteModal.jsx';

import Draggable from 'react-draggable';
import ModalDialog from 'react-bootstrap/lib/ModalDialog';
import { Modal } from 'react-bootstrap';

class DraggableModalDialog extends React.Component {
  render() {
    return <Draggable handle=".modal-title"><ModalDialog
      backdrop={false}
      enforceFocus={false}
      {...this.props} /></Draggable>
  }
}

export default class InterfaceModifyModal extends Component {
  static propTypes = {
    iface: PropTypes.object,
    show: PropTypes.bool.isRequired,
    onHide: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired
  };

  state = {
    show_delete_confirm: false
  };

  constructor(prop) {
    super(prop);
    this.state = {
      location: {
        value: 0,
        state: 0,
        msg: ''
      },
      name: {
        value: '',
        state: 0,
        msg: ''
      },
      descr: {
        value: '',
        state: 0,
        msg: ''
      },
      brand: {
        value: 0,
        state: 0,
        msg: ''
      },
      nas_port_id: {
        value: '',
        state: 0,
        msg: ''
      },
      iface: {
        value: '',
        state: 0,
        msg: ''
      },
      brands: [],
      locations: [],
      canAddVlan: 0,
      canModifyVlan: 0
    }
  };

  getBrands = () => {
    fetch('/ajax/brands/', {method: 'GET', credentials: 'include'})
      .then(resp=>resp.json())
      .then(resp => {
        if (resp.error == 0) {
          this.setState({brands: resp.data})
        }
      })
  };

  getLocations = () => {
    fetch('/inventory/ajax/info/locations/', {method: 'GET', credentials: 'include'})
      .then(resp=>resp.json())
      .then(resp=> {
        if (resp.error == 0) {
          this.setState({locations: resp.data})
        }
      })
  };

  componentDidMount = () => {
    this.getBrands();
    this.getLocations();
  };

  componentWillReceiveProps = (np) => {
    if (np.iface) {
      this.setState({
        show_delete_confirm: false,
        location: {
          value: np.iface.location.value,
          state: np.iface.location.state,
          msg: np.iface.location.msg
        },
        name: {
          value: np.iface.name.value,
          state: np.iface.name.state,
          msg: np.iface.name.msg
        },
        descr: {
          value: np.iface.descr.value,
          state: np.iface.descr.state,
          msg: np.iface.descr.msg
        },
        iface: {
          value: np.iface.iface.value,
          state: np.iface.iface.state,
          msg: np.iface.iface.msg
        },
        brand: {
          value: np.iface.brand.value,
          state: np.iface.brand.state,
          msg: np.iface.brand.msg
        },

        nas_port_id: {
          value: np.iface.nas_port_id.value,
          state: np.iface.nas_port_id.state,
          mag: np.iface.nas_port_id.msg
        }
      });
    } else {
      this.setState({
        show_delete_confirm: false,
        location: {
          value: 0,
          state: 0,
          msg: ''
        },
        iface: {
          value: '',
          state: 0,
          msg: ''
        },
        name: {
          value: '',
          state: 0,
          msg: ''
        },
        descr: {
          value: '',
          state: 0,
          msg: ''
        },
        brand: {
          value: 0,
          state: 0,
          msg: ''
        },
        nas_port_id: {
          value: '',
          state: 0,
          msg: ''
        }
      });
    }
  };

  handleNameChange = (name) => {
    this.setState({name});
  };

  handleDeskChange = (descr) => {
    this.setState({descr});
  };
  handleLocationChange = (location) => {
    this.setState({location});
  };
  handleBrandChange = (brand) => {
    this.setState({brand});
  };
  handleIfaceChange = (iface) => {
    this.setState({iface});
  };
  handleNasPortChange = (nas_port_id) => {
    this.setState({nas_port_id});
  };
  canSave = () => {
    const {name, descr, location, brand, nas_port_id, iface} = this.state;
    return (this.props.iface == null && name.state == 1 &&
      descr.state == 1 &&
      brand.state == 1 &&
      location.state == 1 &&
      nas_port_id.state == 1 &&
      iface.state == 1) || (this.props.iface != null &&(name.state == 1 ||
        descr.state == 1 ||
        brand.state == 1 ||
        location.state == 1 ||
        nas_port_id.state == 1 ||
        iface.state == 1))

  };
  render = () => {
    let {
      location,
      name,
      descr,
      nas_port_id,
      brand,
      iface,
      locations,
      brands
      } = this.state;
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
          <Modal.Title>{this.props.iface?'Редактирование интерфейса "'+this.props.iface.name.value+'"':'Добавление нового интерфейса'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            {this.props.state < 0 && (!this.state.name.state || !this.state.descr.state) ?
              <div className="alert alert-danger">
                <h4><i className="icon fa fa-ban"></i> Ошибка!</h4>
                {this.props.msg}
              </div>
              : ''
            }
            {
              this.props.state == 2 && (!this.state.name.state || !this.state.descr.state) ?
                <div className="alert alert-success">
                  <h4><i className="icon fa fa-check"></i> Интерфейс {this.props.iface?'сохранен':'добавлен'}!</h4>
                </div>
                : ''
            }
            {
              this.props.state == 3 && (!this.state.name.state || !this.state.descr.state) ?
                <div className="alert alert-success">
                  <h4><i className="icon fa fa-check"></i> Интерфейс удален!</h4>
                </div>
                : ''
            }
            <FormTextField
              label={'Название'}
              value={name.value}
              state={name.state}
              msg={name.msg}
              required={true}
              onChange={this.handleNameChange}
              />
            <FormMultiselectField
              label={'Локация'}
              data={locations}
              value={location.value}
              state={location.state}
              msg={location.msg}
              required={true}
              onChange={this.handleLocationChange}
              keyDescr={'desk'}
              keyName={'id'}
              multiselect={false}
              filtering={true}
              />
            <FormTextField
              label={'Описание'}
              value={descr.value}
              state={descr.state}
              msg={descr.msg}
              required={true}
              onChange={this.handleDeskChange}
              />
            <FormTextField
              label={'Интерфейс'}
              value={iface.value}
              state={iface.state}
              msg={iface.msg}
              required={true}
              onChange={this.handleIfaceChange}
              />
            <FormTextField
              label={'NAS_PORT_ID'}
              value={nas_port_id.value}
              state={nas_port_id.state}
              msg={nas_port_id.msg}
              required={true}
              onChange={this.handleNasPortChange}
              />
            <FormSelectField
              data={brands}
              placeholder='Не выбран'
              value={brand.value}
              state={brand.state}
              msg={brand.msg}
              onChange={this.handleBrandChange}
              label={'Бренд'}
              required={true}
              />
          </div>
        </Modal.Body>
        <Modal.Footer>
          {
            this.canSave() ?
              <button type="button" className="btn btn-primary" onClick={()=>this.props.onSave({
                               id: this.props.iface? this.props.iface.id : 0,
                               location_id: location.value,
                               brand_id: brand.value,
                               iface: iface.value,
                               name: name.value,
                               descr: descr.value,
                               nas_port_id: nas_port_id.value
                            })}>Сохранить</button>
              :
              null
          }
          {
            this.canSave() ?
              <button type="button" className="btn btn-success" onClick={()=>this.props.onSave({
                               id: this.props.iface? this.props.iface.id : 0,
                               location_id: location.value,
                               brand_id: brand.value,
                               iface: iface.value,
                               name: name.value,
                               descr: descr.value,
                               nas_port_id: nas_port_id.value
                            }, true)}>Сохранить и продолжить</button>
              :
              null
          }
          {this.props.iface && this.props.canDeleteInterface ?
            <ConfirmDeleteModal
              show = {this.state.show_delete_confirm}
              handleClose={()=>this.setState({show_delete_confirm: false})}
              handleConfirm={()=>this.props.onDelete(this.props.iface.id)}
              msg={'Вы уверены, что хотите удалить интерфейс "'+this.props.iface.name.value+'"?'}
              />
            :
            ''
          }
          {this.props.iface && this.props.canDeleteInterface?
            <button type="button" className="btn btn-danger" onClick={()=>{this.setState({show_delete_confirm: true})}}>Удалить</button>
            :
            ''
          }
          <button type="button" className="btn btn-default" onClick={this.props.onHide}>Закрыть</button>
        </Modal.Footer>
      </Modal>
    )
  }

};

