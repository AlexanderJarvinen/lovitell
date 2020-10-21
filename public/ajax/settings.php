<script>
$(document).ready ( function(){
 //$("#block").css("background-color", "yellow"); 
    l2_title('Настройки');
    $('#l2-header').html('Настройки');
    $('#page-header').html('Настройки');
 });
</script>


    <form class="form-horizontal" role="form">
    <h3 class="header smaller lighter blue">
	Данные о пользователе
    </h3>
<!-- #section:elements.form -->
        <div class="form-group">
	    <label class="col-sm-3 control-label no-padding-right" for="form-field-1"> Login: </label>
	    <div class="col-sm-9">
		<input id="login" placeholder="Username" class="col-xs-10 col-sm-5" type="text">
	    </div>
	</div>

        <div class="form-group">
	    <label class="col-sm-3 control-label no-padding-right" for="form-field-1"> ФИО: </label>
	    <div class="col-sm-9">
		<input id="name" placeholder="Name" class="col-xs-10 col-sm-5" type="text">
	    </div>
	</div>

        <div class="form-group">
	    <label class="col-sm-3 control-label no-padding-right" for="form-field-1"> Телефон: </label>
	    <div class="col-sm-9">
		<input id="phone" placeholder="Phone" class="col-xs-10 col-sm-5" type="text">
	    </div>
	</div>

        <div class="form-group">
	    <label class="col-sm-3 control-label no-padding-right" for="form-field-1"> e-mail: </label>
	    <div class="col-sm-9">
		<input id="email" placeholder="e-mail" class="col-xs-10 col-sm-5" type="text">
	    </div>
	</div>
	<div class="clearfix form-actions">
		<div class="col-md-offset-3 col-md-9">
		    <button class="btn btn-info" type="button">
		        <i class="ace-icon fa fa-check bigger-110"></i>
			    Применить
		    </button>
		</div>
	</div>
    </form>
    <form class="form-horizontal" role="form">
    <h3 class="header smaller lighter blue">
	Смена пароля
    </h3>
        <div class="form-group">
	    <label class="col-sm-3 control-label no-padding-right" for="form-field-1"> Новый пароль: </label>
	    <div class="col-sm-9">
		<input id="new_pwd_1" placeholder="Новый пароль:" class="col-xs-10 col-sm-5" type="password">
	    </div>
	</div>

        <div class="form-group">
	    <label class="col-sm-3 control-label no-padding-right" for="form-field-1"> Повторите пароль: </label>
	    <div class="col-sm-9">
		<input id="new_pwd_2" placeholder="Повторите пароль" class="col-xs-10 col-sm-5" type="text">
	    </div>
	</div>
	<div class="clearfix form-actions">
		<div class="col-md-offset-3 col-md-9">
		    <button class="btn btn-info" type="button">
		        <i class="ace-icon fa fa-check bigger-110"></i>
			    Применить
		    </button>
		</div>
	</div>
    </form>
    <form class="form-horizontal" role="form">
    <h3 class="header smaller lighter blue">
	Установка задач<br>
	<small>Уведомление о получении задачи по e-mail, если:</small>
    </h3>
        <div class="form-group">
	    <label class="col-sm-3 control-label no-padding-right" for="form-field-1"> Вы адресат задачи: </label>
	    <div class="col-sm-9">
		<input id="task_email_1" placeholder="e-mail:" class="col-xs-10 col-sm-5" type="password">
	    </div>
	</div>

        <div class="form-group">
	    <label class="col-sm-3 control-label no-padding-right" for="form-field-1"> Вы адресат задачи: </label>
	    <div class="col-sm-9">
		<input id="task_email_2" placeholder="e-mail:" class="col-xs-10 col-sm-5" type="text">
	    </div>
	</div>
	<div class="clearfix form-actions">
		<div class="col-md-offset-3 col-md-9">
		    <button class="btn btn-info" type="button">
		        <i class="ace-icon fa fa-check bigger-110"></i>
			    Применить
		    </button>
		</div>
	</div>
    </form>
    <form class="form-horizontal" role="form">
    <h3 class="header smaller lighter blue">
	Установка проблем<br>
	<small>Уведомление о проблеме по e-mail, если:</small>
    </h3>
        <div class="form-group">
	    <label class="col-sm-3 control-label no-padding-right" for="form-field-1"> Вы исполнитель: </label>
	    <div class="col-sm-9">
		<input id="trb_email_1" placeholder="e-mail:" class="col-xs-10 col-sm-5" type="password">
	    </div>
	</div>

        <div class="form-group">
	    <label class="col-sm-3 control-label no-padding-right" for="form-field-1"> В любом случае: </label>
	    <div class="col-sm-9">
		<input id="trb_email_2" placeholder="e-mail:" class="col-xs-10 col-sm-5" type="text">
	    </div>
	</div>
	<div class="clearfix form-actions">
		<div class="col-md-offset-3 col-md-9">
		    <button class="btn btn-info" type="button">
		        <i class="ace-icon fa fa-check bigger-110"></i>
			    Применить
		    </button>
		</div>
	</div>
    </form>
    <form class="form-horizontal" role="form">
    <h3 class="header smaller lighter blue">
	Установка заявок<br>
	<small>Уведомление о заявке по e-mail, если:</small>
    </h3>
        <div class="form-group">
	    <label class="col-sm-3 control-label no-padding-right" for="form-field-1"> В любом случае: </label>
	    <div class="col-sm-9">
		<input id="tik_email_2" placeholder="e-mail:" class="col-xs-10 col-sm-5" type="text">
	    </div>
	</div>
	<div class="clearfix form-actions">
		<div class="col-md-offset-3 col-md-9">
		    <button class="btn btn-info" type="button">
		        <i class="ace-icon fa fa-check bigger-110"></i>
			    Применить
		    </button>
		</div>
	</div>
    </form>

<?

?>