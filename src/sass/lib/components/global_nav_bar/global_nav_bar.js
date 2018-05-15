var Comet = Comet || {};

Comet.GlobalNavBar = function() {
    'use strict';
    var moreNavVisibleClass = "comet-global-nav-bar--more-nav-expanded",
        globalNavBarCustomizationEnabledClass = "comet-page-shell--global-nav-bar-customizing";


    function setActiveState($globalNav) {
        var filename = /[^/]*$/.exec(window.location.pathname)[0];
        $globalNav.find("a[href$='" + filename + "']").closest(".comet-global-nav-bar__item").addClass("comet-global-nav-bar__item--selected comet-list-group__row--selected");
    }

    function setEventListeners($globalNav) {
        $globalNav.on("click", ".js-comet-global-nav-bar__more-nav-trigger", function(e){
            e.preventDefault();
            if ($globalNav.hasClass(moreNavVisibleClass)) {
                $globalNav.removeClass(moreNavVisibleClass);
            } else {
                $globalNav.addClass(moreNavVisibleClass);
            }
        });

        $globalNav.on("click", ".js-comet-global-nav-bar__customization-toggle", function(e){
            e.preventDefault();
            toggleCustomizationMode();
        });

        $globalNav.on("click", ".js-comet-global-nav-bar__reset-menu", function(e){
            e.preventDefault();
            // Trigger the confirmation modal
            toggleCustomizationMode();
        });

        $globalNav.on("click", ".js-comet-global-nav-bar__save-nav-order", function(e){
            e.preventDefault();
            // Save current nav order for user
            toggleCustomizationMode();
        });

        $globalNav.on("click", ".js-comet-global-nav-bar__cancel-nav-order", function(e){
            e.preventDefault();
            // Revert back to nav order from the start of customization mode
            toggleCustomizationMode();
        });

        $globalNav.on("mouseleave", function(e){
            $(document).trigger("comet-collapse-global-nav-bar");
        });

        $(document).on("click", "." + globalNavBarCustomizationEnabledClass + " .comet-global-nav-bar__link", function(e){
            e.preventDefault(); // Prevent nav links from functioning when customization mode is active
        });
    }

    function toggleCustomizationMode() {
        $(document).trigger("comet-toggle-global-nav-bar-customization-mode");
        toggleSortableHandles();
    }

    function navSortStart($globalNav) {
        $(document).trigger("comet-global-nav-bar-sort-start");
    }

    function navSortStop($globalNav) {
        $(document).trigger("comet-global-nav-bar-sort-end");
        $globalNav.find(".comet-global-nav-bar__item").removeAttr("style");
        // This is where the new nav order would be saved to some persistent data layer
    }

    function toggleSortableHandles() {
        // Check for presence of class on page shell, but doesn't add or remove the class, that's the page shell's responsibility
        if ($(".comet-page-shell").hasClass(globalNavBarCustomizationEnabledClass)) {
            // Allow entire nav item to be draggable target
            enableSortableBehavior($(".comet-global-nav-bar"), false);
        } else {
            // Only allow reordering if the grip handle is clicked directly
            enableSortableBehavior($(".comet-global-nav-bar"), true);
        }
    }

    function enableSortableBehavior($globalNav, gripHandlesOnly) {
        var gripHandlesOnly = typeof gripHandlesOnly === 'undefined' ? true : gripHandlesOnly,
            sortableOptions = {
                "axis": "y",
                "containment": ".js-comet-global-nav-bar",
                "cursor": "grabbing",
                "connectWith": ".js-comet-global-nav-bar__items--sortable",
                "handle": ".comet-global-nav-bar__customize-sortable-target",
                "items": ".comet-global-nav-bar__item--draggable",
                "placeholder": "comet-global-nav-bar__item-sort-placeholder",
                "start": function(event, ui) {
                    ui.item.addClass("comet-global-nav-bar__item--sorting");
                    navSortStart($globalNav);
                },
                "stop": function(event, ui) {
                    ui.item.removeClass("comet-global-nav-bar__item--sorting");
                    navSortStop($globalNav);
                }
            },
            moreHiddenDropzoneOptions = sortableOptions;

        if (gripHandlesOnly) {
            sortableOptions.handle = ".comet-global-nav-bar__item-grip-wrap";
        }

        $globalNav.find(".ui-sortable").each(function(){
            // Unbind the sortable so it can be recreated
            $(this).sortable("destroy");
        });


        $globalNav.find(".js-comet-global-nav-bar__items--more").sortable(sortableOptions);
        $globalNav.find(".js-comet-global-nav-bar__items--primary").sortable(sortableOptions);

        // If items are moved to the "More Products & Services" dropzone when "More Products & Services" is collapsed, then append the dropped item to the end of the "More Products & Services" list
        moreHiddenDropzoneOptions.receive = function(event, ui) {
            ui.item.appendTo($(".js-comet-global-nav-bar__items--more"));
        };
        $globalNav.find(".js-comet-global-nav-bar__items--more-hidden-dropzone").sortable(moreHiddenDropzoneOptions);
    }

    var initialize = function initialize() {
        $(".js-comet-global-nav-bar").each(function(){
            setActiveState($(this));
            setEventListeners($(this));
            enableSortableBehavior($(this));
        });
    };

    var publicVars = {
        'initialize': initialize
    };

    return publicVars;
}();


$(document).ready(function(){
    'use strict';
    Comet.GlobalNavBar.initialize();
});
