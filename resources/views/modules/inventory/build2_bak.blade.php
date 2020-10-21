@extends('layouts.adminlte')

@section('content')
    @if($build['error'] == 0)
    <div class="row">
        <div class="col-md-12">
            <ul class="nav nav-tabs">
                <? $first_tab=true ?>
                @if (isset($rights['tab_config']) && $rights['tab_config'])
                    <li class="<?php if($first_tab){$first_tab=false;echo 'active';}?>"><a data-toggle="tab" href="#home">Конфигурация</a></li>
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
            </ul>
            <div class="tab-content">
                <script type="text/javascript">
                    var BuildingData = {
                        address_id: {{ $build['address_id'] }},
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
                    }
                </script>
                <?php $first_tab=true ?>
                @if (isset($rights['tab_config']) && $rights['tab_config'])
                <div id="home" class="tab-pane fade in <?php if($first_tab){$first_tab=false;echo 'active';}?>">
                    <h3>Конфигурация здания</h3>
                    @if($rights['modify_building_rights'])
                        <div  id="new-building">
                        </div>
                        <script type="text/javascript" src="/js/common/modifybuildingform.js"></script>
                    @else
                        <div class="inputrow">
                            <b>Город:</b> {{ $buidl['city'] }}
                        </div>
                        <div class="inputrow">
                            <b>Регион:</b> {{ $build['region'] }}
                        </div>
                        <div class="inputrow">
                            <b>Улица:</b> {{ $build['street']}}
                        </div>
                        <div class="inputrow">
                            <b>Дом:</b> {{ $build['build'] }}
                        </div>
                        <div class="inputrow">
                            <b>Корпус:</b> {{ $build['body'] }}
                        </div>
                        <div id="build-status-wrap">
                        </div>
                        <div class="inputrow">
                            <b>Тип:</b> {{ $build['hometype_desk'] }}
                        </div>
                        <div class="inputrow">
                            <b>Кол-во подъездов:</b> {{ $build['entrance'] }}
                        </div>
                        <div class="inputrow">
                            <b>Кол-во этажей:</b> {{ $build['floors'] }}
                        </div>
                        <div class="inputrow">
                            <b>Потенциальных:</b> {{ $build['clients'] }}
                        </div>
                        <div class="inputrow">
                            <b>Примечание 1:</b> {{ $build['note'] }}
                        </div>
                        <div class="inputrow">
                            <b>Примечание 2:</b> {{ $build['memo'] }}
                        </div>
                        <div class="inputrow">
                            <b>Цена:</b> {{$build['price']}}
                        </div>
                        <b>Файлы:</b>
                        <ul class="files">
                            @foreach($files as $file)
                                <li class="file-item"><a href="{{$file['href']}}">{{$file['name']}}</a></li>
                            @endforeach
                        </ul>
                        <script type="text/javascript">
                            var BuildingData = {
                                address_id: {{ $build['address_id'] }},
                                build_statuses: {!! json_encode($build_statuses) !!},
                                build_status: '{{ $build['build_status'] }}',
                                build_status_desk: '{{ $build['build_status_desk'] }}',
                            }
                        </script>
                        <script type="text/javascript" src="/js/common/buildstatusmounter.js"></script>
                    @endif
                </div>
                @endif
                @if (isset($rights['tab_troubles']) && $rights['tab_troubles'])
                <div id="troubles" class="tab-pane fade <?php if($first_tab){$first_tab=false;echo 'in active';}?>">
                    <h3>Проблемы</h3>
                    <p>Some content in menu 1.</p>
                </div>
                @endif
                @if (isset($rights['tab_entrances']) && $rights['tab_entrances'])
                <div id="entrance" class="tab-pane fade <?php if($first_tab){$first_tab=false;echo 'in active';}?>">
                    <h3>Подъезды</h3>
                    @if($rights['modify_building_rights'])
                        <div id="table-entrances">
                        </div>
                        <script type="text/javascript" src="/js/common/entrances.js"></script>
                    @else
                    <div class="table-entrances">
                        @if(count($entrances)>0)
                        <table>
                            <thead>
                                <tr>
                                    <th>Подъезд</th>
                                    <th>Количество этажей</th>
                                </tr>
                            </thead>
                            <tbody>
                            @foreach($entrances as $k=>$entrance)
                            <tr>
                                <td>Подъезд {{$k}}</td><td>{{$entrance}}</td>
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
                    <h3>Клиенты</h3>
                    <p>Some content in menu 2.</p>
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
                <div id="equipment" class="tab-pane fade <?php if($first_tab){$first_tab=false;echo 'in active';}?>">
                    <h3>Оборудование</h3>
                        @if(isset($equipment['max_floor']) && isset($equipment['min_floor']))
                            <table class="table table-bordered build">
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
                                                                    <span class="state{{$dev['state']}} route system{{$dev['system']}}" data-name="{{$dev['route']}}">{{$dev['html']}}</span><&#8209;<span class="state{{$dev['source_state']}} route system{{$dev['source_system']}}" data-name="{{$dev['source']}}">{{$dev['src_html']}}({{$dev['port']}})</span><br>
                                                                @else
                                                                    <span class="state{{$dev['state']}} route system{{$dev['system']}}" data-name="{{$dev['route']}}">{{$dev['html']}}</span><br>
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
                                                                <span class="state{{$dev['state']}} route system{{$dev['system']}}" data-name="{{$dev['route']}}">{{$dev['html']}}</span><&#8209;<span class="state{{$dev['source_state']}} route system{{$dev['source_system']}}"" data-name="{{$dev['source']}}">{{$dev['src_html']}}({{$dev['port']}})</span><br>
                                                            @else
                                                                <span class="state{{$dev['state']}} route system{{$dev['system']}}" data-name="{{$dev['route']}}">{{$dev['html']}}</span><br>
                                                            @endif
                                                        @endforeach
                                                    </td>
                                                @elseif($i < $entr['max_floor'])
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
                            <input name="show_route_name" class="show_route_name" type="checkbox"><label for="show_route_name">Показать имена устройств</label>
                            @if (isset($equipment['additional']))
                                <b>Еще оборудование в здании: </b>
                                @foreach($equipment['additional']['devices'] as $dev)
                                    @if ($dev['source'] != '')
                                        <span class="state{{$dev['state']}} route system{{$dev['system']}}" data-name="{{$dev['route']}}">{{$dev['html']}}</span><&#8209;<span class="state{{$dev['source_state']}} route system{{$dev['source_system']}}"" data-name="{{$dev['source']}}">{{$dev['src_html']}}({{$dev['port']}})</span>;
                                    @else
                                        <span class="state{{$dev['state']}} route system{{$dev['system']}}" data-name="{{$dev['route']}}">{{$dev['html']}}</span>;
                                    @endif
                                @endforeach
                            @endif
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
                        @else
                            <h2>Информации о внешнем виде дома нет :(</h2>
                        @endif
                </div>
                @endif
            </div>
        </div>
    </div>
    @else
        <h1>Дом с таким идентификатором адреса не найден</h1>
    @endif
@endsection