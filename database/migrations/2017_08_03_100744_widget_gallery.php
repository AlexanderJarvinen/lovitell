<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class WidgetGallery extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('widget_gallery', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('uid')->nullable();
            $table->string('name');
            $table->string('title', 100);
            $table->string('content')->nullable();
            $table->string('type', 50);

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
        Schema::drop('widget_gallery');
    }
}
