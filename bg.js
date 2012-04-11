function bg($src,$width,$height){
    
    $('body').first().prepend(
	$('<img src="'+$src+'"/>')
	    .addClass('bg')
	    .css({
		'position':'absolute',
		'top':0,
		'height':$height,
		'width':'100%',
		'z-index':-10
	    })
    );
    
}