<?
$GLOBALS['cfg']['db']['billing']['server']	= 'billing';
$GLOBALS['cfg']['db']['billing']['database']	= 'pss';
$GLOBALS['cfg']['db']['billing']['login']	= 'mj';
$GLOBALS['cfg']['db']['billing']['password']	= 'goldwing8517';

$GLOBALS['BillingDB'] = new CMSSQLDatabase($GLOBALS['cfg']['db']['billing']);

if (!$GLOBALS['BillingDB']->Open()) echo "Can't connect to DB";
