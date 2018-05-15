Comet.Popovers = function() {

    "use strict";

    var el;
    var $el;
    var isTooltip;
    var elTitle;
    var debouncedEls = [];  // debounce variable case of click then focus
    var nubSideLength = 12;
    var nubSpacing = 0; // space between nub and target element in px
    var nubEdgeOffset = 6; //distace offset from the edge of the tooltip
    var nubBaseLength = nubSideLength * Math.sqrt(2);
    var nubHeight = nubBaseLength / 2;
    var defaultTooltipPlacement = "top"; // default to comet-tooltip--top if no placement is specified
    var defaultPopoverPlacement = "bottom"; // default to comet-popover--bottom if no placement is specified

    var myHorizontal;  // horizontal alignment of tooltip with target element
    var myVertical;  // vertical alignment of tooltip with target element
    var atHorizontal; // horizontal position on target element tooltip is aligned with
    var atVertical; // vertical position on target element tooltip is aligned with

    var directions = ["top", "right", "bottom", "left"];

    var initialize = function(event, initializeTooltips) {
        // TODO: fix multiple initializations
        deactivateExistingPopovers(initializeTooltips);

        if (initializeTooltips) {
            // initialize tooltips only
            $('.js-comet-tooltip-trigger, *[data-comet-tooltip-text]').on("mouseenter mouseleave focus blur", triggerPopoverEvent);
        } else {
            // initialize general popovers only
            $('.js-comet-popover-trigger').each(function() {
                var isHover = $(this).data("comet-popover-event") === "hover";
                var events = isHover ? "mouseenter mouseleave" : "click focus";
                $(this).on(events, triggerPopoverEvent);
            });

            $('.comet-popover').on("show hide", handlePopoverTrigger);
            $('body').on("show hide", ".comet-tooltip__content", handlePopoverTrigger);
        }

        listenForClickAway();
        listenForEscKeyPress();
        listenForResize();
    };

    var deactivateExistingPopovers = function(initializeTooltips) {
        if (initializeTooltips) {
            $('.js-comet-tooltip-trigger, *[data-comet-tooltip-text]').off("mouseenter mouseleave focus blur"); //remove listeners if already initialized
            $('.comet-tooltip__content').remove();
        } else {
            $('.js-comet-popover-trigger').off();
        }
    };

    var triggerPopoverEvent = function(event) {
        event.stopPropagation();
        var $popover;

        isTooltip = !!$(this).data("comet-tooltip-text");
        var debounce = event.type !== "mouseenter";

        var eventOpts = {
            "el": event.currentTarget,
            "debounce": debounce
        };

        var tooltipEvents = ["mouseenter", "mouseleave", "focus", "blur"];

        if (isTooltip && tooltipEvents.indexOf(event.type) !== -1) {

            if (!tooltipHasBeenRendered(this)) {
                renderTooltip(this);
            }

            $popover = getTooltipFromTarget(this);
        } else {
            var popoverId = $(this).data("comet-popover");
            $popover = $('#' + popoverId);
            // hide any tooltips
            $(this).find('.comet-tooltip__content').trigger("hide");
        }

        if (popoverIsVisible($popover)) {
            if (isTooltip && event.type === "mouseenter" || event.type === "focus") {
                return;  //tooltips should never hide on mouseenter or focus
            }
            $popover.trigger("hide", eventOpts);
        } else {
            if (isTooltip && event.type === "mouseleave" || event.type === "blur") {
                return;  //tooltips should never show on mouseleave or blur
            }
            $popover.trigger("show", eventOpts);
        }
    };

    var handlePopoverTrigger = function(event, opts) {
        opts = opts || {};
        el = opts.el || el;
        $el = $(el);
        var debounce = opts.debounce === void 0 ? true : opts.debounce;

        setTimeout(function() {
            debouncedEls = [];
        }, 200);

        if (debouncedEls.indexOf(this) === -1) {
            // prevent this element from accepting show and hide events for 200ms
            // this allows both focus and click events to fire and the show event
            // the tooltip is shown but not hidden
            if (debounce) {
                debouncedEls.push(this);
            }

            var $popover = $(this);

            if (event.type === "hide") {
                hidePopover($popover);
            } else if (event.type === "show") {
                showPopover($popover);
            }
        }
    };

    var popoverIsVisible = function($popover) {
        return $popover.hasClass("visible");
    };

    var listenForClickAway = function() {

        $(document).on("click touchend", function(event) {
            if (!isPopover(event.target)) {
                closeAllPopups();
            }
        });
    };

    var listenForEscKeyPress = function() {
        $(document).on("keyup", function(event) {
            var escKeyCode = 27;
            if (event.which === escKeyCode) {
                closeAllPopups();
            }
        });
    };

    var listenForResize = function() {
        $(window).on('resize', debouncedResizeHandler);
    };

    var resizeHandler = function() {
        repositionPopover();
    };

    var debouncedResizeHandler = Comet.Utils.debounceFunction(resizeHandler, 200);

    var repositionPopover = function() {
        var $visiblePopover = $('.comet-popover.visible');
        var visiblePopoverId = $visiblePopover.attr("id");
        var popoverTrigger = $('[data-comet-popover="' + visiblePopoverId + '"]').get(0);

        $visiblePopover.trigger("show", { "el": popoverTrigger, "debounce": false });
    };

    var closeAllPopups = function() {
        $('.comet-popover.visible, .comet-tooltip__content.visible').trigger("hide");
    };

    var isPopover = function(clickedEl) {
        return isOrHasParent(clickedEl, "comet-popover");
    };

    var isOrHasParent = function(clickedEl, className) {
        var selector = "." + className;
        return $(clickedEl).hasClass(className) || !!$(clickedEl).closest(selector).length;
    };

    var showPopover = function($popover) {
        if (!isTooltip) {
            // hide any showing popovers
            $('.comet-popover, .comet-tooltip__content').not($popover).trigger("hide");
        }

        removeTitleAttr(); // prevent native browser tooltip

        el.offsetHeight; //Forces a redraw so the tooltip is added in its invisible state before the "visible" class is added
        $popover.addClass("visible");
        $popover.removeAttr("aria-hidden");

        var positionInfo = getPositionInfo($popover);
        positionPopover($popover, positionInfo);
    };

    var removeTitleAttr = function() {
        elTitle = "";
        elTitle = $el.attr("title");

        if (elTitle) {
            $el.attr("title", "");
        }
    };

    var hidePopover = function($popover) {
        $popover.removeClass("visible");
        $popover.attr("aria-hidden", "true");
        addTitleAttr(); // add title back for accessibility
    };

    var addTitleAttr = function() {
        if (elTitle) {
            $el.attr("title", elTitle);
        }
    };

    var tooltipHasBeenRendered = function(targetEl) {
        return !!getTooltipFromTarget(targetEl).length;
    };

    var getTooltipFromTarget = function(targetEl) {
        var tooltipId = $(targetEl).attr("aria-describedby");
        return $(targetEl).siblings("#" + tooltipId);
    };

    var renderTooltip = function(targetEl) {

        var tooltipId = generateTooltipId();

        var placementClass = "comet-tooltip__content" + getPlacementVariation(targetEl);

        $(targetEl).after('<div class="comet-tooltip__content ' + placementClass + '" id="' + tooltipId + '" role="tooltip"><span class="comet-tooltip__nub"></span><span class="comet-tooltip__text">' + $(targetEl).data("comet-tooltip-text") + '</span></div>');

        setAriaDescribedBy(targetEl, tooltipId);
    };

    var getPlacementVariation = function(targetEl) {

        var $targetEl = $(targetEl);
        var placement = getPlacement($targetEl);
        var shift = getPopoverShiftDirection($targetEl);

        placement = placement || defaultTooltipPlacement;
        var placementVariation = "--" + placement;

        if (shift) {
            placementVariation = placementVariation + "-" + shift;
        }

        return placementVariation;
    };

    var generateTooltipId = function() {
        return "tt" + Math.floor(Math.random() * 10000000000);
    };

    var setAriaDescribedBy = function(targetEl, id) {
        $(targetEl).attr("aria-describedby", id);
    };

    var getPositionInfo = function($popover) {

        var placement = getPlacement($popover);

        if (!placement) {

            var defaultClass = isTooltip ? "comet-tooltip--" + defaultTooltipPlacement : "comet-popover--" + defaultPopoverPlacement;
            $(getPlacedEl($popover)).addClass(defaultClass);
            placement = isTooltip ? defaultTooltipPlacement : defaultPopoverPlacement;
        }

        var tooltipOffset = nubHeight + nubSpacing; //shift to account for nub and spacing

        if (isVertical(placement)) {
            var horizontalPosition = "center",
                topOfMenu = flipDirection(placement) + buildOffsetString(placement, tooltipOffset),
                bottomOfTarget = placement;
            // the tooltip is above or below the target element
            myHorizontal = horizontalPosition;
            atHorizontal = horizontalPosition;
            myVertical = topOfMenu;
            atVertical = bottomOfTarget;
        } else {
            // tooltip is to the left or right of target element
            myVertical = "center";
            atVertical = "center";
            myHorizontal = flipDirection(placement) + buildOffsetString(placement, tooltipOffset);
            atHorizontal = placement;
        }

        var tooltipShiftDirection = getPopoverShiftDirection($popover);
        if (tooltipShiftDirection) {
            // Allow the popover to align with the left or right edge of the target, used by dropdown menus
            if (tooltipShiftDirection.indexOf("-aligned") !== -1) {
                horizontalPosition = tooltipShiftDirection.replace("-aligned", "");
                topOfMenu = flipDirection(placement);
                myHorizontal = horizontalPosition;
                atHorizontal = horizontalPosition;
                myVertical = topOfMenu;
            } else {
                var myAlignment = flipDirection(tooltipShiftDirection);

                var nubPlacementShift = nubEdgeOffset + nubBaseLength / 2;
                myAlignment = myAlignment + buildOffsetString(myAlignment, nubPlacementShift);

                if (isVertical(tooltipShiftDirection)) {
                    myVertical = myAlignment;
                } else {
                    myHorizontal = myAlignment;
                }
            }
        }

        // position using jQuery UI's position() function
        return {
            "my": myHorizontal + " " + myVertical,
            "at": atHorizontal + " " + atVertical,
            "of": $el,
            "collision": "cometCustomCollisionHandler",
            "using": setFinalPosition
        };
    };

    var getPlacement = function($popover) {
        var placement;

        directions.forEach(function(direction) {
            var pattern = new RegExp("comet-.*--" + direction);
            if (pattern.test(getPlacedEl($popover).className)) {
                placement = direction;
            }
        });

        return placement || null; // if no placement is specified, default to top
    };

    var getPlacedEl = function($popover) {
        // return the element that contains the positioning class
        return $popover.get(0);
    };

    var isVertical = function(direction) {
        return direction === "top" || direction === "bottom";
    };

    var isHorizontal = function(direction) {
        return direction === "left" || direction === "right";
    };

    var flipDirection = function(direction) {
        var directionOpposites = {
            "top": "bottom",
            "bottom": "top",
            "left": "right",
            "right": "left"
        };

        return directionOpposites[direction];
    };

    var buildOffsetString = function(direction, tooltipOffset) {
        //create string to set distance between tooltip and target element to  i.e. "top-20"
        var operator;

        if (direction === "top" || direction === "left") {
            operator = "-";
        } else {
            operator = "+";
        }

        return operator + tooltipOffset;
    };

    var getPopoverShiftDirection = function($popover) {
        var shiftDirection;

        directions.forEach(function(direction) {
            var pattern = new RegExp("comet-(tooltip|tooltip__content|popover)--.+-" + direction);
            if (pattern.test(getPlacedEl($popover).className)) {
                shiftDirection = direction;
            }
        });

        if (shiftDirection === 'left' || shiftDirection === 'right') {
            if ($popover.attr("class").indexOf('-aligned') !== -1) {
                shiftDirection = shiftDirection + '-aligned';
            }
        }

        return shiftDirection || null;
    };

    var positionPopover = function($popover, positionInfo) {
        // HACK: must call position twice for <span> and <a> elements
        $popover.position(positionInfo).position(positionInfo);
    };

    $.ui.position.cometCustomCollisionHandler = {
        // handling possible collision with custom code in order to detect
        // if a popover is flipped and what direction it is flipped
        // this is based off of jQueryUI's source code
        "left": function(position, data) {
            handleCollision("left", position, data);

        },
        "top": function(position, data) {
            handleCollision("top", position, data);
        }
    };

    var handleCollision = function(direction, position, data) {
        var initialPosition = position[direction];
        flipPopover(direction, position, data);
        toggleFlippedClass(initialPosition, position, data.elem, direction);
    };

    var flipPopover = function(direction, position, data) {
        $.ui.position.flip[direction](position, data);
    };

    var toggleFlippedClass = function(initialPosition, newPosition, $element, direction) {
        var flippedClass = getFlippedClassName(direction);
        var $nub = $element.find(".comet-popover__nub , .comet-tooltip__nub");
        $nub.toggleClass(flippedClass, initialPosition !== newPosition[direction]);
    };

    var getFlippedClassName = function(direction) {
        return direction === "left" ? "flipped-x" : "flipped-y";
    };

    var setFinalPosition = function(position, info) {
        var $popover = info.element.element;
        var targetEl = info.target.element.get(0);
        var placement = getPlacement($popover);
        var isVerticallyPlaced = isVertical(placement);
        var shiftDirection = getPopoverShiftDirection($popover);
        var isHorizontallyShifted = isHorizontal(shiftDirection);
        var reposition = false;

        if (isVerticallyPlaced && !isHorizontallyShifted) {
            var viewportShiftDirection = getViewportShiftDirection($popover, targetEl, isHorizontallyShifted);

            if (viewportShiftDirection) {
                addShiftedClass($popover, viewportShiftDirection);
                reposition = true;
                // reposition the popover with its new shifted class
                setTimeout(function() {
                    showPopover($popover);
                }, 0);
            }
        }

        // have to set final position manually because of position's using() callback
        if (!reposition) {
            $(this).css(position);
        }
    };

    var getViewportShiftDirection = function($popover, targetEl, isHorizontallyShifted) {
        var shiftDirection = null;

        if ($popover.offset().left < 0) {  // the tooltip overflows the left edge of viewport
            shiftDirection = "right";
        } else {
            var viewportWidth = $("html").outerWidth();
            var popoverRightEdgePosition = $popover.offset().left + $popover.outerWidth();

            if (popoverRightEdgePosition > viewportWidth) {
                shiftDirection = "left";
            }
        }

        return shiftDirection;
    };

    var addShiftedClass = function($popover, shiftDirection) {
            var positionClass = getPlacedEl($popover).className.match(/comet-(popover|tooltip|tooltip__content)--(top|bottom)/)[0];
            var shiftedClass = positionClass + "-" + shiftDirection;
            $(getPlacedEl($popover)).removeClass(positionClass)
                .addClass(shiftedClass);
    };

    // initialize tooltips by default when DOM content has loaded
    $(document).ready(initialize);

    return {
        "initialize": initialize
    };
}();

