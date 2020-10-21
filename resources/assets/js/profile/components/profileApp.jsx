var $ = require('jquery');
import React, { PropTypes, Component } from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';
import { Modal } from 'react-bootstrap'
import Draggable from 'react-draggable';
import ModalDialog from 'react-bootstrap/lib/ModalDialog';

import AppStore from '../../common/stores/AppStore';
import AppActions from '../../common/actions/AppActions';
import DraggableModalDialog from '../../common/components/DraggableModalDialog'
import FormTextField from '../../common/components/FormTextField';
import HelpTooltip from '../../common/components/HelpTooltip';

function renderClass(state) {
    return classNames(
        'form-group',
        {'has-error': state == -2},
        {'has-warning': state == -1},
        {'has-success': state == 2}
    );
};

function renderIcon(state) {
    switch (state) {
        case 2:
            return <i className="fa fa-check"></i>;
        case -1:
            return <i className="fa fa-bell-o"></i>;
        case -2:
            return <i className="fa fa-times-circle-o"></i>;
    }
};

class InputName extends Component{
    constructor(props) {
        super(props);

        this.state = {
            save: null,
            name: {
                value: this.props.name,
                state: 0,
                msg: ''
            },
            email: {
                value: this.props.email,
                state: 0,
                msg: ''
            },
            disbutton: true
        };
    };

    checkParams = () => {
    };

    render = () => {
        return(
            <div className="box">
                <div className="box-header">
                    <div className="box-title">Информация о пользователе</div>
                    <HelpTooltip>
                        <div>Тестовая помощь<br/>Тестовая помощь 2<br/>UI/UX</div>
                    </HelpTooltip>
                </div>
                <div className="box-body">
                    <FormTextField
                        label="Логин"
                        value={this.props.login}
                        disabled
                        />
                    <FormTextField
                        label="Имя"
                        value={this.state.name.value}
                        state={this.state.name.state}
                        msg={this.state.name.msg}
                        onChange={this.handleNameChange}
                        />
                    <FormTextField
                        label="E-mail"
                        value={this.state.email.value}
                        state={this.state.email.state}
                        msg={this.state.email.msg}
                        onChange={this.handleEmailChange}
                        />
                </div>
                <div className="box-footer">
                    <button className="btn btn-primary" onClick={this.saveName}>Сохранить</button>
                </div>
        </div>
        )
    };

    handleEmailChange = (event) => {
        this.onChange();
        this.setState({email: {
            state: 1,
            value: event.target.value,
            msg: ''
        }});
    };
    handleNameChange = (event) => {
        this.onChange();
        this.setState({name: {
            state: 1,
            value: event.target.value,
            msg: ''
        }})
    };

    /**
     * Event handler for 'change' events coming from the TodoStore
     */
    onChange = () => {
        if (this.state.name != this.props.name || this.state.email != this.props.email ) {
            this.setState({disbutton: false});
        }
    };

    saveName = () => {
        $.ajax({
            beforeSend: function(request) {
                return request.setRequestHeader('X-CSRF-Token', $("meta[name='csrf-token']").attr('content'));
            },
            type: "POST",
            url: "/profile/user-settings/save-name",
            data: ({
                "name": this.state.name.value,
                "email": this.state.email.value
            }),
            success: function (a) {
                this.setState({save: {'error': a.error, 'msg': a.msg}});
            }.bind(this),
            error: function (xhr) {
                console.log("Save-name error");
            }
        });
    };
};

