import React, { PropTypes, Component } from 'react';

export default class BoxOverlay extends Component {
    static propTypes = {
        show: PropTypes.bool
    };
    defaultProps = {
        show: false
    };
    render() {
        if (this.props.show) {
            return (
              <div class="overlay">
                  <i class="fa fa-refresh fa-spin"></i>
              </div>
            )
        } else {
            return null;
        }
    }
};