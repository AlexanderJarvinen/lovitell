<?php

namespace Modules\Financial\Models;

use App\Components\Helper;
use DB;
use Log;
use Illuminate\Database\Eloquent\Model;

/**
 * Model class for sending documents job
 *
 * @parameter
 * @parameter
 *
 * @parent  Model
 * @package Module\Financial\Models
 */
class SendDocJobModel extends Model
{

    /**
     * @var string Main table for Eloquent model
     */
    public $table = 'financial_send_documents';


    /**
     * @var string Main table for Customers
     */
    public $customers_table = 'financial_send_documents_customers';

    /**
     * @var string addition table for documents for each customer
     */
    public $documents_table = 'financial_send_documents_documents';

    /**
     * @var array contents states, which jobs may be
     */
    public static $STATE=[
        'IDLE'=>'IDLE',
        'INPROGRESS'=>'INPROGRESS',
        'COMPLETE'=>'COMPLETE',
        'FAIL'=>'FAIL'
    ];

    public static $STEPSTATE=[
        'STARTED' => 'STARTED',
        'ADDED'=>'ADDED',
        'SUCCESS'=>'SUCCESS',
        'FAIL'=>'FAIL'
    ];

    /**
     * @param $date 'Y-m-d' Date for getting doc
     * @param $total integer total count of documents,
     * @param $type integer type of documents.
     *      @see Document::doctypes,
     * @param $customer_group_id integer,
     * @param $start_ac_id,
     * @param $end_ac_id
     * @return $id integer new job id
     */
    public function initJob($date, $total, $type=0, $customer_group_id=0, $start_ac_id=0, $end_ac_id=0) {
        $this->date=$date;
        $this->type=$type;
        $this->customer_group_id=$customer_group_id;
        $this->start_ac_id=$start_ac_id;
        $this->end_ac_id=$end_ac_id;
        $this->state=self::$STATE['IDLE'];
        if ($type != 5) {
            $this->desk = "Рассылка. Тип: " . Document::$doctypes[$type] . ", Дата: $date, Группа: $customer_group_id";
        } else {
            $this->desk = "Рассылка. Тип: Информационная рассылка, Дата: $date";
        }
        $this->save();
        Log::debug('Adding customers:');
        $this->addCustomers();
        return $this->id;
    }

    public function start() {
        $this->started_at=DB::raw('now()');
        $this->state=self::$STATE['INPROGRESS'];
        $this->save();
    }

    public function fail() {
        $this->stopped_at=DB::raw('now()');
        $this->state=self::$STATE['FAIL'];
        $this->save();
    }

    public function complete() {
        $this->stopped_at=DB::raw('now()');
        $this->state=self::$STATE['COMPLETE'];
        $this->save();
    }
    
    public function stepStart($ac_id) {
       $this->step($ac_id, self::$STEPSTATE['STARTED'], '');
    }

    public function stepSuccess($ac_id) {
        $this->step($ac_id, self::$STEPSTATE['SUCCESS'], 'OK');
    }
    public function stepFail($ac_id, $msg) {
        $this->step($ac_id, self::$STEPSTATE['FAIL'], $msg);
    }

    public function step($ac_id, $state, $msg) {
        Log::info('Job '.$this->id.', doc_id:'.$ac_id.' state: '.$state);
        DB::table($this->customers_table)
            ->where(['ac_id' => $ac_id])
            ->where(['job_id' => $this->id])
            ->update([
                'state' => $state,
                'msg' => $msg
            ]);
    }

    public function addCustomers() {
        if ($this->type != 5) {
            $customers = Document::getDocs($this->date, $this->type, $this->customer_group_id, $this->start_ac_id, $this->end_ac_id);
        } else {
            $customers = Document::getInfoList();
        }
        $resp = [];
        $total = 0;
        $total_docs = 0;
        foreach($customers as $k=>$customer) {
            $customer_id = DB::table($this->customers_table)->insertGetId([
                'job_id' => $this->id,
                'ac_id' => $customer['ac_id'],
                'company' => $customer['company'],
                'email' => $customer['email'],
                'text' => isset($customer['text'])?$customer['text']:'',
                'state' => self::$STEPSTATE['ADDED'],
                'accessed_at' => DB::raw('now()'),
            ]);
            if (isset($customer['documents'])) {
                foreach ($customer['documents'] as $document) {
                    DB::table($this->documents_table)->insert([
                        'doc_id' => Helper::cyr($document['id']),
                        'customer_id' => $customer_id,
                        'type' => $document['type'],
                        'date' => $document['date'],
                        'amount' => $document['amount'],
                        'sum' => $document['sum'],
                        'tax' => $document['tax'],
                        'balance' => $document['balance']
                    ]);
                    $total_docs++;
                }
            }
            $total++;
        }
        $this->total = $total;
        $this->total_docs = $total_docs;
        $this->save();
    }

    public function getCustomers() {
        $customers = [];
        $customers = DB::table($this->customers_table)
            ->where('job_id', $this->id)
            ->get();
        foreach($customers as $k=>$customer) {
            $customers[$k]->documents = $this->getDocuments($customer->id);
        }
        return $customers;
    }

    public function getDocuments($customer_id) {
        return DB::table($this->documents_table)
            ->where('customer_id', $customer_id)
            ->get();
    }

    public function getDocumentsExport() {
        $customers = $this->getCustomers();
        $resp = [];
        foreach($customers as $k=>$customer) {
            foreach($customer->documents as $doc)
            $resp[] = [
                'Компания' => $customer->company,
                'Номер договора' => $customer->ac_id,
                'Номер документа' => $doc->doc_id,
                'Тип' => Document::$doctypes[$doc->type],
                'Дата документа' => date('Y-m-d', strtotime($doc->date)),
                'Email' => $customer->email,
                'Состояние' => $customer->state,
                'Сообщение' => $customer->msg
            ];
        }
        return $resp;
    }

    public static function getUserJobs($uid=0) {
        if ( $uid != 0) {
            return self::where('uid', $uid)->get();
        } else {
            return self::get();
        }
    }

    public static function getJobDetails($job_id, $uid, $array=false) {
        if ($array) {
            $result = DB::table('inventory_change_template_log')
                ->where('job_id', $job_id)
                ->get();
            foreach($result as $key=>$row) {
                $result[$key] = (array) $row;
            }
            return $result;
        } else {
            return DB::table('inventory_change_template_log')
                ->where('job_id', $job_id)
                ->get();
        }
    }

    public function getJobLog($start_date) {
        if ($this->id) {
            date_default_timezone_set('Europe/Moscow');
            return DB::table($this->customers_table)
                ->where('job_id', $this->id)
                ->where('accessed_at', '>=', date('Y-m-d H:i:s', $start_date))
                ->where('state', '<>', self::$STEPSTATE['ADDED'])
                ->get();
        } else {
            return [];
        }
    }

}
