<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class InventoryChangeFirmware extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('inventory_change_firmware', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('uid');
            $table->integer('address_id')->nullable();
            $table->string('state', 100);
            $table->timestamps();
            $table->text('firmware_path');
            $table->text('descr')->nullable();
            $table->integer('total');
            $table->timestamp('started_at')->nullable();
            $table->timestamp('stopped_at')->nullable();

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
        Schema::drop('inventory_change_firmware');
    }
}