class Avatar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            avatar: this.props.avatar,
            src: this.props.avatar ? this.props.avatar : "/img/avatar/default.jpg"
        }
    };

    handleAvatarChange = (e) => {
        e.preventDefault();
        console.log('change');
        var avatar = e.target.files[0];
        if (avatar) {
            console.log(avatar);
            this.upload(avatar);
        }
    };

    render = () => {
        return (
            <div className="box">
                <div className="box-header">
                    <div className="box-title">Аватар</div>
                    <HelpTooltip>
                        <div>Тестовая помощь</div>
                    </HelpTooltip>
                </div>
                <div className="box-body">
                    <div className="form-group">
                        <img src={this.state.src}/>
                    </div>
                    <div className="form-group">
                        <input type="file" className="avatar-file" title="Загрузить аватар" onChange={this.handleAvatarChange}/>
                    </div>
                </div>
                {(this.state.avatar)
                    ?
                    <div className="box-footer">
                        <button className="btn btn-primary" onClick={this.deleteAvatar}>Удалить</button>
                    </div>
                    :
                    null
                }
            </div>
        )
    };

    upload = (file) => {
        // файл из тега <input> или из Drag'n Drop
        // Является ли файл изображением?

        if (!file || !file.type.match(/image.*/)) return;

        var fd = new FormData();
        fd.append("avatar", file);

        $.ajax({
            beforeSend: function(request) {
                return request.setRequestHeader('X-CSRF-Token', $("meta[name='csrf-token']").attr('content'));
            },
            type: "POST",
            url: "/profile/user-settings/avatar",
            data: fd,
            contentType: false,
            processData: false,
            success: function(data) {
                this.setState({src: '/img/avatar/'+this.props.login+'.jpg?r='+Math.floor(Math.random()*9999), avatar: '/img/avatar/'+this.props.login+'.jpg'});
            }.bind(this),
            error: function(data) {
                console.log("Upload avatar error");
            }
        });
    };

    deleteAvatar = () => {
        $.ajax({
            beforeSend: function(request) {
                return request.setRequestHeader('X-CSRF-Token', $("meta[name='csrf-token']").attr('content'));
            },
            type: "DELETE",
            url: "/profile/user-settings/avatar",
            success: function (a) {
                this.setState({save: {'error': a.error, 'msg': a.msg}, src: "/img/avatar/default.jpg", avatar: null});
            }.bind(this),
            error: function (xhr) {
                console.log("Delete avatar error");
            }
        });
    };
};

class DbPass extends Component{

    constructor(props) {
        super(props);
        this.state = {
            modalIsOpen: false,
            dbLogin: {
                value: this.props.dbLogin || '',
                state: 0,
                msg: ''
            },
            dbPass: {
                value: this.props.dbPass || '',
                state: 0,
                msg: ''
            },
            masterPass: {
                value: '',
                state: 0,
                msg: ''
            },
            error: '',
            save: '',
            dbCon: parseInt(this.props.isconnect)
        };
    };

    saveDbPassword = () => {
        if (this.state.dbPassword == '') {
            this.setState({error:"Заполните поле"});
        } else {
            this.setState({
                error:"",
                modalIsOpen: true
            });
        }
    };

    closeModal = () => {
        this.setState({modalIsOpen: false});
    };

    handleModalCloseRequest = () => {
        // opportunity to validate something and keep the modal open even if it
        // requested to be closed
        this.setState({modalIsOpen: false});
    };

    handleSaveClicked = (e) => {
        $.ajax({
            beforeSend: function (request) {
                return request.setRequestHeader('X-CSRF-Token', $("meta[name='csrf-token']").attr('content'));
            },
            type: "POST",
            data: {
                dbLogin: this.state.dbLogin.value,
                dbPass: this.state.dbPass.value,
                masterPass: this.state.masterPass.value
            },
            url: "/profile/user-settings/db-pass",
            success: function (a) {
                var dbCon=0;
                if (a.error == 0) {
                    dbCon=1;
                } else {
                    dbCon=-1;
                }
                this.setState({save: {'error': a.error, 'msg': a.msg}, 'dbCon': dbCon, modalIsOpen: false});
                console.log(a);
            }.bind(this),
            error: function (xhr) {
                console.log("Save db-pass error");
            }
        });
    };

    handleLoginChange = (val) => {
        this.setState({
            dbLogin: val
        });
    };

    handlePassChange = (val) => {
        this.setState({
            dbPass: val
        });
    };

    handleMasterPassChange = (pass) => {
        if (pass.state == 1) {
            if (pass.value == this.state.dbPass.value) {
                pass.state = -1;
                pass.msg = 'Пароль от CRM не обязательно должен совпадать с паролем от NOC. Это не один и тотже пароль.'
            }
        }
        this.setState({
            masterPass: pass
        });
    };

