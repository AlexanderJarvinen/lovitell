var $ = require('jquery');
var React = require('react');
var ReactDOM = require('react-dom');
var classNames = require('classnames');
var AppActions = require('../../common/actions/AppActions.js');
var LoadBar = require('../../common/components/LoadBar.jsx');

var NetworkCheck = React.createClass({
    propTypes: {
        address_id: React.PropTypes.number.isRequired
    },
    getInitialState: function () {
        return {
            total: 0,
            ok: 0,
            error: 0,
            ap_total: 0,
            ap_ok: 0,
            ap_error: 0,
            cam_total: 0,
            cam_error: 0,
            cam_ok: 0,
            apo_total: 0,
            apo_error: 0,
            apo_ok: 0,
        };
    },
    handleSuccessNetworkCheck(data) {
        console.log(data);
        if (data.error !=0) {
            let total=0;
            let ok=0;
            let error=0;
            let ap_total=0;
            let ap_error=0;
            let ap_ok=0;
            let cam_total=0;
            let cam_error=0;
            let cam_ok=0;
            let apo_total=0;
            let apo_error=0;
            let apo_ok=0;
            for(let route in data) {
                total++;
                if(data[route].system==-3) {
                    ap_total++;
                } else if (data[route].system==-4) {
                    cam_total++;
                } else if (data[route].system==11) {
                    apo_total++
                }
                let r = $('.route[data-name='+data[route].name.replace(/\./g, "\\.")+']');
                r.removeClass('state1 state0 state-1');
                r.removeClass('situation-252 situation-255 situation-240 situation3 situation-3 situation6 situation-253 situation1 situation5 situation4 situation2');
                r.addClass('state'+data[route].state);
                r.addClass('situation'+data[route].situation);
                if (data[route].error == 0) {
                    ok++;
                    if(data[route].system==-3) {
                        ap_ok++;
                    } else if (data[route].system==-4) {
                        cam_ok++;
                    } else if (data[route].system==11) {
                        apo_ok++
                    }
                    r.removeClass('check-error').addClass('check-ok');
                    $('.port[data-child='+data[route].name.replace(/\./g,"\\.")+']')
                        .attr('data-port-status', 'Up')
                    r.attr('data-emsg', '')
                     .attr('data-error', 0)
                     .attr('data-port', 'Up')
                     .attr('data-ping', 'Ok')
                     .attr('data-macs', '')
                } else {
                    error++;
                    if(data[route].system==-3) {
                        ap_error++;
                    } else if (data[route].system==-4) {
                        cam_error++;
                    } else if (data[route].system==11) {
                        apo_error++
                    }
                    $('.route[data-name='+data[route].name.replace(/\./g,"\\.")+']')
                        .removeClass('check-ok')
                        .addClass('check-error')
                        .attr('data-emsg', data[route].msg)
                        .attr('data-ping', data[route].ping)
                        .attr('data-error', data[route].error)
                        .attr('data-port', data[route].port_status)
                        .attr('data-macs', data[route].ports);
                    $('.port[data-child='+data[route].name.replace(/\./g,"\\.")+']').attr('data-port-status', data[route].port_status);
                }
            }
            this.setState({
                total: total,
                ok: ok,
                error: error,
                ap_total: ap_total,
                ap_error: ap_error,
                ap_ok: ap_ok,
                cam_total: cam_total,
                cam_error: cam_error,
                cam_ok: cam_ok,
                apo_total: apo_total,
                apo_error: apo_error,
                apo_ok: apo_ok
            });
            $('.equipment_legend__list-state.base').hide();
            $('.equipment_legend__list-state.after_revision').show();
        }
        AppActions.cancelLoading();
    },
    startNetworkCheck: function() {
        this.setState({
            total: 0,
            ok: 0,
            error: 0
        });
        AppActions.initLoading();
        $.ajax({
            beforeSend: function (request) {
                return request.setRequestHeader('X-CSRF-Token', $("meta[name='csrf-token']").attr('content'));
            },
            type: 'GET',
            url: '/inventory/check-network/'+this.props.address_id,
            success: this.handleSuccessNetworkCheck
        });
    },
    acceptNcc: function(system, e) {
        var address_id = this.props.address_id;
        if (address_id) {
            $.ajax({
                type:'GET',
                url: '/inventory/building/'+address_id+'/accept/ncc/'+system,
                success: function(data) {
                    if (data.error == 0) {
                        alert('Приемка выполнена успешно. Экран обновится через 5 сек.');
                        setTimeout(function() {window.location.reload();}, 5000);
                    } else {
                        alert('Во время приемки возникли ошибки');
                    }
                }
            })
        }
    },
    render: function() {
        let result = null;
        let ap_result = null;
        if (this.state.ap_total) {
            ap_result=(<div className="system_result">AP <span className="revision_total">всего: {this.state.ap_total}</span> <span className="revision_ok">OK: {this.state.ap_ok}</span> <span className="revision_error">Error: {this.state.ap_error}</span></div>);
        }
        let cam_result=null;
        if (this.state.cam_total) {
            cam_result=(<div className="system_result">CAM <span className="revision_total">всего: {this.state.cam_total}</span> <span className="revision_ok">OK: {this.state.cam_ok}</span> <span className="revision_error">Error: {this.state.cam_error}</span></div>);
        }
        let apo_result=null;
        if (this.state.apo_total) {
            apo_result=(<div className="system_result">APO <span className="revision_total">всего: {this.state.apo_total}</span> <span className="revision_ok">OK: {this.state.apo_ok}</span> <span className="revision_error">Error: {this.state.apo_error}</span></div>);
        }
        if (this.state.total) {
            result = (<div className="revision_result">
                <span className="revision_total">Всего: {this.state.total}</span> <span className="revision_ok">OK: {this.state.ok}</span> <span className="revision_error">Error: {this.state.error}</span>
                {ap_result}
                {apo_result}
                {cam_result}
            </div>);
        }
        let accept_btn=null;
        if (this.state.ap_error==0 && this.state.ap_total != 0 && this.props.can_accept) {
            accept_btn=(<button className="btn btn-primary" onClick={this.acceptNcc.bind(null,-3)}>Принять внутренние ТД</button>);
        }
        let accept_apo_btn=null;
        if (this.state.apo_error==0 && this.state.apo_total != 0 && this.props.can_accept) {
            accept_apo_btn=(<button className="btn btn-primary" onClick={this.acceptNcc.bind(null,11)}>Принять внешние ТД</button>);
        }
        let accept_cam_btn=null;
        if (this.state.cam_error==0 && this.state.cam_total != 0 && this.props.can_accept) {
            accept_cam_btn=(<button className="btn btn-primary" onClick={this.acceptNcc.bind(null,-4)}>Принять камеры</button>);
        }
        return (
            <div className="network_check wrap">
                <h3>Сверка Inventory и сети</h3>
                <div>
                    <button className="btn btn-default" onClick={this.startNetworkCheck}>Запустить сверку</button>
                </div>
                <div>
                    <a href={'/inventory/check-network/'+this.props.address_id+'/export'}>Скачать как файл</a>
                </div>
                <div className="accept__wrap">
                    {accept_btn} {accept_apo_btn} {accept_cam_btn}
                </div>
                {result}
                <LoadBar />
            </div>
        )
    }
});

ReactDOM.render(
    <NetworkCheck
        address_id={BuildingData.address_id}
        can_accept={BuildingData.can_accept_ncc || 0}
    />,
    document.getElementById('network-check_wrap')
);