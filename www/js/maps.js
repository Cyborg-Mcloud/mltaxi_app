	var myMap;
var multiRoute, multiRoute2;
var infoWindow, tempMarker, geocoder;
var dirService, dirRender;
var startMarker, endMarker, thirdmarker, carMarker, positionMarker;
var startPosListener, endPosListener, selPosListener;
var START_ICON, END_ICON, THIRD_END_ICON;
var suggestView, suggestView1,suggestView2;
var city_bounds=new Array();

city_bounds[0]=new Array();
city_bounds[1]=new Array();
city_bounds[0][0]=42.291406;
city_bounds[0][1]=42.624550;
city_bounds[1][0]=42.205379;
city_bounds[1][1]=42.745228;

function initMap(ymaps) 
	{
	myMap = new ymaps.Map("gmap", {center: [MyLat, MyLong], zoom: 14, controls: []}, {searchControlProvider: 'yandex#map'});
	var card = document.getElementById('pac-card');
    var input = document.getElementById('pac-input');
    var input2 = document.getElementById('pac-input2');
    var input3 = document.getElementById('pac-input3');
    var strictBounds = document.getElementById('strict-bounds-selector');


	myMap.controls.remove("routeEditor");
	myMap.controls.remove("geolocationControl");
	myMap.controls.remove("searchControl");
	myMap.controls.remove("trafficControl");
	myMap.controls.remove("typeSelector");
	myMap.controls.remove("fullscreenControl");
	myMap.controls.remove("zoomControl");
	myMap.controls.remove("rulerControl");
	myMap.controls.remove("routeEditor");
	
	suggestView = new ymaps.SuggestView(input,{ boundedBy: city_bounds, results: 3});
	suggestView1 = new ymaps.SuggestView(input2,{ boundedBy: city_bounds, results: 3});
	suggestView2 = new ymaps.SuggestView(input3,{ boundedBy: city_bounds, results: 3});



	suggestView.events.add('select', function (e) {
		console.log("suggest: " +e.get('item').value);
		mgeocode(e.get('item').value);
		suggestView.state.set('open', false);
		});
	suggestView1.events.add('select', function (e) {
		console.log("suggest: " +e.get('item').value);
		mgeocode(e.get('item').value);
		suggestView1.state.set('open', false);
		});
	suggestView2.events.add('select', function (e) {
		console.log("suggest: " +e.get('item').value);
		mgeocode(e.get('item').value);
		suggestView2.state.set('open', false);
		});

	myMap.events.add('click', function (e) {console.log("aqedan "+state); geocodeOnClick(e);   });
	myicon = new ymaps.Placemark([42.24, 42.69], {hintContent: 'ჩემიიკონკა', balloonContent: 'ჩემიიკონკა'}, {iconLayout: 'default#image', iconImageHref: 'resources/pin_start.svg', iconImageSize: [30, 30], iconImageOffset: [-15, -15]  });
	
	carMarker = new ymaps.Placemark([0, 0], {hintContent: 'მანქანა', balloonContent: 'მანქანა'}, {iconLayout: 'default#image', iconImageHref: 'resources/logo.svg', iconImageSize: [30, 30], iconImageOffset: [-15, -15]  });
	myMap.geoObjects.add(carMarker);

	positionMarker = new ymaps.Placemark([42.24, 42.69], {hintContent: 'ჯიპიესი', balloonContent: 'ჯიპიესი'}, {iconLayout: 'default#image', iconImageHref: 'resources/logo.svg', iconImageSize: [30, 30], iconImageOffset: [-15, -15]  });
	myMap.geoObjects.add(positionMarker);
	setState(0);
	}
