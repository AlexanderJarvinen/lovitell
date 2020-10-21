@extends('layouts.login_adminlte')

@section('content')
<div class="login-box-body">
    <p class="login-box-msg">Авторизация</p>

    <form method="post" action="{{ url('/login') }}">
        {!! csrf_field() !!}
        <div class="form-group has-feedback{{ $errors->has('name') ? ' has-error' : '' }}">
            <input type="text" name="name" class="form-control" placeholder="Логин" value="{{ old('name') }}">
            <span class="glyphicon glyphicon-user form-control-feedback"></span>
            @if ($errors->has('name'))
                <span class="help-block">
                    <strong>{{ $errors->first('name') }}</strong>
                </span>
            @endif
        </div>
        <div class="form-group has-feedback {{ $errors->has('password') ? ' has-error' : '' }}">
            <input type="password" name="password" class="form-control" placeholder="Пароль">
            <span class="glyphicon glyphicon-lock form-control-feedback"></span>
            @if ($errors->has('password'))
                <span class="help-block">
                    <strong>{{ $errors->first('password') }}</strong>
                </span>
            @endif
        </div>
        <div class="row">
            <div class="col-xs-6">
                <div class="checkbox icheck">
                    <label>
                        <input type="checkbox" name="remember">Запомнить меня
                    </label>
                </div>
            </div>
            <!-- /.col -->
            <div class="col-xs-6">
                <button type="submit" class="btn btn-primary btn-block btn-flat">Авторизоваться</button>
            </div>
            <!-- /.col -->
        </div>
        <br/>
        <div class="row">
            <div class="col-xs-12">
                <p>
                    <img src="/img/active-logo.png" style="float: left; margin: 5px 10px;">Авторизуйтесь используя учетные данные <a href="https://ru.wikipedia.org/wiki/Active_Directory" target="_blank">Active Dircetory</a>
                </p>
                <p style="text-align: center">- ИЛИ -</p>
                <p>
                    <i class="fa fa-unlock" aria-hidden="true" style="font-size: 32px; display: inline-block; float: left; margin: 0px 20px;"></i><a href="/register" style="height: 32px; display:inline-block; line-height: 32px;">Зарегистрируйтесь >></a>
                </p>
            </div>
        </div>
    </form>
</div>
@endsection
