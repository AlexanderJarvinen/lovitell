@extends('layouts.app')

@section('content')
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
@else
    <h1>Дом с таким идентификатором адреса не найден</h1>
@endif
@endsection
