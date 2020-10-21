import React, { PropTypes, Component } from 'react';
import classNames from 'classnames';
import AppActions from '../../common/actions/AppActions.js';
import LoadBar from '../../common/components/LoadBar.jsx';
import CadastralModifyModal from './CadastralModifyModal.jsx';
import FormTextField from '../../common/components/FormTextField.jsx';
import ReactDOM from 'react-dom';

import * as Table from 'reactabular-table';
import * as resolve from 'table-resolver';

class CadastralFilter extends Component
{
  static PropTypes = {
    onChange: PropTypes.func.isRequired,
    onSearch: PropTypes.func.isRequired,
    searchString: PropTypes.string.isRequired
  };

  handleChange = (cadastral) => {
    this.props.onChange(cadastral);
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

class CadastralTable extends Component {
  static PropTypes = {
    columns: PropTypes.array.isRequired,
    items: PropTypes.array,
    onSelect: PropTypes.func
  };

  curClass = 'odd-row';

  onRow = (row, { rowIndex }) => {
    this.curClass = row.cadastral_id != ''? this.curClass=='odd-row' ? 'even-row':'odd-row': this.curClass;
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

export default class CadastralList extends Component {
  getColumns = () => {
    return [
      {
        property: 'region_id',
        header: {
          label: 'ID региона',
        }
      },
      {
        property: 'region_descr',
        header: {
          label: 'Регоион'
        }
      },
      {
        property: 'type_descr',
        header: {
          label: 'Объект'
        }
      },
      {
        property: 'number',
        header: {
          label: 'Номер'
        }
      },
      {
        property: 'cadastral_descr',
        header: {
          label: 'Описание'
        }
      },
      {
        property: 'url',
        header: {
          label: 'Документы'
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
    fetch('/inventory/ajax/checkrights/cadastral/add', {method: 'GET', credentials: 'include'})
      .then(resp => {
        return resp.json()})
      .then(resp => {
        this.setState({
          canAddCadastral: resp
          });
      });
  };

  checkModifyRights = () => {
    fetch('/inventory/ajax/checkrights/cadastral/modify', {method: 'GET', credentials: 'include'})
      .then(resp => {
        return resp.json()})
      .then(resp => {
        this.setState({
          canModifyCadastral: resp
          });
      });
  };

  loadData = () => {
    AppActions.initLoading();
    $.ajax({
      type: "GET",
      url: "/inventory/ajax/cadastrals/"+this.state.searchString,
      success: this.setData
    });
  };

  componentDidMount = () => {
    this.checkAddRights();
    this.checkModifyRights();
  };

  state = {
    canAddCadastral: 0,
    canModifyCadastral: 0,
    showCadastralModal: false,
    selectedCadastral: null,
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

  handleSaveCadastral = (cadastral, stayOpened) => {
    stayOpened = stayOpened || false;
    console.log(cadastral);
    let data = JSON.stringify({
      number: cadastral.number,
      descr: cadastral.descr,
      type: cadastral.type,
      url: cadastral.url,
      regions: cadastral.regions
    });
    let url = '/inventory/ajax/cadastral/'+(cadastral.cadastral_id?cadastral.cadastral_id:'');
    let method = (cadastral.cadastral_id)?'POST':'PUT';
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
            showCadastralModal: stayOpened,
            selectedCadastral: null,
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
    if (this.state.canModifyCadastral) {
      this.setState({
        selectedCadastral: {
          cadastral_id: row.cadastral_id,
          number: {
            value: row.number,
            state: 0,
            msg: ''
          },
          descr: {
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
        showCadastralModal: true,
        save_state: 0,
        msg: ''
      });
    }
  };
  onRow = (row, { rowIndex }) => {
    this.curClass = row.cadastral_id != ''? this.curClass=='odd-row' ? 'even-row':'odd-row': this.curClass;
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
        <CadastralFilter
          searchString={this.state.searchString}
          onChange={this.handleFilterChange}
          onSearch={this.handleSearch}
          />
        <CadastralTable
          columns={this.getColumns()}
          items={this.state.items}
          onSelect={this.onSelectRow}
        />
        <LoadBar />
        <CadastralModifyModal
          state={this.state.save_state}
          show={this.state.showCadastralModal}
          cadastral={this.state.selectedCadastral}
          onHide={()=>{this.setState({
            showCadastralModal: false,
            selectedCadastral: null
          })}}
          onSave={this.handleSaveCadastral}
          msg={this.state.msg}
          />
          {this.state.canAddCadastral?
            <button
              onClick={()=>this.setState({
                            showCadastralModal: !this.state.showCadastralModal,
                            selectedCadastral: null,
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
  <CadastralList />,
  document.getElementById('cadastral-list')
);