<?php   
 /* CAT:Bar Chart */

 /* pChart library inclusions */
 include($_SERVER['DOCUMENT_ROOT']."/js/pChart2.1.4/class/pData.class.php");
 include($_SERVER['DOCUMENT_ROOT']."/js/pChart2.1.4/class/pDraw.class.php");
 include($_SERVER['DOCUMENT_ROOT']."/js/pChart2.1.4/class/pImage.class.php");
    include $_SERVER['DOCUMENT_ROOT']."/class/db.php";   

    $login = 'mj';
    $password = 'goldwing8517';
    
    $mssql = new sybase();
    $mssql->login  = $login;
    $mssql->password = $password;
    $mssql->connect();


 /* Create and populate the pData object */
 $MyData = new pData();  

 
 $data = $mssql->get_all_in_ap();
 $Palette = array();
 foreach ($data as $row){
    if ($row["region"] == 0) continue;
    $region[] =  $row["desk"];
    $total[] = $row["total"];
    #array_push($Palette, array("R"=>78,"G"=>186,"B"=>111,"Alpha"=>100));	# зеленый
    #array_push($Palette, array("R"=>176,"G"=>1,"B"=>6,"Alpha"=>100));		# красный
    $off[] =  $row["state_off"];
//    echo "<br>";
 }
 
 //exit;
 
# $MyData->addPoints(array(150,220,300,-250,-420,-200,300,200,100),"Server A");
# $MyData->addPoints(array(140,0,340,-300,-320,-300,200,100,50),"Server B");



 $myPicture = new pImage(360,210,$MyData);
#var_dump($Palette);
#exit;
    #array_push($Palette, array("R"=>244,"G"=>194,"B"=>9,"Alpha"=>100));		# желтый
    #array_push($Palette, array("R"=>220,"G"=>152,"B"=>1,"Alpha"=>100));		# оранжеывй


 /* Create and populate the pData object */ 
 $MyData = new pData();   
 $MyData->addPoints($total,"Total");
 $MyData->addPoints($off,"Off");

 $MyData->setPalette(array("Total"),array("R"=>78,"G"=>186,"B"=>111,"Alpha"=>100));
 $MyData->setPalette(array("Off"),array("R"=>176,"G"=>1,"B"=>6,"Alpha"=>100));

 #$MyData->setAxisName(0,"Hits");
 $MyData->addPoints($region,"Months");

 $MyData->setSerieDescription("Date","Date"); 
 $MyData->setAbscissa("Months"); 

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
 $myPicture->setFontProperties(array("FontName"=>$_SERVER['DOCUMENT_ROOT']."/js/pChart2.1.4/fonts/verdana.ttf","FontSize"=>6)); 
 /* Title */
 
 #$myPicture->drawText(5,35,$qry,array("FontSize"=>7,"Align"=>TEXT_ALIGN_BOTTOMLEFT));
 
 /* Define the chart area */ 
# $myPicture->setGraphArea(60,40,450,150); 
 $myPicture->setGraphArea(44,15,333,141); 

 /* Draw the scale */ 
# $scaleSettings = array("XMargin"=>10,"YMargin"=>10,"Floating"=>TRUE,"GridR"=>200,"GridG"=>200,"GridB"=>200,"DrawSubTicks"=>TRUE,"CycleBackground"=>TRUE,"LabelRotation"=>90); 
 $scaleSettings = array("Mode"=>SCALE_MODE_START0, "GridR"=>200,"GridG"=>200,"GridB"=>200,"DrawSubTicks"=>TRUE,"CycleBackground"=>TRUE,"LabelRotation"=>90); 
 $myPicture->drawScale($scaleSettings); 

 /* Write the chart legend */ 
 #$myPicture->drawLegend(580,12,array("Style"=>LEGEND_NOBORDER,"Mode"=>LEGEND_HORIZONTAL)); 

 /* Turn on shadow computing */  
 $myPicture->setShadow(TRUE,array("X"=>1,"Y"=>1,"R"=>0,"G"=>0,"B"=>0,"Alpha"=>10)); 

 /* Draw the chart */ 
 $myPicture->setShadow(TRUE,array("X"=>1,"Y"=>1,"R"=>0,"G"=>0,"B"=>0,"Alpha"=>10)); 
 $settings = array("DisplayValues"=>TRUE,"DisplayPos"=>LABEL_POS_INSIDE,"Surrounding"=>-30,"InnerSurrounding"=>0,"Interleave"=>0,"OverrideColors"=>$Palette); 
 $myPicture->drawBarChart($settings);
    
 /* Render the picture (choose the best way) */ 
 $myPicture->autoOutput($_SERVER['DOCUMENT_ROOT']."/ajax/test/111.png"); 
?>

