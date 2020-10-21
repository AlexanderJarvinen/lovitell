var $ = require('jquery');
var React = require('react');
var ReactDOM = require('react-dom');
var Modal = require('react-modal');
var classNames = require('classnames');
var BuildStatusSelect = require('./BuildStatusSelect');
var Autocomplete = require('react-autocomplete');

//var ServiceWrap = require('./ServiceWrap');
var CompaniesWrap = require('./CompaniesWrap');

import FormSelectField from '../../common/components/FormSelectField.jsx';


var CitySelect = React.createClass({
    getDefaultProps: function() {
        return {
            className: ''
        }
    },
    render: function() {
        let city_field=null;
        if (this.props.rights) {
            let city_list = [];
            city_list.push(<option key={0} id={0} value={0}>Не выбран</option>);
            for (let city_id in this.props.city_list) {
                city_list.push(
                    <option key={city_id + 1} value={this.props.city_list[city_id].id}>{this.props.city_list[city_id].desk}</option>
                );
            }
            city_field=(<select onChange={this.props.cityChange} className='form-control' value={this.props.city_id}>
                {city_list}
            </select>);
        } else {
            for(let i in this.props.city_list) {
                if (this.props.city_list[i].id == this.props.city_id) {
                    city_field=(<span>{this.props.city_list[i].desk}</span>);
                }
            }
        }
        return (
            <div className={this.props.className}>
                <label htmlFor="city">Город:</label>
                {city_field}
            </div>
        );
    }
});

var RegionSelect = React.createClass({
    getDefaultProps: function() {
        return {
            className: ''
        }
    },
    getInitialState: function() {
        return {
            selected: this.props.region_id,
            selected_desk: '',
            regions: []
        }
    },
    componentDidMount: function() {
        this.makeRegionList(this.props.regions)
    },
    makeRegionList: function(data) {
        let regions = [];
        let selected_desk = '';
        regions.push(<option key={0} id={0} value={0}>Не выбран</option>);
        for (var i = 0; i < data.length; i++) {
            var option = data[i];
            regions.push(
                <option key={i+1} value={option.region_id}>{option.desk}</option>
            );
            if (this.state.selected) {
                if (option.region_id == this.state.selected) {
                    selected_desk = option.desk;
                }
            }
        }
        this.setState({
            regions,
            selected_desk
        });
    },
    updateRegionData: function(city_id) {
        city_id = city_id || this.props.city_id;
        $.ajax({
            type: 'GET',
            url: '/inventory/regions/' + city_id,
            success: this.makeRegionList
        });
    },
    componentWillReceiveProps: function(nextProps) {
        if (this.props.city_id != nextProps.city_id && nextProps.city_id != 0) {
            this.updateRegionData(nextProps.city_id);
        }
    },
    render: function() {
        if (this.props.city_id == 0) return null;
        let region_field=null;
        if (this.props.rights) {
            region_field=(<select className='form-control' onChange={this.props.regionChange} value={this.props.region_id}>
                    {this.state.regions}
            </select>);
        } else {
            region_field=(<span>{this.state.selected_desk}</span>);
        }
        return (
            <div className={this.props.className}>
                <label htmlFor="region">Регион:</label>
                {region_field}
            </div>
        );
    }
});

