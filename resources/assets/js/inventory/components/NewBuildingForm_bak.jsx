var $ = require('jquery');
var React = require('react');
var ReactDOM = require('react-dom');
var Modal = require('react-modal');
var classNames = require('classnames');
var Multiselect = require('react-bootstrap-multiselect');

var AddressTypeSelect = React.createClass({
    propTypes: {
        constructionTypeChange: React.PropTypes.func.required,
        construction_type: React.PropTypes.number.required
    },

    render: function() {
        return (<div className="inputrow">
            <label htmlFor="address_type">Тип адреса:</label>
            <select onChange={this.props.constructionTypeChange} value={this.props.construction_type}>
                <option value={1}>Строительный</option>
                <option value={2}>Милицейский</option>
            </select>
        </div>)
    }
});

var CitySelect = React.createClass({
    getInitialState: function() {
        return {
            selected: this.props.city_id
        }
    },
    _handlerCityChange: function(e) {
        this.setState({
            selected: e.target.value
        });
        this.props.cityChange(e.target.value);
    },
    render: function() {
        let city_list = [];
        city_list.push(<option key={0} id={0} value={0}>Не выбран</option>);
        for (let city_id in this.props.city_list) {
            city_list.push(
                <option key={city_id+1} value={this.props.city_list[city_id].id}>{this.props.city_list[city_id].desk}</option>
            );
        }
        return (
            <div className="city inputrow">
                <label htmlFor="city">Город:</label>
                <select onChange={this._handlerCityChange} value={this.state.selected}>
                    {city_list}
                </select>
            </div>
        );
    }
});

var RegionSelect = React.createClass({
    getInitialState: function() {
        return {
            selected: 0,
            regions: []
        }
    },
    makeRegionList: function(data) {
        let regions = [];
        regions.push(<option key={0} id={0} value={0}>Не выбран</option>);
        for (var i = 0; i < data.length; i++) {
            var option = data[i];
            regions.push(
                <option key={i+1} value={option.region_id}>{option.desk}</option>
            );
        }
        this.setState({
            regions: regions
        });
    },
    componentDidMount: function() {
       this.updateRegionData();
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
        return (
            <div className="region inputrow">
                <label htmlFor="region">Регион:</label>
                <select onChange={this.props.regionChange} value={this.props.region_id}>
                    {this.state.regions}
                </select>
            </div>
        );
    }
});

var NewStreetButton = React.createClass({
    propTypes: {
        regions: React.PropTypes.array
    },
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
                <option key={k+1} value={data[k].type}>{data[k].prefix}</option>
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
                <button type="button" className="btn btn-default" onClick={this._handleAddStreet}>Добавить улицу</button>
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
                            <div className={'form-group'}>
                                <label htmlFor='street-name'>Название улицы</label>
                                <div className="col-sm-8">
                                    <select name='street-type' onChange={(e)=>{this.setState({newstreet_type:e.target.value});}} value={this.state.newstreet_type}>
                                        {this.state.street_types}
                                    </select>
                                    <input name='street-name' value={this.state.street_name} onChange={(e)=>{this.setState({street_name:e.target.value})}}/>
                                </div>
                            </div>
                            <div className='form-group'>
                                <label htmlFor='street-name control-label sol-sm-4'>Название улицы</label>
                                <div className='col-sm-8'>
                                    <select name='street-type' onChange={(e)=>{this.setState({newstreet_type:e.target.value});}} value={this.state.newstreet_type}>
                                        {this.state.street_types}
                                    </select>
                                    <input name='street-name' value={this.state.street_name} onChange={(e)=>{this.setState({street_name:e.target.value})}}/>
                                </div>
                            </div>
                            <div className='form-group'>
                                <label htmlFor='street-name control-label sol-sm-4'>Район(ы):</label>
                                <div className='col-sm-8'>
                                    <select name='street-type' onChange={(e)=>{this.setState({newstreet_type:e.target.value});}} value={this.state.newstreet_type}>
                                        {this.state.street_types}
                                    </select>
                                    <input name='street-name' value={this.state.street_name} onChange={(e)=>{this.setState({street_name:e.target.value})}}/>
                                </div>
                            </div>
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

    getInitialState: function() {
        return {
            selected: 0,
            streets: []
        }
    },
    componentDidMount: function() {
        this.updateStreetData();
    },
    makeStreetList: function(data) {
        this.state.streets = [];
        this.state.streets.push(<option key={0} id={0} value={0}>Не выбрана</option>);
        for (var i = 0; i < data.length; i++) {
            var option = data[i];
            this.state.streets.push(
                <option key={i+1} value={option.id}>{option.street}</option>
            );
        }
        this.forceUpdate();
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
        if (this.props.reion_id != nextProps.region_id && nextProps.region_id != 0) {
           this.updateStreetData(nextProps.region_id);
        }
    },
    render: function() {
        if (this.props.region_id == 0) return null;
        return (
            <div className="street inputrow">
                <label htmlFor="street">Улица:</label>
                <select name="street" onChange={this.props.streetChange} value={this.props.street_id}>
                    {this.state.streets}
                </select>
                {this.props.new_street_rights ? <NewStreetButton region_id={this.props.region_id} handleAddNewStreet={this.updateStreetData} />:''}
            </div>
        )
    }
});
var ButtonPane = React.createClass({
    render: function() {
        let err_text = 'Сохранить';
        switch (this.props.status) {
            case 1:
                err_text = 'Сохранение';
                break;
            case 2:
                err_text = 'Сохранено';
                break;
            case -1:
                err_text = 'Ошибка';
                break;
            case -2:
                err_text = 'Заполните все поля';
                break;
        }
        return(
            <div className="buttons inputrow">
                <div className={this.props.status!=0?'hide':'error'}>{err_text}</div>
                <button className="button" onClick={this.props.saveHandler.bind(null,1)} disabled={this.props.status!=0}>Сохранить и редактировать</button>
                <button className="button" onClick={this.props.saveHandler.bind(null,2)} disabled={this.props.status!=0}>Сохранить и добавить</button>
            </div>
        )
    }
});

