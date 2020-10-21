var $ = require('jquery');
var React = require('react');
var ReactDOM = require('react-dom');
var AppDispatcher = require('../../common/dispatcher/AppDispatcher');
var ReportActions = require('../actions/ReportActions.js');
var ReportConstants = require('../constants/ReportConstants.js');

var ChartPanel = React.createClass({

    _handleDTypeClick: function(dtype) {
        console.log(dtype);
        ReportActions.changeDtype(dtype);
    },
    render: function() {
        return (
            <ul className="chart_panel">
                <li><a href="#" className="piechart-icon chart-icon" onClick={this._handleDTypeClick.bind(this, ReportConstants.D_TYPE_PIECHART)}></a></li>
                <li><a href="#" className="linechart-icon chart-icon" onClick={this._handleDTypeClick.bind(this, ReportConstants.D_TYPE_LINECHART)}></a></li>
                <li><a href="#" className="barchart-icon chart-icon" onClick={this._handleDTypeClick.bind(this, ReportConstants.D_TYPE_BARCHART)}></a></li>
                <li><a href="#" className="areachart-icon chart-icon" onClick={this._handleDTypeClick.bind(this, ReportConstants.D_TYPE_AREACHART)}></a></li>
            </ul>
        )
    }
});

var ReportTabpane = React.createClass({

    getInitialState: function() {
        return {
            h_scrollbar: this.props.controlbar_params.h_scrollbar,
            chart_hline: 1,
            chart_vline: 1,
            chart_legend: true
        }
    },
    componentDidMount: function() {
        ReportActions.setOptions(this.props.controlbar_params)
    },
    _handleHLine: function(e) {
        this.setState({
            chart_hline: e.target.value
        });
        ReportActions.setChartOptions({
            hline: e.target.value
        });
    },
    _handleVLine: function(e) {
        this.setState({
            chart_vline: e.target.value
        });
        ReportActions.setChartOptions({
            vline: e.target.value
        });
    },
    _handleLegend: function(e){
        var l=!this.state.chart_legend;
        this.setState({
            chart_legend: l
        });
        ReportActions.setChartOptions({
            legend: l
        });
    },
    handleHScrollBar: function(e) {
        $.get('/reports/settings/scrollbar/'+e.target.value);
        this.setState({
            h_scrollbar: e.target.value
        });
        ReportActions.setOptions({
            h_scrollbar: e.target.value
        });
    },
    render: function() {
        return(
            <div className="report-tabpane">
                <h4>Горизонтальная прокрутка:</h4>
                <select onChange={this.handleHScrollBar} value={this.state.h_scrollbar}>
                    <option value="0">Нет</option>
                    <option value="1">Сверху</option>
                    <option value="2">Снизу</option>
                </select>
                <h4 className="control-sidebar-heading">Настройка Графика</h4>
                Горизонтальные линии:
                <select onChange={this._handleHLine} value={this.state.chart_hline} >
                    <option value="1">Нет</option>
                    <option value="2">Пунктирные</option>
                    <option value="3">Сплошные</option>
                </select>
                Вертикальные линии:
                <select onChange={this._handleVLine} value={this.state.chart_vline}>
                    <option value="1">Нет</option>
                    <option value="2">Пунктирные</option>
                    <option value="3">Сплошные</option>
                </select>
                <input type="checkbox" checked={this.state.chart_legend} onChange={this._handleLegend} />Показывать легенду
                <h5>Тип диаграммы</h5>
                <ChartPanel />
                <button>Добавить в виджеты</button>
            </div>
        )
    }
});

module.exports = ReportTabpane;