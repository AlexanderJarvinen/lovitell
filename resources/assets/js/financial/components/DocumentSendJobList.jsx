var $ = require('jquery');
var React = require('react');
var ReactDOM = require('react-dom');
var AppActions = require('../../common/actions/AppActions.js');
var LoadBar = require('../../common/components/LoadBar.jsx');
var moment = require('moment');
var classNames = require('classnames');

import { Modal } from 'react-bootstrap'
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

var Log = React.createClass({
    getInitialState: function() {
        let log =[];
        return {
            log: log,
            date: 0,
            timer: null,
            state: 'IDLE',
            first_row: true,
            last_log: 0
        }
    },
    componentWillReceiveProps(np) {
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
    },
    addNewLines: function(data) {
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
    },
    getNewLines: function() {
        $.get({
            url: '/financial/ajax/documents/job/'+this.props.job.id+'/log/'+this.state.date,
            success: this.addNewLines
        });
        this.setState({date: moment().format('X')});
    },
    render: function() {
        return (
            <Modal
                dialogComponentClass={DraggableModalDialog}
                show={this.props.show}
                animation={false}
                backdrop={false}
                enforceFocus={false}
                onHide={this.props.handleClose}
            >
                <Modal.Header>
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
});

var DocumentJobItem = React.createClass({
    handleDetails: function() {
        if (typeof this.props.onDetails != 'undefined') {
            this.props.onDetails(this.props.id, this.props.state);
        }
    },
    render: function() {
        let date = "Добавлено "+this.props.created;
        if (this.props.stoped) {
            date = "Завершено "+this.props.stoped
        } else if (this.props.started) {
            date = "Запущено "+this.props.started;
        }
        let icons = null;
        if (this.props.state == 'COMPLETE') {
            icons=(<span>
                <a href={'/financial/documents/job/'+this.props.id+'/export'} title="Выгрузить результаты в xls"><i className={'fa fa-download'}></i></a>
            </span>);
        } else {
            icons=(<span>
                <a onClick={this.handleDetails} title="Просмотреть лог работы"><i className={'fa fa-eye'} aria-hidden="true"></i></a>
            </span>);
        }
        return(<li className={classNames('job_item', this.props.state)}>{this.props.desk} ({date}) {icons}</li>)
    }
});

var DocumentSendJobList = React.createClass({
    getInitialState: function() {
        return {
            jobs: [],
            log_job: {
                id: 0,
                state: 'IDLE'
            },
            show_log: false
        }
    },
    onDetails: function(id, state) {
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
    },
    handleGetJobs: function(data) {
        AppActions.cancelLoading();
        let jobs = [];
        for(let i in data) {
            jobs.push(<JobItem
                id={data[i].id}
                key={'jobItem-'+data[i].id}
                state={data[i].state}
                desk={data[i].desk}
                created={data[i].created_at}
                started={data[i].started_at}
                stoped={data[i].stoped_at}
                onDownloadClick={this.onDownload}
                onDetails={this.onDetails}
            />);
        }
        this.setState({jobs: jobs});
    },
    onDetails: function(id, state) {
        if (state == 'COMPLETE') {
            $.get({
                url: '/financial/ajax/documents/jobs',
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
    },
    handleGetJobs: function(data) {
        AppActions.cancelLoading();
        let jobs = [];
        for(let i in data) {
            jobs.push(<DocumentJobItem
                id={data[i].id}
                key={'jobItem-'+data[i].id}
                state={data[i].state}
                desk={data[i].desk}
                created={data[i].created_at}
                started={data[i].started_at}
                stoped={data[i].stoped_at}
                onDownloadClick={this.onDownload}
                onDetails={this.onDetails}
            />);
        }
        this.setState({jobs: jobs});
    },
    getJobs: function() {
        $.get({
            url: '/financial/ajax/documents/jobs/',
            type: 'GET',
            success: this.handleGetJobs
        });
    },
    componentDidMount: function() {
        setInterval(this.getJobs, 5000);
    },
    handleCloseLog: function() {
        this.setState({
            log_job: {
                id: 0,
                state: 'IDLE'
            },
            show_log: false
        })
    },
    render: function() {
        return (
            <div className="document_send__jobs_wrap">
                <h3>Задания:</h3>
                <ul className="document_send__jobs jobs_list">
                    {this.state.jobs}
                </ul>
                <Log
                    handleClose={this.handleCloseLog}
                    job={this.state.log_job}
                    show={this.state.show_log}
                    />
            </div>
        )
    }
});

module.exports = DocumentSendJobList;