var NewStreetButton = React.createClass({
    getInitialState: function() {
        return {
            error: 0,
            status: 0,
            modalIsOpen: false,
            street_name: '',
            street_types: [],
            street_type: 0,
            newstreet_type: 1
        }
    },
    makeStreetTypes: function(data) {
        for(let k=0; k<data.length; k++) {
            this.state.street_types.push(
                <option key={k} value={data[k].type}>{data[k].prefix}</option>
            )
        }
    },
    componentDidMount: function() {
        $.ajax({
            type: "GET",
            url: "/inventory/street-types",
            success: this.makeStreetTypes
        });
    },
    _handleModalCloseRequest() {
        // opportunity to validate something and keep the modal open even if it
        // requested to be closed
        this.setState({modalIsOpen: false});
    },
    _handleAddStreet: function() {
        this.setState({modalIsOpen: true});
    },
    _handleSaveStatus: function(a) {
        if (a.error == 0) {
            this.setState({status: 1});
        } else {
            this.setState({status: -1});
        }
        this.props.handleAddNewStreet();
        setTimeout(()=> {
            this.setState({modalIsOpen: false})
        }, 5000);
    },
    _handleSaveStreet: function(e){
        $.ajax({
            beforeSend: function (request) {
                return request.setRequestHeader('X-CSRF-Token', $("meta[name='csrf-token']").attr('content'));
            },
            type: "POST",
            data: {
                street_name: this.state.street_name,
                region_id: this.props.region_id,
                street_type: this.state.newstreet_type
            },
            url: "/inventory/street",
            success: this._handleSaveStatus,
            error: function (xhr) {
                console.log("Save db-pass error");
            }
        });
    },
    render: function() {
        return (
            <div className="new-street">
                <a href="#" onClick={this._handleAddStreet}><i className="fa fa-plus"></i></a>
                <Modal
                    className="Modal__Bootstrap modal-dialog"
                    closeTimeoutMS={150}
                    isOpen={this.state.modalIsOpen}
                    onRequestClose={this.handleModalCloseRequest}
                >
                    <div className="modal-content">
                        <div className="modal-header">
                            <button type="button" className="close" onClick={this.handleModalCloseRequest}>
                                <span aria-hidden="true">&times;</span>
                                <span className="sr-only">Close</span>
                            </button>
                            <h4 className="modal-title">Добавить улицу</h4>
                        </div>
                        <div className="modal-body">
                            <label htmlFor='street-name'>Название улицы</label>
                            <select name='street-type' onChange={(e)=>{this.setState({newstreet_type:e.target.value});}} value={this.state.newstreet_type}>
                            {this.state.street_types}
                            </select>
                            <input name='street-name' value={this.state.street_name} onChange={(e)=>{this.setState({street_name:e.target.value})}}/>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-primary" onClick={this._handleSaveStreet} disabled={this.state.street_name==''}>Добавить</button>
                            <button type="button" className="btn btn-default" onClick={this._handleModalCloseRequest}>Закрыть</button>
                        </div>
                    </div>
                </Modal>
            </div>
        )
    }
});

var StreetSelect = React.createClass({
    getDefaultProps: function() {
        return{
            className:''
        }
    },
    getInitialState: function() {
        return {
            selected: 0,
            selected_desk: '',
            streets: [],
        }
    },
    componentDidMount: function() {
        this.makeStreetList(this.props.streets)
    },
    makeStreetList: function(data) {
        let streets = [];
        let selected_desk = '';
        for (var i = 0; i < data.length; i++) {
            var option = data[i];
            streets.push({
                value:option.id,
                descr: (option.id==0?'Не выбрана':option.street)
            });
        }
        this.setState({
            selected_desk,
            streets,
        });
    },
    updateStreetData: function(region_id) {
        region_id = region_id || this.props.region_id;
        $.ajax({
            type: 'GET',
            url: '/inventory/streets/' + region_id,
            success: this.makeStreetList
    });
    },
    componentWillReceiveProps: function(nextProps) {
        if (this.props.region_id != nextProps.region_id && nextProps.region_id != 0) {
           this.updateStreetData(nextProps.region_id);
        }
    },
    render: function() {
        if (this.props.region_id == 0) return null;
        return (
            <div className={this.props.className}>
                <FormSelectField
                    data={this.state.streets}
                    value={this.props.street_id.value}
                    state={this.props.street_id.state}
                    msg={this.props.street_id.msg}
                    onChange={this.props.streetChange}
                    label={'Улица'}
                    required={true}
                    disabled={!this.props.rights}
                    />
                {this.props.new_street_rights ? <NewStreetButton region_id={this.props.region_id} handleAddNewStreet={this.updateStreetData} />:''}
            </div>
        )
    }
});
var ButtonPane = React.createClass({
    render: function() {
        if (this.props.status == -4) return null;
        let btn_text = 'Сохранить';
        switch (this.props.status) {
            case 1:
                btn_text = 'Сохранение';
                break;
            case 2:
                btn_text = 'Сохранено';
                break;
            case -1:
                btn_text = 'Ошибка';
                break;
            case -2:
                btn_text = 'Заполните все поля';
                break;
        }
        return(
            <div className="buttons form-group">
                <button className="button btn btn-primary" onClick={this.props.saveHandler} disabled={this.props.status!=0}>{btn_text}</button>
            </div>
        )
    }
});

