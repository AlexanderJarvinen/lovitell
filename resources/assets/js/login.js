var icheck = require('icheck');
// this line causes the crash: AdminLTE is undefined -- neither accessing it as a member
// of $ nor globally works
$(function () {
    $('input').iCheck({
        checkboxClass: 'icheckbox_square-blue',
        radioClass: 'iradio_square-blue',
        increaseArea: '20%' // optional
    });
});

