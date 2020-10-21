<?php

namespace Modules\Financial\Models;

use App\Components\Helper;
use DB;
use Log;

class Requisites
{
    public $inited=false;

    public $bank='';
    public $city='';
    public $account='';
    public $inn='';
    public $kpp='';
    public $bik='';
    public $kor_acc='';
    public $inn_kpp='';

    public function init($bank='', $city='', $account='', $inn='', $kpp='', $bik='', $kor_acc='') {
        $this->bank = $bank;
        $this->city = $city;
        $this->account = $account;
        $this->inn = $inn;
        $this->kpp = $kpp;
        $this->bik = $bik;
        $this->kor_acc = $kor_acc;
        $this->inited = true;
    }

    public function initByDoc($ac_id) {
        try {
            $r = DB::connection('sqlsrv')->select("exec bill..print_docs 2, ?, 0", [$ac_id]);
            if (count($r)) {
                if (empty($r[0]->error)) {
                    $this->bank = Helper::cyr($r[0]->n1);
                    $this->city = Helper::cyr($r[0]->n2);
                    $this->account = $r[0]->n3;
                    $inn_kpp = iconv('cp1251', 'utf8', $r[0]->n4);
                    $this->inn_kpp = iconv('cp1251', 'utf8', $r[0]->n4);
                    if (stripos('ИНН', $inn_kpp) !== false) {
                        $inn_kpp = str_replace('ИНН', '', $inn_kpp);
                        $inn_kpp = str_replace('КПП', '', $inn_kpp);
                        preg_replace('\s+', ' ', $inn_kpp);
                        $inn_kpp = explode(' ', $inn_kpp);
                        $this->kpp = (int)$inn_kpp[0];
                        $this->inn = (int)$inn_kpp[1];
                    } else {
                        $inn_kpp = explode('\/', trim($inn_kpp));
                        $this->kpp = (int)$inn_kpp[0];
                        $this->inn = (int)$inn_kpp[1];
                    }
                    $this->bik = $r[0]->n5;
                    $this->kor_acc = $r[0]->n6;
                    $this->inited=true;
                } else {
                    Log::error('Init requisites request return error');
                    $this->inited=false;
                }
            } else {
                Log::info('Init requisites request return empty result');
                $this->inited=false;
            }
        } catch(\PDOException $e) {
            Log::error('Init requisites by doc EXCEPTION');
            $this->inited=false;
        }
    }

}
