import React, { PropTypes, Component } from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';
import * as Table from 'reactabular-table';
import * as resolve from 'table-resolver';
var AppActions = require('../../common/actions/AppActions.js');
import FormTextField from '../../common/components/FormTextField';

import { Modal } from 'react-bootstrap';

var LoadBar = require('../../common/components/LoadBar');
import ModalDialog from 'react-bootstrap/lib/ModalDialog';
import Draggable from 'react-draggable';
import CapexModifyModal from './CapexModifyModal';

class DraggableModalDialog extends Component {
  render() {
    return <Draggable handle=".modal-title"><ModalDialog
      backdrop={false}
      enforceFocus={false}
      {...this.props} /></Draggable>
  }
}

export default class ConfirmResetModal extends Component {
  static propTypes = {
    handleClose: PropTypes.func.isRequired,
    handleConfirm: PropTypes.func.isRequired,
    msg: PropTypes.string.isRequired,
    ip: PropTypes.string.isRequired,
    status: PropTypes.number.isRequired
  };
  render() {
    let body='';
    switch (this.props.status) {
      case 0:
        body = <div className="alert alert-danger"><h4><i className="icon fa fa-exclamation-triangle"></i> Внимание!</h4>
          Вы уверены, что хотите сбросить сессию аобнента c IP:<b>{this.props.ip}?</b><br/>
          Бесконтрольный сброс сессий абонентов может негативно повлиять на сервис.
        </div>;
        break;
      case 1:
        body = <div className="alert alert-success">
          <h4><i className="icon fa fa-check"></i> Сессия сброшена</h4>
        </div>;
        break;
      case -1:
        body = <div className="alert alert-danger">
          <h4><i className="icon fa fa-ban"></i> Ошибка!</h4>
          {this.props.msg}
        </div>;
    }
    return (
      <Modal
        dialogComponentClass={DraggableModalDialog}
        show={this.props.show}
        onHide={this.props.handleClose}
        animation={false}
        backdrop={false}
        enforceFocus={false}
        >
        <Modal.Header closeButton>
          <Modal.Title>Сброс пользовательской сессии</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {body}
        </Modal.Body>
        <Modal.Footer>
          {this.props.status==0?
            <button type="button" className="btn btn-danger" onClick={this.props.handleConfirm}>Сбросить</button>
            :
            ''
          }
          <button type="button" className="btn btn-default" onClick={this.props.handleClose}>Закрыть</button>
        </Modal.Footer>
      </Modal>
    );
  }
}

class CapexFilter extends Component {
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

class CapexTable extends Component {
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
      //onDoubleClick: () => this.props.onSelect(row)
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
      <div className="box">
        <div className="box-body">
          <Table.Provider
            className="table table-bordered table-hover dataTable"
            columns={resolvedColumns}
            style={{ overflowX: 'auto' }}
            >
            <Table.Header headerRows={resolve.headerRows({ columns: this.props.columns })} />
            {this.props.items.length > 0 ?
              <Table.Body
                rows={resolvedRows}
                rowKey="id"
                onRow={this.onRow}
                />
              :
              <tbody><tr><td colSpan={this.props.columns.length}>По вашему запросу ничего не найдено</td></tr></tbody>
            }
          </Table.Provider>
        </div>
      </div>
    )
  }
}



class CapexList extends Component {
  getColumns = () => {
    let cols = [];
    if (this.state.canModifyCapex) {
      cols.push({
        header: {
          props: {
            style: {
              width: 30
            }
          }
        },
        cell: {
          props: {
            style: {
              width: 30
            }
          },
          formatters: [
            (selected, row) => {
              return (<i className="fa fa-pencil-square-o link" onClick={()=>this.onSelectRow(row.rowData)} />)
            }
          ]
        }
      })
    };
    return [
      ...cols,
      {
        property: 'code',
        header: {
          label: 'Код'
        }
      },
      {
        property: 'agreement',
        header: {
          label: 'Договор'
        }
      },
      {
        property: 'amount',
        header: {
          label: 'Сумма'
        }
      },
      {
        property: 'type',
        header: {
          label: 'Флаг ТМЦ'
        }
      }
    ];
  };

