var $ = require('jquery');
var React = require('react');
var ReactDOM = require('react-dom');
//var Modal = require('react-modal');
import { Modal } from 'react-bootstrap'
var classNames = require('classnames');
var Multiselect = require('react-bootstrap-multiselect');
var InventoryActions = require('../actions/InventoryActions.js');
var InventoryStore = require('../stores/InventoryStore.jsx');
var LoadBar = require('../../common/components/LoadBar.jsx');
var AppActions = require('../../common/actions/AppActions.js');

import Draggable from 'react-draggable';
import ModalDialog from 'react-bootstrap/lib/ModalDialog';

var ParamsList = React.createClass({
    getInitialState: function() {
        return {
            params: [],
            sel_params: []
        }
    },
    makeParamsList: function(a) {
        if (a.error == 0) {
            this.setState({
                params: a.data
            });
        } else {
            console.log('Error when getting params');
        }
    },
    updateParamsList: function() {
        $.ajax({
            type: 'GET',
            url: '/inventory/ajax/equipment/getparams',
            success: this.makeParamsList
        });
    },
    componentDidMount: function() {
        this.updateParamsList();
    },
    pushParams: function() {
        if (typeof this.props.onChange != 'undefined') {
            this.props.onChange(this.state.sel_params);
        }
    },
    paramsChange: function(e) {
        var p=this.state.params;
        var sel_params = []
        for(let i in p) {
            if(p[i].value == e.val()) {
                p[i].selected = !p[i].selected;
            }
            if (p[i].selected) {
                sel_params.push(p[i].value)
            }
        }
        this.setState({
                params: p,
                sel_params: sel_params
            }, this.pushParams);
    },
    paramsSelectAll: function(e) {
        var params=this.state.params;
        var sel_params = [];
        for(let i in params) {
            params[i].selected = true;
            sel_params.push(params[i].value);
        }
        this.setState({
                params: params,
                sel_params: sel_params
            }, this.pushParams);
    },
    paramsDeselectAll: function(e) {
        var params=this.state.params;
        for(let i in params) {
            params[i].selected = false;
        }
        this.setState({
                params: params,
                sel_params: []
            }, this.pushParams);
    },
    render: function() {
        return (
            <div>
                <label>Изменяемые параметры:</label>
                <Multiselect
                    onChange={this.paramsChange}
                    onSelectAll={this.paramsSelectAll}
                    onDeselectAll={this.paramsDeselectAll}
                    data={this.state.params}
                    includeSelectAllOption={true}
                    multiple
                />
            </div>
        )
    }
});

