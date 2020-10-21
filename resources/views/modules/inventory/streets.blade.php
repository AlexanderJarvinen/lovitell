@extends('layouts.adminlte')
@section('content')
	<div class="container">
		<div id="streets-list">
		</div>
		<script>
			var Street = {
				modify_street_rights: {{ $modify_street_rights }},
				new_street_rights: {{ $new_street_rights }}
			};
		</script>
		<script type="text/javascript" src="/js/common/streetslist.js"></script>
	</div>
@stop