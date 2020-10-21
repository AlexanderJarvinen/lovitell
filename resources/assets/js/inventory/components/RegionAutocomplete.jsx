import React, { PropTypes, Component } from 'react';
import Autocomplete from 'react-autocomplete';

export default class RegionAutocomplete extends Component {
    constructor(props) {
        super(props);
        this.state = {
            street: '',
            street_id: 0,
            streets: [],
            mode: 0
        }
    };
    styles = {
        item: {
            padding: '2px 6px',
            cursor: 'default'
        },

        highlightedItem: {
            color: 'white',
            background: 'hsl(200, 50%, 50%)',
            padding: '2px 6px',
            cursor: 'default'
        },

        menu: {
            border: 'solid 1px #ccc'
        }
    };

    loadStreets = (value) => {
        value = value || '';
        $.ajax({
            beforeSend: function (request) {
                return request.setRequestHeader('X-CSRF-Token', $("meta[name='csrf-token']").attr('content'));
            },
            type: 'POST',
            url: '/inventory/streets/',
            data: ({
                street: value,
                city_id: this.props.city_id,
                region_id: this.props.region_id
            }),
            success: this.streetDataReceived
        });
    };
    streetChange = (event, value) => {
        this.setState({street: value});
        if (this.props.onChange != 'undefined') {
            this.props.onChange({
                street: value
            })
        }
        if(value.length < 2) {
            return;
        }
        this.loadStreets(value);

    };
    makeCityList = (data) => {
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
    };
    componentDidMount = () => {
        this.updateCityData();
    };
    componentWillReceiveProps = (np) => {
        this.updateCityData();
    };
    handleCitySelect = (e, value) => {
        let index = e.nativeEvent.target.selectedIndex;
        let city_id = e.target.value;
        let city = e.nativeEvent.target[index].text;
        this.setState({
            city_id: city_id,
            city: city
        });
        if (this.props.onChange != 'undefined') {
            this.props.onChange({
                city_id: street_id,
                city: street_id==0?'':street
            })
        }
    };
    onSelect = (value, item) => {
        // set the menu to only the selected item
        console.log(value);
        let street = value.split(' - ');
        this.setState({
            city_id: street_id[0],
            city: street[0]
        });
        if (this.props.onChange != 'undefined') {
            this.props.onChange({
                city_id: street_id[0],
                city: street[0]
            })
        }
        // or you could reset it to a default list again
        // this.setState({ unitedStates: getStates() })
    },
    updateCityData = (value) => {
        let value = value || '';
        fetch('/inventory/ajax/cities/autocomplete/'+value,
            {
                method: 'GET',
                credentials: 'include'
            }
        )
            .then(response => response.json())
            .then(json => {
                this.setState({cities: json});
            });
    };
    render = () => {
        return (
            <div className={this.props.className}>
                <label htmlFor="city">Район:</label>
                <Autocomplete
                    inputProps={{name: "Город", id: "cities-autocomplete"}}
                    ref="autocomplete"
                    value={this.state.city}
                    items={this.state.cities}
                    getItemValue={(item) => item.value}
                    onSelect={this.onSelect}
                    onChange={this.cityChange}
                    renderItem={(item, isHighlighted) => (
                                <div
                                    style={isHighlighted ? styles.highlightedItem : styles.item}
                                    key={item.key}
                                    id={item.key}
                                >{item.value}</div>
                            )}
                    />
            </div>
        );
    }
};