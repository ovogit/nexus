var Comet = Comet || {};

Comet.ProductBar = function() {
    'use strict';
    var legacyProductBarClass = 'comet-product-bar--legacy';

    function setEventListeners($productBar) {
        $productBar.find(".js-comet-product-bar__show-global-nav-bar").on("click", function(e){
            // If it's a legacy product bar, just function as a link, don't trigger any global nav, it doesn't exist in this case
            if (!$productBar.hasClass(legacyProductBarClass)) {
                e.preventDefault();
                $(document).trigger("comet-show-global-nav-bar");
            }
        });

        $productBar.find(".js-comet-product-bar__toggle-panel").on("click", function(e){
            e.preventDefault();
            $(document).trigger("comet-product-bar-toggle-panel");
        });

        $productBar.find(".js-comet-product-bar__toggle-search").on("click", function(e){
            e.preventDefault();
            $(document).trigger("comet-product-bar-toggle-search");
        });
    }

    var initialize = function initialize() {
        $(".js-comet-product-bar").each(function(){
            setEventListeners($(this));
        });
    };

    var publicVars = {
        'initialize': initialize
    };

    return publicVars;
}();


$(document).ready(function(){
    'use strict';
    Comet.ProductBar.initialize();
});
