import React, { PropTypes, Component } from 'react';
import classNames from 'classnames';
import AppStore from '../stores/AppStore.js';
import MaskedInput from 'react-maskedinput';
import HelpTooltip from '../../common/components/HelpTooltip';
import ReactDOM from 'react-dom';
import Autocomplete from 'react-autocomplete';

export default class FormAutocompleteField extends Component {
    styles = {
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
    };

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
        label: '',
        requiredMsg: 'Поле обязательно к выбору',
        keyName: 'value',
        keyDescr: 'descr',
        disabled: false,
        placeholder: null,
        fixModal: false
    };
    onChange = (e, v) => {
        this.props.onChange(v);
    };
    onSelect = (v, i) => {
        console.log(i);
        this.props.onSelect(i);
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
        let {state, label, help, required, disabled, value, data, keyDescr, keyName} = this.props;
        let styles = this.styles;
        let menuStyle={
            borderRadius: '3px',
            boxShadow: '0 2px 12px rgba(0, 0, 0, 0.1)',
            background: 'rgba(255, 255, 255, 0.9)',
            padding: '2px 0',
            fontSize: '90%',
            position: 'fixed',
            width: '400px',
            overflow: 'auto',
            maxHeight: '50%'
        };
        if (this.props.fixModal) {
            let ac = $("autocomplete-modal");
            if (ac) {
                menuStyle.left = (parseInt(ac.offsetLeft)+parseInt(window.scrollX))+'px';
                menuStyle.top = (parseInt(ac.offsetTop)+parseInt(ac.offsetHeight)+parseInt(window.scrollX))+'px';
            }
        };
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
                    {data.find((el)=>{return el[keyName] === value})[keyDescr]}
                </div>
                :
                    <Autocomplete
                      inputProps={
                                    {
                                        name: this.props.label, id: "form-autocomplete"+(this.props.fixModal?'-modal':''),
                                        className: 'form-control'
                                    }
                                }
                      ref="autocomplete"
                      value={value}
                      wrapperStyle={{display: 'block'}}
                      items={data}
                      getItemValue={(item) => {console.log(item); return item[keyName]}}
                      onSelect={this.onSelect}
                      onChange={this.onChange}
                      menuStyle={menuStyle}
                      renderItem={(item, isHighlighted) => (
                                    <div
                                        style={isHighlighted ? styles.highlightedItem : styles.item}
                                        key={item[keyName]}
                                        id={item[keyName]}
                                    >{item[keyDescr]}</div>
                                )}
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
