var $ = require('jquery');
var React = require('react');
var ReactDOM = require('react-dom');
var Modal = require('react-modal');
var ReportStore = require('../stores/ReportStore');
var ReportActions = require('../actions/ReportActions');
var ReportConstants = require('../constants/ReportConstants');
var AppActions = require('../../common/actions/AppActions.js');
var LoadBar = require('../../common/components/LoadBar.jsx');
var DateRangeSelect = require('../../common/components/DateRangeSelect');
var DateSelect = require('../../common/components/DateSelect');

import moment from 'moment';

var classnames = require('classnames');
import { LineChart, BarChart, PieChart, AreaChart} from "rd3";
import * as Table from 'reactabular-table';
import * as resolve from 'table-resolver';

var ReportParamsPane = React.createClass({

    getInitialState: function() {
        return {
            date: moment(),
            date_range: {
                start_date: moment(),
                end_date: moment()
            }
        }
    },
    handleDateRangeSelect: function(date_range) {
       this.props.changeFilter(
          {
              date_range: {
                start_date: date_range.start_date.format('DD.MM.YYYY'),
                end_date: date_range.end_date.format('DD.MM.YYYY')
            }
          }
        );
    },
    handleDateSelect: function(date) {
        this.props.changeFilter({
                date: date.format('DD.MM.YYYY')
            }
        );
    },
    render: function() {
        let component = [];
        let filters_value = this.props.filters_value;
        for (let i in this.state.filters) {
            switch (i) {
                case 'date_range':
                    component.push(
                        <DateRangeSelect key={'date_range'}
                            onChange={this.handleDateRangeSelect}
                            start_date={filters_value.date_range.start_date}
                            end_date={filters_value.date_range.end_date}
                        />
                    );
                    break;
                case 'date':
                    component.push(
                        <DateSelect key={'date'}
                            onChange={this.handleDateSelect}
                            date={this.state.date} />
                    );
                    ReportActions.changeFilter(
                        {date: this.state.date.format('DD.MM.YYYY')}
                    );
                    this.props.onFilterChange();
                    break;
            }
        }
        return (
            <div className="report_params_pane">
                {component}
                {component.length>0? <div className="form-group"><button className={'btn btn-primary'} onClick={this.props.handleLoadClick}>Загрузить</button></div>:null}
            </div>
        )
    },

    _onChange: function() {
        this.setState({
            filters: ReportStore.getFilters()
        })
    }

});

var ChartArea = React.createClass({
    render: function() {
        var chart = null;
        switch (this.props.options.type) {
            case ReportConstants.D_TYPE_AREACHART:
                chart = <AreaChart
                data={this.props.data}
                width={500}
                viewBoxObject={{
                    x: 0,
                    y: 0,
                    width: 500,
                    height: 400
                }}
                height={400}
                domain={{x: [1,12], y: [0,this.props.options.ymax]}}
                gridHorizontal={this.props.options.hline>1}
                gridVertical={this.props.options.vline>1}
                gridHorizontalStrokeDash={'1, 0'}
                gridVerticalStrokeDash={'1, 0'}
                xAccessor={(d)=>d[0]}
                yAccessor={(d)=>d[1]}
                legend={this.props.options.legend==1}
                />;
                break;
            case ReportConstants.D_TYPE_BARCHART:
                chart = <BarChart
                    data={this.props.data}
                    width={800}
                    height={400}
                    hoverAnimation={true}
                />;
                break;
            case ReportConstants.D_TYPE_LINECHART:
                chart = <LineChart
                    legend={this.props.options.legend==1}
                    data={this.props.data}
                    width={500}
                    height={400}
                    viewBoxObject={{
                        x: 0,
                        y: 0,
                        width: 500,
                        height: 400
                    }}
                    domain={{y: [0,this.props.options.ymax]}}
                    gridHorizontal={this.props.options.hline>1}
                    gridVertical={this.props.options.vline>1}
                    gridHorizontalStrokeDash={'1, 0'}
                    gridVerticalStrokeDash={'1, 0'}
                />;
                break;
            case ReportConstants.D_TYPE_PIECHART:
                chart = <PieChart
                    legend={this.props.options.legend==1}
                    data={this.props.data}
                    width= {500}
                    height= {400}
                    radius={110}
                    innerRadius={20}
                    sectorBorderColor="white"
                    showInnerLabels={false}
                    showOuterLabels={false}
                />
                break;
        }
        return (
            <div className="report chart">
                {chart}
            </div>
        )
    }
});


