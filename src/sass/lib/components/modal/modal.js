var Comet = Comet || {};

Comet.Modal = function() {
    'use strict';

    var $overlay,
        $modal,
        $closeButton,
        $lastFocus,
        takeover = false;

    var openInModal = function(target) {
        // target: thing to be opened in modal
        var $content = $('#' + target).clone().attr('id', target + "-clone");

        takeover = $content[0].className.indexOf('comet-modal--takeover') >= 0 ? true : false;

        // fire custom event
        $('body').trigger('comet.modal.begin');
        // add class to body to identify a modal is open
        $('body').addClass('comet-modal-open');
        // add overlay to page

        generateModal($content);
        attachCloseEvents();
    };

    var generateModal = function(content) {

        // Create modal base objects
        var $modalOverlay = $('<div class="comet-modal-overlay js-comet-modal-overlay" role="dialog"></div>'),
            $modalContainer = $('<div class="comet-modal js-comet-modal" role="document"></div>');

        // insert content into modal container
        content.appendTo($modalContainer);

        if (takeover) {
            $modalOverlay.addClass('comet-modal-overlay--takeover');
            $modalContainer.appendTo($modalOverlay);
            $modalOverlay.prepend('<button class="comet-button comet-button--flat comet-button--icon comet-modal__button--takeover-close js-comet-modal__close-button" aria-label="Close Modal"><svg class="comet-button--icon__icon comet-icon--l"><use xlink:href="/comet/comet_assets/comet.svg#x"></use></svg></button>');
            $('body').append($modalOverlay);
            $modal = $('.js-comet-modal-overlay');
        } else {
            $modalOverlay.addClass('comet-modal-overlay--backdrop');
            $('body').append($modalOverlay);
            $('body').append($modalContainer);
            $modal = $('.js-comet-modal');
        }

        // resize modal in order to account for smaller screens for scrollable
        resizeModal();

        // define $overlay, $modal and $closeButton vars for closeModal()
        $overlay = $('.js-comet-modal-overlay');
        $closeButton = $('.js-comet-modal__close-button');

        $modal.attr('tabindex', '0');
        $modal.focus();

        // fire custom event
        $('body').trigger('comet.modal.generate');
    };

    var attachCloseEvents = function() {
        if (!takeover) {
            $overlay.on('click', closeModal);
        }

        $closeButton.on('click', closeModal);

        // Esc Key
        $(document).keyup(function(e) {
            if (e.keyCode === 27) {
                closeModal();
            }
        });
    };

    var attachOpenEvents = function(target) {

        var $selector = target ? $(target) : $('.js-modal-trigger');

        $selector.on('click', function() {
            var $modalTarget = $(this).data('target');
            $lastFocus = document.activeElement;
            openInModal($modalTarget);
        });
    };

    var closeModal = function() {
        $overlay.remove();
        $modal.remove();
        $lastFocus.focus();
        $('body').removeClass('comet-modal-open');

        // fire custom event
        $('body').trigger('comet.modal.close');
    };

    var resizeModal = function() {
        var $resizeModal = $('.js-comet-modal'),
            $modalInner = $resizeModal.find('.comet-modal__inner'),
            $modalContent = $resizeModal.find('.comet-modal__content'),
            $modalHeaderHeight = $resizeModal.find('.comet-modal__header').height(),
            $modalFooterHeight = $resizeModal.find('.comet-modal__footer').outerHeight(),
            availableHeight = document.body.clientHeight,
            $newHeight;

        if ($modalInner.length > 0) {
            $newHeight = availableHeight - ($modalHeaderHeight + $modalFooterHeight + 80); // 80 is for misc spacing and margins
            if ($newHeight > 775) { $newHeight = 775; }
            $modalContent.css('max-height', $newHeight);

            if (Comet.Utils.hasScrollBar($modalContent)) {
                $modalInner.addClass("comet-modal--scrollable");
            } else {
                $modalInner.removeClass("comet-modal--scrollable");
            }
        }
    };

    var initialize = function() {
        attachOpenEvents();

        $(window).resize(function() {
            if ($('.js-comet-modal').length > 0) {
                Comet.Utils.debounceFunction(resizeModal(), 200);
            }
        });
    };

    var public_vars = {
        'initialize': initialize,
        'openInModal': openInModal,
        'generateModal': generateModal,
        'closeModal': closeModal,
        'attachOpenEvents': attachOpenEvents,
        'attachCloseEvents': attachCloseEvents
    };

    return public_vars;
}();

$(document).ready(function() {
    "use strict";

    Comet.Modal.initialize();
});
