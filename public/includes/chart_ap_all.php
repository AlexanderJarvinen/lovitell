<?php   
    include $_SERVER['DOCUMENT_ROOT']."/class/db.php";
    $login = 'mj';
    $password = 'goldwing8517';
    
        $mssql = new sybase();
        $mssql->login  = $login;
        $mssql->password = $password;
        $mssql->connect();

	$now_month = $mssql->report_dates()['now_month'];
	$data = $mssql->get_month_aval_ap();
 /* CAT:Line chart */

 /* pChart library inclusions */
 include($_SERVER['DOCUMENT_ROOT']."/js/pChart2.1.4/class/pData.class.php");
 include($_SERVER['DOCUMENT_ROOT']."/js/pChart2.1.4/class/pDraw.class.php");
 include($_SERVER['DOCUMENT_ROOT']."/js/pChart2.1.4/class/pImage.class.php");

 $month_all = array('Янв','Фев','Мар','Апр','Май','Июн','Июл','Авг','Сен','Окт','Ноя','Дек');
 $count = 0;
 while ($count <= $now_month){
    $month[] = $month_all[$count];
    $count++;
 }


 /* Create and populate the pData object */
 $MyData = new pData();  
 
 #
 # Значения для построения графиков
 #
 foreach ($data as $desk=>$val){
     $MyData->addPoints($val,$desk);
 }
 #$MyData->addPoints(array(60,52,55,48,45,40),"Район 1");
 #$MyData->addPoints(array(62,67,55,58,59,42),"Probe 2");
 #$MyData->addPoints(array(42,47,45,48,49,42),"Probe 3");
 
 #
 # Толщина линий в px
 #
 $MyData->setSerieWeight("Probe 1",2);
 $MyData->setSerieWeight("Probe 2",2);
 $MyData->setSerieWeight("Probe 3",2);
 
 #
 # Длинна штрихов пунктира в px
 # Промежуток 1/2 длинны
 #
 $MyData->setSerieTicks("Probe 2",4);

 #
 # Месяцы по оси X
 #
 $MyData->addPoints($month,"Labels");
 #$MyData->setSerieDescription("Labels","Months");
 
 #
 # Значения по оси Y
 #
 $MyData->setAbscissa("Labels");

 #
 # Заголовок для оси Y
 #
 $MyData->setAxisName(0,"Устройства");




 /* Create the pChart object */
 $myPicture = new pImage(700,230,$MyData);

 /* Turn of Antialiasing */
 $myPicture->Antialias = FALSE;

 /* Задаем цвет и заливаем фон */
 $Settings = array("R"=>255, "G"=>255, "B"=>255, "Dash"=>1, "DashR"=>255, "DashG"=>255, "DashB"=>255);
 $myPicture->drawFilledRectangle(0,0,700,230,$Settings);

 /* Если нужно, зададим градиент фона */
 #$Settings = array("StartR"=>219, "StartG"=>231, "StartB"=>139, "EndR"=>1, "EndG"=>138, "EndB"=>68, "Alpha"=>50);
 #$Settings = array("StartR"=>219, "StartG"=>231, "StartB"=>139, "EndR"=>1, "EndG"=>138, "EndB"=>68, "Alpha"=>50);
 #$myPicture->drawGradientArea(0,0,700,230,DIRECTION_VERTICAL,$Settings);
 #$myPicture->drawGradientArea(0,0,700,20,DIRECTION_VERTICAL,array("StartR"=>0,"StartG"=>0,"StartB"=>0,"EndR"=>50,"EndG"=>50,"EndB"=>50,"Alpha"=>80));

 /* Add a border to the picture */
 $myPicture->drawRectangle(0,0,699,229,array("R"=>0,"G"=>0,"B"=>0));
 
 /* Write the chart title */ 
 #$myPicture->setFontProperties(array("FontName"=>"../fonts/Forgotte.ttf","FontSize"=>8,"R"=>255,"G"=>255,"B"=>255));
 $myPicture->setFontProperties(array("FontName"=>$_SERVER['DOCUMENT_ROOT']."/js/pChart2.1.4/fonts/verdana.ttf","FontSize"=>8,"R"=>0,"G"=>0,"B"=>0));
 $myPicture->drawText(10,16,"Average recorded temperature",array("FontSize"=>11,"Align"=>TEXT_ALIGN_BOTTOMLEFT));

 /* Set the default font */
 $myPicture->setFontProperties(array("FontName"=>$_SERVER['DOCUMENT_ROOT']."/js/pChart2.1.4/fonts/verdana.ttf","FontSize"=>6,"R"=>0,"G"=>0,"B"=>0));

 /* Define the chart area */
 $myPicture->setGraphArea(60,40,650,200);

 /* Draw the scale */
 $scaleSettings = array("XMargin"=>10,"YMargin"=>10,"Floating"=>TRUE,"GridR"=>200,"GridG"=>200,"GridB"=>200,"DrawSubTicks"=>TRUE,"CycleBackground"=>TRUE);
 $myPicture->drawScale($scaleSettings);

 /* Turn on Antialiasing */
 $myPicture->Antialias = TRUE;

 /* Enable shadow computing */
 $myPicture->setShadow(TRUE,array("X"=>1,"Y"=>1,"R"=>0,"G"=>0,"B"=>0,"Alpha"=>10));

 /* Draw the line chart */
 $myPicture->drawLineChart();
 $myPicture->drawPlotChart(array("DisplayValues"=>TRUE,"PlotBorder"=>TRUE,"BorderSize"=>2,"Surrounding"=>-60,"BorderAlpha"=>80));

 /* Write the chart legend */
 $myPicture->drawLegend(290,19,array("Style"=>LEGEND_NOBORDER,"Mode"=>LEGEND_HORIZONTAL,"FontR"=>0,"FontG"=>0,"FontB"=>0));

 /* Render the picture (choose the best way) */
 $myPicture->autoOutput("pictures/example.drawLineChart.plots.png");
?>