@extends('layouts.adminlte')

@section('content')
<link href="https://cdn.datatables.net/1.10.11/css/jquery.dataTables.min.css" rel="stylesheet">
<div class="container" id="wrap" xmlns="http://www.w3.org/1999/html">
    <h1 class="address">Добавление координат</h1>
    <h2>Районы</h2>
    <select id="region-select" multiple="multiple">
        @foreach($regions as $region)
            <option value={{$region->region_id}}>{{$region->desk}}</option>
        @endforeach
    </select><button id="get-coord-data">Показать</button><br>
    <input type="checkbox" class="only_empty"> Только с пустыми координатами
    <div class="home-info">
        <table id="coordinate-list" class="table-bordered">
            <thead>
            <tr>
                <th><input type="checkbox" name="selectall" class="select_all"></th>
                <th>Город</th>
                <th>Район</th>
                <th>Улица</th>
                <th>№ дома</th>
                <th>Тип</th>
                <th>Статус</th>
                <th>Широта</th>
                <th>Долгота</th>
                <th>Адрес Яндекс</th>
                <th><input type="checkbox" name="save_select" class="save_select"></th>
            </tr>
            </thead>
            <tfoot>
            <tr>
                <th>V</th>
                <th class="searchable">Город</th>
                <th class="searchable">Район</th>
                <th class="searchable">Улица</th>
                <th class="searchable house">№ дома</th>
                <th class="searchable">Тип</th>
                <th class="searchable">Статус</th>
                <th class="searchable coordinates">Широта</th>
                <th class="searchable coordinates">Долгота</th>
                <th>Адрес Яндекс</th>
                <th><img src="/img/save.jpg"></th>
            </tr>
            </tfoot>
        </table>
        <button class="fill_by_yandex2">Yandex Геокодер</button><button class="save_coordinates2">Сохранить</button></div>
    </div>
    <div id="coord_map"></div>
<script src="https://cdn.datatables.net/1.10.11/js/jquery.dataTables.min.js"></script>
<script src="/js/coord.js" type="text/javascript"></script>
@endsection

