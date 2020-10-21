var $ = require('jquery');
var React = require('react');
var classNames = require('classnames');

var SituationField = React.createClass({
    getInitialState: function() {
        return {
            situations: [],
            rights: 0
        }
    },
    getSituations: function() {
        $.ajax({
            type: 'GET',
            url: '/inventory/ajax/situations',
            success: this.fillSituations
        });
    },
    componentDidMount: function() {
        this.getSituations();
    },
    fillSituations: function(data) {
        let situations = [];
        if (data.error ==0) {
            situations.push(<option key={0} value={0}>Не выбрана</option>);
            for(let i in data.data) {
                situations.push(<option key={i+1} value={data.data[i].value}>{data.data[i].label}</option>)
            }
            this.setState({
                rights: 1,
                situations: situations
            })
        } else {
            this.setState({
                rights: 0
            })
        }
    },
    handleSituationChange: function(e) {
        if (typeof this.props.onChange == "function") {
            let index = e.nativeEvent.target.selectedIndex;
            this.props.onChange({situation: e.target.value, situation_desk: e.nativeEvent.target[index].text});
        }
    },
    render: function() {
        if (this.state.rights) {
            var field = (<select onChange={this.handleSituationChange} value={this.props.situation || 0} disabled={this.props.disabled}>
                    {this.state.situations}
            </select>);
        } else {
            var field = (<b>{this.props.situation_desk || ''}</b>)
        }
        return (
            <div className={classNames(
                'build',
                'inputrow',
                {'changed': this.props.state==1},
                {'cansave': this.props.state==2},
                {'saved': this.props.state==3},
                {'error': this.props.state==-1}
            )}>
                <label htmlFor="situation">Ситуация:</label>
                {field}
            </div>
        );
    }
});

module.exports=SituationField;