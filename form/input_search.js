(function( $ ){
    // !CLASS
    var Form_Input_SearchAjax = function($target,$options){
        // !ATTRIBUTES
        var $_E = {
            input: $target,
            submitvalue: $('<input type="hidden"/>'),
            container: $('<div></div>'),
            dropdown: $('<ul></ul>'),
            value: $('<div></div>')
        }
        var $_this = this;
        var $_interval = null;
        var $_domName = null;
        
        // !METHODS
        this.focus = function(){
            $_E.input.focus();
        }
        
        this.eventListenerInputKeyUp = function($event){
            $code= ($event.keyCode ? $event.keyCode : $event.which);
            if($code==13 || $code==40 || $code==38){
                $event.preventDefault();
                return false;
            }
            clearTimeout($_interval);
            $_interval = setTimeout(function(){
                $_this.search($_E.input.val());
            }, $options.delay);
            $event.preventDefault();
            return false;
        }
        
        this.search = function($searchTerm){
            $.ajax({
                dataType:'json',
                url: $options.url+$searchTerm,
                success: function($data){
                    $_this.displayDropDown($data);
                }
            })
        }
        
        this.displayDropDown = function($data){
            if(!$data.length) return;
            $_E.dropdown
            .empty()
            for($i in $data){
                $_E.dropdown
                .append(
                    $('<li></li>')
                    .attr('id','ajaxSearchInput-'+$data[$i].id)
                    .html($data[$i].text)
                    .bind('click',$_this.selectOption)
                    )
            }
            $_E.dropdown
            .show()
            .css({
                left: $_E.container.offset().left
            })
        }
        
        this.selectOption = function(){
            $_E.dropdown
            .hide()
            // replace input
            $_E.input
            .hide()
            $_E.container.append(
                $_E.value
                .html($(this).html())
                .append(
                    $('<div>x</div>')
                    .addClass('button-close')
                    .bind('click',$_this.closeValue)
                    )
                ) 
            $_E.submitvalue
            .attr('name',$_domName)
            .val($(this).attr('id').substring('ajaxSearchInput-'.length))
        }
        
        this.closeValue = function(){
            $_E.value
            .remove()
            $_E.input
            .val('')
            .show()
            $_E.submitvalue
            .val('')
        }
        
        // !CONSTRUCTOR
        // style
        $_E.container
        .addClass($options.css)
        .css({
            cursor: 'pointer'
        })
        .bind('mouseover',$_this.focus)
        .bind('click',$_this.focus)
       
        $_E.input
        .css({
            border:'none !important',
            background:'none !important',
            outline: 'none !important'
        })
        .bind('keyup',$_this.eventListenerInputKeyUp)
            
        $_E.dropdown
        .addClass($options.css)
        .css({
            position:'absolute'
        }).append(
            $('<li></li>')
            .attr('id','ajaxSearchInput-')
            .html('gweg')
            )
        .hide()
            
        // get form input name
        $_domName = $_E.input.attr('name');
        $_E.submitvalue
        .attr('name',$_domName)
        
        // wrap the input with a div, add the dropdown
        $_E.input
        .before($_E.container)
        .before($_E.dropdown)
        .attr('name','')
        $_E.container
        .append($_E.input)
        .append($_E.submitvalue)
        
        // if input has a value
        if($_E.input.val()){
            $.ajax({
                dataType:'json',
                url: $options.url+$_E.input.val()+'&id',
                success: function($data){
                    $_E.container.append(
                        $_E.value
                        .html($data[0].text)
                        .append(
                            $('<div>x</div>')
                            .addClass('button-close')
                            .bind('click',$_this.closeValue)
                            )
                        ) 
                    $_E.submitvalue
                    .attr('name',$_domName)
                    .val($data[0].id)
                     $_E.input
                    .val('')
                    .hide()
                }
            })
        }
    };
    
    // !DEFAULTS
    Form_Input_SearchAjax.prototype.defaults = {
        css:'form_input_search_ajax',
        delay:300
    }
    // !JQUERY INTEGRATION
    $.fn.ajaxSearchInput = function($options) {
        $(this).each(function(){
            if(!$(this).data('ajaxSearchInput'))
                $(this).data('ajaxSearchInput',new Form_Input_SearchAjax($(this),$.extend({}, Form_Input_SearchAjax.prototype.defaults, $options)));
        });
    };
})( jQuery);