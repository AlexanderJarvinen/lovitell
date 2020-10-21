var $ = require('jquery');
var React = require('react');
var ReactDOM = require('react-dom');
var DashboardActions = require('../actions/DashboardActions');
var WidgetStore = require('../stores/WidgetStore');

var WidgetPreview = React.createClass({
    getDefaultProps: function () {
        return {
            // allow the initial position to be passed in as a prop
            initialPos: {x: 0, y: 0}
        }
    },
    getInitialState: function() {
        return {
            title: this.props.title
        }
    },

    _handleClick: function() {
        console.log('Init dashboard widget add');
        DashboardActions.addWidget(this.props.id);
    },

    render: function() {
        return (
                <div className="widget-preview" onClick={this._handleClick}>
                    {this.state.title}
                </div>
        )
    }
});

module.exports = WidgetPreview;
