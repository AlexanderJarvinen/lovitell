import React, { PropTypes, Component } from 'react';
import FormTextField from '../../common/components/FormTextField.jsx';
import FormSelectField from '../../common/components/FormSelectField.jsx';
import FormDateField from '../../common/components/FormDateField.jsx';
import FormAutocompleteField from '../../common/components/FormAutocompleteField.jsx';

import Draggable from 'react-draggable';
import ModalDialog from 'react-bootstrap/lib/ModalDialog';
import { Modal } from 'react-bootstrap';
import moment from 'moment';

class DraggableModalDialog extends React.Component {
  render() {
    return <Draggable handle=".modal-title"><ModalDialog
      backdrop={false}
      enforceFocus={false}
      {...this.props} /></Draggable>
  }
}

export default class RecordModifyModal extends Component {
  static propTypes = {
    addressId: PropTypes.number.isRequired,
    record: PropTypes.object,
    show: PropTypes.bool.isRequired,
    onHide: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired
  };

  constructor(prop) {
    super(prop);
    this.state = {
      system: {
        value: 0,
        state: 0,
        msg: ''
      },
      rd: {
        value: '',
        state: 0,
        msg: ''
      },
      contractor: {
        value: '',
        state: 0,
        msg: ''
      },
      agreement_expense: {
        value: '',
        state: 0,
        msg: ''
      },
      agreement_income: {
        value: '',
        state: 0,
        msg: ''
      },
      doc_link: {
        value: '',
        state: 0,
        msg: ''
      },
      date: {
        value: '',
        state: 0,
        msg: ''
      },
      doc_link_ao: {
        value: '',
        state: 0,
        msg: ''
      },
      doc_link_pk: {
        value: '',
        state: 0,
        msg: ''
      },
      status: {
        value: 1,
        state: 1,
        msg: ''
      },
      systems: [],
      statuses: [],
      contractors: [],
      states: [],
      contractor_name: ''
    }
  };

  getContractors = () => {
    if (this.state.contractor_name) {
      fetch('/inventory/ajax/building/' + this.props.addressId + '/buildingtab/contractors/' + this.state.contractor_name, {
        method: 'GET',
        credentials: 'include'
      })
        .then(resp=>resp.json())
        .then(resp => {
          if (resp.error == 0) {
            this.setState(
              {
                contractors: resp.data,
                contractor: {
                  value: this.state.contractor.value,
                  msg: resp.data.length>0?'Выберите подрядчика из списка':'Подрядчик не найден',
                  state: resp.data.length>0?-1:-2,
                }
              })
          }
        })
    }
  };

  getSystems = () => {
    fetch('/inventory/ajax/building/' + this.props.addressId + '/buildingtab/systems', {
      method: 'GET',
      credentials: 'include'
    })
      .then(resp=>resp.json())
      .then(resp => {
        if (resp.error == 0) {
          this.setState({systems: resp.data})
        }
      })
  };

  getStatuses = () => {
      fetch('/inventory/ajax/building/' + this.props.addressId + '/buildingtab/statuses/', {
        method: 'GET',
        credentials: 'include'
      })
        .then(resp=>resp.json())
        .then(resp => {
          if (resp.error == 0) {
            this.setState({statuses: resp.data})
          }
        })
  };

  componentDidMount = () => {
    this.getStatuses();
    this.getSystems();
  };

  componentWillReceiveProps = (np) => {
    if (np.record) {
      this.setState({
        system: {
          value: np.record.system.value,
          state: np.record.system.state,
          msg: np.record.system.msg
        },
        rd: {
          value: np.record.rd.value,
          state: np.record.rd.state,
          msg: np.record.rd.msg
        },
        contractor: {
          value: np.record.contractor.value,
          state: np.record.contractor.state,
          msg: np.record.contractor.msg
        },
        agreement_expense: {
          value: np.record.agreement_expense.value,
          state: np.record.agreement_expense.state,
          msg: np.record.agreement_expense.msg
        },
        agreement_income: {
          value: np.record.agreement_income.value,
          state: np.record.agreement_income.state,
          msg: np.record.agreement_income.msg
        },
        doc_link: {
          value: np.record.doc_link.value,
          state: np.record.doc_link.state,
          msg: np.record.doc_link.msg
        },
        date: {
          value: np.record.date.value,
          state: np.record.date.state,
          msg: np.record.date.msg
        },
        doc_link_ao: {
          value: np.record.contractor.value,
          state: np.record.contractor.state,
          msg: np.record.contractor.msg
        },
        doc_link_pk: {
          value: np.record.contractor.value,
          state: np.record.contractor.state,
          msg: np.record.contractor.msg
        },
        status: {
          value: np.record.contractor.value,
          state: np.record.contractor.state,
          msg: np.record.contractor.msg
        }
      });
    } else {
      this.setState({
        system: {
          value: 0,
          state: 0,
          msg: ''
        },
        rd: {
          value: '',
          state: 0,
          msg: ''
        },
        contractor: {
          value: '',
          state: 0,
          msg: ''
        },
        agreement_expense: {
          value: '',
          state: 0,
          msg: ''
        },
        agreement_income: {
          value: '',
          state: 0,
          msg: ''
        },
        doc_link: {
          value: '',
          state: 0,
          msg: ''
        },
        date: {
          value: '',
          state: 0,
          msg: ''
        },
        doc_link_ao: {
          value: '',
          state: 0,
          msg: ''
        },
        doc_link_pk: {
          value: '',
          state: 0,
          msg: ''
        },
        status: {
          value: 1,
          state: 1,
          msg: ''
        }
      });
    }
  };

