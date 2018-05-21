
function sel_green()
{
document.getElementById("pac-input").focus();
}

function sel_orange()
{
document.getElementById("pac-input2").focus();
}

var last_chat = 0;

var chatopened = 0;

function chat_key(e) {

    if (e.keyCode == 13) {
        send_chat();
    }
}


function chat_click() {
    if (chatopened == 0) {
        document.getElementById("chat_window").style.display = "inline";
        document.getElementById("chat_div").style.bottom = "400px";
        chatopened = 1;
    }
    else {
        document.getElementById("chat_window").style.display = "none";
        document.getElementById("chat_div").style.bottom = "60px";
        chatopened = 0;
    }

}

function chat_send() {
    chat_txt = document.getElementById("chat_send_text").value;
    document.getElementById("chat_send_text").value = "";
    url = "http://taxiprius.com.ge/chat.php?send=1&myid=" + myid + "&chat_txt=" + chat_txt;
    console.log("send chat: " + url);
    gamehttp.open('GET', url, true);
    gamehttp.send(null);
}

function change_start() {

}

function change_status(newstat) {
    console.log("status change: " + newstat + " / " + mystatus);
    if (newstat != mystatus) {

        if (newstat == 1) {

            uplimit = 1;
            document.getElementById("taxi_search_screen").style.display = "inline";
            document.getElementById("info_text").innerHTML = "მიმდინარეობს ტაქსის ძიება";
            document.getElementById("call_but").style.display = "none";
            document.getElementById("arrived_screen").style.display = "none";
            //document.getElementById("certilebi").style.display = "none";

			
        }
        else if (newstat == 2) {
            document.getElementById("taxi_search_screen").style.display = "none";
            uplimit = 1;
            document.getElementById("call_but").style.display = "none";
            document.getElementById("info_text").innerHTML = "ტაქსი მოდის";
			document.getElementById("driver_info").style.display="inline";
//            document.getElementById("certilebi").style.display = "none";
        //    myself = 1;
        }
        else if (newstat == 3) {
            uplimit = 1;
            document.getElementById("taxi_search_screen").style.display = "none";
            document.getElementById("call_but").style.display = "none";
            document.getElementById("arrived_screen").style.display = "inline";
			document.getElementById("driver_info").style.display="inline";
          //  document.getElementById("taxi_number").innerHTML = "ბორტის ნომერი: " + taxiname;
//            document.getElementById("certilebi").style.display = "none";

//            myself = 1;
        }
        else if (newstat == 4) {
            uplimit = 1;
            document.getElementById("taxi_search_screen").style.display = "none";
            document.getElementById("call_but").style.display = "none";
            document.getElementById("arrived_screen").style.display = "none";
			document.getElementById("driver_info").style.display="inline";
            document.getElementById("info_text").innerHTML = "ტაქსი გელოდებათ, ბორტი: " + taxiname;
//            document.getElementById("certilebi").style.display = "none";
      //      myself = 1;
        }
        else if (newstat == 5) {
            uplimit = 5;
            document.getElementById("taxi_search_screen").style.display = "none";
            document.getElementById("call_but").style.display = "none";
            document.getElementById("arrived_screen").style.display = "none";
            document.getElementById("info_text").innerHTML = "თქვენ მოძრაობთ";
//            document.getElementById("certilebi").style.display = "none";

       //     myself = 1;
        }

        else if (newstat == 0) {
            uplimit = 5;
            document.getElementById("call_but").style.display = "inline";
            document.getElementById("taxi_search_screen").style.display = "none";
            document.getElementById("arrived_screen").style.display = "none";
//            document.getElementById("certilebi").style.display = "inline";

        }
        mystatus = newstat;
    }


}

function cancel_call()
{
url = "http://taxiprius.com.ge/user_cancel.php?unique=" + myid;
console.log("taxi cancel: " + url);
gamehttp.open('GET', url, true);
gamehttp.send(null);

}

