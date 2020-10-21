var $ = require('jquery');
var React = require('react');
var classNames = require('classnames');

var LinkType = React.createClass({
    getInitialState: function() {
        return {
            linktypes: [],
            linktype_data: []
        }
    },
    fillLinkType: function(data) {
        let linktypes = [];
        let linktype_data=[];
        linktypes.push(<option key={0} id={0} value={0}>Не выбран</option>);
        for (var i = 0; i < data.length; i++) {
            var option = data[i];
            linktypes.push(
                <option key={i + 1} value={option.id}>{option.desk}</option>
            );
            linktype_data[option.id] = option.desk;
        }
        this.setState({
            linktypes: linktypes,
            linktype_data: linktype_data
        });
    },
    getLinkTypes: function() {
        $.ajax({
            type: 'GET',
            url: '/inventory/ajax/linktype',
            success: this.fillLinkType
        });
    },
    componentDidMount: function() {
        this.getLinkTypes();
    },
    handleLinkTypeChange: function(e) {
        if (typeof this.props.onChange == "function") {
            this.props.onChange(e.target.value);
        }
    },
    render: function() {
        if (this.props.rights) {
            var field = (<select onChange={this.handleLinkTypeChange} value={this.props.link_type} disabled={this.props.disabled}>
                    {this.state.linktypes}
            </select>);
        } else {
            var field = (<b>{this.state.linktype_data[this.props.link_type]}</b>)
        }
        return (
            <div className={this.props.className}>
                <label htmlFor="city">Тип линка:</label>
                {field}
            </div>
        );
    }
});

module.exports=LinkType;