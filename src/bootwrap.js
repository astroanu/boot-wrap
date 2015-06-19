$(function() {
	$(document).on('click', '.bw-modal', function(e) {
		e.preventDefault();
		bw.ajaxmodal($(this));
	});

	$(document).on('click', '.bw-ajaxlink', function(e) {
		e.preventDefault();
		bw.ajaxlink($(this));
	});
});

var bw = {
	ajaxmodal: function(link) {
		var id = link.data('modal-id') != null ? link.data('modal-id') : 'ajax-modal';
		var size = link.data('modal-size') != null ? ' modal-' + link.data('modal-size') + ' ' : '';
		var modal = $('<div id="' + id + '" class="modal fade loading" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true"><div class="modal-dialog' + size + '"></div></div>');
		$('body').append(modal);
		modal.on('show.bs.modal', function() {
			modal.find('.modal-dialog').load(link.attr('href'), function() {
				modal.removeClass('loading');
			});
		}).on('hidden.bs.modal', function() {
			$(this).remove();
		}).modal();
	},
	ajaxlink: function(link) {
		if (link.data('confirm') == null) {
			doAjax()
		} else {
			bootbox.confirm(link.data('confirm'), function(result) {
				if (result) {
					doAjax();
				}
			});
		}

		function doAjax() {
			$.getJSON(link.attr('href'), function(response) {
				if (response.success) {
					if (link.data('callback') == null) {
						link.replaceWith(response.data.html)
					} else {
						var func = window[link.data('callback')];
						if (typeof func == 'function') {
							func(link, response);
						}
					}
				}
			});
		}
	},
	msg: function(type, msg, duration) {
		var alertwrap = $('<div id="alertwrap"></div>');
		alertwrap.append('<div class="alert-container"></div>');
		var alert = $('<div class="alert alert-' + type + ' ' + (duration !== false ? 'alert-dismissible' : '') + '" role="alert">' +
			(duration !== false ? '<button type="button" class="close" data-dismiss="alert" aria-label="Close">' +
				'<span aria-hidden="true">&times;</span></button>' : '') + msg + '</div>');

		if ($('#alertwrap').length == 0) {
			$('body').append(alertwrap);
		}

		var alertContainer = $('#alertwrap').find('.alert-container');

		if (duration === false) {
			alertContainer.empty();
		}

		alertContainer.append(alert);

		if (duration > 0) {
			window.setTimeout(function() {
				alert.fadeOut(function() {
					alert.remove();
				});
			}, duration);
		}
	},
	lockform: function(form) {
		$(form).find('button[type="submit"]').addClass('Loading').button('loading');
	},
	unlockform: function(form) {
		$(form).find('button[type="submit"]').removeClass('Loading').button('reset');
	},
	closemodal: function(form) {
		$('body').find(form).closest('.modal').modal('hide');
	}
};