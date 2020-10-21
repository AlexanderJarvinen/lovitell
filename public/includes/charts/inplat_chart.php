<?php
 /* CAT:Line chart */

 /* pChart library inclusions */
 include($_SERVER['DOCUMENT_ROOT']."/js/pChart2.1.4/class/pData.class.php");
 include($_SERVER['DOCUMENT_ROOT']."/js/pChart2.1.4/class/pDraw.class.php");
 include($_SERVER['DOCUMENT_ROOT']."/js/pChart2.1.4/class/pImage.class.php");

 /* Create and populate the pData object */
 $MyData = new pData();
 
 #
 # Значения для построения графиков
 #
 
 
    include $_SERVER['DOCUMENT_ROOT']."/class/db.php";

    $login = 'mj';
    $password = 'goldwing8517';
    
    $mssql = new sybase();
    $mssql->login  = $login;
    $mssql->password = $password;
    $mssql->connect();
 
 $now_month = $mssql->report_dates()['now_month']; # Текущий месяц
 $data = $mssql->get_register_inplat();
 
 foreach ($data as $row){
     $MyData->addPoints($row['qty'],'реальное количество');
     $MyData->addPoints($row['alarm_qty'],'эталон');
     $hour[] = $row['hour'];
 }
 
 $MyData->setPalette(array("реальное количество"),array("R"=>78,"G"=>186,"B"=>111,"Alpha"=>100));
 $MyData->setPalette(array("эталон"),array("R"=>176,"G"=>1,"B"=>6,"Alpha"=>100));
     
 #
 # Толщина линий в px
 #
 #$MyData->setSerieWeight("эталон",1);
 #$MyData->setSerieWeight("реальное количество",1);
 
 #
 # Длинна штрихов пунктира в px
 # Промежуток 1/2 длинны
 #
 $MyData->setSerieTicks("Probe 2",4);

 #
 # Часы по оси X
 #
 $MyData->addPoints($hour,"Labels");
 
 #
 # Значения по оси Y
 #
 $MyData->setAbscissa("Labels");
 $MyData->setAbscissaName("Часы");
 #
 # Заголовок для оси Y
 #
 $MyData->setAxisName(0,"Количество");




 /* Create the pChart object */
 #$myPicture = new pImage(1800,600,$MyData);
 $myPicture = new pImage(360,210,$MyData);
 /* Turn of Antialiasing */
 $myPicture->Antialias = FALSE;

 /* Задаем цвет и заливаем фон */
 $Settings = array("R"=>255, "G"=>255, "B"=>255, "Dash"=>1, "DashR"=>255, "DashG"=>255, "DashB"=>255);
 #$myPicture->drawFilledRectangle(0,0,700,230,$Settings);
 $myPicture->drawFilledRectangle(0,0,360,210,$Settings);

 /* Add a border to the picture */
 #$myPicture->drawRectangle(0,0,699,229,array("R"=>0,"G"=>0,"B"=>0));
 #$myPicture->drawRectangle(0,0,358,208,array("R"=>0,"G"=>0,"B"=>0));
 
 /* Write the chart title */
 $myPicture->setFontProperties(array("FontName"=>$_SERVER['DOCUMENT_ROOT']."/js/pChart2.1.4/fonts/verdana.ttf","FontSize"=>8,"R"=>0,"G"=>0,"B"=>0));

 /* Set the default font */
 $myPicture->setFontProperties(array("FontName"=>$_SERVER['DOCUMENT_ROOT']."/js/pChart2.1.4/fonts/verdana.ttf","FontSize"=>8,"R"=>0,"G"=>0,"B"=>0));

 /* Define the chart area */
 $myPicture->setGraphArea(34,15,353,180);
 # $myPicture->setGraphArea(60,40,1750,570);
 /* Draw the scale */
 #$scaleSettings = array("XMargin"=>10,"YMargin"=>10,"Floating"=>TRUE,"GridR"=>200,"GridG"=>200,"GridB"=>200,"DrawSubTicks"=>TRUE,"CycleBackground"=>TRUE);
 
    /* Ось Y начинается с 0 */
    $scaleSettings = array("Mode"=>SCALE_MODE_START0, "GridR"=>200,"GridG"=>200,"GridB"=>200,"DrawSubTicks"=>TRUE,"CycleBackground"=>TRUE,"LabelRotation"=>90);
    $myPicture->drawScale($scaleSettings);

 /* Turn on Antialiasing */
 $myPicture->Antialias = TRUE;

 /* Enable shadow computing */
 $myPicture->setShadow(TRUE,array("X"=>1,"Y"=>1,"R"=>0,"G"=>0,"B"=>0,"Alpha"=>10));

 /* Draw the line chart */
 $myPicture->drawLineChart();
# $myPicture->drawPlotChart(array("DisplayValues"=>TRUE,"PlotBorder"=>TRUE,"BorderSize"=>2,"Surrounding"=>-60,"BorderAlpha"=>80));
 $myPicture->drawPlotChart(array("DisplayValues"=>FALSE,"PlotBorder"=>FALSE,"Surrounding"=>-60,"BorderAlpha"=>80));

 /* Write the chart legend */
 #$myPicture->drawLegend(290,19,array("Style"=>LEGEND_NOBORDER,"Mode"=>LEGEND_HORIZONTAL,"FontR"=>0,"FontG"=>0,"FontB"=>0));
 $myPicture->drawLegend(150,5,array("Style"=>LEGEND_NOBORDER,"Mode"=>LEGEND_HORIZONTAL,"FontR"=>0,"FontG"=>0,"FontB"=>0));

 /* Render the picture (choose the best way) */
 $myPicture->autoOutput("pictures/example.drawLineChart.plots.png");
?>