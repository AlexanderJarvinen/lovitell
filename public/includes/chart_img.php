<?php
 date_default_timezone_set( 'Europe/Moscow' );
 require('../ajax/db.php');
 $numErrorConnections=5;
 $login='mj';
 $password='goldwing8517';
 while (!($db = mssql_connect($ip, $login, $password)) && $numErrorConnections--) sleep(1);
 if (!$db){
     echo "ошибка";
 }
    if ($_GET['group'] != 2) $group=0;
    else {
	    $group=2; 
	    $_GET['type']=255;
    }
 mssql_select_db ("bill", $db);
    if ($_GET['id'] == 3){
	$qry = "exec report_avaiable_total 0,'".$_GET['start']."','".$_GET['end']."',3,".$_GET['type'].",".$group;
	$ttl = "From Months";
    }
    else if ($_GET['id'] == 2){
	$qry = "exec report_avaiable_total 0,'".$_GET['start']."','".$_GET['end']."',2,".$_GET['type'].",".$group;
	$ttl = "From Weeks";
    }
    else if ($_GET['id'] == 1){
	$qry = "exec report_avaiable_total 0,'".$_GET['start']."','".$_GET['end']."',1,".$_GET['type'].",".$group;
	$ttl = "From Days";
    }
    else if ($_GET['id'] == 222){
	$qry = "exec report_avaiable_total 99999,'".$_GET['start']."','".$_GET['end']."',1,255,2";
	$ttl = "From Weeks";
    }
    else exit;

 #$qrs=array($qry_month => $ttl_month, $qry_week => $ttl_week, $qry_day => $ttl_day);
 #$result = mssql_query("exec report_avaiable_total 0,'05.01.2015','05.25.2015',1",$db);
 #$result = mssql_query("$qry_month",$db);
 /* pChart library inclusions */ 
 include($_SERVER['DOCUMENT_ROOT']."/js/pChart2.1.4/class/pData.class.php"); 
 include($_SERVER['DOCUMENT_ROOT']."/js/pChart2.1.4/class/pDraw.class.php"); 
 include($_SERVER['DOCUMENT_ROOT']."/js/pChart2.1.4/class/pImage.class.php"); 
 $month=array('Янв','Фев','Мар','Апр','Май','Июн','Июл','Авг','Сен','Окт','Ноя','Дек');
 $week=array("вс", "пн","вт","ср","чт","пт","сб");

    $result = mssql_query($qry,$db);
    $dates=$avail=$Palette=array();
    while ($row = mssql_fetch_assoc($result)){
	if ($_GET['id'] == 222) {
	    $utf_desk= iconv('windows-1251','utf-8',$row['desk']);
	    array_push($dates, $utf_desk );
	}
	else {
		$mon = 0+substr($row['started'],4,2);
	    if ($_GET['id'] == 3){
		$ddate = $month[$mon-1].' '.substr($row['started'],2,2).' ';
	    } else if ($_GET['id'] == 2){
		$ddate = substr($row['started'],6,2).' '.$month[$mon-1].' '.substr($row['started'],2,2).' ';
	    }else {
		//$week[date("w",mktime (0, 0, 0, substr($row['started'],4,2), substr($row['started'],6,2), substr($row['started'],0,4)))];
		//$week[date("w",mktime (0, 0, 0,'11','11', '2015'))];
		//$date=explode("-", $date);
		//$week = date("w", mktime(0, 0, 0, $date[1], $date[2], $date[0]));
		$dnum = date("w",mktime (0, 0, 0, substr($row['started'],4,2), substr($row['started'],6,2), substr($row['started'],0,4)));
		$ddate = '      '.$week[$dnum].'
'.substr($row['started'],6,2).' '.$month[$mon-1].' '.substr($row['started'],2,2).' ';
	    }
	    array_push($dates, $ddate);
	}
    if ($_GET['type'] == -3 or $_GET['type'] == 11){
	array_push($avail, $row['avaiables']);
	    if($row['avaiables'] >= 97)
		array_push($Palette, array("R"=>78,"G"=>186,"B"=>111,"Alpha"=>100));	# зеленый
	    else if ($row['avaiables'] >= 96)
		array_push($Palette, array("R"=>244,"G"=>194,"B"=>9,"Alpha"=>100));	# желтый
	    else if ($row['avaiables'] >= 95)
		array_push($Palette, array("R"=>220,"G"=>152,"B"=>1,"Alpha"=>100));	# оранжеывй
	    else
		array_push($Palette, array("R"=>176,"G"=>1,"B"=>6,"Alpha"=>100));	# красный
    
    }
    if ($_GET['type'] == 255){
	array_push($avail, $row['avaiables']);
	    if($row['avaiables'] >= 99.8)
		array_push($Palette, array("R"=>78,"G"=>186,"B"=>111,"Alpha"=>100));	# зеленый
	    else if ($row['avaiables'] >= 99.7)
		array_push($Palette, array("R"=>244,"G"=>194,"B"=>9,"Alpha"=>100));	# желтый
	    else if ($row['avaiables'] >= 99.6)
		array_push($Palette, array("R"=>220,"G"=>152,"B"=>1,"Alpha"=>100));	# оранжеывй
	    else 
		array_push($Palette, array("R"=>176,"G"=>1,"B"=>6,"Alpha"=>100));	# красный
    
    }
    else
    {
	array_push($avail, $row['avaiables']);
	    if($row['avaiables'] >= 99.8)
		array_push($Palette, array("R"=>78,"G"=>186,"B"=>111,"Alpha"=>100));	# зеленый
	    else if ($row['avaiables'] >= 99.7)
		array_push($Palette, array("R"=>244,"G"=>194,"B"=>9,"Alpha"=>100));	# желтый
	    else if ($row['avaiables'] >= 99.5)
		array_push($Palette, array("R"=>220,"G"=>152,"B"=>1,"Alpha"=>100));	# оранжеывй
	    else
		array_push($Palette, array("R"=>176,"G"=>1,"B"=>6,"Alpha"=>100));	# красный
    }
    }
 /* CAT:Bar Chart */ 


 /* Create and populate the pData object */ 
 $MyData = new pData();   
 $MyData->addPoints($avail,"Avail"); 
 $MyData->addPoints($dates,"Date"); 
 #$MyData->setAxisName(0,"Avail"); 
 $MyData->setSerieDescription("Date","Date"); 
 $MyData->setAbscissa("Date"); 

 /* Create the pChart object 500ширина. дефолт 700 */ 
