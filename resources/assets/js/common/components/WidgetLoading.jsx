var $ = require('jquery');
var React = require('react');
var ReactDOM = require('react-dom');
var classNames = require('classnames');

var WidgetLoading = React.createClass({
    render: function() {
        if (!this.props.show) {
            return null;
        } else {
            return (<div className={'widget_loading_msg'}>
                <h2>Загрузка...</h2>
                <img src={"/img/loading.gif"} />
            </div>)
        }
    }
});

module.exports = WidgetLoading;