    connectionMsg = () => {
        let className = classNames(
            {noc_con_success: this.state.dbCon == 1},
            {noc_con_error: this.state.dbCon == -1}
        );
        switch(this.state.dbCon) {
            case 0:
                return <span className={className}><i className="fa fa-circle-thin" aria-hidden="true"></i> Пароль не задан</span>;
            case 1:
                return <span className={className}><i className="fa fa-circle" aria-hidden="true"></i> Подключение установлено</span>;
            case -1:
                return <span className={className}><i className="fa fa-times" aria-hidden="true"></i> Неправильный логин/пароль</span>;
        }
    };
    canSave = () => {
        return this.state.masterPass.state == 1 || this.state.masterPass.state == -1;
    };
    canSavePass = () => {
        return ((this.state.dbLogin.state == 1 || this.state.dbLogin.state == -1 || this.state.dbPass.state == 1 || this.state.dbPass.state == -1) &&
            this.state.dbLogin.value != '' && this.state.dbPass.value != '')
    };
    render = () => {
        return (
            <div className="box">
                <div className="box-header">
                    <div className="box-title">Подключение к NOC</div>
                    <HelpTooltip>
                        <div>Для работы c Биллингом, и Inventory <b>необходимо</b> добавить учетную запись, с которой
                            вы входите в <a href="http://noc.tut.net" target="blank">noc.tut.net</a>.
                            <ul>
                                <li>1) Для того, чтобы добавить учетную запись noc.tut.net введите имя пользователя и пароль и нажмите кнопку "Сохранить".</li>
                                <li>2) В появившемся окне введите пароль, который вы используете для входа в CRM.<b>Важно!</b> Это не один и тот же пароль!</li>
                            </ul>
                            <p>После успешного сохранения учетной записи Статус подключения изменится на "Подключение установлено"</p>
                        </div>
                    </HelpTooltip>
                </div>
                <div className="box-body">
                    <div className="form-group">
                        Статус: {this.connectionMsg()}
                    </div>
                    <FormTextField
                        label="Имя пользователя"
                        value={this.state.dbLogin.value}
                        state={this.state.dbLogin.state}
                        msg={this.state.dbLogin.msg}
                        onChange={this.handleLoginChange}
                        fieldType={'login'}
                        help={<p>Имя пользователя для входа в <a href="http://noc.tut.net">noc.tut.net</a>.</p>}
                        required={true}
                        />
                    <FormTextField
                        label="Пароль"
                        value={this.state.dbPass.value}
                        state={this.state.dbPass.state}
                        msg={this.state.dbPass.msg}
                        onChange={this.handlePassChange}
                        fieldType="password"
                        help={<p>Пароль для входа в <a href="http://noc.tut.net">noc.tut.net</a>.</p>}
                        required={true}
                        />
                    <Modal
                        dialogComponentClass={DraggableModalDialog}
                        show={this.state.modalIsOpen}
                        onHide={this.handleModalCloseRequest}
                        animation={false}
                        backdrop={false}
                        enforceFocus={false}
                        >
                        <Modal.Header closeButton>
                            <Modal.Title>Подтверждение сохранения

                            </Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <FormTextField
                                label="Введите пароль от вашей учетной записи в CRM"
                                value={this.state.masterPass.value}
                                state={this.state.masterPass.state}
                                msg={this.state.masterPass.msg}
                                onChange={this.handleMasterPassChange}
                                fieldType={'password'}
                                help={<p>Пароль для входа в CRM. <b>Важно!</b> Это не пароль от noc.tut.net</p>}
                                />
                        </Modal.Body>
                        <Modal.Footer>
                            <button type="button" className="btn btn-primary" onClick={this.handleSaveClicked} disabled={!this.canSave()}>Сохранить</button>
                            <button type="button" className="btn btn-default" onClick={this.handleModalCloseRequest}>Закрыть</button>
                        </Modal.Footer>
                    </Modal>
                </div>
                <div className="box-footer">
                    <button className="btn btn-primary" onClick={this.saveDbPassword} disabled={!this.canSavePass()}>Сохранить</button>
                </div>
            </div>
    )}
};

class ProfileApp extends Component{

    /**
     * @return {object}
     */
    render = () => {
        return (
        <div className="row">
            <div className="col-md-6">
                <Avatar
                    login={this.props.login}
                    avatar={this.props.avatar}
                    />
            </div>
            <div className="col-md-6">
                <InputName
                    uid={this.props.uid}
                    login={this.props.login}
                    name={this.props.name}
                    email={this.props.email}
                />
            </div>
            <div className="col-md-6">
                <DbPass
                    uid={this.props.uid}
                    isconnect={this.props.isconnect}
                    dbLogin={this.props.dbLogin}
                    dbPass={this.props.dbPass}
                />
            </div>
        </div>
        )}
};

ReactDOM.render(
    <ProfileApp
        uid={User.uid}
        login={User.login}
        name={User.name}
        email={User.email}
        avatar={User.avatar}
        isconnect={User.isconnect}
        dbLogin={User.dbLogin}
        dbPass={User.dbPass}
    />,
    document.getElementById('user_settings')
);
