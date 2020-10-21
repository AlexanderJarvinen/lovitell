var $ = require('jquery');
var React = require('react');
var ReactDOM = require('react-dom');
var classNames = require('classnames');
var AppStore = require('../stores/AppStore.js');
import { Modal } from 'react-bootstrap'
import Draggable from 'react-draggable';
import ModalDialog from 'react-bootstrap/lib/ModalDialog';

var LoadBar = React.createClass({
    getInitialState: function() {
        return {
            show: AppStore.getLoading()
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
            show: AppStore.getLoading()
        });
    }
});

module.exports=LoadBar;