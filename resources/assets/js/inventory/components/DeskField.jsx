var $ = require('jquery');
var React = require('react');
var classNames = require('classnames');

var DeskField = React.createClass({
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
            url: '/inventory/ajax/checkrights/desk/change',
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

    handleDeskChange: function(e) {
        if (typeof this.props.onChange == "function") {
            this.props.onChange(e.target.value);
        }
    },
    render: function() {
        let field = (<div>{this.props.desk}</div>);
        console.log(this.props.desk);
        if (this.state.rights) {
            field = (
                <textarea name='mac' value={this.props.desk} onChange={this.handleDeskChange}></textarea>
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
                <label htmlFor="city">{(this.props.title || 'Описание')+':'}</label>
                {field}
            </div>
        );
    }
});

module.exports=DeskField;