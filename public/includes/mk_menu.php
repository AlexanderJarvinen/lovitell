<?
require($_SERVER['DOCUMENT_ROOT'].'/includes/functions.php');
require($_SERVER['DOCUMENT_ROOT'].'/ajax/db.php');
require($_SERVER['DOCUMENT_ROOT'].'/includes/db.class.php');
#require($_SERVER['DOCUMENT_ROOT'].'/includes/sql.class.php');
#require($_SERVER['DOCUMENT_ROOT'].'/includes/db.cfg.php');

$numErrorConnections=5;
session_start();
#$login='mj';
#$password='goldwing8517';
$login=$_SESSION['login'];
$password=$_SESSION['password'];
#var_dump($_SESSION);
while (!($db = mssql_connect($ip, $login, $password)) && $numErrorConnections--) sleep(1);
    if (!$db){
	echo "Ошибка! Не могу подключиться к DB";
}
mssql_select_db ("pss", $db);
$result = mssql_query("exec pss..create_menu 0", $db);            
$RS = new CResultSet();
while ( $Row = mssql_fetch_object($result) ){
//    var_dump($Row);
//    print '<br>';
    $Record = new CRecord();
    $Record->Add( new CField( 'id', cyr( $Row->id ) ) );
    $Record->Add( new CField( 'desk', cyr( $Row->desk ) ) );
    $Record->Add( new CField( 'parent', cyr( $Row->parent ) ) );
    $Record->Add( new CField( 'command', cyr( $Row->command ) ) );
    $Record->Add( new CField( 'icon', cyr( $Row->icon ) ) );
    $Record->Add( new CField( 'note', cyr( $Row->note ) ) );
    $RS->Add( $Record );
}
//exit;
$RS2 = clone $RS;
$RS3 = clone $RS2;
$l2=$l3=0;
$RS->First();

while ($RT = $RS->Next()) {
    if ($RT->GetValue('parent') == 0){
	?><li class="" onClick=l1_title('<?=$RT->GetValue('desk')?>'); title="<?=$RT->GetValue('note')?>">
	   <a href="#" class="dropdown-toggle" <?if ($RT->GetValue('command') != '') echo "onClick=report(".$RT->GetValue('id').")";?>>
	    <i class="menu-icon fa fa-caret-right"></i>
	    <span class="menu-text">
		<?=$RT->GetValue('desk')?>
	    </span>
	    <b class="arrow fa fa-angle-down"></b>
	  </a><?
	$RS2->First();
	while($RT2 = $RS2->Next()){
	    if ($RT2->GetValue('parent') == $RT->GetValue('id')){
		?><b class="arrow"></b>
		  <? if ($l2 == 0) echo "<ul class=\"submenu\">";?>
		  <li class="" onClick=l2_title('<?=$RT2->GetValue('desk')?>'); title="<?=$RT2->GetValue('note')?>">
		  <a href="#" class="dropdown-toggle" <?if ($RT2->GetValue('command') != '') echo "onClick=report(".$RT3->GetValue('id').")";?>>
		    <i class="menu-icon fa fa-pencil orange"></i>
			<?=$RT2->GetValue('desk');?>
		    <b class="arrow fa fa-angle-down"></b>
		  </a><?
		$RS3->First();
		while($RT3 = $RS3->Next()){
		    if ($RT3->GetValue('parent') == $RT2->GetValue('id')){
			//<b class="arrow"></b>
			if ($l3 ==0 ) echo "<ul class=\"submenu\">"; // submenu start
			?><li class="" id="<?=$RT3->GetValue('id')?>" title="<?=$RT3->GetValue('note')?>">
			  <a href="#" <?if ($RT3->GetValue('command') != '') echo "onClick=report(".$RT3->GetValue('id').")";?>>
			    <i class="menu-icon fa fa-plus purple"></i>
				<?=$RT3->GetValue('desk');?>
			  </a>
			  <b class="arrow"></b>
			</li>
			<?
		    $l3++;
		    }
		}
		if($l3 > 0) {$l3=0; echo "</ul>";}//Submenu end
	        $l2++;?></li><?
	    }
	}
    if ($l2 > 0) {echo "</ul>"; $l2=0;}
    }
}
?></li><?
