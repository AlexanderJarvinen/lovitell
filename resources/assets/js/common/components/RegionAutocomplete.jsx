import React, { PropTypes, Component } from 'react';
import Autocomplete from 'react-autocomplete';

export default class RegionAutocomplete extends Component {

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
            regions: [],
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
    regionsDataReceived = (data) => {
        this.setState({
            regions: data,
            loading: false
        });
    };
    loadRegions = (value) => {
        value = value || '';
        if (this.props.city && value != '') {
            $.ajax({
                beforeSend: function (request) {
                    return request.setRequestHeader('X-CSRF-Token', $("meta[name='csrf-token']").attr('content'));
                },
                type: 'GET',
                url: '/inventory/ajax/regions/acmp/' + this.props.city + '/' + value,
                success: this.regionsDataReceived
            });
        }
    };
    regionChange = (event, value) => {
        console.log(event);
        console.log(value);
        this.setState({region: value});
        if (this.props.onChange != 'undefined') {
            this.props.onChange({
                region: value
            })
        }
        if(value.length < 2) {
            return;
        }
        this.loadRegions(value);
    };
    componentDidMount = () => {
        this.loadRegions();
    };
    componentWillReceiveProps = (np) => {
        this.loadRegions();
    };
    onSelect = (value, item) => {
        // set the menu to only the selected item
        console.log(value);
        console.log(item);
        this.setState({
            region_id: item.key,
            region: value
        });
        if (this.props.onChange != 'undefined') {
            this.props.onChange({
                region_id: item.key,
                region: value
            })
        }
        // or you could reset it to a default list again
        // this.setState({ unitedStates: getStates() })
    };
    render = () => {
        console.log('Regions:');
        console.log(this.state.regions);
        return (
            <div className={this.props.className}>
                <label htmlFor="city">Район:</label>
                <Autocomplete
                    inputProps={{name: "Район", id: "cities-autocomplete", className: "form-control"}}
                    wrapperStyle={{'display': 'block'}}
                    className="form-control"
                    ref="autocomplete"
                    value={this.state.region}
                    items={this.state.regions}
                    getItemValue={(item) => item.value}
                    onSelect={this.onSelect}
                    onChange={this.regionChange}
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