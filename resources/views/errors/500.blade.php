@extends('layouts.adminlte')

@section('content')
    <!-- Content Header (Page header) -->
    <section class="content-header">
        <h1>
            Ошибка 500
        </h1>
        <ol class="breadcrumb">
            <li><a href="#"><i class="fa fa-dashboard"></i> Главная</a></li>
            <li class="active">Ошибка 500</li>
        </ol>
    </section>

    <div class="error-page">
        <h2 class="headline text-red">500</h2>

        <div class="error-content">
            <h3><i class="fa fa-warning text-yellow"></i>Что-то пошло не так.</h3>

            <p>
                Что-то пошло не так...
                Вы можете: <a href="../../index.html">вернуться на главную страницу</a> или используйте навигацию
                для дальнейшего перемещения по сайту
            </p>

        </div>
        <!-- /.error-content -->
    </div>
    <!-- /.error-page -->
@endsection