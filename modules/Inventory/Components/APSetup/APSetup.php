<?php

namespace Modules\Inventory\Components\APSetup;

use Log;
use Modules\Inventory\Models\Equipment;

/**
 * @todo move script path's to config
 */

class APSetup {

    public $state=0;
    public $store_raw=false;
    public $name_list=[];
    public $source_list=[];
    public $mac_table=[];
    public $ping_table=[];
    public $port_table=[];
    public $data=[];
    public $raw_data=null;

    public static $port_status = [
        0 => 'Undef',
        1 => 'Up',
        2 => 'Down'
    ];

    public static function getErrorMsg($error_code=-1) {
        switch($error_code) {
            case 1:
            case 5:
            case 6:
            case 10:
            case 11:
            case 16:
            case 15:
            case 23:
              return "Непредвиденная ошибка/исключение (".$error_code.")";
            case 7:
            case 8:
            case 14:
            case 18:
                return "Ошибка файла конфигурации (".$error_code.")";
            case 2:
            case 12:
                return "Неправильная строка конфигурации (".($error_code).")";
            case 3:
                return "Логин для ТД не найден (".($error_code).")";
            case 4:
                return "Пароль для ТД не найден (".($error_code).")";
            case 9:
                return "Не удалось определить версию ТД (".$error_code.")";
            case 19:
                return "Ошибка обновления прошивки (".$error_code.")";
            case 13:
            case 17:
            case 20:
            case 22:
                return "Модель/версия ТД не поддерживается (".$error_code.")";
            default:
                return "Непредвиденная ошибка ".($error_code);
        }
    }

    public function __construct(Array $name_list, Array $source_list, $store_raw=false) {
        $this->name_list   = $name_list;
        $this->source_list = $source_list;
        if (is_array($this->name_list) &&
            is_array($this->source_list) &&
            count($this->name_list) &&
            count($this->source_list)) {
            $this->state=1;
            $this->store_raw=$store_raw;
            Log::debug($name_list);
            $this->getMacList();
        }
    }

    public function parseAndInit($data) {
        $data = json_decode($data, true);
        $this->data = $data;
        Log::debug($data);
        if (isset($data['ping_stat'])) {
            $this->ping_table = $data['ping_stat'];
        }
        if (isset($data['sw_data']) && is_array($data['sw_data'])) {
            foreach($data['sw_data'] as $sw) {
                if (isset($sw['ports']) && is_array($sw['ports'])) {
                        if ($sw['ports']['mac_table'] && is_array($sw['ports']['mac_table'])) {
                            foreach($sw['ports']['mac_table'] as $k=>$port) {
                                if ($k < 25) {
                                    foreach ($port as $mac_in_port) {
                                        $this->mac_table[] = [
                                            'mac' => strtolower($mac_in_port),
                                            'source' => $sw['name'],
                                            'source_ip' => $sw['ip'],
                                            'source_iface' => $k
                                        ];
                                    }
                                }
                            }
                        }
                        if (isset($sw['ports']['mac_table']) && is_array($sw['ports']['mac_table'])) {
                            foreach($sw['ports']['port_status'] as $n=>$port_status) {
                                $this->port_table[$sw['ip']][$n] = $port_status;
                            }
                        }
                }
            }
            $this->state = 2;
        }
        Log::debug($this->mac_table);
    }

    public function getMacList()
    {
        if ($this->state<1) return '';
        $model = new Equipment();
        Log::debug(current($this->name_list));
        $community = $model->getCommunity(current($this->name_list));
        $raw_data = '';
        if ($community != '') {
            $params = [
                'mode' => "get_MACs",
                'sw_ip' => $this->source_list,
                'read' => $community
            ];
            try {
                Log::debug("python ".__DIR__."/bin/apsetup/compare.py -j '" . json_encode($params,JSON_HEX_APOS) . "'");
                $raw_data = shell_exec("python ".__DIR__."/bin/apsetup/compare.py -j '" . json_encode($params, JSON_HEX_APOS) . "'");
            } catch (\Exception $e) {
                Log::error($e);
            }
            if ($this->store_raw) {
                $this->raw_data = $raw_data;
            }
            $this->parseAndInit($raw_data);
        }
    }