var click_through_block=0;
function mgeocode(addr)
	{
	console.log("mgcode: "+addr);
click_through_block=1;
	var myGeocoder = ymaps.geocode(addr);
	myGeocoder.then(
		function (res) {
			//console.log(res);
			var coords=res.geoObjects.get(0).geometry.getCoordinates();
			console.log(coords);
			var  bounds = res.geoObjects.get(0).properties.get('boundedBy');
			if (state==0)
				{

				console.log("steiti nolia");
				myMap.geoObjects.remove(multiRoute);
				myMap.geoObjects.remove(multiRoute2);
				myMap.geoObjects.remove(startMarker);
				myMap.geoObjects.remove(endMarker);
				myMap.geoObjects.remove(thirdmarker);
				startMarker = new ymaps.Placemark(coords, {hintContent: 'სტარტი', balloonContent: 'სტარტი'}, {iconLayout: 'default#image', iconImageHref: 'resources/pin_start.svg', iconImageSize: [30, 30], iconImageOffset: [-15, -30]  });
				myMap.geoObjects.add(startMarker);
				set_input_value(document.getElementById("pac-input").value,0);
				document.getElementById("pac-input").blur();
				myMap.setBounds(bounds, {checkZoomRange: true });
				suggestView.state.set({open: false,panelClosed: true, items: []});
				close_all();
				click_through_block=0;
				}
	
			else if (state==1)
				{
				console.log("steiti ertia");
				myMap.geoObjects.remove(multiRoute);
				myMap.geoObjects.remove(multiRoute2);
				myMap.geoObjects.remove(endMarker);
				myMap.geoObjects.remove(thirdmarker);

				endMarker = new ymaps.Placemark(coords, {hintContent: 'დასასრული', balloonContent: 'დასასრული'}, {iconLayout: 'default#image', iconImageHref: 'resources/pin_end.svg', iconImageSize: [30, 30], iconImageOffset: [-15, -30]  });
				myMap.geoObjects.add(endMarker);
				end_set=1;
				set_input_value(document.getElementById("pac-input2").value,1);
				document.getElementById("pac-input2").blur();
				calcRoute();
				suggestView1.state.set({open: false,panelClosed: true, items: []});
				close_all();
								click_through_block=0;
				}

			else if (state==2)
				{
				console.log("steiti oria");
				myMap.geoObjects.remove(multiRoute);
				myMap.geoObjects.remove(multiRoute2);
				myMap.geoObjects.remove(thirdmarker);

				thirdmarker = new ymaps.Placemark(coords, {hintContent: 'დასასრული', balloonContent: 'დასასრული'}, {iconLayout: 'default#image', iconImageHref: 'resources/pin_red.svg', iconImageSize: [30, 30], iconImageOffset: [-15, -30]  });
				myMap.geoObjects.add(thirdmarker);
		
				end_set=2;
				console.log("movqache");
			//	geocodeLocation(thirdmarker.getPosition(), infoWindow, 'thirdmarker');
	//			infoWindow.open(map, endMarker);
				set_input_value(document.getElementById("pac-input3").value,2);
				document.getElementById("pac-input3").blur();
				calcRoute();
				suggestView2.state.set({open: false,panelClosed: true, items: []});
				close_all();
				click_through_block=0;
				}
	
			
		},
		function (err) {
			// error handling
		}
	);
	}

