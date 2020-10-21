var $ = require('jquery');
var React = require('react');
var classNames = require('classnames');
import Multiselect from 'react-bootstrap-multiselect';

var LocationSelect = React.createClass({
    getDefaultProps: function() {
        return {
            check_rights: true
        }
    },
    getInitialState: function() {
        return {
            location_id: this.props.location_id,
            location_desk: this.props.location_desk,
            locations: [],
            rights: false
        }
    },
    makeLocationList: function(data) {
        if (data.error == 0) {
            let locations = [];
            locations.push({
                value:0,
                label:'Не выбрана',
                selected: !this.props.location_id
            });
            for (var i = 0; i < data.data.length; i++) {
                var option = data.data[i];
                locations.push({
                    value: option.id,
                    label: option.desk,
                    selected: option.id == this.props.location_id
                });
            }
            this.setState({
                rights: true,
                locations: locations
            });
        } else {
            this.setState({
                rights: false
            })
        }
    },
    getLocationList: function() {
        $.ajax({
            type: 'GET',
            url: '/inventory/ajax/locations/',
            success: this.makeLocationList
        });
    },
    componentDidMount: function() {
        this.getLocationList();
    },
    componentWillReceiveProps(np) {
        if (this.props.location_id != np.location_id && this.state.rights) {
            this.getLocationList();
        }
    },
    handlerLocationChange: function(e) {
        if (typeof this.props.onChange == "function") {
            this.props.onChange({
                location_desk: e.text(),
                location_id: e.val()
            });
        }
    },
    render: function() {
        let style = classNames(
            'inputrow',
            'location-select',
            {'changed': this.props.state==1},
            {'cansave': this.props.state==2},
            {'saved': this.props.state==3},
            {'error': this.props.state==-1}
        );
        if (this.state.rights) {
            var field = (<Multiselect
                enableFiltering={true}
                onChange={this.handlerLocationChange}
                data={this.state.locations}
                multiple={false}
                enableCaseInsensitiveFiltering={true}
              />);
        } else {
            var field = <b>{this.props.location_desk}</b>
        }
        return (
            <div className={style}>
                <label htmlFor="city">Локация:</label>
                {field}
            </div>
        );
    }
});

module.exports=LocationSelect;