import $ from 'jquery';
import React, { PropTypes, Component } from 'react';
import ReactDOM from 'react-dom';
import classNames from'classnames';
import Multiselect from 'react-bootstrap-multiselect';
import DatePicker from 'react-datepicker';
import NewStreetButton from './NewStreetButton';
import moment from 'moment';
import { YMaps, Map, SearchControl, Placemark } from 'react-yandex-maps';

const mapState = { center: [55.76, 37.64], zoom: 10 };

import 'react-datepicker/dist/react-datepicker.css';

import * as Modal from 'react-modal';

class ServiceRow extends Component {
    static propTypes = {
        service: React.PropTypes.object.isRequired,
        onDateChange: React.PropTypes.func.isRequired
    };
    handleDateChange = (date) => {
        let service = this.props.service;
        service.date.value = (date) ? date.format('YYYY-MM-DD') : ''
        this.props.onDateChange(service);
    };
    render = () => {
        const {service} = this.props;
        return (
            <tr>
                <th>
                    {service.name}
                </th>
                <td>
                    <span className={classNames(
                        'inputrow',
                        {
                            changed: service.date.state==1,
                            saved: service.date.state==2,
                            error: service.date.state==-1,
                            'has-error': service.date.state==-1
                        })}
                      >
                        <DatePicker
                          dateFormat="YYYY-MM-DD"
                          selected={service.date.value != ''? moment(service.date.value, 'YYYY-MM-DD'):''}
                          onChange={this.handleDateChange}
                          isClearable={true}
                          placeholderText={''}
                          className={'form-control'}
                          />
                    </span>
                </td>
         </tr>)
    }
}

class InitialServiceTable extends Component {
    static propTypes = {
        services: React.PropTypes.array.isRequired,
        onChange: React.PropTypes.func.isRequired
    };

    handleServiceChange = (new_service) => {
        console.log(new_service);
        let services = this.props.services;
        for(let i in services) {
            if (services[i].id == new_service.id) {
                services[i] = new_service;
            }
        }
        this.props.onChange(services);
    };
    render = () => {
        const {services, onChange} = this.props;
        return (
        <div className="row">
            <div className="col-md-12">
            <h4>Услуги, которые будут оказываться на доме:</h4>
            <table className="newbuild__service-table col-md-6">
                <thead>
                <tr>
                    <th>Название</th>
                    <th>Планируемая дата запуска услуги</th>
                </tr>
                </thead>
                <tbody>
                {services.map((c) => {
                    console.log(this);
                    return (
                        <ServiceRow
                          service={c}
                          onDateChange={this.handleServiceChange}
                            />
                        )
                    })
                }
                </tbody>
            </table>
            </div>
        </div>
        )
    }
}

class AddressTypeSelect extends Component{
    static propTypes = {
        constructionTypeChange: React.PropTypes.func.isRequired,
        construction_type: React.PropTypes.number.isRequired
    };

    render = () => {
        return (<div className="form-group row">
            <div className="col-md-2">
                <label htmlFor="address_type">Тип адреса:</label>
            </div>
            <div className="col-md-10">
                <select className="form-control" onChange={this.props.constructionTypeChange} value={this.props.construction_type}>
                    <option value={1}>Строительный</option>
                    <option value={2}>Милицейский</option>
                </select>
            </div>
        </div>)
    }
}

class CitySelect extends Component{
    state = {
        selected: this.props.city_id
    };
    handleCityChange = (e) => {
        this.setState({
            selected: e.target.value
        });
        this.props.cityChange(e.target.value);
    };
    render = () => {
        let city_list = [];
        city_list.push(<option key={0} id={0} value={0}>Не выбран</option>);
        for (let city_id in this.props.city_list) {
            city_list.push(
                <option key={city_id+1} value={this.props.city_list[city_id].id}>{this.props.city_list[city_id].desk}</option>
            );
        }
        return (
            <div className="form-group row">
                <div className="col-md-2">
                    <label htmlFor="city">Город:</label>
                </div>
                <div className="col-md-10">
                    <select className="form-control" onChange={this.handleCityChange} value={this.state.selected}>
                        {city_list}
                    </select>
                </div>
            </div>
        );
    }
}

