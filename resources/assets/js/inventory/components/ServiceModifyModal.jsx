var $ = require('jquery');
var React = require('react');
var ReactDOM = require('react-dom');
//var Modal = require('react-modal');
import { Modal } from 'react-bootstrap'
var classNames = require('classnames');
var LoadBar = require('../../common/components/LoadBar.jsx');
var AppActions = require('../../common/actions/AppActions.js');
var ServiceOptionModifyModal = require('./ServiceOptionModifyModal.jsx');

import * as Table from 'reactabular-table';

import Draggable from 'react-draggable';
import ModalDialog from 'react-bootstrap/lib/ModalDialog';

var AddServiceOption = React.createClass({
    getInitialState: function() {
        return {
            showAddServiceOption: false,
            selectedOption: null
        }
    },
    handleServiceOptionSave: function() {
        this.props.onOptionAdding();
    },
    render: function() {
        if (!this.props.can_modifyserviceoption) return false;
        return (<div>
            <ServiceOptionAddModal
                service_id={this.props.service_id}
                show={this.state.showAddServiceOption}
                onHide={()=>{this.setState({showAddServiceOption: false})}}
                onSave={this.handleServiceOptionSave}
                />
            <button
                className='btn btn-primary add-equipment'
                onClick={()=>{this.setState({showAddServiceOption: true})}}
                >
                <i className='fa fa-file-text-o' aria-hidden="true"></i> Добавить параметр
            </button>
        </div>)
    }
});

class DraggableModalDialog extends React.Component {
    render() {
        return <Draggable handle=".modal-title"><ModalDialog
            backdrop={false}
            enforceFocus={false}
            {...this.props} /></Draggable>
    }
}

