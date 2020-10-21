<?php
namespace App\Providers;

use App\Components\Register;
use App\User;
use Adldap;
use Log;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Contracts\Auth\UserProvider;
use Illuminate\Contracts\Auth\Authenticatable;


class DBLdapUserProvider
    implements UserProvider
{

    public function retrieveById($identifier)
    {
        return User::find($identifier);
    }

    public function retrieveByCredentials(array $credentials) {
        if (empty($credentials)) {
            return;
        }
        $user = User::where('name', $credentials['name'])->first();
        if ($user == null || !Hash::check($credentials['password'], $user->password)) {
            $user = null;
            if (Adldap::auth()->attempt($credentials['name'], $credentials['password'])) {
                $user = User::findByName($credentials['name']);
                if ($user == null) {
                    Adldap::getDefaultProvider()->connect($credentials['name'], $credentials['password']);
                    $ldap_user = Adldap::search()->users()->find($credentials['name']);
                    $attr = $ldap_user->getAttributes();
                    $user = new User();
                    $user->name = $credentials['name'];
                    $user->password = bcrypt($credentials['password']);
                    $user->fullname = $attr['displayname'][0];
                    $user->email = $attr['mail'][0];
                    $user->is_auth = true;
                    $user->save();
                }
            }
        }
        return $user;
    }

    public function retrieveByToken($identifier, $token)
    {
        return User::where('id', $identifier)->where('remember_token', $token)->first();
    }

    public function updateRememberToken(Authenticatable $user, $token) {
        $user->setRememberToken($token);

        $user->save();
    }

    public function validateCredentials(Authenticatable $user, array $credentials) {
        if ($user->name == $credentials['name'] && Hash::check($credentials['password'], $user->password)) {
            return true;
        } else {
            return Adldap::auth()->attempt($credentials['name'], $credentials['password']);
        }
    }
}
