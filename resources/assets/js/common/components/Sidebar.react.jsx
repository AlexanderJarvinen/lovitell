var $ = require('jquery');
var React = require('react');
var ReactDOM = require('react-dom');
var Modal = require('react-modal');
var SidebarActions = require('../actions/SidebarActions');
var SidebarStore = require('../stores/SidebarStore');
var classNames = require('classnames');

var UserPanel = React.createClass({
    render: function() {
        return (
            <div className="user-panel">
            </div>
        )
    }
});

var SearchForm = React.createClass({
    getInitialState: function() {
        return {
            search: ''
        }
    },

    handleClick: function(e) {
        SidebarStore.search(this.state.search);
        e.preventDefault();
    },

    handleChange: function(event) {
        this.setState({search: event.target.value})
    },

    render: function() {
        return (
            <form action="#" method="get" className="sidebar-form">
                <div className="input-group">
                    <input type="text" name="q" className="form-control" placeholder="Поиск..." onChange={this.handleChange} value={this.state.search}/>
                    <span className="input-group-btn">
                        <button type="submit" name="search" id="search-btn" className="btn btn-flat" onClick={this.handleClick}>
                            <i className="fa fa-search"></i>
                        </button>
                    </span>
                </div>
            </form>
        )
    }
});

var MenuItem = React.createClass({
    getInitialState: function() {
        return {
            is_active: false
        }
    },

    activate: function() {
        this.setState({is_active: false})
    },

    render: function() {
        var item = this.props.item;
        let href = window.location.pathname;
        if (Array.isArray(item.submenu)) {
            var submenu = [];
            var submenu_active = false;
            for (var submenu_item in item.submenu) {
                var row = item.submenu[submenu_item];
                if (row.href==href) {
                    submenu_active = true;
                }
                submenu.push(
                    <li key={item+"-"+submenu_item} className={classNames({active:row.href==href})}>
                        <a href={row.href} title={row.note || ''}>
                            <i className="fa fa-circle-o"></i>{row.name}</a>
                    </li>
                );
            }
            if (submenu != null) {
                return (
                    <li key={item} className={classNames({active: submenu_active})}>
                        <a href='#' onClick={this.activate.bind(this, item.name)}><i className={item.icon}></i>
                            <span>{item.name}</span>
                        </a>
                        <ul className='treeview-menu'>
                             {submenu}
                        </ul>
                    </li>
                );
            }
        } else {
            return (
                <li key={item}>
                    <a href={items[item].href}>
                        <span>{items[item]}</span>
                    </a>
                </li>
            );
        }
    }
});

var Menu = React.createClass({

    getInitialState: function() {
        return {
            active: ''
        }
    },

    render: function() {

        var groups = [];

        var allmenu = this.props.menu;
        groups.push(<li><a href="/"><i className="fa fa-home"></i><span>Главная</span></a></li>);
        for (var group in allmenu) {
            var items = allmenu[group];
            var group_menus = [];
            for (var item in items) {
                group_menus.push(<MenuItem key={item} item={items[item]}/>)
            }
            groups.push(
                <li className="header" key={group}>{group}</li>
            );
            if (group_menus) {
                groups.push(group_menus);
            }
        }
        if (groups.length == 0) {
            groups.push(<li className="header">Ничего не найдено</li>);
        }
        return (
            <ul className="sidebar-menu">{groups}</ul>
        )
    }
});

function getSidebarState() {
    return {
        menu: SidebarStore.getMenu()
    };
}

var Sidebar = React.createClass({

    getInitialState: function() {
        return {
            menu: [],
            user: this.props.user
        }
    },

    componentDidMount: function() {
        SidebarStore.addChangeListener(this._onChange);
        SidebarStore.init();
        $('.content-wrapper').css({'min-height': ($('#main-sidebar').height()-53)+'px'});
    },

    componentWillUnmount: function() {
        SidebarStore.removeChangeListener(this._onChange);
    },

    render: function(){
        return (
            <section className="sidebar">

                <UserPanel user={this.props.user}/>

                <SearchForm search_string={this.state.menu.search_string}/>

                <Menu menu={this.state.menu.menu} />
            </section>
        )
    },

    _onChange: function() {
        this.setState(getSidebarState());
        $('.content-wrapper').css({'min-height': ($('#main-sidebar').height()-53)+'px'});
    }
});

ReactDOM.render(
    <Sidebar user={User} />,
    document.getElementById('main-sidebar')
);