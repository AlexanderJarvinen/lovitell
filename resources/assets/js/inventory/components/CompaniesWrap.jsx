var $ = require('jquery');
var React = require('react');
var MultiselectTool = require('./MultiselectTool');

require('react-datepicker/dist/react-datepicker.css');


var CompaniesWrap = React.createClass({
    handleChange: function(selected) {
        if (typeof this.props.onChange != 'undefined') {
            this.props.onChange(selected);
        }
    },
    render: function() {
        let companies = null;
        if (this.props.rights == 1) {
            if (this.props.companies.isArray && this.props.companies.length == 0) {
                companies = (<div className="companies_wrap__list-no_companies">Нет управляющих компаний, доступных для добавления</div>);
            } else {
                companies = (
                    <MultiselectTool
                        items={this.props.companies || []}
                        selected={this.props.selected || []}
                        onChange={this.handleChange}
                    />);
            }
        } else {
            if (this.props.selected.length == 0) {
                companies = (<div className="companies_wrap__list-no_companies">Нет информации об управляющих компаниях</div>);
            } else {
                let content = [];
                for(let i in this.props.selected) {
                    content.push(<li>{this.props.selected[i].name}</li>)
                }
                companies = (<ul className="companies_wrap__list">
                {content}
                </ul>)
            }
        }
        return (
            <div className="companies_wrap">
                <h3 className="companies_wrap__title">Управляющие компании</h3>
                {companies}
            </div>
        )
    }
});

module.exports=CompaniesWrap;