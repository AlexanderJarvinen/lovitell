var $ = require('jquery');
var React = require('react');
var ReactDOM = require('react-dom');
var Modal = require('react-modal');
var classNames = require('classnames');
var AppActions = require('../../common/actions/AppActions.js');
var CitySelect = require('./CitySelect.jsx');
var RegionSelect = require('./RegionSelect.jsx');
var StreetSelect = require('./StreetSelect.jsx');
var BuildSelect = require('./BuildSelect.jsx');
var BuildString = require('./BuildString.jsx');

var Inbuild = React.createClass({
    getDefaultProps: function() {
        return {
            skipEntrance: false,
            skipFloor: false,
            search: false
        }
    },
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
        if (this.props.rights || this.props.search) {
            var entr_field=(<input name="entrance" type="text" value={this.props.entrance} onChange={this.entranceChange}/>);
            var floor_field=(<input name="floor" type="text" value={this.props.floor} onChange={this.floorChange}/>);
            var apartment_field=(<input name="apartment" type="text" value={this.props.apartment} onChange={this.apartmentChange}/>);
        } else {
            var entr_field=(<b>{this.props.entrance}</b>);
            var floor_field=(<b>{this.props.floor}</b>);
            var apartment_field=(<b>{this.props.apartment}</b>)
        }
        var entrance,
            floor,
            appartment = null;
        if (this.state.accuracy>1 && !this.props.skipEntrance) {
            entrance = ( <div className={this.props.className}>
                <label htmlFor="entrance">Подъезд:</label>
                   {entr_field}
            </div>);
        }
        if (this.state.accuracy>2 && !this.props.skipFloor) {
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

var AddressSelector = React.createClass({
    propTypes: {
        search: React.PropTypes.bool,
        skip_region: React.PropTypes.bool,
        onCityChange: React.PropTypes.func,
        onRegionChange: React.PropTypes.func,
        onStreetChange: React.PropTypes.func,
        onlyStreet: React.PropTypes.bool,
        skipEntrance: React.PropTypes.bool
    },
    getDefaultProps: function() {
        return {
            skipFloor: false,
            skipEntrance: false,
            onlyStreet: false
        }
    },
    getInitialState: function() {
        let accuracy = 4;
        if (typeof this.props.accuracy != 'undefined') {
            accuracy = this.props.accuracy;
        };
        return {
            address_id: this.props.address_id || 0,
            construction_type: 1,
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

    },
    applyAddressRights: function(r) {
        this.setState({rights: r});
    },
    checkRights: function() {
        $.ajax({
            type: 'GET',
            url: '/inventory/ajax/checkrights/address/change',
            success: this.applyAddressRights
        });
    },
    initAddressInfo: function(data) {
        if (data.error == 0) {
            this.setState({
                    city: data.address.city,
                    city_id: data.address.city_id,
                    region: data.address.region,
                    region_id: data.address.region_id,
                    street: data.address.street,
                    street_id: data.address.street_id,
                    build:data.address.build,
                    construction_type:data.address.construction_type
                },
                AppActions.cancelLoading
            );
        } else {
            AppActions.throwError({code: data.error, msg: data.error_msg});
        }
    },
    updateAddressId:function(address_id) {
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
                street: '',
                construction_type: 1
            });
        }
    },
    componentDidMount: function() {
        if (!this.state.search && this.props.check_rights) {
            this.checkRights();
        } else {
            this.setState({rights: true});
        }
        if (typeof this.props.address_id != "undefined" && this.props.address_id != 0) {
            this.updateAddressId(this.props.address_id);
        }
    },
    componentWillReceiveProps: function(np) {
        if (np.address_id != this.props.address_id) {
            this.setState({
                address_id: np.address_id,
                construction_type: 1,
                floor: np.floor,
                entrance: np.entrance,
                apartment: np.apartment
            });
            this.updateAddressId(np.address_id)
        }
    },
    CityChange: function(city) {
        this.setState({
            city_id: city.city_id,
            city:city.city,
            region_id: 0,
            street: '',
            street_id: 0,
            address_id: 0,
            build: '',
            construction_type: 1,
            entrance: ''
        }, this.AddressChange);
    },
    RegionChange: function(region) {
        console.log(region);
        this.setState({
            region: region.region,
            region_id: region.region_id,
            street: '',
            street_id: 0,
            address_id: 0,
            build: '',
            construction_type: 1,
            entrance: ''
        }, this.AddressChange);
    },
    StreetChange: function(street) {
        console.log('Street change');
        console.log(street);
        this.setState(Object.assign(street, {address_id:0}), this.AddressChange);
    },
    AddressIdChange: function(address) {
        console.log(address);
        this.setState({
            address_id: address.id,
            construction_type: address.construction_type
        },
        this.AddressChange);
    },
    BuildChange: function(build) {
        let info = build
        this.setState({
            build: build,
            entrance: ''
        },
        this.AddressChange);
    },
    AddressChange: function() {
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
                apartment: this.state.apartment,
                construction_type: this.state.construction_type
            });
        }
    },
    entranceChange: function(entrance) {
        this.setState({entrance: entrance}, this.AddressChange)
    },
    floorChange: function(floor) {
        this.setState({floor: floor}, this.AddressChange);
    },
    apartmentChange: function(apartment) {
        this.setState({apartment: apartment}, this.AddressChange);
    },
    render: function() {
        let address_class = classNames('build', 'inputrow', {'changed': this.props.state==1}, {'cansave': this.props.state==2}, {'saved': this.props.state==3}, {'error': this.props.state==-1});
        let build = null;
        if (this.state.accuracy > 0) {
            if (!this.state.search) {
                build = (<BuildSelect
                    region_id={this.state.region_id}
                    street_id={this.state.street_id}
                    address_id={this.props.address_id}
                    build={this.state.build}
                    construction_type={this.state.construction_type}
                    className={address_class}
                    onChange={this.AddressIdChange}
                    rights={this.state.rights}
                    consType={this.props.consType}
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
        let region=null;
        if ((typeof this.props.skip_region == 'undefined' ||
            !this.props.skip_region) && !this.props.onlyStreet ) {
            region = (
                <RegionSelect
                    city_id={this.state.city_id}
                    region={this.state.region}
                    region_id={this.state.region_id}
                    className={address_class}
                    onChange={this.RegionChange}
                    rights={this.state.rights}
                />
            )
        }
        return (
            <div className="address_selector">
                {!this.props.onlyStreet ?
                    <CitySelect
                        city_id={this.state.city_id}
                        city={this.state.city}
                        onChange={this.CityChange}
                        className={address_class}
                        rights={this.state.rights}
                        />
                    :
                    null
                }
                {region}
                <StreetSelect
                    city_id={this.state.city_id}
                    region_id={this.state.region_id}
                    street_id={this.state.street_id}
                    street={this.state.street}
                    className={address_class}
                    onChange={this.StreetChange}
                    rights={this.state.rights}
                    skip_region={this.props.skip_region}
                    fixModal={this.props.fixModal}
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
                    skipEntrance={this.props.skipEntrance}
                    skipFloor={this.props.skipFloor}
                    search={this.state.search}
                />
            </div>
        )
    }
});

module.exports=AddressSelector;

