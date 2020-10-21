var $ = require('jquery');
var React = require('react');
var classNames = require('classnames');
var IpListModal = require('./IpListModal.jsx');

var IpField = React.createClass({
    getInitialState: function() {
        return {
            rights: 0,
            ip_list_rights: 0,
            show_ip_list: false,
            ip_auto: false,
            ip: this.props.ip
        }
    },
    applyIpRights: function(r) {
        this.setState({rights: r});
    },
    applyIpListRights: function(r) {
        console.log('ip_l_r:'+r);
        this.setState({ip_list_rights: r});
    },
    checkRights: function() {
        $.ajax({
            type: 'GET',
            url: '/inventory/ajax/checkrights/ip/change',
            success: this.applyIpRights
        });
    },
    checkIpListRights: function() {
        $.ajax({
            type: 'GET',
            url: '/inventory/ajax/checkrights/ip/viewlist',
            success: this.applyIpListRights
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
        this.checkIpListRights();
    },
    componentWillReceiveProps(np) {
        if (np.ip != '') {
            this.setState({
                ip: np.ip
            });
        }
    },
    handleIpChange: function(e) {
        if (typeof this.props.onChange == "function") {
            this.props.onChange({
                ip: e.target.value,
                ip_auto: false
            });
        }
    },
    handleSelectIp: function(ip) {
        this.props.onChange({
            ip: ip,
            ip_auto: false
        });
        this.setState({show_ip_list:false});
    },
    handleAutoChange: function() {
        let ip_auto = !this.props.ip_auto;
        if (typeof this.props.onChange == "function") {
            if (ip_auto) {
                this.setState({
                    ip: this.props.ip
                });
                this.props.onChange({
                    ip_auto: ip_auto,
                    ip: ''
                });
            } else {
                this.props.onChange({
                    ip_auto: ip_auto,
                    ip: this.state.ip
                });
            }
        }
    },
    render: function() {
        let field = (<b>{this.props.ip}</b>);
        if (this.state.rights) {
            let ip_list_btn = null;
            if (!this.props.ip_auto &&
                this.props.location_id &&
                this.state.ip_list_rights)
            {
                ip_list_btn = (<i className="fa fa-question-circle link" onClick={()=>{this.setState({show_ip_list: true})}}></i>);
            }
            field = (
                <span>
                    <input name='ip' value={this.props.ip} onChange={this.handleIpChange} disabled={this.props.ip_auto}/>
                    {ip_list_btn}
                    <input
                        type='checkbox'
                        name='auto_ip'
                        onChange={this.handleAutoChange}
                        value={this.props.ip_auto}/><label for='auto_ip'>Получить автоматически</label>
                    <IpListModal
                        show={this.state.show_ip_list}
                        ip={this.props.ip}
                        rights={this.state.ip_list_rights}
                        onChange={this.handleSelectIp}
                        handleClose={(e)=>{this.setState({show_ip_list:false})}}
                        location_id={this.props.location_id}
                        vlan_id={this.props.vlan_id}
                        />
                </span>
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
                <label htmlFor="ip">IP:</label>
                {field}
            </div>
        );
    }
});

module.exports=IpField;