function geocodeOnClick(e) 
	{
	console.log("geocodeOnClick: "+mystatus+ " / "+state);
   if (mystatus==0)
		{
		var coords = e.get('coords');
		if (state==0)
			{
			console.log("geocode, state=0, coords="+coords);
			myMap.geoObjects.remove(multiRoute);
			myMap.geoObjects.remove(multiRoute2);
			myMap.geoObjects.remove(startMarker);
			myMap.geoObjects.remove(endMarker);
			myMap.geoObjects.remove(thirdmarker);


			startMarker = new ymaps.Placemark(coords, {hintContent: 'სტარტი', balloonContent: 'სტარტი'}, {iconLayout: 'default#image', iconImageHref: 'resources/pin_start.svg', iconImageSize: [30, 30], iconImageOffset: [-15, 0]  });
			myMap.geoObjects.add(startMarker);

			startMarker.properties.set({
				balloonContent: getAddress(startMarker.geometry.getCoordinates() , 0)
				});
		//	console.log(startMarker.geometry.getCoordinates());
			document.getElementById("pac-input").value=getAddress(startMarker.geometry.getCoordinates(), 0 );
			document.getElementById("pac-input").blur();
			document.getElementById("pac-input2").blur();
			//geocodeLocation(startMarker.getPosition(), infoWindow, 'startMarker');

//			infoWindow.open(map, startMarker);
			setTimeout("close_all();",500);
			click_through_block=0;
			}
		else if (state==1)
			{
			console.log("geocode, state=1, coords="+coords);
			myMap.geoObjects.remove(multiRoute);
			myMap.geoObjects.remove(multiRoute2);
			myMap.geoObjects.remove(endMarker);
			myMap.geoObjects.remove(thirdmarker);


			endMarker = new ymaps.Placemark(coords, {hintContent: 'დასასრული', balloonContent: 'დასასრული'}, {iconLayout: 'default#image', iconImageHref: 'resources/pin_end.svg', iconImageSize: [30, 30], iconImageOffset: [-15, 0]  });
			myMap.geoObjects.add(endMarker);

			end_set=1;
		//	geocodeLocation(endMarker.getPosition(), infoWindow, 'endMarker');
//			infoWindow.open(map, endMarker);
			getAddress(endMarker.geometry.getCoordinates(), 1 );
			document.getElementById("pac-input2").blur();
			document.getElementById("pac-input3").blur();
			calcRoute();
			setTimeout("close_all();",500);
			click_through_block=0;
			}    
		else if (state==2)
			{
			console.log("geocode, state=2, coords="+coords);
			myMap.geoObjects.remove(multiRoute);
			myMap.geoObjects.remove(multiRoute2);
			myMap.geoObjects.remove(thirdmarker);

			thirdmarker = new ymaps.Placemark(coords, {hintContent: 'დასასრული', balloonContent: 'დასასრული'}, {iconLayout: 'default#image', iconImageHref: 'resources/pin_red.svg', iconImageSize: [30, 30], iconImageOffset: [-15, 0]  });
			myMap.geoObjects.add(thirdmarker);
	
			end_set=2;
		//	geocodeLocation(thirdmarker.getPosition(), infoWindow, 'thirdmarker');
//			infoWindow.open(map, endMarker);
			getAddress(thirdmarker.geometry.getCoordinates(), 2 );
			document.getElementById("pac-input3").blur();
			calcRoute();
			setTimeout("close_all();",500);
			click_through_block=0;
			}  
		}
	}

function set_input_value(value, curfield)
	{

	value=value.replace("край Имеретия, Кутаиси, ","");
	value=value.replace("край Имеретия","");
	value=value.replace("Кутаиси","");

	value=value.replace("kray Imeretiya, Kutaisi, ","");
	value=value.replace("kray Imeretiya, ","");

	value=value.replace("kray Imeretiya","");

	value=value.replace("Kutaisi, ","");
	value=value.replace("Kutaisi","");

	value=value.replace("Georgia, ","");
	value=value.replace("Georgia","");
console.log("value: "+value);
	value=value.replace("საქართველო, იმერეთი, ქუთაისი, ","");
	value=value.replace("იმერეთი,","");
	value=value.replace("კუთაისი,","");
	value=value.replace("საქართველო,","");




	if (curfield==0)
		{
		document.getElementById("pac-input").value=value;
		}
	else if (curfield==1)
		{
		document.getElementById("pac-input2").value=value;
		}
	else if (curfield==2)
		{
		document.getElementById("pac-input3").value=value;
		}

	}

 function getAddress(coords,curfield) 
	 {
     
     ymaps.geocode(coords).then(function (res) 
		 {
		 console.log(res);
            var firstGeoObject = res.geoObjects.get(0);
			console.log("movida");
			console.log(firstGeoObject);
			console.log(firstGeoObject.getAddressLine());
          
			set_input_value(firstGeoObject.getAddressLine(), curfield);


		 return firstGeoObject.getAddressLine();
        });
    }