var CloneBuild = React.createClass({
  render: function() {
      let content = null;
      if (this.props.clone_build == 0 && this.props.builds_on_street.length == 0) return null;
      if (this.props.clone_build !=0 ) {
          let link = '/inventory/building/'+this.props.clone_build.address;
          content = <div className="clone-build">
              Дом с указанным адресом существует.
              <a href={link}>Перейти к редактированию>></a>
          </div>
      } else {
          let b=[];
          for(let k in this.props.builds_on_street) {
              let build = this.props.builds_on_street[k];
              b.push(
                  <li><a href={"/inventory/building/"+build.address}>{build.home}</a></li>
              )
          }
          content = <div>
              <b>Дома на этой улице:</b>
              <ul className="build-list">
                {b}
            </ul>
            </div>
      }
      return(
          <div className="search-builds">
              {content}
          </div>
      )
  }
});

var AddressParams = React.createClass({
    render: function() {
        let style=classNames(
            'form-group',
            {
                changed: this.props.state==1,
                saved: this.props.state==2,
                error: this.props.state==-1
            }
        );
        let house_field=null;
        let body_field=null;
        if (this.props.rights) {
            house_field=(<input type="text" size="1" name="house" className='form-control' onChange={this.props.buildChange} value={this.props.build}/>);
            body_field=(<input type="text" name="body" size="1" className='form-control' onChange={this.props.bodyChange} value={this.props.body}/>);
        } else {
            house_field=(<span>{this.props.build}</span>);
            body_field=(<span>{this.props.body}</span>);
        }
        return (
            <div className="build_address">
                <CitySelect
                    city_list={this.props.city_list}
                    cityChange={this.props.cityChange}
                    city_id={this.props.city_id}
                    rights={this.props.rights}
                    className={style}
                />
                <RegionSelect
                    regions={this.props.regions}
                    regionChange={this.props.regionChange}
                    region_id={this.props.region_id}
                    city_id={this.props.city_id}
                    rights={this.props.rights}
                    className={style}
                />
                <StreetSelect
                    region_id={this.props.region_id}
                    street_id={this.props.street_id}
                    streetChange={this.props.streetChange}
                    new_street_rights={this.props.new_street_rights}
                    streets={this.props.streets}
                    rights={this.props.rights}
                    className={style}
                />
                <div className={style}>
                    <label htmlFor="house">Дом:</label>
                    {house_field}
                </div>
                <div className={style}>
                    <label htmlFor="body">Корпус:</label>
                    {body_field}
                </div>
           </div>
        )
    }
});
var BuildingParams = React.createClass({

    getInitialState: function(){
        let home_types =[];
        let selected_home_type = '';
        for (var i = 0; i < this.props.build_types.length; i++) {
            var option = this.props.build_types[i];
            home_types.push(
                <option key={i} value={option.type}>{option.desk}</option>
            );
            if (option.type == this.props.build_type) {
                selected_home_type = option.desk;
            }
        }
        return {
            home_types: home_types,
            selected_home_type: selected_home_type
        }
    },
    render: function() {
        if (this.props.street_id == 0) return null;
        let type_field = (<span>{this.props.build_type_desk}</span>);
        let entrances_field = (<span>{this.props.entrance}</span>);
        let floors_field = (<span>{this.props.floors}</span>);
        let clients_field = (<span>{this.props.clients}</span>);
        let note_field = (<span>{this.props.note}</span>);
        let memo_field = (<span>{this.props.memo}</span>);
        let price_field = (<span>{this.props.price}</span>);
        let style=classNames(
            'form-group',
            {
                changed: this.props.state==1,
                saved: this.props.state==2,
                error: this.props.state==-1
            });
        if (this.props.rights) {
            type_field = (<select name="home_type" className="form-control" onChange={this.props.build_typeChange} value={this.props.build_type}>
                        {this.state.home_types}
            </select>);
            entrances_field = (<input type="text" className="form-control" name="entrances" size="1" onChange={this.props.entranceChange} value={this.props.entrance } />);
            floors_field = (<input type="text" className="form-control" name="floors" size="1" onChange={this.props.floorsChange} value={this.props.floors} />);
            clients_field = (<input type="text" className="form-control" name="clients" size="1" onChange={this.props.clientsChange} value={this.props.clients} />);
            note_field = (<textarea name="note" className="form-control" rows="7" style={{width: 100+'%'}} title="Note" onChange={this.props.noteChange} value={this.props.note}></textarea>);
            memo_field = (<textarea name="memo" className="form-control" rows="7" style={{width: 100+'%'}} title="Memo" onChange={this.props.memoChange} value={this.props.memo}></textarea>);
            price_field = (<input type="text" className="form-control" name="price" size="1" onChange={this.props.priceChange} value={this.props.price} />)
        } else {
            type_field = (<span>{this.state.selected_home_type}</span>);
        }
        /*<BuildStatusSelect
            address_id={this.props.address_id}
            build_status={this.props.build_status}
            build_statuses={this.props.build_statuses}
            build_status_desk={this.props.build_status_desk}
            onChange={this.props.onStatusChange}
            rights={this.props.can_changestatus}
            state={this.props.status_state}
            /> */
        return (
            <div className="house other form">
                <div className={style}>
                    <label htmlFor="home_type">Тип:</label>
                    {type_field}
                </div>
                <div className={style}>
                    <label htmlFor="entrances">Кол-во подъездов:</label>
                    {entrances_field}
                </div>
                <div className={style}>
                    <label htmlFor="floors">Кол-во этажей:</label>
                    {floors_field}
                </div>
                <div className={style}>
                    <label htmlFor="floors">Помещений:</label>
                    {clients_field}
                </div>
                <div className={style}>
                    <label htmlFor="note">Note:</label>
                    {note_field}
                </div>
                <div className={style}>
                    <label htmlFor="note">Memo:</label>
                    {memo_field}
                </div>
                <div className={style}>
                    <label htmlFor="floors">Цена:</label>
                    {price_field}
                </div>
            </div>
        )
    }
});

