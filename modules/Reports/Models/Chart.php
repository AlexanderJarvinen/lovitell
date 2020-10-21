<?php

namespace Modules\Reports\Models;

use App\Components\Helper;
use DB;
use Log;

class Chart
{

	public $title;
	public $url;

	public function __construct($name) {
		$this->name = $name;
		switch($name) {
			case 'proceeds':
				$this->title = 'Выручка с НДС';
				break;
			case 'proceeds-groups':
				$this->title = 'Начисления по группам';
				break;
			case 'active':
				$this->title = 'Активные абоненты';
				break;
			case 'arrears':
				$this->title = 'Динамика задолженности';
				break;
			case 'arrears-lealta':
				$this->title = 'Динамика задолженности по бренду Леальта';
				break;
			case 'arrears-c2':
				$this->title = 'Динамика задолженности по бренду C2free';
				break;
			case 'arrears-lovit':
				$this->title = 'Динамика задолженности по бренду Lovit';
				break;
			case 'arrears-molnia':
				$this->title = 'Динамика задолженности по бренду Молния';
				break;

		}
	}

	public function getTitle() {
		return $this->title;
	}

}
