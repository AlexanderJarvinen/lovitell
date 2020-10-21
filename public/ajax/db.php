<?php
  $ip = '172.29.1.5';
  //$login = 'mj';
  //$password = 'goldwing8517';
function msg_handler($message)
{
/*    $msg = '';
    if (257 == $msgnumber) {
            return false;
    }
*/
//    var_dump($msgnumber, $severity, $state, $line, $text);
    if (stripos($message,'permission was denied') >= 0) $msg = 'Извините, у Вас не хватает прав для выполнения этого запроса.';
?>
    <div class="col-sm-6">
	<div class="alert alert-danger">
	    <i class="ace-icon fa fa-times">&nbsp;&nbsp;</i>
    	    <?=$msg;?>
    	</div>
    </div>
    <div class="clearfix"></div>
    <?
    exit;
}
?>
