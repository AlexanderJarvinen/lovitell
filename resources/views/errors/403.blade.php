@extends('layouts.adminlte')

@section('content')
    <div class="error-page">
        <h2 class="headline text-yellow"> 403</h2>

        <div class="error-content">
            <h3><i class="fa fa-warning text-yellow"></i>В доступе отказано.</h3>

            <p>
                У Вас нет прав доступа на страницу, которую Вы запросили.
                Вы можете: <a href="/">вернуться на главную страницу</a> или используйте навигацию
                для дальнейшего перемещения по сайту
            </p>

        </div>
        <!-- /.error-content -->
    </div>
    <!-- /.error-page -->
@endsection