@extends('layouts.login_adminlte')

@section('content')
<div class="login-box-body">
    <p class="login-box-msg">Регистрация</p>

    <form method="post" action="{{ url('/register') }}">
        {!! csrf_field() !!}
        <div class="form-group has-feedback{{ $errors->has('name') ? ' has-error' : '' }}">
            <input type="name" class="form-control" name="name" placeholder="Логин" value="{{ old('name') }}">
            <span class="glyphicon glyphicon-user form-control-feedback"></span>
            @if ($errors->has('name'))
            <span class="help-block">
                <strong>{{ $errors->first('name') }}</strong>
            </span>
            @endif
        </div>
        <div class="form-group has-feedback{{ $errors->has('email') ? ' has-error' : '' }}">
            <input type="email" class="form-control" name="email" placeholder="E-mail" value="{{ old('email') }}">
            <span class="glyphicon glyphicon-mail form-control-feedback"></span>
            <span class="glyphicon glyphicon-envelope form-control-feedback"></span>
            @if ($errors->has('email'))
            <span class="help-block">
                <strong>{{ $errors->first('email') }}</strong>
            </span>
            @endif
        </div>
        <div class="form-group has-feedback {{ $errors->has('password') ? ' has-error' : '' }}">
            <input type="password" class="form-control" name="password" placeholder="Пароль">
            <span class="glyphicon glyphicon-lock form-control-feedback"></span>
            @if ($errors->has('password'))
            <span class="help-block">
                <strong>{{ $errors->first('password') }}</strong>
            </span>
            @endif
        </div>
        <div class="form-group has-feedback {{ $errors->has('password_confirmation') ? ' has-error' : '' }}">
            <input type="password" class="form-control" name="password_confirmation" placeholder="Подтверждение пароля">
            <span class="glyphicon glyphicon-lock form-control-feedback"></span>

            @if ($errors->has('password'))
                <span class="help-block">
                <strong>{{ $errors->first('password') }}</strong>
            </span>
            @endif
        </div>
        <div class="row">
            <div class="col-xs-7">
                <button type="submit" class="btn btn-primary btn-block btn-flat">Зарегистрироваться</button>
            </div>
        </div>
    </form>
</div>
@endsection
