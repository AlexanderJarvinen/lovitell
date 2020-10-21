<head>

</head>
<body>
<html>

<?
date_default_timezone_set('Europe/Moscow');
######### Config ##################
require($_SERVER['DOCUMENT_ROOT'].'/ajax/db.php');
 #$_SESSION['password'];
 #$_SESSION['login'];
 $numErrorConnections=5;
 $login='mj';
 $password='goldwing8517';
/*
 while (!($db = @mssql_connect($ip, $login, $password)) && $numErrorConnections--) sleep(1);
    if (!$db){
	echo "ошибка";
 }
mssql_select_db ("bill", $db);

	$result = mssql_query('exec bill..report_avaiable_total -2',$db);
	$dates=$avail=$Palette=array();
*/
function chart($id){
$year=date('Y');
$month=date('m');
$day=date('d');
$cow=9;

$start=$end=$month.".".$day.".".$year;
$type=0;
$now = strtotime("this sunday");

$this_week = date("d.m.Y", strtotime("last Monday"));
$start_week = date('m.d.Y',strtotime( $this_week )-7*9*86400);

$start_now = date('m.d.Y',strtotime("-6 days"));


switch($id){
    case 'chart2.1':
	$title="<font size=\"-1\"><b>Регистрации ЛК за 24 часа</b></font>";
	$chart="<img src=\"/includes/charts/register_24_chart.php\" id='chart2.1'>";
	break;
    case 'chart2.2':
	$title="<font size=\"-1\"><b>Платежи OSMP за 24 часа</b></font>";
	$chart="<img src=\"/includes/charts/osmp_chart.php\" id='chart2.2'>";
	break;
    case 'chart2.3':
	$title="<font size=\"-1\"><b>Платежи Inplat за 24 часа</b></font>";
	$chart="<img src=\"/includes/charts/inplat_chart.php\" id='chart2.3'>";
	break;
    case 'chart2.4':
	$title="<font size=\"-1\"><b>Платежи Альфа за 24 часа</b></font>";
	$chart="<img src=\"/includes/charts/robo_chart.php\" id='chart2.4'>";
	break;
    case 'chart2.5':
	$title="<font size=\"-1\"><b>Платежи RuRu за 24 часа</b></font>";
	$chart="<img src=\"/includes/charts/ruru_chart.php\" id='chart2.5'>";
	break;
    default: return false;
};
    $res=array($title,$chart);
    return $res;
}