# $myPicture = new pImage(360,210,$MyData); 
 $myPicture = new pImage(360,210,$MyData); 

 /* Turn of Antialiasing */ 
 $myPicture->Antialias = FALSE; 

 /* Add a border to the picture */ 
 $myPicture->drawGradientArea(0,0,700,230,array("StartR"=>0,"StartG"=>0,"StartB"=>0,"EndR"=>180,"EndG"=>180,"EndB"=>180,"Alpha"=>100)); 
# $myPicture->drawRectangle(0,0,359,209,array("R"=>0,"G"=>0,"B"=>0)); 

 /* Set the default font */ 
 #$myPicture->setFontProperties(array("FontName"=>$_SERVER['DOCUMENT_ROOT']."/js/pChart2.1.4/fonts/pf_arma_five.ttf","FontSize"=>6)); 
 $myPicture->setFontProperties(array("FontName"=>$_SERVER['DOCUMENT_ROOT']."/js/pChart2.1.4/fonts/verdana.ttf","FontSize"=>7)); 
 /* Title */
 
 #$myPicture->drawText(5,35,$qry,array("FontSize"=>7,"Align"=>TEXT_ALIGN_BOTTOMLEFT));
 
 /* Define the chart area */ 
# $myPicture->setGraphArea(60,40,450,150); 
 $myPicture->setGraphArea(44,15,333,141); 

 /* Draw the scale */ 