var FileUpload = React.createClass({

    _handleFileUpload: function (e) {
        e.preventDefault();
        var file = e.target.files[0];
        if (file) {
            this._upload(file);
        }
    },
    _upload: function(file) {
        var fd = new FormData();
        fd.append("file", file);

        $.ajax({
            beforeSend: function(request) {
                return request.setRequestHeader('X-CSRF-Token', $("meta[name='csrf-token']").attr('content'));
            },
            type: "POST",
            url: "/file/"+this.props.object_type+"/"+this.props.address_id,
            data: fd,
            contentType: false,
            processData: false,
            success: this.props.successUploadHandler,
            error: function(data) {
                console.log("Upload file error");
            }
        });
    },
    render: function () {
        return (
            <div className="file-upload">
                Загрузить новый: <input type="file" title="Загрузить файл" onChange={this._handleFileUpload} />
            </div>
        )
    }

});

var Files = React.createClass({
    getInitialState: function() {
        return {
            files: []
        }
    },
    componentDidMount: function() {
        this.loadFiles();
    },
    uploadHandler: function() {
        this.loadFiles();
    },
    loadFiles: function() {
        $.ajax({
            type: "GET",
            url: "/file-list/"+this.props.object_type+"/"+this.props.address_id,
            success: function(a) {
                this.setState({files: a});
            }.bind(this)
        });
    },
    deleteSuccess: function(id, data) {
        if (data.error == 0) {
            let files = this.state.files;
            files.splice(id,1);
            console.log(files);
            this.setState({files: files})
        } else {
            alert("Ошиба при удалении файла");
        }
    },
    handleDelete: function(params, e) {
        $.ajax({
            beforeSend: function (request) {
                return request.setRequestHeader('X-CSRF-Token', $("meta[name='csrf-token']").attr('content'));
            },
            type: "DELETE",
            url: params.href,
            success: this.deleteSuccess.bind(null, params.file_id)
        });
    },
    makeFileList: function() {
        let data = this.state.files;
        let resp = [];
        for(let k=0; k<data.length; k++) {
            resp.push(
                <li className="file-item" key={k}><a href={data[k].href} >{data[k].name}</a> <a className="del-button btn" onClick={this.handleDelete.bind(null, {'href': data[k].href, 'file_id': k})}></a></li>
            )
        }
        return resp;
    },
    render: function() {
        var li = this.makeFileList();
        console.log(li);
        return (
            <div className="file-list col-md-6">
                <h3>Файлы:</h3>
                <ul className="files">
                    {li}
                </ul>
                <FileUpload successUploadHandler={this.uploadHandler} address_id={this.props.address_id} object_type={this.props.object_type}/>
            </div>
        )
    }
});

