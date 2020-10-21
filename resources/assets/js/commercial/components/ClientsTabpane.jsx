var $ = require('jquery');
var React = require('react');
var ReactDOM = require('react-dom');
var AppDispatcher = require('../../common/dispatcher/AppDispatcher');
var Multiselect = require('react-bootstrap-multiselect');
var ClientsStore = require('../stores/ClientsStore');
var ClientsActions = require('../actions/ClientsActions');
var classNames = require('classnames');

var ClientsTabpane = React.createClass({

    getInitialState: function() {
        let columns = ClientsStore.getColumns();
        let columns_select = [];
        for(let col in columns) {
            columns_select.push({
                value: col,
                label: columns[col].label,
                selected: columns[col].selected
            });
        }
        return {
            columns: columns_select,
            columns_changed: false,
        }
    },
    handleSelect: function(e) {
        var c=this.state.columns;
        for(let i in c) {
            if (c[i].value == e.val()) {
                c[i].selected = !c[i].selected;
            }
        }
        this.setState({
            columns: c,
            columns_changed: true
        });
    },
    handleSelectAll: function(e) {
        var c=this.state.columns;
        for(let i in c) {
            c[i].selected = true;
        };
        this.setState({
            columns: c,
            columns_changed: true
        });
    },
    handleDeselectAll: function(e) {
        var c=this.state.columns;
        for(let i in c) {
            c[i].selected = false;
        };
        this.setState({
            columns: c,
            columns_changed: true
        });
    },
    handleSaveColumns: function() {
        let columns = ClientsStore.getColumns();
        let select_columns_list = this.state.columns;
        for(let i in select_columns_list) {
            columns[select_columns_list[i].value].selected = select_columns_list[i].selected?1:0;
        }
        ClientsActions.setParams({columns: columns});
        $.ajax({
            type: "POST",
            beforeSend: function (request) {
                return request.setRequestHeader('X-CSRF-Token', $("meta[name='csrf-token']").attr('content'));
            },
            url: '/commercial/ajax/settings/clients-table-columns/',
            data: {
                columns: columns
            },
            success: () => {this.setState({columns_changed: false})}
        });
    },
    render: function() {
        let btn=null;
        if (this.state.columns_changed) {
            btn = <button className={'btn, btn-xs, btn-primary'} onClick={this.handleSaveColumns}>OK</button>;
        }
        return(
            <div className="commercial-tabpane con">
                <div className="form-group">
                    <label>Показывать столбцы:</label>
                    <Multiselect
                        onChange={this.handleSelect}
                        onSelectAll={this.handleSelectAll}
                        onDeselectAll={this.handleDeselectAll}
                        data={this.state.columns}
                        includeSelectAllOption={true}
                        enableFiltering={true}
                        multiple
                        />
                    <span>
                        {btn}
                    </span>
                </div>
            </div>
        )
    }
});

module.exports = ClientsTabpane;