let $expandResource = $("ul.options a.expandResource");
let $collapseResource = $("ul.options a.collapseResource");
let $content = $(".item-content");
let $response = $(".response");
let $response_hider = $(".response_hider");
let $response_throbber = $(".response_throbber");

$(document).ready(()=> {
    $expandResource.click(()=> {
      $content.slideDown("fast");
    });

    $collapseResource.click(()=> {
      $content.slideUp("fast");
    });

    $response_hider.click(()=> {
      $response_hider.fadeOut("slow");
      $response.slideUp("slow");
    });
});

_script = {
    renderResponse(data){
        var html = '<h4 data-sw-translate="">Request URL</h4>';
        html += '<div class="block request_url"><pre><code>'+ data.url +'</code></pre></div>';
        html += '<h4 data-sw-translate="">Response Code</h4>';
        html += '<div class="block response_code"><pre><code>'+ data.code +'</code></pre></div>';
        html += '<h4 data-sw-translate="">Response Status</h4>';
        html += '<div class="block response_status"><pre><code>'+ data.status +'</code></pre></div>';
        html += '<h4 data-sw-translate="">Response Body</h4>';
        html += '<div class="block response_body"><pre class="json"><code>'+ data.body +'</code></pre></div>'

        let tag = "#" + data.operation;

        $(tag).html(html);
        $(tag).slideDown("fast");
        $response_hider.show();
    },
    
    toggleContent(param) {
      let $op = $("ul.endpoints ul.operations li.operation");   
      let operationContent = $op.children("div#content_" + param);
      operationContent.slideToggle("fast");
    },

    loading(bool){
      if (bool) { $response_throbber.show(); } else { $response_throbber.hide() };
    },

    triggerError(elem, bool){
      let $tag = $("#"+elem);
      if (bool) {
        $tag.addClass("field-error");
        $("p.text-error").show();
      }else{
        $tag.removeClass("field-error");
        $("p.text-error").hide();
      }
    },

    formHandler(operation){     
      let $hasInputs = $('#form_'+operation).find('input');
      var $formData = {};
      if($hasInputs.length != 0){
        let $inputs = $('#form_'+operation+' :input[type=text]');         

        $inputs.each(function() {
          $formData[this.name] = $(this).val();          
        });

        if ($inputs.attr("required")) {
          if(!$inputs.val().trim()){
            _script.triggerError($inputs.attr('id'), true);
            return false;
          }else{
            _script.triggerError($inputs.attr('id'), false);
            _data.getRequest($formData, operation);            
          }
        } else { 
          _data.getRequest($formData, operation);  
        }
        
      } else {
        _data.getRequest($formData, operation);
      }
    }
}
