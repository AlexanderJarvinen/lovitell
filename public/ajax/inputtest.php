<!--<script src="/js/scripts.js"></script>-->
<div class="row">
<div class="mj">

<?
 date_default_timezone_set('Europe/Moscow');
    $data_in=$data_out=date('d.m.Y');
    $c=0;

    if ($_COOKIE['rep'.$_GET['id'].'st'] != '') $data_in=$_COOKIE['rep'.$_GET['id'].'st'];
    if ($_COOKIE['rep'.$_GET['id'].'end'] != '') $data_in=$_COOKIE['rep'.$_GET['id'].'end'];

  while (list($name, $type) = each($input)) {?>
	
	<div class="col-xs-4">
	    <h3 class="header blue lighter smaller">
		<i class="ace-icon fa fa-calendar-o smaller-90"></i>
		<? if ($c == 0) {
			echo "Начало периода";
			$data=$data_in;
		    }
		    else {
			echo "Окончание периода ";
			$data=$data_out;
		    }?>
	    </h3>
	    <div class="row">
		<div class="col-xs-6">
		    <div class="input-group input-group-sm">
			<input type="text" name="<?= $name;?>" id="datepicker<?=$c;?>" class="form-control" value="<?=$data;?>"/>
			<span class="input-group-addon">
			    <i class="ace-icon fa fa-calendar"></i>
			</span>
		    </div>
		</div>
	    </div>
	</div>
<?	$c++;
} ?>

<div class="col-xs-4">
<h3 class="header blue lighter smaller">&nbsp;</h3>
<button class="btn  btn-primary btn-block" onClick=send()>Просмотр</button>
</div>
</div>
<input type="hidden" name="action" value="next">
<input type="hidden" name="id" value="<?=$_GET['id'];?>">
</div>
<script>

$(function(){
        $.datepicker.regional['ru'] = {
        closeText: 'Закрыть',
        prevText: '&#x3c;Пред',
        nextText: 'След&#x3e;',
        currentText: 'Сегодня',
        monthNames: ['Январь','Февраль','Март','Апрель','Май','Июнь',
        'Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь'],
        monthNamesShort: ['Янв','Фев','Мар','Апр','Май','Июн',
        'Июл','Авг','Сен','Окт','Ноя','Дек'],
        dayNames: ['воскресенье','понедельник','вторник','среда','четверг','пятница','суббота'],
        dayNamesShort: ['вск','пнд','втр','срд','чтв','птн','сбт'],
        dayNamesMin: ['Вс','Пн','Вт','Ср','Чт','Пт','Сб'],
        dateFormat: 'dd.mm.yy',
        firstDay: 1,
        isRTL: false
        };
        $.datepicker.setDefaults($.datepicker.regional['ru']);
        $( "#datepicker0" ).datepicker({maxDate: "0D"});
        $( "#datepicker1" ).datepicker({maxDate: "0D"});
});
</script>
