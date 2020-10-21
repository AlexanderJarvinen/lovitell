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

 
 $data = $mssql->get_all_off_ap();
 foreach ($data as $row){
    if ($row["region"] == 0) continue;
    $region[] =  $row["desk"];
    $total[] = $row["total"];
    $off[] =  $row["state_off"];
//    echo "<br>";
 }
 //exit;
 
# $MyData->addPoints(array(150,220,300,-250,-420,-200,300,200,100),"Server A");
# $MyData->addPoints(array(140,0,340,-300,-320,-300,200,100,50),"Server B");

 $MyData->addPoints($total,"Total");
 $MyData->addPoints($off,"Off");

 $MyData->setAxisName(0,"Hits");
 #$MyData->addPoints(array("January","February","March","April","May","Juin","July","August","September"),"Months");
 $MyData->addPoints($region,"Months");
 $MyData->setSerieDescription("Months","Month");
 $MyData->setAbscissa("Months");

 /* Create the pChart object */
 $myPicture = new pImage(700,230,$MyData);

 /* Turn of Antialiasing */
 $myPicture->Antialias = FALSE;

 /* Add a border to the picture */
 $myPicture->drawRectangle(0,0,699,229,array("R"=>0,"G"=>0,"B"=>0));

 /* Set the default font */
 $myPicture->setFontProperties(array("FontName"=>$_SERVER['DOCUMENT_ROOT']."/js/pChart2.1.4/fonts/verdana.ttf","FontSize"=>6));

 /* Define the chart area */
 $myPicture->setGraphArea(60,40,650,200);

 /* Draw the scale */
 $scaleSettings = array("GridR"=>200,"GridG"=>200,"GridB"=>200,"DrawSubTicks"=>TRUE,"CycleBackground"=>TRUE, "LabelRotation"=>90);
 $myPicture->drawScale($scaleSettings);

 /* Write the chart legend */
 $myPicture->drawLegend(580,12,array("Style"=>LEGEND_NOBORDER,"Mode"=>LEGEND_HORIZONTAL));

 /* Turn on shadow computing */ 
 $myPicture->setShadow(TRUE,array("X"=>1,"Y"=>1,"R"=>0,"G"=>0,"B"=>0,"Alpha"=>10));

 /* Draw the chart */
 $myPicture->setShadow(TRUE,array("X"=>1,"Y"=>1,"R"=>0,"G"=>0,"B"=>0,"Alpha"=>10));
 #$settings = array("Gradient"=>TRUE,"GradientMode"=>GRADIENT_EFFECT_CAN,"DisplayPos"=>LABEL_POS_INSIDE,"DisplayValues"=>TRUE,"DisplayR"=>255,"DisplayG"=>255,"DisplayB"=>255,"DisplayShadow"=>TRUE,"Surrounding"=>-30);
 $myPicture->drawBarChart();

 /* Render the picture (choose the best way) */
 $myPicture->autoOutput("pictures/example.drawBarChart.simple.png");
?>