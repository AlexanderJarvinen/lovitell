@extends('layouts.adminlte')

@section('content')
<div class="container">
   <div class="box">
      <div class="box-header">
         <h2 class="eq_route">Устройство {{$name}}</h2>
      </div>
      <div class="box-body">
      @if($init)
         <div class="eq_address"><b>Адресс:</b> {{$address}}</div>
         <div class="eq_ent"><b>Подъезд:</b> {{$entrance}}</div>
         <div class="eq_floor"><b>Этаж:</b> {{$floor}}</div>
         <div class="eq_ip"><b>IP:</b> {{ $ip_addr }}</div>
         @if ($mac_permissions)
            <div class="eq_mac">
               <b>MAC:</b>
               <input type="text" name="mac" class="mac_string" data-route="{{$name}}" data-system="{{$system}}" value="{{$mac}}"> <button class="save-mac">Сохранить</button>
               <div class="error-msg" style="display: none;"></div>
            </div>

         @else
            <div class="eq_mac"><b>MAC:</b> {{$mac}}</div>
         @endif
         <div class="source"><b>Родитель:</b> {{ $source }}</div>
         <div class="iface"><b>Родитель:</b> {{ $source_iface }}</div>
         <div class="descr"><b>Описание:</b> {{ $group_desk }}</div>
         @if(isset($ports))
            <h4>Статус портов</h4>
            <table class="table-bordered dataTable col-md-3 port-table">
               <thead>
                  <tr>
                     <th>Порт</th><th>Устройство</th><th>Интерфейс</th>
                  </tr>
               </thead>
               @foreach($ports as $port)
                  <tr>
                     <td>{{$port['port']}}</td>
                     <td><a href="/inventory/equipment/view/{{$port['target']}}">{{$port['target']}}</a></td>
                     <td>{{$port['target_iface']}}</td>
                  </tr>
               @endforeach
            </table>
         @endif
      @else
         <b>Нет информации об устройстве</b>
      @endif
      </div>
   </div>
</div>
@endsection
