$(function(){
	$(document).on('click', '.bw-modal', function(e){
		e.preventDefault();
		bw.ajaxmodal($(this));
	});

	$(document).on('click', '.bw-ajaxlink', function(e){
		e.preventDefault();
		bw.ajaxlink($(this));
	});	
});

var bw = {
	ajaxmodal : function(link){
		var id = link.data('modal-id');
		var modal = $('<div '+ (id != null ? 'id="ajax-modal" ' : '') +'class="modal fade" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true"></div>');
		$('body').append(modal);
		modal.load(link.attr('href'), function(){
			modal.modal();
	    });	
	    modal.on('hidden.bs.modal', function(){
	    	$(this).remove();
	    });
	},
	ajaxlink : function(link){
		if(link.data('confirm') == null){
			doAjax()
		}else{
			bootbox.confirm(link.data('confirm'), function(result) {
				if(result){
					doAjax();
				}
			}); 
		}
		
		function doAjax(){
			$.getJSON(link.attr('href'), function(response){
				if(response.success){
					if(link.data('callback') == null){
						link.replaceWith(response.data.html)
					}else{
						var func = window[link.data('callback')];
						if(typeof func == 'function'){
							func(link, response);
						}
					}
				}
			});
		}		
	}
}