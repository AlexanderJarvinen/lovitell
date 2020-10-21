<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class InventoryUserSettings extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('inventory_user_settings', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('uid')->nullable();
            $table->integer('equipment_view');
            $table->text('equipment_table_columns');
            $table->text('equipment_filters');
            $table->integer('monitoring_update_duration')->default(60);
            $table->text('monitoring_table_columns');
            $table->text('monitoring_filters');
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
        Schema::drop('inventory_user_settings');
    }
}
