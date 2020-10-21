import React, { PropTypes, Component } from 'react';
import classNames from 'classnames';
import AppStore from '../stores/AppStore.js';
import HelpTooltip from '../../common/components/HelpTooltip';
import * as TextFieldTypes from '../../common/constants/TextFieldType.js';
import Multiselect from 'react-bootstrap-multiselect';

export default class FormMultiselectField extends Component {
    static PropTypes = {
        data: PropTypes.array.isRequired,
        value: PropTypes.array,
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
        placeholder: PropTypes.string,
        filtering: PropTypes.bool,
        multiselect: PropTypes.bool
    };
    static defaultProps = {
        state: 0,
        data: [],
        value: [],
        msg: '',
        defaultProp: 0,
        requiredMsg: 'Поле обязательно к выбору',
        keyName: 'value',
        keyDescr: 'descr',
        disabled: false,
        placeholder: null,
        multiselect: true,
        filtering: false
    };
    state = {
        options: []
    };
    constructor(props) {
        super(props);
        let options = [];
        let {data, keyName, keyDescr, value} = this.props;
        for (let i in data) {
            if (this.props.multiselect) {
                options.push({
                    value: data[i][keyName],
                    label: data[i][keyDescr]
                });
            } else {
                options.push({
                    value: data[i][keyName],
                    label: data[i][keyDescr],
                    selected: data[i][keyName] == value
                });
            }
        }
        this.state.options = options;
        //this.checkOptions();
    };
    handleChange = (e) => {
        if (this.props.multiselect) {
            let selOptions = [];
            let {options} = this.state;
            for (let i in options) {
                if (options[i].selected || options[i].value == e.val() && !options[i].selected) {
                    selOptions.push(options[i].value)
                }
            }
            this.props.onChange({
                value: selOptions,
                state: 1,
                msg: ''
            });
        } else {
            this.props.onChange({
                value: e.val(),
                state: 1,
                msg: ''
            })
        }
    };
    initOptions = (data, value) => {
        console.log('Init option');
        const {keyName, keyDescr} = this.props;
        let options = [];
        for (let i in data) {
            options.push({
                value: data[i][keyName],
                label: data[i][keyDescr]
            });
        }
        this.setState({options}, () => {if (value) this.checkOptions(value)});
    };
    checkOptions = (selOptions) => {
        console.log('Check option');
        console.log(selOptions);
        let {options} = this.state;
        if (Array.isArray(selOptions)) {
            for(let i in options) {
                options[i].selected = selOptions.indexOf(options[i].value) != -1;
            }
        } else if (!this.props.multiselect) {
            for(let i in options) {
                options[i].selected = selOptions == options[i].value;
            }
        }
        console.log(options);
        this.setState({options});
    };
    renderClass = (state) => {
        return classNames(
            'form-group',
            {'has-error': state == -2},
            {'has-warning': state == -1},
            {'has-success': state == 2}
        );
    };
    componentWillReceiveProps = (np) => {
        if (np.data.length != this.props.data.length || JSON.stringify(np.data) != JSON.stringify(this.props.data)) {
            this.initOptions(np.data, np.value);
        } else if (np.value) {
            this.checkOptions(np.value);
        }
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
                    {data.find((el)=>{el[keyName] === value})}
                </div>
                :
                    <Multiselect
                      buttonClass={'form-control'}
                      enableFiltering={this.props.filtering}
                      onChange={this.handleChange}
                      data={this.state.options}
                      multiple={this.props.multiselect}
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
