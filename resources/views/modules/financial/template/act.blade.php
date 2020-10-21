<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf8"/>
</head>
<body>
<table cellspacing="0" style="width: 850px;font-size: 16px; font-family: times;">
    <tr height="15px;">
        <td colspan="6"></td>
    </tr>
    <tr height="15px;">
        <td colspan="6"></td>
    </tr>
    <tr>
        <td colspan="6" style="border-bottom: 3px solid #000;font-size: 25px;font-weight: bold;">АКТ № {{$document->ac_id.'/'.$document->id}} от {{$document->date}}</td>
    </tr>
    <tr height="15px;">
        <td colspan="6"></td>
    </tr>
    <tr>
        <td colspan="4">
            <table width="100%">
                <tr>
                    <td style="width: 50%;">Мы, нижеподписавшиеся, Исполнитель:</td>
                    <td style="font-weight: bold;">{{$document->provider->n_desk}}</td>
                </tr>
            </table>
        </td>
        <td colspan="2">
        </td>
    </tr>
    <tr height="15px;">
        <td colspan="6"></td>
    </tr>
    <tr>
        <td colspan="4">
            <table width="100%">
                <tr>
                    <td style="width: 50%;">Заказчик:</td>
                    <td style="font-weight: bold;">{{$document->customer->company}}</td>
                </tr>
            </table>
        </td>
        <td>
        </td>
    </tr>
    <tr height="15px;">
        <td colspan="6">Составили настоящий Акт о том, что в соответствии с договором {{$document->customer->agreement}}, исполнителем были оказаны следующие услуги, которые были выполнены
        полностью и в срок. Заказчик претензий по объему, качеству и срокам оказания не имеет.</td>
    </tr>
    <tr height="15px;">
        <td colspan="6"></td>
    </tr>
    <tr style="font-weight: bold;text-align: center;">
        <td style="border: 1px solid #000;border-top: 3px solid #000;border-left: 3px solid #000;border-bottom: 2px solid #000; width: 150px;">Период</td>
        <td style="border: 1px solid #000;border-top: 3px solid #000;border-bottom: 2px solid #000; width: 20px;">Кол.</td>
        <td style="border: 1px solid #000;border-top: 3px solid #000;border-bottom: 2px solid #000;">Наименование</td>
        <td style="border: 1px solid #000;border-top: 3px solid #000;border-bottom: 2px solid #000; width: 20px; text-align: center;">Стоимость</td>
        <td style="border: 1px solid #000;border-top: 3px solid #000;border-bottom: 2px solid #000; width: 20px; text-align: center;">Налог</td>
        <td style="border: 1px solid #000;border-top: 3px solid #000;border-right: 3px solid #000;border-bottom: 2px solid #000; text-align: center; width: 20px;">Итого</td>
    </tr>
    @foreach($document->content as $work)
    <tr>
        <td style="border: 1px solid #000;border-top: 1px solid #000;border-left: 3px solid #000;border-bottom: 0px solid #000;text-align: center;">{{$work['start_date'].' '.$work['end_date']}}</td>
        <td style="border: 1px solid #000;border-top: 1px solid #000;border-bottom: 0px solid #000; text-align: center;">{{$work['qty']}}</td>
        <td style="border: 1px solid #000;border-top: 1px solid #000;border-bottom: 0px solid #000;text-align: right;">{{$work['desk']}}</td>
        <td style="border: 1px solid #000;border-top: 1px solid #000;border-bottom: 0px solid #000;text-align: center;">{{$work['amount']}}</td>
        <td style="border: 1px solid #000;border-top: 1px solid #000;border-bottom: 0px solid #000;text-align: center;">{{$work['tax']}}</td>
        <td style="border: 1px solid #000;border-top: 1px solid #000;border-right: 3px solid #000;border-bottom: 0px solid #000;text-align: center;">{{$work['tax'] + $work['amount']}}</td>
    </tr>
    @endforeach
    <tr>
        <td colspan="6" style="border-top: 3px solid #000;"></td>
    </tr>
    <tr>
        <td colspan="3">Всего оказано услуг, на сумму: {{$document->str_sum}}</td>
        <td colspan="2" style="font-weight: bold;text-align: left;">Сумма:</td>
        <td style="font-weight: bold;text-align: right;">{{$document->total_amount}}</td>
    </tr>
    <tr>
        <td colspan="3"></td>
        <td colspan="2" style="font-weight: bold;text-align: left;">Налог:</td>
        <td style="font-weight: bold;text-align: right;">{{$document->total_tax}}</td>
    </tr>
    <tr>
        <td colspan="3"></td>
        <td colspan="2" style="font-weight: bold;text-align: left;">Итого:</td>
        <td style="font-weight: bold;text-align: right;">{{$document->total_tax + $document->total_amount}}</td>
    </tr>
    <tr height="15px;">
        <td colspan="6"></td>
    </tr>
    <tr height="50px;">
        <td colspan="6"></td>
    </tr>
    <tr>
        <td colspan="6">
        <table width="80%">
            <tr>
                <td colspan="2" style="font-weight: bold; width: 300px;">ИСПОЛНИТЕЛЬ</td>
                <td colspan="2" style="width: 70px;"></td>
                <td colspan="2" style="font-weight: bold; width: 300px;">ЗАКАЗЧИК</td>
            </tr>
            <tr>
                <td colspan="2">{{$document->provider->n_desk}}</td>
                <td colspan="2"></td>
                <td colspan="2">{{$document->customer->company}}</td>
            </tr>
            <tr height="50px;">
                <td colspan="4"></td>
            </tr>
            <tr>
                <td colspan="2">Руководитель или иное уполномоченное лицо</td>
                <td colspan="2"></td>
                <td colspan="2">Руководитель или иное уполномоченное лицо</td>
            </tr>
            <tr>
                <td colspan="2" style="position: relative;">{{$document->provider->chief}} {!! $document->provider->getStamp() !!}</td>
                <td colspan="2"></td>
                <td colspan="2"></td>
            </tr>
            <tr>
                <td colspan="2" style="border-bottom: 1px solid #000;"></td>
                <td colspan="2"></td>
                <td colspan="2" style="border-bottom: 1px solid #000;"></td>
            </tr>
            <tr>
                <td colspan="2" style="text-align: center;">М.П.</td>
                <td colspan="2"></td>
                <td colspan="2" style="text-align: center;">М.П.</td>
            </tr>
            @if($document->provider->chief_base)
            <tr>
                <td colspan="2">{{$document->provider->chief_base}}</td>
                <td colspan="4"></td>
            </tr>
            @endif
        </table>
        </td>
    </tr>
    <tr height="100px;">
        <td colspan="6"></td>
    </tr>
</table>
</body>
</html>
