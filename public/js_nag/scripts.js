function l1_title(desk){
    $('#l1-header').html(desk);
};

function l2_title(desk){
    $('#l2-header').html(desk);
};

function report(id){
    if (id == 8){
	url="/ajax/equip.php";
    } else {
	url="/ajax/parser.php";
    }
    $('#page-header').html($('#'+id).text());
    var date = new Date();
    //dateFormat(now, "yyyy-mm-dd")
    $('#small-header').html(date.getFullYear() + '-' + ('0' + (date.getMonth() + 1)).slice(-2) + '-' + ('0' + date.getDate()).slice(-2) + ' ' + ('0'+date.getHours()).slice(-2) + ':' + ('0'+date.getMinutes()).slice(-2));
    $('#results').html('<image src=\"/images/ajax-loader.gif\">');

    $.ajax(url,{
	type: "GET",
	//url: "/ajax/equip.php",
    	data: ({
            "id" : id
        }),
        success: function(a){
    	    $('#results').html(a);
        }
    });
};

/*
$(function(){
  $('li').tooltip({
    show: {
	effect: "slideDown",
	delay: 250
    }
 });
});

$(function(){
  $('th').tooltip({
    show: {
	effect: "slideDown",
	delay: 250
    }
  });
});
*/
$(function(){
  $( document ).tooltip({
    show: {
	effect: "slideDown",
	delay: 250
    }
  });
});

$(function(){
        $("#datepicker0").datepicker({
            showOtherMonths: true,
            selectOtherMonths: false,
        });
});

$(function(){
        $("#datepicker1").datepicker({
            showOtherMonths: true,
            selectOtherMonths: false,
        });
});

function send(){
    var mist=0;
    var date1=$('input[name=date1]').val();
    var date2=$('input[name=date2]').val();
    var action=$('input[name=action]').val();
    var id=$('input[name=id]').val();
    
    var arr1=date1.split('.');
    var arr2=date2.split('.');

    if (new Date(arr1[2]+'-'+arr1[1]+'-'+arr1[0]) > new Date(arr2[2]+'-'+arr2[1]+'-'+arr2[0])){
	alert('Дата начала больше даты окончания периода');
	mist=mist+1;
    }
    if (!date1) {
	mist=mist+1;
	alert('Отсутствует дата начала периода');
    }
    if (!date2) {
	mist=mist+1;
	alert('Отсутствует дата окончания периода');
    }
    if (mist == 0){
	//document.cookie=rep+id+out+ "=" + date2;
	// GET CURRENT DATE
	var date = new Date();
 
	// GET YYYY, MM AND DD FROM THE DATE OBJECT
	var yyyy = date.getFullYear().toString();
	var mm = (date.getMonth()+1).toString();
	var dd  = date.getDate().toString();
  
	// CONVERT mm AND dd INTO chars
	var mmChars = mm.split('');
	var ddChars = dd.split('');
   
	// CONCAT THE STRINGS IN YYYY-MM-DD FORMAT
	var datestring = (ddChars[1]?dd:"0"+ddChars[0]) + '.'  + (mmChars[1]?mm:"0"+mmChars[0]) + '.' +  yyyy;
	if (date1 != datestring){
	    document.cookie='rep'+id+'st'+ "=" + date1;
	    //alert(datestring);
	}
	else {
	    document.cookie='rep'+id+'st'+ "="+'';
	}
	if (date2 != datestring){
	    document.cookie='rep'+id+'end'+ "=" + date2;
	    //alert(datestring);
	}
	else {
	    document.cookie='rep'+id+'end'+ "="+'';
	}
	$.ajax(url,{
	    type: "GET",
	    url: "/ajax/parser.php",
	    data: ({
	        "id" : id,
		"date1"  : date1,
		"date2"  : date2,
		"action" : action
	    }),
	    success: function(a){
		$('#results').html(a);
	    }
	});
    }
};

function authChk(){
    $.ajax({
        dataType: "json",
        type: "POST",
        url: "/ajax/auth.php",
        success: function(a){
                //alert(a.err+"\n"+a.login+"\n"+a.password);
                var err=a.err;
                if(err == 0){ //location="http://www.lan.lealta.ru/index.php";
                }
                else {
                    location="login.html";
                }
        }
    });
}

function logOut(){
    $.ajax({
        dataType: "json",
        type: "POST",
        url: "/ajax/auth.php",
        data: ({
	        "act" : "logout"
	    }),
        success: function(a){
                //alert(a.err+"\n"+a.login+"\n"+a.password);
                var err=a.err;
                    location="login.html";
                }
    });
}

function userSettings(){
    $.ajax({
	//dataType: "json",
        type: "POST",
            url: "/ajax/settings.php",
            success: function(a){
    	    //alert("User Settings\n"+a.err+"\n"+a.login+"\n"+a.password);
	    $('#results').html(a);
        }
    });
}

function dashboard(){
    $.ajax({
	//url: "/ajax/chart_view.php",
        url: "/ajax/dashboard.php",
        success: function(a){
    	    $('#results').html(a);
        }
    });

}