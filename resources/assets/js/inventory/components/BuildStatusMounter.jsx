var $ = require('jquery');
var React = require('react');
var ReactDOM = require('react-dom');
var Modal = require('react-modal');
var classNames = require('classnames');
var BuildStatusSelect = require('./BuildStatusSelect');

ReactDOM.render(
    <BuildStatusSelect
        address_id={BuildingData.address_id}
        build_status={BuildingData.build_status}
        build_statuses={BuildingData.build_statuses}
        build_status_desk={BuildingData.build_status_desk}
    />,
    document.getElementById('build-status-wrap')
);
