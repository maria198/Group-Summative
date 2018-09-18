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
 	
 	$('.section-0').nextAll().hide();

	setTimeout(function(){ 
		$('.section-0').hide();
		$('.section-0').next().show(); 
	}, 2000);

 	let locateMe = $('.dropdown-item').on('click', function(){

 		lat = $(this).data('lat');
 		lng = $(this).data('lng');

 		map.setView(new L.LatLng(lat, lng), 17);

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

 		let exploreUrl = 'https://api.foursquare.com/v2/venues/explore'+key+'&ll='+lat+','+lng+'&section='+choice;

 		console.log(exploreUrl);

 		$.ajax({
			url:exploreUrl,
			dataType:'jsonp', // json p means browser can ask for data instead of server
			success:function(res){
				var data = res.response.groups["0"].items;//this code after res came from console, right clicking items under group and
				//copy property path
				// var venues = _(data).map(function(item){ // this function is to transform each item into smaller pieces of data. these items/venues have alot of data 
				// 	//in the console. Also called mapping data
				// 	return{
				// 		latlng:{lat:item.venue.location.lat,lng:item.venue.location.lng},
				// 		name:item.venue.name,
				// 		venueid:item.venue.id
				// 	};

				// });
			}

 		});

 		console.log(data);


		console.log(venues);

		_(venues).each(function(venue){
			let venueIcon = L.icon({
				iconUrl:'assets/icons/cafe.svg',
				iconSize:[30,30]
			});
			let marker = L.marker(venue.latlng,{icon:venueIcon}).addTo(map);
			marker.venueid = venue.venueid;
			console.log(marker);

			marker.on('click',function(){
				let venueUrl = 'https://api.foursquare.com/v2/venues/'+this.venueid+key;

				// $.ajax({
				// 	url:venueUrl,
				// 	dataType:'jsonp',
				// 	success:function(res){
				// 		var venue = res.response.venue;

				// 		$('.modal-title').text(venue.name);
				// 		var photo = venue.bestPhoto; //find where to go from dom inspection
				// 		var source = photo.prefix+'100x100'+photo.suffix;
				// 		var contact = venue.contact.phone;
				// 		var address = venue.location.address;
				// 		var category = venue.categories.name;
				// 		$('.modal-body').empty();
				// 		$('<img src="'+source+'">').appendTo('.modal-body');
				// 		$('<p>Phone:'+contact+'</p>').appendTo('.modal-body');
				// 		$('<p>Address:'+address+'</p>').appendTo('.modal-body');
				// 		$('<p>category:'+category+'</p>').appendTo('.modal-body');




				// 		$('#venueModal').modal('show');
				// 	}
				// });

			});
		});
		
	});

 	$('.back-btn').on('click', function(){
 		$(this).closest('section').prev().slideDown();
	 	$(this).closest('section').hide();

	});

 	
});


