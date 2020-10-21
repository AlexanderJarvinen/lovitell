import React, { PropTypes, Component } from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';
var AppActions = require('../../common/actions/AppActions.js');
import CityAutocomplete from './CitySelect.jsx';
import RegionAutocomplete from './RegionSelect.jsx';
import StreetAutocomplete from './StreetSelect.jsx';
var BuildSelect = require('./BuildSelect.jsx');
var BuildString = require('./BuildString.jsx');

var Inbuild = React.createClass({
    getInitialState: function() {
        return {
            accuracy: this.props.accuracy
        }
    },
    entranceChange: function(e) {
        this.props.entranceChange(e.target.value);
    },
    floorChange: function(e) {
        this.props.floorChange(e.target.value);
    },
    apartmentChange: function(e) {
        this.props.apartmentChange(e.target.value);
    },
    render: function() {
        if (this.props.address_id == 0 && this.props.build == '' ||
            this.state.accuracy==0) return null;
        if (this.props.rights) {
            var entr_field=(<input className={'form-control'} name="entrance" type="text" value={this.props.entrance} onChange={this.entranceChange}/>);
            var floor_field=(<input className={'form-control'} name="floor" type="text" value={this.props.floor} onChange={this.floorChange}/>);
            var apartment_field=(<input className={'form-control'} name="apartment" type="text" value={this.props.apartment} onChange={this.apartmentChange}/>);
        } else {
            var entr_field=(<b>{this.props.entrance}</b>);
            var floor_field=(<b>{this.props.floor}</b>);
            var apartment_field=(<b>{this.props.apartment}</b>)
        }
        var entrance,
            floor,
            appartment = null;
        if (this.state.accuracy>1) {
            entrance = ( <div className={this.props.className}>
                <label htmlFor="entrance">Подъезд:</label>
                   {entr_field}
            </div>);
        }
        if (this.state.accuracy>2) {
            floor = (<div className={this.props.className}>
                <label htmlFor="floor">Этаж:</label>
                   {floor_field}
            </div>)
        }
        if (this.state.accuracy>3) {
            appartment = (
                <div className={this.props.className}>
                    <label htmlFor="floor">Квартира:</label>
                   {apartment_field}
                </div>
            )
        }
        return (
           <div className="inbuild">
               {entrance}
               {floor}
               {appartment}
           </div>
       )
    }
});

export default class AddressSelectorAutocomplete extends Component {
    propTypes: {
        search: React.PropTypes.bool,
        skip_region: React.PropTypes.bool,
        onCityChange: React.PropTypes.func,
        onRegionChange: React.PropTypes.func,
        onStreetChange: React.PropTypes.func
    };
    constructor(props) {
        super(props);
        let accuracy = 4;
        if (typeof this.props.accuracy != 'undefined') {
            accuracy = this.props.accuracy;
        };
        this.state = {
            ddress_id: this.props.address_id || 0,
            city: '',
            city_id: 0,
            region: '',
            region_id: 0,
            street: '',
            street_id: 0,
            build: '',
            floor: this.props.floor,
            entrance: this.props.entrance,
            apartment: this.props.apartment,
            rights: false,
            search: this.props.search || false,
            accuracy: accuracy
        }
    };

    applyAddressRights = (r) => {
        this.setState({rights: r});
    };

    checkRights = () => {
        $.ajax({
            type: 'GET',
            url: '/inventory/ajax/checkrights/address/change',
            success: this.applyAddressRights
        });
    };

    initAddressInfo = (data) => {
        if (data.error == 0) {
            this.setState({
                    city: data.address.city,
                    city_id: data.address.city_id,
                    region: data.address.region,
                    region_id: data.address.region_id,
                    street: data.address.street,
                    street_id: data.address.street_id,
                    build:data.address.build
                },
                AppActions.cancelLoading
            );
        } else {
            AppActions.throwError({code: data.error, msg: data.error_msg});
        }
    };

    updateAddressId = (address_id) => {
        if(address_id) {
            $.ajax({
                before: AppActions.initLoading,
                type: 'GET',
                url: '/inventory/ajax/get-address-info/' + address_id,
                success: this.initAddressInfo
            })
        } else {
            this.setState({
                city_id: 0,
                city:'',
                region_id: 0,
                region: '',
                street_id: 0,
                street: ''
            });
        }
    };

    componentDidMount = () => {
        if (!this.state.search && this.props.check_rights) {
            this.checkRights();
        } else {
            this.setState({rights: true});
        }
        if (typeof this.props.address_id != "undefined" && this.props.address_id != 0) {
            this.updateAddressId(this.props.address_id);
        }
    };