var state = 0;
const SWITCH_TEXTS = ['დასაწყისის არჩევა', 'დანიშნულების არჩევა', 'თავიდან არჩევა'];

function setState(newState)
	{
	if (click_through_block==0)
		{
		
		console.log("set state: "+newState);
		state = newState;
		if (state==0)
			{
			end_set=0;
			document.getElementById("pac-input2").value="";
			document.getElementById("pac-input3").value="";
			suggestView.state.set('open', true);
			}
		else if (state==1)
			{
			document.getElementById("add_third").style.display="block";
			suggestView1.state.set('open', true);
			}
		else if (state==2)
			{
		//	calcRoute();
			suggestView2.state.set('open', true);
			}
		else if (state==3)
			{
		//	calcRoute();
			}
		}
	click_through_block=0;
	}


function getPosition(loc) {
    return {
        lat: loc.lat(),
        lng: loc.lng()
    }
}

var appr_price=0;


function daamrgvale(tanxa)
	{
	
	var mteli=parseInt(tanxa);
	var t=tanxa-mteli;
	if (t>0)
		{
		if (t<=0.1  )
			{
			tanxa=mteli;
			}
		else if (t>0.5 && t<=0.6)
			{
			tanxa=mteli+0.5;
			}
		else if (t>0.6)
			{
			tanxa=mteli+1;
			}
		else
			{
			tanxa=mteli+0.5;
			}
		}
	return tanxa;
	}

function calcRoute() 
	{
	var start = startMarker.geometry;
	var end = endMarker.geometry;

	if (document.getElementById("pac-input3").value!="" || end_set==2)
		{
		console.log("long route calc");
		var mtlad_end=thirdmarker.geometry;
		console.log(mtlad_end);
		myMap.geoObjects.remove(multiRoute);
		myMap.geoObjects.remove(multiRoute2);
		
		multiRoute2 = new ymaps.multiRouter.MultiRoute({
		referencePoints: [ start, end , mtlad_end], params: {results: 2} }, {boundsAutoApply: true, wayPointVisible: false});
		myMap.geoObjects.add(multiRoute2); //
	
		multiRoute2.model.events.add("requestsuccess", function (event) {

			console.log("mroute2: "+multiRoute2.getRoutes().get(0).properties.get('distance').value);
			totalDistance=multiRoute2.getRoutes().get(0).properties.get('distance').value;

			appr_price=sit_price[call_class]+(totalDistance/1000-1)*kmprice[call_class];
			appr_price=daamrgvale(appr_price);

			console.log("distance: "+totalDistance+", appr_price: "+appr_price);
			document.getElementById("dirinfo").innerHTML='<p style="font-size: 20px">'+parseInt(totalDistance/1000)+'კმ / '+appr_price+'₾</p>';
			document.getElementById("dirinfo_parent").style.display="block";
			});

		}
	else
		{
		console.log("short route calc");
		myMap.geoObjects.remove(multiRoute);
		myMap.geoObjects.remove(multiRoute2);
		multiRoute = new ymaps.multiRouter.MultiRoute({
		referencePoints: [ start, end], params: {results: 2} }, {boundsAutoApply: true, wayPointVisible: false});
		myMap.geoObjects.add(multiRoute);
		multiRoute.model.events.add("requestsuccess", function (event) {

			console.log("mroute: "+multiRoute.getRoutes().get(0).properties.get('distance').value);
			totalDistance=multiRoute.getRoutes().get(0).properties.get('distance').value;

			appr_price=sit_price[call_class]+(totalDistance/1000-1)*kmprice[call_class];
			appr_price=daamrgvale(appr_price);

			console.log("distance: "+totalDistance+", appr_price: "+appr_price);
			document.getElementById("dirinfo").innerHTML='<p style="font-size: 20px">'+parseInt(totalDistance/1000)+'კმ / '+appr_price+'₾</p>';
			document.getElementById("dirinfo_parent").style.display="block";
			});
		}
	}


