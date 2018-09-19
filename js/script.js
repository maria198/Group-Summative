
// Loading page animation
// Effect of loading 
var loading = anime({
	targets: '#loading-anime .small-circle',
	opacity: function(el, i, l) { let d = 0.25; return 1 - d*i; },
	translateX: [150,0],
	easing: [.91,-0.54,.29,1.56],
	loop: 3,
	duration: 1500,
	delay: function(el, i, l) { return i * 200; }
});
// Hides the loading page
$('section#loading-page').delay(4800).fadeOut(1000);

// Mapping list of Auckland suburbs using auckland-suburbs.js data
let suburbs = _(data.features).map(function(suburb){
	return {
		suburbId: suburb.properties.OBJECTID-1,
		name: suburb.properties.BOARD,
		geometry: _(suburb.geometry.coordinates[0]).map(function(point){
			return {lat:point[1],lng:point[0]}
		})
	}
});
console.log(data.features);
console.log(suburbs);
// Creates drop-down list with Auckland suburbs
let dropDown = new Vue({
	el:".selectplace-wrapper",
	data: {
		suburbs: []
	},
	methods:{
		loadSuburbs: function(){
			this.suburbs = suburbs;
		}
	},
	mounted: function(){
		this.loadSuburbs();
	}
});


//FourSquare Client Id,key
const version = '?v=20170901';
const clientid = '&client_id=FP1I4WJSN14C1CP41SACQI3F1KSH4I0IJDO1IYKCKZBDKZIO';
const clientSecret = '&client_secret=CJHT5MHLZSEAU2NXKOT1IVTQJAGG1TH1C11VAPK5DFIYPRVC';
const key = version + clientid + clientSecret;

