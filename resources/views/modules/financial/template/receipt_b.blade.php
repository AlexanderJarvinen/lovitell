<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf8"/>
    <title>Квитанция "Сбербанка"</title><style>body, td { color: #000; font-size: 11px;}</style></head><body>
<style type="text/css">
    table.sbb td { color: #000000; font-size: 11px; }
    table.bordered td {
        border: 1px solid black;
        margin: 0;
        padding: 0 2mm;
    }
    table.bordered thead td {
        text-align: center;
        font-size: 8pt;
    }

    @media print {
        input {display: none; }
    }
</style>
<table style="width: 180mm; height: 145mm;" class="sbb" cellspacing="0" cellpadding="0" border="0">
    <tbody>
    <tr valign="top">
        <td style="border-right: medium none; border-width: 1pt medium medium 1pt; border-style: solid none none solid; border-color: rgb(0, 0, 0) -moz-use-text-color -moz-use-text-color rgb(0, 0, 0); width: 50mm; height: 70mm;" align="center"><strong>ООО «Молния»</strong><div style="height: 60mm;"></div>Кассир</td>
        <td style="border-right: 1pt solid rgb(0, 0, 0); border-width: 1pt 1pt medium; border-style: solid solid none; border-color: rgb(0, 0, 0) rgb(0, 0, 0) -moz-use-text-color; padding: 1mm 2mm; width: 122mm;" align="center">
            <table style="margin-top: 3pt; width: 122mm;" cellspacing="0" cellpadding="0" border="0">
                <tbody>
                <tr>
                    <td style="font-size:12px;">ИЗВЕЩЕНИЕ от {{$document->date}}. за {{\App\Components\Helper::numToMonth((int)date('m', strtotime($document->date)), true)}} {{date('Y', strtotime($document->date))}} г.</td>
                </tr>

                <tr>
                    <td align="right" style="text-align: right"><strong>Лицевой счет: {{$document->ac_id}}</strong></td>
                </tr>
                <tr>
                    <td style="font-size:12px; font-weight: bold; text-align: right"><strong>{{$document->doc_name}}</strong></td>
                </tr>
                <tr>
                    <td style="font-size:11px; font-weight: bold; text-align: right;">{{\App\Components\Helper::numToMonth((int)date('m', strtotime($document->date)), true)}} {{date('Y', strtotime($document->date))}} г. Оплатить до 20.{{date('m.Y', strtotime('+28 days', strtotime($document->date)))}} г.</td>
                </tr>
                </tbody>
            </table>
            <table style="margin-top: 3pt; width: 122mm;" cellspacing="0" cellpadding="0" border="0">
                <tbody>
                <tr>
                    <td style="width: 37mm;">Абонент <strong>{{$document->customer->company}}</strong></td>
                </tr>
                <tr>
                    <td style="width: 37mm;">Адрес <strong>Москва, Александры Монаховой ул., д.98 к2, кв. 30</strong></td>
                </tr>
                <tr>
                    <td style="width: 37mm;">Телефонный номер: <strong>{{$document->phone}}</strong></td>
                </tr>
                </tbody>
            </table>
            <table style="margin-top: 3pt; width: 122mm;">
                <tbody>
                <tr style="height: 12mm">
                    <td style="width: 40mm; vertical-align: top;">Итого по счету:</td>
                    <td style="border: 1px solid black; vertical-align: top; text-align: right; width: 16mm; font-size: 12pt; padding: 1mm 2mm;"><b>{{$document->total_tax+$document->total_amount}}</b></td>
                    <td style="font-size: 12pt; vertical-align: top; padding: 1mm;"><b>руб.</b></td>
                </tr>
                <tr style="height: 3mm;">
                    <td></td><td></td><td></td>
                </tr>
                <tr style="height: 20mm">
                    <td>Уважаемый абонент!<br/>
                        ООО "Молния" благодарит Вас
                        за своевременную оплату.</td>
                    <td colspan="2" style="border: 1px solid black; padding: 1mm 2mm;">
                        Получатель: ООО "Молния"<br/>
                        Адрес: 115477, г. Москва, ул. Кантемировская, д.53, корп. 1,<br/>
                        помещение 7, этаж 1, комната 1<br>
                        ИНН 7724947737, КПП 772401001<br>
                        р/с 40702810338000130490 в ПАО Сбербанк<br>
                        БИК 044525225 к/с 30101810400000000225
                    </td>
                </tr>
                </tbody>
            </table>
            <table style="width: 100%;">
                <tr>
                    <td>
                        К оплате: * _____ руб. ____коп.<br/>
                        Подпись: * ________
                    </td>
                </tr>
                <tr>
                    <td style="font-style: italic; font-size: 9px;">
                        * - заполняется абонентом<br/>
                    </td>
                </tr>
            </table>
        </td>
    </tr>
    <tr valign="top">
        <td style="border-right: medium none; border-width: 1pt medium 1pt 1pt; border-style: solid none solid solid; border-color: rgb(0, 0, 0) -moz-use-text-color rgb(0, 0, 0) rgb(0, 0, 0); width: 50mm; height: 70mm;" align="center"></td>
        <td style="border-right: 1pt solid rgb(0, 0, 0); border-width: 1pt; border-style: solid; border-color: rgb(0, 0, 0); padding: 1mm 2mm;" align="left" >
            <table style="margin-top: 3pt; width: 122mm; padding: 1mm 0.5mm; " cellspacing="0" cellpadding="0" border="0">
                <tbody>
                <tr>
                    <td>
                        КВИТАНЦИЯ от {{$document->date}}.<br>
                        Оплатить до 20.{{date('m.Y', strtotime('+28 days', strtotime($document->date)))}} г.
                    </td>
                </tr>
                <tr>
                    <td align="right" style="font-weight: bold; font-size: 10pt;">
                        Лицевой счет: {{$document->ac_id}}
                    </td>
                </tr>
                <tr>
                    <td align="right" style="font-weight: bold; font-size: 10pt;">
                        {{$document->doc_name}}
                    </td>
                </tr>
                <tr>
                    <td align="right" style="font-weight: bold; font-size: 10pt;">
                        {{\App\Components\Helper::numToMonth((int)date('m', strtotime($document->date)), true)}} {{date('Y', strtotime($document->date))}} г. Оплатить до 20.{{date('m.Y', strtotime('+28 days', strtotime($document->date)))}} г.
                    </td>
                </tr>
            </table>
            <table style="margin-top: 3pt; width: 122mm;" cellspacing="0" cellpadding="0" border="0">
                <tbody>
                <tr>
                    <td style="width: 37mm;">Абонент <strong>{{$document->customer->company}}</strong></td>
                </tr>
                <tr>
                    <td style="width: 37mm;">Адрес <strong>Москва, Александры Монаховой ул., д.98 к2, кв. 30</strong></td>
                </tr>
                <tr>
                    <td style="width: 37mm;">Телефонный номер: <strong>{{$document->phone}}</strong></td>
                </tr>
                </tbody>
            </table>
            <table class="bordered" cellspacing="0" cellpadding="0" style="width: 100%; border: 1px solid black; border-collapse: collapse;">
                <thead>
                    <tr>
                        <td style="font-weight: bold;">
                            Остаток на счете на 01.{{date('m.Y', strtotime($document->date))}}, руб. ***
                        </td>
                        <td style="font-weight: bold;">
                            Долг на счете на 01.{{date('m.Y', strtotime($document->date))}}, руб.***
                        </td>
                        <td style="font-weight: bold;">
                            Начислено за период, руб.
                        </td>
                        <td style="font-weight: bold;">
                            Поступление платежей за период, руб.
                        </td>
                        <td style="font-weight: bold;">
                            Итого к оплате, руб.
                        </td>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>{{$document->balance}}</td><td>{{$document->debt}}</td><td>{{$document->total_tax + $document->total_amount}}</td><td>{{$document->payments}}</td><td>{{-$document->amount}}</td>
                    </tr>
                    <tr style="height: 4mm;">
                        <td style="height: 4mm;"></td><td></td><td></td><td></td><td></td>
                    </tr>
                    <tr style="height: 4mm;">
                        <td style="height: 4mm;"></td><td></td><td></td><td></td><td></td>
                    </tr>
                </tbody>
                <tfoot>
                    <tr>
                        <td style="font-weight: bold;" colspan="3">
                            Оказанные услуги за {{\App\Components\Helper::numToMonth((int)date('m', strtotime($document->date)), true)}} {{date('Y', strtotime($document->date))}} г. <br/>(расшифровка начислений)
                        </td>
                        <td style="font-weight: bold;">
                            Количество,
                            мин.
                        </td>
                        <td>
                            Начислено, руб.
                        </td>
                    </tr>
                    @foreach($document->content as $work)
                    <tr>
                        <td colspan="3">
                            {{$work['desk']}}
                        </td>
                        <td>
                            {{$work['qty']}}
                        </td>
                        <td>
                            {{$work['tax'] + $work['amount']}}
                        </td>
                    </tr>
                    @endforeach
                    <tr>
                        <td colspan="4">
                            ИТОГО:
                        </td>
                        <td>
                            {{$document->total_tax + $document->total_amount}}
                        </td>
                    </tr>
                </tfoot>
            </table>
            *** Остаток /Долг указаны с учетом оплаты, поступившей с 01.{{date('m.Y', strtotime($document->date))}} г. по {{date('t.m.Y', strtotime($document->date))}} г.<br/>
            <b>Круглосуточный центр обслуживания абонентов: +7 (495) 668-87-00</b>
        </td>
    </tr>
    </tbody>
</table>
</body></html>
