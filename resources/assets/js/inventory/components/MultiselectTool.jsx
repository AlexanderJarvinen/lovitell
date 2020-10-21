var $ = require('jquery');
var React = require('react');
var Autocomplete = require('react-autocomplete');

var SelectItem = React.createClass({
    handleDelete: function() {
        if (typeof this.props.onDelete != 'undefined') {
            this.props.onDelete(this.props.item.id);
        }
    },
    render: function() {
        let list = (<span className={this.props.item.added?'added':''}>{this.props.item.name}</span>);
        if (typeof this.props.listTemplate != 'undefined') {
            list = this.props.listTemplate(this.props.item);
        }
        return (<li>{list}<i className={'icon clear_btn fa fa-times'} onClick={this.handleDelete}>&nbsp;</i></li>);
    }
});

var SelectedList = React.createClass({
    propTypes: {
        selected: React.PropTypes.array,
        onDelete: React.PropTypes.func
    },
    handleDelete: function(id) {
        if (typeof this.props.onDelete != 'undefined') {
            this.props.onDelete(id);
        }
    },
    render: function() {
        let selected = this.props.selected || [];
        let list = [];
        for(let item in selected) {
            if (typeof selected[item].deleted != 'undefined' &&
                selected[item].deleted) continue;
            if (typeof selected[item].confirmed != 'undefined' &&
                !selected[item].confirmed
            ) continue;
            list.push(<SelectItem
                key={item}
                item={selected[item]}
                onDelete={this.handleDelete}
                listTemplate={this.props.listTemplate}
            />)
        }
        return (
            <ul className={'multiselect_list'}>
            {list}
            </ul>
        )
    }
});

var SelectionField = React.createClass({
    getInitialState: function() {
        return {
            selected_item: '',
            items: []
        }
    },
    itemsDataReceived: function(data) {
        this.setState({
            items: data
        })
    },
    loadItems: function(value) {
        value = value || '';
        $.ajax({
            beforeSend: function (request) {
                return request.setRequestHeader('X-CSRF-Token', $("meta[name='csrf-token']").attr('content'));
            },
            type: 'POST',
            url: this.props.autocomplete,
            data: ({
                search_string: value
            }),
            success: this.itemsDataReceived
        });
    },
    itemChange: function(value) {
        this.setState({selected_item: value});
        if(value.length < 2) {
            return;
        }
        this.loadItems(value);
    },
    render: function() {
        let helper = null;
        if (this.state.street != '') {
            helper = (<i className={'icon clear_btn fa fa-times'} onClick={this.handleReset}>&nbsp;</i>);
        }
        return (
            <span>
            <Autocomplete
                inputProps={{name: "Улица", id: "streets-autocomplete"}}
                ref="autocomplete"
                value={this.state.selected_item}
                items={this.state.items}
                getItemValue={(item) => item.value}
                onSelect={this.onSelect}
                onChange={this.itemChange}
                renderItem={(item, isHighlighted) => (
                    <div
                        style={isHighlighted ? styles.highlightedItem : styles.item}
                        key={item.key}
                        id={item.key}
                    >{item.value}</div>
                )}
            />{helper}
            </span>
        )
    }
});

var SelectionSelect = React.createClass({
    propTypes: {
        items: React.PropTypes.array,

        onChange: React.PropTypes.func
    },
    handleChange: function(e) {
        let index = e.nativeEvent.target.selectedIndex;
        this.props.onChange({
            id: e.target.value,
            name: e.nativeEvent.target[index].text
        });
    },
    render: function() {
        let options = [];
        options.push(<option value={0}>Выберите пункт из списка</option>);
        for(let item in this.props.items) {
            options.push(<option value={this.props.items[item].id}>{this.props.items[item].name}</option>);
        }
        return (
            <select
                onChange={this.handleChange}
                value={this.props.current}
            >
            {options}
            </select>)
    }
});

var SelectionContainer = React.createClass({
    propTypes: {
        items: React.PropTypes.array,
        autocomplete_url: React.PropTypes.string,
        onChange: React.PropTypes.func
    },
    selectHandle: function(item) {
        if (typeof this.props.onChange != "undefined") {
            this.props.onChange(item);
        }
    },
    render: function() {
        let select_tool = <SelectionSelect
            items={this.props.items || []}
            current={this.props.current}
            onChange={this.selectHandle}
        />;
        if (typeof this.props.autocomplete_url != 'undefined') {
            select_tool = <SelectionField />;
        }
        return (
            <div className="selection_wrap">
                {select_tool}
            </div>
        )
    }

});

var MultiSelectTool = React.createClass({
    getInitialState: function() {
        return {
            selected: this.props.selected || [],
            current: 0 || this.props.current,
            needConfirm: this.props.needConfirm || false,
            last_added: null
        }
    },
    propTypes: {
        items: React.PropTypes.array,
        autocomplete_url: React.PropTypes.string,
        selected: React.PropTypes.array,
        norepeat: React.PropTypes.bool,
        needConfirm: React.PropTypes.bool
    },
    handleChange: function() {
        if (typeof this.props.onChange != 'undefined') {
            this.props.onChange(this.state.selected, this.state.last_added)
        }
    },
    handleSelect: function(item) {
        let selected = this.state.selected;
        for(let i in selected) {
            if (selected[i].id == item.id) return;
        }
        item.added = true;
        if (this.state.needConfirm) {
            item.confirmed = false;
        }
        selected.push(item);
        this.setState({
            selected: selected,
            last_added: item
        },
        this.handleChange);
    },
    handleDelete: function(item_id) {
        let selected = this.state.selected;
        for (let i in selected) {
            if (selected[i].id == item_id) {
                if (selected[i].added == true) {
                    delete selected[i];
                } else {
                    selected[i].deleted = true;
                }
            }
        }
        this.setState({
            selected: selected
        }, this.handleChange);
    },
    render: function() {
        return (
            <div className="multiselecttool_wrap">
                <SelectedList
                    selected={this.props.selected || []}
                    current={this.props.current}
                    onDelete={this.handleDelete}
                    listTemplate={this.props.listTemplate}
                />
                <SelectionContainer
                    autocomplete={this.props.autocomplete_url}
                    items={this.props.items}
                    onChange={this.handleSelect}
                />
            </div>
        )
    }
});

module.exports=MultiSelectTool;