<?php

namespace Modules\Commercial\Models;

use App\Components\Brand;
use App\Components\Helper;
use App\Http\Requests\Request;
use DB;
use Log;

class Client
{
    public $client_id=0;
    public $inited=false;
    public $name='';
    public $reg_date='';
    public $ac_id=0;
    public $password='';
    public $balance=0;
    public $phone='';
    public $service_status='';
    public $ac_status='';
    public $address=[];
    public $is_comp=false;

    public function __construct($client_id) {
        $this->client_id = $client_id;
    }

    public function init() {
        if ($this->client_id) {
            $r = DB::connection('sqlsrv')->select("exec pss..get_client_desk 1, 'sbosov', ?", [$this->client_id]);
            if (isset($r[0]) && empty($r[0]->error)) {
                $this->inited = true;
                $this->name = Helper::cyr($r[0]->client);
                $this->ac_id = $r[0]->ac_id;
                $this->phone = $r[0]->phone;
                $this->service_status = 'Лок';
                $this->ac_status = 'Клиент';
            }
        }
    }

    public static function getClients($params, $page=1, $line_on_page=9999) {
        $offset = ($page-1)*$line_on_page;
        $fetch = $line_on_page;
        Log::debug('getClietns');
        $resp = [
            'page' => $page,
            'total_rows' => 0
        ];
        $data = [];
        try {
            $params['region_id'] = isset($params['region_id']) ? $params['region_id'] : '';
            $params['type_of_object'] = isset($params['type_of_object']) ? $params['type_of_object'] : '';
            $params['address_id'] = isset($params['address_id']) ? $params['address_id'] : '';
            $params['street'] = isset($params['street']) ? $params['street'] : '';
            $params['apartment'] = isset($params['apartment']) ? $params['apartment'] : '';
            $params['agree_num'] = isset($params['agree_num']) ? $params['agree_num'] : '';
            $params['name'] = isset($params['name']) ? $params['name'] : '';
            $params['cdate'] = isset($params['cdate']) ? $params['cdate'] : '06.30.1971';
            $params['pdate'] = isset($params['pdate']) ? $params['pdate'] : '06.30.2071';
            $params['client_id'] = isset($params['client_id']) ? $params['client_id'] : '';
            $params['order'] = isset($params['order']) ? $params['order'] : 'id';
            $params['is_comp'] = isset($params['is_comp']) ? $params['client_id'] : 0;
            $r = DB::connection('sqlsrv')->select("exec pss..get_address_client_list 1,
                '',
                :region_id,
                :type_of_object,
                :address_id,
                :street,
                :apartment,
                :agree_num,
                :name,
                :cdate,
                :pdate,
                :client_id,
                :order,
                :is_comp", $params
            );
            foreach($r as $client_row) {
                $data[] = [
                    'id' => $client_row->id,
                    'status' => Helper::cyr($client_row->desk),
                    'street' => Helper::cyr($client_row->street),
                    'house' => Helper::cyr($client_row->house),
                    'body' => $client_row->body,
                    'client' => Helper::cyr($client_row->client),
                    'phone' => Helper::cyr($client_row->phone),
                    'address_id' => $client_row->address_id,
                    'date' => $client_row->date,
                    'started' => $client_row->started,
                    'ac_id' => $client_row->ac_id,
                    'is_comp' => $client_row->is_comp,
                    'entrance' => $client_row->entrance,
                    'floor' => $client_row->floor,
                    'opened' => $client_row->opened,
                    'service' => $client_row->clients,
                    'salesman' => Helper::cyr($client_row->salesman),
                    'address_desk' => Helper::cyr($client_row->address_desk)
                ];
                $resp['data'] = $data;
                $resp['total_rows'] = $client_row->rows_qty;
            }
        } catch(\PDOException $e) {
            Log::error('getClients exception');
            Log::debug($e->getMessage());
        }
        return $resp;
    }

