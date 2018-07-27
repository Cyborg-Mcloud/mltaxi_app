var mystatus = 0;

document.addEventListener("deviceready", onDeviceReady, false);

var myid = 0;
var map;

var nogps = 0;

var wlon = 42.6939377;
var wlat = 42.2480125;
var MyUser = "nouser";
var MyPass = "nopass";
var MyZoom = 17;
var mytel = "";


var MyLat = 42.2480125;
var MyLong = 42.6939377;
var MyAlt;
var MyHead;
var MySpeed;
var MyAcc;
var started;
started = 0;

function onBackKeyDown() 
	{
    if (curwindow == 1) 
		{
        show_map();
    }
}

function onMenuDown() {
    if (curwindow == 0) {
        show_settings();
    }
}


function onSearchDown() 
	{
    if (myself == 0) 
		{
        setme();
	    }
	}

function onVolumeDown() {
    //zoomme(-1);
}

function onVolumeUp() {
    //zoomme(1);
}

var dataex = 0;

var xtile;
var ytile;

var mousex;
var mousey;
var omousex;
var omousey;

var sx;
var sy;

var canacX;
var canacY;
var inter = 'none';

var inpause = 0;

sx = getscreenw();
sy = getscreenh();
var myself = 0;


var gamehttp;
if (window.XMLHttpRequest) {
    gamehttp = new XMLHttpRequest();
}
else if (window.ActiveXObject) {
    gamehttp = new ActiveXObject('Microsoft.XMLHTTP');
}
else {
    alert('Your browser does not support XMLHTTP!');
}
gamehttp.onreadystatechange = update_data;


var userids = new Array();
var usernames = new Array();
var userlongs = new Array();
var userlats = new Array();
var useralts = new Array();
var userspeeds = new Array();
var userheads = new Array();
var userlasts = new Array();


var cache_ignore = 0;
var cache_ignore_wifi = 1;


var cur_down_i = 0;
var cur_down_ii = 0;
var down_complete = 1;
var check_complete = 1;
var file_downing = 0;
var LT_finished = 0;
var watchID = null;

// powermanagement -ის ფუნქციები
//window.powermanagement.acquire();
//window.powermanagement.release();

var gps_start=0;

// ----------------------------------------------------------------
function onDeviceReady() {
	console.log('succ')
	console.log("setting immersive");

	// FULLSCREEN ->

//	AndroidFullScreen.immersiveMode(successFunction, errorFunction);

	
	document.getElementById("GPS_search_screen").style.display = "none";

	// es ari accurasy settingi fine location-ze da mere authorizacis motxovna da tu gps gamortulia an auth ar aqvs dialogs agdebs
	req_loc_acc();
	req_loc_auth();
	// -------------------------------------

	ReadData();

	document.getElementById("myname").value=MyUser;
	document.getElementById("mypass").value=MyPass;
	if (MyUser!="" && MyUser!="youuser" && MyUser!="nouser")
		{
		login_to_server();
		}

	console.log("device ready, checking connection");
	checkConnection();

	document.addEventListener("pause", onPause, false);
	//document.addEventListener("backbutton", onBackKeyDown, false);
	//document.addEventListener("menubutton", onMenuDown, false);
	//document.addEventListener("searchbutton", onSearchDown, false);
	document.addEventListener("volumedownbutton", onVolumeDown, false);
	document.addEventListener("volumeupbutton", onVolumeUp, false);

	console.log("device ready, getting position");

	navigator.geolocation.getCurrentPosition(onSuccess, function (e) {
		console.log(e);
		return onSuccess({
			coords: {
				latitude: 41.7151,
				longitude: 44.8271,
				altitude: 0,
				heading: 0,
				speed: 0,
				accuracy: 1
			}
		});
	}, {enableHighAccuracy: true, maximumAge: 0});
	var opts = {timeout: 5000, enableHighAccuracy: true, maximumAge: 0};
	//		watchID = navigator.geolocation.watchPosition(onSuccess, onError, opts);

	document.addEventListener("resume", onResume, false);

	//  }, function () {
	//      console.log('looL')
	// });


	// qveda amosagebia
	// kc = checkIfFileExists("locdata.txt");


	if (started==0)
	{
	Start();
	}
	//setmypos();
}

// ------------------------


function onError(e) {
    return;
    console.log(e);

//        MyLat=position.coords.latitude ;
//        MyLong=position.coords.longitude ;
//        MyAlt=position.coords.altitude ;
//        MyHead=position.coords.heading ;
//        MySpeed=position.coords.speed ;
//        MyAcc=position.coords.accuracy;


    // console.log("error getting location");
    nogps++;
    if (nogps > 1) {
        document.getElementById("nogps").style.display = "inline";
    }
 
}

