import React, { PropTypes, Component } from 'react';
import Multiselect from 'react-bootstrap-multiselect';
import FormTextField from '../../common/components/FormTextField.jsx';
import FormSelectField from '../../common/components/FormSelectField.jsx';
import ConfirmDeleteModal from '../../common/components/ConfirmDeleteModal.jsx';
import Draggable from 'react-draggable';
import ModalDialog from 'react-bootstrap/lib/ModalDialog';
import { Modal } from 'react-bootstrap';
import AddressSelector from '../../common/components/AddressSelector.jsx';


class DraggableModalDialog extends React.Component {
  render() {
    return <Draggable handle=".modal-title"><ModalDialog
      backdrop={false}
      enforceFocus={false}
      {...this.props} /></Draggable>
  }
}

class CapexParams extends Component {
  static propTypes = {
    system: PropTypes.string.isRequired,
    agreement: PropTypes.object.isRequired,
    onChangeAgreement: PropTypes.func.isRequired,
    amount: PropTypes.object.isRequired,
    onChangeAmount: PropTypes.func.isRequired,
    type: PropTypes.object.isRequired,
    onChangeType: PropTypes.func.isRequired,
    onACSearch: PropTypes.func.isRequired
  };
  type = [
    {
      value: 0,
      descr: 'Нет'
    },
    {
      value: 1,
      descr: 'Да'
    }
  ];
  render() {
    const {
      agreement,
      onChangeAgreement,
      amount,
      onChangeAmount,
      type,
      onChangeType,
      onACSearch,
      system
      } = this.props;
    return(
    <div>
      <FormTextField
        label="Договор"
        value={agreement.value}
        state={agreement.state}
        msg={agreement.msg}
        onChange={onChangeAgreement}
        toolIcon={system=='Б2Б'?'fa-search':null}
        onToolClick={onACSearch}
        />
      <FormTextField
        label="Сумма"
        value={amount.value}
        state={amount.state}
        msg={amount.msg}
        onChange={onChangeAmount}
        />
      <FormSelectField
        label="Флаг ТМЦ"
        data={this.type}
        value={type.value}
        state={type.state}
        msg={type.msg}
        onChange={onChangeType}
        />
    </div>
    )
  }
}

export default class CapexModifyModal extends Component {
  static propTypes = {
    capex: PropTypes.object,
    show: PropTypes.bool.isRequired,
    onHide: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired
  };

  constructor(prop) {
    super(prop);
    this.state = {
      systems: [],
      works: [],
      cities: [],
      code:'_ _ _ _ _ _  -  _ _ _ _ _',
      codeIsInit: true,
      capex_id: 0,
      work: {
        value: '',
        state: 0,
        msg: ''
      },
      system: {
        value: 0,
        state: 0,
        msg: ''
      },
      city: {
        value: 0,
        state: 0,
        msg: ''
      },
      region: {
        value: 0,
        state: 0,
        msg: ''
      },
      street: {
        value: 0,
        state: 0,
        msg: ''
      },
      address: {
        value: '',
        state: 0,
        mag: ''
      },
      agreement: {
          value: '',
          state: 0,
          mag: ''
      },
      amount: {
        value: '0.00',
        state: 0,
        mag: ''
      },
      type: {
        value: 0,
        state: 0,
        mag: ''
      }
    }
  };

