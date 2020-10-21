var elixir = require('laravel-elixir');

/*
 |--------------------------------------------------------------------------
 | Elixir Asset Management
 |--------------------------------------------------------------------------
 |
 | Elixir provides a clean, fluent API for defining some basic Gulp tasks
 | for your Laravel application. By default, we are compiling the Sass
 | file for our application, as well as publishing vendor resources.
 |
 */

elixir(function(mix) {
/*    mix.browserify('test.js')
        .styles([
            './node_modules/admin-lte/bootstrap/css/bootstrap.min.css',
            './node_modules/admin-lte/dist/css/AdminLTE.min.css',
            './node_modules/admin-lte/dist/css/skins/skin-blue.min.css'
        ], 'public/css/common.css')
        .copy('./node_modules/admin-lte/plugins/iCheck/square/blue.css', 'public/css/plugins/iCheck/blue.css')
        .copy('./node_modules/admin-lte/dist/js/app.min.js', 'public/js/lib/admin-lte.min.js')
        .copy('./node_modules/admin-lte/bootstrap/js/bootstrap.min.js', 'public/js/lib/bootstrap.min.js')
        .copy('./node_modules/admin-lte/plugins/jQuery/jQuery-2.2.3.min.js', 'public/js/lib/jquery.min.js');
    mix.browserify('login.js');
    mix.browserify('profile/components/profileApp.js', 'public/js/profile/profile.js');
    mix.browserify('common/components/Sidebar.react.js', 'public/js/common/sidebar.js');*/
    mix.browserify('common/components/Dashboard.js', 'public/js/common/dashboard.js');
    mix.browserify('report/components/Report.js', 'public/js/report/report.js');
    /*mix.browserify('common/components/Controlbar.js', 'public/js/common/control-sidebar.js');*/
});
