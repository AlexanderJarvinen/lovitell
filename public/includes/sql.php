<?php
error_reporting(E_ALL);

class sybase
{
    var $MS_IP = '172.29.1.5';
    var $db;
    var $numErrorConnections = 3;
    var $login;
    var $password;


    function connect(){
        while ( !( $this->db = @mssql_connect( $this->MS_IP, $this->login, $this->password ) ) && $this->numErrorConnections-- )
        {
            sleep( 1 );
        }
        if ( !$this->db )
        {
            return false;
        }
        return true;
    }
    function execute($cmd){
        $ret = array();
        if (!$result = @mssql_query($cmd, $this->db)){
            $ret[0] = 'error';
            $ret[1]= mssql_get_last_message();

        } else {
            while ($row_tmp=mssql_fetch_assoc($result)){
                foreach ($row_tmp as $key => $val){
            	    $row[$key] = iconv('CP1251','UTF-8',$val);
                }
                $ret[]=$row;
            }
        }
        return $ret;
    }
    
    function get_left(){
	$cmd = "bill..report_alert 0";
        return $this->execute($cmd);
    }
    function get_right($type){
	$cmd = "bill..report_alert 1, ". $type;
        return $this->execute($cmd);
    }

    function get_types(){
	$cmd = "bill..report_alert 2";
        return $this->execute($cmd);
    }
}

?>
