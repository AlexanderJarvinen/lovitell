var $ = require('jquery');
var React = require('react');
var ReactDOM = require('react-dom');
var Modal = require('react-modal');
var classNames = require('classnames');

var BuildStatusSelect = React.createClass({
    getInitialState: function() {
        let build_statuses = [];
        let selected_desk = '';
        for (var i=0; i<this.props.build_statuses.length; i++) {
            var status = this.props.build_statuses[i];
            build_statuses.push(
                <option key={i} value={status.type}>{status.desk}</option>
            )
            if (this.props.build_status && status.type == this.props.build_status) {
                selected_desk = status.desk;
            }
        }
        return {
            build_statuses: build_statuses,
            selected_desk: selected_desk
        }
    },
    handleStatusChange: function(e) {
        if (typeof this.props.onChange != 'undefined') {
            this.props.onChange(e.target.value);
        }
        this.setState({
            status:1,
            build_status: e.target.value
        });
    },
    render:function() {
        let style=classNames(
            'build_status__select',
            'inputrow',
            {
            changed: this.props.state==1,
            saved: this.props.state==2,
            error: this.props.state==-1
        });
        var build_status=null;
        if (this.props.rights != 0) {
            build_status =
                <div className={style}>
                    <label htmlFor="build_status">Статус:</label>
                    <select name="build_status" onChange={this.handleStatusChange} value={this.props.build_status}>
                        {this.state.build_statuses}
                    </select>
                </div>
        } else {
            build_status =
                <div className="build_status__desk">
                    <b>Статус:</b> {this.props.build_status_desk}
                </div>
        }
        return (
            <div className="build_status inputrow">
                {build_status}
            </div>
        )
    }
});

module.exports=BuildStatusSelect;