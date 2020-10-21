<?php

namespace App;
use DB;
use Log;

class Report
{
	public $name;
	public $connection;
	public $is_init;

	public function __construct($name, $connection) {
		$this->name = $name;
		$this->connection = $connection;
		$this->is_init = true;
	}

	public function title() {
		switch($this->name) {
			case 'report_trouble_fin':
				return 'Инцеденты по финансовым ТТ';
		}
	}

	public function getData() {
		switch($this->name) {
			case 'report_trouble_fin':
				return $this->getreport_trouble_fin();
		}
	}

	public function getreport_trouble_fin() {
		$result = [];
		$r = DB::connection('sqlsrv')->select('exec pss..report_trouble_fin 0');
//		$r = mssql_query('pss..user_auth_', $this->connection);
		foreach($r as $row) {
			$row = (array) $row;
			$row['trouble_desk'] = iconv('cp1251', 'utf8', $row['trouble_desk']);
			$row['desk'] = iconv('cp1251', 'utf8', $row['desk']);
			$result[] = $row;
		}
		return $result;
	}

}
