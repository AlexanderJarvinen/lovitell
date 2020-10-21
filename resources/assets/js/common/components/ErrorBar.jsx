import React, { PropTypes, Component } from 'react';
import classNames from 'classnames';
import AppStore from '../stores/AppStore.js';

export default class ErrorBar extends Component {
    state = {
        error: ''
    };
    componentDidMount = () => {
        AppStore.addChangeListener(this.onChange);
    };
    componentWillUnmount = () => {
        AppStore.removeChangeListener(this.onChange);
    };
    render = () => {
        if (!this.state.error) return null;
        return (
            <div className={'error_msg'}>
                <h2>Произошла непредвиденная ошибка!</h2><img src={"/img/loading.gif"} />
            </div>
        );
    },
    onChange = () => {
        this.setState({
            error: AppStore.getError()
        });
    }
};
