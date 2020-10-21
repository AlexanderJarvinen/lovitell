

$(function() {
    $('#region-select').multiselect({
        enableFiltering: true,
        maxHeight : 200,
        numberDisplayed : 99,
        includeSelectAllOption: true,
        selectAllValue: '0'
    });
    $('.addr-search').click(function() {
        $('.adress_search-wrap').slideToggle();
    });
    var fi = false;
    var om = null;
    var om2= null;
    var map =null;
    $('.switch').focusout(function () {
        if ($(this).val() != '') {
            $('.port').show();
        } else {
            $('.port').val('').hide();
        }
    });
    $('.switch').keypress(function() {
        $('.port').show();
    });

    $('#get-house-data').click(function() {
       if ($(this).html() == 'Показать') {
           $(this).html('Обновить');
 //          om = initMap();
           initTable(1);
 //          reinitMap(om);
       } else {
  //         reinitMap(om);
           $('#house-list').dataTable().fnDestroy();
           initTable(1);
       }
    });
    $('#get-house-search').click(function() {
        initTable();
        $(document).on('click', '.house', function (e) {
            searchEquipment();
            return false;
        });
    });
    $('#street-search').autocomplete({
        source: function( request, response ) {
            $.ajax({
                url: "/inventory/ajax/street/"+request.term,
                type: "GET",
                dataType: "json",
                success: function(data) {
                    response(data);
                }
            });
        },
        minLength: 3,
        search: function( event, ui ) {
        },
        change: function( event, ui ) {
            $('#street-id').val(ui.item.key);
        },
        select: function( event, ui ) {
            $('#street-id').val(ui.item.key);
            initTable(2);
        },
        open: function(event, ui) {
            $('.ui-autocomplete').off('menufocus hover mouseover mouseenter');
        }
    }).focus(function() {
        console.log('focus');
        $("#street-id").val('');
        $("#street-search").val('');
    });

    $('#search-equipment').click(function(e) {
    //    $('equipment-list').dataTable().fnDestroy();
        searchEquipment(this);
        e.preventDefault();
        return false;
    });

    $(document).click(function(e) {
        if (!$(e.target).hasClass('route_popup')) {
            $('.route').popover('destroy');
        } else {
            e.stopPropagation();
        }

    });

    /*$(document).on('click', '.route-configure',function(e) {
        var route = $.trim($(this).attr('data-route'));
        console.log(route);
        if (route) {
            $.ajax({
                url: "/inventory/ajax/configure-route/"+route,
                type: "GET",
                dataType: "json",
                success: function (data) {
                    if (data.error == 0) {
                        alert('Задача добавлена в очередь на исполнение');
                    } else {
                        alert('Ошибка: '+data.msg);
                    }
                }
            });
        }
    });*/

    $('.show_route_name').click(function(e) {
        if ($(this).prop("checked")) {
            $('.route-name').show();
        } else {
            $('.route-name').hide();
        }
    });

    $('.show_route_name2').click(function(e) {
        if ($(this).has('.fa-eye').length > 0) {
            $('.route-name').show();
            $(this).find('i').removeClass('fa-eye').addClass('fa-eye-slash');
        } else {
            $('.route-name').hide();
            $(this).find('i').removeClass('fa-eye-slash').addClass('fa-eye');
        }
        e.preventDefault();
        return false;
    });

    $('.route').click(function() {
        var name = $(this).data('name');
        var url = "/inventory/route/"+name;
        var e=$(this);
        $.get(url,function(d) {
            let emsg = e.attr('data-emsg');
            let ping = e.attr('data-ping');
            let code = e.attr('data-error');
            let port = e.attr('data-port');
            let macs = e.data('macs');
            let anchor = $('<div class="route_popup"/>').append(d);
            let perm = anchor.find('.mac_list').data('permissions');
            if (typeof emsg != 'undefined' && emsg != '') {
                anchor.find('.error_msg').html('<b>Ошибка:</b> '+emsg);
                anchor.find('.error_msg').show();
            } else {
                anchor.find('.error_msg').hide();
            }
            if (typeof ping != 'undefined') {
                console.log('Adding new ping'+ping+'for'+name);
                anchor.find('.ping').html('<b>Ping:</b>' + ping);
                anchor.find('.ping').show();
            } else {
                anchor.find('.ping').hide();
            }
            if (typeof code != 'undefined' && code != 0) {
                anchor.find('.error_code').html('<b>Код:</b>' + code);
                anchor.find('.error_code').show();
            } else {
                anchor.find('.error_code').hide();
            }
            if (typeof port != 'undefined') {
                anchor.find('.port').html('<b>Порт:</b>' + port);
                anchor.find('.port').show();
            } else {
                anchor.find('.port').hide();
            }
            if (typeof macs != 'undefined') {
                if (macs.length > 0) {
                    let mac_list = '<b>Список MAC-адресов на порту:</b>';
                    mac_list = mac_list+'<ul>';
                    for(let i in macs) {
                        if (perm) {
                            mac_list = mac_list + '<li><a class="newmac" href="#">' + macs[i] + '</a></li>';
                        } else {
                            mac_list = mac_list + '<li>'+macs[i]+'</li>';
                        }
                    }
                    mac_list = mac_list + '</ul>'
                    anchor.find('.mac_list').html(mac_list);
                    anchor.find('.mac_list').show();
                    anchor.find('.newmac').click(function(e) {
                        if (confirm('Заменить MAC адрес устройства '+name+' на '+$(this).text()+'?')) {
                            saveMac($(this).text(), name);
                        }
                        e.preventDefault();
                        return false;
                    });
                } else {
                    anchor.find('.mac_list').hide();
                }
            }
            e.popover({content: anchor, html:true}).popover('show');
            document.onclick
        });
    });

    $('.save-mac').click(function() {
        var mac_input = $(this).parent().find('.mac_string');
        var route = mac_input.data('route');
        var system = mac_input.data('system');
        if (validMac(mac_input.val().trim())) {
            mac_input.removeClass('error');
            $('.eq_mac .error-msg').hide();
            $.ajax({
                type: "POST",
                "beforeSend": function (request) {
                    return request.setRequestHeader('X-CSRF-Token', $("meta[name='csrf-token']").attr('content'));
                },
                url: "/inventory/equipment2/setmac",
                data: ({
                    "route": route,
                    "system" : system,
                    "mac": mac_input.val().trim()
                }),
                success: function (a) {
                    if (a) {
                        if (a.error == 0 ) {
                            alert("Мак адрес успешно изменен");
                        } else {
                            alert(a.msg);
                        }
                    } else {
                        alert("Системаня ошибка");
                    }
                },
                error: function (xhr) {
                    alert("Ошибка при изменении мака.");
                }
            });
        } else {
            mac_input.addClass('error');
            $('.eq_mac .error-msg').html('Поле заполнено некорректно').show();
        }

    });

    $('.accept_od__select').change(function(e) {
        if (e.target.value) {
            $('.accept_od__accept').prop('disabled', false);
        } else {
            $('.accept_od__accept').prop('disabled', true);
        }
    });

    $('.change_state__select').change(function(e) {
        if (e.target.value) {
            $('.change_state__select_state').prop('disabled', false);
        } else {
            $('.change_state__select_state').prop('disabled', true);
        }
    });

    $('.change_state__select_state').change(function(e) {
        if (e.target.value) {
            $('.change_state__submit').prop('disabled', false);
        } else {
            $('.change_state__submit').prop('disabled', true);
        }
    });

    $('.change_state__submit').click(function() {
        var system = $('.change_state__select').val();
        var state = $('.change_state__select_state').val();
        var address_id = $(this).data('address_id');
        if (address_id && state && system) {
            var routes = [];
            $(".route input[type=checkbox]:checked").each(function() {
                routes.push($(this).parent().parent().parent().data('name'));
            });
            $.ajax({
                type:'POST',
                url: '/inventory/building/'+address_id+'/change_state/'+system+'/'+state,
                data: {
                    routes: routes
                },
                success: function(data) {
                    if (data.error == 0) {
                        window.location.reload();
                    } else {
                        if (alert('Во время смены статусов возникли ошибки')) {
                            window.location.reload();
                        };
                    }
                }
            })
        }
    });

    $('.accept_od__accept').click(function() {
        var select = $('select[name=accept_od]');
        var address_id = select.data('address_id');
        var system = select.val();
        if (address_id && system) {
            $.ajax({
                type:'GET',
                url: '/inventory/building/'+address_id+'/accept/od/'+system,
                success: function(data) {
                    if (data.error == 0) {
                         window.location.reload();
                    } else {
                        if (alert('Во время приемки возникли ошибки')) {
                            window.location.reload();
                        };
                    }
                }
            })
        }
    });

    $('#get_yandex_coord').click(function() {
        var address = $(".address").text();
        console.log(address);
        $.ajax({
            type: "POST",
            url: "/inventory/get-yandex-coord",
            data: ({
                "address_string": address
            }),
            success: function (a) {
                if (a) {
                    $('input[name=latitude]').val(a[1]);
                    $('input[name=longitude]').val(a[0]);
                }
            }
        });
    });

    /*$('.resize-ratio').onResize(function() {
        let resize_str = $(this).data('ratio');
        if (typeof resize_str != 'undefined' &&
            resize_str != 0 &&
            resize_str.indexOf(':') != false
        ) {
            let resize_ratio = resize_str.split(':');
            if (resize_ratio.length==2) {
                $(this).height = $(this).width()/resize_ratio[1]*resize_ratio[0];
            }
        }
    });*/

    $(".fill_by_yandex").click(function() {
        var lp = [];
        $(".address_row").each(function(i) {
            var row = $(this);
            var address = $(this).find(".address").text();
            console.log(address);
            var mark = null;
            $.ajax({
                type: "POST",
                url: "/inventory/get-yandex-coord",
                data: ({
                    "address_string": address
                }),
                success: function (a) {
                    if (a) {
                        row.find('td.coordinates.yandex input[name=latitude]').val(a[1]);
                        row.find('td.coordinates.yandex input[name=longitude]').val(a[0]);
                        row.find('td.yandex_address').text(a['address']);
                        if (row.is(":last-child")) {
                            lp = [a[1], a[0]];
                            map.setCenter(lp, 12);
                            console.log(lp);
                        }
                        mark = new ymaps.Placemark([a[1], a[0]], {iconContent: i+1});
                        map.geoObjects.add(mark);
                    }
                }
            });
        });
        $('save_coordinates').prop( "disabled", false );
    });

    $(".fill_by_google").click(function() {
        var lp = [];
        $(".address_row").each(function(i) {
            var row = $(this);
            var address = $(this).find(".address").text();
            console.log(address);
            var mark = null;
            $.ajax({
                type: "POST",
                url: "/inventory/get-google-coord",
                data: ({
                    "address_string": address
                }),
                success: function (a) {
                    if (a) {
                        row.find('td.coordinates.google input[name=latitude]').val(a[1]);
                        row.find('td.coordinates.google input[name=longitude]').val(a[0]);
                        row.find('td.google_address').text(a['address']);
                        if (row.is(":last-child")) {
                            lp = [a[1], a[0]];
                            map.setCenter(lp, 12);
                            console.log(lp);
                        }
                        mark = new ymaps.Placemark([a[1], a[0]], {iconContent: i+1});
                        map.geoObjects.add(mark);
                    }
                }
            });
        });
        $('save_coordinates').prop( "disabled", false );
    });

    $(".fill_by_2gis").click(function() {
        var lp = [];
        $(".address_row").each(function(i) {
            var row = $(this);
            var address = $(this).find(".address").text();
            console.log(address);
            var mark = null;
            $.ajax({
                type: "POST",
                url: "/inventory/get-2gis-coord",
                data: ({
                    "address_string": address
                }),
                success: function (a) {
                    if (a) {
                        row.find('td.coordinates.2gis input[name=latitude]').val(a[1]);
                        row.find('td.coordinates.2gis input[name=longitude]').val(a[0]);
                        row.find('td.google_address').text(a['address']);
                        if (row.is(":last-child")) {
                            lp = [a[1], a[0]];
                            map.setCenter(lp, 12);
                            console.log(lp);
                        }
                        mark = new ymaps.Placemark([a[1], a[0]], {iconContent: i+1});
                        map.geoObjects.add(mark);
                    }
                }
            });
        });
        $('save_coordinates').prop( "disabled", false );
    });

    $('.equipment_selectall').change(function() {
        if ($(this).prop('checked')) {
            $(".route input[type=checkbox]").each(function() {
                $(this).prop('checked', true);
            });
        } else {
            $(".route input[type=checkbox]").each(function() {
                $(this).prop('checked', false);
            });
        }
    });

    let hash = window.location.hash;
    if (hash == '#modify-area' || hash == '#adding-area' || hash == '#compare-area') {
        $('ul.nav-tabs>li>a[href=\\#equipment]').trigger('click');
    }
    $('ul.nav-tabs>li>a[href=\\'+hash+']').each(function() {
        $(this).trigger('click');
    });
    $('ul.nav-tabs>li>a').click(function(){
        let h=$(this).attr('href');
        if(h){
            location.hash = h;
        }
    });

    $('.save_coordinates').click(function () {
        if ($(this).prop('disabled') == true) return;
        $(".address_row").each(function(i) {
            var row = $(this);
            var latitude = row.find('td.coordinates input[name=latitude]').val();
            var longitude = row.find('td.coordinates input[name=longitude]').val();
            var address_id = $(this).data("addressid");
            if (latitude != '' && longitude != '' && address_id != '') {
                $.ajax({
                    type: "POST",
                    url: "/inventory/save-coord",
                    data: ({
                        "address_id": address_id,
                        "longitude" : longitude,
                        "latitude" : latitude
                    }),
                    success: function (a) {
                        console.log(a.error);
                        if (a) {
                            console.log(a);
                            if (a.error == 0) {
                                row.find('.result').text("V").addClass("success");
                            } else {
                                row.find('.result').text("X").addClass("error");
                                console.log("Save coord for "+address_id+", error: "+a.msg);
                            }
                        }
                    },
                    error: function(a) {
                        row.find('.result').addClass("error");
                    }
                });
            }
        })
    })

    if ($('#map')) {
        ymaps.ready(init);
    }
});

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
        url: "/inventory/ajax/eqp/coord1/",
    }).done(function (data) {
        objectManager.add(data);
    });
}

