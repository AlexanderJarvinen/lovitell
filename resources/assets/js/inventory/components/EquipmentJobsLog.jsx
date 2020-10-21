import React, { Component, PropTypes } from 'react';
import JobsList2 from './JobsList2';
import classNames from 'classnames';
import moment from 'moment';
import * as helper from '../../common/helpers/Helper.js';
import * as JobsConstant from '../constants/JobConstants.js';
import SwitchButton from '../../common/components/SwitchButton.jsx';
import DateRangeSelect from '../../common/components/DateRangeSelect.jsx';
import Multiselect from 'react-bootstrap-multiselect';


class JobTypeSelect extends Component {
    static propTypes = {
        types: PropTypes.array.isRequired,
        onChange: PropTypes.func.isRequired
    };

    typeChange = (e) => {
        this.props.onChange(e.val());
    };

    render = () => {
        let multiselect = helper.toMultiselect(JobsConstant.JOB_TYPES, 'id', 'label', this.props.types);
        return (
            <div className="form-group">
                <label>Тип задания:</label>
                <Multiselect
                    onChange={this.typeChange}
                    data={multiselect}
                    multiple
                    className="form-control"
                    />
            </div>
        )
    };
}

class JobStateSelect extends Component {
    static propTypes = {
        states: PropTypes.array.isRequired,
        onChange: PropTypes.func.isRequired
    };

    statesChange = (e) => {
        this.props.onChange(e.val());
    };

    render = () => {
        let multiselect = helper.toMultiselect(JobsConstant.JOB_STATES, 'id', 'label', this.props.states);
        return (
            <div className="form-group">
                <label>Статус задания:</label>
                <Multiselect
                    onChange={this.statesChange}
                    data={multiselect}
                    multiple
                    className="form-control"
                    />
            </div>
        )
    };
}

class JobFilterPanel extends Component {
    static propTypes = {
        onlyMy: PropTypes.bool,
        address_id: PropTypes.number,
        routes: PropTypes.array,
        types: PropTypes.array,
        states: PropTypes.array
    };

    defaultProps = {
        address_id: 0,
        routes: [],
        states: [],
        types: [],
        onlyMy: false,
        dates: {
            start: moment(),
            end: moment()
        }
    };

    handleDateRangeSelect = (dates) => {
        console.log(dates);
        let newdates = {
            start: dates.start_date,
            end: dates.end_date
        };
        this.props.onDatesChange(newdates);
    };

    handleTypeChange = (val) => {
        let types = this.props.types;
        let i = types.indexOf(val);
        if ( i != -1) {
            types.splice(i, 1);
        } else {
            types.push(val);
        }
        this.props.onTypesChange(states);
    };

    handleStateChange = (val) => {
        let states = this.props.states;
        let i = states.indexOf(val);
        if ( i != -1) {
            states.splice(i,1);
        } else {
            states.push(val);
        }
        this.props.onStatesChange(states);
    };
    handleOnlyMyChange = (val) => {
        this.props.onOnlyMyChange(val);
    };

    render = () => {
        return (
            <div className="filter-panel__job-list row">
                <div className="col-md-2">
                    <SwitchButton
                        label={'Созданные мной'}
                        state={this.props.onlyMy}
                        onChange={this.handleOnlyMyChange}
                        />
                </div>
                <div className="col-md-3">
                    <DateRangeSelect
                        onChange={this.handleDateRangeSelect}
                        start_date={this.props.dates.start}
                        end_date={this.props.dates.end}
                        />
                </div>
                <div className="col-md-3">
                    <JobTypeSelect
                        types={this.props.types}
                        onChange={this.handleTypeChange}
                        />
                </div>
                <div className="col-md-3">
                    <JobStateSelect
                        states={this.props.states}
                        onChange={this.handleStateChange}
                        />
                </div>
            </div>


        )
    }
}

export default class EquipmentJobsLog extends Component {
    state = {
        collapse: true,
        onlyMy: true,
        types: JobsConstant.JOB_TYPES.map(val => val.id),
        address_id: 0,
        dates: {
            start: moment(),
            end: moment()
        },
        states: JobsConstant.JOB_STATES.map(val => val.id),
    };

    static defaultProps = {
        routes: []
    };
    handleTypesChange = (types) => {
        this.setState({types});
    };
    handleStatesChange = (states) => {
        this.setState({states});
    };
    handleDatesChange = (dates) => {
        this.setState({dates});
    };
    handleOnlyMyChange = (onlyMy) => {
        this.setState({onlyMy});
    };
    render = () => {
        return (
            <div className={classNames(
                    'equipemnt-jobs-log',
                    'box',
                    {'collapsed-box':this.state.collapse == true}
                )}>
                <div className="box-header link" onClick={()=>{this.setState({collapse: !this.state.collapse})}}>
                    <div className="box-title">Задания по оборудованию</div>
                </div>
                <div className="box-body">
                    <JobFilterPanel
                        types={this.state.types}
                        onTypesChange={this.handleTypesChange}
                        states={this.state.states}
                        onStatesChange={this.handleStatesChange}
                        address_id={this.state.address_id}
                        dates={this.state.dates}
                        onDatesChange={this.handleDatesChange}
                        onlyMy={this.state.onlyMy}
                        onOnlyMyChange={this.handleOnlyMyChange}
                        />
                    <JobsList2
                        types={this.state.types}
                        states={this.state.states}
                        address_id={this.state.address_id}
                        routes={this.props.routes}
                        dates={this.state.dates}
                        onlyMy={this.state.onlyMy}
                        />
                </div>
            </div>
        )
    }
}