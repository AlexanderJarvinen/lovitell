import React, { PropTypes, Component } from 'react';
import Multiselect from 'react-bootstrap-multiselect';
import FormTextField from '../../common/components/FormTextField.jsx';
import FormSelectField from '../../common/components/FormSelectField.jsx';

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

export default class VlanModifyModal extends Component {
    static propTypes = {
        vlan: PropTypes.object,
        show: PropTypes.bool.isRequired,
        onHide: PropTypes.func.isRequired,
        onSave: PropTypes.func.isRequired
    };

    constructor(prop) {
        super(prop);
        this.state = {
            vid: {
                value: '',
                state: 0,
                msg: ''
            },
            name: {
                value: '',
                state: 0,
                msg: ''
            },
            desk: {
                value: '',
                state: 0,
                msg: ''
            },
            brand: {
                value: '',
                state: 0,
                msg: ''
            },
            brands: [],
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

    componentDidMount = () => {
        this.getBrands();
    };

    componentWillReceiveProps = (np) => {
        if (np.vlan) {
            this.setState({
                vid: {
                    value: np.vlan.vid.value,
                    state: np.vlan.vid.state,
                    msg: np.vlan.vid.msg
                },
                name: {
                    value: np.vlan.name.value,
                    state: np.vlan.name.state,
                    msg: np.vlan.name.msg
                },
                desk: {
                    value: np.vlan.desk.value,
                    state: np.vlan.desk.state,
                    msg: np.vlan.desk.msg
                },
                brand: {
                    value: np.vlan.brand.value,
                    state: np.vlan.brand.state,
                    msg: np.vlan.brand.msg
                }
            });
        } else {
            this.setState({
                vid: {
                    value: '',
                    state: 0,
                    msg: ''
                },
                name: {
                    value: '',
                    state: 0,
                    msg: ''
                },
                desk: {
                    value: '',
                    state: 0,
                    msg: ''
                },
                brand: {
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

    handleDeskChange = (desk) => {
        this.setState({desk});
    };

    handleVidChange = (vid) => {
        this.setState({vid});
    };
    handleBrandChange = (brand) => {
        console.log(brand);
        this.setState({brand});
    };
    canSave = () => {
      return this.state.vid.state == 1 &&
          this.state.name.state == 1 &&
          this.state.desk.state == 1 &&
          this.state.brand.state == 1

    };
    render = () => {
        let {name, desk, vid, brand} = this.state;
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
                    <Modal.Title>{this.props.vlan?'Редактирование VLANa "'+this.props.vlan.name.value+'"':'Добавление нового VLANa'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div>
                        {this.props.state < 0 && (!this.state.name.state || !this.state.desk.state) ?
                            <div className="alert alert-danger">
                                <h4><i className="icon fa fa-ban"></i> Ошибка!</h4>
                                {this.props.msg}
                            </div>
                            : ''
                        }
                        {
                            this.props.state == 2 && (!this.state.name.state || !this.state.desk.state) ?
                                <div className="alert alert-success">
                                    <h4><i className="icon fa fa-check"></i> VLAN добавлена!</h4>
                                </div>
                            : ''
                        }
                        <FormTextField
                          label={'VID'}
                          value={vid.value}
                          state={vid.state}
                          msg={vid.msg}
                          required={true}
                          onChange={this.handleVidChange}
                          />
                        <FormTextField
                          label={'Название'}
                          value={name.value}
                          state={name.state}
                          msg={name.msg}
                          required={true}
                          onChange={this.handleNameChange}
                          />
                        <FormTextField
                          label={'Описание'}
                          value={desk.value}
                          state={desk.state}
                          msg={desk.msg}
                          required={true}
                          onChange={this.handleDeskChange}
                          />
                        <FormSelectField
                          data={this.state.brands}
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
                               vlan_id: this.props.vlan? this.props.vlan.vlan_id:0,
                               vid: this.state.vid.value,
                               name: this.state.name.value,
                               desk: this.state.desk.value,
                               brand: this.state.brand.value
                            })}>Сохранить</button>
                            :
                            null
                    }
                    {
                        this.canSave() ?
                            <button type="button" className="btn btn-success" onClick={()=>this.props.onSave({
                               vlan_id: this.props.vlan? this.props.vlan.vlan_id:0,
                               vid: this.state.vid.value,
                               name: this.state.name.value,
                               desk: this.state.desk.value,
                               brand: this.state.brand.value
                            }, true)}>Сохранить и продолжить</button>
                        :
                        null
                    }
                    <button type="button" className="btn btn-default" onClick={this.props.onHide}>Закрыть</button>
                </Modal.Footer>
            </Modal>
        )
    }

};

