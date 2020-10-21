import React, { PropTypes, Component } from 'react';
import classNames from 'classnames';
import Multiselect from 'react-bootstrap-multiselect';

export default class BrandField extends Component {
    static propTypes = {
        brands: PropTypes.string,
        onChange: PropTypes.func
    };
    state = {
        brand_list: []
    };
    getBrands = () => {
        fetch('/ajax/brands', {method: 'GET', credentials: 'include'})
            .then(response => response.json())
            .then(json => {
                if (json.error == 0) {
                    this.setState({brand_list: json.data.map((val)=>{return val})});
                }
            });
    };
    handleBrandsResponse = (a) => {
        if (a.error = 0) {
            this.setState({brand_list: a.data});
        }
    };
    componentDidMount = () => {
        this.getBrands();
    };
    renderSelectList = () => {
        const {brands} = this.props;
        const brand_list = this.state.brand_list;
        let sel_brands = brands.split(',');
        let list = [];
        for(let brand in brand_list) {
            list.push({
                'value': brand,
                'label': brand_list[brand],
                'selected': sel_brands.indexOf(brand) != -1
            });
        }
        return list;
    };
    handleSelect = (e) => {
        let sel_brands = this.props.brands.split(',');
        let i = sel_brands.indexOf(e.val());
        if (i != -1) {
            sel_brands.splice(i, 1);
        } else {
            sel_brands.push(e.val());
        }
        this.props.onChange(sel_brands.join(','));
    };
    handleSelectAll = () => {
        let sel_brands = [];
        for(let brand in this.state.brand_list) {
            sel_brands.push(brand);
        }
        this.props.onChange(sel_brands.join(','));
    };
    handleDeselectAll = () => {
        this.props.onChange('');
    };
    render = () => {
        return (
            <div className={classNames(
                    'build',
                    'inputrow',
                    {'changed': this.props.state==1},
                    {'cansave': this.props.state==2},
                    {'saved': this.props.state==3},
                    {'error': this.props.state==-1}
                )}
            >
                <label>Бренд:</label>
                <Multiselect
                    className={'form-control'}
                    onChange={this.handleSelect}
                    onSelectAll={this.handleSelectAll}
                    onDeselectAll={this.handleDeselectAll}
                    data={this.renderSelectList()}
                    multiple
                    />
            </div>
        );
    }
};