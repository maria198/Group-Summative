// Map
const version = '?v=20170901';
const clientid = '&client_id=DX131ZQSFRPLAGRPEQZJCFFUJQN0N0JZMD04A24GAIWFUPYI';
const clientSecret = '&client_secret=IVX1Q1PKRFQZXPK2UYWXOHPXVBNYP4SJ1TS4XOIZR15LODFN';
const key = version + clientid + clientSecret;

var lat, lng;

$(()=>{
 	
 	let center = [-36.8446152873055,174.76662397384644];
 	let map = L.map('map',{zoomControl:true,scrollWheelZoom:false}).setView(center, 17);

 	L.tileLayer('https://api.mapbox.com/styles/v1/mary-trepakova/cjkna5n1g221w2tmt0g2tsz5o/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoibWFyeS10cmVwYWtvdmEiLCJhIjoiY2pra2V6cHRzMDEzbDNqczc5NjF0aWptbiJ9.f52j7_rFo6_WhBh3aD3QKw').addTo(map);
 	
 	$('.section-3').hide();
 	$('.section-4').hide();

 	let locateMe = $('.dropdown-item').on('click', function(){

 		lat = $(this).data('lat');
 		lng = $(this).data('lng');

 		map.setView(new L.LatLng(lat, lng), 17);

 		let location = $(this)[0].innerText;
 		console.log(location);
 		$('.location-title h3, .dropdown-toggle').text(location);
 	});

 	$('.explore').on('click', function(){
 		$('.section-3').slideToggle();
 	});

 	
 	$('.choices').on('click', function(){
 		
 		let choice = $(this).data('choice');
 		let choiceName = $(this)[0].innerText;

 		$('.location-choice h3').text(choiceName);
 		$('.section-3').hide();
 		$('.section-4').slideToggle();

 		let exploreUrl = 'https://api.foursquare.com/v2/venues/explore'+key+'&ll='+lat+','+lng+'&section='+choice;

 		console.log(exploreUrl);

 	});
 	$('.back-btn').on('click', function(){
 		$('.section-3').toggle();
 		$('.section-4').hide();

	});
	
 	
});


