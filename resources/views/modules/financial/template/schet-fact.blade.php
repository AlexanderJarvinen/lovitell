<HTML>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <title langs="ru">Счет-фактура</title>
    <STYLE>
        body
        {
            font-family:"times";
            font-size: 10pt;
            width: 270mm;
        }

        p
        {
            line-height: 150%;
        }
        table.footer
        {
            font-size: 10px;
            margin-top: 15px;
            line-height: 150%;
        }
        table.order
        {
            border-collapse: collapse;
        }

        table.order {
        }

        table.order tr.number-row th {
            text-align: center;
        }

        table.order>thead>tr>th {
            font-size: 10px;
            border: 1px solid #000000;
            text-align: center;
        }

        table.order td
        {
            font-size: 10px;
            border: 1px solid #000000;
        }

    </STYLE>
    <script type="text/php">

</script>
</head>
<body bgcolor="white" lang="RU">


        <div class="Section1" style="width: 100%;">
            <table border="0" cellpadding="0" style="width: 100%;">
                <tr>
                    <td style="width: 150px; vertical-align: top;"><b>Счет-фактура №<br>Исправление</b></td>
                    <td style="vertical-align: top; width: 150px;" nowrap>{{\App\Components\Helper::cyr($document->id)}} от {{ $document->date }}<br>  № -- от -- </td>
                    <td style="width: 10px;"></td>
                    <td style="width: 30px;">(1) <br/> (1а)</td>
                    <td></td>
                    <td style="text-align: right; padding-right: 50px; font-size: 8px; font-weight: bold;">
                        Приложение №1<br>
                        к постановлению Правительства Российской федерации от 26 декабря 2011г № 1137<br>
                        (в редакции постановления Правительства Российской Федерации от 19.08.2017 г. №981)
                    </td>
                </tr>
            </table>
<p style="margin-bottom: 0; margin-top: 0;">
    <table border="0" cellpadding="0" cellspacing="0" style="font-size: 10pt;">
        <tr>
            <td>Продавец: {{ $document->provider->n_desk }}</td><td style="width: 10px;"></td><td> (2)</td>
        </tr>
        <tr>
            <td>Адрес: {{ $document->provider->address }}</td><td style="width: 10px;"></td><td> (2а)</td>
        </tr>
        <tr>
            <td>ИНН/КПП продавца: {{ $document->provider->recv->inn.'/'.$document->provider->recv->kpp }}</td><td style="width: 10px;"></td><td> (2б)</td>
        </tr>
        <tr>
            <td>Грузотправитель и его адрес: - - - - - - - - - - - - - - - - - -</td><td style="width: 10px;"></td><td> (3)</td>
        </tr>
        <tr>
            <td>Грузополучатель и его адрес: - - - - - - - - - - - - - - - - - -</td><td style="width: 10px;"></td><td> (4)</td>
        </tr>
        <tr>
            <td>К платежно-расчетному документу ____ от ____________________ </td><td style="width: 10px;"></td><td> (5)</td>
        </tr>
        <tr>
            <td>Покупатель: {{ $document->customer->company }}</td><td style="width: 10px;"></td><td> (6)</td>
        </tr>
        <tr>
            <td>Адрес: {{$document->customer->zip}}, {{$document->customer->city}}, ул.  {{$document->customer->street}}, д.  {{$document->customer->house}}<?=$document->customer->body? ' корп'.$document->customer->body:''?>, <?=$document->customer->apartment?$document->customer->apartment:''?></td><td style="width: 10px;"></td><td> (6а)</td>
        </tr>
        <tr>
            <td>ИНН/КПП покупателя {{$document->customer->recv->inn}}/{{$document->customer->recv->kpp}}</td><td style="width: 10px;"></td><td> (6б)</td>
        </tr>
        <tr>
            <td>Валюта: наименование, код Российский рубль, 643</td><td style="width: 10px;"></td><td> (7)</td>
        </tr>
        <tr>
            <td>Идентификатор государственного контракта, договора (соглашения) (при наличии)</td><td style="width: 10px;"></td><td></td>
        </tr>
        <tr>
            <td>_________________________________________________________</td><td style="width: 10px;"></td><td> (8)</td>
        </tr>
    </table>
