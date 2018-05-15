var Comet = Comet || {};

Comet.PageShell = function() {
    'use strict';
        var globalNavBarVisibleClass = "comet-page-shell--global-nav-bar-visible",
            globalNavBarExpandedClass = "comet-page-shell--global-nav-bar-expanded",
            panelVisibleClass = "comet-page-shell--panel-visible",
            searchVisibleClass = "comet-page-shell__search-visible",
            globalNavBarSortingClass = "comet-page-shell--global-nav-bar-sorting",
            globalNavBarCustomizationEnabledClass = "comet-page-shell--global-nav-bar-customizing";

    function showGlobalNavBar() {
        $(".comet-page-shell").addClass(globalNavBarVisibleClass);
    }

    function hideGlobalNavBar() {
        $(".comet-page-shell").removeClass(globalNavBarVisibleClass);
    }

    function togglePanel() {
        if ($(".comet-page-shell").hasClass(panelVisibleClass)) {
            hidePanel();
        } else {
            showPanel();
        }
    }

    function showPanel() {
        $(".comet-page-shell").addClass(panelVisibleClass);
    }

    function hidePanel() {
        $(".comet-page-shell").removeClass(panelVisibleClass);
    }

    function toggleSearch() {
        if ($(".comet-page-shell").hasClass(searchVisibleClass)) {
            hideSearch();
        } else {
            showSearch();
        }
    }

    function showSearch() {
        $(".comet-page-shell").addClass(searchVisibleClass);
        $(event.target).closest('.comet-product-bar__action').find('.comet-product-bar__search-input').focus();
    }

    function hideSearch() {
        $(".comet-page-shell").removeClass(searchVisibleClass);
    }

    function expandGlobalNavBar() {
        if (!$(".comet-page-shell").hasClass(globalNavBarExpandedClass)) {
            $(".comet-page-shell").addClass(globalNavBarExpandedClass);
        }
    }

    function collapseGlobalNavBar() {
        // Don't collapse the global nav bar if it's being sorted
        if ($(".comet-page-shell").hasClass(globalNavBarExpandedClass) && !$(".comet-page-shell").hasClass(globalNavBarSortingClass)) {
            $(".comet-page-shell").removeClass(globalNavBarExpandedClass);
        }
    }

    function toggleGlobalNavBarCustomizationMode() {
        if ($(".comet-page-shell").hasClass(globalNavBarCustomizationEnabledClass)) {
            $(".comet-page-shell").removeClass(globalNavBarCustomizationEnabledClass);
        } else {
            $(".comet-page-shell").addClass(globalNavBarCustomizationEnabledClass);
        }
    }

    function enableGlobalNavBarSortingMode() {
        $(".comet-page-shell").addClass(globalNavBarSortingClass); // Add a class so the nav isn't collapsed during sorting
    }

    function disableGlobalNavBarSortingMode() {
        $(".comet-page-shell").removeClass(globalNavBarSortingClass); // Remove class so the nav will collapse as normal
    }

    function setEventListeners() {
        $(document).on("comet-show-global-nav-bar", showGlobalNavBar);

        $(document).on("comet-product-bar-toggle-panel", togglePanel);

        $(document).on("comet-product-bar-toggle-search", toggleSearch);

        $(document).on("comet-global-nav-bar-sort-start", enableGlobalNavBarSortingMode);

        $(document).on("comet-global-nav-bar-sort-end", disableGlobalNavBarSortingMode);

        $(document).on("comet-toggle-global-nav-bar-customization-mode", toggleGlobalNavBarCustomizationMode);

        $(document).on("comet-expand-global-nav-bar", expandGlobalNavBar);

        $(document).on("comet-collapse-global-nav-bar", collapseGlobalNavBar);

        $(document).on("touchend", "." + globalNavBarExpandedClass + " .comet-page-shell__product-well", function(e){
            e.preventDefault();
            e.stopPropagation();
            collapseGlobalNavBar();
        });

        $(".comet-page-shell__global-nav-bar-touch-overlay").on("mouseenter", expandGlobalNavBar);

        $(".js-comet-page-shell__global-nav-bar *").on("focusin", expandGlobalNavBar);

        $(".js-comet-page-shell__global-nav-bar").on("mouseleave", collapseGlobalNavBar);

        $(".js-comet-page-shell__global-nav-bar *").on("focusout", collapseGlobalNavBar);

        $(".comet-page-shell__global-nav-bar-touch-overlay").on("touchend", function(e){
            e.preventDefault();
            e.stopPropagation();
            expandGlobalNavBar();
        });

        $(".js-comet-page-shell__close-global-nav-bar").on("click", function(e){
            e.preventDefault();
            hideGlobalNavBar();
        });

        $(".js-comet-page-shell__product-well-overlay").on("click", function(e){
            e.preventDefault();
            if ($("." + globalNavBarCustomizationEnabledClass).length === 0) { // If "customize" mode isn't enabled allow clicks on the overlay to close the global nav
                hideGlobalNavBar();
            }
        });

        $(".js-comet-page-shell__close-panel").on("click", function(e){
            e.preventDefault();
            hidePanel();
        });
    }

    var initialize = function initialize() {
        setEventListeners();
    };

    var publicVars = {
        'initialize': initialize
    };

    return publicVars;
}();


$(document).ready(function(){
    'use strict';
    Comet.PageShell.initialize();
});