    public function pingMac($ip) {
        return isset($this->ping_table[$ip])? $this->ping_table[$ip]:'N/F';
    }

    public function getMacsForPort($source_ip, $port) {
        $res = [];
        if (isset($this->data['sw_data']) && is_array($this->data['sw_data'])) {
            foreach($this->data['sw_data'] as $sw) {
                if ($sw['ip'] == $source_ip) {
                    if (isset($sw['ports']) && isset($sw['ports']['mac_table'][$port])) {
                        $res = $sw['ports']['mac_table'][$port];
                    }
                }
            }
        }
        Log::debug($res);
        return $res;
    }

    public function checkMac($mac, $ip, $source_ip, $port) {
        Log::debug('check '.$mac.', '.$source_ip.', '.$port);
        $port_status = self::$port_status[isset($this->port_table[$source_ip])? $this->port_table[$source_ip][$port]:0];
        $keys = array_keys(array_column($this->mac_table, 'mac'), strtolower($mac));
        if (count($keys) == 1) {
            if ($this->mac_table[$keys[0]]['source_ip'] == $source_ip) {
                if ($this->mac_table[$keys[0]]['source_iface'] == $port) {
                    $ping = $this->pingMac($ip);
                    if ($ping!='Error') {
                        $resp = [
                            'error' => 0,
                            'msg' => 'Ok',
                            'ping' => $ping,
                            'port_status' => $port_status
                        ];
                    } else {
                        $resp = [
                            'error' => 8,
                            'msg' => 'Устройство не отвечает на ping',
                            'ping' => $ping,
                            'port_status' => $port_status
                        ];
                    }
                } else {
                    $resp =[
                        'error' => 2,
                        'msg' => 'Устройство найдено на другом порту. Найденый порт: '.$this->mac_table[$keys[0]]['source_iface'],
                        'ping' => $this->pingMac($ip),
                        'port_status' => $port_status,
                        'ports' => strtolower(json_encode($this->getMacsForPort($source_ip, $port)))
                    ];
                }
            } else {
                $resp = [
                    'error' => 20,
                    'msg' => 'Устройство найдено на другом коммутаторе. Найденый коммутатор: '.$this->name_list[$this->mac_table[$keys[0]]['source_ip']].'('.$this->mac_table[$keys[0]]['source_iface'].')',
                    'ping' => $this->pingMac($ip),
                    'port_status' => $port_status,
                    'ports' => strtolower(json_encode($this->getMacsForPort($source_ip, $port)))
                ];
            }
        } else if (count($keys)>1) {
            $found=false;
            $source_list = '';
            foreach($keys as $key) {
                $source_list .= $this->name_list[$this->mac_table[$key]['source_ip']].'('.$this->mac_table[$key]['source_iface'].') ';
                if ($this->mac_table[$key]['source_ip'] == $source_ip) {
                    if ($this->mac_table[$key]['source_iface'] == $port) {
                        $resp = [
                            'error' => 0,
                            'msg' => 'Другие коммутаторы:' . $source_list,
                            'ping' => $this->pingMac($ip),
                            'port_status' => $port_status,
                        ];
                        $found = true;
                    }
                } else {
                    if ($this->mac_table[$key]['source_iface'] == $port) {
                        $resp = [
                            'error' => 21,
                            'msg' => 'Устройство найдено на другом порту и на других коммутаторах:' . $source_list,
                            'ping' => $this->pingMac($ip),
                            'port_status' => $port_status,
                            'ports' => json_encode($this->getMacsForPort($source_ip, $port))
                        ];
                        $found = true;
                    }
                }
            }
            if (!$found) {
                $resp = [
                    'error' => 30,
                    'msg' => 'MAC устройства не обнаружен на указанном коммутаторе, но найден на других:'.$source_list,
                    'ping' => $this->pingMac($ip),
                    'port_status' => $port_status
                ];
            }
        } else {
            $resp = [
                'error' => 31,
                'msg' => 'MAC устройства не обнаружен на коммутаторах для данного дома',
                'ping' => $this->pingMac($ip),
                'port_status' => $port_status,
                'ports' => strtolower(json_encode($this->getMacsForPort($source_ip, $port)))
            ];
        }
        Log::debug($resp);
        return $resp;
    }

