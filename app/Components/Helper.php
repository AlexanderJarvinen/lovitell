<?php

namespace App\Components;

use Log;

class Helper {
    public static function toMultiselect($array, $value_name, $label_name, $selected=null) {
        $resp = [];
        foreach($array as $row) {
            if ($selected !== null) {
                $resp[] = ['value' => $row[$value_name], 'label' => $row[$label_name], 'selected' => $selected];
            } else {
	            $resp[] = ['value' => $row[$value_name], 'label' => $row[$label_name]];
	        }
        }
        return $resp;
    }

    public static function toSelect($array, $value_name, $label_name) {
        $resp = [];
        foreach($array as $row) {
            $row = (array) $row;
           $resp[] = ['id' => $row[$value_name], 'desk' => $row[$label_name]];
        }
        return $resp;
    }

    public static function checkCyr($str, $replace=true) {
        $rus=['Е','Т','О','Р','А','Н','К','Х','С','В','М','е','т','о','р','а','н','к','х','с','в','м'];
        $eng=['E','T','O','P','A','H','K','X','C','B','M','e','t','o','p','a','h','k','x','c','b','m'];
        if ($replace) {
            return str_replace($rus, $eng, $str);
        } else {
            foreach($rus as $c) if (strpos($str, $c) !== false) return true;
            return false;
        }
    }

    public static function getCharByNumber($num) {
        $eng = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        if ($num<26) {
            return $eng[$num];
        } else {
            return 'A'.$eng[$num-26];
        }
    }

    public static function strToMac($str, $check=false) {
        if ($check) {
            $result = false;
        } else {
            $result = $str;
        }
        if (preg_match('/^(([0-9A-Fa-f]{2}[\.\-:]){5}[0-9A-Fa-f]{2})|(([0-9A-Fa-f]{4}[\.:\-]){2}[0-9A-Fa-f]{4})$/',trim($str))) {
            $result = strtolower(implode(':', str_split(preg_replace("/[^a-fA-F0-9]/", '', $str), 2)));
        }
        return $result;
    }

    public static function checkIp($str) {
        return preg_match('/^(25[0-5]|2[0-4][0-9]|[0-1][0-9]{2}|[0-9]{2}|[0-9])(\.(25[0-5]|2[0-4][0-9]|[0-1][0-9]{2}|[0-9]{2}|[0-9])){3}$/', $str);
    }

    public static function pingAddress($ip) {
        $pingresult = shell_exec("ping -c 1 -w 1 -q $ip | grep '0 received'");
        return $pingresult == '';
    }

    /**
     * Возвращает сумму прописью
     * @author runcore
     * @uses morph(...)
     */
    static function num2str($num) {
        $nul='ноль';
        $ten=array(
            array('','один','два','три','четыре','пять','шесть','семь', 'восемь','девять'),
            array('','одна','две','три','четыре','пять','шесть','семь', 'восемь','девять'),
        );
        $a20=array('десять','одиннадцать','двенадцать','тринадцать','четырнадцать' ,'пятнадцать','шестнадцать','семнадцать','восемнадцать','девятнадцать');
        $tens=array(2=>'двадцать','тридцать','сорок','пятьдесят','шестьдесят','семьдесят' ,'восемьдесят','девяносто');
        $hundred=array('','сто','двести','триста','четыреста','пятьсот','шестьсот', 'семьсот','восемьсот','девятьсот');
        $unit=array( // Units
            array('копейка' ,'копейки' ,'копеек',	 1),
            array('рубль'   ,'рубля'   ,'рублей'    ,0),
            array('тысяча'  ,'тысячи'  ,'тысяч'     ,1),
            array('миллион' ,'миллиона','миллионов' ,0),
            array('миллиард','милиарда','миллиардов',0),
        );
        //
        list($rub,$kop) = explode('.',sprintf("%015.2f", floatval($num)));
        $out = array();
        if (intval($rub)>0) {
            foreach(str_split($rub,3) as $uk=>$v) { // by 3 symbols
                if (!intval($v)) continue;
                $uk = sizeof($unit)-$uk-1; // unit key
                $gender = $unit[$uk][3];
                list($i1,$i2,$i3) = array_map('intval',str_split($v,1));
                // mega-logic
                $out[] = $hundred[$i1]; # 1xx-9xx
                if ($i2>1) $out[]= $tens[$i2].' '.$ten[$gender][$i3]; # 20-99
                else $out[]= $i2>0 ? $a20[$i3] : $ten[$gender][$i3]; # 10-19 | 1-9
                // units without rub & kop
                if ($uk>1) $out[]= self::morph($v,$unit[$uk][0],$unit[$uk][1],$unit[$uk][2]);
            } //foreach
        }
        else $out[] = $nul;
        $out[] = self::morph(intval($rub), $unit[1][0],$unit[1][1],$unit[1][2]); // rub
        $out[] = $kop.' '.self::morph($kop,$unit[0][0],$unit[0][1],$unit[0][2]); // kop
        return trim(preg_replace('/ {2,}/', ' ', join(' ',$out)));
    }

