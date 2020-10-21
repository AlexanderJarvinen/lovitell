<?php

namespace Modules\Financial\Models;

use App\Components\Helper;
use PDF;
use DB;
use Log;

class Document
{
    static $doctypes = [
        0 => 'Акт',
        1 => 'Счет',
        2 => 'Счет-фактура',
        3 => 'Пакет'
    ];

    static $dt = [
        0 => 'act',
        1 => 's',
        2 => 'sf'
    ];

    public $id = 0;
    public $ac_id = 0;
    public $customer = null;
    public $provider = null;
    public $type = 0;
    public $date = '';
    public $content = [];
    public $total_amount = 0;
    public $total_tax = 0;
    public $count = 0;
    public $str_sum = '';

    static function getDocs($date, $type=0, $customers_group_id=0, $start_ac_id=0, $end_ac_id=0) {
        $resp = [];
        try {
            $r = DB::connection('sqlsrv')->select("exec bill..print_docs 1, ?, ?, ?, ?, ?", [$type, $customers_group_id, $date, $start_ac_id, $end_ac_id]);
            if (empty($r[0]->error)) {
                foreach($r as $doc_row) {
                    if (isset($resp[$doc_row->ac_id]['documents'])) {
                        $resp[$doc_row->ac_id]['documents'][] = [
                            'id' => $doc_row->id,
                            'type' => $doc_row->type,
                            'date' => date('Y-m-d', strtotime($doc_row->param_date)),
                            'amount' => $doc_row->amount,
                            'sum' => $doc_row->sum_bill,
                            'tax' => $doc_row->tax_bill,
                            'balance' => $doc_row->balance
                        ];
                    } else {
                        $resp[$doc_row->ac_id] = [
                            'company' => iconv('cp1251', 'utf8', $doc_row->company),
                            'ac_id' => $doc_row->ac_id,
                            'email' => $doc_row->e_mail,
                            'documents' => [
                                [
                                    'id' => $doc_row->id,
                                    'type' => $doc_row->type,
                                    'date' => date('Y-m-d', strtotime($doc_row->param_date)),
                                    'amount' => $doc_row->amount,
                                    'sum' => $doc_row->sum_bill,
                                    'tax' => $doc_row->tax_bill,
                                    'balance' => $doc_row->balance
                                ]
                            ],
                        ];
                    }
                }
            } else {
                Log::error('Error return when getting docs');
            }
        } catch(\PDOException $e) {
            Log::error('DB EXCEPTION when getting docs');
        }
        return $resp;
    }

    public function __construct($id, $type, $date, $ac_id) {
        $this->id = $id;
        $this->type = $type;
        $this->date = date('d.m.Y', strtotime($date));
        $this->ac_id = $ac_id;
        $this->getDocInfo($ac_id, $date);
        $total_tax = 0;
        $total_amount = 0;
        $count = 0;
        try {
            $r = DB::connection('sqlsrv')->select("exec bill..print_docs 4, ?, ?, ?, ?", [$type, $id, $date, $ac_id]);
            if (empty($r[0]->error)) {
                $content =[];
                foreach($r as $k=>$doc_r) {
                    $content[] = [
                        'id' => $k,
                        'start_date' => date('d.m.Y', strtotime($doc_r->start_date)),
                        'end_date' => date('d.m.Y', strtotime($doc_r->end_date)),
                        'desk' => iconv('cp1251', 'utf8', $doc_r->desk),
                        'qty' => $doc_r->qty,
                        'amount' => round($doc_r->amount, 2),
                        'tax' => round($doc_r->tax, 2)
                    ];
                    $this->content = $content;
                    $total_amount += round($doc_r->amount, 2);
                    $total_tax += round($doc_r->tax, 2);
                    $count++;
                }
                $this->total_amount = $total_amount;
                $this->total_tax = $total_tax;
                $this->total = $this->total_tax+$this->total_amount;
                $this->count = $count;
                $this->str_sum = Helper::num2str($this->total);
            } else {
                Log::error('Error, when getting doc info');
                return null;
            }
        } catch (\PDOException $e) {
            Log::error('DB EXCEPTION when getting doc info');
            return null;
        }
    }

    public function getDocInfo($ac_id, $date=0) {
        $date = $date?$date:date('Y-m-d');
        $customer_model = new Customer();
        $customer_model->initByDoc($ac_id, $date);
        $this->customer = $customer_model;
        $provider_model = new Provider();
        $provider_model->initByDoc($ac_id);
        $this->provider = $provider_model;
    }

    public function getPDF(Document $document) {

    }

    public function send() {
        if (!empty($this->customer->email)) {
            if ($this->type == 0) {

            }
        }
    }
}
