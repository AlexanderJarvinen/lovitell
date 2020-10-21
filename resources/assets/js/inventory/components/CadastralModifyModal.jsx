import React, { PropTypes, Component } from 'react';
import Multiselect from 'react-bootstrap-multiselect';
import FormTextField from '../../common/components/FormTextField.jsx';
import FormSelectField from '../../common/components/FormSelectField.jsx';
import FormMultiselectField from '../../common/components/FormMultiselectField.jsx';

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

export default class CadastralModifyModal extends Component {
    static propTypes = {
        cadastral: PropTypes.object,
        show: PropTypes.bool.isRequired,
        onHide: PropTypes.func.isRequired,
        onSave: PropTypes.func.isRequired
    };

    constructor(prop) {
        super(prop);
        this.state = {
            number: {
                value: '',
                state: 0,
                msg: ''
            },
            type: {
                value: 0,
                state: 0,
                msg: ''
            },
            descr: {
                value: '',
                state: 0,
                msg: ''
            },
            url: {
                value: '',
                state: 0,
                msg: ''
            },
            regions: {
                value: [],
                state: 0,
                msg: ''
            },
            city: {
                value: 0,
                state: 0,
                msg: ''
            },
            typesList: [],
            citiesList: [],
            regionsList: [],
            canAddLocation: 0,
            canModifyLocation: 0,
            selRegions: []
        }
    };

    getTypes = () => {
        fetch('/inventory/ajax/cadastral/types', {method: 'GET', credentials: 'include'})
        .then(resp=>resp.json())
        .then(resp=> {
              if (resp.error == 0) {
                  this.setState({typesList: resp.data});
              } else {
                  console.log('Getting types error');
              }
          });
    };

    getCities = () => {
        fetch('/inventory/ajax/cities', {method: 'GET', credentials: 'include'})
        .then(resp=>resp.json())
        .then(resp=> {
            this.setState({citiesList: resp})
        })
    };

    componentDidMount = () => {
        this.getTypes();
        this.getCities();
    };

    componentWillReceiveProps = (np) => {
        if (np.cadastral) {
            let {cadastral} = np;
            console.log(cadastral);
            this.setState({
                number: cadastral.number,
                type: cadastral.type,
                descr: cadastral.descr,
                url: cadastral.url,
                regions: cadastral.regions
            });
        } else {
            this.setState({
                number: {
                    value: '',
                    state: 0,
                    msg: ''
                },
                type: {
                    value: 0,
                    state: 0,
                    msg: ''
                },
                descr: {
                    value: '',
                    state: 0,
                    msg: ''
                },
                url: {
                    value: '',
                    state: 0,
                    msg: ''
                },
                regions: []
            });
        }
    };

    handleNumberChange = (number) => {
        this.setState({number});
    };

    handleDescrChange = (descr) => {
        this.setState({descr});
    };

    handleTypeChange = (type) => {
        this.setState({type});
    };

    handleURLChange = (url) => {
        this.setState({url})
    };

    handleCityChange = (city) => {
        this.setState({city});
        this.getRegions(city.value);
    };

    canSave = () => {
      let {cadastral} = this.props;
      let {number, descr, type, url, city, regions} = this.state;
      if (!cadastral) {
        return number.state == 1 &&
            descr.state == 1 &&
            (city.state == 0 || city.state != 0 && regions.state ==1)
      } else {
        return number.value &&
          descr.value &&
          (city.state == 0 || city.state != 0 && regions.state ==1) &&
          (number.state == 1 ||
          descr.state == 1 ||
          type.state == 1 ||
          url.state == 1 ||
          regions.state == 1)
      }
    };
    handleRegionsChange = (regions) => {
      this.setState({regions});
    };
    getRegions = (city_id) => {
        if (city_id) {
        fetch('/inventory/ajax/city/' + city_id + '/regions', {method: 'GET', credentials: 'include'})
          .then(response => response.json())
          .then(json => {
            this.setState({
              regionsList: json
            });
          });
      }
    };
    render = () => {
        let {number, descr, type, url, city, regions} = this.state;
        return (
            <Modal
                dialogComponentClass={DraggableModalDialog}
                show={this.props.show}
                onHide={this.props.onHide}
                animation={false}
                backdrop={false}
                enforceFocus={false}
                className={'cadastral-modify'}
                >
                <Modal.Header closeButton>
                    <Modal.Title>{this.props.cadastral?'Редактирование номера "'+this.props.cadastral.number.value+'"':'Добавление нового номера'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div>
                        {this.props.state < 0 ?
                            <div className="alert alert-danger">
                                <h4><i className="icon fa fa-ban"></i> Ошибка!</h4>
                                {this.props.msg}
                            </div>
                            : ''
                        }
                        {
                            this.props.state == 2 ?
                                <div className="alert alert-success">
                                    <h4><i className="icon fa fa-check"></i> Кадастровый номер добавлен!</h4>
                                </div>
                            : ''
                        }
                        <FormTextField
                          label={'Номер'}
                          value={number.value}
                          state={number.state}
                          msg={number.msg}
                          required={true}
                          onChange={this.handleNumberChange}
                          />
                        <FormSelectField
                          data={this.state.typesList}
                          value={type.value}
                          state={type.state}
                          msg={type.msg}
                          onChange={this.props.handleTypeChange}
                          label={'Тип'}
                          required={true}
                          disabled={false}
                          keyName={'type'}
                          />
                        <FormTextField
                          label={'Описание'}
                          value={descr.value}
                          state={descr.state}
                          msg={descr.msg}
                          required={true}
                          onChange={this.handleDescrChange}
                          />
                        <FormTextField
                          label={'URL'}
                          value={url.value}
                          state={url.state}
                          msg={url.msg}
                          required={false}
                          onChange={this.handleURLChange}
                          />
                        <FormSelectField
                          label={'Город'}
                          value={city.value}
                          state={city.state}
                          msg={city.msg}
                          onChange={this.handleCityChange}
                          data={this.state.citiesList}
                          keyName={'id'}
                          keyDescr={'desk'}
                          required={true}
                          placeholder={'Выберите город'}
                          />
                        {city.value?
                            <FormMultiselectField
                              label={'Регионы'}
                              value={regions.value}
                              state={regions.state}
                              msg={regions.msg}
                              onChange={this.handleRegionsChange}
                              data={this.state.regionsList}
                              keyName={'region_id'}
                              keyDescr={'desk'}
                            />
                            :
                            null
                        }
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    {
                        this.canSave() ?
                            <button type="button" className="btn btn-primary" onClick={()=>this.props.onSave({
                               cadastral_id: this.props.cadastral? this.props.cadastral.cadastral_id:0,
                               number: this.state.number.value,
                               descr: this.state.descr.value,
                               type: this.state.type.value,
                               url: this.state.url.value,
                               regions: this.state.regions.value
                            })}>Сохранить</button>
                            :
                            null
                    }
                    {
                        this.props.cadastral == null && this.canSave()?
                            <button type="button" className="btn btn-success" onClick={()=>this.props.onSave({
                               cadastral_id: this.props.cadastral? this.props.cadastral.cadastral_id:0,
                               number: this.state.number.value,
                               descr: this.state.descr.value,
                               type: this.state.type.value,
                               url: this.state.url.value,
                               regions: this.state.regions.value
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

