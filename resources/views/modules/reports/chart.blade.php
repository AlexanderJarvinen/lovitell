@extends('layouts.adminlte')

@section('content')
    <div id="chart-area" class="container">
    </div>
    <script type="text/javascript">
        var ChartData = {
            name: '{{$name}}'
        }
    </script>
    <script type="text/javascript" src="/js/common/chart.js"></script>
@endsection
