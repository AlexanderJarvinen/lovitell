<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class InventoryAddEquipmentTmp extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('inventory_add_equipment_tmp', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('uid');
            $table->integer('adding_id');
            $table->string('name', 100);
            $table->integer('address_id');
            $table->integer('ac_id');
            $table->string('street');
            $table->string('house', 10);
            $table->string('body', 10);
            $table->integer('entrance');
            $table->integer('floor');
            $table->string('model', 100);
            $table->integer('model_id');
            $table->string('mac', 20);
            $table->string('type', 10);
            $table->integer('system_id');
            $table->string('parent', 100);
            $table->string('name_iface', 10);
            $table->string('parent_iface', 10);
            $table->integer('link_type');
            $table->string('link_type_prefix');
            $table->string('ip_addr', 20);
            $table->integer('location_id');
            $table->integer('vlan_id');
            $table->string('vid');
            $table->integer('error');
            $table->text('msg');
            $table->timestamps();

            $table->unique(['id']);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop('inventory_add_equipment_tmp');
    }
}
