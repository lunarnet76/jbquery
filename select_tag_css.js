(function( $ ){
    var ClassSelectTagApplyCss = function($domTarget,$defaultAndOptions){
	// !ATTRIBUTES
	var $_E = {
	    'target':$($domTarget),
	    'drop_down':$('<ul></ul>'),
	    'selector':$('<div></div>'),
	    'label':$('<div></div>'),
	    'input': $('<input type="hidden">')
	};
	
	var $_options = $defaultAndOptions;
	var $_this = this;
	
	// !METHODS
	$_this.toggleDropDown = function($event){
	    //if($event.target.nodeName.toLowerCase() != 'div')return;
	    if($_E.drop_down.is(':visible'))
		$_E.drop_down.hide();
	    else{
	    $('ul.select_css').hide();
		$_E.drop_down.show();
		if($_options.show)
		    $_options.show($_this)
		
		
	    }
	    $event.preventDefault();
	    return false;
	}
	
	$_this.getElement = function($name){
	    return $_E[$name];
	}
	
	$_this.closeDropDown = function(){
	    $_E.drop_down.hide();
	}
	
	$_this.selectOption = function($event){
	    $_E.input.val($(this).attr('id').substr(7));
	    $_E.label.html($(this).html());
	    $_E.drop_down.hide();
	    $_E.target.val($(this).attr('id').substr(7));
	    $_E.target.trigger('change');
	    $event.preventDefault();
	    return false;
	}
	
	$_this.update = function(){
	    // add options to the drop_down
	     $_E.drop_down.empty();
	    $_E.target.children().each(function(){
		$_E.drop_down
		    .append(
			$('<li id="option-'+$(this).val()+'">'+$(this).html()+'</li>')
			.bind('click',$_this.selectOption)
		    )
		// default value
		if($_E.target.val() == $(this).val())
		    $_E.label.html($(this).html());
	    });
	    
	}
	
	// !CONSTRUCTOR
	// add the elements
	$_E.target
	    .after(
		$_E.selector
		    .append(
			$_E.label
		    )
		    .append(
			$_E.drop_down
			    .after(
				$_E.input
			    )
		    )
	    )
	// target handles triggers
	$_E.target.bind('click',$_this.toggleDropDown)
	
	// selector
	$_E.selector
	    .addClass($_options.cssClass)  
	    .bind('click',$_this.toggleDropDown)

	// drop down
	$_E.drop_down
	    .addClass($_options.cssClass)  
	    .css({
		position: 'absolute'
	    })
	    .hide()
	    
	// label
	$_E.label
	    .text('select')
	    .bind('click',$_this.toggleDropDown)
	    
	    
	// hidden input
	$_E.input
	    .attr('name',$_E.target.attr('name'))
	    
	$_E.drop_down
	    .attr('id',$_E.target.attr('id'))
	    
	if($_E.target.val())
	    $_E.input.val($_E.target.val())
	
	
	// hide the input, but do not use hide method so we can still use events
	$_E.target
	    .attr('name','')
	    .css({
		position: 'absolute',
		visibility: 'hidden'
	    })
	    
	// register the drop down
	select_tag_css_DropDown_list.push($_E.drop_down.get(0));
	select_tag_css_DropDown_list.push($_E.selector.get(0));
	
	// add option
	$_this.update();
    };
    
    $.fn.select_tag_css = function( $options ) {
	return this.each(function() {
	    if(!$(this).data('select_tag_css')){
		$(this).data('select_tag_css',new ClassSelectTagApplyCss(this,$.extend({}, $.fn.select_tag_css.defaults, $options)));
	    }
	});
    };
    // DEFAULTS
    $.fn.select_tag_css.defaults = {
	'cssClass': 'select_css',
	show: null// function call when show drop down
    };
})( jQuery);


var select_tag_css_DropDown_list = [];

// close when clicked somewhere else
setTimeout(function() {
    $('body').bind('click', function(e) {  
	// close all the select if the click is not on a drop down or a select
	if($.inArray(e.target,select_tag_css_DropDown_list) == -1){
	    $('ul.select_css').hide();
	}
    });
}, 200);