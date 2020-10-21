@extends('layouts.adminlte')

@section('content')
    <!-- Content Header (Page header) -->
    <div class="error-page">
        <h2 class="headline text-yellow"> 404</h2>

        <div class="error-content">
            <h3><i class="fa fa-warning text-yellow"></i>Страница не найдена.</h3>

            <p>
                Страница, которую вы запросили не существует.
                Вы можете: <a href="../../index.html">вернуться на главную страницу</a> или используйте навигацию
                для дальнейшего перемещения по сайту
            </p>

        </div>
        <!-- /.error-content -->
    </div>
    <!-- /.error-page -->
@endsection