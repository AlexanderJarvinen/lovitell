@extends('layouts.adminlte')

@section('content')
    <div id="nagios-wrap" class="container"></div>
    <script type="text/javascript">
        var NagiosData = {
            types: {!! json_encode(isset($types)?$types:[]) !!}
        };
    </script>
    <script type="text/javascript" src="/js/common/nagios.js"></script>
@endsection
