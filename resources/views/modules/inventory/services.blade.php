@extends('layouts.adminlte')

@section('content')
<div id="services-list" class="container"></div>
<script type="text/javascript">
    var serviceParams={
        can_addservice: {{$can_addservice}},
        can_modifyservice: 1,
        can_modifyserviceoption: {{$can_modifyserviceoption}}
    };
</script>
<script type="text/javascript" src="/js/common/serviceslist.js"></script>
@endsection
