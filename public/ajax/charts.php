<?php

header("content-type: application/json"); 
$array = array(rand(99,100),rand(90,100),rand(1,100),rand(1,100),rand(1,100),rand(1,100),rand(90,100),rand(1,100),rand(1,100),rand(1,100),rand(1,100),rand(1,100));

echo $_GET['callback']. '('. json_encode($array) . ')';

?>