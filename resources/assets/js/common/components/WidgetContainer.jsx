var $ = require('jquery');
var React = require('react');
var ReactDOM = require('react-dom');
var DashboardStore = require('../stores/DashboardStore');
var ReactDom = require('react-dom');
var classNames = require('classnames');
var WidgetLoading = require('./WidgetLoading');
var GraphWidget = require('./GraphWidget');
console.log(GraphWidget);

var Widgets = {
    'GraphWidget': GraphWidget
};

var width = [
    '',
    'col-md-1',
    'col-md-2',
    'col-md-3',
    'col-md-4',
    'col-md-5',
    'col-md-6',
    'col-md-7',
    'col-md-8',
    'col-md-9',
    'col-md-10',
    'col-md-11',
    'col-md-12'
];

var offset = [
    '',
    'col-md-offset-1',
    'col-md-offset-2',
    'col-md-offset-3',
    'col-md-offset-4',
    'col-md-offset-5',
    'col-md-offset-6',
    'col-md-offset-7',
    'col-md-offset-8',
    'col-md-offset-9',
    'col-md-offset-10',
    'col-md-offset-11',
    'col-md-offset-12'
];

var step = 25;

var WidgetContainer = React.createClass({
    getDefaultProps: function () {
        return {
            // allow the initial position to be passed in as a prop
            initialPos: {x: 0, y: 0}
        }
    },
    getInitialState: function() {
        let resize_ratio = 0;
        let width = this.props.width || 4;
        let height = this.props.height || 250;
        if (this.props.resize.indexOf(':') != -1) {
            console.log('Content');
            let ratio_list = this.props.resize.split(':');
            if (ratio_list.length>0) {
                resize_ratio = ratio_list[1]/ratio_list[0];
            }
        }
        return {
            width: this.props.width,
            offset: this.props.offset,
            height: height,
            collapse: this.props.collapse==1,
            mouseOffsetX: 0,
            pos: this.props.initialPos,
            dragging: false,
            resize: false,
            rel: null, // position relative to the cursor
            another_drag: false,
            z: 1,
            can_resize: this.props.resize != false,
            resize_ratio: resize_ratio,
            loading: this.props.uncontrolled_loading || false
        }
    },

    handleCollapse: function(e) {
        DashboardStore.collapseWidget(this.props.id, !this.state.collapse);
        this.setState({
            collapse: !this.state.collapse
        })
        e.preventDefault();
        e.stopPropagation();
    },

    handleRemove: function() {
        DashboardStore.removeWidget(this.props.id);
    },

    handleDragStart: function(e) {
        this.state.mouseOffset = e.nativeEvent.clientX;
    },

    componentDidUpdate: function (props, state) {
        if (this.state.resize && !state.resize) {
            document.addEventListener('mousemove', this.onMouseMoveResize)
            document.addEventListener('mouseup', this.onMouseUp)
        } else if (!this.state.resize && state.resize) {
            document.removeEventListener('mousemove', this.onMouseMoveResize)
            document.removeEventListener('mouseup', this.onMouseUp)
        }
        if (this.state.dragging && !state.dragging) {
            document.addEventListener('mousemove', this.onMouseMoveDragging)
            document.addEventListener('mouseup', this.onMouseUp)
        } else if (!this.state.dragging && state.dragging) {
            document.removeEventListener('mousemove', this.onMouseMoveDragging)
            document.removeEventListener('mouseup', this.onMouseUp)
        }
    },

    resize: function(e) {
        this.setState({
            resize: true,
            rel: {
                x: e.pageX,
                y: e.pageY
            },
            init_height: this.state.height
        });
        this.onMouseDown(e);
    },

    dragging: function(e) {
        this.setState({
            dragging: true,
            rel: {
                x: e.pageX,
                y: e.pageY
            },
            z: 999
        });
        DashboardStore.draggingStart(this.props.id);
        this.onMouseDown(e);
    },

    onMouseDown: function (e) {
        // only left mouse button
        if (e.button !== 0) return
        this.setState({
            rel: {
                x: e.pageX,
                y: e.pageY
            }
        });
        e.stopPropagation()
        e.preventDefault()
    },

    componentWillReceiveProps: function(nextProps) {
        this.setState({
            collapse: nextProps.collapse==1,
            width: nextProps.width,
            height: nextProps.height
        });
    },

    onMouseUp: function (e) {
        if (this.state.dragging) {
            DashboardStore.draggingStop();
        }
        if (this.state.resize) {
            DashboardStore.resize(this.props.id, this.state.width, this.state.height);
        }
        this.setState({
            dragging: false,
            resize: false,
            pos: {
                x: 0,
                y: 0
            },
            z: 1
        });
        e.stopPropagation()
        e.preventDefault()
    },

    onMouseMoveResize: function (e) {
        if (!this.state.resize) return
        if (e.pageX - this.state.rel.x > step) {
            if (this.state.width < 12) {
                this.setState({width: parseInt(this.state.width) + 1}, this.updateDimensions);
            } else {
                this.setState({width: parseInt(12)}, this.updateDimensions);
            }
            this.setState({
                rel: {
                    x: e.pageX,
                    y: this.state.rel.y
                }
            })
        } else if (this.state.rel.x - e.pageX > step) {
            if (this.state.width > 1) {
                this.setState({width: parseInt(this.state.width) - 1}, this.updateDimensions);
            } else {
                this.setState({width: parseInt(1)}, this.updateDimensions);
            }
            this.setState({
                rel: {
                    x: e.pageX,
                    y: this.state.rel.y
                }
            })
        }
        if (this.state.resize_ratio == 0 && this.height != 'auto') {
            var newheight = parseInt(this.state.init_height) + e.pageY - this.state.rel.y;
            if (newheight >= 50 && !this.state.collapse) {
                this.setState({
                    height: newheight
                });
            }
        }
        e.stopPropagation()
        e.preventDefault()
    },

    onMouseMoveDragging: function (e) {
        if (!this.state.dragging) return;
        this.setState({
            pos: {
                x: e.pageX - this.state.rel.x,
                y: e.pageY - this.state.rel.y
            }
        });
        e.stopPropagation();
        e.preventDefault();
    },

    onDrop: function(e) {
        e.stopPropagation();
        e.preventDefault();
    },

    _onDragStart: function() {
        this.setState({another_drag: true})
    },

    _onDragStop: function() {
        this.setState({another_drag:false})
    },

    updateDimensions: function() {
        if (this.state.resize_ratio != 0) {
            let dn = ReactDOM.findDOMNode(this);
            let w = dn.offsetWidth;
            let h = w * this.state.resize_ratio;
            this.setState({
                height: parseInt(h) + 50
            });
        }
    },
    componentDidMount: function() {
        if (this.state.resize_ratio != 0) {
            document.getElementById('dashboard').addEventListener("resize", this.updateDimensions);
            this.updateDimensions();
        }
        DashboardStore.addDragStartListener(this._onDragStart);
        DashboardStore.addDragStopListener(this._onDragStop);
    },

    componentWillUnmount: function() {
        if (this.state.resize_ratio != 0) {
            window.addEventListener("resize", this.updateDimensions);
        }
        DashboardStore.removeDragStartListener(this._onDragStart);
        DashboardStore.removeDragStopListener(this._onDragStop);
    },

    _onMouseOver: function(e) {
        if (!this.state.another_drag || this.state.dragging) return;
        DashboardStore.dragOnWidget(this.props.id);
    },

    stop: function(e) {
        e.stopPropagation();
        e.preventDefault();
    },

    render: function() {
        let widget_box_class = classNames('box',
            'box-primary',
            {'collapsed-box':this.state.collapse == true},
            {'resize-ratio':this.props.resize.indexOf(':')}
        );
        let widget_class = classNames(width[this.state.width], offset[this.state.offset], 'dashboard_widget');
        console.log('W:'+this.state.width+'WC:'+widget_class);
        console.log('Resize ratio: '+this.state.resize_ratio);
        console.log(this.props.content);
        let content = '';
        let is_component = false;
        try {
            content = JSON.parse(this.props.content);
            is_component = true;
        } catch (e) {
            content = this.props.content;
        }
        let content_comp=null;
        if (is_component) {
            let Element = Widgets[content.component];
            content_comp = (
              <div className="box-body" style={{height: (this.state.height-50) + 'px'}} >
                  <Element
                    {...content.props}
                    />
              </div>);
        } else {
            content_comp = (
              <div className="box-body" style={{height: (this.state.height-50) + 'px'}} dangerouslySetInnerHTML={{__html:content}}></div>
            )
        }
        return (
                <div className={widget_class}
                    style={{
                        left: this.state.pos.x + 'px',
                        top: this.state.pos.y + 'px',
                        zIndex: this.state.z
                    }}
                    onDragEnter={this.onDrop}
                    onDragOver={this.onDrop}
                    onDrop={this.onDrop}
                    onMouseOver={this._onMouseOver}>
                    <div className={widget_box_class}
                        style={{height: this.state.collapse||this.state.height==0? 'auto': this.state.height + 'px'}}
                    >
                        <div className="box-header with-border dragg-handler" onMouseDown={this.dragging}>
                            <h4 className="box-title">{this.props.title}</h4>
                            <div className="box-tools pull-right">
                                <button type="button" className="btn btn-box-tool" onMouseDown={this.stop} onClick={this.handleCollapse}><i className="fa fa-minus"></i>
                                </button>
                                <button type="button" className="btn btn-box-tool" onMouseDown={this.stop} onClick={this.handleRemove}><i className="fa fa-times"></i></button>
                            </div>
                        </div>
                        {content_comp}
                    </div>
                    <span className="resize-handler" onMouseDown={this.resize}/>
                </div>
        )
    }
});

module.exports = WidgetContainer;