var updatacounter = 0;
var uplimit = 5;

var tanxa=0;
function MainProg() 
	{
     console.log("main prog: " + started);
 
    if (started == 1) 
		{
        updatacounter++;
        if (updatacounter > uplimit) 
			{
			console.log("uploading data");
            UpData();
            updatacounter = 0;
	        }


        if (myself == 1 && inpause == 0) 
			{
			console.log("MainProg->myself: "+myself);
            wlon = MyLong;
            wlat = MyLat;
            setmypos();
			 var myLatLng = new [ MyLat, MyLong];
			 myMap.panTo(myLatLng);
	        }
	    }
    navigator.geolocation.getCurrentPosition(onSuccess, onError, {enableHighAccuracy: true, maximumAge: 0});
    setTimeout("MainProg();", 1000);
}

var taxilong = 0;
var taxilat = 0;
var taxiname = "";
var notified = 0;


var sit_price= new Array();
var kmprice= new Array();

sit_price[1]=2;
sit_price[2]=3;
sit_price[3]=4;

kmprice[1]=0.5;
kmprice[2]=0.6;
kmprice[3]=0.75;
var last_status=0;


var chatis = "";
var meters=0;
function update_data() {
    if (gamehttp.readyState == 4) {
        mr = gamehttp.responseText;
        if (mr != "") {
             console.log("data received from server: " + mr);
            if (mr == "register") 
				{

                console.log("register received");
                Start();
	            }
            else if (mr.substring(0, 4) == "logi") {
                console.log("login receive: " + mr);
                a = mr.split("|");

                console.log("loginid:" + a[1]);
                if (a[1] != "error") 
					{
                    myloginid = a[1];
                    MyUser = a[2];
                    WriteData();
	                }
                else {alert("ელ.ფოსტა/მობილური ან პაროლი არასწორია!");}


				if (myloginid > 0) 
					{
                    document.getElementById("loggedin_info").innerHTML = "მოგესალმებით " + MyUser;
					document.getElementById("loggedin_page").style.display = "inline";
                    document.getElementById("login_page").style.display = "none";
                    document.getElementById("regbut").style.display = "inline";
	                }
                else 
					{
                    document.getElementById("loggedin_page").style.display = "none";
                    document.getElementById("login_page").style.display = "inline";
	                }
		        }
            else if (mr.substring(0, 4) == "chat") {
                console.log("chat receive: " + mr);
                a = mr.split("|");
                chatis = a[1];
               // document.getElementById("chat_txt").innerHTML = chatis;
               // document.getElementById("chat_txt").scrollTop = document.getElementById("chat_txt").scrollHeight;
                ;
            }
            else 
				{
                a = mr.split("|");
                if (a[0] == "searching_taxi") 
					{
					last_status=mystatus;
                    notified = 0;
                    change_status(1);
                    callingtaxi = 0;
					if (last_status!=mystatus)
						{
						document.getElementById("input_boxes").style.display="none";
						document.getElementById("on_call_menu").style.display="inline";
						document.getElementById("dirinfo_parent").style.display="none";




						document.getElementById("car_choose").style.display="none";
						}
					b = a[1].split(";");
					if (b[0] != "") 
						{
                        sit_price[1]=parseInt(b[4]);
						kmprice[1]=parseFloat(b[5]);
                        sit_price[2]=parseInt(b[6]);
						kmprice[2]=parseFloat(b[7]);
                        sit_price[3]=parseInt(b[8]);
						kmprice[3]=parseFloat(b[9]);
						meters=parseInt(b[10]);
						call_class=parseInt(b[11]);
						}
				 }
                else if (a[0] == "taxi_moving") {
					last_status=mystatus;
                    notified = 0;
                    callingtaxi = 0;
                    change_status(2);
                    b = a[1].split(";");
                    if (b[0] != "") 
						{
                        taxilong = parseFloat(b[0]);
                        taxilat = parseFloat(b[1]);
                        taxiname = b[2];
					
						var latlng = new [taxilat, taxilong];
						 carMarker.geometry.setCoordinates(latlng);
						// carMarker.setMap(map);
						
						sit_price[1]=parseInt(b[4]);
						kmprice[1]=parseFloat(b[5]);
                        sit_price[2]=parseInt(b[6]);
						kmprice[2]=parseFloat(b[7]);
                        sit_price[3]=parseInt(b[8]);
						kmprice[3]=parseFloat(b[9]);
						meters=parseInt(b[10]);
						call_class=parseInt(b[11]);

						var ta=new Array();
						ta=taxiname.split("<hr>");
						
						var molodini="";
						if (meters>50)
							{
							molodini=(parseInt(meters/800)+1)+" წთ.";
							}
						else
							{
							molodini="0 წთ.";
							}

							
						document.getElementById("manq_nomer").innerHTML=ta[1]+", მოლოდინის დრო: "+molodini+"წთ";
						document.getElementById("mzgol_tel").innerHTML=" <a href='Javascript: make_call();'><img src='resources/call.png' height=18px></a>"+ta[2];
						document.getElementById("mzgol_name").innerHTML=ta[0];

					

						if (last_status!=mystatus)
							{
							document.getElementById("status_txt").innerHTML="ტაქსი გზაშია";
							document.getElementById("end_screen").style.display="none";
							document.getElementById("driver_info").style.display="block";

							document.getElementById("input_boxes").style.display="none";
							document.getElementById("on_call_menu").style.display="inline";
							document.getElementById("dirinfo_parent").style.display="none";
							document.getElementById("car_choose").style.display="none";
							}

						}
					}
                else if (a[0] == "taxi_arrived") 
					{
                    callingtaxi = 0;
					last_status=mystatus;
                    change_status(3);
                    b = a[1].split(";");
                    if (b[0] != "") {
                        taxilong = parseFloat(b[0]);
                        taxilat = parseFloat(b[1]);
                        taxiname = b[2];

						sit_price[1]=parseInt(b[4]);
						kmprice[1]=parseFloat(b[5]);
                        sit_price[2]=parseInt(b[6]);
						kmprice[2]=parseFloat(b[7]);
                        sit_price[3]=parseInt(b[8]);
						kmprice[3]=parseFloat(b[9]);
						meters=parseInt(b[10]);
						call_class=parseInt(b[11]);

						var latlng = new [taxilat, taxilong];
						carMarker.geometry.setCoordinates(latlng);


						var ta=new Array();
						ta=taxiname.split("<hr>");
						
						if (mystatus!=last_status)
							{
							document.getElementById("status_txt").innerHTML="ტაქსი მოვიდა";
							navigator.vibrate(1000);
							document.getElementById("input_boxes").style.display="none";
							document.getElementById("on_call_menu").style.display="inline";
							document.getElementById("car_choose").style.display="none";
							}
					
						document.getElementById("manq_nomer").innerHTML=ta[1];
						document.getElementById("mzgol_tel").innerHTML=" <a href='Javascript: make_call();'><img src='resources/call.png' height=18px></a>"+ta[2];
						document.getElementById("mzgol_name").innerHTML=ta[0];
                        //document.getElementById("taxi_number").innerHTML = "ბორტის ნომერი: " + taxiname;
                        if (notified == 0) {


//							  Notification.requestPermission(function (permission) {
								// If the user accepts, let’s create a notification
//								if (permission === ‘granted’) {
//								  var notification = new Notification(“ტაქსი მოვიდ”, {
//									   tag: ‘message1’, 
//									   body: “თქვენი ტაქსი მოვიდა და გელოდებათ” 
//								  }); 
//								  notification.onshow  = function() { console.log(‘show’); };
//								  notification.onclose = function() { console.log(‘close’); };
//								  notification.onclick = function() { console.log(‘click’); };
//								}
//							  });
							

                            window.plugin.notification.local.schedule({
								id: "321123",  // A unique id of the notifiction
								text: "თქვენი ტაქსი მოვიდა და გელოდებათ",  // The message that is displayed
								title: "ტაქსი მოვიდა",  // The title of the message

                            });
                            notified = 1;
                        }

                    }
                }
                else if (a[0] == "taxi_waiting") 
					{
					last_status=mystatus;
                    callingtaxi = 0;
                    change_status(4);
                    b = a[1].split(";");
                    if (b[0] != "") 
						{
                        taxilong = parseFloat(b[0]);
                        taxilat = parseFloat(b[1]);
                        taxiname = b[2];
						var ta=new Array();
						ta=taxiname.split("<hr>");
						
							document.getElementById("manq_nomer").innerHTML=ta[1];
						document.getElementById("mzgol_tel").innerHTML=" <a href='Javascript: make_call();'><img src='resources/call.png' height=18px></a>"+ta[2];
						document.getElementById("mzgol_name").innerHTML=ta[0];
						if (mystatus!=last_status)
							{
							document.getElementById("status_txt").innerHTML="ტაქსი გელოდებათ";
							document.getElementById("input_boxes").style.display="none";
							document.getElementById("on_call_menu").style.display="inline";
							document.getElementById("dirinfo_parent").style.display="none";
							document.getElementById("car_choose").style.display="none";
							}
						
						sit_price[1]=parseInt(b[4]);
						kmprice[1]=parseFloat(b[5]);
                        sit_price[2]=parseInt(b[6]);
						kmprice[2]=parseFloat(b[7]);
                        sit_price[3]=parseInt(b[8]);
						kmprice[3]=parseFloat(b[9]);
						meters=parseInt(b[10]);
						call_class=parseInt(b[11]);

						var latlng = new [taxilat, taxilong];
						 carMarker.geometry.setCoordinates(latlng);

						}
					}
                else if (a[0] == "you_moving") 
					{
					console.log("you moving");
					last_status=mystatus;
                    notified = 0;
                    callingtaxi = 0;
                    change_status(5);
                    b = a[1].split(";");
                    if (b[0] != "") 
						{
                        taxilong = parseFloat(b[0]);
                        taxilat = parseFloat(b[1]);
taxiname = b[2];
ta=taxiname.split("<hr>");
						sit_price[1]=parseInt(b[4]);
						kmprice[1]=parseFloat(b[5]);
                        sit_price[2]=parseInt(b[6]);
						kmprice[2]=parseFloat(b[7]);
                        sit_price[3]=parseInt(b[8]);
						kmprice[3]=parseFloat(b[9]);
						meters=parseInt(b[10]);
						call_class=parseInt(b[11]);

						console.log(kmprice[1]+ " / "+sit_price[1]+ " / "+meters);
						var metrebi=parseInt((meters/1000)*100)/100;
						var metrebi_real=parseInt(metrebi*1.12*100)/100;

						var	tanxa=datvale_pussy(metrebi_real);
                        taxiname = "მანძილი: "+metrebi_real+" კმ<hr>თანხა: "+tanxa+" ლარი";
						
						tanxa=parseFloat(b[12]);

						
						
						document.getElementById("manq_nomer").innerHTML="მანძილი: "+metrebi_real +" კმ";
						document.getElementById("mzgol_tel").innerHTML=" <a href='Javascript: make_call();'><img src='resources/call.png' height=18px></a>"+ta[2];
						document.getElementById("mzgol_name").innerHTML="თანხა: "+tanxa+" ლარი";


						if (mystatus!=last_status)
							{
							document.getElementById("status_txt").innerHTML="თქვენ მოძრაობთ";
							document.getElementById("driver_info").style.display="block";
							document.getElementById("input_boxes").style.display="none";
							document.getElementById("on_call_menu").style.display="none";
							document.getElementById("dirinfo_parent").style.display="none";
							document.getElementById("car_choose").style.display="none";
							}
						var latlng = new [taxilat, taxilong];
						 carMarker.geometry.setCoordinates(latlng);

						}
					}
				else if (a[0] == "toofar") 
					{
					console.log("out of radius");
					
					callingtaxi = 0;
					notified = 0;
					uplimit = 5;
					carMarker.setMap(null);
					taxiname="";

					appr_price=0;
					document.getElementById("call_but").style.display = "inline";
					document.getElementById("arrived_screen").style.display = "none";
					document.getElementById("driver_info").style.display="none";
					document.getElementById("pac-input").value="";
					document.getElementById("pac-input2").value="";
					document.getElementById("dirinfo_parent").style.display="none";
					document.getElementById("pac-input").style.disabled="false";
					document.getElementById("pac-input2").style.disabled="false";

					document.getElementById("input_boxes").style.display="inline";
					document.getElementById("on_call_menu").style.display="none";



					startMarker.setMap(null);
					endMarker.setMap(null);
					dirRender.setMap(null);
					endMarker.setMap(null);
					end_set=0;
					//document.getElementById("driver_info_text").innerHTML =  taxiname;
					change_status(0);
					alert("ML Taxi მუშაობს მხოლოდ ქუთაისში");
					}
                else 
					{
					// when screen is idle
                    if (mystatus > 0)
						{
						// tu cina statusi ragac iyo, anu gamozaxebidan movedi

						if (mystatus==5)
							{
							var metrebi=parseInt((meters/1000)*100)/100;
							var metrebi_real=parseInt(metrebi*1.12*100)/100;
							var	tanxa=datvale_pussy(metrebi_real);
							document.getElementById("end_screen").style.display="inline";
							document.getElementById("end_info").innerHTML = "მანძილი: "+metrebi_real+" კმ<hr>თანხა: "+tanxa+" ლარი";


							call_class=1;
							callingtaxi = 0;
							notified = 0;
							uplimit = 5;
							carMarker.setMap(null);
							taxiname="";
							appr_price=0;
							startMarker.setMap(null);
							endMarker.setMap(null);
							dirRender.setMap(null);
							endMarker.setMap(null);
							end_set=0;

							change_status(6);
							}
						else
							{
							call_class=1;
							callingtaxi = 0;
							notified = 0;
							uplimit = 5;
							carMarker.setMap(null);
							taxiname="";

							appr_price=0;
							document.getElementById("call_but").style.display = "inline";
							document.getElementById("arrived_screen").style.display = "none";
							document.getElementById("driver_info").style.display="none";
							document.getElementById("pac-input").value="";
							document.getElementById("pac-input2").value="";
							document.getElementById("pac-input3").value="";
							document.getElementById("pac-input3").style.display="none";
							document.getElementById("dirinfo_parent").style.display="none";
							document.getElementById("pac-input").style.disabled="false";
							document.getElementById("pac-input2").style.disabled="false";						
							document.getElementById("pac-input3").style.disabled="false";
							document.getElementById("car_choose").style.display="block";
							document.getElementById("input_boxes").style.display="inline";
							document.getElementById("on_call_menu").style.display="none";
							document.getElementById("add_third").style.display="none";


//							document.getElementById("call_div").style.bottom="160px";
//							document.getElementById("car_choose").style.bottom="0px";

							startMarker.setMap(null);
							endMarker.setMap(null);
							dirRender.setMap(null);
							endMarker.setMap(null);
							end_set=0;
							//document.getElementById("driver_info").innerHTML =  taxiname;
							change_status(0);
							}
						}
					// check_chat(parseInt(mr));
					if (a[0] == "idle") 
						{
						b = a[1].split(";");
						if (b[0] != "") 
							{
							sit_price[1]=parseInt(b[4]);
							kmprice[1]=parseFloat(b[5]);
							sit_price[2]=parseInt(b[6]);
							kmprice[2]=parseFloat(b[7]);
							sit_price[3]=parseInt(b[8]);
							kmprice[3]=parseFloat(b[9]);
							meters=parseInt(b[10]);

							}
						}

					}

                if (inpause == 0) {
                    DrawUsers();
                }


            }
        }
    }
}