  componentWillReceiveProps = (np) => {
    if (np.capex) {
      console.log(np.capex);
      this.setState({
        capex_id: np.capex.id,
        show_delete_confirm: false,
        partner: null,
        codeIsInit: true,
        work: np.capex.work,
        system: np.capex.system,
        city: np.capex.city,
        region: np.capex.region,
        street: np.capex.street,
        address: np.capex.address,
        agreement: np.capex.agreement,
        amount: np.capex.amount,
        type: np.capex.type
      },
        this.makeCode);
    } else {
      this.setState({
        capex_id: 0,
        code:'И 0 0 0 0',
        partner: null,
        codeIsInit: true,
        work: {
          value: 'И',
          state: 0,
          msg: ''
        },
        system: {
          value: '',
          state: 0,
          msg: ''
        },
        city: {
          value: 0,
          state: 0,
          msg: ''
        },
        region: {
          value: 0,
          state: 0,
          msg: ''
        },
        street: {
          value: 0,
          state: 0,
          msg: ''
        },
        address: {
          value: 0,
          state: 0,
          mag: ''
        },
        agreement: {
          value: '',
          state: 0,
          mag: ''
        },
        amount: {
          value: '0,00',
          state: 0,
          mag: ''
        },
        type: {
          value: 0,
          state: 0,
          mag: ''
        },
        address_info:null
      });
    }
  };
  handleSystemChange = (system) => {
    var agreement = this.state.agreement;
    if (system.value == 'Б2Б') {
      agreement = {
        value: agreement.value,
        state: 1,
        msg: 'Введите номер договора и нажмите иконку поиска'
      }
    } else {
      agreement = {
        value: agreement.value,
        state: 1,
        msg: ''
      }
    }
    this.setState({
      system,
      agreement
    }, this.makeCode);
  };
  handleWorkChange = (work) => {
    this.setState({work}, this.makeCode);
  };
  handleRegionChange = (region) => {
    this.setState({
      region:{
        value: region.region_id,
        state: 1,
        msg: ''
      }
    },this.makeCode)
  };
  handleAddressChange = (address) => {
      console.log(address);
      this.setState({
        address: {
          value: address.address_id,
          state: 1,
          msg: ''
        }
      },this.makeCode);
      this.getBuildingAddressInfo(address.address_id);
  };
  getBuildingAddressInfo = (address_id) => {
    if (address_id) {
      fetch('/financial/ajax/address-info/' + address_id + '/1/', {method: 'GET', credentials: 'include'})
        .then(resp => {
          return resp.json()
        })
        .then(resp => {
          this.setState({
            address_info: resp
          });
        });
    }
  };
  getSystems = () => {
    fetch('/financial/ajax/capex/systems', {method: 'GET', credentials: 'include'})
      .then(resp => {
        return resp.json()})
      .then(resp => {
        this.setState({
          systems: resp
        });
      });
  };

