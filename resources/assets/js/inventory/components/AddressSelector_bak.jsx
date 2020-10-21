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

var Inbuild = React.createClass({
   render: function() {
       if (this.props.address_id == 0) return null;
       return(
           <div className="inbuild">
               <div className="entrance inputrow">
                   <label htmlFor="entrance">Подъезд:</label>
                   <input name="entrance" value={this.props.entrance} onChange={this.props.entranceChange}/>
               </div>
               <div className="floor inputrow">
                   <label htmlFor="city">Этаж:</label>
                   <input name="floor" value={this.props.floor} onChange={this.props.floorChange}/>
               </div>
               <div className="apartment inputrow">
                   <label htmlFor="city">Квартира:</label>
                   <input name="apartment" value={this.props.apartment} onChange={this.props.apartmentChange}/>
               </div>
           </div>
       )
   }
});

var AddressSelector = React.createClass({
    getInitialState: function() {
        console.log(this.props.address_id || 0);
        return {
            address_id: this.props.address_id,
            city_id: this.props.city_id,
            region_id: this.props.region_id,
            street_id: this.props.street_id,
            floor: this.props.floor,
            entrance: this.props.entrance,
            apartment: this.props.apartment
        }
    },
    initAddressInfo: function(data) {
        if (data.error == 0) {
            this.setState({
                    city_id: data.city_id,
                    region_id: data.region_id,
                    street_id: data.street_id
                },
                AppActions.cancelLoading
            );
        } else {
            AppActions.throwError({code: data.error, msg: data.error_msg});
        }
    },
    componentDidMount: function() {
        if (typeof this.props.address_id != "undefined" && this.props.address_id != 0) {
            $.ajax({
               before: AppActions.initLoading,
               type: 'GET',
               url: '/inventory/ajax/get-address-info/' + this.props.address_id,
               success: this.initAddressInfo
            })
        }
    },
    componentWillReceiveProps: function(np) {
        if (np.address_id != this.state.address_id && np.address_id != 0) {
            $.ajax({
                before: AppActions.initLoading,
                type: 'GET',
                url: '/inventory/ajax/get-address-info/' + this.props.address_id,
                success: this.initAddressInfo
            })
        }
    },
    CityChange: function(city_id) {
        this.setState({
            city_id: city_id
        });
    },
    RegionChange: function(region_id) {
        this.setState({
            region_id: region_id
        });
    },
    StreetChange: function(street_id) {
        console.log("street_id="+street_id);
        this.setState({
            street_id: street_id
        });
    },
    BuildChange: function(address_id) {
        this.setState({
            address_id: address_id
        }, this.AddressChange);
    },
    AddressChange: function() {
        console.log('AddressChange');
    },
    render: function() {
        return (
            <div className="address_selector">
                <CitySelect
                    city_id={this.state.city_id}
                    onChange={this.CityChange}
                />
                <RegionSelect
                    city_id={this.state.city_id}
                    region_id={this.state.region_id}
                    onChange={this.RegionChange}
                />
                <StreetSelect
                    region_id={this.state.region_id}
                    street_id={this.state.street_id}
                    onChange={this.StreetChange}
                />
                <BuildSelect
                    region_id={this.state.region_id}
                    street_id={this.state.street_id}
                    address_id={this.state.address_id}
                    onChange={this.BuildChange}
                />
                <Inbuild
                    address_id={this.state.address_id}
                    entrance={this.state.entrance}
                    floor={this.state.floor}
                    appartment={this.state.appartment}
                    entranceChange={(e)=>{
                        this.setState({entrance:e.target.value},
                        this.propsAddressChange
                        )}}
                    floorChange={(e)=>{
                        this.setState({floor:e.target.value},
                        this.propsAddressChange
                        )}}
                    apartmentChange={(e)=>{
                        this.setState({apartment:e.target.value},
                        this.propsAddressChange
                        )}}
                />
            </div>
        )
    }
});

module.exports=AddressSelector;

