<div class="widget_chart">
    <div id="chart_{{$widget_id}}"></div>
    <script type="text/javascript">
    var canvas =  document.getElementById('chart');
    if (canvas != null) {
        var ctx = canvas.getContext("2d");
        if (ctx != undefined && typeof data != "undefined") {
            var init = {
                labels: ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"],
                datasets: [
                    {
                        label: "Total",
                        fillColor: "rgba(151,187,205,0.5)",
                        strokeColor: "rgba(151,187,205,0.8)",
                        highlightFill: "rgba(151,187,205,0.75)",
                        highlightStroke: "rgba(151,187,205,1)",
                        data: data
                    }
                ]
            };
            var myNewChart = new Chart(ctx).Bar(init, []);
        }
    }
    </script>
</div>
