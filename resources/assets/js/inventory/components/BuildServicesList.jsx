import React, { PropTypes, Component } from 'react';
import ReactDOM from 'react-dom';

export default class BuildServicesList extends Component {
    static propTypes = {
        address_id: React.PropTypes.number.isRequired
    };

    getInitialState = () => {
        return {
            system: this.props.system || 0,
            to_all: false,
            templates: [],
            template: 0,
            loading: false
        };
    };
    getServices = () => {

    };
    componentDidMount = () => {
        this.getServices();
    };

};

ReactDOM.render(
    <APTemplateChange
        address_id={BuildingData.address_id}
    />,
    document.getElementById('change_template_wrap')
);