@extends('layouts.adminlte')
@section('content')
	<div class="container">
		<ul class="nav nav-pills">
			<li class="active" data-target="#street-search-tab" data-toggle="tab"><a href="#">Поиск по улице</a></li>
			<li data-target="#region-search-tab" data-toggle="tab"><a href="#">Поиск по району</a></li>
		</ul>
		<div class="tab-content">
			<div class="tab-pane active" id="street-search-tab">
				<label for="street-search">Введите название улицы:</label><br>
				<input type="hidden" id="street-id" />
				<input name="street-search" id="street-search" class="street-search" placeholder="Название улицы" />
			</div>
			<div class="tab-pane" id="region-search-tab">
				<label for="region-select">Введите название улицы:</label><br>
				<select name="region-select" id="region-select" multiple="multiple">
				@foreach($regions as $region)
					<option value={{$region->region_id}}>{{$region->desk}}</option>
				@endforeach
				</select><button id="get-house-data">Показать</button>
			</div>
		</div>
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
		@if($newbuild_rights)
			<button class='btn btn-primary btn-md' onclick="location.href='/inventory/building/new';">Добавить дом</button>
		@endif
	</div>
@stop