# $scaleSettings = array("XMargin"=>10,"YMargin"=>10,"Floating"=>TRUE,"GridR"=>200,"GridG"=>200,"GridB"=>200,"DrawSubTicks"=>TRUE,"CycleBackground"=>TRUE,"LabelRotation"=>90); 
 $scaleSettings = array("GridR"=>200,"GridG"=>200,"GridB"=>200,"DrawSubTicks"=>TRUE,"CycleBackground"=>TRUE,"LabelRotation"=>90); 
 $myPicture->drawScale($scaleSettings); 

 /* Write the chart legend */ 
 #$myPicture->drawLegend(580,12,array("Style"=>LEGEND_NOBORDER,"Mode"=>LEGEND_HORIZONTAL)); 

 /* Turn on shadow computing */  
 $myPicture->setShadow(TRUE,array("X"=>1,"Y"=>1,"R"=>0,"G"=>0,"B"=>0,"Alpha"=>10)); 

 /* Draw the chart */ 
 $myPicture->setShadow(TRUE,array("X"=>1,"Y"=>1,"R"=>0,"G"=>0,"B"=>0,"Alpha"=>10)); 
 $settings = array("DisplayValues"=>TRUE,"DisplayPos"=>LABEL_POS_INSIDE,"Surrounding"=>-30,"InnerSurrounding"=>0,"Interleave"=>0.3,"OverrideColors"=>$Palette); 
# $settings = array("DisplayValues"=>TRUE,"DisplayPos"=>LABEL_POS_INSIDE,"Surrounding"=>0,"Interleave"=>0,"OverrideColors"=>$Palette); 
 if ($_GET['type'] == -3 or $_GET['type'] == 11){
    $myPicture->drawBarChart($settings);
    $myPicture->drawThreshold(100,array("WriteCaption"=>FALSE,"Caption"=>"Warn Zone","Alpha"=>90,"Ticks"=>2,"R"=>0,"G"=>255,"B"=>0));
    $myPicture->drawThreshold(97,array("WriteCaption"=>FALSE,"Caption"=>"Warn Zone","Alpha"=>90,"Ticks"=>2,"R"=>255,"G"=>255,"B"=>0));
    $myPicture->drawThreshold(96,array("WriteCaption"=>FALSE,"Caption"=>"Warn Zone","Alpha"=>90,"Ticks"=>2,"R"=>255,"G"=>165,"B"=>0));
    $myPicture->drawThreshold(95,array("WriteCaption"=>FALSE,"Caption"=>"Error Zone","Alpha"=>90,"Ticks"=>2,"R"=>255,"G"=>0,"B"=>0));
 }
 else if ($_GET['type'] == 255)
 {
    $myPicture->drawBarChart($settings);
    $myPicture->drawThreshold(99.8,array("WriteCaption"=>FALSE,"Caption"=>"Warn Zone","Alpha"=>90,"Ticks"=>2,"R"=>0,"G"=>255,"B"=>0));
    $myPicture->drawThreshold(99.7,array("WriteCaption"=>FALSE,"Caption"=>"Warn Zone","Alpha"=>90,"Ticks"=>2,"R"=>255,"G"=>255,"B"=>0));
    $myPicture->drawThreshold(99.6,array("WriteCaption"=>FALSE,"Caption"=>"Warn Zone","Alpha"=>90,"Ticks"=>2,"R"=>255,"G"=>165,"B"=>0));
    $myPicture->drawThreshold(99.5,array("WriteCaption"=>FALSE,"Caption"=>"Error Zone","Alpha"=>90,"Ticks"=>2,"R"=>255,"G"=>0,"B"=>0));
 }
 else
 {
    $myPicture->drawBarChart($settings);
    $myPicture->drawThreshold(100,array("WriteCaption"=>FALSE,"Caption"=>"Warn Zone","Alpha"=>90,"Ticks"=>2,"R"=>0,"G"=>255,"B"=>0));
    $myPicture->drawThreshold(99.8,array("WriteCaption"=>FALSE,"Caption"=>"Warn Zone","Alpha"=>90,"Ticks"=>2,"R"=>255,"G"=>255,"B"=>0));
    $myPicture->drawThreshold(99.7,array("WriteCaption"=>FALSE,"Caption"=>"Warn Zone","Alpha"=>90,"Ticks"=>2,"R"=>255,"G"=>165,"B"=>0));
    $myPicture->drawThreshold(99.5,array("WriteCaption"=>FALSE,"Caption"=>"Error Zone","Alpha"=>90,"Ticks"=>2,"R"=>255,"G"=>0,"B"=>0));
 }
 
    
 /* Render the picture (choose the best way) */ 
 $myPicture->autoOutput($_SERVER['DOCUMENT_ROOT']."/ajax/test/111.png"); 
?>

