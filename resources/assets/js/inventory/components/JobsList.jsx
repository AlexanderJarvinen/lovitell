var $ = require('jquery');
import React, { Component, PropTypes } from 'react';
import { Modal } from 'react-bootstrap'
var classNames = require('classnames');
var AppActions = require('../../common/actions/AppActions.js');
var LoadBar = require('../../common/components/LoadBar.jsx');
var moment = require('moment');

import Draggable from 'react-draggable';
import ModalDialog from 'react-bootstrap/lib/ModalDialog';

class DraggableModalDialog extends React.Component {
    render() {
        return <Draggable handle=".modal-title"><ModalDialog
            backdrop={false}
            enforceFocus={false}
            {...this.props} /></Draggable>
    }
}

class Log extends Component{
    state = {
        log: [],
        date: 0,
        timer: null,
        state: 'IDLE',
        first_row: true,
        last_log: 0
    };
    componentWillReceiveProps = (np) => {
        if (np.show) {
            if (this.state.timer == null) {
                let timer = setInterval(this.getNewLines, 1000);
                this.setState({
                    timer: timer,
                    first_row: true,
                    date: 0
                });
            }
        } else {
            if (this.state.timer != null) {
                clearInterval(this.state.timer);
                this.setState({timer: null});
            }
        }
    };
    addNewLines = (data) => {
        let log = this.state.log;
        let last_log = this.state.last_log;
        let state = data.state;
        if (this.state.first_row) {
            log = [];
            if (state == 'IDLE') {
                log.push(<div className="log__row">В ожидании</div>);
            } else {
                log.push(<div className="log__row">Выполняется c {data.started_at}</div>);
            }
        } else {
            if (this.state.state == 'IDLE' && data.state == 'INPROGRESS') {
                log.push(<div className="log__row">Выполняется</div>);
            }
        }
        for(let i in data.log) {
            if (data.log[i].id > this.state.last_log) {
                log.push(
                    <div className="log__row">{data.log[i].accessed_at} - {data.log[i].route} - {data.log[i].msg} ({data.log[i].number} из {data.total}) </div>
                );
                this.state.last_log = data.log[i].id;
            }
        }
        if (this.state.state == 'INPROGRESS' && state != 'INPROGRESS') {
            if (state == 'COMPLETE') {
                log.push(<div className="log__row">Задача выполнена успешно</div>);
            } else {
                log.push(<div className="log__row">Выполнение завершилось с ошибкой</div>);
            }
        }
        this.setState({
            log: log,
            state: state,
            first_row: false
        });
    };
    getNewLines = () => {
        $.get({
            url: '/inventory/ajax/job/'+this.props.jobtype+'/'+this.props.job.id+'/log/'+this.state.date,
            success: this.addNewLines
        });
        this.setState({date: moment().format('X')});
    };
    render = () => {
        return (
            <Modal
                dialogComponentClass={DraggableModalDialog}
                show={this.props.show}
                animation={false}
                backdrop={false}
                enforceFocus={false}
                onHide={this.props.handleClose}
            >
                <Modal.Header closeButton>
                    <Modal.Title>Выполнение задачи {this.props.job.id}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="log_wrap">
                        {this.state.log}
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <button type="button" className="btn btn-default" onClick={this.props.handleClose}>Закрыть</button>
                </Modal.Footer>
            </Modal>
        )
    }
}

class JobItem extends Component {
    handleDetails = () => {
        if (typeof this.props.onDetails != 'undefined') {
            this.props.onDetails(this.props.id, this.props.state);
        }
    };

    handleStopJob =() => {
        $.get({
            url: '/inventory/ajax/job/'+this.props.jobtype+'/'+this.props.id+'/stop',
            type: 'GET',
            success: this.handleGetJobs
        });
    };

