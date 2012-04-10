(function( $ ){
    var ClassPlaceHolder = function($domTarget,$options){
	var $_options = $.extend({}, {
	    
	}, $options);
	
	var $_E = {
	    'target': $($domTarget)
	}
	
	var $_this = this;
	
	$_this.targetClickHandler = function(){
	    if($_E.target.val() == $_E.target.attr('place_holder')){
		$_E.target
		    .val('')
		    .removeClass('placeholder');
	    }else if($_E.target.val() == ''){
		$_E.target
		    .val($_E.target.attr('place_holder'))
		    .removeClass('placeholder');
	    }
	}
	
	$_this.targetParentFormSubmitHandler = function(){
	    $(this).find('.placeholder').each(function(){
		if($(this).val() == $(this).attr('place_holder')){
		    $(this).val('')
		}
	    });
	}
	
	// !CONSTRUCTOR
	$_E.target
	    .addClass('placeholder')
	    .bind('click',$_this.targetClickHandler)
	    .bind('submit',$_this.targetSubmitHandler)
	    
	if(!$_E.target.val())
	    $_E.target.val($_E.target.attr('place_holder'))
	
	$_E.target.closest('form').bind('submit',$_this.targetParentFormSubmitHandler);
    };
   
    $.fn.place_holder = function( $options ) {
	return this.each(function() {
	    if(!$(this).data('ClassPlaceHolder'))
		$(this).data('ClassPlaceHolder',new ClassPlaceHolder(this,$options));
	});
    };
    $(document).ready(function(){
	$('.placeholder').place_holder();
    });
})( jQuery);