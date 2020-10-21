import React, { Component, PropTypes } from 'react';

export default class UploadForm extends Component {
    static propTypes = {
        fieldName: PropTypes.string,
        fileField: PropTypes.func.isRequired,
        title: PropTypes.string
    };
    changeFile = () =>  {
        this.props.fileField(this.refs[this.props.fieldName].files[0]);
    };

    render = () => {
        return (
            <div className="upload_form">
                <div>
                    {this.props.title? <label>{this.props.title}</label>:null}
                    <input type="file"
                           name={this.props.fieldName || 'paramsFile'}
                           title="Загрузить файл"
                           ref={this.props.fieldName || 'paramsFile'}
                           onChange={this.changeFile}
                        />
                </div>
            </div>
        )
    }
}