var $ = require('jquery');
var React = require('react');
var ReactDOM = require('react-dom');
var Modal = require('react-modal');
var classNames = require('classnames');
var DatePicker = require('react-datepicker');
var moment = require('moment');

require('react-datepicker/dist/react-datepicker.css');

var DateRangeSelect = React.createClass({
    getDefaultProps: function() {
        return {
            inline: false,
            clearable: false,
        }
    },
    changeStartDate: function(date) {
        let start = moment(date);
        let end = this.props.end_date? moment(this.props.end_date):moment();
        if (start.diff(end) > 0) {
            end = start;
        }
        if (typeof this.props.onChange != 'undefined') {
            this.props.onChange({start_date: start, end_date:end});
        }
    }
    ,
    changeEndDate: function(date) {
        let start = this.props.start_date?moment(this.props.start_date):moment(date);
        let end = moment(date);
        if (start.diff(end) > 0) {
            start = end;
        }
        if (typeof this.props.onChange != 'undefined') {
            this.props.onChange({start_date: start, end_date:end});
        }
    },
    render: function() {
        return (
            <div className={classNames('b-date-range', {'j-inline': this.props.inline})}>
                <div className="inputrow">
                    <label >Начало периода:</label>
                    <i className="fa fa-calendar" aria-hidden="true"></i> <DatePicker
                        dateFormat="DD.MM.YYYY"
                        selected={this.props.start_date}
                        onChange={this.changeStartDate}
                        clearable={this.props.clearable}
                    />
                </div>
                <div className="inputrow">
                    <label>Конец периода:</label>
                    <i className="fa fa-calendar" aria-hidden="true"></i> <DatePicker
                        dateFormat="DD.MM.YYYY"
                        selected={this.props.end_date}
                        onChange={this.changeEndDate}
                        clearable={this.props.clearable}
                    />
                </div>
            </div>
        )
    }
});

module.exports = DateRangeSelect;
