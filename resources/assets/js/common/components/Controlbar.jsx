var $ = require('jquery');
var React = require('react');
var ReactDOM = require('react-dom');
var Modal = require('react-modal');
var ControlbarActions = require('../actions/ControlbarActions');
var ControlbarStore = require('../stores/ControlbarStore');
var WidgetTabpane = require('../components/WidgetTabpane');
var ReportTabpane = require('../../report/components/ReportTabpane');
var InventoryTabpane =require('../../inventory/components/InventoryTabpane');
var MonitoringTabpane =require('../../inventory/components/MonitoringTabpane');
var ClientsTabpane =require('../../commercial/components/ClientsTabpane');

var $ = require('jquery');
var classnames = require('classnames');

var ControlbarTab = React.createClass({
    render: function() {
        var tab_class = classnames('tab-pane', { active: this.props.active_tab==this.props.id });
        return (
            <div className={tab_class} id="control-sidebar-home-tab">
                <h3 className="control-sidebar-heading">{this.props.title}</h3>
                <div className="control-sidebar-content">
                    {this.props.children}
                </div>
            </div>
        )
    }
});

var ControlbarTabpane = React.createClass({

    _handleClick: function(i) {
        console.log(i);
        ControlbarActions.changeTab(i);
    },

    render: function() {
        var t = this.props.tab_list;
        t = t.reverse();
        console.log(t);
        var tabs = [];
        for (var key in t) {
            tabs.push(<li key={key} className={this.props.active_tab==parseInt(key)+1?'active':''}><a href="#" onClick={this._handleClick.bind(null, parseInt(key)+1)}><i className={'fa '+t[key]}></i></a></li>);
        }
        return (
            <ul className="nav nav-tabs nav-justified control-sidebar-tabs">
                {tabs}
            </ul>
        )
    }
});

