(function( $ ){
    var ClassFileUpload = function($domTarget,$defaultAndOptions){
        var $_options = $defaultAndOptions;
        var $_this = this;
        var $_created=false;
        var $_originalDomName=false;
        var $_E={
            'iframe':$('<iframe style="position:absolute;visibility:hidden"><html><head/><body/></iframe></iframe>'),
            'form':null,
            'input':$($domTarget),
            'hiddenInput':null
        }

        // PRIVATE METHOD
        $_this.init=function(){
            $_E.body.empty();
            $_E.form=$('<form action="'+$_options['url']+'" method="post" enctype="multiparts/form-data" id="uploader"><input type="hidden" name="MAX_FILE_SIZE" value="300000000"/></form>');
            $_E.body.append($_E.form);
            $_created=true;
        }
        $_this.iframeReady=function(){
            $_E.body=$_E.iframe.contents().find('body').first();
            if(!$_created){
                // add the form, initialise the error container
                $_this.init();
            }else{
                // result of a post
                $data=JSON.parse($_E.body.html());
                if($data.error){
                    if($defaultAndOptions['error'].call)
                        $defaultAndOptions['error'].call(this,$data.error,$_E.input,$_originalDomName);
                }else if($defaultAndOptions['success'].call){
                    $defaultAndOptions['success'].call(this,$data.id,$_E.input,$_originalDomName);
                }
            }
        }
        $_this.selectFile = function() {
            if($defaultAndOptions['upload'].call)
                $defaultAndOptions['upload'].call(this,$_originalDomName);
            // empty the iframe
            $_this.init();
            // remove the input from the form in the iframe
            if($_E.hiddenInput)
               $_E.hiddenInput.remove();
           
            // clone the node, replace the original
            $newInput=$($_E.input.get(0).cloneNode(false));
            $parent=$_E.input.parent();
            $parent.append($newInput);
            $newInput.data('FileUpload',true);
            $newInput.bind('change',$_this.selectFile);
            $newInput.attr('name',false);
            
            // replace the actual
            $_E.input.remove();
            $_E.form.append($_E.input);
            $_E.hiddenInput=$_E.input;
            $_E.input=$newInput;
            
            // submit
            $_E.hiddenInput.attr('name','upload');
            $_E.form.attr('method','post');
            $_E.form.attr('enctype','multipart/form-data');
            $_E.form.submit();
        }
        
        // CONSTRUCTOR
        // add the iframe to the document
        $_E.iframe.load($_this.iframeReady);
        $('body').append($_E.iframe);
        // bind the actual input
        $_E.input.bind('change',$_this.selectFile);
        $_originalDomName=$_E.input.attr('name');
        $_E.input.attr('name',false);
        
    };
    $.fn.uploader = function( $options ) {
        // DEFINE OPTIONS AND DEFAULTS
        var $_options = $.extend({}, $.fn.uploader.defaults, $options);
        return this.each(function() {
            if(!$(this).data('FileUpload')){
                var upload = new ClassFileUpload(this,$_options);
                $(this).data('FileUpload',true);
            }
        });
    };
    // DEFAULT VALUES
    $.fn.uploader.defaults = {
        'error':null,
        'success':null,
        'upload':null,
        'url':null
    };
})( jQuery );