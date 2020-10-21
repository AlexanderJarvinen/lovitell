<h4>{{$name}}</h4>
@if($init)
<b>Описание</b>: {{$group_desk}}<br>
<b>IP:</b> {{$ip_addr}}<br>
<b>MAC:</b> {{$mac}} <br>
<b>Модель:</b> {{$model_desk}}<br>
<b>Родитель:</b> {{$source}}<br>
<b>Интерфейс:</b> {{$source_iface}}<br>
<b>Состояние:</b> {{$situation_desk}}<br>
<div class="error_msg" style="display: none"></div>
<div class="error_code" style="display: none"></div>
<div class="port" style="display: none;"></div>
<div class="ping" style="display: none"></div>
<div class="mac_list" data-permissions="{{intval($mac_permissions)}}" style="display: none"></div>
@if($configure_permissions && ($system_id == -3 || $system_id == 11) && $situation_id == 1)
<div id="route-config"></div>
<script type="text/javascript">var route = '{{$name}}';</script>
<script type="text/javascript" src="/js/common/configureap.js"></script>
@endif
<a href="/inventory/equipment/view/{{$name}}">Редактировать</a>
@else
<b>Нет информации об устройстве</b>
@endif