@extends('layouts.adminlte')

@section('content')
    <div class="row">
        <div class="col-md-12">
            <ul class="nav nav-tabs">
                <li class="active"><a data-toggle="tab" href="#home">Информация</a></li>
                <li><a data-toggle="tab" href="#troubles">Проблемы</a></li>
                <li><a data-toggle="tab" href="#customers">Клиенты</a></li>
                <li><a data-toggle="tab" href="#tasks">Наряды</a></li>
                <li><a data-toggle="tab" href="#keys">Ключи</a></li>
                <li><a data-toggle="tab" href="#equipment">Оборудование</a></li>
                <li><a data-toggle="tab" href="#files">Файлы</a></li>
            </ul>

            <div class="tab-content">
                <div id="home" class="tab-pane fade in active">
                    <h3>Информация</h3>
                    <div  id="new-building">
                    </div>
                    @if($rights['modify_building_rights'])
                        <script type="text/javascript">
                            var BuildingData = {
                                regions: {!! json_encode($regions) !!},
                                region_id: '{{ $build['$region_id'] }}',
                                streets: {!! json_encode($streets) !!},
                                street_id: '{{ $build['street_id'] }}',
                                build: '{{ $build['build'] }}',
                                body: '{{ $body['body'] }}',
                                hometypes: {!! json_encode($hometypes) !!}
                                hometype: '{{ $build['hometype'] }}',
                                entrance: '{{ $build['entrance'] }}',
                                floors: '{{ $build['floors'] }}',
                                clients: '{{ $build['clients'] }}',
                                tickests: '{{ $build['tickets'] }}',
                                inwork: '{{ $build['inwork'] }}',
                                connected: '{{ $build['connected'] }}',
                                note: {!! json_encode($build['note']) !!},
                                memo: {!! json_encode($build['memo']) !!},
                                price: '{{ $build['price'] }}',
                                new_street_rights: '{{ $rights['new_street'] }}'
                                files: {!! json_encode($files) !!}
                            }
                        </script>
                        <script type="text/javascript" src="/js/common/modifybuildingform.js"></script>
                    @else
                        <b>Регион:</b> {{ $regions[$build['region_id']]->desk }}
                        <b>Улица:</b> {{ $street }}
                        <b>Дом:</b> {{ $build['build'] }}
                        <b>Корпус:</b> {{ $build['body'] }}
                        <b>Тип:</b> {{ $build['hometype'] }}
                        <b>Кол-во подъездов:</b> {{ $build['entrance'] }}
                        <b>Кол-во этажей:</b> {{ $build['floors'] }}
                        <b>Потенциальных:</b> {{ $build['clients'] }}
                        <b>Заявок:</b> {{ $build['tickets'] }}
                        <b>В работе:</b> {{ $build['inwork'] }}
                        <b>Подключено:</b> {{ $build['connected'] }}
                        <b>Note:</b> {{ $build['note'] }}
                        <b>Memo:</b> {{ $build['memo'] }}
                        <b>Цена:</b> {{$build['price']}}
                        <b>Файлы:</b>
                        <ul class="files">
                        @foreach($files as $file)
                            <li class="file-item"><a href="{{$file['href']}}">{{$file['name']}}</a></li>
                        @endforeach
                        </ul>
                    @endif
                </div>
                <div id="troubles" class="tab-pane fade">
                    <h3>Проблемы</h3>
                    <p>Some content in menu 1.</p>
                </div>
                <div id="customers" class="tab-pane fade">
                    <h3>Клиенты</h3>
                    <p>Some content in menu 2.</p>
                </div>
                <div id="tasks" class="tab-pane fade">
                    <h3>Наряды</h3>
                    <p>Some content in menu 2.</p>
                </div>
                <div id="keys" class="tab-pane fade">
                    <h3>Ключи</h3>
                    <p>Some content in menu 2.</p>
                </div>
                <div id="equipment" class="tab-pane fade">
                    <h3>Оборудование</h3>
                    <div class="container" id="wrap">
                        @if($build['error'] == 0)
                            <h1>{{ $address }}</h1>
                            <div class="home-info">
                                <div class="address_id">Address ID: {{$build['address_id']}}</div>
                                <div class="note">{{$build['note']}}</div>
                                <div class="memo">{{$build['memo']}}</div>
                                <div class="address_desk">{{$build['address_desk']}}</div>
                                <div class="home_desk">{{$build['home_desk']}}</div>
                            </div>
                            @if(isset($build['max_floor']) && isset($build['min_floor']))
                                <table class="table table-bordered build">
                                    @for($i = $build['max_floor']+1; $i >= $build['min_floor']; $i--)
                                        <?php if ($i == 0) continue; ?>
                                        @if($i > 0)
                                            <tr>
                                        @else
                                            <tr class="basement">
                                                @endif
                                                <th {{$i == $build['max_floor']+1? 'class=loft':''}}>
                                                    <b>{{$i == $build['max_floor']+1?'Чердак':$i }}</b>
                                                </th>
                                                @foreach($build['entrances'] as $entr)
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
                                            @if ($build['min_floor'] > 0)
                                                <tr class="basement">
                                                    <th>
                                                        <b>{{ 'Подвал' }}</b>
                                                    </th>
                                                    @foreach($build['entrances'] as $e)
                                                        <td></td>
                                                    @endforeach
                                                </tr>
                                            @endif
                                            <tr class="basement">
                                                <th></th>
                                                @foreach($build['entrances'] as $e=>$k)
                                                    <th><b>Подъезд {{$e}}</b></th>
                                                @endforeach
                                            </tr>
                                </table>
                                @if (isset($build['additional']))
                                    <b>Еще оборудование в здании: </b>
                                    @foreach($build['additional']['devices'] as $dev)
                                        @if ($dev['source'] != '')
                                            <span class="state{{$dev['state']}} route system{{$dev['system']}}" data-name="{{$dev['route']}}">{{$dev['html']}}</span><&#8209;<span class="state{{$dev['source_state']}} route system{{$dev['source_system']}}"" data-name="{{$dev['source']}}">{{$dev['src_html']}}({{$dev['port']}})</span>;
                                        @else
                                            <span class="state{{$dev['state']}} route system{{$dev['system']}}" data-name="{{$dev['route']}}">{{$dev['html']}}</span>;
                                        @endif
                                    @endforeach
                                @endif
                            @else
                                <h2>Информации о внешнем виде дома нет :(</h2>
                            @endif
                    </div>
                </div>
                <div id="files" class="tab-pane fade">
                    <h3>Файлы</h3>
                    <p>Some content in menu 2.</p>
                </div>
            </div>
        </div>
    </div>
@else
    <h1>Дом с таким идентификатором адреса не найден</h1>
@endif
@endsection
