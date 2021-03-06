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
    ajaxloader: null,
    ajaxmodal: function(link) {
        var id = link.data('modal-id') != null ? link.data('modal-id') : 'ajax-modal';
        var size = link.data('modal-size') != null ? ' modal-' + link.data('modal-size') + ' ' : '';

        var backdrop = link.data('modal-backdrop') != null ? link.data('modal-backdrop') : true;
        var keyboard = link.data('modal-keyboard') != null ? link.data('modal-keyboard') : true;

        var modal = $('<div id="' + id + '" class="modal fade loading" role="dialog" aria-labelledby="' + id + '" aria-hidden="true"><div class="modal-dialog' + size + '"></div></div>');

        var loader = this.ajaxloader;

        if (loader != null) {
            loader.appendTo(modal);
        }

        $('body').append(modal);

        modal.on('show.bs.modal', function() {
            $.ajax({
                url: link.attr('href'),
                type: 'get',
                success: function(response) {
                    if (response.success == undefined) {
                        modal.find('.modal-dialog').html(response);
                        modal.removeClass('loading');

                        if (loader != null) {
                            loader.remove();
                        }
                    }
                }
            });
        }).on('hidden.bs.modal', function() {
            $(this).remove();
        }).modal({
            backdrop: backdrop,
            keyboard: keyboard
        });
    },
    ajaxlink: function(link) {
        if (link.data('confirm') == null) {
            doAjax()
        } else {
            bootbox.confirm({
                message: link.data('confirm'),
                callback: function(result) {
                    if (result) {
                        doAjax();
                    }
                },
                buttons: {
                    cancel: {
                        label: 'No'
                    },
                    confirm: {
                        label: 'Yes'
                    }
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
    msgtpl: function(type, msg, duration) {
        return $('<div class="alert alert-' + type + ' ' + (duration !== false ? 'alert-dismissible' : '') + '" role="alert">' +
            (duration !== false ? '<button type="button" class="close" data-dismiss="alert" aria-label="Close">' +
                '<span aria-hidden="true">&times;</span></button>' : '') + msg + '</div>');
    },
    msg: function(type, msg, duration) {
        var alertwrap = $('<div id="alertwrap"></div>');
        alertwrap.append('<div class="alert-container"></div>');

        var alert = this.msgtpl(type, msg, duration);

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