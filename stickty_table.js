(function ($) {
    $.stickyTh = function (el,options) {
	
	
	
	// Cache DOM refs for performance reasons
	var base = this;
	var $el = $(el);
	base.$window = $(window);
	base.$windowHeight = base.$window.height();
	base.$headerHeight = $el.find('thead').height();
	
	if($el.hasClass('clone'))
	    $el.remove();
	
	// copy the whole table
	var $cloneTable = $(el).clone();
	$cloneTable.addClass('clone stickyTh')
	$('body').append($cloneTable);
	$cloneTable.find('tbody,tfoot').css({'visibility':'hidden'});
	$cloneTable.css({position: 'fixed',top:'0px',left: $(el).offset().left,'margin-top':'0px'});
	$cloneTable.hide();
	
	
	
	base.scrolling = function(){
		var offset = $el.offset();
		var scrollTop = base.$window.scrollTop();
		var scrollLeft = base.$window.scrollLeft();
		var tableTop = offset.top;
		var tableBottom = offset.top +$el.height() - base.$headerHeight;
		
		// table is visible, but the top is not
		if(tableTop<scrollTop && tableBottom>scrollTop){
		    $cloneTable.show();
		    $cloneTable.css({left:  $(el).offset().left-scrollLeft })
		}else{
		    $cloneTable.hide();
		}
	    
	};
	
	$(window).scroll(base.scrolling);

    };
    $.fn.stickyTh = function (options) {
        return this.each(function () {
            (new $.stickyTh(this, options));
        });
    };
})(jQuery);

(function ($) {
    $.stickyTd = function (el,options) {
	
	// Cache DOM refs for performance reasons
	var base = this;
	var $el = $(el);
	base.$window = $(window);
	base.$windowHeight = base.$window.height();
	base.$headerHeight = $el.find('thead').height();
	base.$firstTdOffsetLeft = $(el).find('tbody td').first().offset().left;
	base.$maxOffsetLeft = $(el).offset().left+$(el).width();
	
	
	// copy the whole table
	var $cloneTable = $(el).clone();
	$cloneTable.addClass('clone stickyTd')
	$('body').append($cloneTable);
	$cloneTable.find('tbody,tfoot,thead').css({'visibility':'hidden'});
	$cloneTable.css({position: 'absolute',left: '0px',top: $el.offset().top - options.offsetTopModificator});// 
	$cloneTable.hide();
	
	
	
	base.scrolling = function(){
		var scrollLeft = base.$window.scrollLeft();
		
		// table is visible, but the top is not
		if(scrollLeft>=base.$firstTdOffsetLeft && scrollLeft<=base.$maxOffsetLeft){
		    $cloneTable.show();
		    $cloneTable.css({top: $el.offset().top - options.offsetTopModificator});
		    $cloneTable.css({left: scrollLeft});
		    $cloneTable.find('tr').each(function(){
			$(this).find('td:first').css({visibility:'visible'})
		    });
		}else{
		    $cloneTable.hide();
		}
	    
	};
	
	$(window).scroll(base.scrolling);
    };
    $.fn.stickyTd = function (options) {
        return this.each(function () {
            (new $.stickyTd(this, options));
        });
    };
    function isScrolledIntoView(elem)
    {
	var docViewTop = $(window).scrollTop();
	var docViewBottom = docViewTop + $(window).height();

	var elemTop = $(elem).offset().top;
	var elemBottom = elemTop + $(elem).height();

	return ((elemBottom <= docViewBottom) && (elemTop >= docViewTop));
    }
})(jQuery);