var BuildingParams = React.createClass({

    getInitialState: function(){
        return {
            home_types: []
        }
    },
    makeHomeTypes: function(data) {
        for (var i = 0; i < data.length; i++) {
            var option = data[i];
            this.state.home_types.push(
                <option key={i} value={option.type}>{option.desk}</option>
            );
        }
    },
    componentDidMount: function() {
        // get your data
        $.ajax({
            type: 'GET',
            url: '/inventory/building/types',
            success: this.makeHomeTypes
        });
    },
    render: function() {
        if (this.props.street_id == 0) return null;
        return (
            <div className="house other input-group">
                <div className="house inputrow">
                    <label htmlFor="house">Дом:</label>
                    <input type="text" size="1" name="house" onChange={this.props.buildChange} value={this.props.build}/>
                </div>
                <div className="house inputrow">
                    <label htmlFor="body">Корпус:</label>
                    <input type="text" name="body" size="1" onChange={this.props.bodyChange} value={this.props.body}/>
                </div>
                <div className="home_type inputrow">
                    <label htmlFor="home_type">Тип:</label>
                    <select name="home_type" onChange={this.props.build_typeChange} value={this.props.home_type}>
                        {this.state.home_types}
                    </select>
                </div>
                <div className="entrances inputrow">
                    <label htmlFor="entrances">Кол-во подъездов:</label>
                    <input type="text" name="entrances" size="1" onChange={this.props.entranceChange} value={this.props.entrance } />
                </div>
                <div className="floors inputrow">
                    <label htmlFor="floors">Кол-во этажей:</label>
                    <input type="text" name="floors" size="1" onChange={this.props.floorsChange} value={this.props.floors} />
                </div>
                <div className="clients inputrow">
                    <label htmlFor="floors">Потенциальных:</label>
                    <input type="text" name="clients" size="1" onChange={this.props.clientsChange} value={this.props.clients} />
                </div>
                <div className="note inputrow">
                    <label htmlFor="note">Примечание 1:</label>
                    <textarea name="note" rows="7" style={{width: 100+'%'}} title="Note" onChange={this.props.noteChange} value={this.props.note}></textarea>
                </div>
                <div className="memo inputrow">
                    <label htmlFor="note">Примечание 2:</label>
                    <textarea name="note" rows="7" style={{width: 100+'%'}}  title="Memo" onChange={this.props.memoChange} value={this.props.memo}></textarea>
                </div>
                <div className="price inputrow">
                    <label htmlFor="floors">Цена:</label>
                    <input type="text" name="price" size="1" onChange={this.props.priceChange} value={this.props.price} />
                </div>
            </div>
        )
    }
});

