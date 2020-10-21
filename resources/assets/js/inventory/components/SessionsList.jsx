import React, { PropTypes, Component } from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';
import * as Table from 'reactabular-table';
import * as resolve from 'table-resolver';
var AppActions = require('../../common/actions/AppActions.js');
import FormTextField from '../../common/components/FormTextField';

import { Modal } from 'react-bootstrap';

var LoadBar = require('../../common/components/LoadBar.jsx');
import ModalDialog from 'react-bootstrap/lib/ModalDialog';
import Draggable from 'react-draggable';

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

class SessionFilter extends Component {
    static PropTypes = {
        onChange: PropTypes.func.isRequired,
        onSearch: PropTypes.func.isRequired,
        searchString: PropTypes.string.isRequired,
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
                <button className="btn btn-default" title="Поиск можно осуществлять не чаще 1 раза в 5 секунд" onClick={this.props.onSearch} disabled={!this.props.canSearch}>Поиск</button>
            </div>
        </div>
    };
}

class SessionsTable extends Component {
    static PropTypes = {
        columns: PropTypes.array.isRequired,
        items: PropTypes.array,
        onSelect: PropTypes.func
    };

    curClass = 'odd-row';

    onRow = (row, { rowIndex }) => {
        let rowClass = classNames(
          {'odd-row': this.curClass == 'odd-row'},
          {'even-row': this.curClass == 'even-row'}
        );
        return {
            rowSpan: 2,
            className: rowClass,
        };
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
                      <Table.Header
                        headerRows={resolve.headerRows({columns: this.props.columns})}
                        />
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

class SessionsList extends Component {
    getColumns = () => {
        return [
            {
                property: 'ip_addr',
                header: {
                    label: 'IP адрес',
                }
            },
            {
                property: 'mac',
                header: {
                    label: 'MAC'
                }
            },
            {
                property: 'session_time',
                header: {
                    label: 'Время работы сессии'
                }
            },
            {
                property: 'rental_time',
                header: {
                    label: 'Срок аренды'
                }
            },
            {
                property: 'location',
                header: {
                    label: 'Локация'
                }
            },
            {
                property: 'status',
                header: {
                  label: 'Статус'
                }
            },
            {
                property: 'active_service',
                header: {
                  label: 'Активные сервисы'
                },
                cell: {
                  formatters: [
                    function (service) {
                      return (
                        <div className="client-service-list">
                          <ul>
                            {service.map((e)=> {
                              return <li>{e.name}</li>
                            })}
                          </ul>
                        </div>
                      )
                    }
                  ]
                }
            },
          {
            header: {
              label: 'Данные по трафику'
            },
            children: [
              {
                property: 'traffic_type',
                header: {
                  label: 'Тип трафика'
                },
                cell: {
                  formatters:[
                    function (options, row) {
                      return (
                        <div className="traffic-col">
                        <div className="traffic-row">
                          IN
                        </div>
                        <div className="traffic-row">
                          OUT
                        </div>
                        </div>
                      )
                    }
                  ]
                }
              },
              {
                property: 'pockets_count',
                header: {
                  label: 'Количество пакетов'
                },
                cell: {
                  formatters:[
                    function (val, row) {
                      return (
                        <div className="traffic-col">
                          <div className="traffic-row">
                            {val.in}
                          </div>
                          <div className="traffic-row">
                            {val.out}
                          </div>
                        </div>
                      )
                    }
                  ]
                }
              },
              {
                property: 'bytes_count',
                header: {
                  label: 'Количество байт'
                },
                cell: {
                  formatters:[
                    function (val) {
                      return (
                        <div className="traffic-col">
                          <div className="traffic-row">
                            {val.in}
                          </div>
                          <div className="traffic-row">
                            {val.out}
                          </div>
                        </div>
                      )
                    }
                  ]
                }
              },
              {
                property: 'session',
                header: {
                  label: 'Сбросить'
                },
                cell: {
                  formatters:[
                    function (options, row, t) {
                      console.log(options);
                      console.log(row);
                      console.log(t);
                      return (
                        <div className="traffic-col">
                          <button className="btn btn-xs btn-danger" onClick={()=>{this.setState({logoff_ip: row.rowData.ip_addr, show_confirm: true})}}>Сбросить сессию</button>
                        </div>
                      )
                    }.bind(this)
                  ]
                }
              }
            ]
          }
        ];
    };

    handleSearch =  () => {
        this.setState({
          canSearch: false
        });
        this.loadData();
        setTimeout(()=>{this.setState({canSearch: true})}, 3000);
    };

    handleFilterChange = (val) => {
        this.setState({
            searchString: val.value
        });
    };

    loadData = () => {
      if (this.state.searchString.trim() != '') {
        AppActions.initLoading();
        $.ajax({
          type: "GET",
          url: "/inventory/ajax/sessions/" + this.state.searchString,
          success: this.setData
        });
      }
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

    state = {
        searchString: '',
        items: null,
        logoff_ip: '',
        show_confirm: false,
        logoff_state: 0,
        logoff_msg:'',
        canSearch: true
    };

    setData = (a) => {
        if (a.error == 0) {
            this.setState({
                items: a.data
            })
        }
        AppActions.cancelLoading();
    };

    handleSessionLogoff = () => {
      if (this.state.logoff_ip.trim()) {
        fetch('/inventory/ajax/session/' + this.state.logoff_ip, {method: 'DELETE', credentials: 'include'})
          .then(resp => {
            return resp.json()
          })
          .then(resp => {
            if (resp.error == 0) {
              this.setState({
                logoff_state: 1,
                logoff_msg: '',
                logoff_ip: ''
              })
            } else {
              this.setState({
                logoff_state: -1,
                logoff_msg: resp.msg,
                logoff_ip: ''
              })
            }
            this.setState({
              canAddInterface: resp
            });
          });
      } else {
        this.setState({
          logoff_state: -1,
          logoff_msg: 'Отсутствует IP адрес'
        })
      }
    };

    render = () => {
        return (
          <div>
              <SessionFilter
                searchString={this.state.searchString}
                onChange={this.handleFilterChange}
                onSearch={this.handleSearch}
                canSearch={this.state.canSearch && this.state.searchString !=''}
                />
              <SessionsTable
                columns={this.getColumns()}
                items={this.state.items}
                />
              <ConfirmResetModal
                handleClose={()=>{this.setState({logoff_ip: '', show_confirm:false, logoff_state: 0, logoff_msg: ''})}}
                handleConfirm={this.handleSessionLogoff}
                msg={this.state.logoff_msg}
                ip={this.state.logoff_ip}
                status={this.state.logoff_state}
                show={this.state.show_confirm}
                />
              <LoadBar />
          </div>
        )
    }
}

ReactDOM.render(
  <SessionsList />,
  document.getElementById('sessions-list')
);
