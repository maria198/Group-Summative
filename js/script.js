// Map
const version = '?v=20170901';
const clientid = '&client_id=DX131ZQSFRPLAGRPEQZJCFFUJQN0N0JZMD04A24GAIWFUPYI';
const clientSecret = '&client_secret=IVX1Q1PKRFQZXPK2UYWXOHPXVBNYP4SJ1TS4XOIZR15LODFN';
const key = version + clientid + clientSecret;
const ATkey = '2f0c1b52e45a4d16bd76190029149cf1';
let directionsService;
let lat, lng;
let markersLayer;

$(()=>{
 	
 	let center = [-36.8446152873055,174.76662397384644];
 	let map = L.map('map',{zoomControl:true,scrollWheelZoom:false}).setView(center, 15);

 	L.tileLayer('https://api.mapbox.com/styles/v1/mary-trepakova/cjkna5n1g221w2tmt0g2tsz5o/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoibWFyeS10cmVwYWtvdmEiLCJhIjoiY2pra2V6cHRzMDEzbDNqczc5NjF0aWptbiJ9.f52j7_rFo6_WhBh3aD3QKw').addTo(map);
 	
 	markersLayer = L.layerGroup().addTo(map);

 	let directionsLayerGroup = L.layerGroup().addTo(map);

 	$('.section-0').nextAll().hide();

	setTimeout(function(){ 
		$('.section-0').hide();
		$('.section-0').next().show(); 
	}, 3500);

 	let locateMe = $('.dropdown-item').on('click', function(){

 		lat = $(this).data('lat');
 		lng = $(this).data('lng');

 		map.setView(new L.LatLng(lat, lng), 15);

 		let location = $(this)[0].innerText;
 		console.log(location);
 		$('.location-title h3, .dropdown-toggle').text(location);
 	});

 	$('.explore').on('click', function(){
 		$('.section-0').hide();
 		$(this).closest('section').next().slideDown();
	 	$(this).closest('section').hide();
 		
 	});


 	$('.choices').on('click', function(){
 		
 		let choice = $(this).data('choice');
 		let choiceName = $(this)[0].innerText;

 		$('.location-choice h3').text(choiceName);
 		$(this).closest('section').next().slideDown();
	 	$(this).closest('section').hide();


	 	if(choice == 'busstop'){

	 		let busUrl = 'https://api.at.govt.nz/v2/gtfs/stops/geosearch?lat='+lat+'&lng='+lng+'&distance=500';

	 		$.ajax({
	 			url:busUrl,
	 			beforeSend: function(xhrObj){
	                // Request headers
	                xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key",ATkey);
	            },
	            success:function(res){
	            	
	            	markersLayer.clearLayers();
	            	let busdata = res.response;

	               	_(busdata).each(function(stop){

	               		let stopIcon = L.icon({
	               			iconUrl:'assets/icons/bus.svg',
	               			iconSize:[40,40]
	               		});
	               		let latlng = {
	               			lat:stop.stop_lat,
	               			lng:stop.stop_lon
	               		};

	               		let busStopMarker = L.marker(latlng,{icon:stopIcon}).addTo(markersLayer);
	               		busStopMarker.data = stop;

	               		
						busStopMarker.on('click', function(){
		
							let busStopData = this.data;
							$('.modal-title').text(busStopData.stop_name);
							let code = busStopData.stop_code;
							
							$('.modal-body').empty();
							$('<p>Stop Code: '+code+'</p>').appendTo('.modal-body');
							$('#venueModal').modal('show');


						});

	               	});
	            }

	 		});

	 	}else{

			let exploreUrl = 'https://api.foursquare.com/v2/venues/explore'+key+'&ll='+lat+','+lng+'&section='+choice;

	 		$.ajax({
				url:exploreUrl,
				dataType:'jsonp', 
				success:function(res){
					markersLayer.clearLayers();
					let data = res.response.groups["0"].items;

					console.log(data);

					let venues = _(data).map(function(item){
						return {
							latlng:{lat:item.venue.location.lat,lng:item.venue.location.lng},
							name:item.venue.name,
							venueid:item.venue.id
						};
					});

					console.log(venues);

					_(venues).each(function(venue){
						let venueIcon = L.icon({
							iconUrl:'assets/icons/marker.svg',
							iconSize:[50,50]
						});

						let marker = L.marker(venue.latlng,{icon:venueIcon}).addTo(markersLayer);
						marker.venueid = venue.venueid;

						
						
						console.log(marker);

						marker.on('click',function(){
							let venueUrl = 'https://api.foursquare.com/v2/venues/'+this.venueid+key;

							$.ajax({
								url:venueUrl,
								dataType:'jsonp',
								success:function(res){
									let venue = res.response.venue;

									$('.modal-title').text(venue.name);
									let photo = venue.bestPhoto;
									let source = photo.prefix+'100x100'+photo.suffix;
									let contact = venue.contact.phone;
									let address = venue.location.address;
									// let hours = venue.hours;
									let url = venue.url;
									$('.modal-body').empty();
									$('<img src="'+source+'">').appendTo('.modal-body');

									if(contact){
										$('<p><a href="tel:'+contact+'">Phone: '+contact+'</a></p>').appendTo('.modal-body');
									}
									$('<p>Address: '+address+'</p>').appendTo('.modal-body');

									// if(hours){
									// 	$('<p>Hours: '+hours+'</p>').appendTo('.modal-body');
									// }
									
									if(url){
										$('<a href='+url+'>Website</a>').appendTo('.modal-body');
									}
									$('<div><a class="get-directions" data-lat="'+venue.lat+'" data-lng="'+venue.lng+'">Get Directions</a></div>').appendTo('.modal-body');
									$('#venueModal').modal('show');

								}
							});

							$('#map').on('click','.get-directions',function(e){
								e.preventDefault();


								if (navigator.geolocation) {

									navigator.geolocation.getCurrentPosition(position=>{
										let myLocation = {
											lat:position.coords.latitude,
											lng:position.coords.longitude
										};

										//create a request for directions

										let destinationLatLng = {
											lat: $(this).data('lat'),
											lng: $(this).data('lng'),
										};
										let request = {
									          origin: myLocation,
									          destination: destinationLatLng,
									          travelMode: 'WALKING'
									        };
										//ask directionsService to fulfill your request
										directionsService.route(request,function(response,status){

											directionsLayerGroup.clearLayers();

											let path = response.routes["0"].overview_path;

											let polyline = _(path).map(function(item){
												return {lat:item.lat(),lng:item.lng()};
											});

											L.polyline(polyline,{
												color:$color1,
												weight:3
											}).addTo(directionsLayerGroup);
											
										});
									});
								}
							});

						});
					
					});
				}

	 		});
	 	}
 		

		
	});

 	$('.back-btn').on('click', function(){
 		$(this).closest('section').prev().slideDown();
	 	$(this).closest('section').hide();

	});

 	
});

//googlemaps directions
function initMap(){
	directionsService = new google.maps.DirectionsService;
	
}