</p>

<table style="width: 100%; border: none;" class="order">
    <thead>
    <TR>
        <TH ROWSPAN=2 ALIGN="CENTER" VALIGN=MIDDLE style="width: 200px">Наименование товара<br> (описание выполненных работ, оказанных услуг), имущественного права</TH>
        <TH ROWSPAN=2 ALIGN="CENTER" VALIGN=MIDDLE>Код<br>вида<br>товара</TH>
        <TH COLSPAN=2 ALIGN="CENTER" VALIGN=MIDDLE>Единицы измерения</TH>
        <TH ROWSPAN=2 ALIGN="CENTER" VALIGN=MIDDLE>Кол-<br>-во (объем)</TH>
        <TH ROWSPAN=2 ALIGN="CENTER" VALIGN=MIDDLE>Цена (тариф) за единицу измерения</TH>
        <TH ROWSPAN=2 ALIGN="CENTER" VALIGN=MIDDLE>Стоимость товаров (работ, услуг) имущественных прав, без налога — всего</TH>
        <TH ROWSPAN=2 ALIGN="CENTER" VALIGN=MIDDLE>В том числе сумма акциза</TH>
        <TH ROWSPAN=2 ALIGN="CENTER" VALIGN=MIDDLE>Налоговая ставка</TH>
        <TH ROWSPAN=2 ALIGN="CENTER" VALIGN=MIDDLE>Сумма налога предъявляемая полкупателю</TH>
        <TH ROWSPAN=2 ALIGN="CENTER" VALIGN=MIDDLE>Стоимость товаров (работ, услуг) имущественных прав с налогом — всего</TH>
        <TH COLSPAN=2 ALIGN="CENTER" VALIGN=MIDDLE>Страна происхождения товара</TH>
        <TH ROWSPAN=2 ALIGN="CENTER" VALIGN=MIDDLE>Регистра-<br>ционный номер таможенной декларации</TH>
    </TR>

    <TR>
        <TH ALIGN="LEFT">Код</TH>
        <TH ALIGN="LEFT">Условное обозначение (национальное)</TH>
        <TH ALIGN="LEFT">Цифровой код</TH>
        <TH ALIGN="LEFT">Краткое наименование</TH>
    </TR>
    <tr class="number-row">
        <th>1</th>
        <th>1a</th>
        <th>2</th>
        <th>2а</th>
        <th>3</th>
        <th>4</th>
        <th>5</th>
        <th>6</th>
        <th>7</th>
        <th>8</th>
        <th>9</th>
        <th>10</th>
        <th>10а</th>
        <th>11</th>
    </tr>
  </thead>

    @foreach($document->content as $k=>$work)
    <tr valign="top">
        <td style="width: 200px; text-align: left;" >
            {{ $work['desk'] }}
        </td>
        <td style="text-align: center">-</td>
        <td style="text-align: center;">-
        </td>
        <td style="text-align: center;">-
        </td>
        <td style="text-align: center;">-
        </td>
        <td style="text-align: center;">-
        </td>
        <td style="text-align: right; margin-right: 5px;">
            {{ $work['amount'] }}
        </td>
        <td style="text-align: center;">
            без акциза
        </td>
        <td style="text-align: center;">
            18%
        </td>
        <td style="text-align: right; margin-right: 5px;">
            {{ $work['tax'] }}
        </td>
        <td style="text-align: right; margin-right: 5px;">
            {{ $work['amount'] + $work['tax'] }}
        </td>
        <td style="text-align: center;">-
        </td>
        <td style="text-align: center;">-
        </td>
        <td style="text-align: center;">-
        </td>
    </tr>
    @endforeach

    <tr valign="top">
        <td style="width: 200px;">
            <h3>Всего к оплате:</h3>
        </td>
        <td>
        </td>
        <td>
        </td>
        <td>
        </td>
        <td >
        </td>
        <td></td>
        <td style="text-align: right; margin-right: 5px;">
            {{ $document->total_amount }}
        </td>
        <td colspan="2" style="text-align: center;">
            X
        </td>
        <td style="text-align: right; margin-right: 5px;">
            {{ $document->total_tax }}
        </td>
        <td style="text-align: right; margin-right: 5px;">
            {{$document->total_amount + $document->total_tax}}
        </td>
        <td colspan="3" style="border: none">
        </td>
    </tr>

