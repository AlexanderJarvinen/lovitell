var $ = require('jquery');
var React = require('react');
import ModalDialog from 'react-bootstrap/lib/ModalDialog';
import Draggable from 'react-draggable';
var classNames = require('classnames');
import * as Table from 'reactabular-table';
import { Modal } from 'react-bootstrap';

class DraggableModalDialog extends React.Component {
    render() {
        return <Draggable handle=".modal-title"><ModalDialog
            backdrop={false}
            enforceFocus={false}
            {...this.props} /></Draggable>
    }
}

var IpListModal = React.createClass({
  getColumns: function() {
      return [
          {
              property: 'ip_addr',
              header: {
                  label: 'IP'
              },
              cell: {
                  formatters:[
                      (ip, row) => {
                        return (<a href="#" onClick={this.handleIpSelect.bind(null, ip)}>{ip}</a>)
                      }
                  ]
              }
          },
          {
              property: 'location_desk',
              header: {
                  label: 'Локация'
              }
          },
          {
              property: 'vlan_desk',
              header: {
                  label: 'VLAN'
              }
          }
      ];
  },
  handleIpSelect: function(ip) {
    if (typeof this.props.onChange != 'undefined') {
      this.props.onChange(ip);
    }
  },

  getInitialState: function() {
        return {
            items: []
        }
    },
    makeIpList: function(a) {
        let items = [];
        if (a.error==0) {
            this.setState({
                items: a.data
            })
        }
    },
    getIpList: function(location_id, vlan_id) {
        if (location_id && vlan_id) {
            $.ajax({
                type: 'GET',
                url: '/inventory/ajax/iplist/' + location_id + '/' + vlan_id,
                success: this.makeIpList
            });
        }
    },
    componentWillReceiveProps: function(np) {
        if (np.show) {
            this.getIpList(np.location_id, np.vlan_id);
        }
    },
    componentDidMount: function() {
        if (this.props.vlan_id && this.props.location_id) {
            this.getIpList(this.props.location_id, this.props.vlan_id);
        }
    },
    render: function() {
        return (
            <Modal
                dialogComponentClass={DraggableModalDialog}
                show={this.props.show}
                onHide={this.props.handleClose}
                animation={false}
                backdrop={false}
                enforceFocus={false}
                >
                <Modal.Header closeButton>
                    <Modal.Title>Выбор IP-адреса</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Table.Provider
                      className="table table-bordered table-hover dataTable"
                      columns={this.getColumns()}
                      style={{ overflowX: 'auto' }}
                      >
                        <Table.Header />

                        <Table.Body
                          rows={this.state.items}
                          rowKey="ip_addr"
                          />

                    </Table.Provider>

                </Modal.Body>
                <Modal.Footer>
                    <button type="button" className="btn btn-default" onClick={this.props.handleClose}>Закрыть</button>
                </Modal.Footer>
            </Modal>
        );
    }
});

module.exports=IpListModal;