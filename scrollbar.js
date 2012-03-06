(function( $ ){
    var ClassScrollBar = function($domTarget,$defaultAndOptions){
	var $_E = {
	    'target':$($domTarget),
	    'scrollbar':$('<div class="'+$defaultAndOptions.cssSuffix+'-scrollbar"/>'),
	    'cursor':$('<div class="'+$defaultAndOptions.cssSuffix+'-cursor"/>')
	};
	var $_options = $defaultAndOptions;
	var $_this = this;
	
	var $_height;
	var $_fullTextHeight;
	var $_windowY;
	
	var $_drag=false;
	var $_actualY=0;
       
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
	
	$_this.moveCursorTo=function($y){
	    $y-=$_windowY+$_cursorHeight/2;
	    if($y<=0)$y=0;
	    if($y>$_height)
		$y=$_height;
	    $_actualY=$y;
	    $realY=($y/$_height)*($_fullTextHeight);
	    if($realY<0)$realY=0;
	    $_E.cursor.css({
		'margin-top':($y<=0?0:$y)+"px"
	    });
	    $_E.content.css({
		'margin-top':'-'+$realY+"px"
	    });
	}
	
	$_this.scroll=function($event){
	    if($_authorisedToScroll){
		$movement = ($_height/10);
		$_this.move($event.originalEvent.wheelDelta>0?-$movement:$movement);
	    }
	    $event.preventDefault();
	}
	
	$_this.move=function($yOfContent){
	    if(!$_authorisedToScroll)return ;
	    $y=($yOfContent/$_fullTextHeight)*$_height;
	    $cursorPosition=parseInt($_E.cursor.css('margin-top').replace('px',''));
	    $y=$cursorPosition+parseInt($y);
	    if($y<(-$_cursorHeight/2))return;
	    if($y<=$_height){
		$_E.cursor.css({
		    'margin-top':($y)+"px"
		});
	    }
	    $realY=($y/$_height)*($_fullTextHeight);
	    if($realY<0)$realY=0;
	    if($realY>$_fullTextHeight-$_height)
		$realY=$_fullTextHeight-$_height
	    $_E.content.css({
		'margin-top':'-'+$realY+"px"
	    });
	}
	
	$_this.update=function($_optionsForThis){
	    $_height=$_optionsForThis.height ? $_optionsForThis.height : $_E.target.height();
	    $_fullTextHeight=$_optionsForThis.fullHeight ? $_optionsForThis.fullHeight : $_E.content.get(0).scrollHeight;
	    
	    $_cursorHeight=$_E.cursor.outerHeight();
	    $_actualY=$_cursorHeight;
	    $_windowY=$_E.target.offset().top;
	    
	    if($_optionsForThis.callback)
		$_optionsForThis.callback.call(this,$_this);
	    
	    $newWidth = $_E.target.width();
	    //if($_E.scrollbar.is(':visible'))
		//$newWidth -= $_E.scrollbar.outerWidth();
	    $newWidth+="px";
	    
	    $_E.container.css({
		'overflow':'hidden',
		'float':'left',
		'width':$newWidth,
		'height':$_height+"px"
	    });
	    $_E.content.css({
		'overflow':'visible',
		'width':$newWidth,
		'height':$_height+"px"
	    });
	    $_E.scrollbar.css({
		'position':'absolute',
		'overflow':'hidden',
		'height': $_height+"px",
		'float': 'left',
		'border-top':'none',
		'border-bottom':'none'
	    });
	    $_E.cursor.css({
		'margin-top':-($_cursorHeight/2)+"px"
	    });
	
	    // drag n drop scroll cursor
	    $_E.scrollbar.bind('mousemove',$_this.drag);
	    $_E.scrollbar.bind('mousedown',$_this.dragStart);
	    $_E.scrollbar.bind('mouseleave',$_this.dragStop);
	    $_E.scrollbar.bind('mouseup',$_this.dragStop);
	    $_E.target.bind('mousewheel',$_this.scroll);
	    
	    if($_fullTextHeight < $_height ){
		$_this.forbidScroll();
		$_E.scrollbar.hide();
	    }else{
		$_this.authorizeScroll();
		$_E.scrollbar.show();
	    }
	}
       
	// CONSTRUCTOR
	// we put the content in a div inside the target
	$_E.container=$('<div/>');
	$_E.content=$('<div/>');
	$_E.content.html($_E.target.html());
	$_E.target.empty();
	$_E.container.append($_E.content);
	$_E.target.append($_E.container);
	$_E.target.append($_E.scrollbar);
	$_E.scrollbar.append($_E.cursor);
	
	// get needed infos
	$_this.update($_options);
    };
    $.fn.scrollbar = function( $options ) {
	// DEFINE OPTIONS AND DEFAULTS
	var $_options = $.extend({}, $.fn.scrollbar.defaults, $options);
	return this.each(function() {
	    if(!$(this).data('scrollbar'))
		$(this).data('scrollbar',new ClassScrollBar(this,$_options));
	    else
		$(this).data('scrollbar').update($_options);
	});
    };
    // DEFAULT VALUES
    $.fn.scrollbar.defaults = {
	'cssSuffix':'scrollbar',
	'scrollSpeed':1,
	'callback':null
    };
})( jQuery);