var AddressParamsForm = React.createClass({
    propTypes: {
        address_id: React.PropTypes.number.required,
        params: React.PropTypes.array.required,
        onChange: React.PropTypes.func.required,
        city_list: React.PropTypes.array.isRequired,
        regions: React.PropTypes.array.regions,
        streets: React.PropTypes.array.isRequired,
        build_types: React.PropTypes.array.isRequired,
        rights: React.PropTypes.array.number
    },
    getInitialState: function() {
        let params = this.props.params;
        return {
            ...params,
            add_address: false
        }
    },
    checkFilling: function() {
        if (this.state.city_id > 0 &&
            this.state.region_id > 0 &&
            this.state.street_id.value > 0
        ) {
            console.log('Check state');
            console.log(this.state);
            if ((this.state.build_type == 0&&
              this.state.clients != '' &&
              this.state.entrance != '' &&
              this.state.floors != '') ||
              this.state.build_type != 0) {
              this.setState({state: 1}, ()=>{this.props.onChange(this.state)});
            } else {
                this.setState({state: -2}, ()=>{this.props.onChange(this.state)});
            }
        } else {
            if (this.state.street_id.value == 0) {
                this.state.street_id.msg='Выберите улицу';
                this.state.street_id.state=-1;
            }
            this.setState({state: -2}, ()=>{this.props.onChange(this.state)});
        }
        if (this.state.city_id > 0 &&
            this.state.region_id > 0 &&
            this.state.street_id > 0
        ) {
            $.ajax({
                beforeSend: function (request) {
                    return request.setRequestHeader('X-CSRF-Token', $("meta[name='csrf-token']").attr('content'));
                },
                type: "POST",
                data: {
                    region_id: this.state.region_id,
                    street_id: this.state.street_id.value,
                    build: this.state.build,
                    body: this.state.body
                },
                url: "/inventory/building/search/",
                success: this.checkBuildInAddress
            });
        }
    },
    checkBuildInAddress: function(data) {
        if (data.error == 0) {
            let builds = data.builds;
            if (builds.length > 1) {
                this.setState({builds_on_street: builds, clone_build: 0});
            } else if(builds.length == 1 && builds[0].address != this.props.address_id){
                this.setState({clone_build: builds[0], builds_on_street: []});
            } else {
                this.setState({clone_build: 0, builds_on_street: []});
            }
        }
    },
    cityChange: function(e) { this.setState({city_id:e.target.value}, this.checkFilling);},
    regionChange: function(e) {this.setState({region_id:e.target.value, state: 1}, this.checkFilling)},
    streetChange: function(street) {
        this.setState(
            {
                street_id: {
                    value: street.value,
                    state: street.state,
                    msg: street.msg
                },
                state: 1
            },
            this.checkFilling
        )},
    buildChange: function(e) {this.setState({build:e.target.value, state: 1}, this.checkFilling)},
    bodyChange: function(e) {this.setState({body:e.target.value, state: 1}, this.checkFilling)},
    build_typeChange: function(e) {this.setState({build_type:e.target.value, state: 1}, this.checkFilling)},
    entranceChange: function(e) {this.setState({entrance:e.target.value, state: 1}, this.checkFilling)},
    floorsChange: function(e) {this.setState({floors:e.target.value, state: 1}, this.checkFilling)},
    clientsChange: function(e) {this.setState({clients:e.target.value, state: 1}, this.checkFilling)},
    priceChange: function(e) {this.setState({price: e.target.value, state: 1}, this.checkFilling)},
    noteChange: function(e) {this.setState({note:e.target.value, state: 1}, this.checkFilling)},
    memoChange: function(e) {this.setState({memo:e.target.value, state: 1}, this.checkFilling)},

    render: function() {
        if (this.state.city_id == 0 && !this.state.add_address) {
            return <div className="col-md-6">
                <div>{this.props.title + ' адрес не задан'}</div>
                <button className="btn btn-primary" onClick={(e)=>{this.setState({add_address:true})}}>Добавить адрес</button>
            </div>
        }
        return (
            <div className="col-md-6">
                {this.props.title?<h4>{this.props.title}</h4>:''}
                <AddressParams
                    address_id={this.props.address_id}
                    city_list={this.props.city_list}
                    cityChange={this.cityChange}
                    city_id={this.state.city_id}
                    regions={this.props.regions}
                    regionChange={this.regionChange}
                    region_id={this.state.region_id}
                    street_id={this.state.street_id}
                    streetChange={this.streetChange}
                    new_street_rights={false}
                    streets={this.props.streets}
                    clone_build={this.state.clone_build}
                    builds_on_street={this.state.builds_on_street}
                    buildChange={this.buildChange}
                    build={this.state.build}
                    bodyChange={this.bodyChange}
                    body={this.state.body}
                    rights={this.props.rights}
                    state={this.state.state}
                    />
                <BuildingParams
                    address_id={this.props.address_id}
                    entranceChange={this.entranceChange}
                    entrance={this.state.entrance}
                    build_typeChange={this.build_typeChange}
                    build_type={this.state.build_type}
                    build_types={this.props.build_types}
                    build_statuses={this.props.build_statuses}
                    build_status={this.state.build_status}
                    build_status_desk={this.props.build_status_desk}
                    onStatusChange={this.statusChange}
                    floorsChange={this.floorsChange}
                    floors={this.state.floors}
                    clientsChange={this.clientsChange}
                    clients={this.state.clients}
                    priceChange={this.priceChange}
                    price={this.state.price}
                    noteChange={this.noteChange}
                    note={this.state.note}
                    memoChange={this.memoChange}
                    memo={this.state.memo}
                    rights={this.props.rights}
                    can_changestatus={false}
                    state={this.state.state}
                    status_state={this.state.build_status_state}
                />
            </div>
        )
    }
});

