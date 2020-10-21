<?php

namespace App\Components;

class Brand {
    public static function idToDescr($brand_id) {
        switch($brand_id) {
            case 1:
                return 'Леальта';
            case 2:
                return 'c2Free';
            case 3:
                return 'lovit))';
            default:
                return 'lovit))';
        }
    }
}