  loadData = () => {
    AppActions.initLoading();
    fetch("/financial/ajax/capex-list/"+this.state.searchString, {method: 'GET', credentials: 'include'})
      .then(resp => resp.json())
      .then(resp => {
          this.setData(resp);
      });
  };
  checkAddRights = () => {
    fetch('/financial/ajax/checkrights/capex/add', {method: 'GET', credentials: 'include'})
      .then(resp => {
        return resp.json()})
      .then(resp => {
        this.setState({
          canAddCapex: resp
        });
      });
  };
  checkModifyRights = () => {
    fetch('/financial/ajax/checkrights/capex/modify', {method: 'GET', credentials: 'include'})
      .then(resp => {
        return resp.json()})
      .then(resp => {
        this.setState({
          canModifyCapex: resp
        });
      });
  };
  componentDidMount = () => {
    this.checkAddRights();
    this.checkModifyRights();
  };

  state = {
    items: null,
    canAddCapex: false,
    canModifyCapex: false,
    canDeleteCapex: false,
    showCapexModal: false,
    selectedCapex: null,
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

  handleDeleteCapex = (code) => {
    if (code) {
      fetch('/financial/ajax/capex/'+code, {
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
              showCapexModal: false,
              selectedCapex: null,
              save_state: 3
            });
            this.loadData();
          } else {
            this.setState({
              save_state: -2,
              msg: resp.msg,
              selectedCapex: {
                codeIsInit: true
              }
            })
          }
        });
    }
  };

  handleSaveCapex = (capex, stayOpened) => {
    stayOpened = stayOpened || false;
    let data = JSON.stringify({
      code: capex.code,
      amount: capex.amount,
      agreement: capex.agreement,
      type: capex.type,
    });
    let url = '/financial/ajax/capex/'+((capex.id)?capex.id:'');
    let method = (capex.id)?'POST':'PUT';
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
            showCapexModal: stayOpened,
            selectedCapex: null,
            save_state: 2
          });
          if (!stayOpened) {
            this.loadData()
          }
        } else {
          this.setState({
            save_state: -1,
            msg: resp.msg,
            selectedCapex: {
              codeIsInit: true
            }
          })
        }
      });
  };
  handleSearch =  () => {
    this.loadData();
  };
  onSelectRow = (row) => {
    console.log(row);
    console.log('ON SELECT ROW');
    if (this.state.canModifyCapex) {
      this.setState({
        selectedCapex: {
          id: row.capex_id,
          work: {
            value: row.work,
            state: 0,
            msg: '',
          },
          system: {
            value: row.system,
            state: 0,
            msg: ''
          },
          city: {
            value: row.city,
            state: 0,
            msg: ''
          },
          region: {
            value: row.region,
            state: 0,
            msg: ''
          },
          address: {
            value: row.address,
            state: 0,
            msg: ''
          },
          agreement: {
            value: row.agreement,
            state: 0,
            msg: ''
          },
          amount: {
            value: row.amount,
            state: 0,
            msg: ''
          },
          type: {
            value: row.type,
            state: 0,
            msg: ''
          }
        },
        showCapexModal: true,
        save_state: 0,
        msg: ''
      });
    }
  };
  render = () => {
    return (
      <div>
        <CapexFilter
          searcString={this.state.searchString}
          onChange={(e)=>{this.setState({searchString: e.value})}}
          onSearch={this.handleSearch}
          />
        <CapexTable
          columns={this.getColumns()}
          items={this.state.items}
          onSelect={this.onSelectRow}
          />
        <LoadBar />
        <CapexModifyModal
          state={this.state.save_state}
          show={this.state.showCapexModal}
          capex={this.state.selectedCapex}
          canDeleteCapex={this.state.canDeleteCapex}
          onHide={()=>{this.setState({
            showCapexModal: false,
            selectedCapex: null
          })}}
          onDelete={this.handleDeleteCapex}
          onSave={this.handleSaveCapex}
          msg={this.state.msg}
          />
        {this.state.canAddCapex?
          <button
            onClick={()=>this.setState({
                          showCapexModal: !this.state.showCapexModal,
                          selectedCapex: null,
                          save_state: 0,
                          msg: ''
                      })}
            className={'btn btn-primary'}
            >
            Добавить CAPEX
          </button>:null
        }
      </div>
    )
  }
}

ReactDOM.render(
  <CapexList />,
  document.getElementById('capex-list')
);
