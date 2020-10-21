import React, { PropTypes, Component } from 'react';
import ReactTooltip from 'react-tooltip';
import DatePicker from 'react-datepicker';
import classNames from 'classnames';
import * as Table from 'reactabular-table';
import moment from 'moment';
import BoxOverlay from '../../common/components/BoxOverlay';
import ReactDOM from 'react-dom';
import Autocomplete from 'react-autocomplete';

var styles = {
  item: {
    padding: '2px 6px',
    cursor: 'default'
  },

  highlightedItem: {
    color: 'white',
    background: 'hsl(200, 50%, 50%)',
    padding: '2px 6px',
    cursor: 'default'
  },

  menu: {
    border: 'solid 1px #ccc'
  }
};

export default class ServiceTableRow extends Component {
  defaultProps = {
    id: '',
    name: '',
    plan_date: {
      value: '',
      state: 0,
      msg: ''
    },
    acceptance_date: {
      value: '',
      state: 0,
      msg: ''
    },
    acceptance_plan_date: {
      value: '',
      state: 0,
      msg: ''
    },
    accepted_date: {
      value: '',
      state: 0,
      msg: ''
    },
    to_disable_date: {
      value: '',
      state: 0,
      msg: ''
    },
    disable_date: {
      value: '',
      state: 0,
      msg: ''
    },
    permit: {
      value: '',
      state: 0,
      msg: ''
    },
    permit_from_date: {
      value: '',
      state: 0,
      msg: ''
    },
    permit_to_date: {
      value: '',
      state: 0,
      msg: ''
    },
    lockPermitDate: null
  };
  acceptanceTooltip = null;
  acceptancePlanTooltip = null;
  planTooltip = null;
  acceptedTooltip = null;
  toDisableTooltip = null;
  disableTooltip = null;
  permitTooltip = null;
  permitFromDateTooltip = null;
  permitToDateTooltip = null;

  state = {
    newPermit: false,
    permitsList: [],
    permitState: 0,
    state: []
  };

