var $ = require('jquery');
var React = require('react');

var BuildString = React.createClass({
    handleChange: function(e) {
        if (typeof this.props.onChange) {
            this.props.onChange(e.target.value);
        }
    },
    render: function() {
        if (this.props.street_id == 0) return null;
        return (
            <div className={this.props.className}>
                <label htmlFor="region">Дом:</label>
                <input value={this.props.build} onChange={this.handleChange} />
            </div>
        );
    }
});

module.exports=BuildString;