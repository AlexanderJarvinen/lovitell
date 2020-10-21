var $ = require('jquery');
var React = require('react');
var classNames = require('classnames');

var Pagination = React.createClass({
    toFirst: function() {
        if (this.props.page == 1) return;
        this.props.onChange(1);
    },
    toLast: function() {
        let total_pages = parseInt(this.props.rows/this.props.on_page);
        if (this.props.rows>this.props.on_page*total_pages) total_pages++;
        if (this.props.page == total_pages || total_pages == 0) return;
        this.props.onChange(total_pages);
    },
    toPrev: function() {
        if (this.props.page == 1) return;
        this.props.onChange(this.props.page-1);
    },
    toNext: function() {
        let total_pages = parseInt(this.props.rows/this.props.on_page);
        if (this.props.rows>this.props.on_page*total_pages) total_pages++;
        if (this.props.page == total_pages || total_pages == 0) return;
        this.props.onChange(parseInt(this.props.page)+1);
    },
    render: function() {
        let total_pages = parseInt(this.props.rows/this.props.on_page);
        if (this.props.rows>this.props.on_page*total_pages) total_pages++;
        total_pages=total_pages==0?1:total_pages;
        return (
            <div className='pagination'>
                <a onClick={this.toFirst}>&lt;&lt;</a> <a onClick={this.toPrev}>&lt;</a> Страница {this.props.page} из {total_pages} <a onClick={this.toNext}>&gt;</a> <a onClick={this.toLast}>&gt;&gt;</a>
            </div>
        );
    }
});

module.exports=Pagination;