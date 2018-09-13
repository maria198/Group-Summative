const version = '?v=20170901';
const clientid = '&client_id=FJ1LAHN55PLM4LC1IZYPNJ3IGKZFURLHEWLE3J4JNEKF4WPN';
const clientSecret = '&client_secret=PXXLXUDC1R2U02UDCC5M0YWVLNIPXS2N3M1OXWYUHUOQC22Q';
const key = version + clientid + clientSecret;


var latCurrent = [];
var lngCurrent = [];
var choiceCurrent = [];

let choicesList = [];

// Loading page animation
// Effect of loading 
var loading = anime({
	targets: '#loading-anime .small-circle',
	opacity: function(el, i, l) { let d = 0.25; return 1 - d*i; },
	// translateX: [0,0],
	easing: [.17,.89,.8,.91],
	loop: 3,
	duration: 1500,
	delay: function(el, i, l) { return i * 400; }
});

// Map & Page changing animation
$(()=>{

	var defaultLocation = {lat: -36.86667, lng: 174.76667}

	var map = L.map('map',{zoomControl:true,scrollWheelZoom:false}).setView(defaultLocation, 13);
	L.tileLayer('https://api.mapbox.com/styles/v1/mary-trepakova/cjkna5n1g221w2tmt0g2tsz5o/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoibWFyeS10cmVwYWtvdmEiLCJhIjoiY2pra2V6cHRzMDEzbDNqczc5NjF0aWptbiJ9.f52j7_rFo6_WhBh3aD3QKw').addTo(map);

	$('.section-0').nextAll().hide();

 	var defaultToDropDown = $('.section-0').on('click',function(){
 		$(this).hide();
 		$(this).next().toggle();
 	});


 	var locateMe = $('.dropdown-item').on('click', function(){

 		var lat = $(this).data('lat');
 		var lng = $(this).data('lng');

		map.setView(new L.LatLng(lat, lng), 13);

	    $('.location-title h3, .dropdown-toggle').text($(this)[0].innerText);
	    latCurrent.push(lat);
	    lngCurrent.push(lng);

	});
 	
 	if (('#dropdownMenu2').innerHTML !== 'Locations') {
 		$('.explore').on('click',function(){
	 		
	 		$(this).closest('section').next().slideDown();
	 		$(this).closest('section').hide();
		});
 	}

 	var chooseChoice = $('.choices').on('click',function(){
 		var choice = $(this).data('choice');
		choiceCurrent.push(choice);

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
					return {
						venueid:item.venue.id,
						name:item.venue.name,
						address: item.venue.location.address,
						latlng: {lat:item.venue.location.lat,lng:item.venue.location.lng},
						genre:item.venue.categories["0"].name
					}
				});
				choiceList.clear();
				choicesList.push(venues);
				console.log(choicesList[0]);
			}
		});
 	});

 	$('.logo').on('click',function(){
 		$('.section-2').slideDown();
 		$(this).closest('section').hide();
 	});
 	$('.section .back-btn').on('click',function(){

 		$(this).closest('section').prev().slideDown();
 		$(this).closest('section').hide();

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
