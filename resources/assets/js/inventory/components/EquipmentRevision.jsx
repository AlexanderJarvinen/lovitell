var $ = require('jquery');
var React = require('react');
var ReactDOM = require('react-dom');
var classNames = require('classnames');
var FileLoader = require('./FileLoader');

var EquipmentRevision = React.createClass({
    propTypes: {
        address_id: React.PropTypes.number.isRequired
    },
    getInitialState: function () {
        return {};
    },
    render: function() {
        return (
            <div className="equipment_revision">
                <h3>Сверка оборудования</h3>
                <FileLoader
                    url="/inventory/ajax/revision/load"
                    filename="revision"
                />
            </div>
        )
    }
});

ReactDOM.render(
    <EquipmentRevision
        address_id={BuildingData.address_id}
    />,
    document.getElementById('revision_wrap')
);