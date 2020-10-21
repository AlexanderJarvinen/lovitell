<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class FinancialSendDocuments extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('financial_send_documents', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('type');
            $table->integer('customer_group_id');
            $table->date('date');
            $table->integer('start_ac_id');
            $table->integer('end_ac_id');
            $table->string('desk');
            $table->string('state', 15);
            $table->integer('total');
            $table->integer('total_docs');
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
        Schema::drop('financial_send_documents');
    }
}
