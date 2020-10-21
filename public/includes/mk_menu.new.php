<?php
require($_SERVER['DOCUMENT_ROOT'].'/ajax/db.php');
require($_SERVER['DOCUMENT_ROOT'].'/includes/functions.php');
    $numErrorConnections=5;
    $login='mj';
    $password='goldwing8517';
    while (!($db = mssql_connect($ip, $login, $password)) && $numErrorConnections--) sleep(1);
    if (!$db){
        echo "ошибка";
    }
    mssql_select_db ("bill", $db);
    $result = mssql_query("exec pss..create_menu 0",$db);
    //Если в базе данных есть записи, формируем массив
    if   (mssql_num_rows($result) > 0){
        $cats = array();
	//В цикле формируем массив разделов, ключом будет id родительской категории, а также массив разделов, ключом будет id категории
        while($cat =  mssql_fetch_assoc($result)){
    	    $cats_ID[$cat['id']][] = $cat;
            $cats[$cat['parent']][$cat['id']] =  $cat;
        }
/*    echo "<pre>";
    var_dump($cats);
    echo "</pre>";
*/    }

function build_tree($cats,$parent,$count,$only_parent = false){
    if(is_array($cats) and isset($cats[$parent])){
        if ($count != 0) $tree = '<ul class="submenu">';
        if($only_parent==false){
            foreach($cats[$parent] as $cat){
        	if($cat['command'] != '') $cmd = 'onClick=report('.$cat['id'].')';
        	else $cmd = '';
        	$tree .='<li class="" onClick=l1_title('.cyr($cat['desk']).') title="'.cyr($cat['note']).'">';
        	$tree .=    '<a href="#" class="dropdown-toggle" '.$cmd.'>';
        	$tree .=	'<i class="menu-icon fa fa-caret-right"></i>';
        	$tree .=	'<span class="menu-text">';
        	$tree .=		cyr($cat['desk']);
        	$tree .=	'</span>';
        	$tree .=	'<b class="arrow fa fa-angle-down"></b>';
        	$tree .=    '</a>';
                $tree .=  build_tree($cats,$cat['id'],1);
            }
        }elseif(is_numeric($only_parent)){
        	$tree .='<li class="" onClick=l1_title('.cyr($cat['desk']).') title="'.cyr($cat['note']).'">';
        	$tree .=    '<a href="#" class="dropdown-toggle" onClick=report('.$cat['id'].')>';
        	$tree .=	'<i class="menu-icon fa fa-caret-right"></i>';
        	$tree .=	'<span class="menu-text">';
        	$tree .=		cyr($cat['desk']);
        	$tree .=	'</span>';
        	$tree .=	'<b class="arrow fa fa-angle-down"></b>';
        	$tree .=    '</a>';
                $tree .= '</li>';
        }
        if ($count != 0) $tree .= '</ul>';
        //$tree .= '';
    }
    else return null;
    return $tree;
}
echo build_tree($cats,0,0);

?>
