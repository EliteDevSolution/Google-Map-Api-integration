let geocoder = new google.maps.Geocoder();
let latlngbounds = new google.maps.LatLngBounds();
let pinColor;

const WORLD_BOUNDS = {
	north: 85,
	south: -85,
	west: -169.9999999998,
	east: -169.9999999999
};
let mapOptions = {
	zoom: 1,
	mapTypeId: google.maps.MapTypeId.HYBRID,
	panControl: true,
	draggable: true,
	zoomControlOptions: {
		style: google.maps.ZoomControlStyle.SMALL,
		position: google.maps.ControlPosition.RIGHT_BOTTOM
	},
	mapTypeControl:false,
	scaleControl:true,
	restriction: {
		latLngBounds: WORLD_BOUNDS,
		strictBounds: true
	}
};

let map = new google.maps.Map(document.getElementById("content"), mapOptions);

$(document).ready(function(){
	createmap();
});
function createmap(){
	
	const sidebarCollapse = document.createElement("div");
	SidebarCollapse(sidebarCollapse);	   		
	map.controls[google.maps.ControlPosition.TOP_LEFT].push(sidebarCollapse);
	
	const print_png = document.createElement("div");
	Print_png(print_png);	   		
	map.controls[google.maps.ControlPosition.RIGHT_TOP].push(print_png);

	const markeradd = document.createElement("div");
	Markeradd(markeradd);	   		
	map.controls[google.maps.ControlPosition.RIGHT_TOP].push(markeradd);
	
	$.ajax({
		url: 'meters_component_getdata.php',
		type: 'GET',
		dataType: 'JSON',
		success: function(respon){
			var location_s = JSON.stringify(respon, null, 2);
			let location_p = JSON.parse(location_s);
			$("#cop_name").html(location_p[0].cop_name);
			$("#cop_address").html(location_p[0].cop_country + " " + location_p[0].cop_county + " " + location_p[0].cop_state + " " + location_p[0].cop_zip);
			geocoder.geocode({  
				componentRestrictions: {  
					country: location_p[0].cop_country,  
					postalCode: location_p[0].cop_zip 
				}  
			}, function(results, status) {  
				if (status === google.maps.GeocoderStatus.OK) {  
					var lat = results[0].geometry.location.lat();
					var lon = results[0].geometry.location.lng();

					map.panTo(results[0].geometry.location);

					show_data(lat,lon,map);
					selectlistdata();
				} else {  
					console.log("error");  
				}  
			});  
		},error: function() {
            console.log("error");
        }
	});

}
function show_data(f_lat, f_lon, map){

	$.ajax({
		url: 'meters_showmarkerdata.php',
		type: 'GET',
		dataType: 'JSON',
		success: function(response){
			let marker_arr = JSON.stringify(response, null, 2);
			let markers= JSON.parse(marker_arr);
			
			for (var i = 0; i < markers.length; i++) {

				var v_data = markers[i];
				
				if(v_data.lat == "" || v_data.lon == ""){
					v_data.lat = f_lat;
					v_data.lon = f_lon;
				}

				var myLatlon = new google.maps.LatLng(v_data.lat, v_data.lon);
				var t_title = "Name : " + v_data.name + "\n" + "Number : " + v_data.number  + "\n" + "Amps : " + v_data.amps  + "\n" + "Voltage : " + v_data.voltage  + "\n" + "Notes : " + v_data.notes;

	
				if(markers[i].pvr_demandChargesApply == "1"){
					pinColor = "red";
				}else{
					pinColor = "green";
				}
				
				var pinSVGFilled = "M 12,2 C 8.1340068,2 5,5.1340068 5,9 c 0,5.25 7,13 7,13 0,0 7,-7.75 7,-13 0,-3.8659932 -3.134007,-7 -7,-7 z";
				var labelOriginFilled =  new google.maps.Point(12,9);
			
				var markerImage = { 
					path: pinSVGFilled,
					anchor: new google.maps.Point(12,17),
					fillOpacity: 1,
					fillColor: pinColor,
					strokeWeight: 2,
					strokeColor: "yellow",
					scale: 2,
					labelOrigin: labelOriginFilled
				};

				var marker = new google.maps.Marker({
					map: map,
					position: myLatlon,
					title: t_title,
					icon: markerImage,
					draggable: true,
					label: {
						text: ''+v_data.id+'',
						color: 'yellow',
						fontSize: '12px'
					},
					animation: google.maps.Animation.DROP
				});
				
				(function (marker, v_data) {
					google.maps.event.addListener(marker, "click", function (e) {	
						// map.panTo(marker.getPosition());
					}); 
					google.maps.event.addListener(marker, "dblclick", function (e) {	
						infoWindow_event(marker, v_data.pvb_id);
					}); 
					google.maps.event.addListener(marker, "dragend", function (e) {
						var lat, lon;
						geocoder.geocode({ 'latLng': marker.getPosition() }, function (results, status) {
							if(results[0] === undefined){
								return;
							}
							if (status == google.maps.GeocoderStatus.OK) {
								lat = marker.getPosition().lat();
								lon = marker.getPosition().lng();
								savepositiondata(v_data.pvb_id, lat, lon);
							}
						});
					});
					
				})(marker, v_data);
				latlngbounds.extend(marker.position);
				map.fitBounds(latlngbounds);
			}
			
		},error: function() {
			console.log("error");
		}
	});

}

