<html>
<meta http-equiv="Content-Type" content="text/html; charset=utf8"/>
<head>
    <title>Бланк "Счет на оплату"</title>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <style>
        body { width: 280mm; font-size: 11pt;}
        table.invoice_bank_rekv { border-collapse: collapse; border: 1px solid; }
        table.invoice_bank_rekv > tbody > tr > td, table.invoice_bank_rekv > tr > td { border: 1px solid; }
        table.invoice_items {border-collapse: collapse;}
        table.invoice_items th { border: 2px solid;}
    </style>
</head>
<body>

<table width="70%" cellpadding="2" cellspacing="2" class="invoice_bank_rekv">
    <tr>
        <td colspan="2" rowspan="2" style="min-height:13mm; width: 105mm;">
            <table width="100%" border="0" cellpadding="0" cellspacing="0" style="height: 13mm;">
                <tr>
                    <td valign="top">
                        <div>Банк получателя</div>
                    </td>
                </tr>
                <tr>
                    <td valign="bottom" style="height: 3mm;">
                        <div>{{$document->provider->recv->bank}}</div>
                        <div>{{$document->provider->recv->city}}</div>
                    </td>
                </tr>
            </table>
        </td>
        <td style="min-height:7mm;height:auto; width: 25mm;">
            <div>БИK</div>
        </td>
        <td rowspan="2" style="vertical-align: top; width: 60mm;">
            <div style=" height: 7mm; line-height: 7mm; vertical-align: middle;">{{$document->provider->recv->bik}}</div>
            <div>{{$document->provider->recv->kor_acc}}</div>
        </td>
    </tr>
    <tr>
        <td style="width: 25mm;">
            <div>К/Сч</div>
        </td>
    </tr>
    <tr>
        <td style="min-height:6mm; height:auto; width: 50mm;">
            <div>ИНН {{$document->provider->recv->inn}}</div>
        </td>
        <td style="min-height:6mm; height:auto; width: 55mm;">
            <div>КПП {{$document->provider->recv->kpp}}</div>
        </td>
        <td rowspan="2" style="min-height:19mm; height:auto; vertical-align: top; width: 25mm;">
            <div>Р/Сч</div>
        </td>
        <td rowspan="2" style="min-height:19mm; height:auto; vertical-align: top; width: 60mm;">
            <div>{{$document->provider->recv->account}}</div>
        </td>
    </tr>
    <tr>
        <td colspan="2" style="min-height:13mm; height:auto;">
            <table border="0" cellpadding="0" cellspacing="0" style="height: 13mm; width: 105mm;">
                <tr>
                    <td valign="bottom" style="height: 3mm;">
                        <div style="font-size: 10pt;">Получатель</div>
                    </td>
                </tr>
                <tr>
                    <td valign="top">
                        <div>{{$document->provider->n_desk}}</div>
                        <div>{{$document->provider->city}}</div>
                    </td>
                </tr>
            </table>

        </td>
    </tr>
</table>
<br/>

<div style="font-weight: bold; font-size: 16pt; padding-left:5px;">
    Счет № {{$document->id}} от {{$document->date}}</div>
<div style="background-color:#000000; width:100%; font-size:1px; height:2px;">&nbsp;</div>

<table width="100%">
    <tr>
        <td style="width: 30mm;">
            <div style=" padding-left:2px;">Поставщик:</div>
            <div style=" padding-left:2px;">(Исполнитель)</div>
            <div style=" padding-left:2px;">Адрес:</div>
        </td>
        <td>
            <div style="font-weight:bold;  padding-left:2px;">
                {{$document->provider->n_desk}}
            </div>
            <div style="padding-left:2px;">
                ИНН {{$document->provider->recv->inn}} КПП {{$document->provider->recv->kpp}}
            </div>
            <div style="padding-left:2px;">
                {{$document->provider->address}}
            </div>
        </td>
        <td>
            <div>Телефон</div>
            <div>Факс</div>
        </td>
        <td>
            <div>{{$document->provider->phone1}}</div>
            <div>{{$document->provider->phone2}}</div>
        </td>
    </tr>
    <tr>
        <td style="width: 30mm;">
            <div style=" padding-left:2px;">Покупатель:</div>
            <div style=" padding-left:2px;">(Заказчик)</div>
            <div style=" padding-left:2px;">Адрес:</div>
        </td>
        <td>
            <div style="font-weight:bold;  padding-left:2px;">
                <div>
                    {{$document->customer->company}}
                </div>
                <div style="padding-left:2px;">
                    ИНН {{$document->customer->recv->inn}} КПП {{$document->customer->recv->kpp}}
                </div>
                <div style="padding-left:2px;">
                    {{$document->customer->zip}}, {{$document->customer->city}}, ул.  {{$document->customer->street}}, д.  {{$document->customer->house}},  <?=isset($document->customer->body)? 'корп'.$document->customer->body:''?>,
                </div>
            </div>
        </td>
    </tr>
    <tr>
        <td>
        </td>
        <td>
            Договор {{$document->customer->agreement}}
        </td>
    </tr>
