import React, { PropTypes, Component } from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';
import * as Table from 'reactabular-table';
import * as resolve from 'table-resolver';
var AppActions = require('../../common/actions/AppActions.js');
import FormTextField from '../../common/components/FormTextField';
import RecordModifyModal from './RecordModifyModal.jsx';

import { Modal } from 'react-bootstrap';

var LoadBar = require('../../common/components/LoadBar');
import ModalDialog from 'react-bootstrap/lib/ModalDialog';
import Draggable from 'react-draggable';


class BuildingTabFilter extends Component {
  static PropTypes = {
    onChange: PropTypes.func.isRequired,
    onSearch: PropTypes.func.isRequired,
    searchString: PropTypes.string.isRequired
  };

  handleChange = (session) => {
    this.props.onChange(session);
  };

  render = () => {
    return <div className="box">
      <div className="box-body">
        <FormTextField
          label="Поиск"
          value={this.props.searchString}
          state={0}
          msg=''
          onChange={this.handleChange}
          />
        <button className="btn btn-default" onClick={this.props.onSearch} disabled={this.props.searchString==''}>Поиск</button>
      </div>
    </div>
  };
}

class BuildingTabTable extends Component {
  static PropTypes = {
    columns: PropTypes.array.isRequired,
    items: PropTypes.array
  };

  curClass = 'odd-row';

  onRow = (row, { rowIndex }) => {
    this.curClass = row.interface_id != ''? this.curClass=='odd-row' ? 'even-row':'odd-row': this.curClass;
    let rowClass = classNames(
      {'odd-row': this.curClass == 'odd-row'},
      {'even-row': this.curClass == 'even-row'}
    );
    return {
      className: rowClass,
    };
  };

  componentDidMount = () => {
    let that = this;
    document.onkeydown = function(e) {
      e = e || window.event;
      if (e.keyCode == 13) {
        that.loadData();
      }
      return true;
    }
  };

  render = () => {
    if (!Array.isArray(this.props.items)) return null;
    const resolvedColumns = resolve.columnChildren({columns: this.props.columns});
    const resolvedRows = resolve.resolve({
      columns: resolvedColumns,
      method: resolve.nested
    })(this.props.items);
    return (
      <div>
        <Table.Provider
          className="table table-bordered table-hover dataTable"
          columns={resolvedColumns}
          style={{ overflowX: 'auto' }}
          >
          <Table.Header headerRows={resolve.headerRows({ columns: this.props.columns })} />
          {this.props.items.length > 0 ?
            <Table.Body
              rows={resolvedRows}
              rowKey="location_id"
              onRow={this.onRow}
              />
            :
            <tbody><tr><td colSpan={this.props.columns.length}>По вашему запросу ничего не найдено</td></tr></tbody>
          }
        </Table.Provider>
      </div>
    )
  }
}



export default class BuildingTab extends Component {
  getColumns = () => {
    return [
      {
        property: 'system_building_type',
        header: {
          label: 'Система'
        }
      },
      {
        property: 'work_documents',
        header: {
          label: 'РД'
        }
      },
      {
        property: 'company',
        header: {
          label: 'Подрядчик'
        }
      },
      {
        property: 'agreement_expense',
        header: {
          label: 'Договор расход'
        }
      },
      {
        property: 'agreement_income',
        header: {
          label: 'Договор доход'
        }
      },
      {
        property: 'doc_link',
        header: {
          label: 'ИД'
        }
      },
      {
        property: 'date',
        header: {
          label: 'Сдано'
        }
      },
      {
        property: 'doc_link_ao',
        header: {
          label: 'Акт ОЭ'
        }
      },
      {
        property: 'doc_link_pk',
        header: {
          label: 'Акт ПК'
        }
      },
      {
        property: 'state_desk',
        header: {
          label: 'Статус'
        }
      }
    ];
  };

