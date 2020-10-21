<?php

?>
<aside id="main-sidebar" class="main-sidebar">

    <script type="text/javascript">
        var User = {
            'uid': '{{$user->id}}',
            'login': '{{$user->name}}',
            'name': '{{$user->fullname}}',
            'email': '{{$user->email}}',
            'isconnect': '{{$user->is_connect}}',
            'avatar': '{{is_file(public_path()."/img/avatar/".$user->name.".jpg")?"/img/avatar/".$user->name.".jpg":false}}'
        }
    </script>
    <script src="{{ asset("/js/common/sidebar.js") }}"></script>
</aside>