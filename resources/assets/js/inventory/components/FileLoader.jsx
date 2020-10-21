var $ = require('jquery');
var React = require('react');
var classNames = require('classnames');

var FileLoader = React.createClass({
    propTypes: {
        url: React.PropTypes.string.isRequired,
        filename: React.PropTypes.string.isRequired,
        handleFailLoading: React.PropTypes.func,
        handleSuccessLoading: React.PropTypes.func
    },
    getInitialState: function() {
        return {
        };
    },

    handleFileSelect: function(e) {
        e.preventDefault();
        this.fileUpload(e.target.files[0]);
    },
    handleSuccessLoading: function(e) {
        if (this.props.handleSuccessLoading != 'undefined') {
            this.props.handleSuccessLoading();
        }
    },
    handleFailLoading: function(e) {
        if (this.props.handleFailLoading != 'undefined') {
            this.props.handleFailLoading();
        }
    },
    fileUpload: function(file) {
        var fd = new FormData();
        fd.append(this.props.filename, file);

        $.ajax({
            beforeSend: function(request) {
                return request.setRequestHeader('X-CSRF-Token', $("meta[name='csrf-token']").attr('content'));
            },
            type: "POST",
            url: this.props.url,
            data: fd,
            contentType: false,
            processData: false,
            success: this.handleSuccessLoading,
            error: this.handleFailLoading
        });
    },
    render: function () {
        return (
            <div class="file_loader">
                <input type="file" class="uploaded_file" title="Загрузить файл" onChange={this.handleFileSelect} value={this.state.file}/>
            </div>
        )
    }

});

module.exports=FileLoader