    public static function searchClients($page=1, $line_on_page=9999, $params) {
        $offset = ($page-1)*$line_on_page;
        Log::debug('searchClients');
        Log::debug($params);
        $params['offset'] = $offset;
        $params['line_on_page'] = $line_on_page;
        $params['mobile_no'] = isset($params['mobile_no'])?$params['mobile_no']:null;
        $params['phone'] = isset($params['phone'])?$params['phone']:null;
        $params['company'] = isset($params['company'])?Helper::cyr1251($params['company']):null;
        $params['ac_id'] = isset($params['ac_id'])?$params['ac_id']:null;
        $params['client_id'] = isset($params['client_id'])?$params['client_id']:null;
        $params['city'] = isset($params['city'])?Helper::cyr1251($params['city']):null;
        $params['region'] = isset($params['region'])?Helper::cyr1251($params['region']):null;
        $params['street'] = isset($params['street'])?Helper::cyr1251($params['street']):null;
        $params['build'] = isset($params['build'])?$params['build']:null;
        $params['apartment'] = isset($params['apartment'])?$params['apartment']:null;
        $params['address_id'] = isset($params['address_id'])?$params['address_id']:null;
        $resp = [
            'page' => $page,
            'total_rows' => 0
        ];
        $data=[];
        $i=0;
        $ac_id = $params['ac_id'];
        $client_id = $params['client_id'];
        if (($params['mobile_no'] || $params['phone'] || $params['company'] || $params['city']) && ($params['ac_id'] || $params['client_id'])) {
            $params['ac_id'] = null;
            $params['client_id'] = null;
        }
        try {
            $r = DB::connection('sqlsrv')->select("exec pss..find_result 0,
                :offset,
                :line_on_page,
                :mobile_no,
                :phone,
                :company,
                :ac_id,
                :client_id,
                :city,
                :region,
                :street,
                :build,
                :apartment,
                :address_id",
                $params);
            foreach($r as $id => $client_row) {
                $data[] = [
                    'id' => $i++,
                    'true_client_id' => $client_row->client_id?$client_row->client_id:$client_row->ac_id,
                    'r_type' => $client_row->r_type,
                    'ac_id' => $client_row->ac_id,
                    'brand_id' => $client_row->brand_id,
                    'brand_descr' => Brand::idToDescr($client_row->brand_id),
                    'client_id' => $client_row->client_id,
                    'client' => Helper::cyr($client_row->company),
                    'client_state_desk' => Helper::cyr($client_row->client_state_desk),
                    'city' => Helper::cyr($client_row->city),
                    'region' => Helper::cyr($client_row->region),
                    'street' => Helper::cyr($client_row->street),
                    'house' => Helper::cyr($client_row->house),
                    'body' => Helper::cyr($client_row->body),
                    'entrance' => $client_row->entrance,
                    'floor' => Helper::cyr($client_row->floor),
                    'apartment' => Helper::cyr($client_row->apartment),
                    'phone' => Helper::cyr($client_row->phone),
                    //'address_id' => $client_row->address_id,
                    'started' => $client_row->started,
                    'ended' => $client_row->ended,
                    'service_kind' => $client_row->service_kind,
                    'service_kind_desk' => Helper::cyr($client_row->service_kind_desk),
                    'state' => Helper::cyr($client_row->state),
                    'address_type' => Helper::cyr($client_row->address_type_seach_desk),
                    'mobile_no'=>Helper::cyr($client_row->mobile_no),
                    'agreement'=>Helper::cyr($client_row->agreement),
                    'group'=>$client_row->total_qty > 1,
                    'expanded' => $client_row->client_id == $params['client_id'] && $client_row->ac_id == $params['ac_id']
                    //'prefix' => $client_row->prefix
                ];
                if ($client_row->client_id == $client_id && $client_row->ac_id == $ac_id) {
                    $params['ac_id'] = $ac_id;
                    $sub_req = [
                        'offset' => 0,
                        'line_on_page' => 9999,
                        'ac_id' => $ac_id,
                        'client_id' => $params['client_id']
                    ];
                    Log::debug("exec pss..find_result 0,
                        :offset,
                        :line_on_page,
                        NULL,
                        NULL,
                        NULL,
                        :ac_id,
                        :client_id");
                    $subrows = DB::connection('sqlsrv')->select("exec pss..find_result 0,
                        :offset,
                        :line_on_page,
                        NULL,
                        NULL,
                        NULL,
                        :ac_id,
                        :client_id", $sub_req);
                    foreach($subrows as $k=>$subclient) {
                        if ($k==0) continue;
                        $data[] = [
                            'id' => $i++,
                            'true_client_id' => $subclient->client_id?$subclient->client_id:$subclient->ac_id,
                            'r_type' => $subclient->r_type,
                            'ac_id' => $subclient->ac_id,
                            'brand_id' => $subclient->brand_id,
                            'brand_descr' => Brand::idToDescr($subclient->brand_id),
                            'client' => Helper::cyr($subclient->company),
                            'city' => Helper::cyr($subclient->city),
                            'region' => Helper::cyr($subclient->region),
                            'street' => Helper::cyr($subclient->street),
                            'house' => Helper::cyr($subclient->house),
                            'body' => Helper::cyr($subclient->body),
                            'entrance' => $subclient->entrance,
                            'floor' => Helper::cyr($subclient->floor),
                            'apartment' => Helper::cyr($subclient->apartment),
                            'phone' => Helper::cyr($subclient->phone),
                            'client_id' => $subclient->client_id,
                            //'address_id' => $subclient->address_id,
                            'started' => $subclient->started,
                            'ended' => $subclient->ended,
                            'service_kind' => $subclient->service_kind,
                            'service_kind_desk' => Helper::cyr($subclient->service_kind_desk),
                            'state' => Helper::cyr($subclient->state),
                            'address_type' => Helper::cyr($subclient->address_type_seach_desk),
                            'mobile_no'=>Helper::cyr($subclient->mobile_no),
                            'group'=>$subclient->total_qty != 0,
                            'expanded' => false,
                            'subrows' => true
                            //'prefix' => $subclient->prefix
                        ];
                    }
                }
                $resp['total_rows'] = $client_row->rows_qty;
            }
            $resp['data'] = $data;
            return $resp;
        } catch (\PDOException $e) {
            Log::error('searchClients exception');
            Log::debug($e->getMessage());
        }
    }

    public function searchSameClient($search_string, $ac_id, $client_id) {
        try {
            $r = DB::connection('sqlsrv')->select("exec pss..find_result 0, ?, ?, 0, 99999, ?", [$search_string, $ac_id, $client_id]);
        } catch(\PDOException $e) {

        }
    }

}
