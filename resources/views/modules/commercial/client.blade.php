@extends('layouts.adminlte')

@section('content')
    <div id="client-page" class="b-client-page__wrap">
    </div>
    <script type="text/javascript">
        var client_id={{$client_id or 0}};
    </script>
    <script type="text/javascript" src="/js/common/clientpage.js"></script>
@endsection