function initTable(param=1) {
    if (param==1) {
        var r=regions();
        if (r=='all') {
            alert('Ничего не выбрано');
            return;
        }
        s='all';
    } else if (param==2) {
        var s = $('#street-id').val();
        if (s != '') {
            var address = s.split('-');
            r = address[1];
            s = address[2];
        } else {
            s = 'all';
            return;
        }
    }
    $('#house-list').dataTable().fnDestroy();
    $('#house-list tfoot th').each( function () {
        var title = $(this).text();
        $(this).html( '<input type="text" placeholder="Поиск '+title+'" />' );
    } );

    var table = $('#house-list').DataTable( {
        "ajax": "/inventory/buildings/"+r+"/"+s,
        "processing": true,
        "order": [[ 1, "asc" ],[0, "asc"]],
        "columnDefs": [ {
            "targets": 2,
            "data": function ( row, type, val, meta, param ) {
                if (typeof row['2'] != "undefined") {
                    return "<a href='/inventory/building/" + row['address_id'] + "' target='_blank' class='house' data-address='"+row['address_id']+"'>" + row['2'] + "</a>";
                } else {
                    return;
                }
            }
        } ]
    } );
    // Apply the search

    table.columns().every( function () {
        var that = this;

        $( 'input', this.footer() ).on( 'keyup change', function () {
            if ( that.search() !== this.value ) {
                that
                    .search( this.value )
                    .draw();
            }
        } );
    } );

    $('#house-list-wrap').show();
}

