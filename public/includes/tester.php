<?
include $_SERVER['DOCUMENT_ROOT']."/class/db.php";
include $_SERVER['DOCUMENT_ROOT']."/class/charts.php";


$login = 'mj';
$password = 'goldwing8517';

    $mssql = new sybase();
    $mssql->login  = $login;
    $mssql->password = $password;
    $mssql->connect();

    $charts = new charts();

    //var_dump($mssql->get_region());
    print "<pre>";
    #var_dump($mssql->get_all_ap());
    #var_dump($mssql->get_region());
    
    var_dump($mssql->get_all_off_ap());
    print "</pre>";

    
?>