  getWorks = () => {
    fetch('/financial/ajax/capex/works', {method: 'GET', credentials: 'include'})
      .then(resp => {
        return resp.json()})
      .then(resp => {
        this.setState({
          works: resp
        });
      });
  };
  componentDidMount = () => {
    this.getSystems();
    this.getWorks();
  };
  handleChangeAmount = (amount) => {
    let val = amount.value;
    if (/^(\-|\+)?([1-9][0-9]*(\.|,[0-9]*)?)$/.test(val)) {
      this.setState({
        amount: {
          value: val,
          msg: '',
          state: 0
        }
      });
    }
  };
  handleChangeAgreement = (agreement) => {
    if (this.state.system == "Б2Б") {
      agreement.msg = "Введите номер договора и нажмите иконку поиска";
    }
    this.setState({
      partner: false,
      agreement
    });
  };
  handleChangeType = (type) => {
    this.setState({type});
  };
  makeCode = () => {
    let work_type = this.state.work.value;
    let work = '_';
    if (work_type != '') {
      work = work_type[0];
    }
    let system_type = this.state.system.value;
    let system = '0 0 0';
    if (system_type && system_type != '0') {
      system = system_type[0]+' '+system_type[1]+' '+system_type[2];
    }
    let region = this.state.region.value.toString();
    region = Array.from(region);
    region = region.join(' ');
    let address = this.state.address.value.toString();
    address = Array.from(address);
    address = address.join(' ');
    this.setState({
      code: work+' '+system+' '+region+(address != '0'?' - '+address:'')
    })
  };
  checkSave=()=>{
    let error = 0;
    if (this.state.system.value=='Б2Б' && this.state.partner == false) {
      this.setState({
        agreement: {
          value: this.state.agreement.value,
          state: -2,
          msg: "Контрагент не найден. Исправьте номер договора и повторите поиск."
        }
      })
      error = 1;
    }
    let am = parseFloat(this.state.amount.value.replace(',','.')).toFixed(2);
    if (am<=0) {
      am = am.toString().replace('.',',');
      this.setState({
        amount: {
          value: am.toString().replace('.',','),
          state: -2,
          msg: 'Поле заполнено не корректно.'
        }
      });
      error = 1;
    } else {
      am = am.toString().replace('.',',');
      this.state.amount.value = am;
      this.setState({
        amount: {
          value: am,
          state: 1,
          msg: ''
        }
      });
      if (error) {return false;}
      return true;
    }
  };
  canSave = () => {
    const {region, address, amount, type, agreement, system, work} = this.state;
    return this.props.capex && this.props.capex.id && (system.state == 1 || work.state == 1 || region.state == 1 || address.state == 1 || amount.state == 1 || type.state == 1 || agreement.state == 1) || !this.props.capex
  };
  handleACSearch = () => {
    let agreement = this.state.agreement;
    this.setState({agreement:{
      value: agreement.value,
      state: '',
      msg: 'Поиск...'
    } });
    if (agreement.value != '') {
      fetch('/financial/ajax/acid/'+agreement.value, {method: 'GET', credentials: 'include'})
      .then(resp=>resp.json())
      .then(resp=>{
          if (resp.error == 0) {
            if (resp.data) {
              this.setState({
                partner: true,
                agreement: {
                  value: this.state.agreement.value,
                  msg: 'Контрагент: ' + resp.data,
                  state: 0
                }
              })
            } else {
              this.setState({
                partner: false,
                agreement: {
                  value: this.state.agreement.value,
                  msg: 'Контрагент не найден',
                  state: -2
                }
              })
            }
          } else {
            this.setState({
              partner: false,
              agreement: {
                value: this.state.agreement.value,
                msg: 'Непредвиденная ошибка при поиске контрагента',
                state: -2
              }
            })
          }
        })
    }
  };
  render = () => {
    let {
      systems,
      works,
      system,
      work,
      amount,
      agreement,
      type,
      code
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
          <Modal.Title>Добавление CAPEX кода</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            {this.props.state < 0 && this.state.codeIsInit ?
              <div className="alert alert-danger">
                <h4><i className="icon fa fa-ban"></i> Ошибка!</h4>
                {this.props.msg}
              </div>
              : ''
            }
            {
              this.props.state == 2 && this.state.codeIsInit ?
                <div className="alert alert-success">
                  <h4><i className="icon fa fa-check"></i> Код добавлен!</h4>
                </div>
                : ''
            }
            {
              this.props.state == 3 && this.state.codeIsInit ?
                <div className="alert alert-success">
                  <h4><i className="icon fa fa-check"></i> Код удален!</h4>
                </div>
                : ''
            }
            <FormSelectField
              data={works}
              value={work.value}
              state={work.state}
              msg={work.msg}
              onChange={this.handleWorkChange}
              label={'Работа'}
              />
            <FormSelectField
              placeHolder="Не выбрана"
              data={systems}
              value={system.value}
              state={system.state}
              msg={system.msg}
              onChange={this.handleSystemChange}
              label={'Система'}
              />
              <AddressSelector
                city_id={this.state.city.value}
                region_id={this.state.region.value}
                address_id={this.state.address.value}
                search={false}
                onRegionChange={this.handleRegionChange}
                onChange={this.handleAddressChange}
                accuracy={1}
                consType={2}
                />
            {this.state.address_info?
              <div className="help-block">Строительный адрес: {this.state.address_info.street} {this.state.address_info.build}</div>
              :
              ''
            }
            <div className="capex-code-line">{this.state.code}</div>
            {this.state.codeIsInit?
              <CapexParams
                system={system.value}
                amount={amount}
                onChangeAmount={this.handleChangeAmount}
                agreement={agreement}
                onChangeAgreement={this.handleChangeAgreement}
                type={type}
                onChangeType={this.handleChangeType}
                onACSearch={this.handleACSearch}
                />
              :''
            }
          </div>
        </Modal.Body>
        <Modal.Footer>
          {
            this.canSave()?
              <button type="button" className="btn btn-primary" onClick={()=>{
                if (this.checkSave()) {
                  this.props.onSave({
                             id: this.props.capex?this.props.capex.id:0,
                             code: code,
                             type: type.value,
                             agreement: agreement.value,
                             amount: amount.value
                          })}}}>Сохранить</button>
              :
              null
          }
          {
            this.canSave()?
              <button type="button" className="btn btn-success" onClick={()=>{
                  if (this.checkSave()) {
                    this.props.onSave({
                             id: this.props.capex?this.props.capex.id:0,
                             code: code,
                             type: type.value,
                             agreement: agreement.value,
                             amount: amount.value
                             })}}}>Сохранить и продолжить</button>
              :
              null
          }
          {false && this.props.capex && this.props.canDeleteLocation ?
            <ConfirmDeleteModal
              show = {this.state.show_delete_confirm}
              handleClose={()=>this.setState({show_delete_confirm: false})}
              handleConfirm={()=>this.props.onDelete(this.props.capex.capex_id)}
              msg={'Вы уверены, что хотите удалить локацию "'+this.props.capex.name.value+'"?'}
              />
            :
            ''
          }
          {this.props.capex && this.props.canDeleteLocation?
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

