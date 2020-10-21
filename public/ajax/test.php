<?
print "111";
require('db.php');

$numErrorConnections=5;
$_SESSION['login'] = 'smirnova';
$_SESSION['password'] = 'tusya';
while (!($db = @mssql_connect($ip, $_SESSION['login'], $_SESSION['password'])) && $numErrorConnections--) sleep(0.5);
mssql_select_db ("bill", $db);
#$result = mssql_query("exec report_avaible 0", $db);
$result = mssql_query("exec pss..create_menu 0", $db);

while ($row = mssql_fetch_array($result)){
    print "<br>";
    print iconv('cp1251','utf8',$row['desk']);
}

?>