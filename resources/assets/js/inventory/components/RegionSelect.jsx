var $ = require('jquery');
var React = require('react');

var RegionSelect = React.createClass({
    getInitialState: function() {
        return {
            regions: []
        }
    },
    makeRegionList: function(data) {
        let regions = [];
        regions.push(<option key={0} id={0} value={0}>Не выбран</option>);
        for (var i = 0; i < data.length; i++) {
            var option = data[i];
            regions.push(
                <option key={i+1} value={option.region_id}>{option.desk}</option>
            );
        }
        this.setState({
            regions: regions
        });
    },
    componentDidMount: function() {
        this.updateRegionData();
    },
    updateRegionData: function(_city_id) {
        let city_id  = _city_id || this.props.city_id;
        if (city_id != 0) {
            $.ajax({
                type: 'GET',
                url: '/inventory/regions/' + city_id,
                success: this.makeRegionList
            });
        }
    },
    componentWillReceiveProps: function(nextProps) {
        if (this.props.city_id != nextProps.city_id && nextProps.city_id != 0 && this.props.rights) {
            this.updateRegionData(nextProps.city_id);
        }
    },
    onChange: function(e) {
        if (typeof this.props.onChange != 'undefined') {
            let index = e.nativeEvent.target.selectedIndex;
            this.props.onChange({
                region: e.nativeEvent.target[index].text,
                region_id: e.target.value
            });
        }
    },
    render: function() {
        if (this.props.city_id == 0) return null;
        if (this.props.rights) {
            var field = (<select onChange={this.onChange} value={this.props.region_id}>
                    {this.state.regions}
            </select>);
        } else {
            var field = <b>{this.props.region}</b>
        }
        return (
            <div className={this.props.className}>
                <label htmlFor="region">Район:</label>
                {field}
            </div>
        );
    }
});

module.exports=RegionSelect;