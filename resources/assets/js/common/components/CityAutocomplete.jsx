import React, { PropTypes, Component } from 'react';
import Autocomplete from 'react-autocomplete';

export default class CityAutocomplete extends Component {

    static propTypes = {
        onChange: PropTypes.func.isRequired
    };
    constructor(props) {
        super(props);
        this.state = {
            city: '',
            city_id: 0,
            cities: [],
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
    cityDataReceived = (data) => {
        this.setState({
            cities: data,
            loading: false
        });
    };
    loadCities = (value) => {
        value = value || '';
        $.ajax({
            beforeSend: function (request) {
                return request.setRequestHeader('X-CSRF-Token', $("meta[name='csrf-token']").attr('content'));
            },
            type: 'GET',
            url: '/inventory/ajax/cities/acmp/'+value,
            success: this.cityDataReceived
        });
    };
    cityChange = (event, value) => {
        this.setState({city: value});
        if (this.props.onChange != 'undefined') {
            this.props.onChange({
                city: value
            })
        }
        this.loadCities(value);
    };
    componentDidMount = () => {
        this.updateCityData();
    };
    componentWillReceiveProps = (np) => {
        this.updateCityData();
    };
    onSelect = (value, item) => {
        // set the menu to only the selected item
        console.log(value);
        console.log(item);
        this.setState({
            city_id: item.key,
            city: value
        });
        if (this.props.onChange != 'undefined') {
            this.props.onChange({
                city_id: item.key,
                city: value
            })
        }
        // or you could reset it to a default list again
        // this.setState({ unitedStates: getStates() })
    };
    updateCityData = (value) => {
        console.log(value);
        value = value || '';
        if (value != '') {
            fetch('/inventory/ajax/cities/acmp/' + value,
                {
                    method: 'GET',
                    credentials: 'include'
                }
            )
                .then(response => response.json())
                .then(json => {
                    this.setState({cities: json});
                });
        }
    };
    render = () => {
        console.log('Cities:');
        console.log(this.state.cities);
        return (
            <div className={this.props.className}>
                <label htmlFor="city">Город:</label>
                <Autocomplete
                    inputProps={{name: "Город", id: "cities-autocomplete", className: "form-control"}}
                    className="form-control"
                    wrapperStyle={{'display': 'block'}}
                    ref="autocomplete"
                    value={this.state.city}
                    items={this.state.cities}
                    getItemValue={(item) => item.value}
                    onSelect={this.onSelect}
                    onChange={this.cityChange}
                    renderItem={(item, isHighlighted) => (
                                <div
                                    style={isHighlighted ? this.styles.highlightedItem : this.styles.item}
                                    key={item.key}
                                    id={item.key}
                                >{item.value}</div>
                            )}
                    />
            </div>
        );
    }
};