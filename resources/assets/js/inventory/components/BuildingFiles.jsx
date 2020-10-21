import React, { PropTypes, Component } from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';
import FormTextField from '../../common/components/FormTextField';
import LoadBar from '../../common/components/LoadBar';
import AppActions from '../../common/actions/AppActions.js';
import ErrorMsg from '../../common/components/ErrorMsg';
import { Modal } from 'react-bootstrap';
import DraggableModalDialog from '../../common/components/DraggableModalDialog';

import * as Table from 'reactabular-table';

export default class BuildingFiles extends Component{
    static propTypes = {
        addressId: PropTypes.number.isRequired
    };

    constructor(props) {
        super(props);
        this.state = {
            files: []
        }
    };

    deleteFile = (href) => {
        console.log(href);
        fetch(href, {
            headers: {
                'X-CSRF-Token': document.querySelector("meta[name='csrf-token']")?document.querySelector("meta[name='csrf-token']").getAttribute('content'):'',
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: 'DELETE',
            credentials: 'include'
        })
        .then(() => {
            this.getFiles();
            });
    };

    getColumns = () => {
        return [
            {
                property: 'file_name',
                header: {
                    label: 'Имя'
                },
                cell: {
                    formatters:[
                        (file_name, row) => {
                            return <a href={row.rowData.href} target="_blank">{file_name}</a>
                        }
                    ]
                },
            },
            {
                property: 'group_desk',
                header: {
                    label: 'Группа'
                }
            },
            {
                property: 'subgroup_desk',
                header: {
                    label: 'Тип'
                }
            },
            {
                property: 'owner',
                header: {
                    label: 'Владелец'
                }
            },
            {
                property: 'note',
                header: {
                    label: 'Примечание'
                }
            },
            {
                property: 'id',
                header: {
                    label: 'x'
                },
                cell: {
                    formatters:[
                        (id, row) => {
                            if (row.rowData.can_delete)
                            return <i className="fa fa-times link" onClick={(id)=>{this.deleteFile(row.rowData.href)}}></i>
                            else return '';
                        }
                    ]
                }
            }
        ];
    };
    getFiles=() => {
        AppActions.initLoading();
        fetch('/inventory/ajax/building/'+this.props.addressId+'/files/', {method: 'GET', credentials: 'include'})
            .then(response => response.json())
            .then(json => {
                AppActions.cancelLoading();
                if (json.error == 0) {
                    this.setState({files: json.data});
                }
            });
    };
    componentDidMount = () => {
        this.getFiles();
    };
    handleAddFile=() => {
        this.getFiles();
    };
    onRow = (row, { rowIndex }) => {
        let rowClass = classNames(
            {'odd-row': rowIndex%2 == 0},
            {'even-row': rowIndex%2 != 0}
        );
        return {
            className: rowClass
        };
    };

    render = () => {
        return (
            <div>
                <Table.Provider
                    className="table table-bordered table-hover dataTable"
                    columns={this.getColumns()}
                    style={{ overflowX: 'auto' }}
                    >
                    <Table.Header />
                    {this.state.files.length > 0 ?
                        <Table.Body
                            rows={this.state.files}
                            rowKey="id"
                            onRow={this.onRow}
                            />
                        :
                        <tbody>
                           <tr>
                                <td colSpan={this.getColumns().length}>Файлов не найдено</td>
                           </tr>
                        </tbody>
                    }
                </Table.Provider>
                <UploadFileFormModal
                    onAddFile={this.handleAddFile}
                    addressId={this.props.addressId}
                    can_addfiles={this.props.can_addfiles==1}
                    />
            </div>
        )
    }
};

class UploadFileFormModal extends Component {
    static propTypes = {
        addressId: PropTypes.number.isRequired,
        onAddFile: PropTypes.func,
        can_addfiles: PropTypes.bool
    };
    constructor(props) {
        super(props);
        this.state = {
            show: false,
            note: {
                value: '',
                state: 0,
                msg: ''
            },
            groupId: 0,
            subgroupId: 0,
            fileGroups: [],
            fileSubgroups: [],
        };
    };
    componentDidMount = () => {
        this.getGroups();
    };
    handleFileUpload = (e) => {
        e.preventDefault();
        let fd = new FormData();
        fd.append('file', this.state.file);
        fd.append('note', this.state.note.value);
        fd.append('group_id', this.state.groupId);
        fd.append('subgroup_id', this.state.subgroupId);
        fetch('/inventory/ajax/building/'+this.props.addressId+'/file', {
            headers: {
                'X-CSRF-Token': document.querySelector("meta[name='csrf-token']")?document.querySelector("meta[name='csrf-token']").getAttribute('content'):'',
            },
            method: 'POST',
            body: fd,
            credentials: 'include'
        })
          .then(()=>{this.handleClose(); this.props.onAddFile();});
    };
    handleFileChange = (e) => {
        this.setState({file: e.target.files[0]});
    };
    handleNoteChange = (note) => {
        this.setState({
            note: note
        })
    };
    getGroups = () => {
        fetch('/inventory/ajax/building/file/groups/', {method: 'GET', credentials: 'include'})
            .then(response => response.json())
            .then(json => {
                if (json.error == 0) {
                    this.setState({
                        groupdId: json.data[0].id,
                        fileGroups: json.data,
                    },
                    this.getSubgroups(json.data[0].id));
                }
            });
    };
    getSubgroups = (group_id) => {
        if (group_id != 0) {
            fetch('/inventory/ajax/building/file/group/' + group_id + '/subgroups', {method: 'GET', credentials: 'include'})
                .then(response => response.json())
                .then(json => {
                    if (json.error == 0) {
                        this.setState({
                            fileSubgroups: json.data,
                            subgroupId: json.data[0].id
                        });
                    }
                });
        } else {
            this.setState({fileSubgroups: [], subgroupId: 0})
        }
    };
    handleClose = () => {
        this.setState({
            show: false,
            note: {
                value: '',
                state: 0,
                msg: ''
            },
            groupdId: this.state.fileGroups[0].id
        });
        this.getSubgroups(this.state.fileGroups[0].id);
    };
    checkFields = () => true;
    render = () => {
        if (!this.props.can_addfiles) return null;
        return (
            <div>
                <button className="btn btn-primary" onClick={() => {this.setState({show: true})}}>Загрузить</button>
                <Modal
                    dialogComponentClass={DraggableModalDialog}
                    show={this.state.show}
                    onHide={this.handleClose}
                    animation={false}
                    backdrop={false}
                    enforceFocus={false}
                    >
                    <Modal.Header closeButton>
                        <Modal.Title>Загрузка файла</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <FormTextField
                            label="Описание"
                            value={this.state.note.value}
                            state={this.state.note.state}
                            msg={this.state.note.msg}
                            onChange={this.handleNoteChange}
                            fieldType={'textarea'}
                            />
                        <div className="form-group">
                            <label>Группа:</label>
                            <select onChange={(e)=>{this.setState({groupId:e.target.value}, this.getSubgroups(e.target.value))}}>
                                {this.state.fileGroups.map((item) => {
                                    return <option value={item.id}>{item.name}</option>
                                })}
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Тип:</label>
                            <select
                                onChange={(e)=>{this.setState({subgroupId: e.target.value})}}
                                >
                                {this.state.fileSubgroups.map((item) => {
                                    return <option value={item.id}>{item.name}</option>
                                })}
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Файл:</label>
                            <input type="file"
                                onChange={this.handleFileChange}
                                />
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        {this.checkFields()?
                            <button type="button" className="btn btn-default" onClick={this.handleFileUpload}>Загрузить</button>
                            :
                            null
                        }
                        <button type="button" className="btn btn-default" onClick={this.handleClose}>Закрыть</button>
                    </Modal.Footer>
                </Modal>
                <LoadBar />
                <ErrorMsg />
            </div>
        )
    };
};

ReactDOM.render(
    <BuildingFiles
        addressId={BuildingData.address_id}
        can_addfiles={BuildingData.can_addfiles}
        />,
    document.getElementById('files-list')
);