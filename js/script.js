// Map

const version = '?v=20170901';
const clientid = '&client_id=FJ1LAHN55PLM4LC1IZYPNJ3IGKZFURLHEWLE3J4JNEKF4WPN';
const clientSecret = '&client_secret=PXXLXUDC1R2U02UDCC5M0YWVLNIPXS2N3M1OXWYUHUOQC22Q';
const key = version + clientid + clientSecret;




$(()=>{

	var potato = {lat: -36.86667, lng: 174.76667}

	var map = L.map('map').setView(potato, 13);
	L.tileLayer('https://api.mapbox.com/styles/v1/mary-trepakova/cjkna5n1g221w2tmt0g2tsz5o/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoibWFyeS10cmVwYWtvdmEiLCJhIjoiY2pra2V6cHRzMDEzbDNqczc5NjF0aWptbiJ9.f52j7_rFo6_WhBh3aD3QKw').addTo(map);

 	var center = $('.dropdown-item').on('click', function(){

		var location = [];
 		var lat = $(this).data('lat');
 		var lng = $(this).data('lng');

 		var latlng = {lat, lng};

		map.setView(new L.LatLng(lat, lng), 13);


	});


});


