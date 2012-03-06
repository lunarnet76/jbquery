(function( $ ){
    var ClassSlideShow = function($domTarget,$defaultAndOptions){
	var $_E = {
	    'target':$($domTarget),
	    'scrollbar':$('<div class="'+$defaultAndOptions.cssSuffix+'-scrollbar"/>'),
	    'cursor':$('<div class="'+$defaultAndOptions.cssSuffix+'-cursor"/>')
	};
	var $_options = $defaultAndOptions;
	var $_this = this;
	
	var $_width;
	var $_fullTextWidth;
	var $_windowY;
	
	var $_drag=false;
	var $_actualY=0;
	
	var $_scrolling = false;
	var $_authorisedToScroll=true;
        
	// PRIVATE METHOD
	$_this.getElement = function($name){
	    return $_E[$name];
	}
	$_this.dragStart=function($event){
	    $_drag=true;
	    $_this.moveCursorTo($event.pageY);  
	    $event.preventDefault(); 
	}
	$_this.dragStop=function($event){
	    $_drag=false;
	    $event.preventDefault();
	}
	$_this.drag=function($event){
	    if($_drag){
		$_this.moveCursorTo($event.pageY);
	    }
	    $event.preventDefault();
	}
	$_this.forbidScroll=function(){
	    $_authorisedToScroll=false;
	}
	$_this.authorizeScroll=function(){
	    $_authorisedToScroll=true;
	}
	
	$_this.scroll=function($event){
	    if($_authorisedToScroll && !$_scrolling){
		$_scrolling = true;
		$movement = $_options.scrollMovement ? $_options.scrollMovement: ($_width/10);
		$_this.move($event.originalEvent.wheelDelta>0?-$movement:$movement,true);
	    }
	    $event.preventDefault();
	}
	
	$_this.moveTo=function($howManyPixel,$animate){
	    $new_x = $howManyPixel;
	    $current_position = -parseInt($_E.content.css('margin-left').replace('px',''));
	    
	    // move right
	    if($howManyPixel < 0){
		if($current_position == 0){
		    if($_options.move)
			$_options.move.call(this,'move-none-left');
		    $_scrolling = false
		    return;
		}else{
		    if($new_x < 0)
			$new_x = 0;
		    if($_options.move)
			if($new_x == 0)
			    $_options.move.call(this,'move-none-left');
			else
			    $_options.move.call(this,'move-left');
		}
	    // move left
	    }else{
		if($current_position == $_fullTextWidth){
		    if($_options.move)
			$_options.move.call(this,'move-none-right');
		    $_scrolling = false
		    return;
		}else{
		    if($new_x > $_fullTextWidth - $_width)
			$new_x = $_fullTextWidth - $_width;
		    if($_options.move)
			if($new_x == $_fullTextWidth - $_width)
			    $_options.move.call(this,'move-none-right');
			else
			    $_options.move.call(this,'move-right');
		}
	    }
		
	    if($animate == true)
		$_E.content.animate({
		    'margin-left':-$new_x+"px"
		},'fast',function(){
		    $_scrolling = false
		});
	    else
		$_E.content.css({
		    'margin-left':-$new_x+"px"
		});
	}
	
	$_this.move=function($howManyPixel,$animate){
	    if(!$_authorisedToScroll)return ;
	    // fix ie ...
	    $p = $_E.content.css('margin-left').replace('px','');
	    if($p == 'auto')$p = 0;
	    
	    $current_position = -parseInt($p);
	    $new_x = $current_position + parseInt($howManyPixel);
	    
	    // move right
	    if($howManyPixel < 0){
		if($current_position == 0){
		    if($_options.move)
			$_options.move.call(this,'move-none-left');
		    $_scrolling = false
		    return;
		}else{
		    if($new_x < 0)
			$new_x = 0;
		    if($_options.move)
			if($new_x == 0)
			    $_options.move.call(this,'move-none-left');
			else
			    $_options.move.call(this,'move-left');
		}
	    // move left
	    }else{
		if($current_position == $_fullTextWidth){
		    if($_options.move)
			$_options.move.call(this,'move-none-right');
		    $_scrolling = false
		    return;
		}else{
		    if($new_x > $_fullTextWidth - $_width)
			$new_x = $_fullTextWidth - $_width;
		    if($_options.move)
			if($new_x == $_fullTextWidth - $_width)
			    $_options.move.call(this,'move-none-right');
			else
			    $_options.move.call(this,'move-right');
		}
	    }
		
	    if($animate == true)
		$_E.content.animate({
		    'margin-left':-$new_x+"px"
		},'fast',function(){
		    $_scrolling = false
		});
	    else
		$_E.content.css({
		    'margin-left':-$new_x+"px"
		});
	}
	
	$_this.update=function($_optionsForThis){
	    $_width=$_optionsForThis.width ? $_optionsForThis.width : $_E.target.width();
	    $_fullTextWidth=$_optionsForThis.fullWidth;
	    $_cursorWidth=$_E.cursor.outerWidth();
	    $_actualY=$_cursorWidth;
	    $_windowY=$_E.target.offset().top;
	    
	    $newWidth = $_E.target.width();
	    
	    $_E.container.css({
		'overflow':'hidden',
		'float':'left',
		'width':$newWidth+"px",
		'height':$_E.target.height()+"px"
	    });
	    $_E.content.css({
		'overflow':'visible',
		'width':'100000000'
	    });
	    $_E.scrollbar.css({
		'position':'absolute',
		'overflow':'hidden',
		'height': $_width+"px",
		'float': 'left',
		'border-top':'none',
		'border-bottom':'none'
	    });
	    $_E.cursor.css({
		'margin-left':-($_cursorWidth/2)+"px"
	    });
	
	    // drag n drop scroll cursor
	    $_E.scrollbar.bind('mousemove',$_this.drag);
	    $_E.scrollbar.bind('mousedown',$_this.dragStart);
	    $_E.scrollbar.bind('mouseleave',$_this.dragStop);
	    $_E.scrollbar.bind('mouseup',$_this.dragStop);
	    $_E.target.bind('mousewheel',$_this.scroll);
	    
	    if($_fullTextWidth < $_width ){
		$_this.forbidScroll();
		$_E.scrollbar.hide();
	    }else{
		$_this.authorizeScroll();
		$_E.scrollbar.show();
	    }
	    if($_options.update)
		$_options.update.call(this);
	}
       
	// CONSTRUCTOR
	// we put the content in a div inside the target
	$_E.container=$('<div/>');
	$_E.content=$('<div/>');
	$_E.content.html($_E.target.html());
	$_E.target.empty();
	$_E.container.append($_E.content);
	$_E.target.append($_E.container);
	//$_E.target.append($_E.scrollbar);
	//$_E.scrollbar.append($_E.cursor);
	
	// get needed infos
	$_this.update($_options);
    };
    $.fn.slideshow = function( $options ) {
	// DEFINE OPTIONS AND DEFAULTS
	var $_options = $.extend({}, $.fn.slideshow.defaults, $options);
	return this.each(function() {
	    if(!$(this).data('slideshow'))
		$(this).data('slideshow',new ClassSlideShow(this,$_options));
	    else
		$(this).data('slideshow').update($_options);
	});
    };
    // DEFAULT VALUES
    $.fn.slideshow.defaults = {
	'cssSuffix':'scrollbar',
	'scrollSpeed':1,
	'width':null
    };
})( jQuery);