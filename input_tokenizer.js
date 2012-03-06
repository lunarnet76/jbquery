/* hacked for tags + scrollbar */
(function( $ ){
    var ClassInputTokenizer = function($domTarget,$defaultAndOptions){
	var $_E = {
	    'container':$('<div class="mi_container"></div>'),
	    'input':$($domTarget),
	    'ul':$('<ul/>'),
	    'dropDown':$('<div class="mi_dropDown"></div>'),
	    'dropDownCloser':$('<div class="mi_dropDownCloser">x</div>'),
	    'dropDownUl':$('<ul/>'),
	    'hidden':$('<input type="hidden"/>')
	};
	var $_options = $defaultAndOptions;
	var $_this = this;
	var $_timeOut=null;
	var $_values=[];
	var $_dropDownUlIndex=0;
	var $_dropDownClose=true;
	var $_scrollbar=null;
	var $_data=[];
	var $_ajaxInProgress=false;
	
	var $_scrollbarOptions = {
	    callback: function(){
		if($_data.length<3){
		    this.forbidScroll();
		    this.getElement('target').css('height',($_data.length*50)+'px');
		    this.getElement('scrollbar').hide();
		}else{
		    this.authorizeScroll();
		    this.getElement('target').css('height','182px');
		    this.getElement('scrollbar').show();
		}
	    }
	}
        
	// PRIVATE METHOD
	// listen the key pressed on the input
	$_this.eventListenerInputKeyUp=function($event){
	    $code= ($event.keyCode ? $event.keyCode : $event.which);
	    if($code==13 || $code==40 || $code==38){// enter, up, down
		$event.preventDefault();
		return;
	    }
	    $searchTerm=$_E.input.val();
	    clearTimeout($_timeOut);
	    $_timeOut = setTimeout(function(){
		$_this.search($searchTerm);
	    }, $_options.keyPressDelayBeforeSearch);
	    $event.preventDefault();
	}
	// avoid form send when pressing enter, select tag in drop down
	$_this.eventListenerInputKey=function($event){
	    $code= ($event.keyCode ? $event.keyCode : $event.which);
	    switch($code){
		case 13: // enter
		    if(!$_dropDownClose){
			// select tag
			$_this.selectTag($_E.dropDownUl.children('li').get($_dropDownUlIndex));
		    }
		    $event.preventDefault();
		    break;
		case 40:// down
		    $_this.gotoTagInDropDown('next','next');
		    $event.preventDefault();
		    break;
		case 38:// up
		    $_this.gotoTagInDropDown('previous','previous');
		    $event.preventDefault();
		    break;
	    }
	}
	// searching
	$_this.search=function($searchTerm){
	    if($_ajaxInProgress != false){
		$_ajaxInProgress.abort();
	    }
	    $_ajaxInProgress=new $.ajax({
		url:$_options.ajaxSearchUrl+$searchTerm,
		success:function($data){
		    $_this.displayDropDown($.parseJSON($data));
		    $_ajaxInProgress=false
		},
		error:function(){
		    $_ajaxInProgress=false
		}
	    });
	}
	// displaying the drop down menu
	$_this.displayDropDown=function($data){
	    $_data = $data;
	    $_dropDownClose=false;
	    // show the menu
	    $_E.dropDown.css('left',$_E.input.offset().left+"px");
	    $_E.dropDown.css('top',$_E.input.offset().top+"px");
	    $_E.dropDown.show();
	    if($_options.closingButton)$_E.dropDownCloser.show();
	    // position it just beside the element
	    // empty it
	    $_E.dropDownUl.empty();
	    // fill it with new elements
	    for($i in $data){
		$li=$('<li>'+$data[$i].name+'</li>');
		if(!$data[$i].id){
		    $li.addClass('create');
		}
		$li.attr('id',$data[$i].id?$data[$i].id:$data[$i].name);
		$_E.dropDownUl.append($li);
		$li.bind('click',$_this.eventListenerDropDownTagClick);
		$li.bind('mouseover',function(){
		    $_this.gotoTagInDropDown($(this));
		});
	    }
	    if($_options.closingButton)$_E.dropDownCloser.css('left',$_E.dropDown.width()+"px");
	    if($_options.scrollbar) {
		$_E.input.bind('mousewheel',function(event){
		    $_scrollbar.scroll(event);
		});
		$_E.dropDown.scrollbar($_scrollbarOptions);
		$_scrollbar = $_E.dropDown.data('scrollbar');
		if($_scrollbar)
		    $_scrollbar.moveCursorTo(0);
		$_E.dropDownUl=$_E.dropDown.find('ul');
		
		$_E.dropDownUl.find('li').bind('click',$_this.eventListenerDropDownTagClick);
		$_E.dropDownUl.find('li').bind('mouseover',function(){
		    $_this.gotoTagInDropDown($(this));
		});
	    }
	    
	    // focus first element
	    $_this.gotoTagInDropDown('first');
	}
	//
	$_this.gotoTagInDropDown=function($which,$key){
	    $_E.dropDownUl.children('li').removeClass('hover');
	    switch($which){
		case 'first':
		    $_E.dropDownUl.children('li').first().addClass('hover');
		    $_dropDownUlIndex=0;
		    break;
		case 'next':
		    $_dropDownUlIndex++;  
		    $child=$_E.dropDownUl.children('li').get($_dropDownUlIndex);
		    if(!$child){
			$_dropDownUlIndex--;
			$child=$_E.dropDownUl.children('li').get($_dropDownUlIndex);
		    }
		    $($child).addClass('hover');
		    break;
		case 'previous':
		    $_dropDownUlIndex--;  
		    if($_dropDownUlIndex<0){
			$_this.gotoTagInDropDown('first');
			return;
		    }
		    $child=$_E.dropDownUl.children('li').get($_dropDownUlIndex);
		    
		    if(!$child){
			$_dropDownUlIndex++;
			$child=$_E.dropDownUl.children('li').get($_dropDownUlIndex);
		    }
		    $($child).addClass('hover');
		    break;
		default:
		    $which.addClass('hover');
		    $index=0;
		    $i=0;
		    $_E.dropDownUl.children('li').each(function(){
			if($(this).attr('id')==$which.attr('id'))
			    $index=$i;
			$i++;
		    });
		    $_dropDownUlIndex=$index;
	    }
	    if($_scrollbar && $key){
		$child=$_E.dropDownUl.children('li').get($_dropDownUlIndex);
		$_scrollbar.move($key=='next'?50:-50);
	    }
	}
	// select a tag with the drop down by an event
	$_this.eventListenerDropDownTagClick=function($event){
	    $_this.selectTag($(this));
	    $event.preventDefault();
	}
	// selectin a tag from the drop down
	$_this.selectTag=function($element){
	    $element=$($element);
	    // add the value to the list
	    $identity=$element.attr('id')?$element.attr('id'):$element.attr('name');
	    if($.inArray($identity,$_values)==-1){
		$_values.push($identity);
		$_E.hidden.val($_values.join(';'));
		// add box next to the input, with delete button
		$li=$('<li/>');
		$tagRemover=$('<div class="mi_tag_remover" id="'+$element.attr('id')+'">x</div>');
		$tagRemover.bind('click',$_this.removeTag);
		$li.append('<div class="mi_tag '+($element.hasClass('create')?'create':'')+'">'+$element.html()+'</div>');
		$li.append($tagRemover);
		$_E.ul.append($li);
		$_E.container.attr('width',($_E.container.width()+$li.width())+"px")
	    }
	    // hide the drop down, focus the input and empty it
	    $_this.hideDropDown();
	    $_E.input.focus();
	    $_E.input.val('');
	    if($_options.selectTag)
		    $_options.selectTag.call($_E.container);
	}
	// hide the drop down menu
	$_this.hideDropDown=function(){
	    $_dropDownClose=true;
	    $_E.dropDown.hide();
	    if($_options.closingButton)$_E.dropDownCloser.hide();
	}
	// removing a tag
	$_this.removeTag=function(){
	    for($i in $_values){
		if($_values[$i]==$(this).attr('id')){
		    $_values.splice($i,1);
		}
	    }
	    // write to hidden input
	    $_E.hidden.val($_values.join(';'));
	    $(this).parent().remove();
	}    
	// adding values
	$_this.addTags = function($values,$reset){
	    if($reset == true){
		 $_E.hidden.val('');
		 $_E.ul.empty();
	    }
	    for($i in $_options.defaultValues){
		$_this.selectTag($('<li id="'+$_options.defaultValues[$i].id+'">'+$_options.defaultValues[$i].name+'</li>').get(0));
	    }
	}
	
	// CONSTRUCTOR
	// wrap the element with a div, add a ul and add the drop down menu
	$_E.input.wrap($_E.container);
	$_E.input.parent().prepend($_E.ul);
	$('body').append($_E.dropDown);
	//$_E.input.parent().append($_E.dropDown);
	if($_options.closingButton)$_E.input.parent().append($_E.dropDownCloser);
        
	// the hidden input
	$_E.hidden.attr('name',$_E.input.attr('name'));
	$_E.input.attr('name',false);
	$_E.input.parent().prepend($_E.hidden);
	// hide and position the dropdown
	$_E.dropDown.hide();
	if($_options.closingButton)$_E.dropDownCloser.hide();
	$_E.dropDown.css('position','absolute');
	if($_options.closingButton)$_E.dropDownCloser.css('position','absolute');
	$_E.dropDown.append($_E.dropDownUl);
	
	// bind typing to drop down
	$_E.input.bind('keyup',$_this.eventListenerInputKeyUp);
	//$_E.input.bind('keypress',$_this.eventListenerInputKeyNoEnter);
	$_E.input.bind('keydown',$_this.eventListenerInputKey);                               
	if($_options.closingButton)$_E.dropDownCloser.bind('click',$_this.hideDropDown);  
	// existing items
	if($_options.defaultValue && $_options.defaultValue.id && $_options.defaultValue.name){console.log("default value")
		$_this.selectTag($('<li id="'+$_options.defaultValue.id+'">'+$_options.defaultValue.name+'</li>').get(0));
	}
	
	if($_options.defaultValues && $_options.defaultValues.length){
	    $_this.addTags($_options.defaultValues);
	}
	
	// close on blur
	$_onDropDown=false;
	$_E.dropDown.bind('mouseover',function(){
	    $_onDropDown=true;
	})
	$_E.dropDown.bind('mouseleave',function(){
	    $_onDropDown=false;
	})
	$_E.input.bind('blur',function($event){
	    if(!$_onDropDown)
		$_this.hideDropDown();
	});
        
    };
    $.fn.inputTokenizer = function( $options ) {
	// DEFINE OPTIONS AND DEFAULTS
	var $_options = $.extend({}, $.fn.inputTokenizer.defaults, $options);
	return this.each(function() {
	    if(!$(this).data('inputTokenizer'))
		$(this).data('inputTokenizer',new ClassInputTokenizer(this,$_options));
	});
    };
    // DEFAULT VALUES
    $.fn.inputTokenizer.defaults = {
	'keyPressDelayBeforeSearch':300,
	'ajaxSearchUrl':'',
	'closingButton':false,
	'scrollbar':true,
	'defaultValue':null,
	'defaultValues':null,
	'selectTag':null
    };
})( jQuery);