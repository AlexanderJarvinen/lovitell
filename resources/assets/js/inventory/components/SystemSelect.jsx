var $ = require('jquery');
var React = require('react');
var classNames = require('classnames');
import Draggable from 'react-draggable';
import ModalDialog from 'react-bootstrap/lib/ModalDialog';
import SystemSelectModal from './SystemSelectModal'

class DraggableModalDialog extends React.Component {
    render() {
        return <Draggable handle=".modal-title"><ModalDialog
            backdrop={false}
            enforceFocus={false}
            {...this.props} /></Draggable>
    }
}
var SystemSelect = React.createClass({
    getDefaultProps: function() {
        return {
            modal_select: false,
            system_id: 99999,
            system_desk: ''
        }
    },
    getInitialState: function() {
        return {
            system_id: this.props.system_id,
            system_desk: this.props.system_desk,
            systems: [],
            check_rights: this.props.check_rights|| true,
            rights: false,
            modal_show: false
        }
    },
    makeSystemList: function(data) {
        if (data.error == 0) {
            let systems = [];
            systems.push(<option key={0} id={0} value={99999}>Не выбран</option>);
            for (var i = 0; i < data.data.length; i++) {
                var option = data.data[i];
                systems.push(
                    <option key={i + 1} value={option.system} data-group={option.type}>{option.desk}</option>
                );
            }
            this.setState({
                rights: true,
                systems: systems
            });
        } else {
            this.setState({
                rights: false
            })
        }
    },
    checkRights: function() {
        $.ajax({
            type: 'GET',
            url: '/inventory/ajax/checkrights/system/change',
            success: (rights)=>this.setState({rights})
        })
    },
    getSystemList: function() {
        $.ajax({
            type: 'GET',
            url: '/inventory/ajax/systems/',
            success: this.makeSystemList
        });
    },
    componentDidMount: function() {
        if (this.state.check_rights) {
            this.checkRights();
        } else {
            this.setState({right: true});
        }
        this.getSystemList();
    },
    handleSystemChange: function(e) {
        if (typeof this.props.onChange == "function") {
            let index = e.nativeEvent.target.selectedIndex;
            this.props.onChange({
                system_desk: e.nativeEvent.target[index].text,
                system_id: e.target.value,
                system_group: e.nativeEvent.target[index].getAttribute('data-group'),
                saved: false
            });
        }
    },
    handleSystemSave: function(system) {
        this.props.onChange({
            system_id: system.system_id,
            system_desk: system.system_desk,
            system_group: system.system_group,
            saved: true
        });
    },
    render: function() {
        let style = classNames(
            'inputrow',
            {'changed': this.props.state==1},
            {'cansave': this.props.state==2},
            {'saved': this.props.state==3},
            {'error': this.props.state==-1}
        );
        if (this.state.rights && !this.props.modal_select) {
            var field = (<select onChange={this.handleSystemChange} value={this.props.system_id}>
                   {this.state.systems}
            </select>);
        } else {
            var field = <b>{this.props.system_desk}</b>
        }
        return (
            <div className={style}>
                <label htmlFor="city">Тип:</label>
                {field}
                {this.props.modal_select && this.state.rights?
                <span>
                    <i className='fa fa-edit icon' onClick={()=>this.setState({modal_show:true})}></i>
                    <SystemSelectModal
                        show={this.state.modal_show}
                        onSave={this.handleSystemSave}
                        onHide={()=>this.setState({modal_show: false})}
                        route={this.props.route}
                        system_id={this.state.system_id}
                        system_group={this.state.system_group}
                        systems={this.state.systems}
                    />
                </span>
                :
                null
                }
            </div>
        );
    }
});

module.exports=SystemSelect;