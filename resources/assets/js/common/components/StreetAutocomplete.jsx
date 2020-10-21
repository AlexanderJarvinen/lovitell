import React, { PropTypes, Component } from 'react';
import Autocomplete from 'react-autocomplete';

export default class StreetAutocomplete extends Component {

    static propTypes = {
        onChange: PropTypes.func.isRequired
    };
    constructor(props) {
        super(props);
        this.state = {
            city: '',
            city_id: 0,
            region: '',
            region_id: 0,
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
    streetsDataReceived = (data) => {
        this.setState({
            streets: data,
            loading: false
        });
    };
    loadStreets = (value) => {
        value = value || '';
        if (this.props.city && this.props.region && value != '') {
            $.ajax({
                beforeSend: function (request) {
                    return request.setRequestHeader('X-CSRF-Token', $("meta[name='csrf-token']").attr('content'));
                },
                type: 'GET',
                url: '/inventory/ajax/streets/acmp/' + this.props.city + '/' + this.props.region + '/' + value,
                success: this.streetsDataReceived
            });
        }
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
    componentDidMount = () => {
        this.loadStreets();
    };
    componentWillReceiveProps = (np) => {
        this.loadStreets();
    };
    onSelect = (value, item) => {
        // set the menu to only the selected item
        this.setState({
            street_id: item.key,
            street: value
        });
        if (this.props.onChange != 'undefined') {
            this.props.onChange({
                street_id: item.key,
                street: value
            })
        }
        // or you could reset it to a default list again
        // this.setState({ unitedStates: getStates() })
    };
    render = () => {
        return (
            <div className={this.props.className}>
                <label htmlFor="city">Улица:</label>
                <Autocomplete
                    inputProps={{name: "Улица", id: "streets-autocomplete", className: "form-control"}}
                    wrapperStyle={{'display': 'block'}}
                    className="form-control"
                    ref="autocomplete"
                    value={this.state.street}
                    items={this.state.streets}
                    getItemValue={(item) => item.value}
                    onSelect={this.onSelect}
                    onChange={this.streetChange}
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