var Controlbar = React.createClass({

    getInitialState: function() {
        return {
            active_tab: 1,
            tab_count: 2
        }
    },

    _changeSkin: function(skin) {
        var c = "sidebar-mini ";
        switch(skin) {
            case 'blue':
                c = c+"skin-blue";
                break;
            case 'black':
                c = c+"skin-black";
                break;
            case 'purple':
                c = c+"skin-purple";
                break;
            case 'green':
                c = c+"skin-green";
                break;
            case 'red':
                c = c+"skin-red";
                break;
            case 'yellow':
                c = c+"skin-yellow";
                break;
            case 'blue_light':
                c = c+"skin-blue-light";
                break;
            case 'black_light':
                c = c+"skin-black-light";
                break;
            case 'purple_light':
                c = c+"skin-purple-light";
                break;
            case 'green_light':
                c = c+"skin-green-light";
                break;
            case 'red_light':
                c = c+"skin-red-light";
                break;
            case 'yellow_light':
                c = c+"skin-yellow-light";
                break;
            default:
                c = c+"skin-blue";
        }
        $('body').attr("class", c);
    },

    componentDidMount: function() {
        ControlbarStore.addChangeListener(this._onChange);
    },

    componentWillUnmount: function() {
        ControlbarStore.removeChangeListener(this._onChange);
    },
    toggleFullscreen: function() {
        document.body.classList.add('fullscreen');
        let swOff = document.getElementsByClassName('fullscreen--switchoff');
        if (swOff.length>0) {
            swOff[0].onclick = function() {
                document.body.classList.remove('fullscreen');
            }
        }
    },
    render: function(){
        var page_tab=null;
        var tab_i = 1;
        var tab_list = [];
        tab_list.push('fa-home');
        console.log(this.props.pagename);
        switch(this.props.pagename) {
            case 'dashboard':
                page_tab = (<ControlbarTab id={tab_i} active_tab={this.state.active_tab} title="Виджеты">
                    <WidgetTabpane controlbar_params={this.props.controlbar_params}/>
                </ControlbarTab>);
                tab_i = tab_i+1;
                tab_list.push('fa-gear');
                break;
            case 'report':
                page_tab = (<ControlbarTab id={tab_i} active_tab={this.state.active_tab} title="Настройка отчета">
                    <ReportTabpane controlbar_params={this.props.controlbar_params}/>
                </ControlbarTab>);
                tab_i = tab_i+1;
                tab_list.push('fa-gear');
                break;
            case 'equipment':
                page_tab = (<ControlbarTab id={tab_i} active_tab={this.state.active_tab} title="Настройка Оборудование">
                    <InventoryTabpane controlbar_params={this.props.controlbar_params} />
                </ControlbarTab>);
                tab_i = tab_i+1;
                tab_list.push('fa-gear');
                break;
            case 'monitoring':
                page_tab = (<ControlbarTab id={tab_i} active_tab={this.state.active_tab} title="Настройка Мониторинга">
                    <MonitoringTabpane controlbar_params={this.props.controlbar_params} />
                </ControlbarTab>);
                tab_i = tab_i+1;
                tab_list.push('fa-gear');
                break;
            case 'clients':
                page_tab = (<ControlbarTab id={tab_i} active_tab={this.state.active_tab} title="Настройка поиска клиентов">
                    <ClientsTabpane controlbar_params={this.props.controlbar_params} />
                </ControlbarTab>);
                tab_i = tab_i+1;
                tab_list.push('fa-gear');
                break;
        }
        return (
            <section className="control_sidebar">

                <ControlbarTabpane
                    active_tab={this.state.active_tab}
                    tab_list={tab_list}
                    dashboard_id={this.props.dashboard_id}
                    controlbar_params={this.props.controlbar_params}
                />

                <div className="tab-content">
                    {page_tab}
                    <ControlbarTab id={tab_i} title="Основные настройки" active_tab={this.state.active_tab}>
                        <div className="form-group">
                            <a onClick={this.toggleFullscreen}><i className="fa fa-television" />Разбить на весь экран</a>
                        </div>
                        <div className="form-group">
                            <h4 className="control-sidebar-heading">Настройки шаблона</h4>
                            <ul className="list-unstyled clearfix">
                                <li className="skin-icon">
                                    <a className="clearfix full-opacity-hover" onClick={this._changeSkin.bind(null, 'blue')}>
                                        <div>
                                            <span style={{display: 'block', width: '20%', float: 'left', height: '7px', background: '#367fa9'}} />
                                            <span style={{display: 'block', width: '80%', float: 'left', height: 7}} className="bg-light-blue" />
                                        </div>
                                        <div>
                                            <span style={{display: 'block', width: '20%', float: 'left', height: 20, background: '#222d32'}} />
                                            <span style={{display: 'block', width: '80%', float: 'left', height: 20, background: '#f4f5f7'}} />
                                        </div>
                                    </a>
                                    <p className="text-center no-margin">Blue</p>
                                </li>
                                <li className="skin-icon">
                                    <a className="clearfix full-opacity-hover" onClick={this._changeSkin.bind(null, 'black')}>
                                        <div className="clearfix">
                                            <span style={{display: 'block', width: '20%', float: 'left', height: 7, background: '#fefefe'}} />
                                            <span style={{display: 'block', width: '80%', float: 'left', height: 7, background: '#fefefe'}} />
                                        </div>
                                        <div>
                                            <span style={{display: 'block', width: '20%', float: 'left', height: 20, background: '#222'}} />
                                            <span style={{display: 'block', width: '80%', float: 'left', height: 20, background: '#f4f5f7'}} />
                                        </div>
                                    </a>
                                    <p className="text-center no-margin">Black</p>
                                </li>
                                <li className="skin-icon">
                                    <a className="clearfix full-opacity-hover" onClick={this._changeSkin.bind(null, 'purple')}>
                                        <div>
                                            <span style={{display: 'block', width: '20%', float: 'left', height: 7}} className="bg-purple-active" />
                                            <span className="bg-purple" style={{display: 'block', width: '80%', float: 'left', height: 7}} />
                                        </div>
                                        <div>
                                            <span style={{display: 'block', width: '20%', float: 'left', height: 20, background: '#222d32'}} />
                                            <span style={{display: 'block', width: '80%', float: 'left', height: 20, background: '#f4f5f7'}} />
                                        </div>
                                    </a>
                                    <p className="text-center no-margin">Purple</p>
                                </li>
                                <li className="skin-icon">
                                    <a className="clearfix full-opacity-hover" onClick={this._changeSkin.bind(null, 'green')}>
                                        <div>
                                            <span style={{display: 'block', width: '20%', float: 'left', height: 7}} className="bg-green-active" />
                                            <span className="bg-green" style={{display: 'block', width: '80%', float: 'left', height: 7}} />
                                        </div>
                                        <div>
                                            <span style={{display: 'block', width: '20%', float: 'left', height: 20, background: '#222d32'}} />
                                            <span style={{display: 'block', width: '80%', float: 'left', height: 20, background: '#f4f5f7'}} />
                                        </div>
                                    </a>
                                    <p className="text-center no-margin">Green</p>
                                </li>
                                <li className="skin-icon">
                                    <a className="clearfix full-opacity-hover" onClick={this._changeSkin.bind(null, 'red')}>
                                        <div>
                                            <span style={{display: 'block', width: '20%', float: 'left', height: 7}} className="bg-red-active" />
                                            <span className="bg-red" style={{display: 'block', width: '80%', float: 'left', height: 7}} />
                                        </div>
                                        <div>
                                            <span style={{display: 'block', width: '20%', float: 'left', height: 20, background: '#222d32'}} />
                                            <span style={{display: 'block', width: '80%', float: 'left', height: 20, background: '#f4f5f7'}} />
                                        </div>
                                    </a>
                                    <p className="text-center no-margin">Red</p>
                                </li>
                                <li className="skin-icon">
                                    <a className="clearfix full-opacity-hover" onClick={this._changeSkin.bind(null, 'yellow')}>
                                        <div>
                                            <span style={{display: 'block', width: '20%', float: 'left', height: 7}} className="bg-yellow-active" />
                                            <span className="bg-yellow" style={{display: 'block', width: '80%', float: 'left', height: 7}} />
                                        </div>
                                        <div>
                                            <span style={{display: 'block', width: '20%', float: 'left', height: 20, background: '#222d32'}} />
                                            <span style={{display: 'block', width: '80%', float: 'left', height: 20, background: '#f4f5f7'}} />
                                        </div>
                                    </a>
                                    <p className="text-center no-margin">Yellow</p>
                                </li>
                                <li className="skin-icon">
                                    <a className="clearfix full-opacity-hover" onClick={this._changeSkin.bind(null, 'blue_light')}>
                                        <div>
                                            <span style={{display: 'block', width: '20%', float: 'left', height: 7, background: '#367fa9'}} />
                                            <span className="bg-light-blue" style={{display: 'block', width: '80%', float: 'left', height: 7}} />
                                        </div>
                                        <div>
                                            <span style={{display: 'block', width: '20%', float: 'left', height: 20, background: '#f9fafc'}} />
                                            <span style={{display: 'block', width: '80%', float: 'left', height: 20, background: '#f4f5f7'}} />
                                        </div>
                                    </a>
                                    <p className="text-center no-margin" style={{fontSize: 12}}>Blue Light</p>
                                </li>
                                <li className="skin-icon">
                                    <a className="clearfix full-opacity-hover" onClick={this._changeSkin.bind(null, 'black_light')}>
                                        <div className="clearfix">
                                            <span style={{display: 'block', width: '20%', float: 'left', height: 7, background: '#fefefe'}} />
                                            <span style={{display: 'block', width: '80%', float: 'left', height: 7, background: '#fefefe'}} />
                                        </div>
                                        <div>
                                            <span style={{display: 'block', width: '20%', float: 'left', height: 20, background: '#f9fafc'}} />
                                            <span style={{display: 'block', width: '80%', float: 'left', height: 20, background: '#f4f5f7'}} />
                                        </div>
                                    </a>
                                    <p className="text-center no-margin" style={{fontSize: 12}}>Black Light</p>
                                </li>
                                <li className="skin-icon">
                                    <a className="clearfix full-opacity-hover" onClick={this._changeSkin.bind(null, 'purple_light')}>
                                        <div>
                                            <span style={{display: 'block', width: '20%', float: 'left', height: 7}} className="bg-purple-active" />
                                            <span className="bg-purple" style={{display: 'block', width: '80%', float: 'left', height: 7}} />
                                        </div>
                                        <div>
                                            <span style={{display: 'block', width: '20%', float: 'left', height: 20, background: '#f9fafc'}} />
                                            <span style={{display: 'block', width: '80%', float: 'left', height: 20, background: '#f4f5f7'}} />
                                        </div>
                                    </a>
                                    <p className="text-center no-margin" style={{fontSize: 12}}>Purple Light</p>
                                </li>
                                <li className="skin-icon">
                                    <a className="clearfix full-opacity-hover" onClick={this._changeSkin.bind(null, 'green_light')}>
                                        <div>
                                            <span style={{display: 'block', width: '20%', float: 'left', height: 7}} className="bg-green-active" />
                                            <span className="bg-green" style={{display: 'block', width: '80%', float: 'left', height: 7}} />
                                        </div>
                                        <div>
                                            <span style={{display: 'block', width: '20%', float: 'left', height: 20, background: '#f9fafc'}} />
                                            <span style={{display: 'block', width: '80%', float: 'left', height: 20, background: '#f4f5f7'}} />
                                        </div>
                                    </a>
                                    <p className="text-center no-margin" style={{fontSize: 12}}>Green Light</p>
                                </li>
                                <li className="skin-icon">
                                    <a className="clearfix full-opacity-hover" onClick={this._changeSkin.bind(null, 'red_light')}>
                                        <div>
                                            <span style={{display: 'block', width: '20%', float: 'left', height: 7}} className="bg-red-active" />
                                            <span className="bg-red" style={{display: 'block', width: '80%', float: 'left', height: 7}} />
                                        </div>
                                        <div>
                                            <span style={{display: 'block', width: '20%', float: 'left', height: 20, background: '#f9fafc'}} />
                                            <span style={{display: 'block', width: '80%', float: 'left', height: 20, background: '#f4f5f7'}} />
                                        </div>
                                    </a>
                                    <p className="text-center no-margin" style={{fontSize: 12}}>Red Light</p>
                                </li>
                                <li className="skin-icon">
                                    <a className="clearfix full-opacity-hover" onClick={this._changeSkin.bind(null, 'yellow_light')}>
                                        <div>
                                            <span style={{display: 'block', width: '20%', float: 'left', height: 7}} className="bg-yellow-active" />
                                            <span className="bg-yellow" style={{display: 'block', width: '80%', float: 'left', height: 7}} />
                                        </div>
                                        <div>
                                            <span style={{display: 'block', width: '20%', float: 'left', height: 20, background: '#f9fafc'}} />
                                            <span style={{display: 'block', width: '80%', float: 'left', height: 20, background: '#f4f5f7'}} />
                                        </div>
                                    </a>
                                    <p className="text-center no-margin" style={{fontSize: 12}}>Yellow Light</p>
                                </li>
                            </ul>
                        </div>
                    </ControlbarTab>
                </div>
            </section>
        )
    },

    _onChange: function() {
        var tab_state = ControlbarStore.getTabState();
        this.setState({
           active_tab: tab_state.active_tab
        });
    }
});


ReactDOM.render(
    <Controlbar pagename={pagename} dashboard_id={dashboard_id} controlbar_params={controlbar_params}/>,
    document.getElementById('control-sidebar')
);

