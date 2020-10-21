@extends('layouts.adminlte')

@section('content')
    <script>
        $(function() {
            ymaps.ready(init);


            function init() {
                var myMap = new ymaps.Map('map', {
                            center: [55.541922, 37.494144],
                            zoom: 17
                        }, {
                            searchControlProvider: 'yandex#search'
                        }),
                        objectManager = new ymaps.ObjectManager({
                            // Чтобы метки начали кластеризоваться, выставляем опцию.
                            //clusterize: true,
                            // ObjectManager принимает те же опции, что и кластеризатор.
                            gridSize: 32
                        });

                objectManager1 = new ymaps.ObjectManager({
                    // Чтобы метки начали кластеризоваться, выставляем опцию.
                    //clusterize: true,
                    // ObjectManager принимает те же опции, что и кластеризатор.
                    gridSize: 32
                });


//    objectManager.objects.options.set('preset', 'islands#greenDotIcon');
                objectManager.objects.options.set('preset', 'islands#yellowIcon');
                objectManager.clusters.options.set('preset', 'islands#greenClusterIcons');
                myMap.geoObjects.add(objectManager);

                objectManager1.objects.options.set('preset', 'islands#greenDotIcon');
                objectManager1.clusters.options.set('preset', 'islands#greenClusterIcons');
                myMap.geoObjects.add(objectManager1);

                $.ajax({
                    url: "/inventory/ajax/eqp/coord1/"
                }).done(function (data) {
                    objectManager.add(data);
                });
            }
        });
    </script>
    <div id="map" style="width: 100%; height: 600px; padding: 0; margin: 0;"></div>
@endsection