    render = () => {
        let date = "Добавлено " + this.props.created;
        if (this.props.stoped) {
            date = "Завершено " + this.props.stoped
        } else if (this.props.started) {
            date = "Запущено " + this.props.started;
        }
        let icons = null;
        if (this.props.state == 'COMPLETE') {
            icons = (<span>
                {this.props.address_id?
                <a onClick={this.handleDetails} title="Просмотреть результаты на развертке"><i
                    className={'fa fa-building-o'} aria-hidden="true"></i></a>
                :
                null}
                <a
                href={'/inventory/job/'+this.props.jobtype+'/'+this.props.id+'/export'} title="Выгрузить результаты в xls"><i
                className={'fa fa-download'}></i></a>
            </span>);
        } else if (this.props.state == 'STOPPED') {
            icons = (<span> <a href={'/inventory/job/'+this.props.jobtype+'/'+this.props.id+'/export'} title="Выгрузить результаты в xls"><i
                    className={'fa fa-download'}></i></a></span>);
        } else {
            icons=(<span>
                <a onClick={this.handleDetails} title="Прервать выполнение задачи"><i className={'fa fa-eye'} aria-hidden="true"></i></a>
                {this.props.state != 'FAIL'?<a onClick={this.handleStopJob} title="Остановить задачу">
                <i className={'fa fa-times'} aria-hidden="true"></i></a>:''}
            </span>);
        }
        return(<li className={classNames('job_item', this.props.state)}>{this.props.desk} ({date}) {icons}</li>)
    }
}

export default class JobsList extends Component {
    static propTypes = {
        address_id: PropTypes.number,
        jobtype: PropTypes.string
    };

    static defaultProps = {
        jobtype: 'all'
    };

    state = {
        jobs: [],
        log_job: {
            id: 0,
            state: 'IDLE'
        },
        show_log: false
    };

    handleGetResult = (data) => {
        for(let route in data) {
            console.log(data[route].route);
            let r = $('.route[data-name='+data[route].route.replace(/\./g, "\\.")+']');
            if (data[route].error ==0) {
                r.removeClass('update-error').addClass('update-ok');
                r.attr('data-error', data[route].msg)
                 .attr('data-emsg', data[route].msg)
            } else {
                r.removeClass('update-ok').addClass('update-error');
                r.attr('data-error', data[route].error)
                 .attr('data-emsg', data[route].msg)
            }
        }
    };

    onDetails = (id, state) => {
        console.log(id+' '+state);
        if (state == 'COMPLETE') {
            $.get({
                url: '/inventory/ajax/job/'+id,
                success: this.handleGetResult
            })
        } else {
            this.setState({
                log_job: {
                    id: id,
                    state: state
                },
                show_log: true
            })
        }
    };

    handleGetJobs = (data) => {
        AppActions.cancelLoading();
        let jobs = [];
        for(let i in data) {
            jobs.push(<JobItem
                id={data[i].id}
                jobtype={this.props.jobtype}
                key={'jobItem-'+data[i].id}
                state={data[i].state}
                desk={data[i].desk}
                created={data[i].created_at}
                started={data[i].started_at}
                stoped={data[i].stopped_at}
                onDownloadClick={this.onDownload}
                onDetails={this.onDetails}
            />);
        }
        this.setState({jobs: jobs});
    };

    getJobs = () => {
        $.get({
            url: '/inventory/ajax/jobs/'+this.props.jobtype+(this.props.address_id?'/'+this.props.address_id:''),
            type: 'GET',
            success: this.handleGetJobs
        });
    };

    componentDidMount = () => {
        setInterval(this.getJobs, 5000);
    };

    handleCloseLog = () => {
        this.setState({
            log_job: {
                id: 0,
                state: 'IDLE'
            },
            show_log: false
        })
    };

    render = () => {
        return (
            <div className="template_change__jobs_wrap">
                <h3>Задания:</h3>
                <ul className="template_change__jobs">
                    {this.state.jobs}
                </ul>
                <Log
                    handleClose={this.handleCloseLog}
                    job={this.state.log_job}
                    show={this.state.show_log}
                    jobtype={this.props.jobtype}
                />
            </div>
       )
    }
}