class RegionSelect extends Component{
    state = {
        selected: 0,
        regions: []
    };
    makeRegionList = (data) => {
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
    };
    componentDidMount = () => {
       this.updateRegionData();
    };
    updateRegionData = (city_id) => {
        city_id = city_id || this.props.city_id;
        $.ajax({
            type: 'GET',
            url: '/inventory/regions/' + city_id,
            success: this.makeRegionList
        });
    };
    componentWillReceiveProps = (nextProps) => {
        if (this.props.city_id != nextProps.city_id && nextProps.city_id != 0) {
            this.updateRegionData(nextProps.city_id);
        }
    };
    render =  () => {
        if (this.props.city_id == 0) return null;
        return (
            <div className="form-group row">
                <div className="col-md-2">
                    <label htmlFor="region">Регион:</label>
                </div>
                <div className="col-md-10">
                    <select className="form-control" onChange={this.props.regionChange} value={this.props.region_id}>
                        {this.state.regions}
                    </select>
                </div>
            </div>
        );
    }
}

class StreetSelect extends Component {
    state = {
        selected: 0,
        streets: []
    };
    componentDidMount = () => {
        this.updateStreetData();
    };
    makeStreetList = (data) => {
        this.state.streets = [];
        this.state.streets.push(<option key={0} id={0} value={0}>Не выбрана</option>);
        for (var i = 0; i < data.length; i++) {
            var option = data[i];
            this.state.streets.push(
                <option key={i+1} value={option.id}>{option.street}</option>
            );
        }
        this.forceUpdate();
    };
    updateStreetData = (region_id) => {
        region_id = region_id || this.props.region_id;
        $.ajax({
            type: 'GET',
            url: '/inventory/streets/' + region_id,
            success: this.makeStreetList
        });
    };
    componentWillReceiveProps = (nextProps) => {
        if (this.props.reion_id != nextProps.region_id && nextProps.region_id != 0) {
           this.updateStreetData(nextProps.region_id);
        }
    };
    render = () => {
        if (this.props.region_id == 0) return null;
        return (
            <div className="form-group row">
                <div className="col-md-2">
                    <label htmlFor="street">Улица:</label>
                </div>
                <div className="col-md-7">
                    <select className="form-control" name="street" onChange={this.props.streetChange} value={this.props.street_id}>
                        {this.state.streets}
                    </select>
                </div>
                <div className="col-md-3">
                    {this.props.new_street_rights? <NewStreetButton city_id={this.props.city_id} region_id={this.props.region_id} handleAddNewStreet={this.updateStreetData} /> : null}
                </div>
            </div>
        )
    }
};

class ButtonPane extends Component {
    render = () => {
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
                <div className={this.props.status==-2 || this.props.status == 0?'hide':'error'}>{err_text}</div>
                <button className="button btn btn-primary" onClick={this.props.saveHandler.bind(null,1)} disabled={this.props.status!=0}>Сохранить и редактировать</button> <button className="button btn btn-primary" onClick={this.props.saveHandler.bind(null,2)} disabled={this.props.status!=0}>Сохранить</button>
            </div>
        )
    }
}

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

