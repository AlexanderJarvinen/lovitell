@extends('layouts.app')

@section('content')
<div class="container">
    <h2>Районы</h2>
    <select id="region-select" multiple="multiple">
        @foreach($regions as $region)
            <option value={{$region->region_id}}>{{iconv('cp1251', 'utf8', $region->desk)}}</option>
        @endforeach
    </select><button id="get-house-data">Показать</button>
    <ul class="nav nav-pills">
        <li class="active" data-target="#table" data-toggle="tab"><a href="#">Таблица</a></li>
        <li data-target="#map" data-toggle="tab"><a href="#">Карта</a></li>
    </ul>
    <div class="tab-content">
        <div class="tab-pane active" id="table">
            <div id="house-list-wrap">
                <h2>Дома:</h2>
                <table id="house-list" class="display" width="100%" cellspacing="0">
                    <thead>
                    <tr>
                        <th>Район</th>
                        <th>Улица</th>
                        <th>№ дома</th>
                    </tr>
                    </thead>
                    <tfoot>
                    <tr>
                        <th>Район</th>
                        <th>Улица</th>
                        <th>№ дома</th>
                    </tr>
                    </tfoot>
                </table>
            </div>
        </div>
        <div class="tab-pane" id="map">
            <div id="house-map-wrap" class="map">
            </div>
        </div>
    </div>
</div>
@endsection
