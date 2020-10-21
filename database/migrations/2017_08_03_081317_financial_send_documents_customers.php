<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class FinancialSendDocumentsCustomers extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('financial_send_documents_customers', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('job_id');
            $table->integer('ac_id');
            $table->string('company');
            $table->string('email');
            $table->string('state', 15);
            $table->string('msg');
            $table->timestamp('accessed_at')->nullable();
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
        Schema::drop('financial_send_documents_customers');
    }
}