// Data: foursquare id,icons for categories
var categories = [
	{
		categoryKeyword: 'food',
		categoryId: '4d4b7105d754a06374d81259',
		iconUrl: 'assets/markers/icon-food.svg'
	},
	{
		categoryKeyword: 'park&tree',
		categoryId: '52e81612bcbc57f1066b7a28,56aa371be4b08b9a8d57355e,52e81612bcbc57f1066b7a22,52e81612bcbc57f1066b7a23,4bf58dd8d48988d15a941735,4bf58dd8d48988d163941735,52e81612bcbc57f1066b7a24',
		iconUrl: 'assets/markers/icon-park.svg'
	},
	{
		categoryKeyword: 'arts&entertainment',
		categoryId: '4bf58dd8d48988d1e2931735,5032792091d4c4b30a586d5c,4deefb944765f83613cdba6e,4bf58dd8d48988d17f941735,4bf58dd8d48988d181941735',
		iconUrl: 'assets/markers/icon-art.svg'
	},
	{
		categoryKeyword: 'accomondation',
		categoryId: '4bf58dd8d48988d1fa931735',
		iconUrl: 'assets/markers/icon-accomodation.svg'
	},
	{
		categoryKeyword: 'buses',
		categoryId: '52f2ab2ebcbc57f1066b8b4f',
		iconUrl: 'assets/markers/icon-bus.svg'
	},
	{
		categoryKeyword: 'popular',
		categoryId: '4d4b7105d754a06374d81259',
		iconUrl: 'assets/markers/icon-popular.svg'
	}
];
// JQuery
$(()=>{

	//Drop-down list, select suburb
	var suburbSelected = '';
	var suburbSelectedId = 0;
	var oSuburb;

	$('.dropdown-item-mobile').each(function(){
 		$(this).on('click',function(){
 			suburbSelected = $(this).text();
 			$('#dropdown-header-mobile').html(suburbSelected);
 			suburbSelectedId = $(this).data('suburbid');

 			oSuburb = suburbs[suburbSelectedId];
 			console.log(oSuburb);
 		});
 	});
 	

 	// Map-mobile
 	var center = {lat: -45.031449, lng: 168.661904};
 	var map = L.map('map').setView(center, 17);
 	L.tileLayer('https://api.mapbox.com/styles/v1/mary-trepakova/cjkna5n1g221w2tmt0g2tsz5o/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoibWFyeS10cmVwYWtvdmEiLCJhIjoiY2pra2V6cHRzMDEzbDNqczc5NjF0aWptbiJ9.f52j7_rFo6_WhBh3aD3QKw').addTo(map);
 	var layerGroup = L.layerGroup().addTo(map);
 	var polylineCenter;
 	var radiusFoursquare = 2000;
 	// Navigation
 	// Explore button, from section2 to section3, change header in section3
 	$('#explore').on('click', function(){
 		// Error message
 		if(suburbSelected == ''){
 			$('.selectplace-dropdown h1').addClass('no-border');
 			$('.error-suburb').slideDown();
 		}else{
 			$('.error-suburb').slideUp();
 			$('.selectplace-dropdown h1').delay(300).removeClass('no-border');
 			$('.location-title').find('h1').text(suburbSelected);
	 		$('.current-section').removeClass('current-section');
	 		$('.section-3').addClass('current-section');

	 		layerGroup.clearLayers();
	 		// Draws polyline around chosen suburb
	 		var oSuburbPolygon = L.polygon( oSuburb.geometry, {
				color: '#FE5F55',
				weight: 2,
				fill: false
			});

			layerGroup.addLayer(oSuburbPolygon);
			// Get centre of polyline
			polylineCenter = oSuburbPolygon.getCenter();
			L.circle(polylineCenter, {
						radius: radiusFoursquare,
						color: 'salmon',
						weight:1,
						fill:true
					}).addTo(map);
			console.log(polylineCenter);
			// Position map view 
			map.fitBounds(oSuburbPolygon.getBounds());
 		}
 	});
 	// From section3 to section4 (map)
 	var categoryKeyword='';
 	var categoryId;
 	var categoryIcon;
 	$('.choices').each(function(){
 		$(this).on('click',function(){
 			$('.choices.selected').removeClass('selected');
 			$(this).addClass('selected');
 			$('.location-choice').find('h1').text($(this).text());
 			$('.section-4').addClass('current-section');
 			categoryKeyword = $(this).data('keyword');

 			for (i=0; i<categories.length; i++ ){
 				if (categories[i].categoryKeyword == categoryKeyword){
 					categoryId = categories[i].categoryId;
 					categoryIcon = categories[i].iconUrl;
 				}
 			}
 			console.log(categoryId);
 		});
 	});
 	var markerLayer = L.layerGroup().addTo(map);
 	$('.mobile').on('click','.choices', function(){
 		markerLayer.clearLayers();
 		let urlProjects = 'https://api.foursquare.com/v2/venues/search'+key+'&ll='+polylineCenter.lat+','+polylineCenter.lng+'&radius='+radiusFoursquare+'&limit=50&categoryId='+categoryId;
			$.ajax({
				url: urlProjects,
				dataType: 'jsonp',
				success: function(res){
					var data = res.response.venues;
					var venues = _(data).map(function(venue){
						return {
							venueid:venue.id,
							name:venue.name,
							latlng: {lat:venue.location.lat,lng:venue.location.lng}
						}
					});
					console.log(venues);
					_(venues).each(function(venue){

						let venueIcon = L.icon({
							iconUrl: categoryIcon,
							iconSize: [40,40]
						});
						let marker = L.marker(venue.latlng,{icon: venueIcon});
						markerLayer.addLayer(marker);

						marker.venueId = venue.venueId;

						//modal popup bootstrap
						marker.on('click',function(){
							var venueUrl = 'https://api.foursquare.com/v2/venues/'+this.venueId+key;

							$.ajax({
								url: venueUrl,
								dataType: 'jsonp',
								success: function(res){
									var venue = res.response.venue;
									console.log(venue);

									$('.modal-title').text(venue.name);

									let photo = venue.bestPhoto;
									let photoUrl = photo.prefix+'300x300'+photo.suffix;

									$('.modal-body').empty();
									$('<img src="'+photoUrl+'">').appendTo('.modal-body');
								}
							});
							
							$('#venueModal').modal('show');
						});
					});
				}
			});
 	});
 		
 
 	//Back buttons 
 	$('#back-section2').on('click', function(){
 		$('.current-section').removeClass('current-section');
 		$('.section-2').addClass('current-section');
 		$('.choices.selected').removeClass('selected');
 	});
 	$('#back-section3').on('click', function(){
 		$('.current-section').removeClass('current-section');
 		$('.section-3').addClass('current-section');
 	});
 	
 	
});





