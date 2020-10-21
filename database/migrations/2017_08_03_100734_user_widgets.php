<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class UserWidgets extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('user_widgets', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('uid')->nullable();
            $table->integer('dashboard_id');
            $table->integer('dashboard_kit_id');
            $table->integer('order');
            $table->string('name', 100);
            $table->integer('width');
            $table->integer('height');
            $table->integer('offset');
            $table->boolean('collapse');
            $table->string('title', 100);
            $table->text('content');
            $table->string('content_url', 100);
            $table->timestamps();
            $table->string('permission_request');
            $table->string('resize', 50);

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
        Schema::drop('user_widgets');
    }
}
