var Comet = Comet || {};

Comet.DropdownMenu = function() {
    'use strict';
    var triggerMenuVisibleClass = "comet-dropdown-trigger--menu-visible",
        baseTriggerMenuVisibleClass = triggerMenuVisibleClass,
        dropdownTriggerClass = "js-comet-dropdown-trigger";

    function isDropdownTrigger(target) {
        return $(target).hasClass(dropdownTriggerClass) || $(target).closest("." + dropdownTriggerClass).length > 0;
    };

    function setAllTriggersInactive() {
        $("." + baseTriggerMenuVisibleClass).removeClass(triggerMenuVisibleClass);
    }

    function toggleDropdownMenu($dropdownTrigger) {
        var $dropdown = $("#" + $dropdownTrigger.attr("data-comet-popover"));
        setAllTriggersInactive();

        if ($dropdown.hasClass("visible")) {
            $dropdownTrigger.removeClass(triggerMenuVisibleClass);
            $dropdown.trigger("hide");
        } else {
            $dropdownTrigger.addClass(triggerMenuVisibleClass);
            $dropdown.trigger("show", { "el": $dropdownTrigger[0] });
        }
    };

    function setEventListeners($dropdownTrigger) {
        $dropdownTrigger.on("click", function(e){
            e.preventDefault();
            toggleDropdownMenu($(this));
        });

        $(document).on("click touchend", function(event) {
            if (!isDropdownTrigger(event.target)) {
                setAllTriggersInactive();
            }
        });
    };

    var initialize = function initialize() {
        $("." + dropdownTriggerClass).each(function(){
            if ($(this).hasClass("comet-button")) {
                triggerMenuVisibleClass += " comet-button--active comet-button--hover"; //If the trigger for a dropdown is a Comet button, add the comet-button--active class while the dropdown is visible
            }
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
    Comet.DropdownMenu.initialize();
});
