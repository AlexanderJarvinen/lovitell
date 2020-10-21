var $ = require('jquery');
var React = require('react');

var BuildSelect = React.createClass({
    getInitialState: function() {
        let builds = [];
        builds.push(<option key={0} id={0} value={0}>Не выбран</option>);
        return {
            builds: builds
        }
    },
    makeBuildList: function(data) {
        data = data.builds;
        let builds = [];
        builds.push(<option key={0} id={0} value={0}>Не выбран</option>);
        for (var i = 0; i < data.length; i++) {
            var option = data[i];
            builds.push(
                <option key={i+1} value={option.address+'-'+option.construction_type}>{option.home}</option>
            );
        }
        this.setState({
            builds: builds
        });
    },
    updateBuildData: function(_street_id, _region_id) {
        let street_id = _street_id || this.props.street_id || 0;
        let region_id = _region_id || this.props.region_id || 0;
        let consType = this.props.consType || 0;
        console.log('Construction_type:'+consType);
        if (street_id && region_id) {
            $.ajax({
                beforeSend: function (request) {
                    return request.setRequestHeader('X-CSRF-Token', $("meta[name='csrf-token']").attr('content'));
                },
                type: 'POST',
                url: '/inventory/buildings/by-street',
                data: {
                    region_id: region_id,
                    street_id: street_id,
                    construction_type: consType
                },
                success: this.makeBuildList
            });
        }
    },
    componentDidMount: function() {
        console.log('BUILD MOUNT');
        console.log(this.props);
        this.updateBuildData();
    },
    componentWillReceiveProps: function(nextProps) {
        if (nextProps.street_id != this.props.street_id || nextProps.region_id != this.props.region_id) {
            this.updateBuildData(nextProps.street_id, nextProps.region_id);
        }
    },
    handlerAddressChange: function(e) {
        let build = e.target.value.split('-');
        if (typeof this.props.onChange != 'undefined') {
            let build_info = {id: build[0], construction_type: build[1]};
            this.props.onChange(build_info);
        }
    },
    render: function() {
        if (this.props.street_id == 0 && !this.props.disableWhenRegionEmpty) return null;
        if (typeof this.props.rights == 'undefined' || this.props.rights==true) {
            var field=(
                <select
                    onChange={this.handlerAddressChange}
                    value={this.props.address_id+'-'+this.props.construction_type}
                    disabled={this.props.street_id==0}>
                    {this.state.builds}
                </select>);
        } else {
            var field=(<b>{this.props.build}</b>);
        }
        return (
            <div className={this.props.className}>
                <label htmlFor="region">Дом:</label>
                {field}
            </div>
        );
    }
});

module.exports=BuildSelect;