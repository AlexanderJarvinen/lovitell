<?php

use Illuminate\Foundation\Testing\WithoutMiddleware;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Modules\Inventory\Models\Address;
use App\User;
use Log;

class AddressModelTest extends TestCase
{

    /**
     * Get Building Service List
     */
    public function testGetServiceList() {
        Config::set('database.connections.sqlsrv.username', 'sbosov');
        Config::set('database.connections.sqlsrv.password', 'sbv10');
        DB::connection('sqlsrv')->reconnect();
        $user = new User(['name'=>'sbosov']);
        $this->be($user);
        $model = new Address();

        $this->assertTrue(is_array($model->getServiceTable(46133)));
    }
}
