import React, { PropTypes, Component } from 'react';
import Multiselect from 'react-bootstrap-multiselect';
import FormTextField from '../../common/components/FormTextField.jsx';
import ConfirmDeleteModal from './ConfirmDeleteModal.jsx';

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

class LocationSelectParam extends Component {
  static propTypes = {
    name: PropTypes.string,
    values: PropTypes.array,
    onChangeParam: PropTypes.func
  };
  render=()=>{
    const {name, values, value, onChangeParam} = this.props;
    let content = [];
    for(let i in values) {
      content.push(<option value={i}>{values[i]}</option>)
    }
    if (typeof value == 'undefined') {
      onChangeParam(Object.keys(values)[0])
    };
    return (
        <div className="form-group row">
          <div className="col-md-2">
            <label>{name}:</label>
          </div>
          <div className="col-md-4">
            <select
              className="form-control"
              onChange={(e)=>{onChangeParam(e.target.value)}}
              value={value}
              >
              {content}
            </select>
          </div>
        </div>
    )
  }
}
class LocationParams extends Component {
  static propTypes = {
    params: PropTypes.object,
    values: PropTypes.array,
    onChangeParams: PropTypes.func
  };
  onChangeParam = (val, paramId) => {
    let values = this.props.values;
    values[paramId] = val;
    this.props.onChangeParams(values);
  };
  render=()=>{
    const {params, values} = this.props;
    console.log(values);
    let paramsList = [];
    for(let i in params) {
      let valList = params[i].format;
      if ( valList == '0,1') {
        valList = {0:'Нет', 1:'Да'};
      } else {
        valList = params[i].format.split(',');
      }
      paramsList.push(
        <LocationSelectParam
          name={params[i].name}
          values={valList}
          value={values[params[i].type]}
          onChangeParam={(val)=>this.onChangeParam(val, params[i].type)}
          />
      )
    };
    return (
      <div>
        {paramsList}
      </div>
    )
  }
}

export default class LocationModifyModal extends Component {
  static propTypes = {
    location: PropTypes.object,
    show: PropTypes.bool.isRequired,
    onHide: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired
  };

  constructor(prop) {
    super(prop);
    this.state = {
      name: {
        value: '',
        state: 0,
        msg: ''
      },
      desk: {
        value: '',
        state: 0,
        msg: ''
      },
      params:{},
      paramChanged: false,
      canAddLocation: 0,
      canModifyLocation: 0,
      locationParams: []
    }
  };

  getLocationParamTypes() {
    fetch('/inventory/ajax/locations/params',{credentials: 'include'})
      .then(resp => resp.json())
      .then(resp => {
        this.setState({
          locationParams: resp.data
        });
      });
  };
  componentDidMount = () => {
    this.getLocationParamTypes();
  };

  componentWillReceiveProps = (np) => {
    if (np.location) {
      let params = {};
      for(let i in np.location.params) {
        params[i] = np.location.params[i].value;
      }
      this.setState({
        show_delete_confirm: false,
        name: {
          value: np.location.name.value,
          state: np.location.name.state,
          msg: np.location.name.msg
        },
        desk: {
          value: np.location.desk.value,
          state: np.location.desk.state,
          msg: np.location.desk.msg
        },
        params: params,
        paramChanged: false
      });
    } else {
      let lp = this.state.locationParams;
      let params = {};
      for (let i  in lp) {
        console.log(lp[i]);
        let format = lp[i].format.split(',');
        params[lp[i].type] = format[0];
      }
      this.setState({
        show_delete_confirm: false,
        name: {
          value: '',
          state: 0,
          msg: ''
        },
        desk: {
          value: '',
          state: 0,
          msg: ''
        },
        params: params,
        paramChanged: false
      });
    }
  };

  handleNameChange = (name) => {
    this.setState({name})
  };

  handleDeskChange = (desk) => {
    this.setState({desk})
  };
  render = () => {
    let {name, desk} = this.state;
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
          <Modal.Title>{this.props.location?'Редактирование локации "'+this.props.location.name.value+'"':'Добавление новой локации'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            {this.props.state < 0 && (!this.state.name.state || !this.state.desk.state) ?
              <div className="alert alert-danger">
                <h4><i className="icon fa fa-ban"></i> Ошибка!</h4>
                {this.props.msg}
              </div>
              : ''
            }
            {
              this.props.state == 2 && (!this.state.name.state || !this.state.desk.state) ?
                <div className="alert alert-success">
                  <h4><i className="icon fa fa-check"></i> Локация добавлена!</h4>
                </div>
                : ''
            }
            {
              this.props.state == 3 && (!this.state.name.state || !this.state.descr.state) ?
                <div className="alert alert-success">
                  <h4><i className="icon fa fa-check"></i> Локация удалена!</h4>
                </div>
                : ''
            }
            <FormTextField
              label={'Название'}
              value={name.value}
              state={name.state}
              msg={name.msg}
              required={true}
              onChange={this.handleNameChange}
              />
            <FormTextField
              label={'Описание'}
              value={desk.value}
              state={desk.state}
              msg={desk.msg}
              required={true}
              onChange={this.handleDeskChange}
              />
            <LocationParams
              params={this.state.locationParams}
              values={this.state.params}
              onChangeParams={(e)=>{this.setState({
              props: e,
              paramChanged: true
            })}}
              />
          </div>
        </Modal.Body>
        <Modal.Footer>
          {
            this.state.name.state == 1 && this.state.desk.state == 1 ||
            this.state.name.value != '' && this.state.desk.value !='' && (this.state.name.state == 1 || this.state.desk.state == 1 || this.state.paramChanged)  ?
              <button type="button" className="btn btn-primary" onClick={()=>this.props.onSave({
                               location_id: this.props.location? this.props.location.location_id:0,
                               name: this.state.name.value,
                               desk: this.state.desk.value,
                               params: this.state.params
                            })}>Сохранить</button>
              :
              null
          }
          {
            this.props.location != null &&
            this.state.name.state ==1 &&
            this.state.desk.state ==1?
              <button type="button" className="btn btn-success" onClick={()=>this.props.onSave({
                               location_id: this.props.location.location_id,
                               name: this.state.name.value,
                               desk: this.state.desk.value,
                               params: this.state.params
                            }, true)}>Сохранить и продолжить</button>
              :
              null
          }
          {this.props.location && this.props.canDeleteLocation ?
            <ConfirmDeleteModal
              show = {this.state.show_delete_confirm}
              handleClose={()=>this.setState({show_delete_confirm: false})}
              handleConfirm={()=>this.props.onDelete(this.props.location.location_id)}
              msg={'Вы уверены, что хотите удалить локацию "'+this.props.location.name.value+'"?'}
              />
            :
            ''
          }
          {this.props.location && this.props.canDeleteLocation?
            <button type="button" className="btn btn-danger" onClick={()=>{this.setState({show_delete_confirm: true})}}>Удалить</button>
            :
            ''
          }
          <button type="button" className="btn btn-default" onClick={this.props.onHide}>Закрыть</button>
        </Modal.Footer>
      </Modal>
    )
  }

};

