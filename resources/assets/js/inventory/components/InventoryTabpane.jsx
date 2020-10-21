var $ = require('jquery');
var React = require('react');
var ReactDOM = require('react-dom');
var AppDispatcher = require('../../common/dispatcher/AppDispatcher');
var Multiselect = require('react-bootstrap-multiselect');
var InventoryStore = require('../stores/InventoryStore');
var InventoryActions = require('../actions/InventoryActions.js');
var classNames = require('classnames');

var InventoryTabpane = React.createClass({

    getInitialState: function() {
        let columns = InventoryStore.getColumns();
        let columns_select = [];
        for(let col in columns) {
            columns_select.push({
                value: col,
                label: columns[col].label,
                selected: columns[col].selected
            });
        }
        let filters = InventoryStore.getFiltersConfig();
        let filters_select = [];
        for(let f in filters) {
            filters_select.push({
                value: f,
                label: filters[f].label,
                selected: filters[f].favorites
            });
        }
        return {
            equipment_view: this.props.controlbar_params.inventory.equipment_view || 1,
            columns: columns_select,
            columns_changed: false,
            filters: filters_select,
            filters_changed: false
        }
    },
    handleSelect: function(e) {
        console.log('Handle select');
        console.log(e.val());
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
            f[i].selected = true;
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
            columns[select_columns_list[i].value].selected = select_columns_list[i].selected?1:0;
        }
        InventoryActions.setParams({columns: columns});
        $.ajax({
            type: "POST",
            beforeSend: function (request) {
                return request.setRequestHeader('X-CSRF-Token', $("meta[name='csrf-token']").attr('content'));
            },
            url: '/inventory/ajax/settings/inventory-table-columns/',
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
            url: '/inventory/ajax/settings/equipment-filters/',
            data: {
                filters: filters
            },
            success: () => {this.setState({filters_changed: false})}
        });
    },
    handleChange: function() {
        if (this.state.equipment_view == 1) {
            window.location='/inventory/equipment?view=2';
        } else {
            window.location='/inventory/equipment?view=1';
        }
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
        let on_cn = classNames('btn', 'btn-xs', {'btn-default':this.state.equipment_view==1, 'btn-primary':this.state.equipment_view==2, 'active': this.state.equipment_view==2});
        let off_cn = classNames('btn', 'btn-xs', {'btn-default':this.state.equipment_view==2, 'btn-primary':this.state.equipment_view==1, 'active': this.state.equipment_view==1});
        return(
            <div className="inventory-tabpane con">
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
                <div className="form-group">
                    <label>Избранные фильтры:</label>
                    <Multiselect
                        onChange={this.handleSelectFilter}
                        onSelectAll={this.handleSelectAllFilters}
                        onDeselectAll={this.handleDeselectAllFilters}
                        data={this.state.filters}
                        enableFiltering={true}
                        includeSelectAllOption={true}
                        multiple
                        />
                    <span>
                        {filters_btn}
                    </span>
                </div>
                <div class="btn-group btn-toggle">
                    <button className={on_cn} onClick={this.handleChange}>ON</button>
                    <button className={off_cn} onClick={this.handleChange}>OFF</button>
                    Включить расширенный режим
                </div>
            </div>
        )
    }
});

module.exports = InventoryTabpane;