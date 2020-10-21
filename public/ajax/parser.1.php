<?
require('db.php');
require($_SERVER['DOCUMENT_ROOT'].'/includes/functions.php');
$numErrorConnections=5;
session_start();
while (!($db = @mssql_connect($ip, $_SESSION['login'], $_SESSION['password'])) && $numErrorConnections--) sleep(1);
mssql_select_db ("bill",$db);
$result = mssql_query("exec pss..create_menu 0", $db);
//$Qry='url=http://ya.ru';

while ($row = mssql_fetch_array($result)) {

/*
print "<pre>";
    var_dump($row);
print "</pre>";
*/

		if ($row['id'] == $_GET['id']){
		    if (strpos(cyr($row['command']),'[') > 0){
            		$json_str=json_decode(cyr($row['command']));
			$Qry=$json_str->cmd;
			if (strpos($Qry,'url') === 0){
			    $url=explode('=', $Qry)[1];
			    $ch = curl_init(); 
			    curl_setopt($ch, CURLOPT_URL, $url);
			    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1); 
			    $result = curl_exec($ch); 
			    curl_close($ch);
			    print $result;
			    exit;
			}
            		$headers[0]='new style';
            		if ($json_str->input){
            		    $n_count=1;
            		    foreach ($json_str->input as $value){
            			$name=$value.$n_count;
            			if (strpos('date','$value') == 0) $type='date'; //Тип=дата
            			if ($name != '') $input[$name]=$type;
            			$n_count++;
            		    }
            		}

            	    } else {
            		if (strpos(iconv('cp1251','utf8',$row['command']),'!') == 0) //Начало вкоманды с "!" - делать запрос к базе.
            		$fields= explode('#',iconv('cp1251','utf8',$row['command'])); //Названия столбцов выводимой таблицы и поля возвращаемые зи базы #поле(столбец^длинна)
            		$Qry=str_replace('!','',$fields[0]);
            		unset($fields[0]);
            		foreach ($fields as $value){
			    if ($value != ''){
            			$headers[]= str_replace('(','',substr ( $value, strpos($value, '(' ), strpos($value, '^')-strpos($value, '(' ) ));
				$names[]=substr ( $value, 0 , strpos($value, '(' ) );
            		    }
            		}
            	    }
        	if($input) {
            	    include ($_SERVER['DOCUMENT_ROOT'].'/ajax/inputtest.php');
            	    if($_GET['action'] != 'next'){
            		exit;
        	    }
		}
    	    }
}		
if (!$headers){
    echo "<h3>Нет формата представления отчета</h3><h4>Переданная команда некорректна</h4>";
    exit;
}

$table = '';

$table .= "<table id=\"simple-table\" class=\"table table-striped table-bordered table-hover\">";
$table .= "<thead>";

if ($headers[0] != 'new style'){
    $table .= "<tr>";

    foreach ($headers as $value){
	$table .= "<th>".$value."</th>";
    }

    $table .= "</tr>";
} else {
#    $table .= json_thead($json_str->header)['out_str'];
    $table .= json_thead($json_str->header);
    
#    if ($_COOKIE["login"] == 'mj'){
#	print "<br>111";
#    }

}
$table .= "</thead>";
$table .= "<tbody>";

if($_GET['date1'] and $_GET['date2']) $Qry=$Qry.",'".$_GET['date1']."','".$_GET['date2']."'";

$result = mssql_query($Qry, $db);

if (!$result) {
    msg_handler(mssql_get_last_message());
}
    
while ($row = mssql_fetch_array($result)) {
    if ($row['tr_bg_col'] != ''){
	$table .= "<tr style=\"background-color:".$row['tr_bg_col']."\">";
    } else {
	$table .= "<tr>";
    }
    if ($headers[0] == 'new style'){
	$names=array();
	foreach ($row as $name=>$value ){
	    if (!is_numeric($name) and $name != 'tr_bg_col') array_push($names,$name);  
	}
    }
    $count=0;
#	$table .= "<td align=\"right\">";
#	var_dump($names);
#	$table .= "</td>";
    foreach ($names as $name ){
	$table .= "<td align=\"right\">".iconv('cp1251','utf8',$row[$name])."</td>";
	$count++;
    }
    $table .= "</tr>";
}
$table .= "</tbody>";
$table .= "</table>";



//    $table .= $row->error."<br>";;
//    $table .= $row->msg."<br>";

?>