  loadData = () => {
    AppActions.initLoading();
    fetch("/inventory/ajax/building/"+this.props.addressId+"/building-tab-list/"+this.state.searchString, {method: 'GET', credentials: 'include'})
      .then(resp => resp.json())
      .then(resp => {
          this.setData(resp);
      });
      AppActions.cancelLoading();
  };
  checkAddRights = () => {
    fetch('/inventory/ajax/checkrights/buildingtab/add', {method: 'GET', credentials: 'include'})
      .then(resp => {
        return resp.json()})
      .then(resp => {
        this.setState({
          canAddRecord: resp
        });
      });
  };
  componentDidMount = () => {
    this.checkAddRights();
    this.loadData();
  };

  state = {
    items: null,
    canAddRecord: false,
    canDeleteRecord: false,
    showRecordModal: false,
    selectedRecord: null,
    save_state: 0,
    searchString: '',
    msg: ''
  };

  setData = (a) => {
    if (a.error == 0) {
      this.setState({
        items: a.data
      })
    }
    AppActions.cancelLoading();
  };

  handleDeleteReport = (code) => {
    if (code) {
      fetch('/inventory/ajax/buildingtab/'+this.props.addressId, {
        headers: {
          'X-CSRF-Token': document.querySelector("meta[name='csrf-token']") ? document.querySelector("meta[name='csrf-token']").getAttribute('content') : '',
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        method: 'DELETE',
        credentials: 'include'
      })
        .then(resp=>resp.json())
        .then(resp=> {
          if (resp.error == 0) {
            this.setState({
              showRecordModal: false,
              selectedRecord: null,
              save_state: 3
            });
            this.loadData();
          } else {
            this.setState({
              save_state: -2,
              msg: resp.msg,
              selectedRecord: {
                codeIsInit: true
              }
            })
          }
        });
    }
  };

  handleSaveRecord = (record, stayOpened) => {
    stayOpened = stayOpened || false;
    let data = JSON.stringify({
      system: record.system,
      rd: record.rd,
      contractor: record.contractor,
      agreement_expense: record.agreement_expense,
      agreement_income: record.agreement_income,
      doc_link: record.doc_link,
      date: record.date,
      doc_link_ao: record.doc_link_ao,
      doc_link_pk: record.doc_link_pk,
      status: record.status
    });
    let url = '/inventory/ajax/building/'+this.props.addressId+'/building-tab-record/';
    let method = 'PUT';
    fetch(url, {
      headers: {
        'X-CSRF-Token': document.querySelector("meta[name='csrf-token']")?document.querySelector("meta[name='csrf-token']").getAttribute('content'):'',
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      method: method,
      body: data,
      credentials: 'include'
    })
      .then(resp=>resp.json())
      .then(resp=> {
        if (resp.error == 0) {
          this.setState({
            showRecordModal: stayOpened,
            selectedRecord: null,
            save_state: 2
          });
          if (!stayOpened) {
            this.loadData()
          }
        } else {
          this.setState({
            save_state: -1,
            msg: resp.msg,
            selectedRecord: {
              codeIsInit: true
            }
          })
        }
      });
  };
  handleSearch =  () => {
    this.loadData();
  };
  handleDelete = () => {

  };
/*<BuildingTabFilter
searcString={this.state.searchString}
onChange={(e)=>{this.setState({searchString: e.value})}}
onSearch={this.handleSearch}
/>*/
  render = () => {
    return (
      <div>
        <BuildingTabTable
          columns={this.getColumns()}
          items={this.state.items}
          />
        <LoadBar />
        {this.state.canAddRecord ?
          <RecordModifyModal
            addressId={this.props.addressId}
            state={this.state.save_state}
            show={this.state.showRecordModal}
            record={this.state.selectedRecord}
            onHide={()=>{this.setState({
              showRecordModal: false,
              selectedRecord: null
            })}}
            onDelete={this.handleDelete}
            onSave={this.handleSaveRecord}
            msg={this.state.msg}
            />
          : ''
        }
        {this.state.canAddRecord?
          <button
            onClick={()=>this.setState({
                          showRecordModal: !this.state.showRecordModal,
                          selectedRecord: null,
                          save_state: 0,
                          msg: ''
                      })}
            className={'btn btn-primary'}
            >
            Добавить запись
          </button>:null
        }
      </div>
    )
  }
}

ReactDOM.render(
  <BuildingTab
    addressId={BuildingData.address_id}
    />,
  document.getElementById('building-tab')
);
