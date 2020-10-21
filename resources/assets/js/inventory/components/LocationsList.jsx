import React, { PropTypes, Component } from 'react';
import classNames from 'classnames';
import AppActions from '../../common/actions/AppActions.js';
import LoadBar from '../../common/components/LoadBar.jsx';
import LocationModifyModal from './LocationModifyModal.jsx';
import FormTextField from '../../common/components/FormTextField';
import ReactDOM from 'react-dom';

import * as Table from 'reactabular-table';
import * as resolve from 'table-resolver';

class LocationsFilter extends Component {
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

class LocationsTable extends Component {
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
            Найденные локации
          </h3>
        </div>
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
                rowKey="location_id"
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

export default class LocationsList extends Component {
  getColumns = () => {
    return [
      {
        property: 'location_id',
        header: {
          label: 'ID',
        }
      },
      {
        property: 'name',
        header: {
          label: 'Наименование'
        }
      },
      {
        property: 'desk',
        header: {
          label: 'Описание'
        }
      },
      {
        property: 'params',
        header: {
          label: 'Параметры'
        },
        cell: {
          formatters:[
            function (params, row) {
              let items = [];
              for(let i in params) {
                items.push(<li>{params[i].name+'='+params[i].value}</li>);
              }
              return (
                <ul>
                  {
                    items
                  }
                </ul>
              )
            }
          ]
        },
      }
    ];
  };


  checkAddRights = () => {
    fetch('/inventory/ajax/checkrights/location/add', {method: 'GET', credentials: 'include'})
      .then(resp => {
        return resp.json()})
      .then(resp => {
        this.setState({
          canAddLocation: resp
          });
      });
  };

  checkModifyRights = () => {
    fetch('/inventory/ajax/checkrights/location/modify', {method: 'GET', credentials: 'include'})
      .then(resp => {
        return resp.json()})
      .then(resp => {
        this.setState({
          canModifyLocation: resp
          });
      });
  };

  checkDeleteRights = () => {
    fetch('/inventory/ajax/checkrights/location/delete', {method: 'GET', credentials: 'include'})
      .then(resp => {
        return resp.json()})
      .then(resp => {
        this.setState({
          canDeleteLocation: resp
        });
      });
  };

  loadData = () => {
    AppActions.initLoading();
    $.ajax({
      type: "GET",
      url: "/inventory/ajax/location-list/"+this.state.searchString,
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
    canAddLocation: 0,
    canModifyLocation: 0,
    canDeleteLocation: 0,
    showLocationModal: false,
    selectedLocation: null,
    items: null
  };

  setData = (a) => {
    if (a.error == 0) {
      this.setState({
        items: a.data
      })
    }
    AppActions.cancelLoading();
  };
  handleSaveLocation = (location, stayOpened) => {
    stayOpened = stayOpened || false;
    let data = JSON.stringify({
      name: location.name,
      desk: location.desk,
      params: location.params || []
    });
    let url = '/inventory/ajax/location/'+(location.location_id?location.location_id:'');
    let method = (location.location_id)?'POST':'PUT';
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
            showLocationModal: stayOpened,
            selectedLocation: null,
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
  handleDeleteLocation = (location_id) => {
    if (location_id) {
      fetch('/inventory/ajax/location/'+location_id, {
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
              showLocationModal: false,
              selectedLocation: null,
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
    if (this.state.canModifyLocation) {
      this.setState({
        selectedLocation: {
          location_id: row.location_id,
          name: {
            value: row.name,
            state: 0,
            msg: ''
          },
          desk: {
            value: row.desk,
            state: 0,
            msg: ''
          },
          params: row.params
        },
        showLocationModal: true,
        save_state: 0,
        msg: ''
      });
    }
  };

  handleSearch =  () => {
    this.loadData();
  };

  handleFilterChange = (val) => {
    this.setState({
      searchString: val.value
    });
  };

  render = () => {
    return (
      <div>
        <LocationsFilter
          searchString={this.state.searchString}
          onChange={this.handleFilterChange}
          onSearch={this.handleSearch}
          />
        <LocationsTable
          columns={this.getColumns()}
          items={this.state.items}
          onSelect={this.onSelectRow}
          searchString={this.state.searchString}
          />
        <LoadBar />
        <LocationModifyModal
          state={this.state.save_state}
          show={this.state.showLocationModal}
          location={this.state.selectedLocation}
          canDeleteLocation={this.state.canDeleteLocation}
          onHide={()=>{this.setState({
            showLocationModal: false,
            selectedLocation: null
          })}}
          onDelete={this.handleDeleteLocation}
          onSave={this.handleSaveLocation}
          msg={this.state.msg}
          />
        {this.state.canAddLocation?
          <button
            onClick={()=>this.setState({
                          showLocationModal: !this.state.showLocationModal,
                          selectedLocation: null,
                          save_state: 0,
                          msg: ''
                      })}
            className={'btn btn-primary'}
            >
            Добавить локацию
          </button>:null
        }
      </div>
    )
  }
};

ReactDOM.render(
  <LocationsList />,
  document.getElementById('location-list')
);