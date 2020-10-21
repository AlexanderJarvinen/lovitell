var table = null;
var coord_map=null;

$(function() {
    $('#get-coord-data').click(function() {
        if ($(this).html() == 'Показать') {
            $(this).html('Обновить');
            initCoordTable();
        }
        initCoordTable();
    });

    $('.select_all').change(function () {
        if ($(this).prop('checked')) {
            table.rows().nodes().to$().each(function (r, i) {
               $(this).find('.coord-select input[type=checkbox]').prop('checked', true);
            });
        } else {
            table.rows().nodes().to$().each(function (r, i) {
                $(this).find('.coord-select input[type=checkbox]').prop('checked', false);
            });
        }
    });

    $('.save_select').change(function () {
        if ($(this).prop('checked')) {
            table.rows().nodes().to$().each(function (r, i) {
                $(this).find('.status input[type=checkbox]').prop('checked', true);
            });
        } else {
            table.rows().nodes().to$().each(function (r, i) {
                $(this).find('.status input[type=checkbox]').prop('checked', false);
            });
        }
    });

    ymaps.ready(function () {
        coord_map = new ymaps.Map('coord_map', {
            center: [55.753559, 37.609218],
            zoom: 15
        }, {
            searchControlProvider: 'yandex#search'
        });

        coord_map.events.add('balloonopen', function (event) {
            var aid = $("ymaps input[type=checkbox]").data("addressid");
            var state = null;
            table.rows().nodes().to$().each(function (r, i) {
                var row = $(this);
                if (row.data("addressid") != aid) {
                    return;
                }
                state = row.find(".save-coord").prop('checked');
            });
            $("ymaps input[type=checkbox]").prop("checked", state);
        });
    });

});

/* Create an array with the values of all the checkboxes in a column */
$.fn.dataTable.ext.order['dom-checkbox'] = function  ( settings, col )
{
    return this.api().column( col, {order:'index'} ).nodes().map( function ( td, i ) {
        return $('input', td).prop('checked') ? '1' : '0';
    } );
}

function initCoordTable(param) {
    $('#coordinate-list').dataTable().fnDestroy();
    $('.select_all').prop('checked', false);
    $('.save_select').prop('checked', false);
    var s=regions();
    var empty = $('.only_empty').prop('checked') ? '1' : '0';
    if (s=='') return;
    $('#coordinate-list tfoot th.searchable').each( function () {
        var title = $(this).text();
        $(this).html( '<input type="text" placeholder="Поиск '+title+'" />' );
    } );

    table = $('#coordinate-list').DataTable( {
        ajax: "/inventory/buildings/coordinate/"+s+"?empty="+empty,
        createdRow: function (row, data, rowIndex) {
            $(row).attr('data-addressid', data['address_id']);
        },
        columns: [
            {
                data: function (row, type, val, meta) {
                    return '<input type="checkbox">';
                },
                width: '5%',
                orderDataType: "dom-checkbox",
                className: 'coord-select'
            },
            {
                data: "city",
                className: "city"
            },
            {
                data: "region",
                className: "region"
            },
            {
                data: "street",
                className: "street"
            },
            {
                data: "house",
                render  : function ( data, type, row ) {
                    return data;
                },
                className: "house",
                width: "8%"
            },
            {
                data: "type",
                className: "type"
            },
            {
                data: "state",
                className: "state",
                width: "10%"
            },
            {
                data:   "latitude",
                render  : function ( data, type, row ) {
                    return data ? data : '';
                },
                className: 'coordinates yandex latitude'
            },
            {
                data: "longitude",
                render: function ( data, type, row ) {
                    return data ? data : '';
                },
                className: 'coordinates yandex longitude'
            },
            {
                data: "yandex_map",
                render: function ( data, type, row ) {
                    return "";
                },
                className: 'yandex_address'
            },
            {
                data: function(row, type, val, meta) {
                    return "";
                },
                className: 'status',
                orderable: false,
                width: "5%"
            }
        ]
    } );
    $('#coordinate-list').on('click', 'td.street', function(e) {
        if ($(this).closest('td').find('input').length > 0) {
            return;
        }
        var address = $(this).closest('td').text();
        var val = "<input type='text' class='street-edit' value='"+address+"'>";
        $(this).html(val);
        $(this).on('keypress', '.street-edit', function (e) {
            if (e.keyCode == 13) {
                var new_address = $(this).val();
                $(this).parent().html(new_address);
            }
            return true;
        });
        $(document).on('click', '.street-edit', function(e) {
            e.preventDefault();
            return false;
        });
        e.preventDefault();
    });

    $('#coordinate-list').on('click', 'td.house', function(e) {
        if ($(this).closest('td').find('input').length > 0) {
            return;
        }
        var address = $(this).closest('td').text();
        var val = "<input type='text' class='house-edit' value='"+address+"'>";
        $(this).html(val);
        $(this).on('keypress', '.house-edit', function (e) {
            if (e.keyCode == 13) {
                var new_address = $(this).val();
                $(this).parent().html(new_address);
            }
            return true;
        });
        $(document).on('click', '.house-edit', function(e) {
            e.preventDefault();
            return false;
        });
        e.preventDefault();
    });

    $('#coordinate-list').on('click', 'td.coordinates', function(e) {
        if ($(this).closest('td').find('input').length > 0) {
            return;
        }
        var address = $(this).closest('td').text();
        var val = "<input type='text' class='coordinates-edit' value='"+address+"'>";
        $(this).html(val);
        $(this).on('keypress', '.coordinates-edit', function (e) {
            if (e.keyCode == 13) {
                var new_address = $(this).val();
                $(this).parent().html(new_address);
            }
            return true;
        });
        $(document).on('click', '.coordinates-edit', function(e) {
            e.preventDefault();
            return false;
        });
        e.preventDefault();
    });

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
}

