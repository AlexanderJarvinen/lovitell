@extends('layouts.adminlte')

@section('content')
<div>
    <div id="equipment-list" class="container"></div>
    <script type="text/javascript">
        var InventoryData = {
            systems: {!! json_encode($systems) !!},
            cities: {!! json_encode($cities) !!},
            regions: {!! json_encode($regions)!!},
            situations: {!! json_encode($situations) !!},
            states: {!! json_encode($states) !!},
            can_addroute: {{!empty($can_addroute)?1:0}},
            can_deleteroute: {{!empty($can_deleteroute)?1:0}},
            can_modifyroute: {{ !empty($cam_modifyroute)?1:0 }},
            can_changeFW: {{ !empty($can_changeFW)?1:0 }},
            filters: {!! json_encode($filters) !!},
            is_monitoring: true,
            update_duration: {{$update_duration}},
            columns: {!! json_encode($columns) !!},
            filters_config: {!! json_encode($filters_config) !!}
        };
    </script>
    <script type="text/javascript" src="/js/common/equipmentlist.js"></script>
</div>
@endsection
