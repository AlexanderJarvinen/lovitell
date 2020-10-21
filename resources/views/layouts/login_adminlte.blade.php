<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>AdminLTE 2 | Log in</title>
    <!-- Tell the browser to be responsive to screen width -->
    <meta content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" name="viewport">
<!--    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.5.0/css/font-awesome.min.css"> -->
    <link rel="stylesheet" href="{{ asset("/css/font-awesome.min.css") }}">
    <link rel="stylesheet" href="{{ asset("/css/common.css")}}">

    <!-- iCheck -->
    <link rel="stylesheet" href="{{ asset("/css/plugins/iCheck/blue.css") }}">

    <!-- HTML5 Shim and Respond.js IE8 support of HTML5 elements and media queries -->
    <!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
    <!--[if lt IE 9]>
    <script src="https://oss.maxcdn.com/html5shiv/3.7.3/html5shiv.min.js"></script>
    <script src="https://oss.maxcdn.com/respond/1.4.2/respond.min.js"></script>
    <![endif]-->
</head>
<body class="hold-transition skin-black login-page">
<div class="login-box">
    <div class="login-logo">
        <a href="../../index2.html"><img src="/img/logo.png"></a>
    </div>
    <!-- /.login-logo -->

    @yield("content")

    <!-- /.login-box-body -->
</div>
<!-- /.login-box -->
<script src="{{ asset("/js/login.js") }}"></script>
</body>
</html>
