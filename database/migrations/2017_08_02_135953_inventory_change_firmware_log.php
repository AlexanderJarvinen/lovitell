<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class InventoryChangeFirmwareLog extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('inventory_change_firmware_log', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('job_id');
            $table->timestamp('accessed_at')->nullable();
            $table->string('route', 100);
            $table->integer('error');
            $table->string('msg');

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
        Schema::drop('inventory_change_firmware_log');
    }
}
