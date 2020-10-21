var $ = require('jquery');
var React = require('react');
var ReactDOM = require('react-dom');
var WidgetContainer = require('./WidgetContainer');
var WidgetStore = require('../stores/WidgetStore');
var DashboardStore = require('../stores/DashboardStore');
var classNames = require('classnames');

var Dashboard = React.createClass({
    getInitialState: function() {
        return {
            widgets: [],
            isinit: false,
            is_changed: false,
            first_init: true
        }
    },

    componentDidMount: function() {
        DashboardStore.addChangeListener(this._onChange);
        DashboardStore.init(this.props.id, this.props.kit_id);
    },

    componentWillUnmount: function() {
        DashboardStore.removeChangeListener(this._onChange);
    },

    _saveHandler: function() {
        DashboardStore.saveWidgets();
    },

    _resetHandler: function() {
        DashboardStore.reset();
    },

    render: function() {
        var widgets = this.state.widgets;
        var cwidgets=[];
        var buttons=[];
        if (this.state.is_changed) {
            buttons = <div className='button-pane' >
                        <button className='btn btn-primary btn-md' onClick={this._saveHandler}>Сохранить</button>
                        <button className='btn btn-danger btn-md' onClick={this._resetHandler}>Отменить</button>
                      </div>
        }
        if (this.state.isinit) {
            for (var widget_id in widgets) {
                cwidgets.push(<WidgetContainer
                    id={widget_id}
                    key={widgets[widget_id].id}
                    offset={widgets[widget_id].offset}
                    width={widgets[widget_id].width}
                    height={widgets[widget_id].height}
                    title={widgets[widget_id].title}
                    collapse={widgets[widget_id].collapse}
                    resize={widgets[widget_id].resize}
                    content={widgets[widget_id].content}
                />);
            }
        }
        return (
            <div className="dashboard-wrap">
                <div className="row">
                    {cwidgets}
                </div>
                {buttons}
            </div>
        )
    },

    _onChange: function() {
        var wstore = DashboardStore.getWidgets();
        this.setState({
            isinit: wstore.isinit,
            widgets: wstore.widgets,
            is_changed: (this.state.first_init)?false:wstore.ischanged,
            first_init: false
        });
    }
});

ReactDOM.render(
    <Dashboard
      id={dashboard_id}
      kit_id={kit_id}
    />,
    document.getElementById('dashboard')
);
