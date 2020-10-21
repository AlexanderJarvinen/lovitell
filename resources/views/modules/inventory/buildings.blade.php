@extends('layouts.adminlte')
@section('content')
	<div class="container">
		<div id="build_list">
		</div>
	@if($newbuild_rights)
		<button class='btn btn-primary btn-md' onclick="location.href='/inventory/building/new';">Добавить дом</button>
	@endif
		<script type="text/javascript" src="/js/common/buildlist.js"></script>
	</div>
@stop