    /**
     * Склоняем словоформу
     * @ author runcore
     */
    static function morph($n, $f1, $f2, $f5) {
        $n = abs(intval($n)) % 100;
        if ($n>10 && $n<20) return $f5;
        $n = $n % 10;
        if ($n>1 && $n<5) return $f2;
        if ($n==1) return $f1;
        return $f5;
    }

    static function cyr($str) {
        return iconv('cp1251', 'utf8', $str);
    }

    static function cyr1251($str) {
        return iconv('utf8', 'cp1251', $str);
    }

    static function img2base64($path) {
        $type = pathinfo($path, PATHINFO_EXTENSION);
        $data = file_get_contents($path);
        return 'data:image/' . $type . ';base64,' . base64_encode($data);
    }

    static function numToMonth($num, $long=false) {
        if ($long) {
            $months = [1 => 'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
        } else {
            $months = [1 => 'Янв.', 'Фев.', 'Мар.', 'Апр.', 'Май', 'Июн.', 'Июл.', 'Авг.', 'Сен.', 'Окт.', 'Ноя.', 'Дек.'];
        }
        return $num<1 || $num>12? false: $months[$num];
    }

    static function getColor($i=-1) {
        $colors = ['#555555', '#5ab4c8', '#ff0000', '#194114', '#000000', '#ff7828', '#28dc28'];
        if ($i>=0 && $i<count($colors)-1) {
            return $colors[$i];
        } else {
            return sprintf('#%02X%02X%02X', rand(0, 255), rand(0, 255), rand(0, 255));
        }
    }

    static function colorToBorder($color, $opacity=1) {
        $color = str_replace("#", "", $color);

        if(strlen($color) == 3) {
            $r = hexdec(substr($color,0,1).substr($color,0,1));
            $g = hexdec(substr($color,1,1).substr($color,1,1));
            $b = hexdec(substr($color,2,1).substr($color,2,1));
        } else {
            $r = hexdec(substr($color,0,2));
            $g = hexdec(substr($color,2,2));
            $b = hexdec(substr($color,4,2));
        }

        return ['R'=>$r, 'G'=>$g, 'B'=>$b, 'a'=>$opacity];
    }

    static function minToDHM($min) {
        if ($min) {
            $inHour = 60;
            $inDay = 1440;

            $days = intval($min/$inDay);
            $hours = intval(($min - $days * $inDay)/$inHour);
            $minutes = $min - $days * $inDay - $hours * $inHour;
            $days = $days?$days.'д. ':'';
            $hours = $hours?$hours.'ч. ':'';
            $minutes = $minutes?$minutes.'мин.':'';
            return trim($days.$hours.$minutes);
        } else {
            return '';
        }

    }

    static function declOfNum($number, $titles)
    {
        $cases = [2, 0, 1, 1, 1, 2];
        return $titles[ ($number%100>4 && $number%100<20)? 2 : $cases[($number%10<5)?$number%10:5] ];
    }
}
