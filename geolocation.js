var GeoLocation = function($listener){
    
    
    if(navigator.geolocation) {
	navigator.geolocation.getCurrentPosition(function($position){
	    
	},function(){
	    console.log('error');
	},{
	    timeout:1000
	});
    }
}