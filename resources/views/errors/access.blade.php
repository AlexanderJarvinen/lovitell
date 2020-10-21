@extends('layouts.app')

@section('content')
<div class="container">
    <div class="container">
        <div class="row">
            <div class="col-md-10 col-md-offset-1">
                <div class="panel panel-default error">
                    <div class="panel-heading">ОШИБКА!</div>

                    <div class="panel-body">
                        У Вас нет прав для доступа к этому экрану!
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
@endsection
