var GeoLocation = function($listener){
    
    
    if(google.loader.ClientLocation){
	d(google.loader.ClientLocation.latitude);
    //google.loader.ClientLocation.longitude;
	
    }else if(navigator.geolocation) {
	navigator.geolocation.getCurrentPosition(function($position){
	    d($position);
	},function(){
	    d('error');
	},{
	    timeout:1000
	});
    }
}