function initEquipmentTable() {
    var s=regions();
    if (s=='') return;
    $('#equipment-list tfoot th').each( function () {
        var title = $(this).text();
        $(this).html( '<input type="text" placeholder="Поиск '+title+'" />' );
    } );

    var table = $('#equipment-list').DataTable( {
        "ajax": "/inventory/equipment/list/"+s,
        "order": [[ 1, "asc" ],[0, "asc"]],
        "columnDefs": [ {
            "targets": 0,
            "data": function ( row, type, val, meta ) {
                if (typeof row['0'] != "undefined") {
                    return "<a href='/inventory/equipment/view/" + row['0'] + "' target='_blank'>" + row['0'] + "</a>";
                } else {
                    return;
                }
            }
        } ]
    } );
    // Apply the search

    table.columns().every( function () {
        var that = this;

        $( 'input', this.footer() ).on( 'keyup change', function () {
            if ( that.search() !== this.value ) {
                that
                    .search( this.value )
                    .draw();
            }
        } );
    } );



    $('#house-list-wrap').show();
}

function searchEquipment(address) {
    var form = $("#eqsearch");
    var street = form.find('input[name=street]');
    form.find('.error-msg').detach();
    var inputs = form.find('.eq-params');
    var par = false;
    var empt = true;
    inputs.each(function() {
        if ($(this).val() != '') {
            par = true;
            empt = false;
        }
    });
    if ( !par && street.val().length < 3 ) {
        form.find('input[name=street]').addClass('error');
        $("<span class='error-msg'>Строка поиска по адресу должна быть длиннее 2х символов</span>").insertAfter(street);
    } else {
        empt = false;
        form.find('input[name=street]').removeClass('error');
    }
    if (!empt) {
        $('#equipment-list-wrap').show();
        $('#equipment-list').dataTable().fnDestroy();
        var data = {
            'name': form.find("input[name=name]").val(),
            'mac': form.find("input[name=mac]").val(),
            'ip': form.find("input[name=ip]").val(),
            'switch': form.find("input[name=switch]").val(),
            'port': form.find("input[name=port]").val(),
            'street': form.find("input[name=street]").val()
        };
        $('#equipment-list thead th').each(function () {
            var title = $(this).text();
            $(this).html('<input type="text" placeholder="Поиск ' + title + '" />');
        });

        var datastring = form.serialize();
        console.log(datastring);
        var table = $('#equipment-list').DataTable({
            "ajax": {
                "url": "/inventory/equipment2/search/",
                "beforeSend": function (request) {
                    return request.setRequestHeader('X-CSRF-Token', $("meta[name='csrf-token']").attr('content'));
                },
                "type": "POST",
                "data": data,
                "dataType": 'json'
            },
            "order": [[1, "asc"], [0, "asc"]],
            "columnDefs": [{
                "targets": 0,
                "data": function (row, type, val, meta) {
                    if (typeof row['0'] != "undefined") {
                        return "<a href='/inventory/equipment/view/" + row['0'] + "' target='_blank'>" + row['0'] + "</a>";
                    } else {
                        return;
                    }
                }
            }]
        });
        // Apply the search

        table.columns().every(function () {
            var that = this;

            $('input', this.header()).on('keyup change', function () {
                if (that.search() !== this.value) {
                    that
                        .search(this.value)
                        .draw();
                }
            });
        });


    } else {
        $('#equipment-list-wrap').hide();
    }
}