function Markeradd(controlDiv) {

	const controlUI = document.createElement("div");
	controlUI.style.backgroundColor = "#fff";
	controlUI.style.boxShadow = "0 2px 6px rgba(0,0,0,.3)";
	controlUI.style.cursor = "pointer";
	controlUI.style.marginRight = "10px";
	controlUI.style.marginTop = "10px";
	controlUI.style.borderRadius = "30%";
	controlUI.style.textAlign = "center";
	controlUI.title = "Add Marker";
	controlDiv.appendChild(controlUI);
	// Set CSS for the control interior.
	const controlText = document.createElement("div");
	controlText.style.color = "rgb(25,25,25)";
	controlText.style.fontFamily = "Roboto,Arial,sans-serif";
	controlText.style.fontSize = "16px";
	controlText.style.padding = "5px";
	controlText.innerHTML = '<a style="margin: auto"><img src="https://cdn1.iconfinder.com/data/icons/pin-map-flat/32/navigation_map_direction_marker_location_position_travel-01-512.png" height="30px" width="30px"</a>';
	controlUI.appendChild(controlText);
	// Setup the click event listeners: simply set the map to Chicago.
	// Setup the click event listeners: simply set the map to Chicago.
	controlUI.addEventListener("click", () => {
		add_marker();
	});

}
function SidebarCollapse(controlDiv) {

	// Set CSS for the control border.
	const controlUI = document.createElement("div");
	controlUI.style.backgroundColor = "#fff";
	controlUI.style.boxShadow = "0 2px 6px rgba(0,0,0,.3)";
	controlUI.style.cursor = "pointer";
	controlUI.style.marginLeft = "25px";
	controlUI.style.marginTop = "10px";
	controlUI.style.textAlign = "center";
	controlUI.title = "SidebarCollapse";
	controlDiv.appendChild(controlUI);
	// Set CSS for the control interior.
	const controlText = document.createElement("div");
	controlText.style.color = "rgb(25,25,25)";
	controlText.style.fontFamily = "Roboto,Arial,sans-serif";
	controlText.style.fontSize = "16px";
	controlText.style.padding = "5px";
	controlText.innerHTML = '<div style="margin: auto"><img src="https://cdn3.iconfinder.com/data/icons/netflix-6/64/07_Menu_home_front_smartphone_user_interface-512.png" height="30px" width="30px"></div>';
	controlUI.appendChild(controlText);
	// Setup the click event listeners: simply set the map to Chicago.
	controlUI.addEventListener("click", () => {
		if(document.getElementById("sidebar").className == ""){
		   document.getElementById("sidebar").className = "active";
		}else{
		   document.getElementById("sidebar").className = "";
		}
	});

}
function Print_png(controlDiv) {

	// Set CSS for the control border.
	const controlUI = document.createElement("div");
	controlUI.style.backgroundColor = "#fff";
	controlUI.style.boxShadow = "0 2px 6px rgba(0,0,0,.3)";
	controlUI.style.cursor = "pointer";
	controlUI.style.marginRight = "10px";
	controlUI.style.textAlign = "center";
	controlUI.style.borderRadius = "30%";
	controlUI.title = "Print_png";
	controlDiv.appendChild(controlUI);
	// Set CSS for the control interior.
	const controlText = document.createElement("div");
	controlText.style.color = "rgb(25,25,25)";
	controlText.style.fontFamily = "Roboto,Arial,sans-serif";
	controlText.style.fontSize = "16px";
	controlText.style.padding = "5px";
	controlText.innerHTML = '<a style="margin: auto"><img src="https://cdn3.iconfinder.com/data/icons/user-interface-filled-line-7/32/40_Screenshot-512.png" height="30px" width="30px"</a>';
	controlUI.appendChild(controlText);
	// Setup the click event listeners: simply set the map to Chicago.
	controlUI.addEventListener("click", () => {
		html2canvas($('#root'), {
            useCORS: true,
                onrendered: function (canvas) {
					var today = new Date();
					var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();		
					var time = today.getHours() + "-" + today.getMinutes() + "-" + today.getSeconds();
					var filename = date + "_" + time + ".png";
					var imgURL= canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
					var imgLink = document.getElementById('canvasimg');
					imgLink.download = filename;
					imgLink.href = imgURL;
					document.body.appendChild(imgLink);
					imgLink.click();
			}
		});
	});

}

