<?
require('db.php');

$numErrorConnections=5;
session_start();
while (!($db = @mssql_connect($ip, $_SESSION['login'], $_SESSION['password'])) && $numErrorConnections--) sleep(0.5);
mssql_select_db ("bill", $db);

$result = mssql_query("exec report_avaible 0", $db);
mssql_set_message_handler('msg_handler');
if (!$result) {
    msg_handler(mssql_get_last_message());
}
?>
<table id="simple-table" class="table table-striped table-bordered table-hover">
<thead>

<tr>
    <th rowspan="2">Район</th>
    <th rowspan="2">Абонентов</th>
    <th colspan="3">Итого</th>
    <th colspan="3">Точки внутренние    </th>
    <th colspan="3">Точки внешние</th>
    <th colspan="3">Маршрутизаторы</th>
    <th colspan="3">Коммутаторы</th>
    <th colspan="3">Релейки</th>
    <th colspan="3">Камеры</th>
</tr>
    <th>Всего</th>
    <th>Off</th>
    <th>%</th>
    <th>Всего</th>
    <th>Off</th>
    <th>%</th>
    <th>Всего</th>
    <th>Off</th>
    <th>%</th>
    <th>Всего</th>
    <th>Off</th>
    <th>%</th>
    <th>Всего</th>
    <th>Off</th>
    <th>%</th>
    <th>Всего</th>
    <th>Off</th>
    <th>%</th>
    <th>Всего</th>
    <th>Off</th>
    <th>%</th>
<tr>
</tr>
</thead>

<tbody>
<?
if (mssql_num_rows($result)) while ($row = mssql_fetch_array($result)) {
?>
 	<tr>
		<td align="left"><?=iconv('cp1251','utf8',$row['desk'])?> </td>
          	<td align="left"><?=$row['subscribers']?> </td>
                <td align="left"><?=$row['total']?> </td>
                <td align="right"><?=$row['total_off']?> </td>
                <td align="right"><?=round($row['total_prc'],2)?> </td>
                <td align="right"><?=$row['in_door_total']?> </td>
                <td align="right"><?=$row['in_door_off']?> </td>
                <td align="right"><?=round($row['in_door_prc'],2)?> </td>
                <td align="right"><?=$row['out_door_total']?> </td>
                <td align="right"><?=$row['out_door_off']?> </td>
                <td align="right"><?=round($row['out_door_prc'],2)?> </td>
                <td align="right"><?=$row['routers_total']?> </td>
                <td align="right"><?=$row['routers_off']?> </td>
                <td align="right"><?=round($row['routers_prc'],2)?> </td>
                <td align="right"><?=$row['switches_total']?> </td>
                <td align="right"><?=$row['switches_off']?> </td>
                <td align="right"><?=round($row['switches_prc'],2)?> </td>
                <td align="right"><?=$row['point_total']?> </td>
                <td align="right"><?=$row['point_off']?> </td>
                <td align="right"><?=round($row['point_prc'],2)?> </td>
                <td align="right"><?=$row['cams_total']?> </td>
                <td align="right"><?=$row['cams_off']?> </td>
                <td align="right"><?=round($row['cams_prc'],2)?> </td>
	</tr>
<?
}
?>
</tbody>
</table>