function chamovdivar() {
    if (MyUser != "nouser" && MyUser != "") {
        url = "http://taxiprius.com.ge/chamovdivar.php?uname=" + MyUser + "&pass=" + MyPass + "&lat=" + MyLat + "&long=" + MyLong + "&unique=" + myid;
    }
    else {
        url = "http://taxiprius.com.ge/chamovdivar.php?lat=" + MyLat + "&long=" + MyLong + "&unique=" + myid;
    }
    console.log("taxi chamovdivar: " + url);
    gamehttp.open('GET', url, true);
    gamehttp.send(null);

}

function cignore() {
    if (document.getElementById("ignor_cache").checked == true) {
        cache_ignore = 1;
    }
    else {
        cache_ignore = 0;
    }
}

function cignorewifi() {
    if (document.getElementById("ignor_cache_on_wifi").checked == true) {
        cache_ignore_wifi = 1;
    }
    else {
        cache_ignore_wifi = 0;
    }
}
var win;
function open_reg_window()
{
win=window.open('http://taxiprius.com.ge/user_reg.php',  '_blank', 'location=yes');

}

function setme() {
    if (startMarker !== undefined) {
        map.panTo(positionMarker.getPosition());
        geocodeLocation(positionMarker.getPosition(), infoWindow, 'positionMarker', state === 0 ? 'startMarker' : 'endMarker');

        infoWindow.open(map, positionMarker);
    }
    // startMarker.setOptions({position: {lat: MyLat, lng: MyLong}})
    // console.log("setme");
    // if (myself == 0) {
    //     myself = 1;
    //     document.getElementById("cbut").src = 'resources/center_sel.svg';
    // }
    // else {
    //     myself = 0;
    //     document.getElementById("cbut").src = 'resources/center.svg';
    // }

}

//document.getElementById("maptype").value=1;
var curmap = 1;

function changemap() {
    console.log("change map");
    curmap = document.getElementById("maptype").value;
    oxt = 0;
    oyt = 0;
    setmypos();
}

var curwindow = 0;

function show_settings() 
	{
	if (curwindow!=1)
		{
	
		checkConnection();

		curwindow = 1;
		if (MyUser!="" && MyUser!="youuser" && MyUser!="nouser")
			{
			login_to_server();
			}
		//document.getElementById("fanjara").style.visibility = "hidden";
		document.getElementById("settings_sheet").style.display = "inline";
		console.log("showing settings");
		}
	else
		{
		console.log("closing settings");
		show_map();
		}
}


function show_map() {
    curwindow = 0;
   // document.getElementById("fanjara").style.visibility = "visible";
    document.getElementById("settings_sheet").style.display = "none";
		console.log("hiding settings");
}


function stopScrolling(touchEvent) {
    touchEvent.preventDefault();
}


//document.body.addEventListener( 'touchmove' , stopScrolling , false );
var mcl = "orange";


function DrawUsers() {

    if (mystatus == 2) {

        console.log("draw taxi: " + taxilong + " / " + taxilat + " onme:" + myself);


      //  document.getElementById("taxibox").style.visibility = "visible";
        //document.getElementById("taxitext").innerHTML = taxiname;


    }
}


function DrawHomePos() {
    console.log("drawing home pos");


}


var but1 = 0;

var t2x = 0;
var t2y = 0;

var tdist = 0;
var tdist_old = 0;


function mdown(event) {

}


var sfinx = 0;
var finy = 0;

function getmousecoord(event) {
    console.log("get mouse coord movedi");

}

function mup(event) {
    console.log("mouse up");

}


//document.ontouchmove = function (e) {  console.log("object: "+e.target.id);};


document.getElementById("fanjara").style.width = sx + "px";
document.getElementById("fanjara").style.height = sy + "px";

//document.getElementById("mouser").style.width=sx+"px";
//document.getElementById("mouser").style.height=sy+"px";


function zoomme(sait) {

}

var myloginid = 0;


function saveuser() 
	{
    if (document.getElementById("myname").value != "" && document.getElementById("mypass").value != "") 
		{
        MyUser = document.getElementById("myname").value;
        MyPass = document.getElementById("mypass").value;
		}
    else 
		{
        MyUser = "nouser";
        MyPass = "nopass";
		}

    WriteData();


	login_to_server();
    if (started == 0) 
		{
        Start();
		}
	}