class BuildingParams extends Component {
    state = {
        home_types: []
    };
    makeHomeTypes = (data) => {
        for (var i = 0; i < data.length; i++) {
            var option = data[i];
            this.state.home_types.push(
                <option key={i} value={option.type}>{option.desk}</option>
            );
        }
    };
    componentDidMount = () => {
        // get your data
        $.ajax({
            type: 'GET',
            url: '/inventory/building/types',
            success: this.makeHomeTypes
        });
        if (this.ymap) {

        } else {
            console.log("Ymap ref is null")
        }
    };
    searchRef=null;
    componentWillReceiveProps =(np) => {
        if (false && np.street_id != 0 && this.ymap ) {
            this.ymap.cursors.push('arrow');
        }
    };
    ymap=null;
    render = () => {
        if (this.props.street_id == 0) return null;
        return (
            <div className="house other">
                {/*<div className="house inputrow">
                    <label htmlFor="body">Корпус:</label>
                    <input type="text" name="body" size="1" onChange={this.props.bodyChange} value={this.props.body}/>
                </div>*/}
                <div className="home_type form-group row">
                    <div className="col-md-2"><label htmlFor="home_type">Тип:</label></div>
                    <div className="col-md-10">
                        <select name="home_type" className="form-control" onChange={this.props.build_typeChange} value={this.props.build_type}>
                            {this.state.home_types}
                        </select>
                    </div>
                </div>
                <div className="house form-group row">
                    <div className="col-md-2">
                        <label htmlFor="house">Дом:</label>
                    </div>
                    <div className="col-md-10">
                        <input className="form-control" type="text" size="1" name="house" onChange={this.props.buildChange} value={this.props.build}/>
                    </div>
                </div>
                <label>Координаты</label>
                <div className='row'>
                    <div className="col-md-6 form-group">
                        <label>Широта</label>
                        <input type="text" className="form-control" onChange={(e)=>this.props.latChange(e.target.value)} value={this.props.lat} />
                    </div>
                    <div className="col-md-6 form-group">
                        <label>Долгота</label>
                        <input type="text" className="form-control" onChange={(e)=>this.props.lngChange(e.target.value)} value={this.props.lng} />
                    </div>
                </div>
                <div className="row form-group">
                    <div className="col-md-12 map-wrap">
                        <YMaps
                          >
                            <Map state={mapState}
                                 width="100%"
                                 instanceRef={(ref)=>{
                                    ref.cursors.push('arrow');
                                    this.ymap=ref
                                    }
                                 }
                              onClick={(e)=>{
                                  let coords = e.get('coords');
                                  this.props.lngChange(coords[1]);
                                  this.props.latChange(coords[0]);
                                  }}
                              >
                                {this.props.lat && this.props.lng?
                                  <Placemark
                                    geometry={{
                                    coordinates: [this.props.lat, this.props.lng]
                                  }}/>
                                  :
                                  null
                                }
                            </Map>
                        </YMaps>
                    </div>
                </div>
                <div className="entrances form-group row">
                     <div className="col-md-2">
                         <label htmlFor="entrances">Кол-во подъездов:</label>
                     </div>
                     <div className="col-md-2">
                         <input type="text" className="form-control" name="entrances" size="1" onChange={this.props.entranceChange} value={this.props.entrance } />
                     </div>
                 </div>
                 <div className="floors form-group row">
                     <div className="col-md-2">
                         <label htmlFor="floors">Кол-во этажей:</label>
                     </div>
                     <div className="col-md-2">
                         <input type="text" className="form-control" name="floors" size="1" onChange={this.props.floorsChange} value={this.props.floors} />
                     </div>
                </div>
                <div className="clients form-group row">
                    <div className="col-md-2">
                        <label htmlFor="floors">Кол-во помещений:</label>
                    </div>
                    <div className="col-md-2">
                        <input type="text" className="form-control" name="clients" size="1" onChange={this.props.clientsChange} value={this.props.clients} />
                    </div>
                </div>
                <InitialServiceTable
                   services={this.props.services}
                   onChange={this.props.onServiceChange}
                />
                <div className="row">
                    <div className="col-md-12">
                        <div className="note form-group">
                            <label htmlFor="note">Примечание 1:</label>
                            <textarea name="note" className="form-control" rows="7" style={{width: 100+'%'}} title="Note" onChange={this.props.noteChange} value={this.props.note}></textarea>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-12">
                        <div className="memo form-group">
                            <label htmlFor="note">Примечание 2:</label>
                            <textarea name="note" className="form-control" rows="7" style={{width: 100+'%'}}  title="Memo" onChange={this.props.memoChange} value={this.props.memo}></textarea>
                        </div>
                    </div>
                </div>
                <div className="price form-group row">
                    <div className="col-md-2">
                        <label htmlFor="floors">Цена:</label>
                    </div>
                    <div className="col-md-2">
                        <input type="text" className="form-control" name="price" size="1" onChange={this.props.priceChange} value={this.props.price} />
                    </div>
                </div>
            </div>
        )
    }
}

