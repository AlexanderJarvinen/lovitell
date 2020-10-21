@extends('layouts.app')

@section('content')
<div class="container">
    <h2>Районы</h2>
    <select id="region-select" multiple="multiple">
        @foreach($regions as $region)
            <option value={{$region['region_id']}}>{{iconv('cp1251', 'utf8', $region['desk'])}}</option>
        @endforeach
    </select><button id="get-equipment-data">Показать</button>
    <div id="equipment-list-wrap">
        <h2>Оборудование:</h2>
        <table id="equipment-list" class="display" width="100%" cellspacing="0">
            <thead>
            <tr>
                <th>Имя</th>
                <th>IP</th>
                <th>MAC</th>
                <th>Район</th>
                <th>Улица</th>
                <th>№ дома</th>
            </tr>
            </thead>
            <tfoot>
            <tr>
                <th>Имя</th>
                <th>IP</th>
                <th>MAC</th>
                <th>Район</th>
                <th>Улица</th>
                <th>№ дома</th>
            </tr>
            </tfoot>
        </table>
    </div>
</div>
@endsection
