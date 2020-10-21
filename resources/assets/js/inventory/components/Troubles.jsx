var $ = require('jquery');
var React = require('react');
var ReactDOM = require('react-dom');
var Modal = require('react-modal');
var classNames = require('classnames')
var DateRangeSelect = require('../../common/components/DateRangeSelect');
import * as Table from "reactabular-table";

import moment from 'moment';

const columns = [
    {
        property: 'priority',
        header: {
            label: ''
        },
        cell: {
            formatters:[
                (priority) => {
                    return priority?(<span>!</span>):'';
                }
            ]
        }
    },
    {
        property: 'id',
        header: {
            label: 'ID'
        }
    },
    {
        property: 'create_date',
        header: {
            label: 'С'
        }
    },
    {
        property: 'close_date',
        header: {
            label: 'По'
        }
    },
    {
        property: 'subject',
        header: {
            label: 'Описание'
        }
    },
    {
        property: 'type_desk',
        header: {
            label: 'Тип'
        }
    }
];

var TroubleParamsPane = React.createClass({

    getInitialState: function() {
        return {
            date_range: this.props.date_range
        }
    },
    handleDateRangeSelect: function(date_range) {
        this.setState({
            date_range: date_range
        })
    },
    handleSearch: function() {
        if (typeof this.props.onSearch != 'undefined') {
            this.props.onSearch(this.state.date_range);
        }
    },
    componentDidMount: function() {

    },
    render: function() {
        return (
          <div className="report_params_pane">
              <DateRangeSelect
                 onChange={this.handleDateRangeSelect}
                 start_date={this.state.date_range.start_date}
                 end_date={this.state.date_range.end_date}
                 inline={true}
                 clearable={true}
              />
              <button className="btn btn-primary" onClick={this.handleSearch}>Найти</button>
          </div>
        )
    }
});

var TroubleList = React.createClass({
    propTypes: {
        type: React.PropTypes.number,
        address_id: React.PropTypes.number,
        start_date: React.PropTypes.string,
        end_date: React.PropTypes.string,
        title: React.PropTypes.string
    },
    getInitialState: function() {
        return {
            rights: false,
            troubles: []
        }
    },
    componentDidMount: function() {
        const {type, address_id, start_date, end_date} = this.props;
        this.loadTroubles(
          type,
          address_id,
          start_date,
          end_date
        )
    },
    componentWillReceiveProps(np) {
        if (np.type != this.props.type ||
            np.address_id != this.props.address_id ||
            np.start_date != this.props.start_date ||
            np.end_date != this.props.end_date
        ) {
            this.loadTroubles(np.type, np.address_id, np.start_date, np.end_date);
        }
    },
    makeTroubleList: function(a) {
        if (a.error == 0) {
            this.setState({
                troubles: a.data,
                rights: true
            });
        } else {
            this.setState({
                rights: false
            });
        }
    },
    loadTroubles: function(type, address_id, start_date, end_date) {
        if (start_date && end_date) {
            $.ajax({
                type: 'GET',
                url: '/inventory/ajax/building/' + address_id + '/troubles/' + type + '/' + start_date + '/' + end_date,
                success: this.makeTroubleList
            })
        } else {
            $.ajax({
                type: 'GET',
                url: '/inventory/ajax/building/' + address_id + '/troubles/' + type + '/',
                success: this.makeTroubleList
            })
        }
    },
    render: function() {
        return (
            <div className="box box-default">
                <div className="box-header">
                    <h3 className="box-title">{this.props.title}</h3>
                </div>
                <div className="box-body">
                    <Table.Provider
                      className="table table-bordered table-hover dataTable"
                      columns={columns}
                      style={{ overflowX: 'auto' }}
                      >
                        <Table.Header />
                        {this.state.troubles.length ?
                            <Table.Body
                                rows={this.state.troubles}
                                rowKey="id"
                                />
                            :
                            <tbody><tr><td colSpan={6}>Нет информации о проблемах</td></tr></tbody>
                        }
                    </Table.Provider>
                </div>
            </div>
        )
    }
});
var Troubles = React.createClass({
    propTypes: {
        address_id: React.PropTypes.number
    },
    getInitialState: function() {
        return {
            rights: [],
            date_range: {
                start_date: '',
                end_date: ''
            }
        }
    },
    handleSearch: function(date_range) {
        this.setState({date_range});
    },
    render: function() {
        return(
            <div className="col-md-8">
                <TroubleParamsPane
                    date_range={this.state.date_range}
                    onSearch={this.handleSearch}
                />
                <TroubleList
                  type={1}
                  address_id={this.props.address_id}
                  start_date={this.state.date_range.start_date == ''? '':this.state.date_range.start_date.format('YYYY-MM-DD')}
                  end_date={this.state.date_range.end_date == ''? '':this.state.date_range.end_date.format('YYYY-MM-DD')}
                  title={'Проблемы по дому'}
                  />
                <TroubleList
                  type={2}
                  address_id={this.props.address_id}
                  start_date={this.state.date_range.start_date == ''?'':this.state.date_range.start_date.format('YYYY-MM-DD')}
                  end_date={this.state.date_range.end_date == ''? '':this.state.date_range.end_date.format('YYYY-MM-DD')}
                  title={'Проблемы по клиентам'}
                  />
            </div>
        )
    }
});

ReactDOM.render(
    <Troubles address_id={BuildingData.address_id}/>,
    document.getElementById('troubles-list')
);