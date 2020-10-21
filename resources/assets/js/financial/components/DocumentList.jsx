var $ = require('jquery');
var React = require('react');
var ReactDOM = require('react-dom');
var Modal = require('react-modal');
var classNames = require('classnames');
var moment = require('moment');
var DatePicker = require('react-datepicker');
var DocumentSendJobList = require('./DocumentSendJobList');
var DocumentActions = require('../actions/DocumentActions');
var DocumentStore = require('../stores/DocumentStore');
var AppActions = require('../../common/actions/AppActions.js');
import * as Table from 'reactabular-table';

require('react-datepicker/dist/react-datepicker.css');

const BodyWrapper = props => <tbody {...props} />;
BodyWrapper.shouldComponentUpdate = true;
const RowWrapper = props => <tr {...props} />;
RowWrapper.shouldComponentUpdate = true

var DocumentTypeSelect = React.createClass({
    propTypes: {
        type: React.PropTypes.number.isRequired
    },
     handleChange: function(e) {
        if (typeof this.props.onChange != 'undefined') {
            this.props.onChange(e.target.value);
        }
    },
    render: function() {
        return (
            <div className={this.props.classname}>
                <label>Тип документа:</label>
                <select value={this.props.type} onChange={this.handleChange}>
                    <option value="0">Акт</option>
                    <option value="1">Счет</option>
                    <option value="2">Счет-фактура</option>
                    <option value="3">Пакет</option>
                    <option value="4">Квитанция</option>
                    <option value="5">Информационная рассылка</option>
                </select>
            </div>
        );
    }
});

var DocumentFilterPanel = React.createClass({
    getInitialState: function() {
        return {
            type: 0,
            date: moment(),
            customer_group: '',
            start_ac_id: '',
            end_ac_id: ''
        }
    },
    handleChangeType: function(type) {
        this.setState({
            type: type
        });
    },
    handleChangeDate: function(date) {
        this.setState({
            date: date
        });
    },
    handleChangeCustomerGroup: function(e) {
        this.setState({
            customer_group: e.target.value
        });
    },
    handleChangeStartAcId: function(e) {
        this.setState({
            start_ac_id: e.target.value
        });
    },
    handleChangeEndAcId: function(e) {
        this.setState({
            end_ac_id: e.target.value
        });
    },
    handleSearch: function() {
        DocumentActions.search({
            type: this.state.type,
            date: this.state.date.format('YYYY-MM-DD'),
            customer_group: this.state.customer_group,
            start_ac_id: this.state.start_ac_id,
            end_ac_id: this.state.end_ac_id
        });
    },
    render: function() {
        return (
            <div>
                <h3>Формирование новой рассылки</h3>
                <DocumentTypeSelect
                    type={this.state.type}
                    onChange={this.handleChangeType}
                    classname={'filter_wrap'}
                />
                {this.state.type!=5?
                    <div>
                        <div className={'filter_wrap'}>
                            <label>Дата:</label>
                            <DatePicker
                                dateFormat="DD.MM.YYYY"
                                selected={this.state.date}
                                onChange={this.handleChangeDate}
                            />
                        </div>
                        <div className={'filter_wrap'}>
                            <label>Группа:</label>
                            <input
                                type={'text'}
                                name={'customer_group'}
                                value={this.state.customer_group}
                                onChange={this.handleChangeCustomerGroup}
                            />
                        </div>
                        <div className={'filter_wrap'}>
                            <label>Стартовый № договора</label>
                            <input
                                type={'text'}
                                name={'start_ac_id'}
                                value={this.state.start_ac_id}
                                onChange={this.handleChangeStartAcId}
                            />
                        </div>
                        <div className={'filter_wrap'}>
                            <label>Конечный № договора</label>
                            <input
                                type={'text'}
                                name={'end_ac_id'}
                                value={this.state.end_ac_id}
                                onChange={this.handleChangeEndAcId}
                            />
                        </div>
                    </div>
                :
                null
                }
                <button className={'btn btn-primary'} onClick={this.handleSearch}>Поиск</button>
            </div>
        )
    }
});

var DocumentTable = React.createClass({
    getInitialState: function() {
        return {
            job_id: 0,
            total: 0,
            total_docs: 0,
            filters: [],
            state: 0
        }
    },
    componentDidMount: function() {
        DocumentStore.addChangeListener(this.onChange);
    },
    onChange: function() {
        let data = DocumentStore.getData();
        this.setState({
            job_id: data.job_id,
            total: data.total,
            total_docs: data.total_docs,
            filters: DocumentStore.getFilters(),
            state: 1
        });
    },
    handleStartEmailSend: function(data) {
        this.setState({
            state: this.state.state? 2: 0
        });
    },
    onSendDoc: function() {
        AppActions.initLoading();
        if (this.state.total != 0) {
            $.ajax({
                type: 'POST',
                beforeSend: function (request) {
                    return request.setRequestHeader('X-CSRF-Token', $("meta[name='csrf-token']").attr('content'));
                },
                url: '/financial/documents/job/send/',
                data: {
                    job_id: this.state.job_id
                },
                success: this.handleStartEmailSend
            });
        }
    },
    render: function() {
        if (this.state.job_id == 0) return null;
        let download=null;
        let send=null;
        if (this.state.total) {
            download = <a href={'/financial/documents/job/'+this.state.job_id+'/export'}><i className="fa fa-download"></i></a>;
            send = <button className="btn btn-primary" onClick={this.onSendDoc}>Отправить</button>;
        }
        let box_title = 'Найденные документы';
        let box_body = (
            <div className="box-body">
                <div className="request_params">
                    <div className="request_params__title">Параметры запроса:</div>
                    <div>Тип документа: {this.state.filters.type}</div>
                    <div>Дата: {this.state.filters.date}</div>
                    <div>Группа клиентов: {!this.state.filters.customer_group?'Все':this.state.filters.customer_group}</div>
                    <div>Стартовый номер договора: {!this.state.filters.start_ac_id?'Не задан':this.state.filters.start_ac_id}</div>
                    <div>Конечный номер договора: {!this.state.filters.end_ac_id?'Не задан':this.state.filters.end_ac_id}</div>
                </div>
                <div className="documents_send__result">Клиентов в списке рассылке: {this.state.total}, документов: {this.state.total_docs} {download}</div>
                {send}
            </div>
        );
        if (this.state.state == 2) {
            box_title = 'Задача отправлена на исполнение!';
            box_body = (<div class='alert alert-success'>
                            Список сформирован. Производится рассылка.
                        </div>);
        }

        return (
        <div className="document_send__wrap box">
            <div className="box-header">
                <h3 className="box-title">{box_title}</h3>
            </div>
            <div className="box-body">
                {box_body}
            </div>
        </div>
        )
    }
});

var DocumentList = React.createClass({
    getInitialState: function() {
        return {
            data: []
        }
    },
    handleChangeType: function(type) {
        this.setState({
            type: type
        });
    },
    handleChange: function() {

    },
    render: function() {
        return (
            <div>
                <DocumentSendJobList />
                <DocumentFilterPanel />
                <DocumentTable />
            </div>
        )
   }
});

ReactDOM.render(
    <DocumentList
    />,
    document.getElementById('document-list')
);