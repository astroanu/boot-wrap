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
		var modal = $('<div '+ (id != null ? 'id="ajax-modal" ' : '') +'class="modal fade" tabindex="-1"></div>');
		$(link).after(modal);
		$('body').modalmanager('loading');
		modal.load(link.attr('href'), function(){
			modal.modal();
	    });	
	    modal.on('hidden.bs.modal', function(){
	    	$(this).remove();
	    });
	},
	ajaxlink : function(link){
		
	}
}

// bootstrap 3 modal support
$.fn.modal.defaults.spinner = $.fn.modalmanager.defaults.spinner = 
    '<div class="loading-spinner" style="width: 200px; margin-left: -100px;">' +
        '<div class="progress progress-striped active">' +
            '<div class="progress-bar" style="width: 100%;"></div>' +
        '</div>' +
    '</div>';