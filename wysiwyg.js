(function( $ ){
    var ClassWysiwyg = function($domTarget,$defaultAndOptions){
        var $_target = $domTarget;
        var $_options = $defaultAndOptions;
        var $_this = this;
        var $_rangeSelection=false;
        var $_closed=true;
        var $_divMenu;
        var $_input=$('<input type="hidden"/>');

        // PRIVATE METHOD
        $_this.setSelection = function() {
            if(window.getSelection)
                $_rangeSelection=window.getSelection().getRangeAt(0);
            else if(document.getSelection)
                $_rangeSelection=document.getSelection;
            else if(document.selection && document.selection.createRange() && selection.text)
                $_rangeSelection=selection.text
            else $_rangeSelection=false;
        }
        
        $_this.selectionToString=function(){
            return new String($_rangeSelection).replace(/^\s+|\s+$/g,'');
        }
        $_this.selectionToHTML=function(){
            return new XMLSerializer().serializeToString($_rangeSelection.cloneContents());//.replace(/<\/?[^>]+(>|$)/g, "");
        }
  
        $_this.setOpen=function($bool){
            // closing
            if(!$bool){
                $_closed=true;
                $('#wysiwygMenu').hide();
                $($_target).addClass('mini').removeClass('full');
            }else if($_closed){
                $_closed=false;
                $('#wysiwygMenu').show(); 
                $($_target).addClass('full').removeClass('mini');
            }
            $_target.contentEditable = !$_target.isContentEditable
        }
        
        $_this.applyChange=function(){
            $tag=$(this).attr('class')=='remover'?'remover':$(this).attr('class');
            if($tag=='close'){
                $_this.setOpen(false);
                return;
            }
            if($tag=='remover'){
                $($_rangeSelection.commonAncestorContainer).unwrap()
                $text=$_this.selectionToString();
                $_rangeSelection.deleteContents();
                $div=document.createElement($tag);
                $($div).html($text);
                $_rangeSelection.insertNode($div);
                return;
            }
            $html=$_this.selectionToHTML(); 
            $_rangeSelection.deleteContents();
            $div=document.createElement($tag);
            $($div).html($html);
            $_rangeSelection.insertNode($div);
        }
        
        
        
        // CONSTRUCTOR
        // make container editable
        
        $($_target).bind('click',function(){
            if($_closed){
                $_this.setOpen(true);
            }
        });
        
        $($_target).bind('mouseup',function(){
            if($_closed){
                $_this.setOpen(true);
            }
            $_this.setSelection();
        });
        
        
        
        // menu
        $_divMenu=$('<div id="wysiwygMenu"><a class="h1"><h1>Header 1</h1></a><a class="h2"><h2>Header 2</h2></a><a class="h3"><h3>Header 3</h3></a><a class="h4"><h4>Header 4</h4></a><a class="p"><div class="p">Paragraph</div></a><a class="remover"><div class="p">Remove</div></a><a class="close"><div class="p">Close</div></a></div>');
        $_divMenu.css('position','absolute').css('top',($($_target).offset().top-50)+"px");
        $_divMenu.css('position','absolute').css('left',($($_target).offset().left-320)+"px");
        $($_target).parent().append($_divMenu);
        $($_target).parent().append($_input);
        $_input.attr('name',$($_target).attr('name'));
        
        $('body').mousemove(function(event){
            $ymax=$($_target).height()+$($_target).offset().top-$($_divMenu).height();
            $ymin=$($_target).offset().top;
            
            $inside=event.pageY>$($_divMenu).offset().top-20 && event.pageY<$($_divMenu).offset().top+20+$($_divMenu).height() && event.pageX>$($_divMenu).offset().left && event.pageX<$($_divMenu).offset().left+$($_divMenu).offset().width();
            cl('cl='+event.pageY)
            cl($($_divMenu).offset().top)
            cl($($_divMenu).offset().top+$($_divMenu).height())
            if(!$inside)
                $_divMenu.css('position','absolute').css('top',(event.pageY<$ymax?(event.pageY<$ymin?$ymin:event.pageY-50):$ymax)+"px");
        
        });
        
        $('#wysiwygMenu a').bind('click',$_this.applyChange);
        
        $_this.setOpen(true);
        $($($_target).parents('form').get(0)).bind('submit',function(){
            
            $_input.val($($_target).html());
        });
    };
    $.fn.wysiwyg = function( $options ) {
        // DEFINE OPTIONS AND DEFAULTS
        var $_options = $.extend({}, $.fn.wysiwyg.defaults, $options);
        return this.each(function() {
            var wysiwyg = new ClassWysiwyg(this,$_options);
        });
    };
    // DEFAULT VALUES
    $.fn.wysiwyg.defaults = {
        foreground: 'red',
        background: 'yellow'
    };
})( jQuery );