<?php

namespace Modules\Financial\Models;

use App\Http\Requests\Request;
use App\Components\Helper;
use DB;
use Log;

class Provider
{
    public $inited=false;

    public $n_desk='';
    public $f_desk='';
    public $address='';
    public $city='';
    public $phone1='';
    public $phone2='';
    public $phone3='';
    public $phone4='';
    public $phone5='';
    public $phone6='';
    public $recv=null;
    public $chief='';
    public $chief_base='';
    public $accountant='';
    public $accountant_base='';
    public $email='';

    public function initByDoc($ac_id, $cn_id=0, $type=1) {
        Log::debug("Provider $ac_id, $cn_id, $type");
        try {
            $r = DB::connection('sqlsrv')->select("exec bill..print_docs 2, ?, 0, null, ?, 0, 0, ?", [$ac_id, $type, $cn_id]);
            Log::debug($r);
            if (count($r)) {
                if (empty($r[0]->error)) {
                    $this->id=$r[0]->comp_id;
                    $this->n_desk=Helper::cyr($r[0]->n_desk);
                    $this->f_desk=Helper::cyr($r[0]->f_desk);
                    $this->address=Helper::cyr($r[0]->address);
                    $this->city=Helper::cyr($r[0]->city);
                    $this->phone1=$r[0]->phone1;
                    $this->phone2=$r[0]->phone2;
                    $this->phone3=$r[0]->phone3;
                    $this->phone4=$r[0]->phone4;
                    $this->phone5=$r[0]->phone5;
                    $this->phone6=$r[0]->phone6;
                    $this->chief=Helper::cyr($r[0]->chief);
                    $this->chief_base=Helper::cyr($r[0]->chief_base);
                    $this->accountant=Helper::cyr($r[0]->accountant);
                    $this->accountant_base=Helper::cyr($r[0]->accountant_base);
                    $inn_kpp = iconv('cp1251', 'utf8', $r[0]->n4);
                    $inn_kpp = str_replace('ИНН', '', $inn_kpp);
                    $inn_kpp = str_replace('КПП', '', $inn_kpp);
                    $inn_kpp = trim(preg_replace('/ +/',' ', $inn_kpp));
                    $inn_kpp = explode(' ', $inn_kpp);
                    $this->recv = new Requisites();
                    $this->recv->init(Helper::cyr($r[0]->n1), Helper::cyr($r[0]->n2), Helper::cyr($r[0]->n3), $inn_kpp[0], $inn_kpp[1], $r[0]->n5, $r[0]->n6);
                    $this->email = iconv('cp1251', 'utf8', $r[0]->e_mail);
                    $this->inited = true;
                } else {
                    Log::error('Init provider request return error');
                    $this->inited=false;
                }
            } else {
                Log::info('Init provider request return empty result');
                $this->inited=false;
            }
        } catch(\PDOException $e) {
            Log::error('Init customer by doc EXCEPTION');
            Log::debug($e->getMessage());
            $this->inited=false;
        }
    }

    public function getStamp($doctype=0) {
        $style = '';
        switch($this->id) {
            case 1:
                if ($doctype==2) {
                    $style = 'position: absolute; height: 150px; top: -50px; left: 0px;';
                } else {
                    $style = 'position: absolute; height: 150px; top: -50px; left: 100px;';
                }
                break;
            case 2:
                if ($doctype==2) {
                    $style = 'position: absolute; height: 150px; top: -45px; left: 0px;';
                } else {
                    $style = 'position: absolute; height: 150px; top: -45px; left: 130px;';
                }
                break;
            case 3:
                if ($doctype==2) {
                    //$style = 'position: absolute; height: 150px; top: -40px; left: 0px;';
                    $style = 'position: absolute; height: 150px; top: -15px; left: 0px;';
                } else {
                    $style = 'position: absolute; height: 150px; top: -45px; left: 130px;';
                    //$style = 'position: absolute; height: 150px; top: -25px; left: 130px;';
                }
                break;
            case 4:
                if ($doctype==2) {
                    //$style = 'position: absolute; height: 150px; top: -40px; left: 0px;';
                    $style = 'position: absolute; height: 150px; top: -15px; left: 0px;';
                } else {
                    $style = 'position: absolute; height: 150px; top: -45px; left: 130px;';
                    //$style = 'position: absolute; height: 150px; top: -25px; left: 130px;';
                }
                break;
        }
        return '<img src="'.Helper::img2base64(public_path().'/img/company'.$this->id.'_stamp.png').'" style="'.$style.'"/>';
    }

    public function getSign($doctype=0) {
        $style = '';
        switch($this->id) {
            case 1:
                if ($doctype==2) {
                    $style = 'position: absolute; height: 65px; top: -20px; left: 15px;';
                } else {
                    $style = 'position: absolute; height: 150px; top: -50px; left: 100px;';
                }
                break;
            case 2:
                if ($doctype==2) {
                    $style = 'position: absolute; height: 65px; top: -30px; left: 15px;';
                } else {
                    $style = 'position: absolute; height: 150px; top: -50px; left: 100px;';
                }
                break;
            case 3:
                if ($doctype==2) {
                    $style = 'position: absolute; height: 60px; top: -25px; left: 15px;';
                } else {
                    $style = 'position: absolute; height: 60px; top: -25px; left: 130px;';
                }
                break;
            case 4:
                if ($doctype==2) {
                    $style = 'position: absolute; height: 60px; top: -25px; left: 15px;';
                } else {
                    $style = 'position: absolute; height: 60px; top: -25px; left: 130px;';
                }
                break;
        }
        return '<img src="'.Helper::img2base64(public_path().'/img/company'.$this->id.'_sign.png').'" style="'.$style.'"/>';
    }

    public function getAccountantSign($doctype=0) {
        $img = '';
        if ($this->accountant == 'Климов А.О.') {
            if ($doctype==2) {
                $style = 'position: absolute; width: 130px; top: -40px; left: 0px;';
            } else {
                $style = 'position: absolute; width: 130px; top: -50px; left: 120px;';
            }
            $img = '<img src="'.Helper::img2base64(public_path().'/img/sign_klimov.png').'" style="'.$style.'"/>';
        } else if ($this->accountant == 'Миронова О.Г.') {
            if ($doctype==2) {
                $style = 'width: 100px; position: absolute; top: -40px; left: 0px;';
            } else {
                $style = 'width: 100px; position: absolute; top: -40px; left: 120px;';
            }
            $img = '<img src="'.Helper::img2base64(public_path().'/img/sign_mironova.png').'" style="'.$style.'"/>';
        } else if ($this->accountant == 'Дыман В.А.') {
            if ($doctype==2) {
                $style = 'width: 100px; position: absolute; top: -15px; left: 0px;';
            } else {
                $style = 'width: 100px; position: absolute; top: -15px; left: 120px;';
            }
            $img = '<img src="'.Helper::img2base64(public_path().'/img/sign_diman.png').'" style="'.$style.'"/>';
        }
        return $img;
    }

}
