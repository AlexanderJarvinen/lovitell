var $ = require('jquery');
var React = require('react');
var ReactDOM = require('react-dom');
var Modal = require('react-modal');
var classNames = require('classnames');
var DatePicker = require('react-datepicker');
var moment = require('moment');

require('react-datepicker/dist/react-datepicker.css');

var DateSelect = React.createClass({
    getDefaultProps: function() {
        return {
            inline: false,
            clearable: false,
        }
    },
    changeDate: function(date) {
        if (typeof this.props.onChange != 'undefined') {
            this.props.onChange(moment(date));
        }
    },
    render: function() {
        return (
            <div className={classNames('b-date-range', {'j-inline': this.props.inline})}>
                <div className="inputrow">
                    <label>Дата: </label>
                    <i className="fa fa-calendar" aria-hidden="true"></i> <DatePicker
                        dateFormat="DD.MM.YYYY"
                        selected={this.props.date}
                        onChange={this.changeDate}
                        clearable={this.props.clearable}
                    />
                </div>
            </div>
        )
    }
});

module.exports = DateSelect;
