var $ = require('jquery');
import ReactDOM from 'react-dom';

import React, { PropTypes, Component } from 'react';

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

class ConfirmMessageBox extends Component {
  static propTypes = {
    error: PropTypes.bool,
    route: PropTypes.string.isRequired,
    msg: PropTypes.string

  };
  render = () => {
    const {route, error} = this.props;
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
          <Modal.Title>{'Конфигурирование точки доступа '+route}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error?
              <div className="alert alert-danger">
                <h4><i className="icon fa fa-ban"></i> Ошибка!</h4>
                {this.props.msg}
              </div>
            :
              <div className="alert alert-success">
                <h4><i className="icon fa fa-check"></i> Задача добавлена в очередь на исполнение</h4>
              </div>
          }
        </Modal.Body>
        <Modal.Footer>
          <button type="button" className="btn btn-default" onClick={this.props.onHide}>Закрыть</button>
        </Modal.Footer>
      </Modal>
    )
  }
}

class ConfigureAP extends Component {
    static propTypes = {
        route: PropTypes.string.isRequired,
    };

    state = {
      error: 0,
      show:false
    };

    routeConfig = () => {
      let that = this;
      if (this.props.route) {
        $.ajax({
          url: "/inventory/ajax/configure-route/"+this.props.route,
          type: "GET",
          dataType: "json",
          success: function (data) {
            if (data.error == 0) {
              that.setState({
                error: 0,
                show: true
              });
            } else {
              that.setState({
                error: 1,
                show: true,
                msg: data.msg
              });
            }
          }
        });
      }
    };

    render = () => {
        let route = this.props.route;
        return (
          <div className="route-configure">
            <a onClick={this.routeConfig}>Настроить</a>
            <ConfirmMessageBox
              show={this.state.show}
              error={this.state.error}
              msg={this.state.msg}
              route={this.props.route}
              onHide={()=>{
                this.setState({
                  error: 0,
                  show: false,
                  msg: ''
                })
              }}
              />
          </div>
        )
    }
}

ReactDOM.render(
    <ConfigureAP
        route={route}
    />,
    document.getElementById('route-config')
);