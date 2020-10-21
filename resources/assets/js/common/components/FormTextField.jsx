import React, { PropTypes, Component } from 'react';
import classNames from 'classnames';
import AppStore from '../stores/AppStore.js';
import MaskedInput from 'react-maskedinput';
import HelpTooltip from '../../common/components/HelpTooltip';
import * as TextFieldTypes from '../../common/constants/TextFieldType.js';

export default class FormTextField extends Component {
    static PropTypes = {
        value: PropTypes.string.isRequired,
        label: PropTypes.string.isRequired,
        maskPattern: PropTypes.string.isRequired,
        disabled: PropTypes.bool,
        help: PropTypes.string,
        fieldType: PropTypes.object,
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
        onKeyDown: PropTypes.func,
        requires: PropTypes.bool,
        state: PropTypes.number,
        msg: PropTypes.string,
        toolIcon: PropTypes.object,
        onToolClick: PropTypes.func
    };
    static defaultProps = {
        state: 0,
        msg: '',
        helperIcon: null,
        onKeyDown: ()=>{}
    };
    onChange = (e) => {
        if (e.target.value == '') {
            if (this.props.required) {
                this.props.onChange({
                    value: e.target.value,
                    state: -2,
                    msg: 'Поле обязательно к заполнению'
                });
            } else {
                this.props.onChange({
                    value: e.target.value,
                    state: 1,
                    msg: ''
                });
            }
        } else {
            if (this.props.fieldType) {
                const fieldType = this.props.fieldType;
                if (TextFieldTypes[fieldType].pattern && !TextFieldTypes[fieldType].pattern.test(e.target.value)) {
                    console.error('Text does not match');
                    this.props.onChange({
                        value: e.target.value,
                        state: -2,
                        msg: TextFieldTypes[fieldType].error
                    });
                } else {
                    this.props.onChange({
                        value: e.target.value,
                        state: 1,
                        msg: ''
                    })
                }
            } else {
                this.props.onChange({
                    value: e.target.value,
                    state: 1,
                    msg: ''
                });
            }
        }
    };
    renderClass = (state) => {
        return classNames(
            'form-group',
            {'has-tool':this.props.toolIcon!=null},
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
                    this.props.maskPattern ?
                        <MaskedInput mask={this.props.maskPattern}
                                     className="form-control"
                                     value={this.props.value}
                                     onChange={this.onChange}
                                     formatCharacters={{
                                        'w': {
                                          validate(char) { return /\w*/.test(char ) },
                                        }
                                     }}
                            />
                        :
                        this.props.fieldType && TextFieldTypes[this.props.fieldType].type == 'textarea'?
                            <textarea
                                className="form-control"
                                value={this.props.value}
                                onChange={this.onChange}
                                onKeyDown={this.props.onKeyDown}
                                />
                                :
                            <input type={this.props.fieldType?TextFieldTypes[this.props.fieldType].type:'text'}
                               className="form-control"
                               name="name"
                               value={this.props.value}
                               onChange={this.onChange}
                               onKeyDown={this.props.onKeyDown}
                                />
                }
                {this.props.toolIcon !=null?
                    <i className={"fa link help-icon "+this.props.toolIcon} onClick={this.props.onToolClick}/>
                    :
                    null
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