</table>
<table border="0" cellspacing="0" cellpadding="0" width="100%" class="footer">
    <tr>
        <td style="width: 180px;">
            Руководитель организации<br> или иное уполномоченное лицо
        </td>
        <td style="width: 20px;">
        </td>
        <td style="border-bottom: 1px solid; width: 140px; position: relative; padding-left: -100px;">
            {!! $document->provider->getSign(2) !!}
        </td>
        <td style="width: 20px; text-align: center;">
        </td>
        <td style="border-bottom: 1px solid; vertical-align: bottom; text-align: center; width: 140px;">
            / {{$document->provider->chief}} /
        </td>
        <td style="width: 20px;">
        </td>
        <td style="width: 140px;">
            Главный бухгалтер <br>или иное уполномоченное лицо
        </td>
        <td style="width: 20px;">
        </td>
        <td style="border-bottom: 1px solid; width: 140px; position: relative;">
            {!! $document->provider->getAccountantSign(2) !!}
        </td>
        <td style="width: 20px;">
        </td>
        <td style="border-bottom: 1px solid; vertical-align: bottom; width: 140px; text-align: center;">
            / {{$document->provider->accountant}} /
        </td>
    </tr>
    <tr>
        <td style="width: 180px">
        </td>
        <td style="width: 70px;">
        </td>
        <td style="text-align: center">
            (Подпись)
        </td>
        <td>
        </td>
        <td style="text-align: center">
        (Расшифровка)
        </td>
        <td>
        </td>
        <td style="width: 140px; text-align: center;">
        </td>
        <td style="width: 70px;">
        </td>
        <td style="width: 100px; text-align: center;">
            (Подпись)
        </td>
        <td>
        </td>
        <td style="text-align: center;">
           (Расшифровка)
        </td>
    </tr>
    @if($document->provider->chief_base || $document->provider->accountant_base)
        <tr>
            <td colspan=5 style="text-align: center">
                @if($document->provider->chief_base)
                    {{$document->provider->chief_base}}
                @endif
            </td>
            <td></td>
            <td colspan=5 style="text-align: center">
                @if($document->provider->accountant_base)
                    {{$document->provider->accountant_base}}
                @endif
            </td>
        </tr>
    @endif
    <tr>
        <td>
            Индивидуальный предприниматель<br>или иное уполномоченное лицо
        </td>
        <td style="width: 20px;">
        </td>
        <td style="border-bottom: 1px solid; width: 140px;">
        </td>
        <td style="width: 20px; text-align: center;">
        </td>
        <td style="border-bottom: 1px solid; vertical-align: bottom; text-align: center; width: 140px;">
        </td>
        <td style="width: 20px;">
        </td>
        <td colspan="5" style="border-bottom: 1px solid"></td>
    </tr>
    <tr>
        <td>
        </td>
        <td style="width: 20px;">
        </td>
        <td style="width: 140px; text-align: center;">
            (Подпись)
        </td>
        <td style="width: 20px; text-align: center;">
        </td>
        <td style="vertical-align: bottom; text-align: center; width: 140px;">
            (Расшифровка)
        </td>
        <td style="width: 20px;">
        </td>
        <td colspan="5" style="text-align: center;">
            (реквизиты свидетельства о государственной регистрации индивидуального предпринимателя)
        </td>
    </tr>
</table>
</div>
</body>
</html>