function check_chat(chatid) 
	{
    if (chatid != last_chat) {
        last_chat = chatid;
        url = "http://mltaxi.ge/chat.php?req=1&myid=" + myid;

        console.log("request chat: " + url);
        gamehttp.open('GET', url, true);
        gamehttp.send(null);
		}
	}

function UpData() 
	{
    if (myid == 0 || myid == "") 
		{
        myid = Math.floor(Math.random() * 100000000);
        WriteData();
	    }
	if (curint==1)
		{
		
		console.log("update, callingtaxi: "+callingtaxi);
		if (callingtaxi == 0 )
			{
			if (MyUser != "nouser" && MyUser != "") 
				{
				url = "http://mltaxi.ge/upload.php?uname=" + MyUser + "&pass=" + MyPass + "&lat=" + MyLat + "&long=" + MyLong + "&alt=" + MyAlt + "&head=" + MyHead + "&speed=" + MySpeed + "&passive=" + inpause + "&myid=" + myid;
				}
			else 
				{
				url = "http://mltaxi.ge/upload.php?passive=" + inpause + "&myid=" + myid + "&lat=" + MyLat + "&long=" + MyLong + "&alt=" + MyAlt + "&head=" + MyHead + "&speed=" + MySpeed;
				}
			console.log("just upload: " + url);
			//	document.getElementById('erorebi').innerHTML="uname="+MyUser+"&pass="+MyPass+"&lat="+MyLat+"&long="+MyLong+"&alt="+MyAlt+"&head="+MyHead+"&speed="+MySpeed;
			gamehttp.open('GET', url, true);
			gamehttp.send(null);
			}
		}
	else
		{
		console.log("no internet");
		checkConnection();

		}
	}

