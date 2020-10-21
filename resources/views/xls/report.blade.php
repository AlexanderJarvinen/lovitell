<table border="1">
<tr>
<th>Тип</th>
<th>Регион</th>
<th>Январь</th>
<th>Февраль</th>
<th>Март</th>
<th>Апрель</th>
<th>Май</th>
<th>Июнь</th>
<th>Июль</th>
<th>Август</th>
<th>Сентябрь</th>
<th>Октябрь</th>
<th>Ноябрь</th>
<th>Декабрь</th>
</tr>
@foreach($data as $row)
<tr>
<td>{{ iconv('cp1251', 'utf8', $row['trouble_desk']) }}</td>
<td>{{ iconv('cp1251', 'utf8', $row['desk']) }}</td>
<td>{{ $row['qty1'] }}</td>
<td>{{ $row['qty2'] }}</td>
<td>{{ $row['qty3'] }}</td>
<td>{{ $row['qty4'] }}</td>
<td>{{ $row['qty5'] }}</td>
<td>{{ $row['qty6'] }}</td>
<td>{{ $row['qty7'] }}</td>
<td>{{ $row['qty8'] }}</td>
<td>{{ $row['qty9'] }}</td>
<td>{{ $row['qty10'] }}</td>
<td>{{ $row['qty11'] }}</td>
<td>{{ $row['qty12'] }}</td>
<td>{{ $row['qty_total'] }}</td>
</tr>
@endforeach
</table>
