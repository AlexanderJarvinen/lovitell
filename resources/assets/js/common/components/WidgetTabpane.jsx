var $ = require('jquery');
var React = require('react');
var ReactDOM = require('react-dom');
var WidgetPreview = require('../components/WidgetPreview');
var AppDispatcher = require('../dispatcher/AppDispatcher');

var WidgetTabpane = React.createClass({
    getInitialState: function() {
        this.init();
        return {
            widgets: [],
            dashboard_kit: this.props.controlbar_params.widgettabpane.dashboard_kit || 0
        }
    },
    handleChange: function(e) {
        window.location='/?dashboard_kit='+e.target.value;
    },
    componentWillMount: function() {

    },
    render: function() {
        let wl = [];
        let w =this.state.widgets;
        for (var widget_id in w) {
            let e = w[widget_id];
            wl.push(<li id={e.id}><WidgetPreview id={e.id} class={e.icon} title={e.title} /></li>);
        };
        return(
            <div className="widget-tabpane">
                <div className>
                    <div className="form-group">
                        <label>Выбор варианта панели</label>
                        <select
                            className="form-control"
                            value={this.state.dashboard_kit}
                            onChange={this.handleChange}>
                            <option value='0'>Вся сеть</option>
                            <option value='1'>Ловит</option>
                            <option value='2'>Wi-Fi услуги</option>
                        </select>
                    </div>
                </div>
                <div className="widget-select">
                    <h4 className="control-sidebar-heading">Добавить виджет</h4>
                    <ul>
                        {wl}
                    </ul>
                </div>
            </div>
        )
    },
    init: function() {
        $.ajax({
            type: "GET",
            url: "/ajax/widget-gallery/"+this.props.dashboard_id,
            success: (a)=> {
                this.setState({widgets: a});
            }
        });
    }
});

module.exports = WidgetTabpane;