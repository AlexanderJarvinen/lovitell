<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class InventoryChangeTemplateLog extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('inventory_change_template_log', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('job_id');
            $table->integer('number');
            $table->timestamp('accessed_at')->nullable();
            $table->string('route');
            $table->integer('error');
            $table->text('msg');

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
        Schema::drop('inventory_change_template_log');
    }
}
