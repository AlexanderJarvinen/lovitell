var $ = require('jquery');
var React = require('react');

var CitySelect = React.createClass({
    getInitialState: function() {
        return {
            selected: this.props.city_id,
            cities: []
        }
    },
    makeCityList: function(data) {
        let cities = [];
        cities.push(<option key={0} id={0} value={0}>Не выбран</option>);
        for (var i = 0; i < data.length; i++) {
            var option = data[i];
            cities.push(
                <option key={i+1} value={option.id}>{option.desk}</option>
            );
        }
        this.setState({
            cities: cities
        });
    },
    componentDidMount: function() {
        this.updateCityData();
    },
    componentWillReceiveProps(np) {
        if (this.props.city_id != np.city_id && this.props.rights) {
            this.updateCityData();
        }
    },
    updateCityData: function() {
        $.ajax({
            type: 'GET',
            url: '/inventory/ajax/city/',
            success: this.makeCityList
        });
    },
    handlerCityChange: function(e) {
        if (typeof this.props.onChange == "function") {
            let index = e.nativeEvent.target.selectedIndex;
            this.props.onChange({
                city: e.nativeEvent.target[index].text,
                city_id: e.target.value
            });
        }
    },
    render: function() {
        console.log('pc:'+this.props.city);
        if (this.props.rights) {
            var field = (<select className={'form-control'} onChange={this.handlerCityChange} value={this.props.city_id}>
                   {this.state.cities}
            </select>);
        } else {
            var field = <b>{this.props.city}</b>
        }
        return (
            <div className={this.props.className}>
                <label htmlFor="city">Город:</label>
                {field}
            </div>
        );
    }
});

module.exports=CitySelect;