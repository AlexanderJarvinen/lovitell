import React, { PropTypes, Component } from 'react';
import Multiselect from 'react-bootstrap-multiselect';

import Draggable from 'react-draggable';
import ModalDialog from 'react-bootstrap/lib/ModalDialog';
import { Modal } from 'react-bootstrap';

class DraggableModalDialog extends React.Component {
    render() {
        return <Draggable handle=".modal-title"><ModalDialog
            backdrop={false}
            enforceFocus={false}
            {...this.props} /></Draggable>
    }
}

export default class StreetModifyModal extends Component {
    static propTypes = {
        street: PropTypes.object,
        show: PropTypes.bool.isRequired,
        onHide: PropTypes.func.isRequired,
        onSave: PropTypes.func.isRequired,
    };

    constructor(prop) {
        super(prop);
        this.state = {
            prefixes: [],
            prefix_id: 1,
            cities: [],
            regions: [],
            street_id: 0,
            desk: '',
            city_id: 0,
            city: '',
            state: 0,
            street_regions: [],
            name_state: 0,
            region_state: 0
        }
    };

    componentDidMount = () => {
        this.getPrefixes();
        this.getCities();
    };

    componentWillReceiveProps = (np) => {
        if (np.street) {
            this.setState({
                street_id: np.street.id,
                desk: np.street.desk,
                city_id: np.street.city_id,
                city: np.street.city,
                prefix_id: np.street.prefix_id,
                street_regions: np.street.regions,
                name_state: 0,
                region_state: 0
            });
            this.getRegions(np.street.city_id);
        } else {
            this.setState({
                street_id: 0,
                desk: '',
                city_id: 0,
                city: '',
                prefix_id: 1,
                street_regions: [],
                name_state: 0,
                region_state: 0
            })
        }
    };

    getPrefixes = () => {
        fetch('/inventory/ajax/street/prefixes', {method: 'GET', credentials: 'include'})
            .then(response => response.json())
            .then(json => {
                this.setState({prefixes: json});
            });
    };

    getCities = () => {
        fetch('/inventory/ajax/cities', {method: 'GET', credentials: 'include'})
            .then(response => response.json())
            .then(json => {
                this.setState({cities: json});
            });
    };
    getRegions = (city_id) => {
        console.log('get regions '+city_id);
        if (city_id) {
            fetch('/inventory/ajax/city/' + city_id + '/regions', {method: 'GET', credentials: 'include'})
                .then(response => response.json())
                .then(json => {
                    let regions = [];
                    let sel_regions = this.state.street_regions;
                    for (let reg_row in json) {
                        regions.push({
                            value: json[reg_row].region_id,
                            label: json[reg_row].desk,
                            selected: sel_regions.indexOf(json[reg_row].region_id) !== -1
                        });
                    }
                    this.setState({regions: regions});
                });
        }
    };
    checkNameParams = () => {
        if (this.state.desk != '' && this.state.city_id != 0) {
            this.setState({name_state: 1});
        } else {
            this.setState({name_state: 0});
        }
    };
    handleRegionChange = (e) => {
        let regions = this.state.regions;
        let sel_regions = [];
        for(let i in regions) {
            if (regions[i].value == e.val()) {
                regions[i].selected = !regions[i].selected;
            }
            if (regions[i].selected == true) {
                sel_regions.push(regions[i].value);
            }
        }
        this.setState({
            regions,
            region_state: 1,
            street_regions: sel_regions
        });
    };
    getCityById = (city_id) => {
        console.log(this.state.cities);
        const cities = this.state.cities;
        let city = cities.find((city) => city.id == city_id);
        return city?city.desk:'';
    };
    isChanged = () => {
        if (this.props.street == null) {
            return this.state.desk != '' || this.state.city_id != 0 || this.state.street_regions.length > 0
        } else {
            return this.state.desk != this.props.street.desk || this.state.city_id != this.props.street.city_id
        }
    };
    render = () => {
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
                    <Modal.Title>{this.state.id?'Редактирование улицы "'+this.state.desk+'"':'Добавление новой улицы'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div>
                        {this.props.state < 0 && !this.isChanged()?
                            <div className="alert alert-danger">
                                <h4><i className="icon fa fa-ban"></i> Ошибка!</h4>
                                {this.props.msg}
                            </div>
                            : ''
                        }
                        {
                            this.props.state == 2 && !this.isChanged() ?
                                <div className="alert alert-success">
                                    <h4><i className="icon fa fa-check"></i> Улица добавлена!</h4>
                                </div>
                            : ''
                        }
                        <div className="form-group">
                            <label>Название улицы</label>
                            <div className='row'>
                                <div className='col-sm-3'>
                                    <select className="form-control" value={this.state.prefix_id} onChange={e=>this.setState({prefix_id: e.target.value}, this.checkNameParams())}>
                                        {
                                            this.state.prefixes.map(function (prefix) {
                                                return <option value={prefix.type}>{prefix.prefix}</option>
                                            })
                                        }
                                    </select>
                                </div>
                                <div className='col-sm-9'>
                                    <input className="form-control" value={this.state.desk}
                                           onChange={e=>{
                                                this.setState({desk: e.target.value}, this.checkNameParams());
                                            }}
                                           onPaste={e=>{
                                                this.setState({desk: e.target.value}, this.checkNameParams());
                                            }}/>
                                </div>
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Город</label>
                            {this.state.street_id==0 ?
                                <select
                                    className="form-control"
                                    value={this.state.city_id}
                                    onChange={(e)=>{this.setState({city_id: e.target.value}, this.checkNameParams); this.getRegions(e.target.value);}}
                                    >
                                    <option value="0">Не выбран</option>
                                    {
                                        this.state.cities.map((city) => {
                                            return <option value={city.id}>{city.desk}</option>
                                        })
                                    }
                                </select>
                                :
                                <span className="form-control">{this.getCityById(this.state.city_id)}</span>
                            }
                        </div>
                        {this.state.city_id != 0?
                            <div className="form-group">
                                <label>Районы</label>
                                <Multiselect
                                    buttonClass={'form-control'}
                                    onChange={this.handleRegionChange}
                                    data={this.state.regions}
                                    multiple
                                    />
                            </div>
                            :
                            null
                        }
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    {
                        this.state.name_state == 1 || this.state.region_state == 1 && this.props.street != null ?
                            <button type="button" className="btn btn-primary" onClick={()=>this.props.onSave({
                               id: this.state.street_id,
                               prefix: this.state.prefix_id,
                               desk: this.state.desk,
                               city_id: this.state.city_id,
                               desk_changed: this.state.name_state == 1?1:0,
                               regions: this.state.street_regions,
                               region_changed: this.state.region_state == 1?1:0
                            })}>Сохранить</button>
                            :
                            null
                    }
                    {
                        this.state.name_state == 1 ||
                        this.state.region_state == 1 &&
                        this.props.street != null &&
                        this.props.street.street_id == 0?
                            <button type="button" className="btn btn-success" onClick={()=>this.props.onSave({
                                id: this.state.street_id,
                                prefix: this.state.prefix_id,
                                desk: this.state.desk,
                                city_id: this.state.city_id,
                                desk_changed: this.state.name_state == 1?1:0,
                                regions: this.state.street_regions,
                                region_changed: this.state.region_state == 1?1:0
                            }, true)}>Сохранить и продолжить</button>
                        :
                        null
                    }
                    <button type="button" className="btn btn-default" onClick={this.props.onHide}>Закрыть</button>
                </Modal.Footer>
            </Modal>
        )
    }

};

