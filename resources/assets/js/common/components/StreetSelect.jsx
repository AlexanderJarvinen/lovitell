var $ = require('jquery');
var React = require('react');
var Autocomplete = require('react-autocomplete');

var styles = {
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
}

var StreetSelect = React.createClass({
    getInitialState: function() {
        return {
            city_id: this.props.city_id || 0,
            region_id: this.props.region_id || 0,
            street: this.props.street,
            street_id: 0,
            streets: [],
            mode: 0
        }
    },
    makeStreetList: function(data) {
        this.setState(data);
    },
    streetDataReceived: function(data) {
        this.setState({
            streets: data,
            loading: false,
        })
    },
    loadStreets: function(value) {
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
    },
    streetChange: function(event, value) {
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

    },
    checkRegion: function() {
        if (this.props.region_id == 0 && !(this.props.city_id && this.props.skip_region)) {
            this.setState({mode: 0});
        } else {
            this.setState({mode: 1},
                this.loadStreets);
        }
    },
    componentWillReceiveProps: function(nextProps) {
        if (this.state.region_id != nextProps.region_id || this.state.city_id != nextProps.city_id) {
            this.setState({
                street: nextProps.street || '',
                street_id: nextProps.street_id || 0,
                streets: [],
                region_id: nextProps.region_id,
                city_id: nextProps.city_id
            }, this.checkRegion);
        }
    },
    handleReset: function() {
        this.setState({
            street: '',
            street_id: 0,
            streets: []
        });
    },
    handleModeChange: function() {
        this.setState({
            mode: 0,
            streets: []
        })
    },
    handleStreetSelect: function(e, value) {
        let index = e.nativeEvent.target.selectedIndex;
        let street_id = e.target.value;
        let street = e.nativeEvent.target[index].text;
        this.setState({
            street_id: street_id,
            street: street_id==0?'':street
        })
        if (this.props.onChange != 'undefined') {
            this.props.onChange({
                street_id: street_id,
                street: street_id==0?'':street
            })
        }
    },
    onSelect: function(value, item) {
        // set the menu to only the selected item
        let street_id = item.key.split('-');
        let street = value.split(' - ');
        this.setState({
            street_id: street_id[2],
            street: street[2]?street[2]:value,
            region_id: street_id[1],
            city_id: street_id[0],
            city: street[0]
        });
        if (this.props.onChange != 'undefined') {
            this.props.onChange({
                city_id: street_id[0],
                region_id: street_id[1],
                street_id: street_id[2],
                street: street[2]?street[2]:value,
                city: street[0]
            })
        }
        // or you could reset it to a default list again
        // this.setState({ unitedStates: getStates() })
    },
    render: function() {
        if (false && this.props.region_id == 0) return null;
        let menuStyle={
            borderRadius: '3px',
            boxShadow: '0 2px 12px rgba(0, 0, 0, 0.1)',
            background: 'rgba(255, 255, 255, 0.9)',
            padding: '2px 0',
            fontSize: '90%',
            position: 'fixed',
            width: '400px',
            overflow: 'auto',
            maxHeight: '50%' // TODO: don't cheat, let it flow to the bottom
        };
        if (this.props.fixModal) {
            let ac = $("streets-autocomplete-modal");
            if (ac) {
                menuStyle.left = (parseInt(ac.offsetLeft)+parseInt(window.scrollX))+'px';
                menuStyle.top = (parseInt(ac.offsetTop)+parseInt(ac.offsetHeight)+parseInt(window.scrollX))+'px';
            }
        };
        var field = null;
        if (this.props.rights) {
            if (this.state.mode) {
                let street_list = [];
                for (var i = 0; i < this.state.streets.length; i++) {
                    var option = this.state.streets[i];
                    street_list.push(
                        <option key={i+1} value={option.key}>{option.value}</option>
                    );
                }
                field=(
                    <span>
                        <select value={this.state.street_id} onChange={this.handleStreetSelect}>
                        {street_list}
                        </select>
                        <i className={'icon fa fa-pencil-square-o'} onClick={this.handleModeChange}>&nbsp;</i>
                    </span>);
            } else {
                let helper = null;
                if (this.state.street != '') {
                    helper = (<i className={'icon clear_btn fa fa-times'} onClick={this.handleReset}>&nbsp;</i>);
                }
                field = (
                    <span>
                        <Autocomplete
                            inputProps={{name: "Улица", id: "streets-autocomplete"+(this.props.fixModal?'-modal':''), className: "streets-autocomplete"}}
                            ref="autocomplete"
                            value={this.state.street}
                            items={this.state.streets}
                            getItemValue={(item) => item.value}
                            onSelect={this.onSelect}
                            onChange={this.streetChange}
                            menuStyle={menuStyle}
                            renderItem={(item, isHighlighted) => (
                                <div
                                    style={isHighlighted ? styles.highlightedItem : styles.item}
                                    key={item.key}
                                    id={item.key}
                                >{item.value}</div>
                            )}
                        />{helper}</span>
                );
            }
        } else {
            var field = <b>{this.props.street}</b>
        }
        return (
            <div className={this.props.className}>
                <label htmlFor="street">Улица:</label>
                {field}
            </div>
        )
    }
});

module.exports=StreetSelect;