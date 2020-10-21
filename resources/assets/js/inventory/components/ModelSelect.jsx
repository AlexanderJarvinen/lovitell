var $ = require('jquery');
var React = require('react');
var classNames = require('classnames');

var ModelSelect = React.createClass({
    getDefaultProps: function() {
        return {
            check_rights: true
        }
    },
    getInitialState: function() {
        let models = [];
        models.push(<option key={0} id={0} value={0}>Не выбрана</option>);
        return {
            model_id: this.props.model_id,
            model_desk: this.props.model_desk,
            eq_group: this.props.eq_group,
            models: models,
            rights: false
        }
    },
    makeModelList: function(data) {
        if (data.error == 0) {
            let models = [];
            models.push(<option key={0} id={0} value={0}>Не выбрана</option>);
            for (var i = 0; i < data.data.length; i++) {
                var option = data.data[i];
                models.push(
                    <option key={i + 1} value={option.id}>{option.desk}</option>
                );
            }
            this.setState({
                models: models
            });
        } else {
            this.setState({
                rights: false
            })
        }
    },
    getModelList: function(system_group) {
        $.ajax({
            type: 'GET',
            url: '/inventory/ajax/models/'+system_group,
            success: this.makeModelList
        });
    },
    componentDidMount: function() {
        if (!this.props.check_rights){
            this.setState({rights: true});
            if (this.props.system_group) this.getModelList(this.props.system_group);
        } else {
            this.checkRights();
        }
    },
    checkRights: function() {
        $.ajax({
            type: 'GET',
            url: '/inventory/ajax/checkrights/model/change',
            success: (rights)=>{
                this.setState({rights});
                if (rights && this.props.system_group) {
                    this.getModelList(this.props.system_group);
                }
            }
        })
    },
    componentWillReceiveProps(np) {
        if (np.system_group != 0 && np.system_group != this.props.system_group) {
            this.getModelList(np.system_group);
        }
    },
    handleModelChange: function(e) {
        if (typeof this.props.onChange == "function") {
            let index = e.nativeEvent.target.selectedIndex;
            this.props.onChange({
                model_desk: e.nativeEvent.target[index].text,
                model_id: e.target.value
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
                onChange={this.handleModelChange}
                value={this.props.model_id}
                disabled={this.props.system_group == 0}>
                   {this.state.models}
            </select>);
        } else {
            var field = <b>{this.props.model_desk}</b>
        }
        return (
            <div className={style}>
                <label htmlFor="city">Модель:</label>
                {field}
            </div>
        );
    }
});

module.exports=ModelSelect;