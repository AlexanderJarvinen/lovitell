function get_data(target){
    	if (target == 'types'){
    	    type = get_cookie('type');
    	    if (type == null){
    		document.cookie = "type=" + escape("2")
    		                  + "; expires=15/02/2023 00:00:00";
    		type = get_cookie('type');
    	    }
        }
        $.ajax({
    	    type: "GET",
    	    url: "/ajax/nagios.rep/get_data.php",
    	    data: ({
    		"target"	: target,
    		"type"		: type,
    	    }),
    	    success: function(a){
		//alert('reload left');
    		if (target == 'left'){
    		    $('#left_table').html(a);
    		} else if (target == 'right'){
    		    $('#right_table').html(a);
    		} else if (target == 'types'){
    		    $('#select').html(a);
    		    $("#type [value='"+type+"']").attr("selected", "selected");
    		} else {
    		    alert("Не указан блок вывода");
    		}
    	    }
        });
}

function left_timer(){
    time = $('#left_timer').text();
    if (time == '00'){
	time = "61";
	get_data('left');
    }
    time = parseInt(time, 10)-1;
    time = String(time);
    if (String(time.length) == 1){
	time = "0"+String(time);
    }
    $('#left_timer').text(time);
}

function right_timer(){
    time = $('#right_timer').text().split(':');
    if (time[1] == '00'){
	time[0] = parseInt(time[0], 10)-1;
	time[1] = 60;
    }
    if (time[0] == '00'){
	time[0] = 14;
	get_data('right');
    }
    time[1] = parseInt(time[1], 10)-1;
    time[1] = String(time[1]);
    time[0] = String(time[0]);
    if (String(time[1].length) == 1){
	time[1] = "0"+String(time[1]);
    }
    
    if (String(time[0].length) == 1){
	time[0] = "0"+String(time[0]);
    }
        
    $('#right_timer').text(time[0]+":"+time[1]);    
}

function authChk(){
    $.ajax({
    dataType: "json",
    type: "POST",
    url: "/ajax/auth.php",
    
    success: function(a){
	alert(a.err+"\n"+a.login+"\n"+a.password);
        var err=a.err;
        if(err == 0){ 
    	    //location="http://crm.tut.net/ajax/nagios.rep/index1.html";
        } else {
            location="login.html";
        }
    }
    });
}

function fullscreen(element) {
    if(element.requestFullScreen) {
	element.requestFullScreen();
    } else if(element.mozRequestFullScreen) {
	element.mozRequestFullScreen();
    } else if(element.webkitRequestFullScreen) {
	element.webkitRequestFullScreen();
    }
    $("#fs").text('');
}

function get_cookie(cookie_name) {
    var results = document.cookie.match ( '(^|;) ?' + cookie_name + '=([^;]*)(;|$)' );
   
    if ( results )
	return ( unescape ( results[2] ) );
    else
       return null;
}

function set_type(){
    type = $("#type option:selected").val();
    document.cookie = "type=" + escape(type)
    			+ "; expires=15/02/2023 00:00:00";
    get_data("right");
}