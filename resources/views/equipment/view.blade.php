@extends('layouts.app')

@section('content')
<div class="container eq">
   <h2>Устройство {{$name}}</h2>
   <div class="eq_address"><b>Адресс:</b> {{$address}}</div>
   <div class="eq_ent"><b>Подъезд:</b> {{$entrance}}</div>
   <div class="eq_floor"><b>Этаж:</b> {{$floor}}</div>
   <div class="eq_ip"><b>IP:</b> {{ $ip_addr }}</div>
   @if ($mac_permissions)
      <div class="eq_mac"><b>MAC:</b> <input type="text" name="mac" class="mac_string" data-route="{{$name}}" value="{{$mac}}"> <button class="save-mac">Сохранить</button></div>
   @else
      <div class="eq_mac"><b>MAC:</b> {{$mac}}</div>
   @endif
   <div class="descr"><b>Описание:</b> {{ $group_desk }}</div>
</div>
@endsection
