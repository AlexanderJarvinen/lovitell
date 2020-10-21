var $ = require('jquery');
var React = require('react');
var classNames = require('classnames');

var RouteField = React.createClass({
    getDefaultProps: function() {
        return {
            check_rights: false,
            new_route: ''
        }
    },
    getInitialState: function() {
        return {
            rights: 0,
            route: this.props.route,
            new_route: ''
        }
    },
    applyRouteRights: function(r) {
        this.setState({rights: r});
    },
    checkRights: function() {
        $.ajax({
            type: 'GET',
            url: '/inventory/ajax/checkrights/route/change',
            success: this.applyRouteRights
        });
    },
    componentDidMount: function() {
        if (this.props.check_rights) {
            this.checkRights();
        } else {
            this.setState({
                rights: true
            });
        }
    },
    componentWillReceiveProps(np) {
        if (np.route != this.props.route) {
            this.setState({
                route: np.route
            });
        }
    },
    handleRouteChange: function(e) {
        if (typeof this.props.onChange == "function") {
            this.props.onChange({
                route: e.target.value,
                route_auto: false
            });
        }
    },
    handleAutoChange: function() {
        let route_auto = !this.props.route_auto;
        if (typeof this.props.onChange == "function") {
            if (route_auto) {
                this.setState({
                    new_route: this.props.new_route
                });
                this.props.onChange({
                    route: '',
                    route_auto: route_auto
                });
            } else {
                this.props.onChange({
                    route_auto: route_auto,
                    route: this.state.new_route
                });
            }
        }
    },
    render: function() {
        let field = (<b>{this.props.new_route}</b>);
        if (this.state.rights) {
            field = (
                <span>
                    <input name='route' value={this.props.new_route} onChange={this.handleRouteChange} disabled={this.props.route_auto}/>
                    <input
                        type='checkbox'
                        name='auto_route'
                        onChange={this.handleAutoChange}
                        value={this.props.route_auto}/><label for='auto_ip'>Получить автоматически</label>
                </span>
            );
        }
        return (
            <div className={classNames(
                    'build',
                    'inputrow',
                    {'changed': this.props.state==1},
                    {'cansave': this.props.state==2},
                    {'saved': this.props.state==3},
                    {'error': this.props.state==-1}
                )}
            >
                <label htmlFor="ip">Имя:</label>
                {field}
            </div>
        );
    }
});

module.exports=RouteField;