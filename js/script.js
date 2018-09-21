const version = '?v=20170901';
const clientid = '&client_id=FJ1LAHN55PLM4LC1IZYPNJ3IGKZFURLHEWLE3J4JNEKF4WPN';
const clientSecret = '&client_secret=PXXLXUDC1R2U02UDCC5M0YWVLNIPXS2N3M1OXWYUHUOQC22Q';
const key = version + clientid + clientSecret;

let latCurrent = [];
let lngCurrent = [];

let choiceCurrent = [];

let venueCurrent = [];

// Loading page animation
// Effect of loading 
var loading = anime({
	targets: '#loading-anime .small-circle',
	opacity: function(el, i, l) { let d = 0.25; return 1 - d*i; },
	// translateX: [0,0],
	easing: [.17,.89,.8,.91],
	loop: 10,
	duration: 800,
	delay: function(el, i, l) { return i * 300; }
});

// Map & Page changing animation
$(()=>{

	var defaultLocation = {lat: -36.86667, lng: 174.76667}

	var map = L.map('map',{zoomControl:true,scrollWheelZoom:false}).setView(defaultLocation, 13);
	L.tileLayer('https://api.mapbox.com/styles/v1/mary-trepakova/cjkna5n1g221w2tmt0g2tsz5o/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoibWFyeS10cmVwYWtvdmEiLCJhIjoiY2pra2V6cHRzMDEzbDNqczc5NjF0aWptbiJ9.f52j7_rFo6_WhBh3aD3QKw').addTo(map);

	// Starts off by hiding all except the loading page
	$('.section-0').nextAll().hide();

	// Loads next page after 3 seconds
	setTimeout(function(){ 
		$('.section-0').hide();
		$('.section-0').next().show(); 
	}, 2000);

	// Select location to reposition map
 	var locateMe = $('.dropdown-item').on('click', function(){

 		var lat = $(this).data('lat');
 		var lng = $(this).data('lng');

		latCurrent = lat;
		lngCurrent = lng;

		map.setView(new L.LatLng(latCurrent, lngCurrent), 13);

	    $('.location-title h3, .dropdown-toggle').text($(this)[0].innerText);

	    // After I pick a location, I click and it moves to the next page
 		$('.explore').on('click',function(){
	 		$(this).closest('section').next().slideDown();
	 		$(this).closest('section').hide();
		});

 		

	});

	// Select choice to go to after selecting map location
 	$('.choices').on('click',function(){

	 		var choice = $(this).data('choice');
			choiceCurrent = choice;
	 		$('.location-choice h3').text($(this)[0].innerText);

	 		$(this).closest('section').next().slideDown();
	 		$(this).closest('section').hide();

	 		// console.log(choiceCurrent);
			// let urlProjects = 'https://api.foursquare.com/v2/venues/explore'+key+'&ll='+latCurrent+','+lngCurrent+'&section='+this.choiceCurrent;
			let urlProjects = 'https://api.foursquare.com/v2/venues/search'+key+'&ll='+latCurrent+','+lngCurrent+'&categoryId='+choiceCurrent+'&radius=3000';
			// console.log(urlProjects);

			$.ajax({
				url: urlProjects,
				dataType: 'jsonp',
				success: function(res){
					// console.log(res);
					var data = res.response.venues;
					// console.log(data);
					var venues = _(data).map(function(item){
						// console.log(item);
						return {
							venueid:item.id,
							name:item.name,
							address: item.location.address,
							latlng: {lat:item.location.lat,lng:item.location.lng},
							genre:item.name
						}
					});
					venueCurrent = venues;
					// console.log(venueCurrent);
					// Add markers for the venue points


					_(venueCurrent).each(function(venue){
						// console.log(venue);
						let venueIcon = L.icon({
							iconUrl: 'assets/cafe.svg',
							iconSize:[10,10],
						});


						let marker = L.marker(venue.latlng,{icon:venueIcon}).addTo(map);



						marker.venueid = venue.venueid;
						marker.on('click',function(){
							// console.log(this.venueid);
							var venueUrl = 'https://api.foursquare.com/v2/venues/'+this.venueid+key;
							// var venueHours = 'https://api.foursquare.com/v2/venues/'+this.venueid+'/hours'+key;

							// console.log(venueUrl);
							// console.log(venueHours);
							$.ajax({
								url:venueUrl,
								dataType:'jsonp',
								success:function(res){
									var venue = res.response.venue;
									console.log(venue);

									var photos = venue.bestPhoto;
									var source = photos.prefix+'150x150'+photos.suffix;

									$('.img-here, .choice-info').empty();

									$('<img src="'+source+'">').appendTo('.img-here');

									let bioHTML = $('#templateChoices').text();
									let bioTemplate = Template7(bioHTML).compile();
									var bioOutput = bioTemplate(venue);
									console.log(venue);
									$('.choice-info').append(bioOutput);

									$('#venue-modal').modal('show');
								}
							});

							// $.ajax({
							// 	url:venueHours,
							// 	dataType:'jsonp',
							// 	success:function(res){
							// 		var hours = res.response.hours.timeframes[0];
							// 		console.log(hours);
							// 	}
							// });

						});


					 	// Clicking on back btn & logo will remove markers
					 	$('.section .back-btn, .logo').on('click',function(){

					 		map.removeLayer(marker);

					 	});

					});
				},

			});

	 	});
 	// Clicking on logo returns the user to the choose location page
 	$('.logo').on('click',function(){
 		$('.section-2').slideDown();
 		$(this).closest('section').hide();

 	});

 	// Clicking on back btn returns user to previous section
 	$('.section .back-btn').on('click',function(){

 		$(this).closest('section').prev().slideDown();
 		$(this).closest('section').hide();

 	});

});
