<?php

namespace Modules\Financial\Jobs;

use App\Jobs\Job;
use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;
use Modules\Financial\Components\DocumentHelper;
use Modules\Financial\Models\Document;
use Modules\Financial\Models\SendDocJobModel;
use Log;
use App\Components\Helper;
use Modules\Inventory\Components\APSetup\APSetup;

class SendDocJob extends Job implements ShouldQueue
{
    use InteractsWithQueue, SerializesModels;

    public $job_id;
    public $user;

    /**
     * Create a new job instance.
     *
     *
     * @return void
     */
    public function __construct($job_id, $user)
    {
        $this->job_id = $job_id;
        $this->user = $user;
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        $job_model = SendDocJobModel::find($this->job_id);
        if ($this->attempts() > 1) {
            $this->delete();
            $job_model->fail();
        } else {
            $customers = $job_model->getCustomers();
            $job_model->start();
            try {
                $this->user->initDbConnection();
                foreach($customers as $customer){
                    if ($customer->ac_id != 32569 && $customer->ac_id != 131064 && $customer->ac_id != 131065) continue;
                    $resp = DocumentHelper::send($customer);
                    if ($resp['error'] == 0) {
                        $job_model->stepSuccess($customer->ac_id);
                    } else {
                        $job_model->stepFail($customer->ac_id, $resp['msg']);
                    }
                    break;
                    sleep(10);
                }
                $this->user->closeConnection();
                $job_model->complete();
            } catch (\Exception $e) {
                $job_model->fail();
            }
        }
    }
}
