<!DOCTYPE html>
<!--
This is a starter template page. Use this page to start your new project from
scratch. This page gets rid of all links and provides the needed markup only.
-->
<html>
<head>
  <meta charset="utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="csrf-token" content="{{ csrf_token() }}">
  <title>Lovit | Starter</title>
  <!-- Tell the browser to be responsive to screen width -->
  <meta content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" name="viewport">
  <!-- Font Awesome -->
<!--  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.5.0/css/font-awesome.min.css"> -->
  <link rel="stylesheet" href="{{ asset("/css/font-awesome.min.css") }}">
  <!-- Ionicons -->
  <link rel="stylesheet" href="{{ asset("/css/ionicons.min.css") }}">
  <!-- Theme style -->
  <link rel="stylesheet" href="{{ asset("/css/skins/_all-skins.min.css") }}">
  <link rel="stylesheet" href="{{ asset("/css/common.css")}}">
  <link rel="stylesheet" href="{{ asset("/css/bootstrap-multiselect.css")}}">
  <link rel="stylesheet" href="{{ asset("/css/app.css")}}">
  <link rel="stylesheet" href="{{ asset("/css/jquery-ui.min.css")}}">

  <script src="/js/lib/jquery.min.js"></script>
  @if (!isset($page) || ($page != 'inventory' && $page != 'streets'))
    <script src="/js/lib/bootstrap.min.js"></script>
  @endif
  <script src="/js/vendor/vendor.bundle.js"></script>
  <script src="/js/bootstrap-multiselect.js"></script>
  <script type="text/javascript" src="/js/lib/jquery-ui.min.js"></script>
  <script src="http://api-maps.yandex.ru/2.1/?lang=ru-RU" type="text/javascript"></script>
  <script src="/js/lib/admin-lte.min.js"></script>


  <!-- HTML5 Shim and Respond.js IE8 support of HTML5 elements and media queries -->
  <!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
  <!--[if lt IE 9]>
  <script src="https://oss.maxcdn.com/html5shiv/3.7.3/html5shiv.min.js"></script>
  <script src="https://oss.maxcdn.com/respond/1.4.2/respond.min.js"></script>
  <![endif]-->

</head>
<!--
BODY TAG OPTIONS:
=================
Apply one or more of the following classes to get the
desired effect
|---------------------------------------------------------|
| SKINS         | skin-blue                               |
|               | skin-black                              |
|               | skin-purple                             |
|               | skin-yellow                             |
|               | skin-red                                |
|               | skin-green                              |
|---------------------------------------------------------|
|LAYOUT OPTIONS | fixed                                   |
|               | layout-boxed                            |
|               | layout-top-nav                          |
|               | sidebar-collapse                        |
|               | sidebar-mini                            |
|---------------------------------------------------------|
-->
<body class="hold-transition skin-black sidebar-mini">
<div class="wrapper">

  <!-- Main Header -->
  @include('includes.header')

  <!-- Left side column. contains the logo and sidebar -->
  @include('includes.sidebar')

  <!-- Content Wrapper. Contains page content -->
  <div class="content-wrapper">
    <!-- Content Header (Page header) -->
    <section class="content-header">
      <h1>
        {!! $title or ''!!}
        <small>{{$desk or ''}}</small>
      </h1>
      <ol class="breadcrumb">
        <li><a href="/"><i class="fa fa-dashboard"></i> Главная</a></li>
        <li class="active">Here</li>
      </ol>
      <a class="fullscreen--switchoff"><i class="fa fa-window-restore" aria-hidden="true"></i></a>
    </section>

    <!-- Main content -->
    <section class="content">

      @yield('content')

    </section>
    <!-- /.content -->
  </div>
  <!-- /.content-wrapper -->

  <!-- Main Footer -->
  @include("includes.footer")

  <!-- Control Sidebar -->
  @include("includes.control_sidebar")

</div>
<!-- ./wrapper -->

<!-- REQUIRED JS SCRIPTS -->




<script src="/js/main.js"></script>
</body>
</html>