function savepositiondata(id, lat, lon){

	$.post("meters_savepositiondata.php",
	{
		id: id,
		lat: lat,
		lon: lon
	},
	function(respon){
	});

}

function selectlistdata(){

	var txtsearch = $("#searchdata").val();
	$.ajax({
		url: 'meters_selectlistdata.php',
		type: 'GET',
		dataType: 'JSON',
		data: {txtsearch : txtsearch},
		success: function(response){
			var response_s = JSON.stringify(response, null, 2);
			let list_results = JSON.parse(response_s);
			var listdata = "";
			for (var i = 0; i < list_results.length; i++) {

				var list_result = list_results[i];
				listdata += '<div class="showlist" onclick="markerposcenter('+list_result.lat+','+list_result.lon+')" style="overflow: unset !important">'+
							'<span class="size1">'+list_result.number+'</span><br>'+  
							'<span class="size1">Name : </span><span class="size2">'+list_result.name+'</span><br>'+
							'<span class="size1">Amps : </span><span class="size2">'+list_result.amps+'</span><br>'+  
							'<span class="size1">Voltage : </span><span class="size2">'+list_result.voltage+'</span><br>'+ 
							'<span class="size1">Phase : </span><span class="size2">'+list_result.phase+'</span><br>'+  
							'<span class="size1">Notes : </span><span class="size2">'+list_result.notes+'</span><br>'+  
							'<span class="size1">APN : </span><span class="size2">'+list_result.apn+'</span></div>';
			}
			$("#showdata").html(listdata);
			
		},error: function() {
			console.log("error");
		}
	});

}
function markerposcenter(lat, lon){
	var myLatlon = new google.maps.LatLng(lat, lon);
	map.panTo(myLatlon);
}
function add_marker(){

	var pos = JSON.stringify(map.getCenter(), null, 2);
	const obj = JSON.parse(pos);

	$.post("meters_newmarker.php",
	{
		lat: obj.lat,
		lon: obj.lng
	},
	function(respon_id){

		var show_id = respon_id.split("||")[0];
		var pvb_id = respon_id.split("||")[1];
		
		var myLatlon = new google.maps.LatLng(obj.lat, obj.lng);
		var t_title = "Marker"+"\n"+"Marker";

		var marker = new google.maps.Marker({
			map: map,
			position: myLatlon,
			title: t_title,
			draggable: true,
			label: {
				text: ''+show_id+'',
				color: 'yellow',
				fontSize: '12px'
			},
			animation: google.maps.Animation.DROP
		});
		(function (marker) {
			google.maps.event.addListener(marker, "click", function (e) {	
				// map.panTo(marker.getPosition());
			}); 
			google.maps.event.addListener(marker, "dblclick", function (e) {	
				infoWindow_event(marker, pvb_id);
				map.panTo(marker.getPosition());	
				
			}); 
			google.maps.event.addListener(marker, "dragend", function (e) {
				var lat, lon;
				geocoder.geocode({ 'latLng': marker.getPosition() }, function (results, status) {
					if(results[0] === undefined){
						return;
					}
					if (status == google.maps.GeocoderStatus.OK) {
						lat = marker.getPosition().lat();
						lon = marker.getPosition().lng();
						savepositiondata(pvb_id, lat, lon);
					}
				});
			});
			
		})(marker);
	});

}
function infoWindow_event(marker,id){
	
	$.ajax({
		url: 'meters_getmarkerdata.php',
		type: 'GET',
		dataType: 'JSON',
		data: {id : id},
		success: function(response){	

			var infoWindow_datas = JSON.stringify(response, null, 2);
			var infoWindow_data_s = JSON.parse(infoWindow_datas);
			
			var modal = new tingle.modal({
				footer: true,
				stickyFooter: false,
				closeMethods: ['overlay', 'button', 'escape'],
				closeLabel: "",
				cssClass: ['custom-class-1', 'custom-class-2'],
				onOpen: function() {
				},
				onClose: function() {
					$(".container-fluid").empty();
					selectlistdata();
				},	
				beforeClose: function() {
					return true;
				}
			});
			
			modal.setContent('<div class="container-fluid">'+
			'<h4 style="text-align: center; color:white;">U P D A T E</h4><hr style="background-color:white"><br>'+
			'<div class="row">'+
				'<div class="col-sm-3 myupdateform"><span class="input-group-text" style="background-color: transparent; color:white; border: none">Name</span></div>'+
				'<div class="col-sm-9 myupdateform"><input type="text" class="form-control" style="width: 100%" id="meterdescription" value=""></div>'+
			'</div><br>'+
			'<div class="row">'+
				'<div class="col-sm-3 myupdateform"><span class="input-group-text" style="background-color: transparent; color:white;; border: none">Number</span></div>'+
				'<div class="col-sm-9 myupdateform"><input type="text" class="form-control" style="width: 100%" id="meternumber" value=""></div>'+
			'</div><br>'+
			'<div class="row">'+
				'<div class="col-sm-3 myupdateform"><span class="input-group-text" style="background-color: transparent; color:white;; border: none">Amps</span></div>'+
				'<div class="col-sm-9 myupdateform"><input type="text" class="form-control" style="width: 100%" id="panelboxamps" value=""></div>'+
			'</div><br>'+
			'<div class="row">'+
				'<div class="col-sm-3 myupdateform"><span class="input-group-text" style="background-color: transparent; color:white;; border: none">Voltage</span></div>'+
				'<div class="col-sm-9 myupdateform"><input type="text" class="form-control" style="width: 100%" id="voltage" value=""></div>'+
			'</div><br>'+
			'<div class="row">'+
				'<div class="col-sm-3 myupdateform"><span class="input-group-text" style="background-color: transparent; color:white;; border: none">Phase</span></div>'+
				'<div class="col-sm-9 myupdateform"><input type="text" class="form-control" style="width: 100%" id="phase" value=""></div>'+
			'</div><br>'+
			'<div class="row">'+
				'<div class="col-sm-3 myupdateform"><span class="input-group-text" style="background-color: transparent; color:white;; border: none">Notes</span></div>'+
				'<div class="col-sm-9 myupdateform"><textarea type="text" class="form-control" style="width: 100%; min-height: 15vh;max-height: 20vh;" id="interconnectnotes" value=""></textarea></div>'+
			'</div><br>'+
			'</div>');
			
			$("#meterdescription").val(infoWindow_data_s[0].name);
			$("#meternumber").val(infoWindow_data_s[0].number);
			$("#panelboxamps").val(infoWindow_data_s[0].amps);
			$("#voltage").val(infoWindow_data_s[0].voltage);
			$("#phase").val(infoWindow_data_s[0].phase);
			$("#interconnectnotes").val(infoWindow_data_s[0].notes);

			modal.addFooterBtn('S A V E', 'tingle-btn tingle-btn--danger tingle-btn--pull-right', function() {
				$.post("meters_savecontentdata.php",
				{
					id					: id,
					meterdescription	: $("#meterdescription").val(),
					meternumber			: $("#meternumber").val(),
					panelboxamps		: $("#panelboxamps").val(),
					voltage				: $("#voltage").val(),
					phase				: $("#phase").val(),
					interconnectnotes	: $("#interconnectnotes").val()
				},
				function(respon){
					modal.close();
					$(".container-fluid").empty();					
				});
				
			});

			modal.addFooterBtn('DELETE	', 'tingle-btn tingle-btn--primary tingle-btn--pull-left', function() {
				marker.setMap(null);
				$.post("meters_deletedata.php",
				{
					id: id
				},
				function(respon){
					modal.close();
					$(".container-fluid").empty();
				});
			});
			map.panTo(marker.getPosition());	
			modal.open();
			
		},error: function() {
			console.log("error");
		}
	});

}

(function($) {

	"use strict";
	var fullHeight = function() {

			$('.js-fullheight').css('height', $(window).height());
			$(window).resize(function(){
				$('.js-fullheight').css('height', $(window).height());
			});

		};
		fullHeight();

		$('#sidebarCollapse').on('click', function () {
		$('#sidebar').toggleClass('active');
	});

})(jQuery);