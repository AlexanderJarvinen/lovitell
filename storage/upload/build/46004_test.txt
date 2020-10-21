<?php

echo $_SERVER['REMOTE_ADDR'];
$db = @mssql_connect('billing.lan.lealta.ru', 'www', 'aiskysrv98');

$version = mssql_query("exec bill..www_tv_get 4, 1");
print_r($version);
echo mssql_get_last_message();
while($row = mssql_fetch_assoc($version)) {
	print_r($row);
}

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