    componentWillReceiveProps = (np) => {
        if (np.address_id != this.props.address_id) {
            this.setState({
                address_id: np.address_id,
                floor: np.floor,
                entrance: np.entrance,
                apartment: np.apartment
            });
            this.updateAddressId(np.address_id)
        }
    };
    cityChange = (city) => {
        this.setState({
            city_id: city.city_id,
            city:city.city,
            region_id: 0,
            street: '',
            street_id: 0,
            address_id: 0,
            build: '',
            entrance: ''
        }, this.AddressChange);
    };
    regionChange = (region) => {
        this.setState({
            region: region.region,
            region_id: region.region_id,
            street: '',
            street_id: 0,
            address_id: 0,
            build: '',
            entrance: ''
        }, this.AddressChange);
    };
    streetChange = (street) => {
        this.setState(Object.assign(street, {address_id:0}), this.AddressChange);
    };
    addressIdChange = (address_id) => {
        this.setState({
            address_id: address_id
        },
        this.AddressChange);
    };
    buildChange = (build) => {
        this.setState({
            build: build,
            entrance: ''
        },
        this.AddressChange);
    };
    addressChange = () => {
        if (typeof this.props.onCityChange != 'undefined') {
            this.props.onCityChange({city: this.state.city, city_id: this.state.city_id});
        }
        if (typeof this.props.onRegionChange != 'undefined') {
            this.props.onRegionChange({region: this.state.region, region_id: this.state.region_id});
        }
        if (typeof this.props.onStreetChange != 'undefined') {
            this.props.onStreetChange({street: this.state.street, street_id:this.state.street_id});
        }
        if (typeof this.props.onBuildChange != 'undefined') {
            this.props.onBuildChange(this.state.build);
        }
        if (typeof this.props.onChange != 'undefined') {
            this.props.onChange({
                address_id: this.state.address_id,
                floor: this.state.floor,
                entrance: this.state.entrance,
                apartment: this.state.apartment
            });
        }
    };
    entranceChange = (entrance) => {
        this.setState({entrance: entrance}, this.addressChange)
    };
    floorChange = (floor) => {
        this.setState({floor: floor}, this.addressChange);
    };
    apartmentChange = (apartment) => {
        this.setState({apartment: apartment}, this.addressChange);
    };
    render = () => {
        let address_class = classNames('build', 'form-group', {'changed': this.props.state==1}, {'cansave': this.props.state==2}, {'saved': this.props.state==3}, {'error': this.props.state==-1});
        let build = null;
        if (this.state.accuracy > 0) {
            console.log(this.state.search);
            if (!this.state.search) {
                build = (<BuildSelect
                    region_id={this.state.region_id}
                    street_id={this.state.street_id}
                    address_id={this.props.address_id}
                    build={this.state.build}
                    className={address_class}
                    onChange={this.AddressIdChange}
                    rights={this.state.rights}
                />);
            } else {
                build = (
                    <BuildString
                        build={this.state.build}
                        street_id={this.state.street_id}
                        className={address_class}
                        onChange={this.BuildChange}
                    />
                )
            }
        }
        return (
            <div className="address_selector">
                <CityAutocomplete
                    city_id={this.state.city_id}
                    city={this.state.city}
                    onChange={this.cityChange}
                    className={address_class}
                    rights={this.state.rights}
                />
                <RegionAutocomplete
                    city_id={this.state.city_id}
                    city={this.state.city}
                    region_id={this.state.city_id}
                    region={this.state.city}
                    rights={this.state.rights}
                    onChange={this.cityChange}
                    className={address_class}
                    rights={this.state.rights}
                    />
                <StreetSelect
                    city_id={this.state.city_id}
                    region_id={this.state.region_id}
                    street_id={this.state.street_id}
                    street={this.state.street}
                    className={address_class}
                    onChange={this.StreetChange}
                    rights={this.state.rights}
                    skip_region={this.props.skip_region}
                />
                {build}
                <Inbuild
                    address_id={this.state.address_id}
                    build={this.state.build}
                    entrance={this.state.entrance}
                    floor={this.state.floor}
                    apartment={this.state.apartment}
                    floorChange={this.floorChange}
                    entranceChange={this.entranceChange}
                    apartmentChange={this.apartmentChange}
                    className={address_class}
                    rights={this.state.rights}
                    accuracy={this.state.accuracy}
                />
            </div>
        )
    }
};

