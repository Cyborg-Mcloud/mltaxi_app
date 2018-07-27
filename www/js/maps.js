	var myMap;
var infoWindow, tempMarker, geocoder;
var dirService, dirRender;
var startMarker, endMarker, thirdmarker, carMarker, positionMarker;
var startPosListener, endPosListener, selPosListener;
var START_ICON, END_ICON, THIRD_END_ICON;

var city_bounds=new Array();

city_bounds[0]=new Array();
city_bounds[1]=new Array();
city_bounds[0][0]=42.291406;
city_bounds[0][1]=42.624550;
city_bounds[1][0]=42.205379;
city_bounds[1][1]=42.745228;

function initMap(ymaps) 
	{
	myMap = new ymaps.Map("gmap", {center: [MyLat, MyLong], zoom: 14}, {searchControlProvider: 'yandex#search'});
	var card = document.getElementById('pac-card');
    var input = document.getElementById('pac-input');
    var input2 = document.getElementById('pac-input2');
    var input3 = document.getElementById('pac-input3');
    var strictBounds = document.getElementById('strict-bounds-selector');

	
	var suggestView = new ymaps.SuggestView(input,{ boundedBy: city_bounds, results: 7});
	var suggestView1 = new ymaps.SuggestView(input2,{ boundedBy:city_bounds, results: 7});
	var suggestView2 = new ymaps.SuggestView(input3,{ boundedBy: city_bounds, results: 7});

	suggestView.events.add('select', function (e) {
		console.log(e.get('item').value);
		mgeocode(e.get('item').value);
		});
	suggestView1.events.add('select', function (e) {
		console.log(e.get('item').value);
		mgeocode(e.get('item').value);
		});
	suggestView2.events.add('select', function (e) {
		console.log(e.get('item').value);
		mgeocode(e.get('item').value);
		});

	myMap.events.add('click', function (e) {console.log("aqedan "+state); geocodeOnClick(e);   });
	myicon = new ymaps.Placemark([42.24, 42.69], {hintContent: 'ჩემიიკონკა', balloonContent: 'ჩემიიკონკა'}, {iconLayout: 'default#image', iconImageHref: 'resources/pin_start.svg', iconImageSize: [30, 30], iconImageOffset: [-15, 0]  });
	
	carMarker = new ymaps.Placemark([0, 0], {hintContent: 'მანქანა', balloonContent: 'მანქანა'}, {iconLayout: 'default#image', iconImageHref: 'resources/logo.svg', iconImageSize: [30, 30], iconImageOffset: [-15, 0]  });
	myMap.geoObjects.add(carMarker);

	positionMarker = new ymaps.Placemark([42.24, 42.69], {hintContent: 'ჯიპიესი', balloonContent: 'ჯიპიესი'}, {iconLayout: 'default#image', iconImageHref: 'resources/Clustericon.svg', iconImageSize: [30, 30], iconImageOffset: [-15, 0]  });
	myMap.geoObjects.add(positionMarker);
	setState(0);
	}

