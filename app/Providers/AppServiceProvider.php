<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use \App\Components\Menu\Menu;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {
        $this->app->singleton('\App\Components\Menu\Menu', function()
        {
            return new Menu();
        });
    }

    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        //
    }
}