$(".fill_by_yandex2").click(function() {
    $('.save_select').prop('checked', false);
    var lp = [];
    var la = 0;
    table.rows().nodes().to$().each(function (r, i) {
        var row = $(this);
        if (!row.find(".coord-select input[type=checkbox]").prop('checked')) return;
        var address = $(this).find(".city").text()+", "
                     +$(this).find(".region").text()+", ул."
                     +$(this).find(".street").text()+" "
                     +$(this).find(".house").text();
        var address_id = row.data("addressid");
        var lo = address_id;
        console.log(address);
        var mark = null;
        $.ajax({
            type: "POST",
            url: "/inventory/get-yandex-coord",
            data: ({
                "address_string": address,
                "address_id":address_id
            }),
            success: function (a) {
                if (a) {
                    row.find('td.latitude').text(a[1]);
                    row.find('td.longitude').text(a[0]);
                    row.find('td.yandex_address').text(a['address']);
                    row.find('td.status').html('<input type="checkbox" name="save-coord" class="save-coord" onclick="checkMapSave('+a['address_id']+');">');
                    if (lo == address_id) {
                        lp = [a[1], a[0]];
                        coord_map.setCenter(lp, 12);
                        console.log(lp);
                    }
                    mark = new ymaps.Placemark([a[1], a[0]], {
                        iconContent: address_id,
                        balloonContent: address + "<br><input type='checkbox' class='save-coord' onload='checkMapSave("+address_id+")' onclick='checkTableSave("+a['address_id']+");' data-addressid='"+address_id+"' > сохранить"
                    }, {preset: 'islands#blackStretchyIcon'});
                    coord_map.geoObjects.add(mark);
                }
            }
        });
    });
    $('save_coordinates').prop( "disabled", false );
});

$('.save_coordinates2').click(function() {
    table.rows().nodes().to$().each(function (r, i) {
        var row = $(this);
        if (!row.find(".status input[type=checkbox]").prop('checked')) return;
        var latitude = row.find('td.coordinates.latitude').text();
        var longitude = row.find('td.coordinates.longitude').text();
        var address_id = row.data("addressid");
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
                            row.find('.status').text("V").addClass("success");
                        } else {
                            row.find('.status').text("X").addClass("error");
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
});

function checkTableSave(address_id) {
    var state = $("ymaps input[data-addressid="+address_id+"]").prop("checked");
    table.rows().nodes().to$().each(function (r, i) {
        var row = $(this);
        if (row.data("addressid") != address_id) {
            return;
        }
        row.find(".save-coord").prop('checked', state);
    });
}

function checkMapSave(address_id) {
    var state = null;
    table.rows().nodes().to$().each(function (r, i) {
        var row = $(this);
        if (row.data("addressid") != address_id) {
            return;
        }
        state = row.find(".save-coord").prop('checked');
    });
    console.log(state);
    var check = $("ymaps input[data-addressid="+address_id+"]")
    check.prop('checked', state);
}