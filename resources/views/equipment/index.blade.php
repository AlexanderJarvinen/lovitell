@extends('layouts.app')

@section('content')
<div class="container">
    <h2>Поиск оборудования:</h2>
    <form name="eqsearch" id="eqsearch" method="POST">
        <b>по параметрам:</b>
        <input type="text" name="name" class="eq-params" placeholder="Имя">
        <input type="text" name="ip" class="eq-params" placeholder="IP-адрес">
        <input type="text" name="mac" class="eq-params" placeholder="MAC-адрес">
        <input type="text" name="switch" class="switch eq-params" placeholder="Switch">
        <input type="text" name="port" class="port eq-params" placeholder="Port" maxlength="2">
        <br>
        <b>по улице:</b>
        <input type="text" name="street" class="street" placeholder="Улица"><br>
        <button id="search-equipment">Найти</button>
    </form>
    <div id="equipment-list-wrap" style="display: none">
        <h2>Результат:</h2>
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
