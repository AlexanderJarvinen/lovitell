@extends('layouts.app')

@section('content')
<script type="text/javascript">var data={{$data}}; </script>
<div class="container">
    <canvas id="chart" width="800" height="600"></canvas>
</div>
@endsection
