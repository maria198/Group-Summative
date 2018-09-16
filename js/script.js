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

 		// Select choice to go to after selecting map location
		$('.choices').on('click',function(){
	 		var choice = $(this).data('choice');
			choiceCurrent = choice;
	 		$('.location-choice h3').text($(this)[0].innerText);

	 		$(this).closest('section').next().slideDown();
	 		$(this).closest('section').hide();

			let urlProjects = 'https://api.foursquare.com/v2/venues/explore'+key+'&ll='+latCurrent+','+lngCurrent+'&section='+this.choiceCurrent;

			$.ajax({
				url: urlProjects,
				dataType: 'jsonp',
				success: function(res){

					var data = res.response.groups[0].items;
					// console.log(data);
					var venues = _(data).map(function(item){
						// console.log(item);
						return {
							venueid:item.venue.id,
							name:item.venue.name,
							address: item.venue.location.address,
							latlng: {lat:item.venue.location.lat,lng:item.venue.location.lng},
							genre:item.venue.categories["0"].name
						}
					});
					venueCurrent = [];
					venueCurrent.length = 0;
					venueCurrent = venues;
					console.log(venueCurrent);
				},

			});

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
 		venues.clear();

 	});

});


		// // Vue
		// let app = new Vue({
		// 	el: '#map',
		// 	data:{
		// 		venues:[],
		// 	},
		// 	methods:{
		// 		loadVenues: function(){

		// 				//ajax request
						
		// 				let urlProjects = 'https://api.foursquare.com/v2/venues/explore'+key+'&ll='+latCurrent+','+lngCurrent+'&section='+this.choiceCurrent;

		// 				$.ajax({
		// 					url: urlProjects,
		// 					dataType: 'jsonp',
		// 					success: function(res){

		// 						var data = res.response.groups[0].items;
		// 						console.log(data);
		// 						var venues = _(data).map(function(item){
		// 							return {
		// 								venueid:item.venue.id,
		// 								name:item.venue.name,
		// 								address: item.venue.location.address,
		// 								latlng: {lat:item.venue.location.lat,lng:item.venue.location.lng},
		// 								genre:item.venue.categories["0"].name
		// 							}
		// 						});
		// 						console.log(venues);
		// 						if(venues.address == 'undefined'){
		// 							prompt('undefined');
		// 						};
		// 						// assign data to venues
		// 						app.venues = venues;
		// 					}
		// 				});
		// 		}
		// 	},
		// 	mounted: function(){
		// 		this.loadVenues();
		// 	}
		// });
