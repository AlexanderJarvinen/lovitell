<?php
include $_SERVER['DOCUMENT_ROOT']."/includes/sql.php";
    $mssql = new sybase();
    $mssql->login  = 'mj';
    $mssql->password = 'goldwing8517';
    $mssql->connect();
    
    $color = array('3' => 'three', '4' => 'four', '5' => 'five', '6' => 'six');
    
    if ($_GET['target'] == 'types') {
	$res = $mssql->get_types();
	?>
	<div id="3" class="three in">Тип: </div>
	<div id="4" class="three in">
	<select name="type" id="type" onChange="set_type()">
	    <?php
	    foreach ($res as $row){
		print "<option value=\"".$row['type']."\">".$row['desk']."</option>";
	    }
	    ?>
	</select>
	</div>
	
    
	<?php
    } else {
    
	if ($_GET['target'] == 'left') $res = $mssql->get_left();
	else if ($_GET['target'] == 'right') $res = $mssql->get_right($_GET['type']);
	?>
	<table>
	    <tr>
		<th rowspan="2"> Имя </th>
		<th colspan="4"> Адрес </th>
		<?php if ($_GET['target'] == 'right') echo "<th rowspan='2'> Последняя дата </th>";?>
		<?php if ($_GET['target'] == 'right') echo "<th rowspan='2'> Flaps </th>";?>
		<th rowspan='2'> Простой<br>(мин.) </th>
	    </tr>
	    <tr>
		<th> Район </th>
		<th> Улица </th>
		<th> д. </th>
		<th> к. </th>
	    </tr>
	    <?php
		foreach ($res as $row) {
		?>
		<tr class="<?=$color[$row['system']]?>">
		    <td title="<?=$row['ip_addr']?>"><?=$row['route']?></td>
		    <td><?=$row['region_desk']?></td>
		    <td><?=$row['street']?></td>
		    <td><?=$row['house']?></td>
		    <td> <?=$row['body']?></td>
		    <?php if ($_GET['target'] == 'left') echo "<td>".$row['duration']."</td>";?>
		    <?php if ($_GET['target'] == 'right') echo "<td>".$row['last_date']."</td>";?>
		    <?php if ($_GET['target'] == 'right') echo "<td>".$row['qty']."</td>";?>
		    <?php if ($_GET['target'] == 'right') echo "<td>".$row['lost_time']."</td>";?>
		</tr>
		<?php
		}
	    ?>
	    </tr>
	</table>
<?php } ?>
