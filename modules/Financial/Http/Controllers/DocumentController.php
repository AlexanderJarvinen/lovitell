<?php

namespace Modules\Financial\Http\Controllers;

use App\Components\Helper;
use Illuminate\Support\Facades\Log;
use Modules\Financial\Models\FinancialRights;
use Pingpong\Modules\Routing\Controller;
use Illuminate\Http\Request;
use Modules\Financial\Models\Document;
use Modules\Financial\Models\SendDocJobModel;
use Modules\Financial\Jobs\SendDocJob;
use App\Components\Menu\Menu;
use Auth;
use Excel;
use PDF;
use DB;
use Config;
use Mail;

class DocumentController extends Controller {

	public $menu;

	public function __construct(Menu $menu)
	{
		$this->menu=$menu;
		$this->middleware('auth');
	}

	public function index()
	{
		return view('modules.financial.documents', [
				'user' => Auth::user()
			]
		);
	}

	public function getDocs(Request $request)
	{
		$type = $request->input('type', 0);
		$customer_group = $request->input('customer_group', '');
		$date = $request->input('date', date('Y-m-d', strtotime('today')));
		$start_ac_id = $request->input('start_ac_id', 0);
		$end_ac_id = $request->input('end_ac_id', 0);
		$user = Auth::user();
		$job_model = new SendDocJobModel();
		$job_id = $job_model->initJob($date, 0, $type, $customer_group, $start_ac_id, $end_ac_id);
		$total = $job_model->total;
		$total_docs = $job_model->total_docs;
		return response()->json([
			'job_id' => $job_id,
			'total'  => $total,
			'total_docs' => $total_docs
		]);
	}

	public function exportJobDocs(Request $request, $job_id = 0) {
		if ($job_id) {
			$job_model = SendDocJobModel::find($job_id);
			$documents = $job_model->getDocumentsExport();
			return Excel::create('revision', function($excel) use($documents) {
				$excel->sheet('Export', function($sheet) use($documents) {
					$sheet->fromArray($documents);
				});
			})->export('xlsx');
		}

	}

	public function printDoc(Request $request, $type, $ac_id, $date, $id, $export=false)
	{
		$user = Auth::user();
		$model_rights = new FinancialRights();
		Log::debug('Document:');
		if (!$model_rights->canPrintDocs()) {
			return view('errors.403', [
				'user' => $user,
				'menu' => $this->menu
			], 403);
		}
		Log::debug("$type, $ac_id, $date, $id");
		Log::debug('Document:');
		$document = new Document($id, $type, $date, $ac_id);
		Log::debug('Document:');
		Log::debug(var_export($document, true));
		if ($document == null) {
			return view('errors.404', [
				'user' => $user,
				'menu' => $this->menu
			], 404);
		}
		if ($type == 0) {
			if ($export) {
				$pdf = PDF::loadView('modules.financial.template.act', ['document' => $document])->setPaper('a4', 'landscape');
				//$pdf->output();
				//$dom_pdf = $pdf->getDomPDF();
				//$canvas = $dom_pdf ->get_canvas();
				//$canvas->page_text(0, 0, "Page {PAGE_NUM} of {PAGE_COUNT}", config('dompdf.defines.DOMPDF_DEFAULT_FONT'), 8, array(0, 0, 0));
				return $pdf->download('act.pdf');
			} else {
				return view('modules.financial.template.act',
					[
						'document' => $document,
					]);
			}
		} else if ($type == 1) {
			if ($export) {
				$pdf = PDF::loadView('modules.financial.template.schet', ['document' => $document])->setPaper('a4', 'landscape');
				//$pdf->output();
				//$dom_pdf = $pdf->getDomPDF();
				//$canvas = $dom_pdf ->get_canvas();
				//$canvas->page_text(0, 0, "Page {PAGE_NUM} of {PAGE_COUNT}", config('dompdf.defines.DOMPDF_DEFAULT_FONT'), 8, array(0, 0, 0));
				return $pdf->download('schet.pdf');
			} else {
				return view('modules.financial.template.schet',
					[
						'document' => $document
					]);
			}
		} else if ($type == 2) {
			if ($export) {
				$pdf = PDF::loadView('modules.financial.template.schet-fact', ['document' => $document])->setPaper('a4', 'landscape');
				//$pdf->output();
				//$dom_pdf = $pdf->getDomPDF();
				//$canvas = $dom_pdf ->get_canvas();
				//$canvas->page_text(0, 0, "Page {PAGE_NUM} of {PAGE_COUNT}", config('dompdf.defines.DOMPDF_DEFAULT_FONT'), 8, array(0, 0, 0));
				return $pdf->download('schet-factura.pdf');
			} else {
				return view('modules.financial.template.schet-fact',
					[
						'document' => $document
					]);
			}
		} else if ($type == 4) {
			if ($export) {
				$pdf = PDF::loadView('modules.financial.template.receipt', ['document' => $document])->setPaper('a4', 'portrait');
				//$pdf->output();
				//$dom_pdf = $pdf->getDomPDF();
				//$canvas = $dom_pdf ->get_canvas();
				//$canvas->page_text(0, 0, "Page {PAGE_NUM} of {PAGE_COUNT}", config('dompdf.defines.DOMPDF_DEFAULT_FONT'), 8, array(0, 0, 0));
				return $pdf->download('kvitancia.pdf');
			} else {
				return view('modules.financial.template.receipt',
					[
						'document' => $document
					]);
			}
		}
	}