var NewBuildingForm  = React.createClass({
    getInitialState: function() {
        return {
            city_id: this.props.city_id || 0,
            region_id: this.props.region_id || 0,
            street_id: this.props.street_id || 0,
            construction_type: 2,
            floors: '',
            entrance: '',
            build: '',
            build_type: 1,
            clients: '',
            price: '',
            body: '',
            note: '',
            memo: '',
            error_msg: '',
            status: -2
        }
    },
    checkFilling: function() {
        console.log(this.state);
        if (this.state.region_id > 0 &&
            this.state.street_id > 0 &&
            this.state.floors != '' &&
            this.state.entrance != '' &&
            this.state.build != ''
        ) {
            this.setState({status: 0});
        } else {
            this.setState({status: -2});
        }
    },
    cityChange: function(city_id) {
        this.setState({city_id:city_id});
    },
    regionChange: function(e) {this.setState({region_id:e.target.value}); this.checkFilling()},
    streetChange: function(e) {this.setState({street_id:e.target.value}); this.checkFilling()},
    buildChange: function(e) {this.setState({build:e.target.value}); this.checkFilling()},
    bodyChange: function(e) {this.setState({body:e.target.value}); this.checkFilling()},
    build_typeChange: function(e) {this.setState({build_type:e.target.value}); this.checkFilling()},
    entranceChange: function(e) {this.setState({entrance:e.target.value}); this.checkFilling()},
    floorsChange: function(e) {this.setState({floors:e.target.value}); this.checkFilling()},
    clientsChange: function(e) {this.setState({clients:e.target.value}); this.checkFilling()},
    priceChange: function(e) {this.setState({price: e.target.value}); this.checkFilling()},
    noteChange: function(e) {this.setState({note:e.target.value}); this.checkFilling()},
    memoChange: function(e) {this.setState({memo:e.target.value}); this.checkFilling()},
    constructionTypeChange: function(e) {this.setState({construction_type: e.target.value}); this.checkFilling()},
    saveHandler: function(action, e) {
        $.ajax({
            beforeSend: function (request) {
                return request.setRequestHeader('X-CSRF-Token', $("meta[name='csrf-token']").attr('content'));
            },
            type: "POST",
            data: {
                region_id: this.state.region_id,
                street_id: this.state.street_id,
                construction_type: this.state.construction_type,
                build: this.state.build,
                body: this.state.body,
                entrance: this.state.entrance,
                floors: this.state.floors,
                build_type: this.state.build_type,
                note: this.state.note,
                memo: this.state.memo,
                price: this.state.price,
                clients: this.state.clients
            },
            url: "/inventory/building",
            success: function (a) {
                if (a.error == 0) {
                    if (action == 1) {
                        location.href = '/inventory/building/' + a.address_id
                    } else if(action == 2) {
                        location.href = '/inventory/building/new?city_id='+this.state.city_id+
                        '&region_id='+ this.state.region_id+
                        '&street_id='+this.state.street_id
                    }
                } else {
                    this.setState({error_msg: "Ошибка сервера", state: -1});
                }
            }.bind(this),
            error: function (xhr) {
                this.setState({error_msg: "Ошибка сервера"});
                console.log("Save db-pass error");
            }.bind(this)
        });
    },
    render: function() {
        let new_home = null;
        if (this.props.address_id != 0) {
            new_home = (<div className={classNames('alert', 'alert-info')}>
                Дом {this.props.address_id} успешно сохранен.
                <a href={'/inventory/building/' + this.props.address_id}>Перейти к редактированию >></a>
            </div>);
        }
        return (
            <div className="form_new_home">
                {new_home}
                <AddressTypeSelect
                    construction_type={this.state.construction_type}
                    constructionTypeChange={this.constructionTypeChange}
                    />
                <CitySelect
                    city_list={this.props.city_list}
                    city_id={this.state.city_id}
                    cityChange={this.cityChange}
                />
                <RegionSelect
                    city_id={this.state.city_id}
                    region_id={this.state.region_id}
                    regionChange={this.regionChange} />
                <StreetSelect
                    region_id={this.state.region_id}
                    street_id={this.state.street_id}
                    streetChange={this.streetChange}
                    new_street_rights={this.props.new_street_rights}/>
                <BuildingParams
                    street_id={this.state.street_id}
                    buildChange={this.buildChange}
                    build={this.state.build}
                    bodyChange={this.bodyChange}
                    body={this.state.body}
                    entranceChange={this.entranceChange}
                    entrance={this.state.entrance}
                    build_typeChange={this.build_typeChange}
                    build_type={this.state.build_type}
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
                />
                <div className={classNames({hide: this.state.error_msg != ''})}>{this.state.error_msg}</div>
                <ButtonPane saveHandler={this.saveHandler} status={this.state.status} />
            </div>
        )
    }
});

ReactDOM.render(
    <NewBuildingForm
        city_list={BuildingData.city_list}
        type={BuildingData.types}
        new_street_rights={BuildingData.new_street_rights}
        city_id={BuildingData.city_id}
        region_id={BuildingData.region_id}
        street_id={BuildingData.street_id}
        address_id={BuildingData.address_id}
    />,
    document.getElementById('new-building')
);