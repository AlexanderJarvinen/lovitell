var $ = require('jquery');
var React = require('react');
var ReactDOM = require('react-dom');
var classNames = require('classnames');
var Modal = require('react-modal');
var AppStore = require('../stores/AppStore.js');

var ErrorModal = React.createClass({
    getInitialState: function() {
        return {
            error: {
                code: 0,
                msg: ''
            }
        }
    },
    componentDidMount: function() {
        AppStore.addChangeListener(this.onChange);
    },
    componentWillUnmount: function() {
        AppStore.removeChangeListener(this.onChange);
    },
    render: function() {
        if (!this.state.show) return null;
        return (
            <div className={'loading_msg'}><h2>Загрузка...</h2><img src={"/img/loading.gif"} /></div>
        );
    },
    onChange: function() {
        this.setState({
            error: AppStore.getError()
        });
    }
});

module.exports=ErrorModal;