<?php

namespace App;
use App\Components\Helper;
use Doctrine\DBAL\Driver\PDOException;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Crypt;
use DB;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Log;
use Session;
use Config;
use Adldap;
use Auth;
use Hash;

/**
 * Class User Check user credentials, and permissions to different services
 * @package App
 */

class User extends Authenticatable
{

    public $is_auth;
    public $is_connect;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name', 'password', 'fullname', 'db_password', 'email'
    ];

    /**
     * The attributes excluded from the model's JSON form.
     *
     * @var array
     */
    protected $hidden = [
        'password', 'remember_token',
    ];

    /**
     * Class initByDb
     *
     * TODO check for not using and remove
     * @param $login
     * @param $password
     */

    public function initByDb($login, $password) {
        try {
            $user = $this->dbUserAuth($login, $password);
            if (is_array($user)) {
                $this->id = $user['man'];
                $this->name = $login;
                $this->password = bcrypt($password);
                $this->fullname = iconv('cp1251', 'utf8', $user['name']);
                $this->is_auth = true;
                $this->save();
            }
        } catch (PDOException $e) {
            $this->is_auth = false;
        }
    }

    public function validateCredentials(array $credentials) {
        return parent::validateCredentials($credentials);
    }

    public function retrieveByCredentials(array $credentials) {
        $user = null;
        if (!($user = User::where('name', $credentials['name'])->where('password', bcrypt($credentials['password']))->firstOrFail())) {
            if (Adldap::auth()->attempt($credentials['username'], $credentials['password'])) {
                if ($user = $this->findByName($credentials['name'])) {
                    return $this;
                } else {
                    Adldap::getDefaultProvider()->connect($credentials['username'], $credentials['password']);
                    $user = Adldap::search()->users()->find($credentials['username']);
                }
            }
        }
        return $user;
    }

    /**
     * Function try to initial billing db connection by
     * credentials in user settings
     *
     * @return int
     */

    public function initDbConnection() {
        if ($this->db_password) {
            try {
                Config::set('database.connections.sqlsrv.username', $this->db_login);
                Config::set('database.connections.sqlsrv.password', $this->db_password);
                DB::connection('sqlsrv')->reconnect();
                $r = DB::connection('sqlsrv')->select('EXEC pss..user_auth');
                if (isset($r[0]->man)) {
                    $this->is_connect = 1;
                    return 1;
                } else {
                    $this->is_connect = -1;
                    return -1;
                }
            } catch (\PDOException $e) {
                $this->is_connect = -1;
                return -1;
            }
        } else {
            $this->is_connect = 0;
            return 0;
        }
    }

    public function closeConnection() {
        DB::disconnect('sqlsrv');
    }

    /**
     * Decrypt user password for billing db
     * not used now
     *
     * @param $password
     */

    public function decryptDbPassword($password) {
        if ($this->db_password != '') {
            Crypt::setCipher($password);
            Session::set('db_password', Crypt::decrypt($this->db_password));
        }
    }

    /**
     * Check permissions for current user
     *
     * TODO Try to use
     * @param $login
     * @param $password
     * @return bool
     */

    public function checkPermissions($login, $password) {
        $user = $this->dbUserAuth($login, $password);
        if (is_array($user)) {
            if (isset($user['man'])) {
                $this->is_auth = true;
                return true;
            } else {
                $this->is_auth = false;
                return false;
            }
        } else {
            $this->is_auth = false;
            return false;
        }
    }

    /**
     * Find user by name
     * @param $name User name
     * @return mixed
     */

    static function findByName($name) {
        return User::where('name', '=', $name)->first();
    }

    static function dbUserAuth($login, $password) {
        try {
            config(['database.sqlsrv.username' => $login]);
//                     'database.sqlsrv.password' => $password]);
            $r = DB::connection('sqlsrv')->select('EXEC pss..user_auth');
            $user['man'] = $r[0]->man;
            $user['name'] = $r[0]->user;
        } catch (\ErrorException $e) {
            return false;
        }
        return $user;
    }

    /**
     * return billing connection
     *
     * TODO try remove
     * @return bool
     */

    public function getBillingConnection() {
        try {
            $c = @mssql_connect(env('BILLING_DB_HOST', 'localhost'), $name, $pass);
        } catch (\ErrorException $e) {
            print_r($e);
            $this->is_auth = false;
            return false;
        }
    }

    /**
     * Delete user avatar.
     * @return bool. False if file not found or access restricted
     */
    public function deleteAvatar() {
        $filename = public_path()."/img/avatar/".$this->name.".jpg";
        if (is_file($filename)) {
            return(unlink($filename));
        } else {
            return false;
        }
    }

    /**
     * Check module permissions
     * @param $name - user login in billing
     * @return bool
     */

    public function checkModulePermissions($name) {
        try {
            switch($name) {
                case "inventory":
                    $r = DB::connection('sqlsrv')->select('exec bill..access_inventory');
                    return $r[0]->error == 0;
                case "reports":
                    $r = DB::connection('sqlsrv')->select('exec bill..access_reports');
                    return $r[0]->error == 0;
                case "financial":
                    $r = DB::connection('sqlsrv')->select('exec bill..access_financial');
                    return $r[0]->error == 0;
                case "commercial":
                    $r = DB::connection('sqlsrv')->select('exec bill..access_sales');
                    return $r[0]->error == 0;
                case "documentation":
                    return true;
            }
        } catch(\PDOException $e) {
            return false;
        }
    }

    public function checkPassword($password) {
        if (Hash::check($password, $this->password)) {
            return true;
        } else {
            return Adldap::auth()->attempt($this->name, $password);
        }
    }

    public function getUserInfo() {
        $resp = [];
        try {
            $r = DB::connection('sqlsrv')->select('exec pss..user_get_info 1');
            Log::debug($r);
            if (isset($r[0])) {
                $resp['id'] = $r[0]->man;
                $resp['login'] = $r[0]->man;
                $resp['name'] = Helper::cyr($r[0]->name);
                $resp['email'] = Helper::cyr($r[0]->e_mail);
                $resp['phone'] = Helper::cyr($r[0]->phone);
                return $resp;
            } else {
                return false;
            }
        } catch(\PDOException $e) {
            Log::error('getUserInfo EXCEPTION');
            Log::debug($e->getMessage());
            return false;
        }
    }
}
