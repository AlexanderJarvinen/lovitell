<?php

namespace App\Models;


/**
 * Class Brand
 * @package App\Models
 */

class Brand
{
    public static $BrandList = [
        [
            'value' => 1,
            'descr' => 'Lealta'
        ],
        [
            'value' => 2,
            'descr' => 'c2free',
        ],
        [
            'value' => 3,
            'descr' => 'Lovit))'
        ]
    ];

    public static function getBrandById($id) {
        return $id>0&&$id<count(self::$BrandList)? self::$BrandList[$id]:null;
    }

    public static function getBrands() {
        return self::$BrandList;
    }
}
