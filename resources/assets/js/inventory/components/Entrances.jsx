var $ = require('jquery');
var React = require('react');
var ReactDOM = require('react-dom');
var Modal = require('react-modal');
var classNames = require('classnames');

var Entrances = React.createClass({
    getInitialState: function() {
        return {
            entrances: [],
            new_entr_floors: '',
            new_entr_id: 0,
            new_entr_interior: 0,
            error_msg: ''
        }
    },
    componentDidMount: function() {
        this.loadEntrances();
    },
    loadEntrances: function() {
        $.ajax({
            type: "GET",
            url: "/inventory/building/"+this.props.address_id+"/entrances",
            success: this.loadEntrancesSuccess,
            error: function() {
                this.setState({'error_msg': 'Ошибка при загрузке данных о подъездах'});
            }.bind(this)
        });
    },
    loadEntrancesSuccess: function(a) {
        let data = [];
        for(let k in a) {
            data[k] = {
                floors: a[k].floors,
                interior: a[k].interior==1?1:0,
                is_changed: 0,
                deleted: 0
            };
        }
        this.setState({entrances: data, is_changed: 0, error_msg: ''});
    },
    deleteEntrance: function(entrance_id) {
        let data = this.state.entrances;
        data[entrance_id].deleted = 1;
        this.setState({entrances: data, is_changed: 1});
    },
    entranceChange: function(entrance_id, e) {
        let data = this.state.entrances;
        data[entrance_id].floors = e.target.value;
        data[entrance_id].is_changed = 1;
        this.setState({entrances: data, is_changed: 1});
    },
    entranceInteriorChange: function(entrance_id, e) {
        let data = this.state.entrances;
        data[entrance_id].interior = e.target.checked?1:0;
        data[entrance_id].is_changed = 1;
        this.setState({entrances: data, is_changed: 1});
    },
    addEntrance: function() {
        let data = this.state.entrances;
        data[this.state.new_entr_id] = {
            floors: this.state.new_entr_floors,
            interior: this.state.new_entr_interior,
            is_changed: 1,
            deleted: 0
        };
        console.log(data);
        this.setState({
            entrances: data,
            is_changed: 1,
            new_entr_floors: '',
            new_entr_id: 0,
            new_entr_interior: 0
        });
    },
    makeTableContent: function() {
        let data = this.state.entrances;
        let resp = [];
        for(let k in data) {
            if (data[k].deleted == 1) continue;
            resp.push(
                <tr key={k}>
                    <td>
                        <b>Подъезд {k}</b>
                    </td>
                    <td>
                        <input className={'entrance-num'} value={data[k].floors} onChange={this.entranceChange.bind(null, k)} />
                    </td>
                    <td>
                        <input type="checkbox" checked={data[k].interior} onChange={this.entranceInteriorChange.bind(null, k)} />
                    </td>
                    <td>
                        <i className="fa fa-times link" onClick={this.deleteEntrance.bind(null, k)}></i>
                    </td>
                </tr>
            )
        }
        if (resp.length == 0) {
            resp.push(<tr key={-1}><td colSpan={3}>{'Нет информации о подъездах'}</td></tr>)
        }
        return resp;
    },
    saveHandler: function(){
        console.log(this.state.entrances);
        $.ajax({
            beforeSend: function (request) {
                return request.setRequestHeader('X-CSRF-Token', $("meta[name='csrf-token']").attr('content'));
            },
            type: "POST",
            url: "/inventory/building/"+this.props.address_id+"/entrances",
            data: {
                'entrances': this.state.entrances
            },
            success: function (a) {
                if (a.error == 0) {
                    this.loadEntrances();
                } else {
                    this.setState({error_msg: 'Ошибка при сохранении информации о подъездах'});
                }
            }.bind(this),
            error: function(a) {
                this.setState({error_msg: 'Ошибка при сохранении информации о подъездах'});
            }.bind(this)
        });
    },
    resetHandler: function() {
        this.loadEntrances();
    },
    render: function() {
        let trs = this.makeTableContent();
        let buttons = null;
        if (this.state.is_changed) {
            buttons = <div className='button-pane' >
                <button className='btn btn-primary btn-md' onClick={this.saveHandler}>Сохранить</button>
                <button className='btn btn-danger btn-md' onClick={this.resetHandler}>Отменить</button>
            </div>
        }
        let error_msg = null;
        if (this.state.error_msg != '') {
            error_msg = <div class="error">{this.state.error_msg}</div>
        }
        return(
            <div>
                <table>
                    <thead>
                        <tr>
                            <th>Подъезд</th>
                            <th>Количество этажей</th>
                            <th>С отделкой</th>
                            <th>X</th>
                        </tr>
                    </thead>
                    <tbody>
                        {trs}
                    </tbody>
                    <tfoot>
                        <tr>
                            <td>Новый Подъезд №:
                                <input
                                    className="entrance-num"
                                    size={2}
                                    value={this.state.new_entr_id}
                                    onChange={(e)=>{this.setState({new_entr_id: e.target.value})}}
                                />
                            </td>
                            <td colSpan={1}>
                                <input
                                    className="entrance-num"
                                    size={2}
                                    value={this.state.new_entr_floors}
                                    onChange={(e)=>{this.setState({new_entr_floors: e.target.value})}}
                                />
                            </td>
                            <td>
                                <input type="checkbox"
                                  className="entrance-interior"
                                  onChange={(e)=>{this.setState({new_entr_interior: e.target.checked?1:0})}}
                                  checked={this.state.new_entr_interior}
                                  />
                            </td>
                            <td>
                                {this.state.new_entr_id && this.state.new_entr_floors?<button className="btn btn-primary btn-xs"  onClick={this.addEntrance}>Добавить</button>:''}
                            </td>
                        </tr>
                        <tr>
                            <td colSpan={3}>
                                {error_msg}
                                {buttons}
                            </td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        )
    }
});

ReactDOM.render(
    <Entrances address_id={BuildingData.address_id} object_type={'build'}/>,
    document.getElementById('table-entrances')
);