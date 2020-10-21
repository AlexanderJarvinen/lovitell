@extends('layouts.adminlte')

@section('content')
    @if($build['error'] == 0)
        <div class="row" xmlns="http://www.w3.org/1999/html" xmlns="http://www.w3.org/1999/html">
        <div class="col-lg-12 build">
            <ul class="nav nav-tabs">
                <?php $first_tab=true ?>
                @if (isset($rights['tab_config']) && $rights['tab_config'])
                    <li class="<?php if($first_tab){$first_tab=false;echo 'active';}?>"><a data-toggle="tab" href="#home">Конфигурация</a></li>
                @endif
                @if (isset($rights['tab_services']) && $rights['tab_services'])
                    <li class="<?php if($first_tab){$first_tab=false;echo 'active';}?>"><a data-toggle="tab" href="#services">Услуги</a></li>
                @endif
                @if (isset($rights['tab_entrances']) && $rights['tab_entrances'])
                    <li class="<?php if($first_tab){$first_tab=false;echo 'active';}?>"><a data-toggle="tab" href="#entrance">Подъезды</a></li>
                @endif
                @if (isset($rights['tab_troubles']) && $rights['tab_troubles'])
                    <li class="<?php if($first_tab){$first_tab=false;echo 'active';}?>"><a data-toggle="tab" href="#troubles">Проблемы</a></li>
                @endif
                @if (isset($rights['tab_clients']) && $rights['tab_clients'])
                    <li class="<?php if($first_tab){$first_tab=false;echo 'active';}?>"><a data-toggle="tab" href="#clients">Клиенты</a></li>
                @endif
                @if (isset($rights['tab_orders']) && $rights['tab_orders'])
                    <li class="<?php if($first_tab){$first_tab=false;echo 'active';}?>"><a data-toggle="tab" href="#orders">Наряды</a></li>
                @endif
                @if (isset($rights['tab_keys']) && $rights['tab_keys'])
                    <li class="<?php if($first_tab){$first_tab=false;echo 'active';}?>"><a data-toggle="tab" href="#keys">Ключи</a></li>
                @endif
                @if (isset($rights['tab_equipments']) && $rights['tab_equipments'])
                    <li class="<?php if($first_tab){$first_tab=false;echo 'active';}?>"><a data-toggle="tab" href="#equipment">Оборудование</a></li>
                @endif
                @if (isset($rights['tab_files']) && $rights['tab_files'])
                    <li class="<?php if($first_tab){$first_tab=false;echo 'active';}?>"><a data-toggle="tab" href="#files">Файлы</a></li>
                @endif
                @if (isset($rights['tab_building']) && $rights['tab_building'])
                    <li class="<?php if($first_tab){$first_tab=false;echo 'active';}?>"><a data-toggle="tab" href="#building">Строительство</a></li>
                @endif
            </ul>
            <div class="tab-content">
                <script type="text/javascript">
                    var BuildingData = {
                        address_id: {{ $build['address_id'] }},
                        militia_params: {!! isset($build['militia_params'])&&$build['militia_params']?json_encode($build['militia_params']):'null' !!},
                        building_params: {!! isset($build['building_params'])&&$build['building_params']?json_encode($build['building_params']):'null' !!},
                        can_accept_ncc: '{{ $rights['can_accept_ncc'] or 0 }}',
                        city_list: {!! json_encode($city_list) !!},
                        city_id: {{ $build['city_id'] or 0 }},
                        regions: {!! json_encode($regions) !!},
                        region_id: {{ $build['region_id'] or 0 }},
                        streets: {!! json_encode($streets) !!},
                        street_id: '{{ $build['street_id'] or 0 }}',
                        build: '{{ $build['build'] or 0 }}',
                        body: '{{ $build['body'] or 0}}',
                        build_types: {!! json_encode($hometypes) !!},
                        build_type: '{{ $build['hometype'] or ''}}',
                        build_statuses: {!! json_encode($build_statuses) !!},
                        build_status: '{{ $build['build_status'] or '' }}',
                        build_status_desk: '{{ $build['build_status_desk'] or '' }}',
                        entrance: '{{ $build['entrance'] or '' }}',
                        floors: '{{ $build['floors'] or '' }}',
                        clients: '{{ $build['clients'] or '' }}',
                        note: {!! json_encode(isset($build['note'])?$build['note']:'') !!},
                        memo: {!! json_encode(isset($build['memo'])?$build['memo']:'') !!},
                        price: '{{ $build['price'] or '' }}',
                        new_street_rights: '{{ $rights['new_street'] or 0 }}',
                        status_rights: '{{ $rights['status_rights'] }}',
                        companies_change: '{{ $rights['companies_change'] }}',
                        companies: {!! json_encode($companies) !!},
                        build_companies: {!! json_encode($build['companies']) !!},
                        services_change: {{ $rights['services_change'] }},
                        services: {!! json_encode($services) !!},
                        build_services: {!! json_encode($build['services']) !!},
                        can_modify: {{intval($rights['modify_building_rights'])}},
                        can_changestatus: {{intval($rights['status_rights'])}},
                        can_viewfiles: {{intval($rights['can_viewfiles'])}},
                        can_addfiles: {{intval($rights['can_addfile'])}},
                        can_addresschange: {{intval($rights['can_addresschange'])}},
                        creator: {!! json_encode($creator) !!}
                    }
                </script>
                <?php $first_tab=true ?>
                @if (isset($rights['tab_config']) && $rights['tab_config'])
                <div id="home" class="tab-pane fade in <?php if($first_tab){$first_tab=false;echo 'active';}?>">
                    <div  id="new-building">
                    </div>
                    <script type="text/javascript" src="/js/common/modifybuildingform.js"></script>
                </div>
                @endif
                @if (isset($rights['tab_services']) && $rights['tab_services'])
                    <div id="services" class="tab-pane fade <?php if($first_tab){$first_tab=false;echo 'in active';}?>">
                        <h3>Услуги</h3>
                        <div id="services-list">
                        </div>
                        <script type="text/javascript" src="/js/common/servicewrap.js"></script>
                    </div>
                @endif
                @if (isset($rights['tab_troubles']) && $rights['tab_troubles'])
                <div id="troubles" class="tab-pane fade <?php if($first_tab){$first_tab=false;echo 'in active';}?>">
                    <h3>Проблемы</h3>
                    <div id="troubles-list">
                    </div>
                    <script type="text/javascript" src="/js/common/troubles.js"></script>
                </div>
                @endif
                @if (isset($rights['tab_entrances']) && $rights['tab_entrances'])
                <div id="entrance" class="tab-pane fade <?php if($first_tab){$first_tab=false;echo 'in active';}?>">
                    <h3>Подъезды</h3>
                    @if($rights['can_edit_entrances'])
                        <div id="table-entrances">
                        </div>
                        <script type="text/javascript" src="/js/common/entrances.js"></script>
                    @else
                    <div class="table-entrances">
                        @if(count($entrances)>0)
                        <table class="table table-bordered table-hover dataTable entrance-table">
                            <thead>
                                <tr>
                                    <th>Подъезд</th>
                                    <th>Отделка</th>
                                    <th>Количество этажей</th>
                                </tr>
                            </thead>
                            <tbody>
                            @foreach($entrances_info as $k=>$entrance)
                            <tr>
                                <td>Подъезд {{$k}}</td>
                                <td><?=$entrance['interior']==1?'Есть':'Нет'?></td>
                                <td><?=$entrance['floors']?></td>
                            </tr>
                            @endforeach
                            </tbody>
                        </table>
                        @else
                            <b>Нет информации о подъедах</b>
                        @endif
                    </div>
                    @endif
                </div>
                @endif
                @if (isset($rights['tab_clients']) && $rights['tab_clients'])
                <div id="clients" class="tab-pane fade <?php if($first_tab){$first_tab=false;echo 'in active';}?>">
                    <h3>Клиенты <a href="/inventory/building/{{$build['address_id']}}/clients/export" title="Выгрузить в XLS файл"><i class="fa fa-download"></i></a></h3>
                    <div id="clients-list">
                    </div>
                    <script type="text/javascript" src="/js/common/clients.js"></script>
                </div>
                @endif
                @if (isset($rights['tab_orders']) && $rights['tab_orders'])
                <div id="orders" class="tab-pane fade <?php if($first_tab){$first_tab=false;echo 'in active';}?>">
                    <h3>Наряды</h3>
                    <p>Some content in menu 2.</p>
                </div>
                @endif
                @if (isset($rights['tab_keys']) && $rights['tab_keys'])
                <div id="keys" class="tab-pane fade <?php if($first_tab){$first_tab=false;echo 'in active';}?>">
                    <h3>Ключи</h3>
                    <p>Some content in menu 2.</p>
                </div>
                @endif
                @if (isset($rights['tab_equipments']) && $rights['tab_equipments'])
                <div id="equipment" class="build-equipment tab-pane fade <?php if($first_tab){$first_tab=false;echo 'in active';}?>">
                    <h3>Оборудование <span class="equipment_total">{{$equipment['equipment_total']}}</span>/<span class="equipment_up">{{$equipment['equipment_up']}}</span>/<span class="equipment_down">{{$equipment['equipment_down']}}</span>
                        <a href="/inventory/building/{{$build['address_id']}}/export" title="Выгрузить все устройства дома в XLS файл"><i class="fa fa-download"></i></a>
                        <a href="#" class="show_route_name2" title="Показать/скрыть названия устройств"><i class="fa fa-eye" aria-hidden="true"></i></a>
                        @if ($inventory_rights)
                            <a href="/inventory/equipment/?filters={{json_encode(['address_id' => $build['address_id']])}}" title="Открыть в Inventory" target="_blank"><i class="fa fa-laptop" aria-hidden="true"></i></a>
                        @endif
                    </h3>
                            @if(!empty($equipment['max_floor']) && isset($equipment['min_floor']) && isset($equipment['entrances']))
                                <div class="equipment-table-wrap">
                                <table class="table table-bordered build light">
                                    @for($i = $equipment['max_floor']+1; $i >= $equipment['min_floor']; $i--)
                                        <?php if ($i == 0 && $equipment['max_floor'] != -1) continue; ?>
                                        @if($i > 0)
                                            <tr>
                                        @else
                                            <tr class="basement">
                                                @endif
                                                <th {{$i == $equipment['max_floor']+1? 'class=loft':''}}>
                                                    <b>{{$i == $equipment['max_floor']+1?'Чердак':$i }}</b>
                                                </th>
                                                @foreach($equipment['entrances'] as $entr)
                                                    @if($entr['max_floor']+1 == $i)
                                                        @if(isset($entr['loft']))
                                                            <td class="loft">
                                                                @foreach($entr['loft']['devices'] as $dev)
                                                                    @if ($dev['source'] != '')
                                                                        <span class="state{{$dev['state']}} route system system{{$dev['system']}} situation{{$dev['situation']}}" data-name="{{$dev['route']}}"><span class="route-name"><nobr><input type="checkbox" style="display: none" checked>{!! $dev['html'] !!}</nobr></span></span><&#8209;<span class="state{{$dev['source_state']}} route system system{{$dev['source_system']}}" data-name="{{$dev['source']}}"><span class="route-name">{!! $dev['src_html'] !!}</span><span class="port" data-child="{{$dev['route']}}">({{$dev['port']}})</span></span><br>
                                                                    @else
                                                                        <span class="state{{$dev['state']}} route system system{{$dev['system']}} situation{{$dev['situation']}}" data-name="{{$dev['route']}}"><span class="route-name"><nobr><input type="checkbox" style="display: none" checked>{!! $dev['html'] !!}</nobr></span></span><br>
                                                                    @endif
                                                                @endforeach
                                                            </td>
                                                        @else
                                                            <td class="loft">
                                                            </td>
                                                        @endif
                                                    @elseif(isset($entr[$i]))
                                                        <td class="floor">
                                                            @foreach($entr[$i]['devices'] as $dev)
                                                                @if ($dev['source'] != '')
                                                                    <span class="state{{$dev['state']}} route system system{{$dev['system']}} situation{{$dev['situation']}}" data-name="{{$dev['route']}}"><span class="route-name"><nobr><input type="checkbox" style="display: none" checked>{!! $dev['html'] !!}</nobr></span></span><&#8209;<span class="state{{$dev['source_state']}} route system system{{$dev['source_system']}}" data-name="{{$dev['source']}}" ><span class="route-name">{!! $dev['src_html'] !!}</span><span class="port" data-child="{{$dev['route']}}">({{$dev['port']}})</span></span><br>
                                                                @else
                                                                    <span class="state{{$dev['state']}} route system system{{$dev['system']}} situation{{$dev['situation']}}" data-name="{{$dev['route']}}"><span class="route-name"><nobr><input type="checkbox" style="display: none" checked>{!! $dev['html'] !!}</nobr></span></span><br>
                                                                @endif
                                                            @endforeach
                                                        </td>
                                                    @elseif($i < $entr['max_floor'] || (isset($build['entrance']) && $build['entrance'] <= 1))
                                                        <td class="floor"></td>
                                                    @else
                                                        <td style="border: none"></td>
                                                    @endif
                                                @endforeach
                                            </tr>
                                            @endfor
                                            @if ($equipment['min_floor'] > 0)
                                                <tr class="basement">
                                                    <th>
                                                        <b>{{ 'Подвал' }}</b>
                                                    </th>
                                                    @foreach($equipment['entrances'] as $e)
                                                        <td></td>
                                                    @endforeach
                                                </tr>
                                            @endif
                                            <tr class="basement">
                                                <th class="entrance"></th>
                                                @foreach($equipment['entrances'] as $e=>$k)
                                                    <th class="entrance"><b>Подъезд {{$e}}</b></th>
                                                @endforeach
                                            </tr>
                                </table>
                                @if (isset($equipment['additional']))
                                    <div class="additional_equipments_wrap">
                                        <b>Еще оборудование в здании: </b>
                                        @foreach($equipment['additional']['devices'] as $dev)
                                            @if ($dev['source'] != '')
                                                <span class="state{{$dev['state']}} route system system{{$dev['system']}}" data-name="{{$dev['route']}}"><span class="route-name"><nobr><input type="checkbox" style="display: none" checked>{!! $dev['html'] !!}</span></nobr></span><&#8209;<span class="state{{$dev['source_state']}} route system system{{$dev['source_system']}}" data-name="{{$dev['source']}}"><span class="port" data-child="{{$dev['route']}}"><span class="route-name">{!! $dev['src_html'] !!}</span>({{$dev['port']}})</span></span>;
                                            @else
                                                <span class="state{{$dev['state']}} route system system{{$dev['system']}}" data-name="{{$dev['route']}}"><span class="route-name"><nobr><input type="checkbox" style="display: none" checked>{!! $dev['html'] !!}</nobr></span></span>;
                                            @endif
                                        @endforeach
                                    </div>
                                @endif
                                </div>
                                <div class="inputrow"><input type="checkbox" class="equipment_selectall" name="selectall" style="display: none" checked><label for="selectall">Выделить все</label></div>
                                <input type="checkbox" style="display: none">
                                <div class="row">
                                    <div class="col-md-8">
                                        <div class="box">
                                        <div class="box-body equipment-management">
                                            <div class="nav-tabs-custom">
                                                <!-- Tabs within a box -->
                                                <ul class="nav nav-tabs ui-sortable-handle">
                                                    <li class="active"><a href="#compare-area" data-toggle="tab" aria-expanded="false"><i class="fa fa-stethoscope" aria-hidden="true"></i> Диагностика</a></li>
                                                    <li class=""><a href="#adding-area" data-toggle="tab" aria-expanded="true"><i class="fa fa-plus-circle" aria-hidden="true"></i> Добавление</a></li>
                                                    <li class=""><a href="#modify-area" data-toggle="tab" aria-expanded="false"><i class="fa fa-pencil-square-o" aria-hidden="true"></i> Изменение</a></li>
                                                </ul>
                                                <div class="tab-content no-padding">
                                                    <div class="chart tab-pane" id="adding-area" style="position: relative;">
                                                        @if($rights['can_addequipment'])
                                                            <div id="add-equipment">
                                                            </div>
                                                            <script type="text/javascript" src="/js/common/equipmentaddbutton.js"></script>
                                                        @endif
                                                    </div>
                                                    <div class="chart tab-pane" id="modify-area" style="position: relative;">
                                                        @if($rights['can_accept_od'] )
                                                            <div class="accept_od">
                                                                <label>Приемка оборудования Отделом Эксплуатации:</label>
                                                                <div>
                                                                    <select name="accept_od" class="accept_od__select" data-address_id="{{$build['address_id']}}">
                                                                        <option value="0">Не выбрано</option>
                                                                        @foreach($od_accepted_systems as $s_row) {
                                                                        @if (!empty($equipment['accepted_od'][$s_row['system']]))
                                                                            <option value="{{$s_row['system']}}">{{$s_row['desk']}}</option>
                                                                        @endif
                                                                        @endforeach
                                                                    </select>
                                                                    <button class="btn btn-primary accept_od__accept" disabled>Принять</button>
                                                                </div>
                                                            </div>
                                                        @endif
                                                        @if($rights['can_accept_ncc'] || $rights['can_exploit'])
                                                            <div class="change_state">
                                                                <label>Массовая смена статуса оборудования:</label>
                                                                <div>
                                                                    <select name="change_state" class="change_state__select" data-address_id="{{$build['address_id']}}">
                                                                        <option value="0">Тип оборудования</option>
                                                                        @foreach($types as $s_row) {
                                                                        @if(!empty($equipment['change_state'][$s_row->system])) {
                                                                        <option value="{{$s_row->system}}">{{$s_row->desk}}</option>
                                                                        @endif
                                                                        @endforeach ?>
                                                                    </select>
                                                                    <select name="change_state" class="change_state__select_state" data-address_id="{{$build['address_id']}}" disabled>
                                                                        <option value="0">Статус</option>
                                                                        @if($rights['can_accept_ncc']) {
                                                                        <option value="4">Принят ЦУС</option>
                                                                        @endif
                                                                        @if($rights['can_exploit'])
                                                                            <option value="1">В эксплуатации</option>
                                                                        @endif
                                                                    </select>
                                                                    <button class="btn btn-primary change_state__submit" disabled data-address_id="{{$build['address_id']}}">Сменить</button>
                                                                </div>
                                                            </div>
                                                        @endif
                                                        @if($rights['can_changemac'])
                                                            <h3>Массовая смена MAC-адреса</h3>
                                                            <form method="post" enctype="multipart/form-data" action="/inventory/ajax/{{$build['address_id']}}/batch-mac-change">
                                                                <input type="hidden" name="_token" value="{{ csrf_token() }}">
                                                                <input type="file" name="macchange">
                                                                <button type="submit" class="btn btn-default">Загрузить</button>
                                                            </form>
                                                        @endif
                                                        @if($rights['can_changetemplate'])
                                                            <div id="change_template_wrap">
                                                            </div>
                                                            <script type="text/javascript" src="/js/common/aptemplatechange.js"></script>
                                                        @endif
                                                        @if($rights['can_batchdelete'])
                                                            <div id="batch-delete-ap">
                                                            </div>
                                                            <script type="text/javascript" src="/js/common/batchdeleteap.js"></script>
                                                        @endif
                                                    </div>
                                                    <div class="chart tab-pane active" id="compare-area" style="position: relative;">
                                                        @if($rights['check_network_rights'])
                                                            <div id="network-check_wrap">
                                                            </div>
                                                            <script type="text/javascript" src="/js/common/networkcheck.js"></script>
                                                        @endif
                                                        @if($rights['can_transmit'])
                                                            <h3>Сверка оборудования</h3>
                                                            <form method="post" enctype="multipart/form-data" action="/inventory/ajax/revision/load">
                                                                <input type="hidden" name="_token" value="{{ csrf_token() }}">
                                                                <input type="file" name="revision">
                                                                <button type="submit" class="btn btn-default">Загрузить</button>
                                                            </form>
                                                        @endif
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        </div>
                                    </div>
                                    <div class="col-md-4">
                                        <div class="equipment_legend box">
                                            <div class="box-header">
                                                <h4 class="box-title">Легенда</h4>
                                            </div>
                                            <div class="box-body">
                                                <b>Типы устройств</b>
                                                <ul class="equipment_legend__list">
                                                    @foreach($types as $type)
                                                        <li class="state0 system system{{$type->system}}">{{$type->desk}}</li>
                                                    @endforeach
                                                </ul>
                                                <div class="clearfix"></div>
                                                <b>Состояние устройства</b>
                                                <ul class="equipment_legend__list-state">
                                                    @foreach($states as $state)
                                                        <li class="system system-3 state{{$state['type']}} situation0">{{$state['desk']}}</li>
                                                    @endforeach
                                                </ul>
                                                <div class="clearfix"></div>
                                                <b>Статус устройства</b>
                                                <ul class="equipment_legend__list-state base">
                                                    @foreach($situations as $situation)
                                                        <li class="system system-3 state0 situation{{$situation['situation']}}">{{$situation['desk']}}</li>
                                                    @endforeach
                                                </ul>
                                                <ul class="equipment_legend__list-state after_revision" style="display: none;">
                                                    <li class="system system-3 state0 situation0 check-ok">Ошибок нет</li>
                                                    <li class="system system-3 state0 situation0 check-error">Нет информации в Inventory</li>
                                                    <li class="system system-3 state0 situation0 check-error" data-error="31">При сверке выявлены ошибки</li>
                                                </ul>
                                                <div class="clearfix"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            @else
                                <h2>Информации о внешнем виде дома нет :(</h2>
                            @endif
                </div>
                @endif
                @if (isset($rights['tab_files']) && $rights['tab_files'])
                    <div id="files" class="tab-pane fade <?php if($first_tab){$first_tab=false;echo 'in active';}?>">
                        <h3>Файлы</h3>
                        <div id="files-list">
                        </div>
                        <script type="text/javascript" src="/js/common/buildingfiles.js"></script>
                    </div>
                @endif
                @if (isset($rights['tab_building']) && $rights['tab_building'])
                <div id="building" class="tab-pane fade <?php if($first_tab){$first_tab=false;echo 'in active';}?>">
                    <h3>Строительство</h3>
                    <div id="building-tab">
                    </div>
                    <script type="text/javascript" src="/js/common/tabbuilding.js"></script>
                </div>
                @endif
            </div>
        </div>
    </div>
    @else
        <h1>Дом с таким идентификатором адреса не найден</h1>
    @endif
@endsection
