<?php
function cyr($str) {
  return iconv('cp1251','utf8', $str);
}

function json_thead($json_str) {
    $c_i=0;
    $template_head='111';
    
    $out_str="<tr>\n";
    while ( $json_str->col[$c_i]->row[0]->desk[0]){
	$out_str.="<th align=\"center\" ";
	if ($json_str->col[$c_i]->row[0]->tooltip[0] != ''){
	    $out_str.=" title=\"".$json_str->col[$c_i]->row[0]->tooltip[0]."\" ";
	}
	if (!$json_str->col[$c_i]->row[1]->desk[0]){
	    $out_str.=" rowspan=2>\n";
	} else {
	    $c_sd=0;
	    while ( $json_str->col[$c_i]->row[1]->desk[$c_sd]){
		$c_sd++;
	    }
	    $out_str.= " colspan=".$c_sd.">\n";
	}
	$out_str.=$json_str->col[$c_i]->row[0]->desk[0];
	$out_str.="</th>\n";
	$c_i++;
    }
    $out_str.="</tr>\n";
    $c_i=0;
    $out_str.="<tr>\n";
    while ( $json_str->col[$c_i]->row[1] || $json_str->col[$c_i]->row[0]){
	$c_sd=0;
	    while ( $json_str->col[$c_i]->row[1]->desk[$c_sd]){
		$out_str.="<th align=\"center\" ";
		if ($json_str->col[$c_i]->row[1]->tooltip[$c_sd] != ''){
		    $out_str.=" title=\"".$json_str->col[$c_i]->row[1]->tooltip[$c_sd]."\" ";
		}
		$out_str.=" >";
		$out_str.=$json_str->col[$c_i]->row[1]->desk[$c_sd]."</th>\n";
		$c_sd++;
	    }
	$c_i++;
    }
    $out_str.="</tr>\n";
    $ret['out_str'] = $out_str;
    #return $ret;
    return $out_str;
}

function json_thead_3r($json_str) {
    $c_i=0;
    $max=0;
    while ( $json_str->col[$c_i]->row[0]){
	$r_i=0;
	while ( $json_str->col[$c_i]->row[$r_i]){
	    $r_i++;
	    if($max < $r_i)$max=$r_i;
	}
	$c_i++;
    }
# 1st row
    $c_i=0;
    $out_str="<tr>\n";
    while ( $json_str->col[$c_i]->row[0]->desk[0]){
	$rowspan=1;
	$out_str.="<td align=\"center\" ";
	if (!$json_str->col[$c_i]->row[1]){
	    $rowspan++;
	}
	if (!$json_str->col[$c_i]->row[2]){
	    $rowspan++;
	}
	if (count($json_str->col[$c_i]->row) == 3) $colspan=count($json_str->col[$c_i]->row[2]->desk);
	else if (count($json_str->col[$c_i]->row) == 2) $colspan=count($json_str->col[$c_i]->row[1]->desk);
	else $colspan=1;
	$out_str.=" rowspan=".$rowspan." colspan=".$colspan.">\n";
	$out_str.=$json_str->col[$c_i]->row[0]->desk[0]."</td>";
	$c_i++;
    
    }
    $out_str.="</tr>\n";

# 2nd row
    $c_i=0;
    $out_str.="<tr>\n";
    while ( $json_str->col[$c_i]){
	$rowspan=1;
	if (!$json_str->col[$c_i]->row[2]){
	    $rowspan++;
	}
	if (count($json_str->col[$c_i]->row) == $max){
	    $c_sd=0;
	    while($json_str->col[$c_i]->row[1]->desk[$c_sd]){
		$out_str.="<td align=center ";
		$out_str.=" rowspan=".$rowspan.">\n";
		$out_str.=$json_str->col[$c_i]->row[1]->desk[$c_sd]."</td>";
		$c_sd++;
	    }
	}
	$c_i++;
    }
    $out_str.="</tr>\n";

# 3nd row
    $c_i=0;
    $out_str.="<tr>\n";
    while ( $json_str->col[$c_i]){
	if (count($json_str->col[$c_i]->row) == $max-1){
	    $c_sd=0;
	    while($json_str->col[$c_i]->row[1]->desk[$c_sd]){
		$out_str.="<td align=center ";
		$out_str.=">\n";
		$out_str.=$json_str->col[$c_i]->row[1]->desk[$c_sd]."</td>";
		$c_sd++;
	    }
	
	}else 	if (count($json_str->col[$c_i]->row) == $max){
	    $c_sd=0;
	    while($json_str->col[$c_i]->row[2]->desk[$c_sd]){
		$out_str.="<td align=center ";
		$out_str.=">\n";
		$out_str.=$json_str->col[$c_i]->row[2]->desk[$c_sd]."</td>";
		$c_sd++;
	    }
	

	
	}
	$c_i++;
    }
    
    return $out_str;
}
?>