function initMap () {
    map = new ymaps.Map('house-map-wrap', {
            center: [55.753559, 37.609218],
            zoom: 15
        }, {
            searchControlProvider: 'yandex#search'
        }),
    objectManager = new ymaps.ObjectManager({
        gridSize: 32,
        clusterize: true
    });

    objectManager.objects.options.set('preset', 'islands#yellowIcon');
    objectManager.clusters.options.set('preset', 'islands#greenClusterIcons');
    map.geoObjects.add(objectManager);

    return objectManager;
}

function saveMac(mac, route) {
    if (validMac(mac)) {
        $.ajax({
            type: "POST",
            "beforeSend": function (request) {
                return request.setRequestHeader('X-CSRF-Token', $("meta[name='csrf-token']").attr('content'));
            },
            url: "/inventory/equipment2/setmac",
            data: ({
                "route": route,
                "mac": mac
            }),
            success: function (a) {
                if (a) {
                    if (a.error == 0 ) {
                        alert("Мак адрес успешно изменен");
                    } else {
                        alert(a.msg);
                    }
                } else {
                    alert("Системаня ошибка");
                }
            },
            error: function (xhr) {
                alert("Ошибка при изменении мака.");
            }
        });
    }
}

function reinitMap(om) {
    var s=regions();
    if (s=='') return;
    om.removeAll();
    $.ajax({
        url: "/inventory/buildings-map/"+s
    }).done(function(data) {
        if (data.features.length>0) {
            om.add(data);
        }
        var lp = data.features[data.features.length-1].geometry.coordinates;
        map.setCenter(lp, 12);
    });
}

