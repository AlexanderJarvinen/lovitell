<?php

namespace Modules\Inventory\Http\Controllers;

use Modules\Inventory\Models\Inventory;
use Modules\Inventory\Models\InventoryJobModel;
use Modules\Inventory\Models\InventoryRights;

use Modules\Inventory\Models\TemplateJobModel;
use Modules\Inventory\Models\FirmwareJobModel;

use Pingpong\Modules\Routing\Controller;
use Illuminate\Http\Request;
use App\Components\Menu\Menu;
use Auth;
use Log;
use Excel;

class JobController extends Controller
{
	//
	public function __construct(Menu $menu)
	{
		$this->middleware('auth');
	}

	public function getJobs(Request $request, $type, $address_id=0)
	{
		$user = Auth::user();
		$rights = new InventoryRights();
		switch($type) {
			case 'all':
				if ($rights->canViewAllJobs()) {
					$jobs = InventoryJobModel::getUserJobs($address_id);
				} else {
					$jobs = InventoryJobModel::getUserJobs($address_id, $user->id);
				}
				break;
			case 'template':
				if ($rights->canViewAllJobs()) {
					$jobs = TemplateJobModel::getUserJobs($address_id);
				} else {
					$jobs = TemplateJobModel::getUserJobs($address_id, $user->id);
				}
				break;
			case 'firmware':
				if ($rights->canViewAllJobs()) {
					$jobs = FirmwareJobModel::getUserJobs($address_id);
				} else {
					$jobs = FirmwareJobModel::getUserJobs($address_id, $user->id);
				}
				break;
		}
		return response()->json($jobs);
	}

	public function getJobs2(Request $request)
	{
		$user = Auth::user();
		$rights = new InventoryRights();
		$filters = $request->input('filters', null);
		if ($filters) {
			$filters = json_decode($filters, true);
			if (!empty($filters['onlyMy'])) {
				$filters['uid'] = $user->id;
			}
		}
		$jobs = InventoryJobModel::getJobs($filters);
		return response()->json($jobs);
	}

	public function getJobDetails(Request $request, $type, $job_id, $export=false) {
		$user = Auth::user();
		if (!$export) {
			switch($type) {
				case 'template':
					$details = TemplateJobModel::getJobDetails($job_id, $user->id);
			}
			return response()->json($details);
		} else {
			switch($type) {
				case 'template':
					$details = TemplateJobModel::getJobDetails($job_id, $user->id, true);
			}
			Log::debug($details);
			return Excel::create('change_template', function($excel) use($details) {
				$excel->sheet('Result', function($sheet) use($details) {
					$sheet->fromArray($details);
				});
			})->export('xlsx');
		}
	}

	public function getJobLog(Request $request, $type, $job_id, $start_date) {
		switch($type) {
			case 'template':
				$job = TemplateJobModel::find($job_id);
				$log = TemplateJobModel::getJobLog($job_id, $start_date);
				$job->log = $log;
				break;
		}
		return response()->json($job);
	}

	public function stopJob(Request $request, $type, $job_id) {
		switch($type) {
			case 'template':
				$job = TemplateJobModel::find($job_id);
				$job->stop();
		}
		return response()->json($job);
	}

}
