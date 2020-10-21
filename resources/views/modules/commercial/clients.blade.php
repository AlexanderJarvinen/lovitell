@extends('layouts.adminlte')
@section('content')
	<div class="container">
		<div id="clients-list">
		</div>
		<script type="text/javascript">
			var ClientsData = {
				columns: {!! json_encode($columns) !!}
			}
		</script>
		<script type="text/javascript" src="/js/common/clientlist.js"></script>
	</div>
@stop