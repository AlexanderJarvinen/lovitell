<?php

namespace App\Components;
use \Log;

class BusConnector {
    static function request($uri, $params)
    {
        Log::debug($uri);
        $param_string = '';
        foreach ($params as $k => $param) {
            $param_string .= $k . '=' . $param . '&';
        }
        Log::debug(config('services.esb.url') . '/' . $uri . '?api_version=' . config('services.esb.api') . '&' . $param_string);
        $curl = curl_init(config('services.esb.url') . '/' . $uri . '?api_version=' . config('services.esb.api') . '&' . $param_string);
        $options = array(
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_HTTPHEADER => array('Content-type: application/json'),
            CURLOPT_SSL_VERIFYPEER => false,
            CURLOPT_SSL_VERIFYHOST => false,
        );
        curl_setopt_array($curl, $options);
        $res = curl_exec($curl);
        Log::debug("RESULT:");
        Log::debug($res);
        Log::debug(curl_getinfo($curl));
        $res = json_decode($res);
        Log::debug(var_export($res, true));
        if (is_object($res) && is_object($res->result) && isset($res->result->metadata) && isset($res->result->metadata->result)) {
            if ($res->result->metadata->result == 1) {
                return [
                    'error' => 0,
                    'msg' => 'OK',
                    'data' => $res->result
                ];
            } else {
                Log::error('ESB Request error');
                Log::debug($uri, $params);
                return [
                    'error' => -1,
                    'msg' => $res->result->metadata->reason
                ];
            }
        } else {
            Log::error('ESB unexpected response');
            Log::debug($uri, $params);
            return [
                'error' => -2,
                'msg' => "Неожиданный ответ ESB"
            ];
        }
    }
}

