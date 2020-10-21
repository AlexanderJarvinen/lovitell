@extends('layouts.adminlte')

@section('content')
<div id="report-area" class="container">
</div>
<script type="text/javascript">
    var ReportData = {
        id: '{{$report_id}}',
        params: {!! json_encode($params) !!},
        filters: {!! json_encode($filters) !!}
    }
</script>
<script type="text/javascript" src="/js/common/report.js"></script>
@endsection
