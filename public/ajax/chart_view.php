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
 while (!($db = @mssql_connect($ip, $login, $password)) && $numErrorConnections--) sleep(1);
    if (!$db){
	echo "ошибка";
 }
mssql_select_db ("bill", $db);

	$result = mssql_query('exec bill..report_avaiable_total -2',$db);
	$dates=$avail=$Palette=array();

function chart($id){
$year=date('Y');
$month=date('m');
$day=date('d');
$cow=9;

$start=$end=$month.".".$day.".".$year;
$type=0;
$now = strtotime("this sunday");

$this_week = date("d.m.Y", strtotime("last Monday"));
#$start_week = date('m.d.Y',strtotime( $day.'.'.$month.'.'.$year )-7*9*86400);
$start_week = date('m.d.Y',strtotime( $this_week )-7*9*86400);

#$now = strtotime("this sunday");
#$start_now =  date('m.d.Y',strtotime("last monday", $now));
$start_now = date('m.d.Y',strtotime("-6 days"));


switch($id){
    case 'chart1':
	$title="<font size=\"-1\"><b>Магистральная сеть. Месяцы</b></font>";
	$chart="<img src='/includes/chart_img.php?id=3&start=".'01'.'.'.'01'.'.'.$year."&end=".date('m.d.Y')."&type=0&group=2' id='chart1' style='width:100%'>";
	break;
    case 'chart2':
	$title="<font size=\"-1\"><b>Магистральная сеть. Недели</b></font>";
	$chart="<img src='/includes/chart_img.php?id=2&start=".$start_week."&end=".date('m.d.Y')."&type=0&group=2' id='chart2' style='width:100%'>";
	break;
    case 'chart3':
	$title="<font size=\"-1\"><b>Магистральная сеть. 7 дней.</b></font>";
	$chart="<img src='/includes/chart_img.php?id=1&start=".$start_now."&end=".date('m.d.Y')."&type=0&group=2' id='chart3' style='width:100%'>";
	break;
    case 'chart4':
	$title="<font size=\"-1\"><b>Магистральная сеть. ".date('d.m.Y',strtotime("last day"))."</b></font>";
	$chart="<img src='/includes/chart_img.php?id=222&start=".date('m.d.Y',strtotime("last day"))."&end=".date('m.d.Y',strtotime("last day"))."&type=255&group=2' id='chart4' style='width:100%'>";
	break;	
    case 'chart5':
	$title="<font size=\"-1\"><b>Точки доступа Indoor. ".$year."</b></font>";
	$chart="<img src='/includes/chart_img.php?id=3&start=01.01.".$year."&end=".date('m.d.Y')."&type=-3' id='chart5' style='width:100%'>";
	break;
    case 'chart6':
	$title="<font size=\"-1\"><b>Точки доступа Indoor. Недели.</b></font>";
	$chart="<img src='/includes/chart_img.php?id=2&start=".$start_week."&end=".date('m.d.Y')."&type=-3' id='chart6' style='width:100%'>";
	break;
    case 'chart7':
	$title="<font size=\"-1\"><b>Точки доступа Indoor. 7 дней.</b></font>";
	$chart="<img src='/includes/chart_img.php?id=1&start=".$start_now."&end=".date('m.d.Y')."&type=-3' id='chart7' style='width:100%'>";
	break;
    case 'chart8':
	$title="<font size=\"-1\"><b>Точки доступа Outdoor. ".$year."</b></font>";
	$chart="<img src='/includes/chart_img.php?id=3&start=01.01.".$year."&end=".date('m.d.Y')."&type=11' id='chart8' style='width:100%'>";
	break;
    case 'chart9':
	$title="<font size=\"-1\"><b>Точки доступа Outdoor. Недели.</b></font>";
	$chart="<img src='/includes/chart_img.php?id=2&start=".$start_week."&end=".date('m.d.Y')."&type=11' id='chart9' style='width:100%'>";
	break;
    case 'chart10':
	$title="<font size=\"-1\"><b>Точки доступа Outdoor. 7 дней.</b></font>";
	$chart="<img src='/includes/chart_img.php?id=1&start=".$start_now."&end=".date('m.d.Y')."&type=11' id='chart10' style='width:100%'>";
	break;
    case 'chart11':
	$title="<font size=\"-1\"><b>Абонентские сессии BRAS за сутки</b></font>";
	$chart="<img src=\"http://zabbix.tut.net/chart2.php?graphid=2906&width=840&height=200&period=86400\" id='chart11'>";
	break;
    case 'chart12':
	$title="<font size=\"-1\"><b>Количество ТД по районам (общ./откл.) ".date('d.m.Y',strtotime("last day"))."</b></font>";
	$chart="<img src=\"/includes/regap_aval_chart.php\" id='chart12'>";
	break;

    case 'chart13':
	$title="<font size=\"-1\"><b>Количество indoor ТД по районам (общ./откл.) ".date('d.m.Y',strtotime("last day"))."</b></font>";
	$chart="<img src=\"/includes/regap_in_chart.php\" id='chart13'>";
	break;
    case 'chart14':
	$title="<font size=\"-1\"><b>Количество outdoor ТД по районам (общ./откл.) ".date('d.m.Y',strtotime("last day"))."</b></font>";
	$chart="<img src=\"/includes/regap_out_chart.php\" id='chart14'>";
	break;
    case 'chart15':
	$title="<font size=\"-1\"><b>Внутренние ТД ".date('d.m.Y',strtotime("last day"))."</b></font>";
	$chart="<img src=\"/includes/charts/ap_in_chart.php\" id='chart15'>";
	break;
    case 'chart16':
	$title="<font size=\"-1\"><b>Внешние ТД ".date('d.m.Y',strtotime("last day"))."</b></font>";
	$chart="<img src=\"/includes/charts/ap_out_chart.php\" id='chart16'>";
	break;
    default: return false;
};
    $res=array($title,$chart);
    return $res;
}