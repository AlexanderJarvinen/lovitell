<?

require('db.php');
$numErrorConnections=5;

if ($_POST['act'] == 'logout'){

    setcookie("password", $_POST['password']);
    setcookie("login", $_POST['login']);
    session_start();
    session_destroy();
    echo json_encode( array('err' => 1, 'login' => $_SESSION['login'], 'password' => $_SESSION['password']));
    exit;
}

//Проверим логин и пароль в куках и установим в сессию
if ($_COOKIE["login"] !='' && $_COOKIE["password"] != ''){
    session_start();
    $_SESSION['login']=$_COOKIE["login"];
    $_SESSION['password']=$_COOKIE["password"];
}

// Проверим логин и пароль в сессии
if ($_SESSION['password'] != '' && $_SESSION['login'] != ''){
	while (!($db = @mssql_connect($ip, $_SESSION['login'], $_SESSION['password'])) && $numErrorConnections--) sleep(0.1);
	if (!$db){
	    $err=1;
	    $_SESSION['login']='';
	    $_SESSION['password']='';
	} else {
	    $err=0;
	}
}
else {
	while (!($db = @mssql_connect($ip, $_POST['login'], $_POST['password'])) && $numErrorConnections--) sleep(0.1);
	if (!$db){
	    $err=1;
	    session_start();
	    $_SESSION['login']='';
	    $_SESSION['password']='';
	} else {
	    $err=0;
	    session_start();
	    $_SESSION['login']=$_POST['login'];
	    $_SESSION['password']=$_POST['password'];
	    if($_POST['remember']=='on'){
		setcookie("password", $_POST['password']);
		setcookie("login", $_POST['login']);
	    }
	}
}
$arr = array('err' => $err, 'login' => $_SESSION['login'], 'password' => $_SESSION['password']);
echo json_encode($arr);
?>
