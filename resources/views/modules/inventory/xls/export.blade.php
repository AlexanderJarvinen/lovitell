<table border="1">
<tr>
<th>Имя</th>
<th>Тип</th>
<th>IP</th>
<th>MAC</th>
<th>Родитель</th>
<th>Порт</th>
<th>Uplink</th>
<th>Статус</th>
<th>Состояние</th>
<th>Город</th>
<th>Район</th>
<th>Улица</th>
<th>Дом</th>
</tr>
@foreach($data as $row)
<tr>
<td>{{ $row['route'] }}</td>
<td>{{ $row['system_desk'] }}</td>
<td>{{ $row['ip_addr'] }}</td>
<td>{{ $row['mac'] }}</td>
<td>{{ $row['source'] }}</td>
<td>{{ $row['source_iface'] }}</td>
<td>{{ $row['target_iface'] }}</td>
<td>{{ $row['state_desk'] }}</td>
<td>{{ $row['situation_desk'] }}</td>
<td>{{ $row['city_desk'] }}</td>
<td>{{ $row['region_desk'] }}</td>
<td>{{ $row['street_desk'] }}</td>
<td>{{ $row['build'] }}</td>
</tr>
@endforeach
</table>
