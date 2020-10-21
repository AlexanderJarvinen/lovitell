@extends('layouts.app')

@section('content')
<div class="container" id="wrap" xmlns="http://www.w3.org/1999/html">
    <h1 class="address">Добавление координат</h1>
    <div class="home-info">
        <table class="table-bordered">
            <th>N</th><th>Адрес</th><th>Широта Я</th><th>Долгота Я</th><th>Яндекс адрес</th><th>Широта G</th><th>Долгота G</th><th>Google адрес</th>
            @foreach($buildings as $i=>$build)
            <tr class="address_row" data-addressid="{{$build['address_id']}}">
                <td>{{$i+1}}</td>
                <td class="address">{{$build['address']}}</td>
                <td class="coordinates yandex"><input type="text" name="latitude" class="coord latitude_string" value="{{$build['latitude']}}"></td>
                <td class="coordinates yandex"><input type="text" name="longitude" class="coord longitude_string" value="{{$build['longitude']}}"></td>
                <td class="yandex_address"></td>
                <td class="coordinates google"><input type="text" name="latitude" class="coord latitude_string" value="{{$build['latitude']}}"></td>
                <td class="coordinates google"><input type="text" name="longitude" class="coord longitude_string" value="{{$build['longitude']}}"></td>
                <td class="google_address"></td>
                <td class="coordinates 2gis"><input type="text" name="latitude" class="coord latitude_string" value="{{$build['latitude']}}"></td>
                <td class="coordinates 2gis"><input type="text" name="longitude" class="coord longitude_string" value="{{$build['longitude']}}"></td>
                <td class="2gis_address"></td>
                <td class="result">&nbsp;</td></tr>
            @endforeach
        </table>
        <button class="fill_by_yandex">Yandex Геокодер</button><button class="fill_by_google">Google Геокодер</button><button class="fill_by_2gis">2Gis Геокодер</button><button class="save_coordinates">Сохранить</button></div>
        <div id="map">
        </div>
    </div>
@endsection