  componentWillReceiveProps = (np) => {
    if (np.acceptance_date.msg != '') {
      ReactTooltip.show(this.acceptanceTooltip);
    } else {
      ReactTooltip.hide(this.acceptanceTooltip);
    }
    if (np.acceptance_plan_date.msg != '') {
      ReactTooltip.show(this.acceptancePlanTooltip);
    } else {
      ReactTooltip.hide(this.acceptancePlanTooltip);
    }
    if (np.plan_date.msg != '') {
      ReactTooltip.show(this.planTooltip);
    } else {
      ReactTooltip.hide(this.planTooltip);
    }
    if (np.accepted_date.msg != '') {
      ReactTooltip.show(this.acceptedTooltip);
    } else {
      ReactTooltip.hide(this.acceptedTooltip);
    }
    if (np.to_disable_date.msg != '') {
      ReactTooltip.show(this.toDisableTooltip);
    } else {
      ReactTooltip.hide(this.toDisableTooltip);
    }
    if (np.disable_date.msg != '') {
      ReactTooltip.show(this.disableTooltip);
    } else {
      ReactTooltip.hide(this.disableTooltip);
    }
    if (np.permit.msg != '') {
      ReactTooltip.show(this.permitTooltip);
    } else {
      ReactTooltip.hide(this.permitTooltip);
    }
    if (np.permit_from_date.msg != '') {
      ReactTooltip.show(this.permitFromDateTooltip);
    } else {
      ReactTooltip.hide(this.permitFromDateTooltip);
    }
    if (np.permit_to_date.msg != '') {
      ReactTooltip.show(this.permitToDateTooltip);
    } else {
      ReactTooltip.hide(this.permitToDateTooltip);
    }
  };
  handlePlanDateChange = (date) => {
    if (typeof this.props.onChange != 'undefined') {
      this.props.onChange({
        id: this.props.id,
        name: this.props.name,
        date_0: {
          value: (date) ? date.format('YYYY-MM-DD') : '',
          state: 1,
          msg: ''
        },
        date_1: this.props.acceptance_date,
        date_2: this.props.acceptance_plan_date,
        date_4: this.props.accepted_date,
        date_8: this.props.to_disable_date,
        date_16: this.props.disable_date,
        permit: this.props.permit,
        permit_to_date: this.props.permit_to_date,
        permit_from_date: this.props.permit_from_date,
        changed: true
      })
    }
  };
  handleAccDateChange = (date) => {
    if (typeof this.props.onChange != 'undefined') {
      this.props.onChange({
        id: this.props.id,
        name: this.props.name,
        date_0: this.props.plan_date,
        date_1: {
          value: (date) ? date.format('YYYY-MM-DD') : '',
          state: 1,
          msg: ''
        },
        date_2: this.props.acceptance_plan_date,
        date_4: this.props.accepted_date,
        date_8: this.props.to_disable_date,
        date_16: this.props.disable_date,
        permit: this.props.permit,
        permit_to_date: this.props.permit_to_date,
        permit_from_date: this.props.permit_from_date,
        changed: true
      })
    }
  };
  handleAccPlanDateChange = (date) => {
    if (typeof this.props.onChange != 'undefined') {
      this.props.onChange({
        id: this.props.id,
        name: this.props.name,
        date_0: this.props.plan_date,
        date_1: this.props.acceptance_date,
        date_2: {
          value: (date) ? date.format('YYYY-MM-DD') : '',
          state: 1,
          msg: ''
        },
        date_4: this.props.accepted_date,
        date_8: this.props.to_disable_date,
        date_16: this.props.disable_date,
        permit: this.props.permit,
        permit_to_date: this.props.permit_to_date,
        permit_from_date: this.props.permit_from_date,
        changed: true
      })
    }
  };
  handleAcceptedDateChange = (date) => {
    if (typeof this.props.onChange != 'undefined') {
      this.props.onChange({
        id: this.props.id,
        name: this.props.name,
        date_0: this.props.plan_date,
        date_1: this.props.acceptance_date,
        date_2: this.props.acceptance_plan_date,
        date_4: {
          value: (date) ? date.format('YYYY-MM-DD') : '',
          state: 1,
          msg: ''
        },
        date_8: this.props.to_disable_date,
        date_16: this.props.disable_date,
        permit: this.props.permit,
        permit_from_date: this.props.permit_from_date,
        permit_to_date: this.props.permit_to_date,
        changed: true
      })
    }
  };
  handleToDisableDateChange = (date) => {
    if (typeof this.props.onChange != 'undefined') {
      this.props.onChange({
        id: this.props.id,
        name: this.props.name,
        date_0: this.props.plan_date,
        date_1: this.props.acceptance_date,
        date_2: this.props.plan_date,
        date_4: this.props.accepted_date,
        date_8: {
          value: (date) ? date.format('YYYY-MM-DD') : '',
          state: 1,
          msg: ''
        },
        date_16: this.props.disable_date,
        permit: this.props.permit,
        permit_from_date: this.props.permit_from_date,
        permit_to_date: this.props.permit_to_date,
        changed: true
      })
    }
  };
  handleDisableDateChange = (date) => {
    if (typeof this.props.onChange != 'undefined') {
      this.props.onChange({
        id: this.props.id,
        name: this.props.name,
        date_0: this.props.plan_date,
        date_1: this.props.acceptance_date,
        date_2: this.props.plan_date,
        date_4: this.props.accepted_date,
        date_8: this.props.to_disable_date,
        date_16: {
          value: (date) ? date.format('YYYY-MM-DD') : '',
          state: 1,
          msg: ''
        },
        permit: this.props.permit,
        permit_from_date: this.props.permit_from_date,
        permit_to_date: this.props.permit_to_date,
        changed: true
      })
    }
  };
  handlePermitChange = (e, v) => {
    this.setState({lockPermitDate: false});
    if (typeof this.props.onChange != 'undefined') {
      this.props.onChange({
        id: this.props.id,
        name: this.props.name,
        date_0: this.props.plan_date,
        date_1: this.props.acceptance_date,
        date_2: this.props.plan_date,
        date_4: this.props.accepted_date,
        date_8: this.props.to_disable_date,
        date_16: this.props.disable_date,
        permit: {
          value: v,
          state: 1,
          msg: ''
        },
        permit_from_date: {
          value: '',
          state: 0,
          msg: ''
        },
        permit_to_date: {
          value: '',
          state: 0,
          msg: ''
        },
        changed: true
      })
    }
    this.loadPermits(v);
  };
  handlePermitSelect = (v, i) => {
    console.log('Permit select');
    console.log(v);
    console.log(i);
    if (typeof this.props.onChange != 'undefined') {
      this.props.onChange({
        id: this.props.id,
        name: this.props.name,
        date_0: this.props.plan_date,
        date_1: this.props.acceptance_date,
        date_2: this.props.plan_date,
        date_4: this.props.accepted_date,
        date_8: this.props.to_disable_date,
        date_16: this.props.disable_date,
        permit: {
          id: i.key,
          value: v,
          state: 1,
          msg: ''
        },
        permit_from_date: {
          value: moment(i.date_from).format('YYYY-MM-DD'),
          state: 1,
          msg: ''
        },
        permit_to_date: {
          value: moment(i.date_to).format('YYYY-MM-DD'),
          state: 1,
          msg: ''
        },
        changed: true
      })
    }
    this.setState({lockPermitDate: true});
  };
  handlePermitFromDateChange = (date) => {
    if (typeof this.props.onChange != 'undefined') {
      this.props.onChange({
        id: this.props.id,
        name: this.props.name,
        date_0: this.props.plan_date,
        date_1: this.props.acceptance_date,
        date_2: this.props.plan_date,
        date_4: this.props.accepted_date,
        date_8: this.props.to_disable_date,
        date_16: this.props.to_disable_date,
        permit: this.props.permit,
        permit_from_date: {
          value: (date) ? date.format('YYYY-MM-DD') : '',
          state: 1,
          msg: ''
        },
        permit_to_date: this.props.permit_to_date,
        changed: true
      })
    }
  };
  handlePermitToDateChange = (date) => {
    if (typeof this.props.onChange != 'undefined') {
      this.props.onChange({
        id: this.props.id,
        name: this.props.name,
        date_0: this.props.plan_date,
        date_1: this.props.acceptance_date,
        date_2: this.props.plan_date,
        date_4: this.props.accepted_date,
        date_8: this.props.to_disable_date,
        date_16: this.props.to_disable_date,
        permit: this.props.permit,
        permit_from_date: this.props.permit_from_date,
        permit_to_date: {
          value: (date) ? date.format('YYYY-MM-DD') : '',
          state: 1,
          msg: ''
        },
        changed: true
      })
    }
  };
  clearServices = () => {
    let services = this.state.services;
    for (let i in services) {
      if (services[i].changed) {
        services[i].changed = false;
        services[i].date_0.state = 0;
        services[i].date_0.msg = '';
        services[i].date_1.state = 0;
        services[i].date_1.msg = '';
        services[i].date_2.state = 0;
        services[i].date_2.msg = '';
        services[i].date_4.state = 0;
        services[i].date_4.msg = '';
        services[i].date_8.state = 0;
        services[i].date_8.msg = '';
        services[i].date_16.state = 0;
        services[i].date_16.msg = '';
        services[i].permit.state = 0;
        services[i].permit.msg = '';
        services[i].permit_to_date.state = 0;
        services[i].permit_to_date.msg = '';
        services[i].permit_from_date.state = 0;
        services[i].permit_from_date.msg = '';
      }
    }
    this.state.services = services;
  };
  loadPermits = (searchString) => {
    fetch('/inventory/ajax/permits/' + searchString, {method: 'GET', credentials: 'include'})
      .then(resp=>resp.json())
      .then(data=> {
        if (!data.error) {
          let list = [];
          for (let i in data.data) {
            list.push({
              key: data.data[i].permit_id,
              value: data.data[i].number,
              date_from: data.data[i].date_from,
              date_to: data.data[i].date_to
            });
          }
          this.setState({
            permitsList: list
          });
        } else {
          console.log('Error while getting permit number');
        }
      })
  };
  handlePermitSave = () => {
    let {permit, permit_from_date, permit_to_date} = this.props;
    permit.state = 0;
    permit_from_date.state = 0;
    permit_to_date.state = 0;
    this.props.onChange({
      id: this.props.id,
      name: this.props.name,
      date_0: this.props.plan_date,
      date_1: this.props.acceptance_date,
      date_2: this.props.plan_date,
      date_4: this.props.accepted_date,
      date_8: this.props.to_disable_date,
      date_16: this.props.disable_date,
      permit: permit,
      permit_from_date: permit_from_date,
      permit_to_date: permit_to_date,
      changed: true
    });
    let data = JSON.stringify({
      number: this.props.permit_from_date.value,
      permit_from_date: this.props.permit_to_date.value,
      permit_to_date: this.props.permit_to_date.value
    });
    fetch(
      '/inventory/ajax/permit',
      {
        headers: {
          'X-CSRF-Token': document.querySelector("meta[name='csrf-token']") ? document.querySelector("meta[name='csrf-token']").getAttribute('content') : '',
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        method: 'POST',
        body: data,
        credentials: 'include'
      }
    )
      .then(resp=>resp.json())
      .then((resp) => {
        if (resp.error == 0) {
          let permit = this.props.permit;
          permit.id = resp.id;
          this.setState({
            permitState: 2,
            permit: permit
          });
        } else {
          this.setState({
            permitState: -1,
            permitErrorMsg: resp.msg
          });
        }
      });
  };

  render() {
    let field_plan = (<span className={'form-control'}>{this.props.plan_date.value}</span>);
    let field_acceptance = (<span className={'form-control'}>{this.props.acceptance_date.value}</span>);
    let field_plan_acceptance = (<span className={'form-control'}>{this.props.acceptance_plan_date.value}</span>);
    let field_accepted = (<span className={'form-control'}>{this.props.accepted_date.value}</span>);
    let field_to_disable = (<span className={'form-control'}>{this.props.to_disable_date.value}</span>);
    let field_disable = (<span className={'form-control'}>{this.props.disable_date.value}</span>);
    let field_permit = (<span className={'form-control'}>{this.props.permit.value}</span>);
    let field_permit_from_date = (<span className={'form-control'}>{this.props.permit_from_date.value}</span>);
    let field_permit_to_date = (<span className={'form-control'}>{this.props.permit_to_date.value}</span>);
    if (this.props.rights != 0) {
      field_acceptance = (
        <span className={classNames(
                    'inputrow',
                    {
                        changed: this.props.acceptance_date.state==1,
                        saved: this.props.acceptance_date.state==2,
                        error: this.props.acceptance_date.state==-1,
                        'has-error': this.props.acceptance_date.state==-1
                    })}
          >
                    <DatePicker
                      dateFormat="YYYY-MM-DD"
                      selected={this.props.acceptance_date.value != ''? moment(this.props.acceptance_date.value, 'YYYY-MM-DD'):''}
                      onChange={this.handleAccDateChange}
                      isClearable={true}
                      placeholderText={''}
                      className={'form-control'}
                      />
          {this.props.acceptance_date.msg != '' ?
            <span className="help-block">{this.props.acceptance_date.msg}</span>
            : ''
          }
               </span>);
      field_plan_acceptance = (
        <span className={classNames(
                    'inputrow',
                    {
                        changed: this.props.acceptance_plan_date.state==1,
                        saved: this.props.acceptance_plan_date.state==2,
                        error: this.props.acceptance_plan_date.state==-1,
                        'has-error': this.props.acceptance_plan_date.state==-1
                    })}
          >
                    <DatePicker
                      dateFormat="YYYY-MM-DD"
                      selected={this.props.acceptance_plan_date.value != ''? moment(this.props.acceptance_plan_date.value, 'YYYY-MM-DD'):''}
                      onChange={this.handleAccPlanDateChange}
                      isClearable={true}
                      placeholderText={''}
                      className={'form-control'}
                      />
          {this.props.acceptance_plan_date.msg != '' ?
            <span className="help-block">{this.props.acceptance_plan_date.msg}</span>
            : ''
          }
               </span>);
      field_plan = (
        <span className={classNames(
                    'inputrow',
                    {
                        changed: this.props.plan_date.state==1,
                        saved: this.props.plan_date.state==2,
                        error: this.props.plan_date.state==-1,
                        'has-error': this.props.acceptance_date.state==-1
                    })}
          >
                    <DatePicker
                      dateFormat="YYYY-MM-DD"
                      selected={this.props.plan_date.value != ''? moment(this.props.plan_date.value, 'YYYY-MM-DD'):''}
                      onChange={this.handlePlanDateChange}
                      isClearable={true}
                      placeholderText={''}
                      className={'form-control'}
                      />
          {this.props.plan_date.msg != '' ?
            <span className="help-block">{this.props.plan_date.msg}</span>
            : ''
          }
                </span>);
      field_accepted = (
        <span className={classNames(
                    'inputrow',
                    {
                        changed: this.props.accepted_date.state==1,
                        saved: this.props.accepted_date.state==2,
                        error: this.props.accepted_date.state==-1,
                        'has-error': this.props.accepted_date.state==-1
                    })}
          >
                    <DatePicker
                      dateFormat="YYYY-MM-DD"
                      selected={this.props.accepted_date.value != ''? moment(this.props.accepted_date.value, 'YYYY-MM-DD'):''}
                      onChange={this.handleAcceptedDateChange}
                      isClearable={true}
                      placeholderText={''}
                      className={'form-control'}
                      />
          {this.props.accepted_date.msg != '' ?
            <span className="help-block">{this.props.accepted_date.msg}</span>
            : ''
          }
                </span>);
      field_to_disable = (
        <span className={classNames(
                    'inputrow',
                    {
                        changed: this.props.to_disable_date.state==1,
                        saved: this.props.to_disable_date.state==2,
                        error: this.props.to_disable_date.state==-1,
                        'has-error': this.props.to_disable_date.state==-1
                    })}
          >
                    <DatePicker
                      dateFormat="YYYY-MM-DD"
                      selected={this.props.to_disable_date.value != ''? moment(this.props.to_disable_date.value, 'YYYY-MM-DD'):''}
                      onChange={this.handleToDisableDateChange}
                      isClearable={true}
                      placeholderText={''}
                      className={'form-control'}
                      />
          {this.props.to_disable_date.msg != '' ?
            <span className="help-block">{this.props.to_disable_date.msg}</span>
            : ''
          }
                 </span>);
      field_disable = (
        <span className={classNames(
                    'inputrow',
                    {
                        changed: this.props.disable_date.state==1,
                        saved: this.props.disable_date.state==2,
                        error: this.props.disable_date.state==-1,
                        'has-error': this.props.disable_date.state==-1
                    })}
          >
                    <DatePicker
                      dateFormat="YYYY-MM-DD"
                      selected={this.props.disable_date.value != ''? moment(this.props.disable_date.value, 'YYYY-MM-DD'):''}
                      onChange={this.handleDisableDateChange}
                      isClearable={true}
                      placeholderText={''}
                      className={'form-control'}
                      />
          {this.props.disable_date.msg != '' ?
            <span className="help-block">{this.props.disable_date.msg}</span>
            : ''
          }
                </span>);
      field_permit = (<span className={classNames(
                    'inputrow',
                    {
                        changed: this.props.permit.state==1,
                        saved: this.props.permit.state==2,
                        error: this.props.permit.state==-1,
                        'has-error': this.props.permit.state==-1
                    })}
        >
                    <Autocomplete
                      inputProps={
                                    {
                                        name: "РКН", id: "form-autocomplete",
                                        className: 'form-control'
                                    }
                                }
                      ref="autocomplete"
                      value={this.props.permit.value}
                      items={this.state.permitsList}
                      getItemValue={(item) => item.value}
                      onSelect={this.handlePermitSelect}
                      onChange={this.handlePermitChange}
                      renderItem={(item, isHighlighted) => (
                                    <div
                                        style={isHighlighted ? styles.highlightedItem : styles.item}
                                        key={item.key}
                                        id={item.key}
                                    >{item.value}</div>
                                )}
                      />
        {this.props.disable_date.msg != '' ?
          <span className="help-block">{this.props.permit.msg}</span>
          : ''
        }
                </span>);
      field_permit_from_date = (<span className={classNames(
                    'inputrow',
                    {
                        changed: this.props.permit_from_date.state==1,
                        saved: this.props.permit_from_date.state==2,
                        error: this.props.permit_from_date.state==-1,
                        'has-error': this.props.permit_from_date.state==-1
                    })}
        >
                    <DatePicker
                      dateFormat="YYYY-MM-DD"
                      selected={this.props.permit_from_date.value != ''? moment(this.props.permit_from_date.value, 'YYYY-MM-DD'):''}
                      onChange={this.handlePermitFromDateChange}
                      isClearable={true}
                      placeholderText={''}
                      disabled={this.state.lockPermitDate}
                      className={'form-control'}
                      />
        {this.props.disable_date.msg != '' ?
          <span className="help-block">{this.props.permit_from_date.msg}</span>
          : ''
        }
                </span>);
      field_permit_to_date = (<span className={classNames(
                    'inputrow',
                    {
                        changed: this.props.permit_to_date.state==1,
                        saved: this.props.permit_to_date.state==2,
                        error: this.props.permit_to_date.state==-1,
                        'has-error': this.props.permit_to_date.state==-1
                    })}
        >
                    <DatePicker
                      dateFormat="YYYY-MM-DD"
                      selected={this.props.permit_to_date.value != ''? moment(this.props.permit_to_date.value, 'YYYY-MM-DD'):''}
                      onChange={this.handlePermitToDateChange}
                      isClearable={true}
                      placeholderText={''}
                      disabled={this.state.lockPermitDate}
                      className={'form-control'}
                      />
        {this.props.disable_date.msg != '' ?
          <span className="help-block">{this.props.permit_to_date.msg}</span>
          : ''
        }
            </span>);

    }
    let permitSaveMsg = null;
    if (this.props.permit.state == 1 && !this.props.permit.id && this.props.permit_from_date.state == 1 && this.props.permit_to_date.state == 1) {
      permitSaveMsg = <span className="help-block ">Данный номер разрешения не найден. <button
        className={'btn btn-xs btn-primary'} onClick={this.handlePermitSave}>Сохранить
      </button></span>
    } else {
      switch (this.state.permitState) {
        case 2:
          permitSaveMsg = <span className="help-block ok-message">Разрешеие успешно сохранен</span>;
          break;
        case -1:
          permitSaveMsg = <span className="help-block error">{this.state.permitErrorMsg}</span>;
          break;
      }
    };
    let style = classNames({
      changed: this.props.state == 1,
      saved: this.props.state == 2,
      error: this.props.state == -1
    });
    return (
      <tr>
        <th>{this.props.name}</th>
        <td>
          {field_plan}
        </td>
        <td>
          {field_acceptance}
        </td>
        <td>
          {field_plan_acceptance}
        </td>
        <td>
          {field_accepted}
        </td>
        <td>
          {field_to_disable}
        </td>
        <td>
          {field_disable}
        </td>
        <td>
          {field_permit}
          {permitSaveMsg}
        </td>
        <td>
          {field_permit_from_date}
        </td>
        <td>
          {field_permit_to_date}
        </td>
      </tr>
    )
  }
};


class ServiceWrap extends Component {
  defaultProps = {
    services: [],
    state: 0
  };
  static propTypes = {
    services: PropTypes.array,
    addressId: PropTypes.number.isRequired
  };
  state = {
    services: [],
    loading: false
  };

