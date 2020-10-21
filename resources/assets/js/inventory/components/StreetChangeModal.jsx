var $ = require('jquery');
var React = require('react');
var ReactDOM = require('react-dom');
//var Modal = require('react-modal');
import { Modal } from 'react-bootstrap'
var classNames = require('classnames');
var LoadBar = require('../../common/components/LoadBar.jsx');
var AppActions = require('../../common/actions/AppActions.js');
import Draggable from 'react-draggable';
import ModalDialog from 'react-bootstrap/lib/ModalDialog';
var Multiselect = require('react-bootstrap-multiselect');

class DraggableModalDialog extends React.Component {
    render() {
        return <Draggable handle=".modal-title"><ModalDialog
            backdrop={false}
            enforceFocus={false}
            {...this.props} /></Draggable>
    }
}

var StreetChangeModal = React.createClass({
    propTypes: {
        cities: React.PropTypes.array,
        street: React.PropTypes.object,
    },
    getInitialState: function() {
        return {
            desk: this.props.street.desk || '',
            desk_state: 0,
            prefix_id: this.props.street.prefix_id || 0,
            region_state: 0,
            regions: [],
            state: 0,
            msg: ''
        }
    },
    componentDidMount: function() {
    },
    componentWillReceiveProps(np) {
        if (np.street.street_id != this.props.street.street_id) {
            this.setState({
                desk: np.street.desk,
                desk_state: 0,
                prefix_id: np.street.prefix_id,
                region_state: 0
            },
            this.getRegions(np.street.city_id));
        }
    },
    makeRegionList: function(data) {
        let regions = [];
        for(let i in data) {
            let region = {
                value: data[i].region_id,
                label: data[i].desk,
                added: 0,
                deleted: 0,
                selected: 0
            };
            let region_id = data[i].region_id;
            if (this.props.street.regions.find(function (v, i) {
                    return v.region_id === region_id;
            }.bind(region_id)))
            {
                region.selected = 1;
                region.added = 1;
            }
            regions[regions.length] = region;
        }
        this.setState({
            regions: regions
        });
    },
    getRegions: function(city_id) {
        if (city_id) {
            $.ajax({
                type: 'GET',
                url: '/inventory/regions/' + city_id,
                success: this.makeRegionList
            });
        }
    },
    handleRegionChange: function(e) {
        let regions = this.state.regions;
        for(let i in regions) {
            if (regions[i].value == e.val()) {
                regions[i].selected = regions[i].selected == 1?0:1;
                regions[i].deleted = (regions[i].selected == 0 && regions[i].added == 1)?1:0;
            }
        }
        this.setState({regions: regions, region_state: 1});
    },
    handleSaveResponse: function(data) {
        if (data.error == 0) {
            this.setState({
                desk_state: this.state.desk_state == 1? 2:this.state.desk_state,
                region_state: this.state.region_state == 1? 2: this.state.region_state,
                state: 1
            });
            this.setState(this.getInitialState(), this.props.onSave);
        } else {
            if (data.desk.error != 0) {
                this.setState({
                    desk_state: -1
                });
            }
            if (data.region.error != 0) {
                this.setState({
                    region_state: -1
                });
            }
        }
    },
    handleStreetSave: function() {
        $.ajax({
            method: 'POST',
            url: '/inventory/ajax/street/'+this.props.street.street_id,
            data: {
                prefix: this.state.prefix_id,
                desk: this.state.desk,
                desk_change: this.state.desk_state==1?1:0,
                regions: this.state.regions,
                region_change: this.state.region_state==1?1:0
            },
            success: this.handleSaveResponse
        })
    },
    render: function() {
        console.log('Regions:');
        console.log(this.state.regions);
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
                    <Modal.Title>Редактирование {this.state.prefix} {this.props.street.desk}</Modal.Title>
                </Modal.Header>
                <Modal.Body>

                    <div>
                        <div className="form-group">
                            <label>Название улицы</label>
                            <select value={this.state.prefix_id} onChange={e=>this.setState({prefix_id: e.target.value, desk_state: 1})}>
                                {
                                    this.props.prefixes.map(function (prefix) {
                                        return <option value={prefix.type}>{prefix.prefix}</option>
                                    })
                                }
                            </select>
                            <input value={this.state.desk} onChange={e=>this.setState({desk:e.target.value, desk_state: 1})} />
                        </div>
                        <div className="form-group">
                            <label>Город</label>
                            <div>{this.props.street.city_desk}</div>
                        </div>
                        <div className="form-group">
                            <label>Район</label>
                            <Multiselect
                                onChange={this.handleRegionChange}
                                data={this.state.regions}
                                multiple
                                />
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    {
                        this.state.desk_state == 1 || this.state.region_state == 1 ?
                        <button type="button" className="btn btn-default" onClick={this.handleStreetSave}>Сохранить</button>
                        :
                        null
                    }
                    <button type="button" className="btn btn-default" onClick={this.props.handleClose}>Закрыть</button>
                </Modal.Footer>
            </Modal>
        )
    }
});

module.exports=StreetChangeModal;

