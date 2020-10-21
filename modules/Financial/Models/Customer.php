<?php

namespace Modules\Financial\Models;

use App\Components\Helper;
use App\Http\Requests\Request;
use DB;
use Log;

class Customer
{
    public $inited=false;

    public $is_comp=0;
    public $company='';
    public $zip=0;
    public $city='';
    public $region='';
    public $street='';
    public $house=0;
    public $body=0;
    public $apartment=0;
    public $agreement='';
    public $sex=0;
    public $last_name='';
    public $first_name='';
    public $second_name='';
    public $p_zip=0;
    public $p_city='';
    public $p_house=0;
    public $p_body=0;
    public $p_apartment=0;
    public $phone=0;
    public $email='';
    public $ac_id='';
    public $type=0;
    public $recv=null;

    public function initByDoc($ac_id, $date) {
        try {
            $r = DB::connection('sqlsrv')->select("exec bill..print_docs 3, ?, 0, ?", [$ac_id, $date]);
            if (count($r)) {
                if (empty($r[0]->error)) {
                    $this->is_comp=$r[0]->is_comp;
                    $this->company=iconv('cp1251', 'utf8', $r[0]->company);
                    $this->zip=(int)$r[0]->zip;
                    $this->city=((isset($r[0]->state) && $r[0]->state)?Helper::cyr($r[0]->state).', ':'').Helper::cyr($r[0]->city);
                    $this->region=Helper::cyr($r[0]->region);
                    $this->street=Helper::cyr($r[0]->street);
                    $this->house=Helper::cyr($r[0]->house);
                    $this->body=Helper::cyr($r[0]->body);
                    $this->apartment=Helper::cyr($r[0]->apartment);
                    $this->agreement=Helper::cyr($r[0]->agreement);
                    $this->sex=$r[0]->sex;
                    $this->last_name=$r[0]->last_name;
                    $this->first_name=$r[0]->first_name;
                    $this->second_name=$r[0]->second_name;
                    $this->p_zip=(int)$r[0]->p_zip;
                    $this->p_city=$r[0]->p_city;
                    $this->p_house=Helper::cyr($r[0]->p_house);
                    $this->p_body=Helper::cyr($r[0]->p_body);
                    $this->p_apartment=Helper::cyr($r[0]->p_apartment);
                    $this->phone=$r[0]->phone;
                    $this->email=$r[0]->e_mail;
                    $this->ac_id=$r[0]->ac_id;
                    $this->type=$r[0]->type;
                    $inn = $r[0]->n4;
                    $kpp = $r[0]->n6;
                    $account = explode('/', $r[0]->n3);
                    $this->recv = new Requisites();
                    $this->recv->init($r[0]->n1?Helper::cyr($r[0]->n1):'', $r[0]->n2?Helper::cyr($r[0]->n2):'', $account[0], $inn, $kpp, $r[0]->n5, isset($account[1])?$account[1]:'');
                    $this->inited = true;
                } else {
                    Log::error('Init customer request return error');
                    $this->inited=false;
                }
            } else {
                Log::info('Init customer request return empty result');
                $this->inited=false;
            }
        } catch(\PDOException $e) {
            Log::error('Init customer by doc EXCEPTION');
            $this->inited=false;
        }
    }

}
