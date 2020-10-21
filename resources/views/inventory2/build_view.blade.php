@extends('layouts.app')

@section('content')
<div class="container" id="wrap">
    @if($build['error'] == 0)
    <h1 class="address">{{ $address }}</h1>
    <div class="home-info">
        <div class="address_id">Address ID: {{$build['address_id']}}</div>
        <div class="note">{{$build['note']}}</div>
        <div class="memo">{{$build['memo']}}</div>
        <div class="address_desk">{{$build['address_desk']}}</div>
        <div class="home_desk">{{$build['home_desk']}}</div>
        @if (true)
            <div class="coordinate"><b>Координаты:</b> Широта:<input type="text" name="latitude" class="coord latitude_string" value="{{$build['latitude']}}">, Долгота: <input type="text" name="longitude" class="coord longitude" value="{{$build['longitude']}}"><button id="get_yandex_coord">Заполнить через Yandex API</button></div>
        @else
            <div class="coordinate"><b>Координаты:</b> Широта: {{$build['latitude']}}, Долгота: {{$build['longitude']}}</div>
        @endif
        <button class="save-mac">Сохранить</button></div>
    </div>
@else
    <h1>Дом с таким идентификатором адреса не найден</h1>
@endif
@endsection