function login_to_server()
	{
	url = "http://taxiprius.com.ge/login.php?login=1&unique=" + myid + "&myuser=" + MyUser + "&mypass=" + MyPass;
    console.log("login: " + url);
    gamehttp.open('GET', url, true);
    gamehttp.send(null);
	}


var curx;
var cury;
var oxt = 0;
var oyt = 0;
var tilef = 0;

var kartX;
var kartY;

function setmypos() {
    if (window.navigator.onLine == false) {
        document.getElementById("myint").style.display = "inline";
    }
    else {
        document.getElementById("myint").style.display = "none";
    }


    DrawHomePos();

    var myLatLng = {lat: MyLat, lng: MyLong};
    positionMarker.setPosition(myLatLng);
   
    console.log("move main marker");
}

function check_user_click() {

}

function hide_profile() {
    document.getElementById("profile_div").style.visibility = "hidden";
//	document.getElementById("mouser").style.visibility="visible";
    curtaxi = -1;
}

var curtaxi = -1;

function show_profile(tid) {
    var curtaxi = tid;
    document.getElementById("profile_div").style.visibility = "visible";
//	document.getElementById("mouser").style.visibility="hidden";
}

var callingtaxi = 0;

/**Returns whether the number is valid*/
function isValidInput(input1) {
    return true;
}
var end_set=0;
function call_taxi() {
   
    if (mytel == "" || mytel.length < 6) 
		{

         mytel = prompt("რა ნომერზე დაგიკავშირდეთ?");
         WriteData();
      
    }

    if ((mytel != "" && mytel != null) && mytel.length >= 6) 
		{
		var start_lat = startMarker.getPosition().lat();
		var start_lng = startMarker.getPosition().lng();
		var end_lat = 0;
		var end_lng = 0;

		document.getElementById("input_boxes").style.display="none";
		document.getElementById("on_call_menu").style.display="inline";

		document.getElementById("pac-input").style.disabled="true";
		document.getElementById("pac-input2").style.disabled="true";

		var start_str=document.getElementById("pac-input").value;
		var end_str=document.getElementById("pac-input2").value;



		start_str=start_str.replace("'","");
		end_str=end_str.replace("'","");

		start_str=start_str.replace(", Tbilisi, Georgia","");
		end_str=end_str.replace(", Tbilisi, Georgia","");


		if (end_set==1)
			{
			end_lat=endMarker.getPosition().lat();
			end_lng=endMarker.getPosition().lng();
			}
        if (MyUser !== "nouser" && MyUser !== "") {
            url = "http://taxiprius.com.ge/call.php?uname=" + MyUser + "&pass=" + MyPass + "&lat=" + start_lat + "&long=" + start_lng + "&unique=" + myid + "&tel=" + mytel+"&endlat=" + end_lat + "&endlong=" + end_lng+"&start_str="+start_str+"&end_str="+end_str;
        }
        else {
            url = "http://taxiprius.com.ge/call.php?lat=" + start_lat + "&long=" + start_lng + "&unique=" + myid + "&tel=" + mytel+"&endlat=" + end_lat + "&endlong=" + end_lng+"&start_str="+start_str+"&end_str="+end_str;
        }
        callingtaxi = 1;
        console.log("taxi call: " + url);
        gamehttp.open('GET', url, true);
        gamehttp.send(null);

    }
}


function logout() {
    myloginid = 0;
	MyUser="";
	MyPass="";
    WriteData();

    document.getElementById("myname").value = "";
    document.getElementById("mypass").value = "";
    document.getElementById("loggedin_page").style.display = "none";
    document.getElementById("login_page").style.display = "inline";
}

function fail(error) {
    console.log(error.code);
}

function make_call()
	{
	var u=new Array();
	u=taxiname.split("<hr>");

	window.plugins.CallNumber.callNumber(onCallSuccess, onCallError, u[2], true);
	}


	function onCallSuccess(result){
  console.log("call Success:"+result);
}

function onCallError(result) {
  console.log("call Error:"+result);
}

function card_pay()
	{
	window.open('http://taxiprius.com.ge/bank_req.php?tanxa='+tanxa+"&unid="+myid, '_blank', 'location=yes');
	}

function close_end_info()
	{
	tanxa=0;
	document.getElementById("end_screen").style.display="none";

	}