    public static function getAPInfo($ip, $login='', $pwd='', $status='new') {
        if (trim($login) && trim($pwd)) {
            $params = [
                'ip' => $ip,
                'login' => trim($login),
                'password' => trim($pwd)
            ];
        } else {
            $params = [
                'ip' => $ip,
                'status' => $status
            ];
        }
        try {
            Log::debug("python ".__DIR__."/bin/apsetup/webapsetup.py '" . json_encode($params) . "'");
            $raw_data = shell_exec("python ".__DIR__."/bin/apsetup/webapsetup.py '" . json_encode($params) . "'");
        } catch  (\Exception $e) {
            Log::error($e);
            return false;
        }
        Log::debug($raw_data);
        $data = json_decode($raw_data);
        if (isset($data->status) && $data->status == 'ok') {
            return [
                'error' => 0,
                'msg' => 'OK',
                'ip_addr' => $data->ip,
                'model' => $data->model,
                'fw' => $data->fw
            ];
        } elseif(isset($data->err_code)) {
            return [
                'error' => $data->err_code,
                'msg' =>self::getErrorMsg($data->err_code)
            ];
        } else {
            return [
                'error' => -1,
                'msg' => 'Непредвиденная ошибка при определении версии'
            ];
        }
    }

    public static function changeTemplate($ip, $template_id, $template='', $login='', $pwd='', $status='new') {
        Log::debug($template);
        if (trim($login) && trim($pwd)) {
            $params = [
                'ip' => $ip,
                'login' => trim($login),
                'password' => trim($pwd)
            ];
        } else {
            $params = [
                'ip' => $ip,
                'status' => $status
            ];
        }
        $params['fw'] = $template_id;
        $params['config'] = preg_replace('/  +/', ' ', preg_replace('/\/\/.*/','', str_replace(array("\r\n", "\r"), "\n", $template)));
        Log::debug(var_export($params, true));
        Log::debug("python ".__DIR__."/bin/apsetup/webapsetup.py '" . json_encode($params, JSON_HEX_APOS) . "'"); 
        try {
            $raw_data = shell_exec("python ".__DIR__."/bin/apsetup/webapsetup.py '" . json_encode($params, JSON_HEX_APOS) . "'");
        } catch  (\Exception $e) {
            Log::error($e);
            return [
                'error' => -1,
                'msg' => 'Apsetup start exception'
            ];
        }
        Log::debug($raw_data);
        $result = json_decode($raw_data);
        if (isset($result->status) && $result->status == 'ok') {
            return [
                'error' => 0,
                'msg' => 'OK'
            ];
        } else if (isset($result->status)) {
            return [
                'error' => $result->err_code,
                'msg' => self::getErrorMsg($result->err_code)
            ];
        } else {
            return [
                'error' => -2,
                'msg' => 'Непредвиденная ошибка'
            ];
        }
    }

    public static function startAPScan($address_id) {
        Log::debug("python ".__DIR__."/bin/apconf/");
    }

    /**
     * Changing firmware by webupdate.py
     *
     */
    public static function changeFirmware($ip, $firmware_path, $model, $login='', $pwd='') {
        if (trim($login) && trim($pwd)) {
            $params = [
                'ip' => $ip,
                'new_fw' => $firmware_path,
                'model' => $model,
                'login' => trim($login),
                'password' => trim($pwd)
            ];
        } else {
            $params = [
                'ip' => $ip,
                'firmware_path' => $firmware_path,
            ];
        }
        $command = config('inventory.tools.apupdate')." '".json_encode($params, JSON_HEX_APOS)."'";
        Log::debug($command);
        try {
            $raw_data = shell_exec($command);
            //$raw_data = json_encode(['status'=>'ok']);
        } catch  (\Exception $e) {
            Log::error($e);
            return [
                'error' => -1,
                'msg' => 'Apupdate start exception'
            ];
        }
        Log::debug($raw_data);
        $result = json_decode($raw_data);
        if (isset($result->status) && $result->status == 'ok') {
            return [
                'error' => 0,
                'msg' => 'OK'
            ];
        } else if (isset($result->status)) {
            return [
                'error' => 1,
                'msg' => isset($result->error_msg)?$result->error_msg:$result->status
            ];
        } else {
            return [
                'error' => -2,
                'msg' => 'Непредвиденная ошибка'
            ];
        }
    }
}
