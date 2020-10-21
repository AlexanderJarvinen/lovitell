<?php

return [
	'name' => 'Inventory',

	'ap_config_change_trying' => 3,

	'firmware_path' => 'upload/firmwares',

	'tools' => [
		'apcheck' => 'python '.base_path('/modules/Inventory/Components/APSetup/bin/apsetup/compare.py'),
		'apsetup' => 'python '.base_path('/modules/Inventory/Components/APSetup/bin/apsetup/webapsetup.py'),
		'apupdate' => 'python '.base_path('/modules/Inventory/Components/APSetup/bin/apsetup/webupdate.py')
	]
];