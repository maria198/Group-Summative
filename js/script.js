
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

	 		var oSuburbPolyline = L.polyline( oSuburb.geometry, {
				color: '#FE5F55',
				weight: 2
			});
			layerGroup.addLayer(oSuburbPolyline);
			map.fitBounds(oSuburbPolyline.getBounds());
 		}
 	});
 	// From section3 to section4 (map)
 	$('.choices').each(function(){
 		$(this).on('click',function(){
 			$('.choices.selected').removeClass('selected');
 			$(this).addClass('selected');
 			$('.location-choice').find('h1').text($(this).text());
 			$('.section-4').addClass('current-section');
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
 	
 	// Map-desktop
 	// var center = {lat: -45.031449, lng: 168.661904};
 	// var mapDesktop = L.map('map-desktop').setView(center, 17);

 	// L.tileLayer('https://api.mapbox.com/styles/v1/mary-trepakova/cjkna5n1g221w2tmt0g2tsz5o/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoibWFyeS10cmVwYWtvdmEiLCJhIjoiY2pra2V6cHRzMDEzbDNqczc5NjF0aWptbiJ9.f52j7_rFo6_WhBh3aD3QKw').addTo(mapDesktop);

});





