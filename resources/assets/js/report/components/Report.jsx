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

import FormTextField from '../../common/components/FormTextField.jsx';
import FormSelectField from '../../common/components/FormSelectField.jsx';
import moment from 'moment';

var classnames = require('classnames');
import { LineChart, BarChart, PieChart, AreaChart} from "rd3";
import * as Table from 'reactabular-table';
import * as resolve from 'table-resolver';

var ReportParamsPane = React.createClass({

    getInitialState: function() {
        let filters_value = ReportStore.getFiltersValue();
        return {
            date: moment(filters_value.date, 'DD.MM.YYYY'),
            date_range: {
                start_date: moment(filters_value.date_range.start_date, 'DD.MM.YYYY'),
                end_date: moment(filters_value.date_range.end_date, 'DD.MM.YYYY')
            },
            text: filters_value.text,
            select: filters_value.select
        }
    },
    handleDateRangeSelect: function(date_range) {
        let changeFilter = this.props.changeFilter;
        this.setState({
            date_range: date_range
        }, ReportActions.changeFilter(
            {date_range: {
                start_date: date_range.start_date.format('DD.MM.YYYY'),
                end_date: date_range.end_date.format('DD.MM.YYYY')
            }}
        ));
    },
    handleDateSelect: function(date) {
        this.setState({
            date: date
        }, ReportActions.changeFilter(
            {date: date.format('DD.MM.YYYY')}
        ));
    },
    handleTextChange: function(text) {
        this.setState({
            text: text.value
        }, ReportActions.changeFilter(
            {text: text.value}
        ));
    },
    handleSelectChange: function(val) {
        console.log('SelectChange');
        console.log(val);
        this.setState({

        }, ReportActions.changeFilter({
            select:val.value
        }))
    },
    componentDidMount: function() {
        ReportStore.addFilterChangeListener(this._onChange);
        document.onkeydown = function(e) {
            e = e || window.event;
            if (e.keyCode == 13) {
                ReportActions.load();
            }
            return true;
        }
    },
    componentWillUnmount: function() {
        ReportStore.removeFilterChangeListener(this._onChange);
    },
    handleLoadClick: function() {
        ReportActions.load();
    },
    render: function() {
        let component = [];
        for (let i in this.state.filters) {
            switch (i) {
                case 'date_range':
                    component.push(
                        <div className="col-md-3">
                        <DateRangeSelect key={'date_range'}
                            onChange={this.handleDateRangeSelect}
                            start_date={this.state.date_range.start_date}
                            end_date={this.state.date_range.end_date}
                        />
                        </div>
                    );
                    break;
                case 'date':
                    component.push(
                        <div className="col-md-3">
                        <DateSelect key={'date'}
                            onChange={this.handleDateSelect}
                            date={this.state.date} />
                        </div>
                    );
                    break;
                case 'text':
                    component.push(
                    <div className="col-md-3">
                        <FormTextField
                            onChange={this.handleTextChange}
                            label={this.state.filters[i].label}
                            value={this.state.text}
                            />
                    </div>
                    );
                    break;
                case 'select':
                    component.push(
                    <div className="col-md-3">
                        <FormSelectField
                          data={this.state.filters[i].data}
                          onChange={this.handleSelectChange}
                          label={this.state.filters[i].label}
                          value={this.state.select}
                          />
                    </div>
                    );
            }
        }
        return (
            <div className="report_params_pane">
                <div className='row'>
                    {component}
                </div>
                {component.length>0? <div className="form-group"><button className={'btn btn-primary'} onClick={this.handleLoadClick}>Загрузить</button></div>:null}
            </div>
        )
    },

    _onChange: function() {
        let filter_values = ReportStore.getFiltersValue();
        this.setState({
            filters: ReportStore.getFilters(),
            date: filter_values.date?moment(filter_values.date, 'DD.MM.YYYY'):null,
            date_range: {
                start_date: filter_values.date_range?moment(filter_values.date_range.start_date, 'DD.MM.YYYY'):null,
                end_date: filter_values.date_range?moment(filter_values.date_range.end_date, 'DD.MM.YYYY'):null
            }
        });
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
            filter_values: [],
            export_link: ''
        }
    },

    componentDidMount: function() {
        ReportStore.addChangeListener(this._onChange);
        ReportStore.addFilterChangeListener2(this.onFilterChange);
        ReportStore.init(this.props.id, this.props.params, this.props.filters);
    },
    onFilterChange: function() {
        console.log('Export link');
        this.setState({
            export_link:  ReportStore.getExportLink()
        });
    },
    componentWillUnmount: function() {
        ReportStore.removeChangeListener(this._onChange);
        ReportStore.removeFilterChangeListener2(this.onFilterChange);
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
                        onFilterChange={this.onFilterChange}
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