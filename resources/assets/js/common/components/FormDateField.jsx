import React, { PropTypes, Component } from 'react';
import classNames from 'classnames';
import AppStore from '../stores/AppStore.js';
import MaskedInput from 'react-maskedinput';
import HelpTooltip from '../../common/components/HelpTooltip';
import * as TextFieldTypes from '../../common/constants/TextFieldType.js';
import DatePicker from 'react-datepicker';
import moment from 'moment';

export default class FormDateField extends Component {
    static PropTypes = {
        value: PropTypes.string.isRequired,
        label: PropTypes.string.isRequired,
        disabled: PropTypes.bool,
        help: PropTypes.string,
        onChange: function (props, propName, componentName) {
            if (!('disabled' in props)) {
                if (!(propName in props)) {
                    throw new Error(propName + " must be set if disabled is false");
                } else {
                    if (typeof props[propName] != 'func') {
                        throw new Error(propName + " mast be a func, but " + (typeof props[propName]) + " is given");
                    }
                }
            }
        },
        requires: PropTypes.bool,
        state: PropTypes.number,
        msg: PropTypes.string
    };
    static defaultProps = {
        state: 0,
        msg: ''
    };
    onChange = (date) => {
        this.props.onChange({
            value: (date) ? date.format('YYYY-MM-DD') : '',
            state: 1,
            msg: ''
        });
    };
    renderClass = (state) => {
        return classNames(
            'form-group',
            {'has-error': state == -2},
            {'has-warning': state == -1},
            {'has-success': state == 2}
        );
    };
    renderIcon = (state) => {
        switch (state) {
            case 2:
                return <i className="fa fa-check"></i>;
            case -1:
                return <i className="fa fa-bell-o"></i>;
            case -2:
                return <i className="fa fa-times-circle-o"></i>;
        }
    };
    render = () => {
        return (
            <div className={this.renderClass(this.props.state)}>
                <label>
                    {this.renderIcon(this.props.state)} {this.props.label}
                    {this.props.help?
                        <HelpTooltip>
                            <div>{this.props.help}
                            {this.props.fieldType?
                                <p>{TextFieldTypes[this.props.fieldType].error}</p>
                                :
                                ''
                            }
                            {this.props.required?
                                <p>Поле обязательно к заполнению</p>
                                :
                                ''
                            }
                            </div>
                        </HelpTooltip>
                        :
                        ''
                    }
                    :
                </label>
                {this.props.disabled?
                    <div className="form-control">
                        {this.props.value}

                    </div>
                    :
                      <DatePicker
                        dateFormat="YYYY-MM-DD"
                        selected={this.props.value != ''? moment(this.props.value, 'YYYY-MM-DD'):''}
                        onChange={this.onChange}
                        isClearable={true}
                        placeholderText={''}
                        className={'form-control'}
                        />
                }
                {this.props.msg !='' ?
                    <span className="help-block">{this.props.msg}</span>
                    :
                    null
                }
            </div>
        )
    };
};
