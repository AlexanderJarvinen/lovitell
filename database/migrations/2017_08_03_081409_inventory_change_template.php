<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class InventoryChangeTemplate extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('inventory_change_template', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('uid');
            $table->integer('address_id')->nullable();
            $table->integer('system');
            $table->integer('template');
            $table->string('state', 100);
            $table->text('desk');
            $table->integer('total');
            $table->timestamps();
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
        Schema::drop('inventory_change_template');
    }
}
