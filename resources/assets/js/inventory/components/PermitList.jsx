import React, { PropTypes, Component } from 'react';
import classNames from 'classnames';
import AppActions from '../../common/actions/AppActions.js';
import LoadBar from '../../common/components/LoadBar.jsx';
import PermitModifyModal from './PermitModifyModal.jsx';
import FormTextField from '../../common/components/FormTextField.jsx';
import ReactDOM from 'react-dom';

import * as Table from 'reactabular-table';
import * as resolve from 'table-resolver';

class PermitFilter extends Component
{
  static PropTypes = {
    onChange: PropTypes.func.isRequired,
    onSearch: PropTypes.func.isRequired,
    searchString: PropTypes.string.isRequired
  };

  handleChange = (permit) => {
    this.props.onChange(permit);
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

class PermitTable extends Component {
  static PropTypes = {
    columns: PropTypes.array.isRequired,
    items: PropTypes.array,
    onSelect: PropTypes.func
  };

  curClass = 'odd-row';

  onRow = (row, { rowIndex }) => {
    this.curClass = row.permit_id != ''? this.curClass=='odd-row' ? 'even-row':'odd-row': this.curClass;
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
      </div>
    )
  }
}

export default class PermitList extends Component {
  getColumns = () => {
    return [
      {
        property: 'number',
        header: {
          label: 'Номер'
        }
      },
      {
        property: 'date',
        header: {
          label: 'От'
        }
      },
      {
        property: 'service',
        header: {
          label: 'Сервис'
        }
      },
      {
        property: 'service',
        header: {
          label: 'Сервис'
        }
      }
    ];
  };

  handleSearch =  () => {
    this.loadData();
  };

  handleFilterChange = (val) => {
    this.setState({
      searchString: val
    });
  };

  checkAddRights = () => {
    fetch('/inventory/ajax/checkrights/permit/add', {method: 'GET', credentials: 'include'})
      .then(resp => {
        return resp.json()})
      .then(resp => {
        this.setState({
          canAddPermit: resp
          });
      });
  };

  checkModifyRights = () => {
    fetch('/inventory/ajax/checkrights/permit/modify', {method: 'GET', credentials: 'include'})
      .then(resp => {
        return resp.json()})
      .then(resp => {
        this.setState({
          canModifyPermit: resp
          });
      });
  };

  loadData = () => {
    AppActions.initLoading();
    $.ajax({
      type: "GET",
      url: "/inventory/ajax/permit/"+this.state.searchString,
      success: this.setData
    });
  };

  componentDidMount = () => {
    this.checkAddRights();
    this.checkModifyRights();
  };

  state = {
    canAddPermit: 0,
    canModifyPermit: 0,
    showPermitModal: false,
    selectedPermit: null,
    searchString: '',
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

  handleSavePermit = (permit, stayOpened) => {
    stayOpened = stayOpened || false;
    let data = JSON.stringify({
      number: permit.number,
      date: permit.date,
    });
    let url = '/inventory/ajax/permit/'+(permit.permit_id?permit.permit_id:'');
    let method = (permit.permit_id)?'POST':'PUT';
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
            showPermitModal: stayOpened,
            selectedPermit: null,
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
  curClass = 'odd-row';
  onSelectRow = (row) => {
    if (this.state.canModifyPermit) {
      this.setState({
        selectedPermit: {
          permit_id: row.permit_id,
          number: {
            value: row.number,
            state: 0,
            msg: ''
          },
          date: {
            value: row.descr,
            state: 0,
            msg: ''
          },
          type: {
            value: row.type,
            state: 0,
            msg: ''
          },
          url: {
            value: row.url,
            state: 0,
            msg: ''
          },
          regions: {
            value: [row.region_id],
            state: 0,
            msg: ''
          }
        },
        showPermitModal: true,
        save_state: 0,
        msg: ''
      });
    }
  };
  onRow = (row, { rowIndex }) => {
    this.curClass = row.permit_id != ''? this.curClass=='odd-row' ? 'even-row':'odd-row': this.curClass;
    let rowClass = classNames(
        {'odd-row': this.curClass == 'odd-row'},
        {'even-row': this.curClass == 'even-row'}
    );
    return {
      className: rowClass,
      onDoubleClick: () => this.onSelectRow(row)
    };
  };

  render = () => {
    return (
      <div>
        <PermitFilter
          searchString={this.state.searchString}
          onChange={this.handleFilterChange}
          onSearch={this.handleSearch}
          />
        <PermitTable
          columns={this.getColumns()}
          items={this.state.items}
          onSelect={this.onSelectRow}
        />
        <LoadBar />
        <PermitModifyModal
          state={this.state.save_state}
          show={this.state.showPermitModal}
          permit={this.state.selectedPermit}
          onHide={()=>{this.setState({
            showPermitModal: false,
            selectedPermit: null
          })}}
          onSave={this.handleSavePermit}
          msg={this.state.msg}
          />
          {this.state.canAddPermit?
            <button
              onClick={()=>this.setState({
                            showPermitModal: !this.state.showPermitModal,
                            selectedPermit: null,
                            save_state: 0,
                            msg: ''
                        })}
              className={'btn btn-primary'}
              >
              Добавить запись кадастра
            </button>:null
          }
      </div>
    )
  }
};

ReactDOM.render(
  <PermitList />,
  document.getElementById('permit-list')
);