  handleSystemChange = (system) => {
    this.setState({system});
  };
  handleRdChange = (rd) => {
    this.setState({rd});
  };
  handleContractorChange = (contractor_name) => {
    this.setState(
      {contractor_name},
      this.getContractors
    );
  };
  handleContractorSelect = (value) => {
    console.log(value);
    this.setState({
      contractor: {
        value: value.value,
        state: 1,
        msg: ''
      },
      contractor_name: value.descr
    });
  };
  handleAgreementExpenseChange = (agreement_expense) => {
    this.setState({agreement_expense});
  };
  handleAgreementIncomeChange = (agreement_income) => {
    this.setState({agreement_income});
  };
  handleDocLinkChange = (doc_link) => {
    this.setState({doc_link});
  };
  handleDateChange = (date) => {
    this.setState({date});
  };
  handleDocLinkAoChange = (doc_link_ao) => {
    this.setState({doc_link_ao});
  };
  handleDocLinkPkChange = (doc_link_pk) => {
    this.setState({doc_link_pk});
  };
  handleStatusChange = (status) => {
    this.setState({status});
  };

  canSave = () => {
    return this.state.system.state == 1 &&
      this.state.contractor.state == 1 &&
      this.state.date.state == 1
  };
  render = () => {
    let {system,
      rd,
      contractor,
      agreement_expense,
      agreement_income,
      doc_link,
      date,
      doc_link_ao,
      doc_link_pk,
      status,
      contractors,
      systems,
      statuses,
      contractor_name} = this.state;
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
          <Modal.Title>{this.props.record?'Редактирование записи':'Добавление новой записи'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            {this.props.state < 0 && (!this.state.system.state) ?
              <div className="alert alert-danger">
                <h4><i className="icon fa fa-ban"></i> Ошибка!</h4>
                {this.props.msg}
              </div>
              : ''
            }
            {
              this.props.state == 2 && (!this.state.system.state) ?
                <div className="alert alert-success">
                  <h4><i className="icon fa fa-check"></i> Запись добавлена!</h4>
                </div>
                : ''
            }
            <FormSelectField
              label={'Система'}
              placeholder='Не выбрана'
              value={system.value}
              state={system.state}
              msg={system.msg}
              required={true}
              onChange={this.handleSystemChange}
              data={systems}
              />
            <FormTextField
              label={'РД'}
              value={rd.value}
              state={rd.state}
              msg={rd.msg}
              required={true}
              onChange={this.handleRdChange}
              />
            <FormAutocompleteField
              label={'Подрядчик'}
              value={contractor_name}
              state={contractor.state}
              msg={contractor.msg}
              data={contractors}
              onChange={this.handleContractorChange}
              onSelect={this.handleContractorSelect}
              fixModal={true}
              />
            <FormTextField
              label={'Расходный договор'}
              value={agreement_expense.value}
              state={agreement_expense.state}
              msg={agreement_expense.msg}
              required={true}
              onChange={this.handleAgreementExpenseChange}
              />
            <FormTextField
              label={'Доходный договор'}
              value={agreement_income.value}
              state={agreement_income.state}
              msg={agreement_income.msg}
              required={true}
              onChange={this.handleAgreementIncomeChange}
              />
            <FormTextField
              label={'ИД'}
              value={doc_link.value}
              state={doc_link.state}
              msg={doc_link.msg}
              required={true}
              onChange={this.handleDocLinkChange}
              />
            <FormDateField
              label={'Дата'}
              value={date.value}
              state={date.state}
              msg={date.msg}
              required={true}
              onChange={this.handleDateChange}
              />
            <FormTextField
              label={'ОЭ'}
              value={doc_link_ao.value}
              state={doc_link_ao.state}
              msg={doc_link_ao.msg}
              required={true}
              onChange={this.handleDocLinkAoChange}
              />
            <FormTextField
              label={'ПК'}
              value={doc_link_pk.value}
              state={doc_link_pk.state}
              msg={doc_link_pk.msg}
              required={true}
              onChange={this.handleDocLinkPkChange}
              />
            <FormSelectField
              data={statuses}
              value={status.value}
              state={status.state}
              msg={status.msg}
              onChange={this.handleStatusChange}
              label={'Статус'}
              required={true}
              />
          </div>
        </Modal.Body>
        <Modal.Footer>
          {
            this.canSave() ?
              <button type="button" className="btn btn-primary" onClick={()=>this.props.onSave({
                               record_id: this.props.record? this.props.record.record_id:0,
                               system: system.value,
                               rd: rd.value,
                               contractor: contractor.value,
                               agreement_expense: agreement_expense.value,
                               agreement_income: agreement_income.value,
                               doc_link: doc_link.value,
                               date: date.value,
                               doc_link_ao: doc_link_ao.value,
                               doc_link_pk: doc_link_pk.value,
                               status: status.value
                            })}>Сохранить</button>
              :
              null
          }
          {
            this.canSave() ?
              <button type="button" className="btn btn-success" onClick={()=>this.props.onSave({
                               record_id: this.props.record? this.props.record.record_id:0,
                               system: system.value,
                               rd: rd.value,
                               contractor: contractor.value,
                               agreement_expense: agreement_expense.value,
                               agreement_income: agreement_income.value,
                               doc_link: doc_link.value,
                               date: date.value,
                               doc_link_ao: doc_link_ao.value,
                               doc_link_pk: doc_link_pk.value,
                               status: status.value
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

