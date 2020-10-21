@extends('layouts.app')

@section('content')
<div class="container">
    <h1>{{ $title }}</h1>
    <script type="text/javascript">var data={{$chart_data}}; </script>
    <div class="container">
        <canvas id="chart" width="600" height="400"></canvas>
    </div>
    <a href="/export/{{ $report_name }}"><img src="/img/xls-icon.png" style="margin-right:10px;">Экспорт в xls</a>
    <table class="table table-bordered">
        <thead>
            <tr>
                <th>Тип</th>
                <th>Регион</th>
                <th>Январь</th>
                <th>Февраль</th>
                <th>Март</th>
                <th>Апрель</th>
                <th>Май</th>
                <th>Июнь</th>
                <th>Июль</th>
                <th>Август</th>
                <th>Сентябрь</th>
                <th>Октябрь</th>
                <th>Ноябрь</th>
                <th>Декабрь</th>
                <th>Итого</th>
            </tr>
        </thead>
        <tbody>
    @foreach($data as $row)
        <tr style="{{ $row['tr_bg_col'] != ''?'background-color:'.$row['tr_bg_col']:'' }}">
            <td>{{ iconv('cp1251', 'utf8', $row['trouble_desk']) }}</td>
            <td>{{ iconv('cp1251', 'utf8', $row['desk']) }}</td>
            <td>{{ $row['qty1'] }}</td>
            <td>{{ $row['qty2'] }}</td>
            <td>{{ $row['qty3'] }}</td>
            <td>{{ $row['qty4'] }}</td>
            <td>{{ $row['qty5'] }}</td>
            <td>{{ $row['qty6'] }}</td>
            <td>{{ $row['qty7'] }}</td>
            <td>{{ $row['qty8'] }}</td>
            <td>{{ $row['qty9'] }}</td>
            <td>{{ $row['qty10'] }}</td>
            <td>{{ $row['qty11'] }}</td>
            <td>{{ $row['qty12'] }}</td>
            <td>{{ $row['qty_total'] }}</td>
        </tr>
    @endforeach
        </tbody>
    </table>
</div>
@endsection
