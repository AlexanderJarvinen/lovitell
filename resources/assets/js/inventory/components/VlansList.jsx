import React, { PropTypes, Component } from 'react';
import classNames from 'classnames';
import AppActions from '../../common/actions/AppActions.js';
import LoadBar from '../../common/components/LoadBar.jsx';
import VlanModifyModal from './VlanModifyModal.jsx';
import ReactDOM from 'react-dom';
import FormTextField from '../../common/components/FormTextField';

import * as Table from 'reactabular-table';

class VlansFilter extends Component
{
  static PropTypes = {
    onChange: PropTypes.func.isRequired,
    onSearch: PropTypes.func.isRequired,
    searchString: PropTypes.string.isRequired
  };

  handleChange = (vlan) => {
    this.props.onChange(vlan.value);
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

class VlansTable extends Component {
  static PropTypes = {
    columns: PropTypes.array.isRequired,
    items: PropTypes.array,
    onSelect: PropTypes.func,
  };

  curClass = 'odd-row';

  onRow = (row, { rowIndex }) => {
    this.curClass = row.vlan_id != ''? this.curClass=='odd-row' ? 'even-row':'odd-row': this.curClass;
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
    return (
      <div className="box">
        <div className="box-body">
          <Table.Provider
            className="table table-bordered table-hover dataTable"
            columns={this.props.columns}
            style={{ overflowX: 'auto' }}
          >
          <Table.Header />
          {this.props.items.length > 0 ?
            <Table.Body
              rows={this.props.items}
              rowKey="id"
              onRow={this.onRow}
            />
            :
            <tbody><tr><td colSpan={this.props.columns.length}>По вашему запросу ничего не найдено</td></tr></tbody>
          }
        </Table.Provider>
      </div>
    </div>)
  }
}

export default class VlansList extends Component {
  getColumns = () => {
    return [
      {
        property: 'id',
        header: {
          label: 'ID',
        }
      },
      {
        property: 'vid',
        header: {
          label: 'VID'
        }
      },
      {
        property: 'name',
        header: {
          label: 'Название'
        }
      },
      {
        property: 'desk',
        header: {
          label: 'Описание'
        }
      },
      {
        property: 'prefix',
        header: {
          label: 'Префикс'
        }
      }
    ];
  };


  checkAddRights = () => {
    fetch('/inventory/ajax/checkrights/vlan/add', {method: 'GET', credentials: 'include'})
      .then(resp => {
        return resp.json()})
      .then(resp => {
        this.setState({
          canAddVlan: resp
          });
      });
  };

  checkModifyRights = () => {
    fetch('/inventory/ajax/checkrights/vlan/modify', {method: 'GET', credentials: 'include'})
      .then(resp => {
        return resp.json()})
      .then(resp => {
        this.setState({
          canModifyVlan: resp
          });
      });
  };

  loadData = () => {
    AppActions.initLoading();
    $.ajax({
      type: "GET",
      url: "/inventory/ajax/vlans/"+this.state.searchString,
      success: this.setData
    });
  };

  handleSearch =  () => {
    this.loadData();
  };

  componentDidMount = () => {
    this.checkAddRights();
    this.checkModifyRights();
    //this.loadData();
  };

  state = {
    searchString: '',
    canAddVlan: 0,
    canModifyVlan: 0,
    showVlanModal: false,
    selectedVlan: null,
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

  handleSaveVlan = (vlan, stayOpened) => {
    stayOpened = stayOpened || false;
    let data = JSON.stringify({
      vid: vlan.vid,
      name: vlan.name,
      desk: vlan.desk,
      brand: vlan.brand
    });
    let url = '/inventory/ajax/vlan/'+(vlan.vlan_id?vlan.vlan_id:'');
    let method = (vlan.vlan_id)?'POST':'PUT';
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

  onSelectRow = (row) => {
    if (this.state.canModifyVlan) {
      this.setState({
        selectedVlan: {
          vlan_id: row.vlan_id,
          vid: {
            value: row.vid,
            state: 0,
            msg: ''
          },
          name: {
            value: row.name,
            state: 0,
            msg: ''
          },
          descr: {
            value: row.descr,
            state: 0,
            msg: ''
          },
          brand: {
            value: row.brand,
            state: 0,
            msg: ''
          }
        },
        showVidModal: true,
        save_state: 0,
        msg: ''
      });
    }
  };


  handleFilterChange = (val) => {
    this.setState({
      searchString: val
    });
  };

  render = () => {
    return (
      <div>
        <VlansFilter
          searchString={this.state.searchString}
          onChange={this.handleFilterChange}
          onSearch={this.handleSearch}
          />

            <VlansTable
              columns={this.getColumns()}
              items={this.state.items}
              onSelect={this.onSelectRow}
              />
            <LoadBar />
            <VlanModifyModal
              state={this.state.save_state}
              show={this.state.showVlanModal}
              vlan={this.state.selectedVlan}
              onHide={()=>{this.setState({
                showVlanModal: false,
                selectedVlan: null
              })}}
              onSave={this.handleSaveVlan}
              msg={this.state.msg}
              />
            {this.state.canAddVlan?
              <button
                onClick={()=>this.setState({
                              showVlanModal: !this.state.showVlanModal,
                              selectedVlan: null,
                              save_state: 0,
                              msg: ''
                          })}
                className={'btn btn-primary'}
                >
                Добавить VLAN
              </button>:null
            }

      </div>
    )
  }
};

ReactDOM.render(
  <VlansList />,
  document.getElementById('vlans-list')
);