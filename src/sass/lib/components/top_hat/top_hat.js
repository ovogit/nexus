var Comet = Comet || {};

Comet.TopHat = function() {
    'use strict';

    var set_event_listeners = function() {
        $(".js-comet-top-hat__close-button").on("click", function(e){
            e.preventDefault();
            hide_top_hat(e);
        });
    };

    var hide_top_hat = function(e) {
        var $topHat = $(e.target).closest(".comet-top-hat"),
            $topHatHeight = $topHat.outerHeight();

        $topHat.addClass("comet-top-hat--hidden");
        $topHat.attr("aria-hidden", true);
        $topHat.css("margin-top", "-" + $topHatHeight);
    };

    var initialize = function initialize() {
        set_event_listeners();
    };

    var public_vars = {
        'initialize': initialize
    };

    return public_vars;
}();

$(document).ready(function() {
    "use strict";

    Comet.TopHat.initialize();
});