var UploadForm = React.createClass({
    getInitialState: function() {
        return {

        }
    },
    handleChangeParams: function(params) {
        if (typeof this.props.handleChangeParams != 'undefined') {
            this.props.handleChangeParams(params);
        }
    },
    changeFile: function() {
        if (typeof this.props.handleChangeParams != 'undefined') {
            this.props.fileField(this.refs.paramsFile.files[0]);
        }
    },
    render: function() {
        return (
            <div className="upload_form">
                <div>
                    <label>Файл с настройками</label>
                    <input type="file"
                        name="paramsFile"
                        title="Загрузить параметры"
                        ref="paramsFile"
                        onChange={this.changeFile}
                    />
                </div>
                <div>
                    <ParamsList
                        onChange={this.handleChangeParams}
                    />
                </div>
            </div>
        )
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

var EquipmentFileLoadModal = React.createClass({
    getInitialState: function() {
        return {
            params: [],
            file_field: null,
            loaded: false,
            new_params: [],
            table_rows: [],
            state: 0
        }
    },
    componentDidMount: function() {
    },
    componentWillReceiveProps: function(np) {
    },
    checkParams: function() {
    },
    handleChangeParams: function(params) {
        this.setState({
            params: params,
            new_params: []
        });
    },
    handleUploadParams: function() {
        if (this.state.file_field) {
            var file = this.state.file_field;
            if (file) {
                this.upload(file);
            }
        }
    },
    handleSaveParamsAnswer: function(data) {
        if (data.error == 0) {
            this.setState({
                state: 1
            });
        } else {
            this.setState({
                state: -1
            });
        }
    },
    handleSaveParams: function(e) {
        $.ajax({
            beforeSend: function(request) {
                return request.setRequestHeader('X-CSRF-Token', $("meta[name='csrf-token']").attr('content'));
            },
            type: "POST",
            url: '/inventory/ajax/equipment/update/file',
            data: {
                params: this.makeParamsList()
            },
            success: this.handleSaveParamsAnswer,
            error: function(data) {
                console.log("Save params file error");
            }
        });
    },
    makeParamsList: function() {
        let params_table = this.state.new_params;
        let new_params_row = {};
        let new_params = {};
        for(let route in params_table) {
            if (!params_table[route].selected ) continue;
            new_params_row = {};
            let params = params_table[route].params;
            for(let param in params) {
                if (params[param].changed) {
                    console.log(params[param].new)
                    new_params_row[param] = params[param].new;
                }
            }
            if (Object.keys(new_params_row).length > 0) {
                console.log(new_params_row);
                new_params[route] = new_params_row;
            }
        }
        console.log('MakeParams');
        console.log(new_params);
        return new_params;
    },
    handleFileUpload: function(data) {
        for(let route in data) {
            data[route].selected = true;
        }
        console.log('handleFileUpload');
        console.log(data);
        this.setState({
            new_params: data
        });
    },
    renderParamsTable: function() {
        let data = this.state.new_params;
        let table = [];
        let table_row = [];
        table_row.push(<th>Route</th>);
        for (let param in this.state.params) {
            table_row.push(<th>{this.state.params[param]}</th>);
        }
        table.push(<thead><tr>{table_row}</tr></thead>);
        for(let route in data) {
            let row = {};
            let table_row = [];
            let params = data[route].params;
            table_row.push(<td>{route}</td>);
            for(let pname in params) {
                if (params[pname].changed) {
                    table_row.push(
                        <td className="param">
                            <span className='old'>{params[pname].old?params[pname].old:'<empty>'}</span>
                            <span className='new'>{params[pname].new?params[pname].new:'<empty>'}</span>
                        </td>);
                    row[pname] = params[pname].new;
                } else {
                    table_row.push(
                        <td className="param">
                            {params[pname].old}
                        </td>);
                }
            }
            table_row.push(<td>
                    <input type="checkbox"
                           checked={data[route].selected}
                           onChange={()=>{data[route].selected = !data[route].selected; this.setState({new_params: data})}}
                        />
                </td>);
            table.push(<tbody><tr>{table_row}</tr></tbody>);
        }
        return table;
    },
    upload: function(file) {

        if (!file) return;

        var fd = new FormData();
        fd.append("paramsFile", file);
        if (!this.props.routesFromFile) {
            fd.append("routes", this.props.routes);
        }
        fd.append("params", this.state.params);

        $.ajax({
            beforeSend: function(request) {
                return request.setRequestHeader('X-CSRF-Token', $("meta[name='csrf-token']").attr('content'));
            },
            type: "POST",
            url: "/inventory/ajax/equipment/paramsfile",
            data: fd,
            contentType: false,
            processData: false,
            success: this.handleFileUpload,
            error: function(data) {
                console.log("Upload file error");
            }
        });
    },
    fileField: function(file_field) {
        this.setState({
            file_field: file_field
        });
    },
    handleClose: function() {
        this.setState(this.getInitialState(), this.props.handleClose);
    },
    render: function() {
        let content = null;
        let msg = null;
        if (this.state.state == -1) {
            msg = (<span className="error_msg">Во время сохранения параметров произошли ошибки</span>);
        } else if (this.state.state == 1) {
            msg = (<span className="error_msg">Изменения сохранены успешно</span>);
        }
        if (this.state.new_params.length == 0) {
            content = (<UploadForm
                        handleChangeParams={this.handleChangeParams}
                        fileField={this.fileField}
            />);
        } else {
            content = (
                <table className={classNames(
                'change_list',
                'table',
                'table-bordered',
                'table-hover',
                {error: this.state.state==-1,
                saved: this.state.state==1
                })
                    }
                >
                    {this.renderParamsTable()}
                </table>
            )
        };
        var save_btn = null;
        if (this.state.state == 0) {
            if (this.state.new_params.length == 0) {
                save_btn=(<button type="button" className="btn btn-primary" onClick={this.handleUploadParams}>Загрузить</button>);
            } else {
                save_btn=(<button type="button" className="btn btn-primary" onClick={this.handleSaveParams}>Сохранить</button>);
            }
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
                    <Modal.Title>Изменение параметров из файла</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {content}
                    {msg}
                </Modal.Body>
                <Modal.Footer>
                    {save_btn}
                    <button type="button" className="btn btn-default" onClick={this.handleClose}>Закрыть</button>
                </Modal.Footer>
            </Modal>
        )
    }
});

module.exports=EquipmentFileLoadModal;

