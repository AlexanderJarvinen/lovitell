import React, { PropTypes, Component } from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';
import * as Table from 'reactabular-table';
import * as resolve from 'table-resolver';
var AppActions = require('../../common/actions/AppActions.js');
import InterfaceModifyModal from './InterfaceModifyModal';
import FormTextField from '../../common/components/FormTextField';

var LoadBar = require('../../common/components/LoadBar.jsx');

class InterfaceFilter extends Component {
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
        <button className="btn btn-default" onClick={this.props.onSearch}>Поиск</button>
      </div>
    </div>
  };
}

class InterfacesTable extends Component {
  static PropTypes = {
    columns: PropTypes.array.isRequired,
    items: PropTypes.array,
    onSelect: PropTypes.func
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
      onDoubleClick: () => this.props.onSelect(row)
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
        <div className="box-header">
          <h3 className="box-title">
            Найденные интерфейсы <a href={"/inventory/interfaces/export?search_string="+this.props.searchString} target="_blank"><i className="fa fa-download"></i></a>
          </h3>
        </div>
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

class InterfacesList extends Component {
  getColumns = () => {
    return [
      {
        property: 'iface',
        header: {
          label: 'Интерфейс'
        }
      },
      {
        property: 'nas_port_id',
        header: {
          label: 'NAS_PORT_ID'
        }
      },
      {
        property: 'brand_descr',
        header: {
          label: 'Бренд'
        }
      },
      {
        property: 'location_name',
        header: {
          label: 'Локация'
        }
      },
      {
        property: 'iface_name',
        header: {
          label: 'Название'
        }
      },

      {
        property: 'iface_descr',
        header: {
          label: 'Описание'
        }
      }
    ];
  };

  handleSearch =  () => {
    this.loadData();
  };

  handleFilterChange = (val) => {
    this.setState({
      searchString: val.value
    });
  };

  checkAddRights = () => {
    fetch('/inventory/ajax/checkrights/interface/add', {method: 'GET', credentials: 'include'})
      .then(resp => {
        return resp.json()})
      .then(resp => {
        this.setState({
          canAddInterface: resp
        });
      });
  };

  checkModifyRights = () => {
    fetch('/inventory/ajax/checkrights/interface/modify', {method: 'GET', credentials: 'include'})
      .then(resp => {
        return resp.json()})
      .then(resp => {
        this.setState({
          canModifyInterface: resp
        });
      });
  };

  checkDeleteRights = () => {
    fetch('/inventory/ajax/checkrights/interface/delete', {method: 'GET', credentials: 'include'})
      .then(resp => {
        return resp.json()})
      .then(resp => {
        this.setState({
          canDeleteInterface: resp
        });
      });
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
      onDoubleClick: () => this.props.onSelect(row)
    };
  };

  loadData = () => {
    AppActions.initLoading();
    $.ajax({
      type: "GET",
      url: "/inventory/ajax/interfaces/"+this.state.searchString,
      success: this.setData
    });
  };

  componentDidMount = () => {
    this.checkAddRights();
    this.checkModifyRights();
    this.checkDeleteRights();
  };

  state = {
    searchString: '',
    items: null,
    showInterfaceModal: false,
    selectedInterface: null,
    canModifyInterface: false,
    canAddInterface: false
  };

  setData = (a) => {
    if (a.error == 0) {
      this.setState({
        items: a.data
      })
    }
    AppActions.cancelLoading();
  };

  handleSaveInterface = (iface, stayOpened) => {
    console.log(iface);
    stayOpened = stayOpened || false;
    let data = JSON.stringify({
      brand_id: iface.brand_id,
      location_id: iface.location_id,
      iface: iface.iface,
      name: iface.name,
      descr: iface.descr,
      brand: iface.brand,
      nas_port_id: iface.nas_port_id
    });
    let url = '/inventory/ajax/interface/'+(iface.id?iface.id:'');
    let method = (iface.id)?'POST':'PUT';
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
            showInterfaceModal: stayOpened,
            selectedInterface: null,
            save_state: 2
          });
          if (!stayOpened) {
            this.loadData()
          }
        } else {
          this.setState({
            save_state: -1,
            msg: resp.msg
          })
        }
      });
  };
  handleDeleteInterface = (iface_id) => {
    if (iface_id) {
      fetch('/inventory/ajax/interface/'+iface_id, {
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
              showInterfaceModal: false,
              selectedInterface: null,
              save_state: 3
            });
            this.loadData();
          } else {
            this.setState({
              save_state: -2,
              msg: resp.msg
            })
          }
        });
    }
  };

  onSelectRow = (row) => {
    console.log(row)
    if (this.state.canModifyInterface) {
      this.setState({
        selectedInterface: {
          id: row.id,
          location: {
            value: row.location_id,
            state: 0,
            msg: ''
          },
          name: {
            value: row.iface_name,
            state: 0,
            msg: ''
          },
          descr: {
            value: row.iface_descr,
            state: 0,
            msg: ''
          },
          iface: {
            value: row.iface,
            state: 0,
            msg: ''
          },
          nas_port_id: {
            value: row.nas_port_id,
            state: 0,
            msg: ''
          },
          brand: {
            value: row.brand_id,
            state: 0,
            msg: ''
          }
        },
        showInterfaceModal: true,
        save_state: 0,
        msg: ''
      });
    }
  };

  render = () => {
    return (
      <div>
        <InterfaceFilter
          searchString={this.state.searchString}
          onChange={this.handleFilterChange}
          onSearch={this.handleSearch}
          />
        <InterfacesTable
          columns={this.getColumns()}
          items={this.state.items}
          onSelect={this.onSelectRow}
          searchString={this.state.searchString}
          />
        <LoadBar />
        <InterfaceModifyModal
          state={this.state.save_state}
          show={this.state.showInterfaceModal}
          iface={this.state.selectedInterface}
          onHide={()=>{this.setState({
                  showInterfaceModal: false,
                  selectedInterface: null
                })}}
          onSave={this.handleSaveInterface}
          msg={this.state.msg}
          canDeleteInterface={this.state.canDeleteInterface}
          onDelete={this.handleDeleteInterface}
          />
        {this.state.canAddInterface?
          <button
            onClick={()=>this.setState({
                                showInterfaceModal: !this.state.showInterfaceModal,
                                selectedInterface: null,
                                save_state: 0,
                                msg: ''
                            })}
            className={'btn btn-primary'}
            >
            Добавить интерфейс
          </button>:null
        }
      </div>
    )
  }
}

ReactDOM.render(
  <InterfacesList />,
  document.getElementById('interfaces-list')
);
