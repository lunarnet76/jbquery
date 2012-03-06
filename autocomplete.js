ajaxAutocompleteObjectClass=function($input,$option){
    var $options=$option;
    $transaction=null;
    
    if($input.attr('dataid') && $input.attr('dataid').length==0){
        $input.addClass('search');
        $input.val($options['searchText']);
    }
    
    var $instance=this;
    var $name=$input.attr('name');
    var $valueInput=$('<input type="hidden" name="'+$input.attr('name')+'" value="'+$input.attr('dataid')+'">');
    var $container=$('<div class="autocompleter">&nbsp;</div>');
    $container.css('position','absolute');
    $container.hide();
    $input.attr('name','');
    $($input.parent()).append($container);
    $($input.parent()).append($valueInput);
    $input.attr('validator','function(ob){$ins=ob.siblings(\':input\');return $($ins[0]).val().length>0}');

    if($input.attr('callBack')){
        eval('$validator='+$input.attr('callBack'));
        $options['callBack']=$validator;
    }

    this.handleAjaxBegin=function(){
        $container.hide();
    }

    this.handleAjaxResponse=function($data){
        $transaction=null;
        $data=JSON.parse($data);
        if(!$data['all'])
            $data['all'] = $data;
        for($i in $data){ 
            
        }
        $container.empty();
        $container.css('left',$input.offset().left);
        $results=false;
        for($i in $data['all']){
            $container.append('<div class="choice" id="'+$i+'">'+$data['all'][$i]+'</div>');
            $results=true;
        }
        if(!$results)
            $container.append('<div class="noresult">'+$options['noResultText']+'</div>');
        $container.append($('<div class="lastItemTitle">test</div>'));
        for($i in $data['last']){
            $container.append('<div class="choice last" id="'+$i+'">'+$data['last'][$i]+'</div>');
        }
        $container.append('<div class="last close">'+$options['closeText']+'</div>');
        $container.find('div.choice').bind('click',function(){
            $input.val($(this).html());
            $valueInput.val($(this).attr('id'));
            $container.hide();
            $containerIsShown=false;
            $input.removeClass('search');
            $input.showError(jQuery(this).validateInput());
            if($options['callBack']){
                $options['callBack']($valueInput.val(),$(this).html(),$name,$instance);
            }
        });
        $container.find('div.noresult').bind('click',function(){
            $container.hide();
        });
        $container.find('div.close').bind('click',function(){
            $container.hide();
            $input.addClass('search');
            $valueInput.val("");
        });
        $container.show();
    }

    this.reset=function(){
        $container.empty();
        $valueInput.val('');
        $input.val('');
        $input.focus();
        $input.addClass('search');
    }

    this.ajaxCall=function(){
        if($transaction)
            $transaction.abort();
        $transaction=$.ajax({
            beforeSend: $instance.handleAjaxBegin,
            url: $options['url'],
            dataType: 'text',
            data: {
                'search':$input.val(),
                'class':$input.attr('dataclass')
            },
            success: $instance.handleAjaxResponse
        });
    }
    
    $input.unbind('keyup');
    $input.unbind('blur');
    $input.die('keyup');
    $input.die('blur');
    $input.bind('keyup',function($e){
        $(this).addClass('search');
        $forbiddenKeys=[13];
        if($forbiddenKeys.indexOf($e.which))
            $instance.ajaxCall();
    });
    $input.bind('click',function(){
        if($(this).val()==$options['searchText']){
            $(this).val('');
        }
    })
    $container.bind('blur',function(){
        $container.hide();
    })
    if($input.val()==$options['searchText']){
        $input.val('');
    }
    
}

$.fn.ajaxAutocompleteObject=function($options){
    new ajaxAutocompleteObjectClass($(this),$options);
}