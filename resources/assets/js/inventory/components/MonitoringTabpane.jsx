var $ = require('jquery');
var React = require('react');
var ReactDOM = require('react-dom');
var AppDispatcher = require('../../common/dispatcher/AppDispatcher');
var Multiselect = require('react-bootstrap-multiselect');
var InventoryStore = require('../stores/InventoryStore');
var InventoryActions = require('../actions/InventoryActions.js');
var classNames = require('classnames');

var MonitoringTabpane = React.createClass({

    getInitialState: function() {
        let columns = InventoryStore.getColumns();
        let columns_select = [];
        for(let col in columns) {
            columns_select.push({
                value: col,
                label: columns[col].label,
                selected: columns[col].selected == 1
            });
        }
        let filters = InventoryStore.getFiltersConfig();
        let filters_select = [];
        for(let f in filters) {
            filters_select.push({
                value: f,
                label: filters[f].label,
                selected: filters[f].favorites == 1
            });
        }
        return {
            duration: this.props.controlbar_params.monitoring.update_duration || 1,
            new_duration: this.props.controlbar_params.monitoring.update_duration || 1,
            columns: columns_select,
            columns_changed: false,
            filters: filters_select,
            filters_changed: false
        }
    },
    handleChange: function(e) {
        if (e.target.value != '') {
            let val = parseInt(e.target.value);
            if (val > 0 && val <= 60) {
                this.setState({new_duration: val});
            }
        } else {
            this.setState({new_duration: e.target.value});
        }
    },
    handleSave: function(){
        $.get('/inventory/ajax/settings/monitoring-update-duration/' + this.state.new_duration);
        InventoryActions.setParams({'update_duration': this.state.new_duration});
        this.setState({duration: this.state.new_duration});
    },
    handleSelect: function(e) {
        var c=this.state.columns;
        for(let i in c) {
            if (c[i].value == e.val()) {
                c[i].selected = !c[i].selected;
            }
        }
        console.log(c);
        this.setState({
            columns: c,
            columns_changed: true
        });
    },
    handleSelectAll: function(e) {
        var c=this.state.columns;
        for(let i in c) {
            c[i].selected = e;
        };
        this.setState({
            columns: c,
            columns_changed: true
        });
    },
    handleSelectFilter: function(e) {
        var f=this.state.filters;
        for(let i in f) {
            if (f[i].value == e.val()) {
                f[i].selected = !f[i].selected;
            }
        }
        this.setState({
            filters: f,
            filters_changed: true
        });
    },
    handleSelectAllFilters: function(e) {
        var f=this.state.filters;
        for(let i in f) {
            f[i].selected = e;
        };
        this.setState({
            filters: f,
            filters_changed: true
        });
    },
    handleSaveColumns: function() {
        let columns = InventoryStore.getColumns();
        let select_columns_list = this.state.columns;
        for(let i in select_columns_list) {
            columns[select_columns_list[i].value].selected = select_columns_list[i].selected == true?1:0;
        }
        InventoryActions.setParams({columns: columns});
        $.ajax({
            type: "POST",
            beforeSend: function (request) {
                return request.setRequestHeader('X-CSRF-Token', $("meta[name='csrf-token']").attr('content'));
            },
            url: '/inventory/ajax/settings/monitoring-table-columns/',
            data: {
                columns: columns
            },
            success: () => {this.setState({columns_changed: false})}
        });
    },
    handleSaveFilters: function() {
        let filters = InventoryStore.getFiltersConfig();
        let selected_filters = this.state.filters;
        for(let i in selected_filters) {
            filters[selected_filters[i].value].favorites = selected_filters[i].selected?1:0;
        }
        InventoryActions.setParams({filters: filters});
        $.ajax({
            type: "POST",
            beforeSend: function (request) {
                return request.setRequestHeader('X-CSRF-Token', $("meta[name='csrf-token']").attr('content'));
            },
            url: '/inventory/ajax/settings/monitoring-filters/',
            data: {
                filters: filters
            },
            success: () => {this.setState({filters_changed: false})}
        });
    },
    render: function() {
        let btn=null;
        if (this.state.columns_changed) {
            btn = <button className={'btn, btn-xs, btn-primary'} onClick={this.handleSaveColumns}>OK</button>;
        }
        let filters_btn=null;
        if (this.state.filters_changed) {
            filters_btn = <button className={'btn, btn-xs, btn-primary'} onClick={this.handleSaveFilters}>OK</button>;
        }
        return(
            <div className="inventory-tabpane con">
                <div className="form-group">
                    <label>Показывать столбцы:</label>
                    <Multiselect
                        onChange={this.handleSelect}
                        onSelectAll={this.handleSelectAll}
                        data={this.state.columns}
                        enableFiltering={true}
                        includeSelectAllOption={true}
                        multiple
                    />
                    <span>
                        {btn}
                    </span>
                </div>
                <div className="form-group">
                    <label>Избранные фильтры:</label>
                    <Multiselect
                        onChange={this.handleSelectFilter}
                        onSelectAll={this.handleSelectAllFilters}
                        data={this.state.filters}
                        enableFiltering={true}
                        includeSelectAllOption={true}
                        multiple
                        />
                    <span>
                        {filters_btn}
                    </span>
                </div>
                <div className="form-group">
                    <h5>Период автообновления (мин.):</h5>
                    <input type="text"
                        value={this.state.new_duration}
                        onChange={this.handleChange}
                        size="2"
                    />
                    {this.state.duration != this.state.new_duration && this.state.new_duration != ''?
                        <button className={'btn, btn-xs, btn-primary'} onClick={this.handleSave}>OK</button>:
                        null
                       }
                </div>
            </div>
        )
    }
});

module.exports = MonitoringTabpane;