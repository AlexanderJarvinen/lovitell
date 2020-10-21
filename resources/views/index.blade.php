@extends('layouts.adminlte')

@section('content')
    <!-- Main content -->
    <div id="dashboard">
    </div>
    <script type="text/javascript">var dashboard_id=0; var kit_id={{ $kit_id or 0 }};</script>
    <script src="{{ asset("/js/common/dashboard.js") }}"></script>
    <!-- /.content -->
@endsection
