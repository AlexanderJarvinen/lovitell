webpackJsonp([19],{

/***/ 0:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var $ = __webpack_require__(454);
	var React = __webpack_require__(1);
	var ReactDOM = __webpack_require__(162);
	var classNames = __webpack_require__(133);
	var FileLoader = __webpack_require__(959);

	var EquipmentRevision = React.createClass({
	    displayName: 'EquipmentRevision',

	    propTypes: {
	        address_id: React.PropTypes.number.isRequired
	    },
	    getInitialState: function getInitialState() {
	        return {};
	    },
	    render: function render() {
	        return React.createElement(
	            'div',
	            { className: 'equipment_revision' },
	            React.createElement(
	                'h3',
	                null,
	                '\u0421\u0432\u0435\u0440\u043A\u0430 \u043E\u0431\u043E\u0440\u0443\u0434\u043E\u0432\u0430\u043D\u0438\u044F'
	            ),
	            React.createElement(FileLoader, {
	                url: '/inventory/ajax/revision/load',
	                filename: 'revision'
	            })
	        );
	    }
	});

	ReactDOM.render(React.createElement(EquipmentRevision, {
	    address_id: BuildingData.address_id
	}), document.getElementById('revision_wrap'));

/***/ },

/***/ 959:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var $ = __webpack_require__(454);
	var React = __webpack_require__(1);
	var classNames = __webpack_require__(133);

	var FileLoader = React.createClass({
	    displayName: 'FileLoader',

	    propTypes: {
	        url: React.PropTypes.string.isRequired,
	        filename: React.PropTypes.string.isRequired,
	        handleFailLoading: React.PropTypes.func,
	        handleSuccessLoading: React.PropTypes.func
	    },
	    getInitialState: function getInitialState() {
	        return {};
	    },

	    handleFileSelect: function handleFileSelect(e) {
	        e.preventDefault();
	        this.fileUpload(e.target.files[0]);
	    },
	    handleSuccessLoading: function handleSuccessLoading(e) {
	        if (this.props.handleSuccessLoading != 'undefined') {
	            this.props.handleSuccessLoading();
	        }
	    },
	    handleFailLoading: function handleFailLoading(e) {
	        if (this.props.handleFailLoading != 'undefined') {
	            this.props.handleFailLoading();
	        }
	    },
	    fileUpload: function fileUpload(file) {
	        var fd = new FormData();
	        fd.append(this.props.filename, file);

	        $.ajax({
	            beforeSend: function beforeSend(request) {
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
	    render: function render() {
	        return React.createElement(
	            'div',
	            { 'class': 'file_loader' },
	            React.createElement('input', { type: 'file', 'class': 'uploaded_file', title: '\u0417\u0430\u0433\u0440\u0443\u0437\u0438\u0442\u044C \u0444\u0430\u0439\u043B', onChange: this.handleFileSelect, value: this.state.file })
	        );
	    }

	});

	module.exports = FileLoader;

/***/ }

});