@extends('layouts.adminlte')

@section('content')
    <div class="row" xmlns="http://www.w3.org/1999/html">
            <div id="new-building" class="col-md-6">
            </div>
            <script type="text/javascript">
            var BuildingData = {
                city_list: {!! json_encode($city_list) !!},
                services: {!!  json_encode($services) !!},
                new_street_rights: {{ $rights['new_street'] }},
                city_id: {{ $address['city_id'] }},
                region_id: {{ $address['region_id'] }},
                street_id: {{ $address['street_id'] }},
                address_id: {{ $address['address_id'] }},
            }
            </script>
            <script type="text/javascript" src="/js/common/newbuildingform.js"></script>
    </div>
@endsection
