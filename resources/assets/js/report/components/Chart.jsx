var $ = require('jquery');
var React = require('react');
var ReactDOM = require('react-dom');
var Modal = require('react-modal');
var AppActions = require('../../common/actions/AppActions.js');
var LoadBar = require('../../common/components/LoadBar.jsx');
var DateRangeSelect = require('../../common/components/DateRangeSelect');
var GraphWidget = require('../../common/components/GraphWidget');

import moment from 'moment';

var classnames = require('classnames');

var Chart = React.createClass({
    getInitialState: function() {
        return {
        }
    },

    componentDidMount: function() {
    },

    componentWillUnmount: function() {
    },
    render: function() {
        return (
            <div className="report box">
                <div className="box-header">
                    <h3 className="box-title">{this.props.title}</h3>
                </div>
                <div className="box-body">
                    <GraphWidget
                        type='LINE'
                        url={'/reports/graph/'+this.props.name}
                        onInitLoading={()=>{AppActions.initLoading();}}
                        onCancelLoading={()=>{AppActions.cancelLoading();}}
                        />
                    <LoadBar />
                </div>
            </div>
        )
    }
});

ReactDOM.render(
    <Chart
        tilte={ChartData.title}
        name={ChartData.name}
    />,
    document.getElementById('chart-area')
);