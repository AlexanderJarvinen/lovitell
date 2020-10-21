var $ = require('jquery');
var React = require('react');
var classNames = require('classnames');

var MacField = React.createClass({
    getInitialState: function() {
        return {
            rights: 0
        }
    },
    applyMacRights: function(r) {
        this.setState({rights: r});
    },
    checkRights: function() {
        $.ajax({
            type: 'GET',
            url: '/inventory/ajax/checkrights/mac/change',
            success: this.applyMacRights
        });
    },
    componentDidMount: function() {
        if (this.props.check_rights) {
            this.checkRights()
        } else {
            this.setState({
                rights: true
            })
        }
    },

    handlerMacChange: function(e) {
        if (typeof this.props.onChange == "function") {
            this.props.onChange(e.target.value);
        }
    },
    render: function() {
        let field = (<b>{this.props.mac}</b>);
        console.log(this.props.mac);
        if (this.state.rights) {
            field = (
                <input name='mac' value={this.props.mac} onChange={this.handlerMacChange} />
            )
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
                <label htmlFor="city">MAC:</label>
                {field}
            </div>
        );
    }
});

module.exports=MacField;