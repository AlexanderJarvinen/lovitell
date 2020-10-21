<?php

namespace Modules\Inventory\Components\ImageChart;

use Log;
use Modules\Inventory\Models\InventoryGraph;

include __DIR__."/includes/pChart2.1.4/class/pData.class.php";
include __DIR__."/includes/pChart2.1.4/class/pDraw.class.php";
include __DIR__."/includes/pChart2.1.4/class/pImage.class.php";

class ImageChart {
    public $month=array('Янв','Фев','Мар','Апр','Май','Июн','Июл','Авг','Сен','Окт','Ноя','Дек');
    public $week=array("вс", "пн","вт","ср","чт","пт","сб");
    public $data=[];
    public $image=[];
    public $pallete=[];

    public function __construct() {
    }

    public function makeTotalChart($id, $type, $group, $start, $end, $brand_id=0) {
        $inventory_graph = new InventoryGraph();
        $resp = $inventory_graph->getTotal($id, $type, $group, $start, $end, $brand_id);
        $dates = [];
        $avail = [];
        $Palette = [];
        foreach($resp as $data_row) {
            $data_row = (array) $data_row;
            if ($id == 222 || $id == 99999) {
                $utf_desk= iconv('windows-1251','utf-8',$data_row['desk']);
                array_push($dates, $utf_desk );
            }
            else {
                $mon = 0+substr($data_row['started'],4,2);
                if ($id == 3){
                    $ddate = $this->month[$mon-1].' '.substr($data_row['started'],2,2).' ';
                } else if ($id == 2){
                    $ddate = substr($data_row['started'],6,2).' '.$this->month[$mon-1].' '.substr($data_row['started'],2,2).' ';
                }else {
                    //$week[date("w",mktime (0, 0, 0, substr($row['started'],4,2), substr($row['started'],6,2), substr($row['started'],0,4)))];
                    //$week[date("w",mktime (0, 0, 0,'11','11', '2015'))];
                    //$date=explode("-", $date);
                    //$week = date("w", mktime(0, 0, 0, $date[1], $date[2], $date[0]));
                    $dnum = date("w",mktime (0, 0, 0, substr($data_row['started'],4,2), substr($data_row['started'],6,2), substr($data_row['started'],0,4)));
                    $ddate = '      '.$this->week[$dnum].'
'.substr($data_row['started'],6,2).' '.$this->month[$mon-1].' '.substr($data_row['started'],2,2).' ';
                }
                array_push($dates, $ddate);
            }
            if ($type == -3 or $type == 11){
                array_push($avail, $data_row['avaiables']);
                if($data_row['avaiables'] >= 97)
                    array_push($Palette, array("R"=>78,"G"=>186,"B"=>111,"Alpha"=>100));	# зеленый
                else if ($data_row['avaiables'] >= 96)
                    array_push($Palette, array("R"=>244,"G"=>194,"B"=>9,"Alpha"=>100));	# желтый
                else if ($data_row['avaiables'] >= 95)
                    array_push($Palette, array("R"=>220,"G"=>152,"B"=>1,"Alpha"=>100));	# оранжеывй
                else
                    array_push($Palette, array("R"=>176,"G"=>1,"B"=>6,"Alpha"=>100));	# красный

            }
            else
            {
                array_push($avail, $data_row['avaiables']);
                if($data_row['avaiables'] >= 99.8)
                    array_push($Palette, array("R"=>78,"G"=>186,"B"=>111,"Alpha"=>100));	# зеленый
                else if ($data_row['avaiables'] >= 99.7)
                    array_push($Palette, array("R"=>244,"G"=>194,"B"=>9,"Alpha"=>100));	# желтый
                else if ($data_row['avaiables'] >= 99.5)
                    array_push($Palette, array("R"=>220,"G"=>152,"B"=>1,"Alpha"=>100));	# оранжеывй
                else
                    array_push($Palette, array("R"=>176,"G"=>1,"B"=>6,"Alpha"=>100));	# красный
            }
        }

        $this->data = new \pData();
        $this->data->addPoints($avail,"Avail");
        $this->data->addPoints($dates,"Date");
        #$this->data->setAxisName(0,"Avail"); 
        $this->data->setSerieDescription("Date","Date");
        $this->data->setAbscissa("Date");

        /* Create the pChart object 500ширина. дефолт 700 */
# $this->image = new pImage(360,210,$this->data); 
        $this->image = new \pImage(360,210,$this->data);

        /* Turn of Antialiasing */
        $this->image->Antialias = FALSE;

        /* Add a border to the picture */
        #$this->image->drawGradientArea(0,0,700,230,690001,array("StartR"=>0,"StartG"=>0,"StartB"=>0,"EndR"=>180,"EndG"=>180,"EndB"=>180,"Alpha"=>100));
        $this->image->drawRectangle(0,0,359,209,array("R"=>0,"G"=>0,"B"=>0));

        /* Set the default font */
        #$this->image->setFontProperties(array("FontName"=>$_SERVER['DOCUMENT_ROOT']."/js/pChart2.1.4/fonts/pf_arma_five.ttf","FontSize"=>6)); 
        $this->image->setFontProperties(array("FontName"=>$_SERVER['DOCUMENT_ROOT']."/fonts/verdana.ttf","FontSize"=>7));
        /* Title */

        #$this->image->drawText(5,35,$qry,array("FontSize"=>7,"Align"=>TEXT_ALIGN_BOTTOMLEFT));

        /* Define the chart area */
# $this->image->setGraphArea(60,40,450,150); 
        $this->image->setGraphArea(44,15,333,141);

        /* Draw the scale */
# $scaleSettings = array("XMargin"=>10,"YMargin"=>10,"Floating"=>TRUE,"GridR"=>200,"GridG"=>200,"GridB"=>200,"DrawSubTicks"=>TRUE,"CycleBackground"=>TRUE,"LabelRotation"=>90); 
        $scaleSettings = array("GridR"=>200,"GridG"=>200,"GridB"=>200,"DrawSubTicks"=>TRUE,"CycleBackground"=>TRUE,"LabelRotation"=>90);
        $this->image->drawScale($scaleSettings);

        /* Write the chart legend */
        #$this->image->drawLegend(580,12,array("Style"=>LEGEND_NOBORDER,"Mode"=>LEGEND_HORIZONTAL)); 

        /* Turn on shadow computing */
        $this->image->setShadow(TRUE,array("X"=>1,"Y"=>1,"R"=>0,"G"=>0,"B"=>0,"Alpha"=>10));

        /* Draw the chart */
        $this->image->setShadow(TRUE,array("X"=>1,"Y"=>1,"R"=>0,"G"=>0,"B"=>0,"Alpha"=>10));
        $settings = array("DisplayValues"=>TRUE,"DisplayPos"=>LABEL_POS_INSIDE,"Surrounding"=>-30,"InnerSurrounding"=>0,"Interleave"=>0.3,"OverrideColors"=>$Palette);
        # $settings = array("DisplayValues"=>TRUE,"DisplayPos"=>LABEL_POS_INSIDE,"Surrounding"=>0,"Interleave"=>0,"OverrideColors"=>$Palette);

        if ($type == -3 or $type == 11){
            $this->image->drawBarChart($settings);
            $this->image->drawThreshold(100,array("WriteCaption"=>FALSE,"Caption"=>"Warn Zone","Alpha"=>90,"Ticks"=>2,"R"=>0,"G"=>255,"B"=>0));
            $this->image->drawThreshold(97,array("WriteCaption"=>FALSE,"Caption"=>"Warn Zone","Alpha"=>90,"Ticks"=>2,"R"=>255,"G"=>255,"B"=>0));
            $this->image->drawThreshold(96,array("WriteCaption"=>FALSE,"Caption"=>"Warn Zone","Alpha"=>90,"Ticks"=>2,"R"=>255,"G"=>165,"B"=>0));
            $this->image->drawThreshold(95,array("WriteCaption"=>FALSE,"Caption"=>"Error Zone","Alpha"=>90,"Ticks"=>2,"R"=>255,"G"=>0,"B"=>0));
        }
        else
        {
            $this->image->drawBarChart($settings);
            $this->image->drawThreshold(100,array("WriteCaption"=>FALSE,"Caption"=>"Warn Zone","Alpha"=>90,"Ticks"=>2,"R"=>0,"G"=>255,"B"=>0));
            $this->image->drawThreshold(99.8,array("WriteCaption"=>FALSE,"Caption"=>"Warn Zone","Alpha"=>90,"Ticks"=>2,"R"=>255,"G"=>255,"B"=>0));
            $this->image->drawThreshold(99.7,array("WriteCaption"=>FALSE,"Caption"=>"Warn Zone","Alpha"=>90,"Ticks"=>2,"R"=>255,"G"=>165,"B"=>0));
            $this->image->drawThreshold(99.5,array("WriteCaption"=>FALSE,"Caption"=>"Error Zone","Alpha"=>90,"Ticks"=>2,"R"=>255,"G"=>0,"B"=>0));
        }


        /* Render the picture (choose the best way) */
        $this->image->stroke();
    }

