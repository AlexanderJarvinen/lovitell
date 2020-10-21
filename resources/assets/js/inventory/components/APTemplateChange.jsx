var $ = require('jquery');
var React = require('react');
var ReactDOM = require('react-dom');
var classNames = require('classnames');
var AppActions = require('../../common/actions/AppActions.js');
var LoadBar = require('../../common/components/LoadBar.jsx');
import { PropTypes, Component } from 'react';

import JobsList from './JobsList';
import DraggableModalDialog from '../../common/components/DraggableModalDialog.jsx';
import Draggable from 'react-draggable';
import ModalDialog from 'react-bootstrap/lib/ModalDialog';
import { Modal } from 'react-bootstrap';

class ConfirmMessageBox extends Component {
    static propTypes = {
        error: PropTypes.bool,
        route: PropTypes.string.isRequired,
        msg: PropTypes.string

    };
    render = () => {
        const {route, error} = this.props;
        return (
          <Modal
            dialogComponentClass={DraggableModalDialog}
            show={this.props.show}
            onHide={this.props.onHide}
            animation={false}
            backdrop={false}
            enforceFocus={false}
            >
              <Modal.Header closeButton>
                  <Modal.Title>{'Конфигурирование точки доступа '+route}</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                  {error?
                    <div className="alert alert-danger">
                        <h4><i className="icon fa fa-ban"></i> Ошибка!</h4>
                        {this.props.msg}
                    </div>
                    :
                    <div className="alert alert-success">
                        <h4><i className="icon fa fa-check"></i> Задача добавлена в очередь на исполнение</h4>
                    </div>
                  }
              </Modal.Body>
              <Modal.Footer>
                  <button type="button" className="btn btn-default" onClick={this.props.onHide}>Закрыть</button>
              </Modal.Footer>
          </Modal>
        )
    }
}

var APTemplateChange = React.createClass({
    propTypes: {
        address_id: React.PropTypes.number.isRequired
    },
    getInitialState: function () {
        return {
            system: this.props.system || 0,
            to_all: false,
            templates: [],
            template: 0,
            route: '',
            error: 1,
            show: false,
            msg: ''
        };
    },
    componentDidMount: function() {
        $('.equipment_selectall').show();
        $('.route input[type=checkbox]').show();
        this.checkResetRights();
        this.checkChangeRights();
    },
    handleTemplateChangeComplete: function(a) {
        console.log(a);
        AppActions.cancelLoading();
    },
    startTemplateChange: function() {
        AppActions.initLoading();
        let routes = [];
        $(".route input[type=checkbox]:checked").each(function() {
            routes.push($(this).parent().parent().parent().data('name'));
        });
        if (routes.length>0) {
            $.ajax({
                beforeSend: function (request) {
                    return request.setRequestHeader('X-CSRF-Token', $("meta[name='csrf-token']").attr('content'));
                },
                type: 'POST',
                data: {
                    system: this.state.system,
                    template: this.state.template,
                    to_all: this.state.to_all,
                    routes: routes
                },
                url: '/inventory/update-template/' + this.props.address_id,
                success: this.handleTemplateChangeComplete
            });
        }
    },
    handleSystemChange: function(a) {
        AppActions.cancelLoading();
        let templates=[];
        for(let i in a) {
            templates.push(<option key={i} value={a[i].value}>{a[i].desk}</option>)
        }
        this.setState({
            templates: templates
        });
    },
    handleChange: function(e) {
        this.setState({system: e.target.value});
        AppActions.initLoading();
        $.ajax({
            beforeSend: function (request) {
                return request.setRequestHeader('X-CSRF-Token', $("meta[name='csrf-token']").attr('content'));
            },
            type: 'GET',
            url: '/inventory/ajax/templates/'+e.target.value,
            success: this.handleSystemChange
        });
    },
    routeConfigure: function() {
        let that = this;
        if (this.state.route) {
            $.ajax({
                url: "/inventory/ajax/building/"+this.props.address_id+"/configure-route/"+this.state.route,
                type: "GET",
                dataType: "json",
                success: function (data) {
                if (data.error == 0) {
                    that.setState({
                        error: 0,
                        show: true
                    });
                } else {
                    that.setState({
                        error: 1,
                        show: true,
                        msg: data.msg
                    });
                }
            }
        });
    }
    },
    checkResetRights: function() {
        let that = this;
        fetch('/inventory/ajax/checkrights/canresetap', {method: 'GET', credentials: 'include'})
          .then(resp => {
              return resp.json()})
          .then(resp => {
              that.setState({
                  canResetAp: resp
              });
          });
    },
    checkChangeRights: function() {
        let that = this;
        fetch('/inventory/ajax/checkrights/changeaptemplate', {method: 'GET', credentials: 'include'})
          .then(resp => {
              return resp.json()})
          .then(resp => {
              that.setState({
                  canChangeAp: resp
              });
          });
    },
    render: function() {
        let temp_select=null;
        let to_all=null;
        if (this.state.templates.length>0) {
            temp_select=(<select value={this.state.template} onChange={(e)=>{this.setState({template: e.target.value})}}>
                <option value={0}>Не выбран</option>
                {this.state.templates}
                </select>);
            to_all = (<div>
                <input type="checkbox" value={this.state.to_all} onChange={(e)=>{this.setState({to_all: !this.state.to_all})}}/><label>Применять ко всем</label>
            </div>);
        }
        let commit=null;
        if (this.state.template != 0 && this.state.system != 0) {
            commit=<button onClick={this.startTemplateChange}>Сменить</button>
        }
        return (
            <div className="network_check wrap">
                <h3>Обновление шаблона</h3>
                {this.state.canChangeAp ?
                  <div className="form-group">
                      <label>Тип устройства:</label>

                      <div>
                          <select value={this.state.system} onChange={this.handleChange}>
                              <option value={0}>Не выбран</option>
                              <option value={-3}>API</option>
                              <option value={11}>APO</option>
                          </select>
                          {temp_select}
                          {commit}
                          {to_all}
                      </div>
                  </div>
                  :
                  ''
                }
                {this.state.canResetAp ?
                  <div className="ap-template-change">
                      <div className="form-group">
                          <label>Настройка ТД</label>

                          <div className="row">
                              <div className="col-md-8">
                                  <input type="text" className="form-control" value={this.state.route}
                                         onChange={(e)=>{this.setState({route: e.target.value})}}/>
                              </div>
                              {this.state.route != '' ?
                                <div className="col-md-4">
                                    <button className="btn btn-primary" onClick={this.routeConfigure}>Настроить</button>
                                </div> :
                                ''
                              }
                          </div>
                      </div>
                      <ConfirmMessageBox
                        show={this.state.show}
                        error={this.state.error}
                        msg={this.state.msg}
                        route={this.state.route}
                        onHide={()=>{
                        this.setState({
                          error: 0,
                          show: false,
                          msg: ''
                        })
                      }}
                        />
                  </div>
                  : null
                }
                <JobsList
                    jobtype='template'
                    address_id={this.props.address_id}/>
            </div>
        )
    }
});

ReactDOM.render(
    <APTemplateChange
        address_id={BuildingData.address_id}
    />,
    document.getElementById('change_template_wrap')
);