function mgeocode(addr)
	{
	console.log(myMap.getBounds());
//{ boundedBy: myMap.getBounds(), strictBounds: true, results: 1}
	var myGeocoder = ymaps.geocode(addr);
	myGeocoder.then(
		function (res) {
			var coords=res.geoObjects.get(0).geometry.getCoordinates();
			var  bounds = res.geoObjects.get(0).properties.get('boundedBy');
			if (state==0)
				{
				myMap.geoObjects.remove(multiRoute);
				myMap.geoObjects.remove(multiRoute2);
				myMap.geoObjects.remove(startMarker);
				myMap.geoObjects.remove(endMarker);
				myMap.geoObjects.remove(thirdmarker);
				startMarker = new ymaps.Placemark(coords, {hintContent: 'სტარტი', balloonContent: 'სტარტი'}, {iconLayout: 'default#image', iconImageHref: 'resources/pin_start.svg', iconImageSize: [30, 30], iconImageOffset: [-15, 0]  });
				myMap.geoObjects.add(startMarker);
				set_input_value(document.getElementById("pac-input").value,0);
				document.getElementById("pac-input").blur();
				myMap.setBounds(bounds, {checkZoomRange: true });
				}
	
			else if (state==1)
				{
				myMap.geoObjects.remove(multiRoute);
				myMap.geoObjects.remove(multiRoute2);
				myMap.geoObjects.remove(endMarker);
				myMap.geoObjects.remove(thirdmarker);

				endMarker = new ymaps.Placemark(coords, {hintContent: 'დასასრული', balloonContent: 'დასასრული'}, {iconLayout: 'default#image', iconImageHref: 'resources/pin_end.svg', iconImageSize: [30, 30], iconImageOffset: [-15, 0]  });
				myMap.geoObjects.add(endMarker);
				end_set=1;
					set_input_value(document.getElementById("pac-input2").value,1);
				document.getElementById("pac-input2").blur();
				calcRoute();
				}

			else if (state==2)
				{
				myMap.geoObjects.remove(multiRoute);
				myMap.geoObjects.remove(multiRoute2);
				myMap.geoObjects.remove(thirdmarker);

				thirdmarker = new ymaps.Placemark(coords, {hintContent: 'დასასრული', balloonContent: 'დასასრული'}, {iconLayout: 'default#image', iconImageHref: 'resources/pin_red.svg', iconImageSize: [30, 30], iconImageOffset: [-15, 0]  });
				myMap.geoObjects.add(thirdmarker);
		
				end_set=2;
			//	geocodeLocation(thirdmarker.getPosition(), infoWindow, 'thirdmarker');
	//			infoWindow.open(map, endMarker);
	set_input_value(document.getElementById("pac-input3").value,2);
				document.getElementById("pac-input3").blur();
				calcRoute();
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
			console.log(startMarker.geometry.getCoordinates());
			document.getElementById("pac-input").value=getAddress(startMarker.geometry.getCoordinates(), 0 );
			//geocodeLocation(startMarker.getPosition(), infoWindow, 'startMarker');
			document.getElementById("pac-input").blur();
//			infoWindow.open(map, startMarker);
			}
		else if (state==1)
			{

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
			calcRoute();
			}    
		else if (state==2)
			{
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
	console.log("set state: "+newState);
    state = newState;
	if (state==0)
		{
		end_set=0;
		document.getElementById("pac-input2").value="";
		document.getElementById("pac-input3").value="";
		}
	else if (state==1)
		{

		}
	else if (state==2)
		{
		calcRoute();
		}
	else if (state==3)
		{
		calcRoute();
		}
	}


function switchState() 
	{
	console.log("switch state: "+state);
    if (state === 1 && (startMarker.getPosition() === undefined || endMarker.getPosition() === undefined)) 
		{
        setState(0);
        return;
		}
    setState((state + 1) % 3);

	}

function chooseLocation(curstate) 
	{
	if (curstate==0)
		{

		}
	}

function getPosition(loc) {
    return {
        lat: loc.lat(),
        lng: loc.lng()
    }
}

var appr_price=0;

function calcRoute() 
	{
	var start = startMarker.geometry;

	var end = endMarker.geometry;

	if (document.getElementById("pac-input3").value!="" || end_set==2)
		{

		var mtlad_end=thirdmarker.geometry;
		console.log(mtlad_end);
		myMap.geoObjects.remove(multiRoute);
		myMap.geoObjects.remove(multiRoute2);
		multiRoute2 = new ymaps.multiRouter.MultiRoute({
		referencePoints: [ start, end, mtlad_end ], params: {results: 2} }, {boundsAutoApply: true});
		myMap.geoObjects.add(multiRoute2);
	
		multiRoute2.model.events.add("requestsuccess", function (event) {

			console.log("mroute2: "+multiRoute2.getRoutes().get(0).properties.get('distance').value);
			totalDistance=multiRoute2.getRoutes().get(0).properties.get('distance').value;

			appr_price=parseInt(sit_price[call_class]+(totalDistance/1000)*kmprice[call_class]);
			console.log("distance: "+totalDistance+", appr_price: "+appr_price);
			});

		}
	else
		{
		myMap.geoObjects.remove(multiRoute);
		myMap.geoObjects.remove(multiRoute2);
		multiRoute = new ymaps.multiRouter.MultiRoute({
		referencePoints: [ start, end], params: {results: 2} }, {boundsAutoApply: true});
		myMap.geoObjects.add(multiRoute);
		multiRoute.model.events.add("requestsuccess", function (event) {

			console.log("mroute: "+multiRoute.getRoutes().get(0).properties.get('distance').value);
			totalDistance=multiRoute.getRoutes().get(0).properties.get('distance').value;

			appr_price=parseInt(sit_price[call_class]+(totalDistance/1000)*kmprice[call_class]);
			console.log("distance: "+totalDistance+", appr_price: "+appr_price);
			});
		}
	}