	public function printDocExport(Request $request, $type, $ac_id, $date, $id) {
		return $this->printDoc($request, $type, $ac_id, $date, $id, true);
	}

	public function sendDocuments(Request $request) {
		$job_id = $request->input('job_id');
		$model_rights = new FinancialRights();
		if (!$model_rights->canPrintDocs()) {
			return response(403);
		}
		if ($job_id) {
			$job = new SendDocJob($job_id, Auth::user());
			if ($job) {
				dispatch($job);
			}
		}
	}

	public function getJobLog(Request $request, $job_id, $start_date) {
		$job = SendDocJobModel::find($job_id);
		$log = $job->getJobLog($start_date);
		$job->log = $log;
		return response()->json($job);
	}

	public function getSendDocJobs(Request $request) {
		$model = new SendDocJobModel();
		$jobs = $model->getUserJobs();
		return response()->json($jobs);
	}

	public function getSendDocJobLog(Request $request, $job_id) {
		if ($job_id) {
			$model = SendDocJobModel::find($job_id);
			if ($model) {
				return response()->json($model->getJobLog());
			} else {
				return response(404);
			}
		}
	}

	public function sorry(Request $request) {
		$customers = DB::table('financial_send_documents_customers')
			->select('email')
			->where('job_id', 44)
			->where('state', 'SUCCESS')
			->groupBy('ac_id')
			->get();
		$mail_server = config('financial.mails.company_3.server');
		$mail_login = config('financial.mails.company_3.login');
		$mail_pass = config('financial.mails.company_3.pass');
		Config::set('mail.host', $mail_server);
		Config::set('mail.username', $mail_login);
		Config::set('mail.password', $mail_pass);
		foreach($customers as $customer) {
			echo $customer->email.'<br/>';
			try {
				if (Mail::send('modules.financial.mail.sorry', ['customer' => $customer], function ($message) use ($customer) {
					$message->from('accounting@H-telecom.net', 'ООО «Молния»');

					$message->to($customer->email)->subject('Отправка сопроводительных документов');
				})) {
					echo $customer->email." OK<br/>";
				} else {
					echo $customer->email." Ошибка отправки<br/>";
				}
			} catch(\Exception $e) {
				echo $customer->email." Непредвиденная ошибка<br/>";
				var_dump($e);
			}
		}
	}

	public function receipt()
	{
		return view('modules.financial.template.receipt');
	}
}