</table>


<table class="invoice_items" width="100%" style="border-collapse: collapse; border: none; width: 280mm;">
    <thead>
    <tr>
        <th style="width:13mm;">№</th>
        <th style="text-align: center;">Наименование</th>
        <th style="width:20mm;">Кол-во</th>
        <th style="width:17mm;">Ед.</th>
        <th style="width:27mm;">Цена</th>
        <th style="width:27mm;">Сумма</th>
    </tr>
    </thead>
    <tbody>
    @foreach($document->content as $k=>$work)
        <tr>
            <td style="border: 1px solid #000;border-top: 1px solid #000;border-left: 2px solid #000;border-bottom: 0px solid #000;text-align: center;">{{$k+1}}</td>
            <td style="border: 1px solid #000;border-top: 1px solid #000;border-bottom: 0px solid #000;text-align: right;">{{$work['desk']}}</td>
            <td style="border: 1px solid #000;border-top: 1px solid #000;border-bottom: 0px solid #000; text-align: center;">{{$work['qty']}}</td>
            <td style="border: 1px solid #000;border-top: 1px solid #000;border-bottom: 0px solid #000;text-align: center;">шт.</td>
            <td style="border: 1px solid #000;border-top: 1px solid #000;border-bottom: 0px solid #000;text-align: center;">{{$work['amount']+$work['tax']}}</td>
            <td style="border: 1px solid #000;border-top: 1px solid #000;border-right: 2px solid #000;border-bottom: 0px solid #000;text-align: center;">{{($work['tax'] + $work['amount'])*$work['qty']}}</td>
        </tr>
    @endforeach
    <tr>
        <td colspan="6" style="border-top: 2px solid #000;"></td>
    </tr>
    <tr>
        <td colspan="3"></td>
        <td colspan="2" style="font-weight: bold;text-align: left;">Итого:</td>
        <td style="font-weight: bold;text-align: right;">{{$document->total_tax+$document->total_amount}}</td>
    </tr>
    <tr>
        <td colspan="3"></td>
        <td colspan="2" style="font-weight: bold;text-align: left;">В том числе НДС:</td>
        <td style="font-weight: bold;text-align: right;">{{$document->total_tax}}</td>
    </tr>
    <tr>
        <td colspan="3"></td>
        <td colspan="2" style="font-weight: bold;text-align: left;">Всего к оплате:</td>
        <td style="font-weight: bold;text-align: right;">{{$document->total_tax + $document->total_amount}}</td>
    </tr>
    </tbody>
</table>

<br />
<div>
Всего наименований {{$document->count}} на сумму {{$document->total_amount + $document->total_tax }} рублей.<br />
{{$document->str_sum}} в том числе НДС 18%</div>
<br />
<div style="font-weight: bold; font-size: 12px; text-align: center;">Просьба оплатить счет до конца текущего месяца во избежание блокировки услуг связи первого числа следующего месяца.</div>
<div style="background-color:#000000; width:100%; font-size:1px; height:2px;">&nbsp;</div>
<br/>


<table>
    <tr>
        <td>Руководитель</td><td style="width: 100px;"></td><td style="border-bottom: 1px solid #000; width: 300px"></td><td style="width: 50px;"></td><td style="border-bottom: 1px solid #000; text-align: center; width: 300px">{{$document->provider->chief}}</td>
    </tr>
    <tr>
        <td colspan="2"></td><td style="text-align: center; font-size: 12px;">(Подпись)</td><td></td><td style="font-size: 12px;">(Расшифровка подписи)</td>
    </tr>
    <tr>
        <td colspan="2"></td><td style="text-align: center">М.П.</td><td colspan="2"></td>
    </tr>
    <tr>
        <td>Главный бухгалтер</td><td style="width: 100px;"></td><td style="border-bottom: 1px solid #000; width: 300px;"></td><td style="width: 50px;"></td><td style="border-bottom: 1px solid #000; text-align: center; width: 300px;">{{$document->provider->accountant}}</td>
    </tr>
    <tr>
        <td colspan="2"></td><td style="text-align: center; font-size: 12px;">(Подпись)</td><td></td><td style="font-size: 12px;">(Расшифровка подписи)</td>
    </tr>
</table>
<br/>
<br/>
</body>
</html>
