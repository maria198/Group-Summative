
$(()=>{
 	
 	// Navigation
 	

 	
 	// Map
 	var center = {lat: -45.031449, lng: 168.661904};
 	var map = L.map('map').setView(center, 17);

 	L.tileLayer('https://api.mapbox.com/styles/v1/mary-trepakova/cjkna5n1g221w2tmt0g2tsz5o/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoibWFyeS10cmVwYWtvdmEiLCJhIjoiY2pra2V6cHRzMDEzbDNqczc5NjF0aWptbiJ9.f52j7_rFo6_WhBh3aD3QKw').addTo(map);

 	$('.dropdown-item').each(function(){
 		$(this).on('click',function(){
 			$('.selestplace-selected').css('display','block')
 								.find('h3').html($(this).text());
 		});
 		

 	});
});
// Mapping list of Auckland suburbs using auckland-suburbs.js data
let suburbs = _(data.features).map(function(suburb){
	return {
		suburbId: suburb.properties.OBJECTID,
		name: suburb.properties.BOARD
	}
});
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
$('section#loading-page.section.section-0').delay(4800).fadeOut(1000);



