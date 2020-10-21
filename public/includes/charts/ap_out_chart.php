<?php
 date_default_timezone_set( 'Europe/Moscow' );
 require($_SERVER['DOCUMENT_ROOT'].'/ajax/db.php');
 $numErrorConnections=5;
 $login='mj';
 $password='goldwing8517';
 while (!($db = mssql_connect($ip, $login, $password)) && $numErrorConnections--) sleep(1);
 if (!$db){
     echo "ошибка";
 }
 mssql_select_db ("bill", $db);
# -system = -3 indoor
# -system = 11 outdoor

#	$qry = "exec report_avaiable_total 99999,'".$_GET['start']."','".$_GET['end']."',1,255,2";
	$qry = "exec report_avaiable_total 99999,'".date('m.d.Y',strtotime("last day"))."','".date('m.d.Y',strtotime("last day"))."',1,11,0";
	$ttl = "From Weeks";

 /* pChart library inclusions */ 
 include($_SERVER['DOCUMENT_ROOT']."/js/pChart2.1.4/class/pData.class.php"); 
 include($_SERVER['DOCUMENT_ROOT']."/js/pChart2.1.4/class/pDraw.class.php"); 
 include($_SERVER['DOCUMENT_ROOT']."/js/pChart2.1.4/class/pImage.class.php"); 
 $month=array('Янв','Фев','Мар','Апр','Май','Июн','Июл','Авг','Сен','Окт','Ноя','Дек');
 $week=array("вс", "пн","вт","ср","чт","пт","сб");

    $result = mssql_query($qry,$db);
    $dates=$avail=$Palette=array();
    while ($row = mssql_fetch_assoc($result)){
	$utf_desk= iconv('windows-1251','utf-8',$row['desk']);
	array_push($dates, $utf_desk );
	array_push($avail, $row['avaiables']);
	if($row['avaiables'] >= 95) array_push($Palette, array("R"=>78,"G"=>186,"B"=>111,"Alpha"=>100)); # зеленый
	else array_push($Palette, array("R"=>176,"G"=>1,"B"=>6,"Alpha"=>100)); # красный
	
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

 $myPicture = new pImage(360,210,$MyData); 

 /* Turn of Antialiasing */ 
 $myPicture->Antialias = FALSE; 

 /* Add a border to the picture */ 
 $myPicture->drawGradientArea(0,0,700,230,array("StartR"=>0,"StartG"=>0,"StartB"=>0,"EndR"=>180,"EndG"=>180,"EndB"=>180,"Alpha"=>100)); 

 /* Set the default font */ 
 $myPicture->setFontProperties(array("FontName"=>$_SERVER['DOCUMENT_ROOT']."/js/pChart2.1.4/fonts/verdana.ttf","FontSize"=>7)); 

 
 /* Define the chart area */ 
 $myPicture->setGraphArea(44,15,333,141); 

 /* Draw the scale */ 
 $scaleSettings = array("GridR"=>200,"GridG"=>200,"GridB"=>200,"DrawSubTicks"=>TRUE,"CycleBackground"=>TRUE,"LabelRotation"=>90); 
 $myPicture->drawScale($scaleSettings); 

 /* Turn on shadow computing */  
 $myPicture->setShadow(TRUE,array("X"=>1,"Y"=>1,"R"=>0,"G"=>0,"B"=>0,"Alpha"=>10)); 

 /* Draw the chart */ 
 $myPicture->setShadow(TRUE,array("X"=>1,"Y"=>1,"R"=>0,"G"=>0,"B"=>0,"Alpha"=>10)); 
 $settings = array("DisplayValues"=>TRUE,"DisplayPos"=>LABEL_POS_INSIDE,"Surrounding"=>-30,"InnerSurrounding"=>0,"Interleave"=>0.3,"OverrideColors"=>$Palette); 
 $myPicture->drawThreshold(95,array("WriteCaption"=>FALSE,"Caption"=>"Error Zone","Alpha"=>90,"Ticks"=>2,"R"=>255,"G"=>0,"B"=>0));

 /* Render the picture (choose the best way) */ 
 $myPicture->drawBarChart($settings);
 $myPicture->autoOutput($_SERVER['DOCUMENT_ROOT']."/ajax/test/111.png"); 
?>

