@extends('layouts.adminlte')

@section('content')
    <!-- Main content -->
    <div id="user_settings"></div>
    <script type="text/javascript">
        var User = {
            'uid': '{{$user->id}}',
            'login': '{{$user->name}}',
            'name': '{{$user->fullname}}',
            'email': '{{$user->email}}',
            'isconnect': '{{$user->is_connect}}',
            'dbLogin': '{{$user->db_login}}',
            'avatar': '{{is_file(public_path()."/img/avatar/".$user->name.".jpg")?"/img/avatar/".$user->name.".jpg":false}}'
        }
    </script>
    <script src="{{ asset("/js/common/profile.js") }}"></script>

@endsection