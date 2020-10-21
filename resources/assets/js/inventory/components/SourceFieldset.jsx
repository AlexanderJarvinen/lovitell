var $ = require('jquery');
var React = require('react');
var classNames = require('classnames');
var LinkType = require('./LinkType');

var SourceFieldset = React.createClass({
    getInitialState: function() {
        return {
            source: this.props.source || '',
            source_iface: this.props.source_iface || '',
            route_iface: this.props.route_iface || '',
            link_type: this.props.link_type || 0,
            rights: 0
        }
    },
    applySourceRights: function(r) {
        this.setState({rights: r});
    },
    checkRights: function() {
        $.ajax({
            type: 'GET',
            url: '/inventory/ajax/checkrights/source/change',
            success: this.applySourceRights
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
    componentWillReceiveProps: function(np) {
        console.log('SourceField:');
        console.log(np);
        this.setState({
            source: np.source,
            source_iface: np.source_iface,
            route_iface: np.route_iface,
            link_type: np.link_type,
        });
    },
    handleSourceChange: function(e) {
        if (this.state.source != '' &&
            this.state.source_iface != '' &&
            this.state.route_iface != '' &&
            this.state.link_type != 0
        ) {
            if (typeof this.props.onChange != 'undefined') {
                this.props.onChange({
                    source: this.state.source,
                    source_iface: this.state.source_iface,
                    route_iface: this.state.route_iface,
                    link_type: this.state.link_type
                })
            }
        }
    },
    render: function() {
        let source_class = classNames('inputrow', {'changed': this.props.state==1}, {'cansave': this.props.state==2}, {'saved': this.props.state==3}, {'error': this.props.state==-1});
        if (this.state.rights) {
            var source_field = (<input name='source' value={this.state.source} onChange={(e)=>{this.setState({source: e.target.value}, this.handleSourceChange)}} />);
            var source_iface_field = (<input name='source_iface' value={this.state.source_iface} onChange={(e)=>{this.setState({source_iface: e.target.value}, this.handleSourceChange)}} disabled={this.state.source==''} />);
            var route_iface_field = (<input name='route_iface' value={this.state.route_iface} onChange={(e)=>{this.setState({route_iface: e.target.value}, this.handleSourceChange)}}  disabled={this.state.source==''} />);
        } else {
            var source_field = (<b>{this.props.source}</b>);
            var source_iface_field = (<b>{this.props.source_iface}</b>);
            var route_iface_field = (<b>{this.props.route_iface}</b>);
        }
        return (
            <div className='source_select'>
                <div className={source_class}>
                    <label htmlFor="source">Родитель:</label>
                    {source_field}
                </div>
                <div className={source_class}>
                    <label htmlFor="source_iface">Интерфейс родителя:</label>
                    {source_iface_field}
                </div>
                <div className={source_class}>
                    <label htmlFor="route_iface">Интерфейс объекта:</label>
                    {route_iface_field}
                </div>
                <LinkType
                    className={source_class}
                    onChange={(link_type)=>{this.setState({link_type: link_type}, this.handleSourceChange)}}
                    link_type={this.state.link_type}
                    disabled={this.state.source==''}
                    rights={this.state.rights}
                />
            </div>
        );
    }
});

module.exports=SourceFieldset;