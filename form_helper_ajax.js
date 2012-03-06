

// FORM helper
(function( $ ){  
    $.fn.ajaxSubmit = function( options ) {
	var options = $.extend({}, $.fn.ajaxSubmit.defaults, options);
	var postData={}
	var form=$(this);
	$(this).find(':input').each(function(){
	    if($(this).attr('name')){
		$val = $(this).attr('type')=='checkbox'? ($(this).is(':checked') ? '1' : '0') : $(this).val();
		// data exists so it's an array
		if(postData[$(this).attr('name')]){
		    array=postData[$(this).attr('name')];
		    // is array ?
		    if(!(array && array.constructor == Array)){
			postData[$(this).attr('name')]=[]
		    }
		    postData[$(this).attr('name')].push($val);
		}
		else
		    postData[$(this).attr('name')]=$val;
	    }
	});
	$.ajax({
	    url: form.attr('action'),
	    
	    type: 'POST',
	    data: postData,
	    success: function($data){
		options.success.call(this,$data);
	    }
	});
    };
    // DEFAULT VALUES
    $.fn.ajaxSubmit.defaults = {
	success:null,
	error:null
    };
})(jQuery);