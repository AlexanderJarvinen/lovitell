var $ = require('jquery');
var React = require('react');
var ReactDOM = require('react-dom');

var ClearableInput = React.createClass({
    getDefaultProps: function() {
        return {
            value: '',
            className: ''
        }
    },
    propTypes: {
        value: React.PropTypes.string,
        className: React.PropTypes.string
    },
    changeHandle: function(e) {
        if (typeof this.props.onChange != 'undefined') {
            this.props.onChange(e.target.value);
        }
    },
    clearHandle: function() {
        if (typeof this.props.onChange != 'undefined') {
            this.props.onChange('');
        }
    },
    keypressHandle: function(e) {
        if (e.which == 27) {
            this.clearHandle();
        }
    },
    render: function() {
        let clear_but = null;
        if (this.props.value != '') {
            clear_but = (<i className={'icon clear_btn fa fa-times'} onClick={this.clearHandle}>&nbsp;</i>);
        }
        return (
            <span>
                <input
                    type="text"
                    value={this.props.value}
                    className={this.props.className}
                    onKeyPress={this.keypressHandle}
                    onChange={this.changeHandle}
                />
                {clear_but}
            </span>
        );
    }
});

module.epxorts=ClearableInput;
