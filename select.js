(function( $ ){
    var ClassAjaxChoiceList = function($domTarget,$defaultAndOptions){
	
	var $_E = {
	    
	};
	
	var $_options = $.extend({}, {
	    
	}, $defaultAndOptions);
	var $_this = this;
	
	
	
	
    };
    
    $.fn.ajax_choice_list = function( $options ) {
	return this.each(function() {
	    if(!$(this).data('ajax_choice_list')){
		$(this).data('ajax_choice_list',new ClassSelectTagApplyCss(this,$options));
	    }
	});
    };
})( jQuery);