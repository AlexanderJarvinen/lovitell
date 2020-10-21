var $ = require('jquery');
var React = require('react');
var classNames = require('classnames');

var VlanSelect = React.createClass({
    getDefaultProps: function() {
        return {
            location: 0,
            system: 99999,
            system_group: 0,
            check_rights: true
        }
    },
    getInitialState: function() {
        let vlans = [];
        vlans.push(<option key={0} id={0} value={0}>Не выбран</option>);
        return {
            vlan_id: this.props.vlan_id,
            vlan_desk: this.props.vlan_desk,
            vlans: vlans,
            rights: false
        }
    },
    makeVlanList: function(data) {
        if (data.error == 0) {
            let vlans = [];
            vlans.push(<option key={0} id={0} value={0}>Не выбран</option>);
            for (var i = 0; i < data.data.length; i++) {
                var option = data.data[i];
                vlans.push(
                    <option key={i + 1} value={option.id}>{option.desk}</option>
                );
            }
            this.setState({
                vlans: vlans
            });
        } else {
            this.setState({
                rights: false
            })
        }
    },
    getVlanList: function(location, system) {
        $.ajax({
            type: 'GET',
            url: '/inventory/ajax/vlans/'+location+'/'+system,
            success: this.makeVlanList
        });
    },
    getVlanListSG: function(location, system_group) {
        $.ajax({
            type: 'GET',
            url: '/inventory/ajax/vlans/'+location+'/sg/'+system_group,
            success: this.makeVlanList
        });
    },
    checkRights: function() {
        $.ajax({
            type: 'GET',
            url: '/inventory/ajax/checkrights/vlan/change',
            success: (rights)=>this.setState({rights})
        })
    },
    componentDidMount: function() {
        if (!this.props.check_rights){
            this.setState({rights: true})
        } else {
            this.checkRights();
        }
        if (this.props.location != 0) {
            if (this.props.system_group != 0) {
                this.getVlanListSG(this.props.location, this.props.system_group);
            } else if (this.props.system != 99999) {
                this.getVlanList(this.props.location, this.props.system);
            }
        }
    },
    componentWillReceiveProps: function(np) {
        if (np.location != 0) {
            if (np.system_group != 0 &&
                (np.system_group != this.props.system_group ||
                np.location != this.props.location)) {
                this.getVlanListSG(np.location, np.system_group);
            } else if (np.system != 99999 &&
                (np.location != this.props.location ||
                np.system != this.props.system)
            ) {
                this.getVlanList(np.location, np.system);
            }
        }
    },
    handlerVlanChange: function(e) {
        if (typeof this.props.onChange == "function") {
            let index = e.nativeEvent.target.selectedIndex;
            this.props.onChange({
                vlan_desk: e.nativeEvent.target[index].text,
                vlan_id: e.target.value
            });
        }
    },
    render: function() {
        let style = classNames(
            'inputrow',
            {'changed': this.props.state==1},
            {'cansave': this.props.state==2},
            {'saved': this.props.state==3},
            {'error': this.props.state==-1}
        );
        if (this.state.rights || !this.props.check_rights) {
            var field = (<select
                onChange={this.handlerVlanChange}
                value={this.props.vlan_id}
                disabled={(this.props.system == 99999 && !this.props.system_group) || this.props.location == 0}>
                   {this.state.vlans}
            </select>);
        } else {
            var field = <b>{this.props.vlan_desk}</b>
        }
        return (
            <div className={style}>
                <label htmlFor="city">VLAN:</label>
                {field}
            </div>
        );
    }
});

module.exports=VlanSelect;