    public function makeAmountChart($type, $group, $brand_id=0) {
        $inventory_graph = new InventoryGraph();
        /* Create and populate the pData object */
        $this->data = new \pData();
        $data = $inventory_graph->getAmount($type, $group, $brand_id);
        $palette = array();
        $region = [];
        $total = [];
        $off = [];
        foreach ($data as $row){
            if ($row->region == 0) continue;
            $region[] =  $row->desk;
            $total[] = $row->total;
            #array_push($Palette, array("R"=>78,"G"=>186,"B"=>111,"Alpha"=>100));	# зеленый
            #array_push($Palette, array("R"=>176,"G"=>1,"B"=>6,"Alpha"=>100));		# красный
            $off[] =  $row->state_off;
//    echo "<br>";
        }

        $this->data->addPoints($total,"Total");
        $this->data->addPoints($off,"Off");

        $this->data->setPalette(array("Total"),array("R"=>78,"G"=>186,"B"=>111,"Alpha"=>100));
        $this->data->setPalette(array("Off"),array("R"=>176,"G"=>1,"B"=>6,"Alpha"=>100));

        #$this->data->setAxisName(0,"Hits");
        $this->data->addPoints($region,"Months");

        $this->data->setSerieDescription("Date","Date");
        $this->data->setAbscissa("Months");

        /* Create the pChart object 500ширина. дефолт 700 */
# $this->image = new pImage(360,210,$this->data); 
        $this->image = new \pImage(360,210,$this->data);

        /* Turn of Antialiasing */
        $this->image->Antialias = FALSE;

        /* Add a border to the picture */
        //$this->image->drawGradientArea(0,0,700,230,array("StartR"=>0,"StartG"=>0,"StartB"=>0,"EndR"=>180,"EndG"=>180,"EndB"=>180,"Alpha"=>100));
        $this->image->drawRectangle(0,0,359,209,array("R"=>0,"G"=>0,"B"=>0));

        /* Set the default font */
        #$this->image->setFontProperties(array("FontName"=>$_SERVER['DOCUMENT_ROOT']."/js/pChart2.1.4/fonts/pf_arma_five.ttf","FontSize"=>6)); 
        $this->image->setFontProperties(array("FontName"=>$_SERVER['DOCUMENT_ROOT']."/fonts/verdana.ttf","FontSize"=>6));
        /* Title */

        #$this->image->drawText(5,35,$qry,array("FontSize"=>7,"Align"=>TEXT_ALIGN_BOTTOMLEFT));

        /* Define the chart area */
# $this->image->setGraphArea(60,40,450,150); 
        $this->image->setGraphArea(44,15,333,141);

        /* Draw the scale */
# $scaleSettings = array("XMargin"=>10,"YMargin"=>10,"Floating"=>TRUE,"GridR"=>200,"GridG"=>200,"GridB"=>200,"DrawSubTicks"=>TRUE,"CycleBackground"=>TRUE,"LabelRotation"=>90); 
        $scaleSettings = array("Mode"=>SCALE_MODE_START0, "GridR"=>200,"GridG"=>200,"GridB"=>200,"DrawSubTicks"=>TRUE,"CycleBackground"=>TRUE,"LabelRotation"=>90);
        $this->image->drawScale($scaleSettings);

        /* Write the chart legend */
        #$this->image->drawLegend(580,12,array("Style"=>LEGEND_NOBORDER,"Mode"=>LEGEND_HORIZONTAL)); 

        /* Turn on shadow computing */
        $this->image->setShadow(TRUE,array("X"=>1,"Y"=>1,"R"=>0,"G"=>0,"B"=>0,"Alpha"=>10));

        /* Draw the chart */
        $this->image->setShadow(TRUE,array("X"=>1,"Y"=>1,"R"=>0,"G"=>0,"B"=>0,"Alpha"=>10));
        $settings = array("DisplayValues"=>TRUE,"DisplayPos"=>LABEL_POS_INSIDE,"Surrounding"=>-30,"InnerSurrounding"=>0,"Interleave"=>0,"OverrideColors"=>$palette);
        $this->image->drawBarChart($settings);

        $this->image->stroke();
    }

    public function makeRegChart() {
        $now_month = $mssql->report_dates()['now_month'];
        $data = $mssql->get_register_24();
    }

}
