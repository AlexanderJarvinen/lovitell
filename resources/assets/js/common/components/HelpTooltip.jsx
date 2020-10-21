import React, { PropTypes, Component } from 'react';
import classNames from 'classnames';
import AppStore from '../stores/AppStore.js';
import ReactTooltip from 'react-tooltip';

export default class HelpTooltip extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: 'help-'+ Math.floor((Math.random() * 100000) + 1)
        }
    }
    render = () => {
        return (
            <span className="p-help__icon">
                <i className="fa fa-question-circle"
                   data-for={this.state.id}
                   data-tip='custom show' data-event='click focus'
                    ></i>
                <ReactTooltip
                    id={this.state.id}
                    globalEventOff='click'>
                    {this.props.children}
                </ReactTooltip>
            </span>
        )
    };
};