function regions() {
    var s='';
    $('#region-select option:selected').each(function() {
        var v = $(this).val();
        if (v == 0) {return;}
        s = s+v+',';
    });
    if (s=='') {
        s='all';
    } else {
        s=s.slice(0, -1)
    }
    return s;
}

function validMac(mac) {
    var re = /^(([0-9A-Fa-f]{2}[\.\-:]){5}[0-9A-Fa-f]{2})|(([0-9A-Fa-f]{4}[\.:\-]){2}[0-9A-Fa-f]{4})$/i;
    return re.test(mac);
}

function get_data(target){
    if (target == 'types'){
        type = get_cookie('type');
        if (type == null){
            document.cookie = "type=" + escape("2")
                + "; expires=15/02/2023 00:00:00";
            type = get_cookie('type');
        }
    }
    $.ajax({
        type: "GET",
        url: "/ajax/nagios.rep/get_data.php",
        data: ({
            "target"        : target,
            "type"          : type,
        }),
        success: function(a){
            //alert('reload left');
            if (target == 'left'){
                $('#left_table').html(a);
            } else if (target == 'right'){
                $('#right_table').html(a);
            } else if (target == 'types'){
                $('#select').html(a);
                $("#type [value='"+type+"']").attr("selected", "selected");
            } else {
                alert("Не указан блок вывода");
            }
        }
    });
}

function left_timer(){
    time = $('#left_timer').text();
    if (time == '00'){
        time = "61";
        get_data('left');
    }
    time = parseInt(time, 10)-1;
    time = String(time);
    if (String(time.length) == 1){
        time = "0"+String(time);
    }
    $('#left_timer').text(time);
}

function right_timer(){
    time = $('#right_timer').text().split(':');
    if (time[1] == '00'){
        time[0] = parseInt(time[0], 10)-1;
        time[1] = 60;
    }
    if (time[0] == '00'){
        time[0] = 14;
        get_data('right');
    }
    time[1] = parseInt(time[1], 10)-1;
    time[1] = String(time[1]);
    time[0] = String(time[0]);
    if (String(time[1].length) == 1){
        time[1] = "0"+String(time[1]);
    }

    if (String(time[0].length) == 1){
        time[0] = "0"+String(time[0]);
    }

    $('#right_timer').text(time[0]+":"+time[1]);
}

function fullscreen(element) {
    if(element.requestFullScreen) {
        element.requestFullScreen();
    } else if(element.mozRequestFullScreen) {
        element.mozRequestFullScreen();
    } else if(element.webkitRequestFullScreen) {
        element.webkitRequestFullScreen();
    }
    $("#fs").text('');
}