function Start() {
    console.log("Start / END");
    if (started == 0) {
        started = 1;
        MainProg();
    }  // document.getElementById('mainb').innerHTML="STOP";
    else {//started=0;
    } //  document.getElementById('mainb').innerHTML="START";

}

function onPause() {
    return;
    console.log("on pause");
//	if (started==0)
    //{
    if (mystatus == 0 || mystatus == 5) {
        started = 0;
        clearWatch();
        WriteData();
        inpause = 1;
    }

}

function onResume() {
    return;
    console.log("on resume");
    if (inpause == 1) {
        inpause = 0;
    }

    if (started == 0) {
        checkConnection();

        var opts = {timeout: 30000, enableHighAccuracy: true};
//        watchID = navigator.geolocation.watchPosition(onSuccess, onError, opts);

        Start();
    }

    //checkIfFileExists("locdata.txt");
    //if (dataex==0)
    //	{WriteData();}

    ReadData();

// daakomentare jer


    //setmypos();
    //DrawUsers();
}


function onSuccess(position) {
   
	
	
    
    // infoWindow.setContent(getInfoContent('positionMarker'));
 

	

    nogps = 0;
	console.log("GPS on success");
    document.getElementById("GPS_search_screen").style.display = "none";

    MyLat = position.coords.latitude;
    MyLong = position.coords.longitude;
    MyAlt = position.coords.altitude;
    MyHead = position.coords.heading;
    MySpeed = position.coords.speed;
    MyAcc = position.coords.accuracy;

    wlon = MyLong;
    wlat = MyLat;
	console.log("on succ, sett long: "+MyLat+ " - " +MyLong);

//	var pos = {
//        lat: position.coords.latitude,
//        lng: position.coords.longitude
//    };

var pos=new [position.coords.latitude,  position.coords.longitude]
    positionMarker.geometry.setCoordinates(pos);

	if (gps_start==0)
		{
		// gps-is pirveli gashveba
		positionMarker.setMap(map);

		gps_start=1;
		myMap.geoObjects.remove(multiRoute);
		myMap.geoObjects.remove(multiRoute2);
		myMap.geoObjects.remove(startMarker);
		myMap.geoObjects.remove(endMarker);
		myMap.geoObjects.remove(thirdmarker);
		startMarker = new ymaps.Placemark(pos, {hintContent: 'სტარტი', balloonContent: 'სტარტი'}, {iconLayout: 'default#image', iconImageHref: 'resources/pin_start.svg', iconImageSize: [30, 30], iconImageOffset: [-15, 0]  });
		myMap.geoObjects.add(startMarker);

		geocodeLocation(pos, infoWindow, 'startMarker');
//		infoWindow.open(map, startMarker);
	    
		myMap.setCenter(pos);
		}

    // programis dastartva
	if (started == 0) 
		{
        Start();
	    }

    setmypos();
//	document.getElementById('geopos_short').innerHTML="<table width=100% cellspacing=0><tr><td>Accuracy: "+MyAcc+"</td><td>Altitude: "+MyAlt+"</td></tr></table>";

}


