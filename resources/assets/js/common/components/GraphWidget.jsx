var $ = require('jquery');
var React = require('react');
var ReactDOM = require('react-dom');
var DashboardActions = require('../actions/DashboardActions');
var WidgetStore = require('../stores/WidgetStore');
import { Line, Bar } from 'react-chartjs-2';

const GRAPH_BAR='BAR';
const GRAPH_LINE='LINE';


var GraphWidget = React.createClass({
    getDefaultProps: function () {
        return {
            // allow the initial position to be passed in as a prop
            type: GRAPH_BAR,
            url: '',
        }
    },
    getInitialState: function() {
        return {
            data: [],
            max: 100,
            min: 0,
            step: 10,
            type: 'pieces'
        }
    },
    makeBarData: function(a) {
        let data = {};
        data['labels'] = a.labels;
        data['datasets']=[];
        for(let i in a.datasets) {
            data['datasets'].push({
                data: a.datasets[i].data,
                borderWidth: 1,
                backgroundColor: a.datasets[i].palette.map(function(val){
                    return "rgba("+val.R+", "+val.G+", "+val.B+", 0.2)";
                }),
                hoverBackgroundColor: a.datasets[i].palette.map(function(val){
                    return "rgba("+val.R+", "+val.G+", "+val.B+", 0.5)";
                }),
                borderColor: a.datasets[i].palette.map(function(val){
                    return "rgba("+val.R+", "+val.G+", "+val.B+", 1)";
                })
            });
        }
        let max = Math.max.apply(null, a.datasets[0].data);
        let min = a.type=='pieces'?0:Math.min.apply(null, a.datasets[0].data);
        let step = ((max - min)/10) || (a.type=='percent')?1:10;
        step = a.type == 'pieces'? parseInt(step):step;
        this.setState({data, max, min, step, type: a.type});
    },
    makeLineData: function(a) {
        let data = a;
        for (let i in data.datasets) {
            let bc = data.datasets[i].borderColor;
            data.datasets[i].borderColor = "rgba("+bc.R+", "+bc.G+", "+bc.B+", 0.8)";
            data.datasets[i].backgroundColor = "rgba("+bc.R+", "+bc.G+", "+bc.B+", 0.2)";
            data.datasets[i].pointBackgroundColor = "rgba("+bc.R+", "+bc.G+", "+bc.B+", 0.8)";
        }
        this.setState({data, type: a.type || 'pieces'});
    },
    makeData: function(a) {
        switch (this.props.type) {
            case GRAPH_BAR:
                this.makeBarData(a);
                break;
            case GRAPH_LINE:
                this.makeLineData(a);
                break;
        }
        if (typeof this.props.onCancelLoading != 'undefined') {
            this.props.onCancelLoading();
        }
    },
    componentDidMount: function() {
        if (typeof this.props.onInitLoading != 'undefined') {
            this.props.onInitLoading();
        }
        $.ajax({
            method: 'GET',
            url: this.props.url,
            success: this.makeData
        });
    },
    render: function() {
        var Element = null;
        let that = this;
        switch (this.props.type) {
            case GRAPH_BAR:
                Element = (<Bar
                    data={this.state.data}
                    options={{
                        legend: {
                          display: false
                        },
                        maintainAspectRatio: false,
                        defaultFontSize: 8,
                        scales: {
                            xAxes: [{
                                ticks: {
                                    minRotation: 90, // angle in degrees
                                    FontSize: 8
                               }
                            }],
                            yAxes: [{
                                type: 'linear',
                                ticks: {
                                  suggestedMin: that.state.type=='percent'?95:0,
                                  callback: function(label, index, labels) {
                                       if (that.state.type=='percent') {
                                          return label.toFixed(2)+' %';
                                       } else if (that.state.type=='money') {
                                          return label.toString().replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ') + 'Р'
                                       } else {
                                          return label;
                                       }
                                    }
                                }
                            }]
                        }
                    }}
                />);
                break;
            case GRAPH_LINE:
                let tooltips = {
                    callbacks: {
                        label: function(tooltipItems, data) {
                            if (that.state.type=='percent') {
                                return data.datasets[tooltipItems.datasetIndex].label +': '+tooltipItems.yLabel.toFixed(2)+' %';
                            } else if (that.state.type=='money') {
                                return data.datasets[tooltipItems.datasetIndex].label +': '+tooltipItems.yLabel.toString().replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ') + '\u20bd'
                            } else {
                                return data.datasets[tooltipItems.datasetIndex].label +': '+tooltipItems.yLabel.toFixed(1);
                            }
                        }
                    }
                };
                let type = this.state.type;
                Element=(<Line
                        data={this.state.data}
                        options={{
                            events: false,
                            tooltips: {
                                enabled: false
                            },
                            hover: {
                                animationDuration: 0
                            },
                            scales: {
                                yAxes: [{
                                    type: 'linear',
                                    ticks: {
                                      callback: function(label, index, labels) {
                                           if (that.state.type=='percent') {
                                              return label.toFixed(2)+' %';
                                           } else if (that.state.type=='money') {
                                              return label.toString().replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ') + '\u20bd'
                                           } else {
                                              return label.toFixed(1);
                                           }
                                        }
                                    }
                                }]
                            },
                            animation: {
                                duration: 1,
                                onComplete: function () {

                                    var ctx = this.chart.ctx;
                                    console.log(this.data);
                                    ctx.font = this.scales['x-axis-0'].ctx.font;
                                    ctx.textAlign = "center";
                                    ctx.textBaseline = "bottom";
                                    this.data.datasets.forEach(function (dataset) {
                                        for (var i = 0; i < dataset.data.length; i++) {
	                                        var model = dataset._meta[Object.keys(dataset._meta)[0]].data[i]._model;
	                                        ctx.fillStyle =dataset.borderColor;
	                                        if (type == 'money') {
        	                                    ctx.fillText(dataset.data[i].replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ') + '\u20bd', model.x, model.y - 5);
        	                                } else {
        	                                    ctx.fillText(dataset.data[i].replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 '), model.x, model.y - 5);
        	                                }
	                                    }
                                    })
                                }
                            }
                        }}
                    />);
                break;
        };
        return Element;
    }
});

module.exports = GraphWidget;
