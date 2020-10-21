<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class FinancialSendDocumentsDocuments extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('financial_send_documents_documents', function (Blueprint $table) {
            $table->string('doc_id');
            $table->integer('type');
            $table->date('date');
            $table->integer('customer_id');
            $table->float('balance');
            $table->float('sum');
            $table->integer('tax');
            $table->integer('amount');
            $table->date('bill_date');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop('financial_send_documents_documents');
    }
}