class NewBuildingForm extends Component {
    state = {
        city_id: this.props.city_id || 0,
        region_id: this.props.region_id || 0,
        street_id: this.props.street_id || 0,
        construction_type: 2,
        services: [],
        floors: '',
        entrance: '',
        build: '',
        lat: '',
        lng: '',
        build_type: 0,
        clients: '',
        price: '',
        body: '',
        note: '',
        memo: '',
        error_msg: '',
        status: -2
    };
    constructor(props) {
        super(props);

        let services = [];
        for(let i in props.services) {
            services.push({
                id: props.services[i].id,
                name: props.services[i].name,
                date: {
                    value: '',
                    state: 0,
                    msg: ''
                }
            });
        }
        this.state.services = services;
    };
    checkFilling = () => {
        this.setState({
            error_msg: ''
        });
        if (this.state.region_id > 0 &&
            this.state.street_id > 0 &&
            this.state.build != '' &&
            this.state.lng != '' &&
            this.state.lat != ''
        ) {
            if ((this.state.build_type == 0&&
                this.state.clients != '' &&
                this.state.entrance != '' &&
                this.state.floors != '') ||
                this.state.build_type > 0
            ) {
                this.setState({status: 0});
            } else {
                this.setState({
                    error_msg: "Для типа ЖД необходимо заполнить кол-во этажей, подъездов, помещений",
                    status: -2
                });
            }
        } else {
            this.setState({status: -2});
        }
    };
    cityChange = (city_id) => {
        this.setState({city_id:city_id});
    };
    regionChange = (e) => {this.setState({region_id:e.target.value}, this.checkFilling)};
    streetChange = (e) => {this.setState({street_id:e.target.value}, this.checkFilling)};
    buildChange = (e) => {this.setState({build:e.target.value}, this.checkFilling)};
    bodyChange = (e) =>{this.setState({body:e.target.value}, this.checkFilling)};
    latChange = (e) => {console.log(e); this.setState({lat:e}, this.checkFilling)};
    lngChange = (e) => {console.log(e); this.setState({lng:e}, this.checkFilling)};
    build_typeChange = (e) => {this.setState({build_type:e.target.value}, this.checkFilling)};
    entranceChange = (e) => {this.setState({entrance:e.target.value}, this.checkFilling)};
    floorsChange = (e) => {this.setState({floors:e.target.value}, this.checkFilling)};
    clientsChange = (e) => {this.setState({clients:e.target.value}, this.checkFilling)};
    priceChange = (e) => {this.setState({price: e.target.value}, this.checkFilling)};
    noteChange = (e) => {this.setState({note:e.target.value}, this.checkFilling)};
    memoChange = (e) => {this.setState({memo:e.target.value}, this.checkFilling)};
    constructionTypeChange = (e) => {this.setState({construction_type: e.target.value}, this.checkFilling)};
    saveHandler = (action, e) => {
        let services = [];
        for (let i in this.state.services) {
            services.push({
                id: this.state.services[i].id,
                name: this.state.services[i].name,
                date: this.state.services[i].date.value
            });
        }
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
                clients: this.state.clients,
                services: services,
                lat: this.state.lat,
                lng: this.state.lng
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
                    this.setState({error_msg: a.msg?a.msg:"Ошибка сервера", state: -1});
                }
            }.bind(this),
            error: function (xhr) {
                this.setState({error_msg: "Ошибка сервера"});
                console.log("Save db-pass error");
            }.bind(this)
        });
    };
    render = () => {
        let new_home = null;
        if (this.props.address_id != 0) {
            new_home = (<div className={classNames('alert', 'alert-info')}>
                Дом {this.props.address_id} успешно сохранен.
                <a href={'/inventory/building/' + this.props.address_id}>Перейти к редактированию >></a>
            </div>);
        }
        return (
            <div className="form_new_hom box col-md-6">
                <div className="box-body">
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
                        city_id={this.state.city_id}
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
                        lat={this.state.lat}
                        latChange={this.latChange}
                        lng={this.state.lng}
                        lngChange={this.lngChange}
                        noteChange={this.noteChange}
                        note={this.state.note}
                        memoChange={this.memoChange}
                        memo={this.state.memo}
                        services={this.state.services}
                        onServiceChange={(s)=>{this.setState({services:s})}}
                    />
                    <div className={classNames('error-msg',{hide: this.state.error_msg == ''})}>{this.state.error_msg}</div>
                    <ButtonPane saveHandler={this.saveHandler} status={this.state.status} />
                </div>
            </div>
        )
    }
}

ReactDOM.render(
    <NewBuildingForm
        city_list={BuildingData.city_list}
        type={BuildingData.types}
        new_street_rights={BuildingData.new_street_rights}
        city_id={BuildingData.city_id}
        region_id={BuildingData.region_id}
        street_id={BuildingData.street_id}
        address_id={BuildingData.address_id}
        services={BuildingData.services}
    />,
    document.getElementById('new-building')
);