var TableArea = React.createClass({

    getInitialState: function() {
        return {
            query: {}, // /// Search query
            columns: this.props.data.columns,
            rows: this.props.data.rows,
            selected_rows: [],
            pagination: { // initial pagination settings
                page: 1,
                perPage: 10
            }
        }
    },

    render: function() {
        console.log(this.props.columns);
        const resolvedColumns = resolve.columnChildren({columns: this.props.columns});
        const resolvedRows = resolve.resolve({
            columns: resolvedColumns,
            method: resolve.nested
        })(this.props.data);
        return (
            <div className={'report_table__wrap'}>
                <Table.Provider
                    columns={resolvedColumns}
                    className="table table-bordered table-hover dataTable"
                >
                    <Table.Header headerRows={resolve.headerRows({columns: this.props.columns})} />

                    <Table.Body
                        rows={resolvedRows}
                        rowKey="id"
                        onRow={this.onRow}
                    />
                </Table.Provider>
                <LoadBar />
            </div>
        );
    },
    onRow: function(row, rowIndex) {
/*
        return {
            className: classnames(
                this.isSelectedRow(rowIndex)? 'selected-row':'',
            ),
            onClick: () => this.onSelectRow(rowIndex)
        };
        */
        return {
            style: {'backgroundColor': (typeof row.tr_bg_col != "undefined" && row.tr_bg_col.trim() != '')?row.tr_bg_col:''},
            className: rowIndex.rowIndex % 2 ? 'odd-row' : 'even-row'
        }
    }
    ,
    onSelectRow: function(rowIndex) {
        var rows = this.state.rows;

        var selected_rows = this.state.selected_rows;
        var i = selected_rows.indexOf(rowIndex);
        if (i == -1) {
             selected_rows.push(rowIndex);
        } else {
            selected_rows.splice(i,1);
        }
        this.setState({
            selected_rows: selected_rows
        });
        this.setState(
            select.row({
                rows,
                selectedRowId: rows[rowIndex].id
            })
        );
    },
    isSelectedRow: function(rowIndex) {
        var selected_rows = this.state.selected_rows;
        return selected_rows.indexOf(rowIndex) != -1;
    }
});

var Report = React.createClass({
    getInitialState: function() {
        return {
            /*chart_data: ReportStore.getChartData(),
            chart_options: ReportStore.getChartOptions(),*/
            table_data: ReportStore.getRows(),
            table_columns: ReportStore.getColumns(),
            filters: this.props.filters,
            filters_value: ReportStore.getFiltersValue(),
            export_link: ''
        }
    },

    componentDidMount: function() {
        ReportStore.init(this.props.id, this.props.params, this.props.filters);
        ReportStore.addChangeListener(this._onChange);
    },
    onFilterChange: function() {
        console.log('Export link');
/*        this.setState({
            export_link:  ReportStore.getExportLink()
        });*/
    },
    componentWillUnmount: function() {
        ReportStore.removeChangeListener(this._onChange);
    },
    loadClickHandler: function() {
        ReportActions.load();
    },
    handleFilterChange: function(name, value) {
        switch (name) {
            case 'date':
                ReportActions.changeFilter({date: value.date.format('DD.MM.YYYY')})
                break;
            case 'date_range':
                ReportActions.changeFilter({date_range: value.date_range,
                    start_date: date_range.start_date.format('DD.MM.YYYY'),
                    end_date: date_range.end_date.format('DD.MM.YYYY')
                });
        }
    },
    render: function() {
        let link=null;
        if (this.state.export_link != '') {
            link=(<a href={this.state.export_link}><i className="fa fa-download"></i></a>);
        }
        return (
            <div className="report box">
                <div className="box-header">
                    <h3 className="box-title">{this.props.params.title} {link}</h3>
                </div>
                <div className="box-body">
                    <ReportParamsPane
                        filters_value={this.state.filters_value}
                        onFilterChange={this.handleFilterChange}
                        onLoadClick={this.loadClickHandler}
                        />
                    <TableArea data={this.state.table_data} columns={this.state.table_columns}/>
                </div>
            </div>
        )
    },

    _onChange: function() {
        this.setState({
           /* chart_data: ReportStore.getChartData(),*/
            chart_options: ReportStore.getChartOptions(),
            table_data: ReportStore.getRows(),
            table_columns: ReportStore.getColumns(),
            filters: ReportStore.getFilters(),
            filter_values: ReportStore.getFiltersValue(),
            export_link: ReportStore.getExportLink(),
            h_scrollbar: ReportStore.getScrollBar()
        }, function() {
                $('.report.container').css('width', '100%');
                $('.box').each(function() {
                    let tw = $(this).find('table').width();
                    let bw = $(this).width();
                    if ( tw > bw - 20) {
                        var wrap = $('body');
                        let scroll_area = $(this);
                        let ratio = tw/(bw-20);
                        let scroll_class = 'scrollbar hidden';
                        let scrollbar = ReportStore.getScrollBar();
                        if (scrollbar == 1) {
                            scroll_class = 'scrollbar top-scroll';
                        } else if (scrollbar == 2) {
                            scroll_class = 'scrollbar bottom-scroll';
                        }
                        $('.scrollbar').remove();
                        if (scrollbar) {
                            var scrollWrap = $('<div class="'+scroll_class+'"><div class="wide_content"></div></div>');
                            scrollWrap.find(".wide_content").width(wrap.width() * ratio);
                            scrollWrap.scroll(function () {
                                scroll_area.scrollLeft(scrollWrap.scrollLeft());
                            });
                            scroll_area.scroll(function () {
                                scrollWrap.scrollLeft(scroll_area.scrollLeft());
                            });
                            wrap.prepend(scrollWrap);
                        }
                    }

                });
            }
        );
    }
});

ReactDOM.render(
    <Report
        id={ReportData.id}
        params={ReportData.params}
        filters={ReportData.filters}
    />,
    document.getElementById('report-area')
);