var ServiceModifyModal = React.createClass({
    getColumns: function() {
        return [
            {
                property: 'option_desk',
                header: {
                    label: 'Атрибут'
                },
                cell: {
                    formatters: [
                        (option_desk, row) => {
                            if (!this.props.can_modifyserviceoption) {
                                return <span>{option_desk}</span>
                            } else {
                                return (
                                    <span>
                                        <a className={'link'}
                                            onClick={()=>{this.modifyServiceOption(row.rowData)}}>{option_desk}</a>
                                        <i onClick={()=>this.deleteServiceOption(row.rowData.option_id)} className='link fa fa-times' />
                                    </span>
                                )
                            }
                        }
                    ]
                }
            }
        ];
    },
    deleteServiceOption: function(option_id) {
        console.log(option_id+" "+this.props.service.service_id);
        if (this.props.service.service_id && option_id) {
            $.ajax({
                method: 'DELETE',
                url: "/inventory/ajax/service/" + this.props.service.service_id + "/option/" + option_id,
                success: ()=>{this.getOptionsList(this.props.service.service_id)}
            });
        }
    },
    modifyServiceOption: function(option) {
        if (this.props.service.service_id && option) {
            this.state.selectedOption = option;
            this.setState({
                showAddServiceOption: true
            });
        }
    },
    getInitialState: function() {
        return {
            count: 0,
            service_name: this.props.service!=null?this.props.service.service_name:'',
            service_name_state: 0,
            service_desc: this.props.service!=null?this.props.service.service_desc:'',
            service_desc_state: 0,
            state: 0,
            items: []
        }
    },
    checkParams: function() {
        if (this.state.service_name != '' &&
            this.state.service_desc != '') {
            this.setState({
                state: 1
            });
        }
    },
    handleSaveResponse: function(a) {
        if (a.error == 0) {
            this.setState({
                state: 3,
                msg: ''
            }, setTimeout(this.props.onSave, 1000));
        } else {
            this.setState({
                state: -1,
                msg: a.msg
            });
        }
    },
    handleReceiveParams: function(a) {
        if (a.error == 0) {
            this.setState({
                items: a.service.options
            })
        }
    },
    getOptionsList: function(service_id) {
        $.get({
            url: "/inventory/ajax/service/" + this.props.service.service_id,
            success: this.handleReceiveParams
        });
    },
    componentWillReceiveProps: function(np) {
        if (np.service && np.service.service_id != this.props.service_id) {
            this.setState({
                service_name: np.service.service_name,
                service_desc: np.service.service_desc
            }, ()=>this.getOptionsList(np.service_id));
        }
    },
    handleSave: function() {
        $.ajax({
            beforeSend: function(request) {
                return request.setRequestHeader('X-CSRF-Token', $("meta[name='csrf-token']").attr('content'));
            },
            type: "POST",
            url: "/inventory/ajax/service/"+this.props.service.service_id+"/modify/",
            data: {
                name: this.state.service_name,
                desc: this.state.service_desc
            },
            success: this.handleSaveResponse,
            error: ()=>AppActions.initError({code: 1, msg:''})
        });
    },
    handleClose: function() {
        this.setState(this.getInitialState);
        this.props.onHide();
    },
    handleServiceOptionChange: function() {
        this.getOptionsList(this.props.service_id);
        this.setState({showAddServiceOption: false});
    },
    render: function() {
        let style = classNames(
            'form-group',
            {'changed': this.props.state==1},
            {'cansave': this.props.state==2},
            {'saved': this.props.state==3},
            {'error': this.props.state==-1}
        );
        var save_btn = null;
        switch (this.state.state) {
            case 1:
                save_btn = (
                  <button type="button" className="btn btn-primary" onClick={this.handleSave}>Сохранить</button>);
                break;
        }
        return (
                <Modal
                    dialogComponentClass={DraggableModalDialog}
                    show={this.props.show}
                    onHide={this.handleClose}
                    animation={false}
                    backdrop={false}
                    enforceFocus={false}
                >
                    <Modal.Header closeButton>
                        <Modal.Title>Добавление ISG-сервиса</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className={style}>
                            <label>Имя</label>
                            <input className={'form-control'}
                                   value={this.state.service_name}
                                   onChange={e=>this.setState({service_name: e.target.value}, this.checkParams)}/>
                        </div>
                        <div className={style}>
                            <label>Описание</label>
                            <textarea className={'form-control'}
                                   onChange={e=>this.setState({service_desc: e.target.value}, this.checkParams)}
                                   value={this.state.service_desc}
                            >
                            </textarea>
                        </div>
                        <h4>Список параметров</h4>
                        <Table.Provider
                            className="table table-bordered table-hover dataTable"
                            columns={this.getColumns()}
                            style={{ overflowX: 'auto' }}
                            >
                            <Table.Header />
                            {this.state.items.length>0?
                                <Table.Body
                                    rows={this.state.items}
                                    rowKey="option_id"
                                    />
                                :
                                <tbody><tr><td colSpan={this.getColumns().length}>Нет данных</td></tr></tbody>}
                        </Table.Provider>
                        {this.props.can_modifyserviceoption ?
                            <ServiceOptionModifyModal
                                service_id={this.props.service?this.props.service.service_id:0}
                                show={this.state.showAddServiceOption}
                                onHide={()=>{this.setState({showAddServiceOption: false})}}
                                onSave={this.handleServiceOptionChange}
                                option_id={this.state.selectedOption?this.state.selectedOption.option_id:0}
                                option={this.state.selectedOption?this.state.selectedOption.option:''}
                                operator={this.state.selectedOption?this.state.selectedOption.operator:'='}
                                value={this.state.selectedOption?this.state.selectedOption.value:''}
                                />
                            :
                            null
                        }
                        {this.props.can_modifyserviceoption ?
                            <button
                                className='btn btn-primary add-equipment'
                                onClick={()=>{this.setState({showAddServiceOption: true})}}
                                >
                                <i className='fa fa-file-text-o' aria-hidden="true"></i> Добавить параметр
                            </button>
                            :
                            null
                        }
                        {this.state.msg && this.state.state<0?
                            <div className="alert alert-danger">
                                {this.state.msg}
                            </div>
                            :
                            null
                        }
                        {this.state.state==3?
                            <div className="alert alert-success">
                                <h4><i className="icon fa fa-check"></i> Изменения сохранены!</h4>
                            </div>
                            :
                            null
                        }
                    </Modal.Body>
                    <Modal.Footer>
                        {save_btn}
                        <button type="button" className="btn btn-default" onClick={this.handleClose}>Закрыть</button>
                    </Modal.Footer>
                </Modal>
        )
    }
});

module.exports=ServiceModifyModal;

