import React, { PropTypes, Component } from 'react';
import classNames from 'classnames';
import AppStore from '../stores/AppStore.js';
import MaskedInput from 'react-maskedinput';
import * as TextFieldTypes from '../../common/constants/TextFieldType.js';

export default class SwitchButton extends Component {
    static PropTypes = {
        state: PropTypes.bool,
        label: PropTypes.string,
    };
    handleChange = () => {
        this.props.onChange(!this.props.state);
    };
    render = () => {
        let on_cn = classNames('btn', 'btn-xs', {'btn-default':!this.props.state, 'btn-primary':this.props.state, 'active': this.props.state});
        let off_cn = classNames('btn', 'btn-xs', {'btn-default':!this.props.state, 'btn-primary':!this.props.state, 'active': !this.props.state});
        return (
                <div class="btn-group btn-toggle">
                    <label>{this.props.label}: </label>
                    <div>
                        <button className={on_cn} onClick={this.handleChange}>ON</button>
                        <button className={off_cn} onClick={this.handleChange}>OFF</button>
                    </div>
                </div>
        )
    };
};
