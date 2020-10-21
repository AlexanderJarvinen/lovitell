<?php

namespace App\Providers;

use Auth;
use App\Components\Register;
use Illuminate\Contracts\Auth\Access\Gate as GateContract;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * The policy mappings for the application.
     *
     * @var array
     */
    protected $policies = [
        'App\Model' => 'App\Policies\ModelPolicy',
    ];

    /**
     * Register any application authentication / authorization services.
     *
     * @param  \Illuminate\Contracts\Auth\Access\Gate  $gate
     * @return void
     */
    public function boot(GateContract $gate)
    {
        $this->registerPolicies($gate);

        Auth::provider('dbldap', function($app, array $config) {
            // Return an instance of Illuminate\Contracts\Auth\UserProvider...
            return new DBLdapUserProvider($app['\App\Components\Register']);
        });
    }
}
