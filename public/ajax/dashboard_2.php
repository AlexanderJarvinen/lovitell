<?
	include('./chart_view_2.php');
?>

<div class="btn-group">
<button aria-expanded="false" data-toggle="dropdown" class="btn btn-info btn-lg dropdown-toggle">
    <i class="ace-icon fa fa-cog bigger-230"></i>
    Настройки
<i class="ace-icon fa fa-angle-down icon-on-right"></i>
</button>
<ul class="dropdown-menu dropdown-success dropdown-menu-right">
 Не показывать:
<?
    $ttt=1;
    while (chart('chart2.'.$ttt)){
	$out=chart('chart2.'.$ttt);
	?>
	<li>
    	    <a href="#" onClick=Wopen('<?='chart2.'.$ttt?>')>
    		    <?
		    if ($_COOKIE['chart2.'.$ttt.'close'] == 1) echo "<i id=\"ichart2.".$ttt."\" class=\"ace-icon fa fa-check-square-o\"> ";
		    else echo "<i id=\"ichart2.".$ttt."\" class=\"ace-icon fa fa-square-o\"> ";
		    echo str_replace('<br>',' ',$out[0]);?>
		</i>
	    </a>
	</li>
	<?
	$ttt++;
    }
?>
</ul>
</div>


<div class="row">
<?
    $ii=0;
    while ($ii < 3) {
	
?>

    <div class="col-xs-4 widget-container-col" id="col2.<?=$ii;?>" style="min-height: 292px">
	<? 
	    if (!$_COOKIE['col2.0'] and !$_COOKIE['col2.1'] and !$_COOKIE['col2.2']){
		if ($ii==0 ) $ai=array('chart2.1','chart2.4');
		else if ($ii==1 ) $ai=array('chart2.2', 'chart2.5');
		else if ($ii==2 ) $ai=array('chart2.3');
	    } else $ai=explode(' ',$_COOKIE['col2.'.$ii]);

	    foreach ( $ai as $i ){
	    if ($i != ''){
		$class='';
		if($_COOKIE[$i] == 'hide') $class='collapsed';
		if($_COOKIE[$i.'close'] == 1) continue;
	?>
	<div class="widget-box <?=$class?>" id="<?=$i;?>">
	    <div class="widget-header">
		<h4 class="widget-title smaller">
		    <?
			$out=chart($i);
			echo $out[0];
		    ?>
		</h4>
		<div class="widget-toolbar">
		    <a data-action="fullscreen" class="orange2" href="#"><i class="ace-icon fa fa-expand"></i></a>
		    <a data-action="collapse" href="#"><i class="ace-icon fa fa-chevron-up"></i></a>
		    <a data-action="close" href="#"><i class="ace-icon fa fa-times"></i></a>
		</div>
	    </div>
	    <div class="widget-body">
	    <?=$out[1]?>
	    </div>
	</div>
	<?
	}
	}
	  ?>
    </div>
<?
    $ii++;
}
?>
</div>


<script>
 $('.widget-container-col').sortable({
    connectWith: '.widget-container-col',
    items: '> .widget-box',
    opacity: 0.8,
    revert: true,
    forceHelperSize: true,
    placeholder: 'widget-placeholder',
    forcePlaceholderSize: true,
    tolerance: 'pointer',
    start: function(event, ui){
        //when an element is moved, its parent (.widget-container-col) becomes empty with almost zero height
        //we set a "min-height" for it to be large enough so that later we can easily drop elements back onto it
        ui.item.parent().css({'min-height': ui.item.height()})
    },
    update: function(event, ui) {
        //the previously set "min-height" is not needed anymore
        //now the parent (.widget-container-col) should take the height of its child (.wiget-box)
        ui.item.parent({'min-height':''});
	//var col = $('.row').children('div').eq(1).attr('id');
	//var chart = $('.row').children('div').eq(1).children('div').eq(1).attr('id');
	count_col=1;
	while (col = $('.row').children('div').eq(count_col).attr('id')){
	    count=0;
	    charts0='';
	    while (chart = $('.row').children('div').eq(count_col).children('div').eq(count).attr('id')){
		charts0+=chart+' ';
		count++;
	    }
	    //alert('Write New Position '+col+'\n'+charts0);
	    document.cookie=col+ "=" + charts0;
	    count_col++;
	}
    }
 });
 function Wopen(id){
    cid=id+'close'
    id = 'i'+id;
    c = $("#"+id).attr('class');
    if (c.indexOf('check') != -1){
	$("#"+id).removeClass('fa-check-square-o');
	$("#"+id).addClass('fa-square-o');
	document.cookie=cid+" = 0";
    } else {
	$("#"+id).removeClass('fa-square-o');
	$("#"+id).addClass('fa-check-square-o');
	document.cookie=cid+" = 1";
    }
 }
</script>
