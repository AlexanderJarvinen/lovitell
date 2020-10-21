<?php

namespace Modules\Financial\Components;

use App\Components\Helper;
use Modules\Financial\Models\Document;
use PDF;
use DB;
use Log;
use Mail;
use Config;

class DocumentHelper
{
    public static function send($customer)
    {
        $resp = [
            'error' => 0,
            'msg' => 'OK'
        ];
        if ($customer->email) {
            if (true || count($customer->documents) > 0 && $customer->type != 4) {
                $attaches = [];
                $document = null;
                foreach($customer->documents as $doc) {
                    $document = new Document($doc->doc_id, $doc->type, $doc->date, $customer->ac_id);
                    $attaches[] = [
                         'filename' => Document::$dt[$doc->type] . '_' . $customer->ac_id . '_' . $doc->doc_id . '.pdf',
                         'file' => self::getPdf($document)
                    ];
                };
                if ($document->provider->email) {
                    $mail_server = config('financial.mails.company_'.$document->provider->id.'.server');
                    $mail_port = config('financial.mails.company_'.$document->provider->id.'.port');
                    $mail_encryption = config('financial.mails.company_'.$document->provider->id.'.encryption');
                    $mail_login = config('financial.mails.company_'.$document->provider->id.'.login');
                    $mail_pass = config('financial.mails.company_'.$document->provider->id.'.pass');
                    Config::set('mail.host', $mail_server);
                    Config::set('mail.port', $mail_port);
                    Config::set('mail.encryption', $mail_encryption);
                    Config::set('mail.username', $mail_login);
                    Config::set('mail.password', $mail_pass);
                    $emails = [];
                    if (strpos($customer->email,';') !== FALSE) {
                        $emails = explode(';', $customer->email);
                    } else {
                        $emails[] = $customer->email;
                    }
                    foreach($emails as $email) {
                        $email = 'sbosov@lovit.ru';
                        try {
                            if (Mail::send('modules.financial.mail.covering', ['customer' => $customer], function ($message) use ($attaches, $document, $customer, $email) {
                                $message->from($document->provider->email, $document->provider->n_desk);

                                $message->to(trim($email))->subject('Отправка сопроводительных документов');

                                foreach ($attaches as $k => $attach) {
                                    $message->attachData($attach['file'], $attach['filename']);
                                }
                                //                            $message->attach(public_path("/files/Уведомление_об_изменении_юридического_адреса_ООО_Молния.pdf"));
                            })
                            ) {
                                $resp = [
                                    'error' => 0,
                                    'msg' => 'OK'
                                ];
                            } else {
                                $resp = [
                                    'error' => 1,
                                    'msg' => 'Ошибка отправки письма'
                                ];
                            }
                        } catch (\Exception $e) {
                            Log::debug('Непредвиденная ошибка');
                            Log::debug($e->getMessage());
                            $resp = [
                                'error' => -1,
                                'msg' => 'Непредвиденная ошибка'
                            ];
                        }
                    }
                } else {
                    Log::error('Provider email is null. Ac_id: '.$customer->ac_id);
                    $resp = [
                        'error' => 3,
                        'msg' => 'Email провайдера отсутствует'
                    ];
                }
            } else {
                Log::error('Customers documents array is empty. Ac_id: '.$customer->ac_id);
                $resp = [
                    'error' => 2,
                    'msg' => 'Нет документов для отправки'
                ];
            }
        } else {
            Log::error('Customers email is null. Ac_id: '.$customer->ac_id);
            $resp = [
                'error' => 3,
                'msg' => 'Email клиента для отправки отсутствует'
            ];
        }
        return $resp;
    }

    public static function getPdf(Document $document) {
        $pdf = null;
        if ((int)$document->type === 0) {
            $pdf = PDF::loadView('modules.financial.template.act', ['document' => $document, 'stamp'=>public_path().'/img/company'.$document->provider->id.'_stamp.png'])->setPaper('a4', 'landscape');
        } else if ((int)$document->type === 1) {
            $pdf = PDF::loadView('modules.financial.template.schet', ['document' => $document])->setPaper('a4', 'landscape');
        } else if ((int)$document->type === 2) {
            $pdf = PDF::loadView('modules.financial.template.schet-fact', ['document' => $document])->setPaper('a4', 'landscape');
        } else if ((int)$document->type == 4) {
            $pdf = PDF::loadView('modules.financial.template.receipt', ['document' => $document])->setPaper('a4', 'portrait');
        }
        return $pdf->download();
    }
}
