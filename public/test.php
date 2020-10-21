<?php

$db = @mssql_connect('billing.lan.lealta.ru', 'www', 'fqHQFzqH9p5W');

echo "QUERY: exec pss..street_filter 0, Сосн"."<br>";
$version = mssql_query("exec bill..payment_dol 5, 0,0,0,0,0,3");
//$version = mssql_query("exec bill..route_group_get 0");
//$version = mssql_query("exec bill..inventory_get_list 1, '', '', '3,4,5,6'");
echo "RESULT:<br>";
while($row = mssql_fetch_assoc($version)) {
	print_r($row);
}
echo mssql_get_last_message();

// Clean up
mssql_free_result($version);
/*
try {
    $dbh = new PDO ("dblib:host=172.29.1.5;", "sbosov", "sbv10");
} catch (PDOException $e) {
    echo "error: " . $e->getMessage() . "\n";
    exit;
}

var_dump($dbh);

$dbh = null;*/

//0a9d091d-6faf-469f-82a0-191b24de22f8

