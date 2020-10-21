import React, { PropTypes, Component } from 'react';
import classNames from 'classnames';
import AppStore from '../stores/AppStore.js';
import MaskedInput from 'react-maskedinput';
import HelpTooltip from '../../common/components/HelpTooltip';
import * as TextFieldTypes from '../../common/constants/TextFieldType.js';

export default class FormSelectField extends Component {
    static PropTypes = {
        data: PropTypes.string.isRequired,
        value: PropTypes.string,
        label: PropTypes.string.isRequired,
        defaultProp: PropTypes.string,
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
        required: PropTypes.bool,
        requiredMsg: PropTypes.string,
        state: PropTypes.number,
        msg: PropTypes.string,
        keyName: PropTypes.string,
        keyDescr: PropTypes.string,
        placeholder: PropTypes.string
    };
    static defaultProps = {
        state: 0,
        msg: '',
        defaultProp: 0,
        requiredMsg: 'Поле обязательно к выбору',
        keyName: 'value',
        keyDescr: 'descr',
        disabled: false,
        placeholder: null
    };
    onChange = (e) => {
        if (e.target.value == this.props.defaultProp && this.props.required) {
            this.props.onChange({
                value: e.target.value,
                state: -2,
                msg: this.props.requiredMsg
            });
        } else {
            this.props.onChange({
                value: e.target.value,
                state: 1,
                msg: ''
            });
        }
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
        let {state, label, help, required, disabled, value, data, onChange, keyDescr, keyName} = this.props;
        let selected = '';
        if(disabled) {
            let selectedElement
            if (selectedElement = data.find((el)=>{return el[keyName] === value})) {
                selected = selectedElement[keyDescr];
            }
        }
        return (
            <div className={this.renderClass(state)}>
                <label>
                    {this.renderIcon(state)} {label}
                    {help?
                        <HelpTooltip>
                            <div>{help}
                            {required?
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
                {disabled?
                <div className="form-control">
                    {selected}
                </div>
                :
                    <select
                        className="form-control"
                        value={this.props.value}
                        onChange={this.onChange}>
                        {this.props.placeholder?
                          <option value={this.props.defaultProp}>{this.props.placeholder}</option>
                          :
                          ''}
                        {this.props.data.map((item, index) => <option value={item[this.props.keyName]}>{item[this.props.keyDescr]}</option>)}
                    </select>
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