  constructor(props) {
    super(props);
  }

;
  componentDidMount = () => {
    if (!this.props.services) {
      console.log('Get services');
      this.getServices();
    } else {
      this.initServices(services);
    }
  };
  initServices = (services) => {
    for (let i in services) {
      console.log(services[i]);
      if (services[i].date_0) {
        services[i].date_0.msg = '';
        services[i].date_0.state = 0;
      } else {
        services[i].date_0 = {
          state: 0,
          value: '',
          msg: ''
        };
      }
      if (services[i].date_1) {
        services[i].date_1.msg = '';
        services[i].date_1.state = 0;
      } else {
        services[i].date_1 = {
          state: 0,
          value: '',
          msg: ''
        };
      }
      if (services[i].date_2) {
        services[i].date_2.msg = '';
        services[i].date_2.state = 0;
      } else {
        services[i].date_2 = {
          state: 0,
          value: '',
          msg: ''
        };
      }
      if (services[i].date_4) {
        services[i].date_4.msg = '';
        services[i].date_4.state = 0;
      } else {
        services[i].date_4 = {
          state: 0,
          value: '',
          msg: ''
        };
      }
      if (services[i].date_8) {
        services[i].date_8.msg = '';
        services[i].date_8.state = 0;
      } else {
        services[i].date_8 = {
          state: 0,
          value: '',
          msg: ''
        };
      }
      if (services[i].date_16) {
        services[i].date_16.msg = '';
        services[i].date_16.state = 0;
      } else {
        services[i].date_16 = {
          state: 0,
          value: '',
          msg: ''
        };
      }
      if (services[i].permit) {
        services[i].permit.msg = '';
        services[i].permit.state = 0;
      } else {
        services[i].permit = {
          state: 0,
          value: '',
          msg: ''
        };
      }
      if (services[i].permit_to_date) {
        services[i].permit_to_date.msg = '';
        services[i].permit_to_date.state = 0;
      } else {
        services[i].permit_to_date = {
          state: 0,
          value: '',
          msg: ''
        };
      }
      if (services[i].permit_from_date) {
        services[i].permit_from_date.msg = '';
        services[i].permit_from_date.state = 0;
      } else {
        services[i].permit_from_date = {
          state: 0,
          value: '',
          msg: ''
        };
      }
    }
    this.setState({
      services
    })
  };
  getServices = () => {
    this.setState({loading: true});
    fetch('/inventory/ajax/building/' + this.props.addressId + '/services',
      {
        method: 'GET',
        credentials: 'include'
      }
    )
      .then(resp=>resp.json())
      .then(resp=> {
        console.log(resp);
        this.initServices(resp);
        this.setState({loading: false});
      })
  };
  handleServiceChange = (service) => {
    let service_list = this.state.services;
    for (let i in service_list) {
      if (service_list[i].id == service.id) {
        service_list[i] = service
      }
    }
    this.setState({
      services: service_list,
      state: 1
    });
  };
  handleSave = () => {
    this.setState({loading: true});
    let data = JSON.stringify({
      services: this.state.services
    });

    console.log(data);
    fetch('/inventory/ajax/building/' + this.props.addressId + '/services', {
      headers: {
        'X-CSRF-Token': document.querySelector("meta[name='csrf-token']") ? document.querySelector("meta[name='csrf-token']").getAttribute('content') : '',
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      method: 'POST',
      body: data,
      credentials: 'include'
    })
      .then(resp=>resp.json())
      .then(resp=> {
        if (resp.error != 0) {
          let services = this.state.services;
          let save_state = resp.state;
          for(let i in services) {
            if (save_state[services[i].id]) {
              for(let d in save_state[services[i].id]) {
                services[i][d].state = save_state[services[i].id][d].error == 0?2:-1;
                if (save_state[services[i].id][d].error != 0) {
                  services[i][d].msg = save_state[services[i].id][d].msg;
                }
              }
            }
          }
          this.setState({
            services: services,
            state: -1
          });
        } else {
          let services = this.state.services;
          let save_state = resp.state;
          for(let i in services) {
            if (save_state[services[i].id]) {
              for(let d in save_state[services[i].id]) {
                services[i][d].state = 0;
              }
            }
          }
          this.setState({
            state:2,
            services: services
          });
        };
        this.setState({
          loading: false,
          services: resp,
          state: services_state
        });
      })
  };

  render() {
    let rows = [];
    for (let i in this.state.services) {
      let s = this.state.services[i];
      rows.push(<ServiceTableRow
        key={'service'+i}
        id={s.id}
        name={s.name}
        acceptance_date={s.date_1}
        acceptance_plan_date={s.date_2}
        plan_date={s.date_0}
        accepted_date={s.date_4}
        to_disable_date={s.date_8}
        disable_date={s.date_16}
        permit={s.permit}
        permit_from_date={s.permit_from_date}
        permit_to_date={s.permit_to_date}
        onChange={this.handleServiceChange}
        rights={this.props.rights}
        className={this.props.className}
        changed={s.changed || false}
        state={this.props.state}
        />)
    }
    let style = classNames(
      'table',
      'table-bordered',
      'table-hover',
      'dataTable',
      'service-table',
      {
        changed: this.state.state == 1,
        saved: this.state.state == 2,
        error: this.state.state == -1
      });
    return (
      <div className="service_wrap col-md-12">
        <div className="box box-default">
          <div className="box-body">
            <table className={style}>
              <thead>
              <tr>
                <th rowSpan={2}>Название</th>
                <th rowSpan={2}>Планируемая дата<br/>запуска услуги</th>
                <th colSpan={3}>Приемка</th>
                <th colSpan={2}>Отключение</th>
                <th colSpan={3}>Разрешение РКН</th>
              </tr>
              <tr>
                <th>Начало</th>
                <th>План</th>
                <th>Факт</th>
                <th>План</th>
                <th>Факт</th>
                <th>№</th>
                <th>От</th>
                <th>До</th>
              </tr>
              </thead>
              <tbody>
              {rows}
              </tbody>
            </table>
          </div>
          <div className="box-footer">
            <div className="">{this.state.msg}</div>
            {this.state.state == 1 ?
              <button className="btn btn-primary" onClick={this.handleSave}>Сохранить</button>
              :
              null
            }
          </div>
          <BoxOverlay
            show={this.state.loading}
            />
        </div>
      </div>
    )
  }
}
;

ReactDOM.render(
  <ServiceWrap
    addressId={BuildingData.address_id}
    />,
  document.getElementById('services-list')
);