function getpos() {
    // console.log("get pos");
    document.getElementById('geopos').innerHTML = "Finding geolocation...";
    navigator.geolocation.getCurrentPosition(onSuccess, onError);

}



function onRequestSuccess( success)
	{
    console.log("Successfully requested accuracy "+success.message);
	var k=success.message;
	var b=k.split("agreed");
	if (b.length>1)
		{
		// aplikaciis restarti tu motxovna gaxda sachiro da userma ok utxra
		location.reload();
		}
	
    }

function onRequestFailure(error)
	{
    console.log("Accuracy request failed: error code="+error.code+"; error message="+error.message);
	}

function req_loc_acc()
	{
	var accuracy = 3;
	var accuracyName  = "High Accuracy";
	console.log("requesting acc");
	cordova.plugins.locationAccuracy.request(onRequestSuccess, onRequestFailure, cordova.plugins.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY);
	}

function req_loc_auth()
	{
	console.log("requesting auth");
	cordova.plugins.diagnostic.isLocationAuthorized(function (authorized) {
		if(!authorized)
			{

			cordova.plugins.diagnostic.requestLocationAuthorization(function (status) {
				console.log("Requested location authorization: authorization was " + status);
				 
				}, onError, cordova.plugins.diagnostic.locationAuthorizationMode.ALWAYS);
			}
		else
			{
			onError("App is already authorized to use location");
			}
		}, onError);
	}


function open_loc_settings()
	{
	cordova.plugins.diagnostic.switchToLocationSettings();
	}

function successFunction()
{
    console.info("immersive worked!");
}

function errorFunction(error)
{
    console.error(error);
}

function trace(value)
{
    console.log(value);
}