var ModifyBuildingForm  = React.createClass({
    getInitialState: function() {

        let {militia_params, building_params, build_status, build_status_desk, build_companies} = this.props;
        return {
            militia_params: {
                city_id: militia_params?militia_params.city_id || 0:0,
                region_id: militia_params?militia_params.region_id || 0:0,
                street_id: {
                    value: militia_params ? militia_params.street_id || 0 : 0,
                    msg: '',
                    state: 0
                },
                floors: militia_params?militia_params.floors || '':'',
                entrance: militia_params?militia_params.entrance || '':'',
                build: militia_params?militia_params.build || '':'',
                build_type: militia_params?militia_params.hometype || 0:'',
                clients: militia_params?militia_params.clients || '':'',
                price: militia_params?militia_params.price || '':'',
                body: militia_params?militia_params.body || '':'',
                note: militia_params?militia_params.note || '':'',
                memo: militia_params?militia_params.memo || '':'',
                state: 0,
                clone_build: 0,
                builds_on_street: []
            },
            building_params: {
                city_id: building_params?building_params.city_id || 0:0,
                region_id: building_params?building_params.region_id || 0:0,
                street_id: {
                    value: building_params ? building_params.street_id || 0 : 0,
                    msg: '',
                    state: 0
                },
                floors: building_params?building_params.floors || '':'',
                entrance: building_params?building_params.entrance || '':'',
                build: building_params?building_params.build || '':'',
                build_type: building_params?building_params.hometype || 0:0,
                clients: building_params?building_params.clients || '':'',
                price: building_params?building_params.price || '':'',
                body: building_params?building_params.body || '':'',
                note: building_params?building_params.note || '':'',
                memo: building_params?building_params.memo || '':'',
                state: 0,
                builds_on_street: [],
                clone_build: 0
            },
            build_status: build_status,
            build_status_desk: build_status_desk,
            build_status_state: 0,
            companies: build_companies || [],
            companies_state: 0,
            error_msg: '',
            status: -4
        }
    },

    militiaParamsChange: function(new_params) {
        console.log(new_params);
        let params = this.state.militia_params;
        for(let i in params) {
            if (new_params[i]) {
                params[i] = new_params[i];
            }
        }
        this.setState({
            militia_params:new_params,
            status:new_params.state==1?0:-4
        });
    },
    buildParamsChange: function(new_params) {
        console.log(new_params);
        let params = this.state.building_params;
        for(let i in params) {
            if (new_params[i]) {
                params[i] = new_params[i];
            }
        }
        this.setState({
            building_params: params,
            status:new_params.state==1?0:-4
        });
    },
    companiesChange: function(companies) {
        this.setState({
            companies: companies,
            companies_state: 1,
            status: 0
        }, this.checkFilling)
    },
    statusChange: function(status) {
        console.log('status change');
        this.setState({
            build_status: status,
            build_status_state: 1
        },
        this.checkFilling)
    },

    clearCompanies: function() {
        let companies = this.state.companies;
        for (let i in companies) {
            companies[i].added=false;
            companies[i].deleted=false;
        }
        this.state.companies=companies;
    },
    responseHandler: function(a) {
        if (a.error == 0) {
            this.clearCompanies();
            this.state.militia_params.state = this.state.militia_params.state?2:0;
            this.state.building_params.state = this.state.building_params.state?2:0;
            this.setState({
                build_status_state: this.state.build_status_state?2:0,
                companies_state: this.state.companies_state?2:0,
                status: 2,
                msg: a.msg
            });
            location.reload();
        } else {
            let militia_params = this.state.militia_params;
            let building_params = this.state.building_params;
            let build_status_state = this.state.build_status_state;
            let companies_state = this.state.companies_state;
            if (militia_params.state) {
                if (a.militia_params.error != 0) {
                    militia_params.state = -1;
                } else {
                    militia_params.state = 2;
                }
            }
            if (building_params.state) {
                if (a.building_params.error != 0) {
                    building_params.state = -1;
                } else {
                    building_params.state = 2;
                }
            }
            if (build_status_state) {
                if (a.status.error != 0) {
                    build_status_state = -1;
                } else {
                    build_status_state = 2;
                }
            }
            if (companies_state) {
                if (a.companies.error != 0) {
                    companies_state = -1
                } else {
                    companies_state = 2
                }
            }
            if (services_state == -1) {
                $("body,html").animate({"scrollTop": 0}, 500);
            }
            this.setState({
                status: -1,
                companies_state,
                build_status_state,
                militia_params,
                building_params,
                msg: a.msg
            });
        }
    },
    saveHandler: function(e) {
        this.setState({status: 1});
        let {militia_params, building_params} = this.state;
        militia_params.street_id = militia_params.street_id.value;
        building_params.street_id = building_params.street_id.value;
        $.ajax({
            beforeSend: function (request) {
                return request.setRequestHeader('X-CSRF-Token', $("meta[name='csrf-token']").attr('content'));
            },
            type: "POST",
            data: {
                building_params: building_params,
                militia_params: militia_params,
                building_params_changed: this.state.building_params.state==1?1:0,
                militia_params_changed: this.state.militia_params.state==1?1:0,
                status: this.state.build_status,
                status_changed: this.state.build_status_state==1?1:0,
                companies: this.state.companies,
                companies_changed: this.state.companies_state==1?1:0,
                services: this.state.services,
                services_changed: this.state.services_state==1?1:0
            },
            url: "/inventory/building/"+this.props.address_id,
            success: this.responseHandler
        });
    },
    handleExchangeAddress: function() {
        fetch('/inventory/building/'+this.props.address_id+'/address/exchange',{
            headers: {
                'X-CSRF-Token': document.querySelector("meta[name='csrf-token']")?document.querySelector("meta[name='csrf-token']").getAttribute('content'):'',
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: 'GET',
            credentials: 'include'
        })
            .then(() => {
                location.reload();
            })
    },
    render: function() {
        return (
            <div className="form_new_home container">
                <div className="row">
                    <div className="col-sm-12">
                    <h3>Адрес
                        {this.props.creator?
                          <div className="creator-wrap">
                              <i className="fa fa-question-circle"></i>
                              <div className="creator-tooltip">
                                  <p>Добавил: {this.props.creator.name} </p>
                                  <p>Дата добавления: {this.props.creator.date?this.props.creator.date:'Не определена'}</p>
                              </div>
                          </div>
                          :null
                        }
                    </h3>
                    <div className="address-area clearfix">
                    <AddressParamsForm
                        title={'Строительный'}
                        address_id={this.props.address_id}
                        params={this.state.building_params}
                        onChange={this.buildParamsChange}
                        city_list={this.props.city_list}
                        regions={this.props.regions}
                        streets={this.props.streets}
                        build_types={this.props.build_types}
                        build_statuses={this.props.build_statuses}
                        build_status_desk={this.props.build_status_desk}
                        rights={this.props.rights}
                        />
                    <AddressParamsForm
                        title={'Милицейский'}
                        address_id={this.props.address_id}
                        params={this.state.militia_params}
                        onChange={this.militiaParamsChange}
                        city_list={this.props.city_list}
                        regions={this.props.regions}
                        streets={this.props.streets}
                        build_types={this.props.build_types}
                        build_statuses={this.props.build_statuses}
                        build_status_desk={this.props.build_status_desk}
                        rights={this.props.rights}
                        />
                    </div>
                        {this.props.can_addresschange ?
                            <i
                                className="fa fa-exchange address-exchange link"
                                onClick={this.handleExchangeAddress}
                                title={"Поменять местами строительный и милицейский адрес"}
                                ></i>
                            :
                            null
                        }
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-5">
                        <CompaniesWrap
                            rights={this.props.companies_change}
                            companies={this.props.companies || []}
                            selected={this.state.companies}
                            onChange={this.companiesChange}
                            state={this.state.companies_state}
                        />
                    </div>
                </div>
                <div className={classNames({hide: this.state.error_msg != ''})}>{this.state.error_msg}</div>
                <ButtonPane saveHandler={this.saveHandler} status={this.state.status} />
            </div>
        )
    }
});

ReactDOM.render(
    <ModifyBuildingForm
        address_id={BuildingData.address_id}
        militia_params={BuildingData.militia_params}
        building_params={BuildingData.building_params}
        city_list={BuildingData.city_list}
        city_id={BuildingData.city_id}
        regions={BuildingData.regions}
        region_id={BuildingData.region_id}
        streets={BuildingData.streets}
        street_id={BuildingData.street_id}
        build={BuildingData.build}
        body={BuildingData.body}
        build_type={BuildingData.hometype}
        build_types={BuildingData.build_types}
        build_statuses={BuildingData.build_statuses}
        build_status={BuildingData.build_status}
        build_status_desk={BuildingData.build_status_desk}
        entrance={BuildingData.entrance}
        floors={BuildingData.floors}
        clients={BuildingData.clients}
        tickets={BuildingData.tickets}
        inwork={BuildingData.inwork}
        connected={BuildingData.connected}
        note={BuildingData.note}
        memo={BuildingData.memo}
        price={BuildingData.price}
        build_type={BuildingData.build_type}
        new_street_rights={BuildingData.new_street_rights}
        rights={BuildingData.can_modify}
        build_services={BuildingData.build_services}
        companies={BuildingData.companies}
        build_companies={BuildingData.build_companies}
        companies_change={BuildingData.companies_change}
        can_changestatus={BuildingData.can_changestatus}
        can_addresschange={BuildingData.can_addresschange}
        creator={BuildingData.creator}
        />,
    document.getElementById('new-building')
);