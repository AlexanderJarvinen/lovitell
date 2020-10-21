var $ = require('jquery');
var AdminLTE = require('admin-lte');
// this line causes the crash: AdminLTE is undefined -- neither accessing it as a member
// of $ nor globally works

