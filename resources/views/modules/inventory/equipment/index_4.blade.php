@extends('layouts.adminlte')

@section('content')
<div id="equipment-list" class="container"></div>
    <script type="text/javascript">
        var InventoryData = {
            systems: {!!json_encode($systems)!!},
            cities: {!!json_encode($cities)!!},
            regions: {!!json_encode($regions)!!},
            situations: {!!json_encode($situations)!!},
            states: {!!json_encode($states)!!}
        }
    </script>
    <script type="text/javascript" src="/js/common/equipmentlist2.js"></script>
@endsection
