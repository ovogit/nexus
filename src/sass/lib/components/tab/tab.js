var Comet = Comet || {};

Comet.Tab = function() {
    'use strict';
    var tabsWrapperSelector = ".comet-tabs",
        tabInputSelector = ".comet-tab__input",
        horizontalSlidingTabsSelector = ".comet-tabs--horizontal-sliding",
        stackingTabsSelector = ".comet-tabs--stacking",
        moreMenuTabsSelector = ".comet-tabs--more, .comet-tabs:not(" + horizontalSlidingTabsSelector + ", " + stackingTabsSelector + ")",
        moreMenuTabLabelSelector = ".comet-tab__label--more",
        horizontalSlidingWrapSelector = ".comet-tabs__horizontal-sliding-wrap",
        moreMenuSelector = ".comet-tabs__more-menu",
        moreMenuLinkSelector = ".comet-tabs__more-menu .comet-list-group__row-anchor",
        horizontalSlidingTabsLeftButtonSelector = ".comet-tabs__horizontal-sliding-indicator--left",
        horizontalSlidingTabsRightButtonSelector = ".comet-tabs__horizontal-sliding-indicator--right",
        tabLabelClass = "comet-tab__label",
        tabLabelSelectedClass = "comet-tab__label--selected",
        hiddenTabLabelClass = "comet-tab__label--hidden",
        moreMenuAllTabsHiddenClass = "comet-tabs--all-tabs-hidden",
        moreMenuVisibleClass = "comet-tabs--more-visible",
        moreMenuItemVisibleClass = "comet-tabs__more-menu-item--visible",
        moreMenuLabelSelectedClass = "comet-tab__label--selected",
        moreMenuItemSelectedClass = "comet-list-group__row--selected",
        horizontalSlidingTabsVisibleClass = "comet-tabs--horizontal-sliding-wrap-visible",
        horizontalSlidingTabsLeftAffordanceClass = "comet-tabs--left-sliding-affordance-visible",
        horizontalSlidingTabsRightAffordanceClass = "comet-tabs--right-sliding-affordance-visible",
        stackingTabsStackedClass = "comet-tabs--stacked";

    function getMoreMenuLabelWidth($tabs, $moreMenuLabel) {
        // Save more menu label width to DOM if it's not already
        if (typeof $tabs.attr("data-comet-more-menu-label-width") === 'undefined') {
            var moreMenuLabelWidth = $moreMenuLabel.outerWidth() + parseInt($moreMenuLabel.css("margin-left"), 10) + parseInt($moreMenuLabel.css("margin-right"), 10);
            $tabs.attr("data-comet-more-menu-label-width", moreMenuLabelWidth);
        } else {
            var moreMenuLabelWidth = $tabs.attr("data-comet-more-menu-label-width");
        }
        return moreMenuLabelWidth;
    }

    function enableAllTabsHiddenState($tabs) {
        if (!$tabs.hasClass(moreMenuAllTabsHiddenClass)) {
          $tabs.addClass(moreMenuAllTabsHiddenClass); // Add a class to the DOM to prevent this text from being constantly swapped
          swapMoreLabelForSelectedTab($tabs);
        }
    }

    function disableAllTabsHiddenState($tabs) {
        $tabs.removeClass(moreMenuAllTabsHiddenClass);
        resetMoreLabel($tabs);
    }

    function getLabelWidth($label) {
        return $label.outerWidth() + parseInt($label.css("margin-left"), 10) + parseInt($label.css("margin-right"), 10);
    }

    function addLabelToMoreMenu($label, $moreMenu) {
        var tabID = $label.attr("for");
        $label.addClass(hiddenTabLabelClass);
        $moreMenu.find("[href='#" + tabID + "']").closest(".comet-list-group__row").addClass(moreMenuItemVisibleClass);
    }

    function removeLabelFromMoreMenu($label, $moreMenu) {
        var tabID = $label.attr("for");
        $label.removeClass(hiddenTabLabelClass);
        $moreMenu.find("[href='#" + tabID + "']").closest(".comet-list-group__row").removeClass(moreMenuItemVisibleClass);
    }

    function setMoreMenuTabState($tabs) {
        var $moreMenuLabel = $tabs.find("> " + moreMenuTabLabelSelector),
            $tabLabels = $tabs.find("> ." + tabLabelClass + ":not(" + moreMenuTabLabelSelector + ")"),
            tabComponentWidth = $tabs.outerWidth(),
            marginOfError = 24,
            widthCount = 0,
            $moreMenu = $tabs.find(moreMenuSelector),
            moreMenuLabelVisible = false,
            contentTabsCount = $tabLabels.length,
            contentTabsHidden = 0,
            moreMenuLabelWidth = getMoreMenuLabelWidth($tabs, $moreMenuLabel);

        var availableWidth = tabComponentWidth - moreMenuLabelWidth - marginOfError;

        $tabLabels.each(function(index){
            var labelWidth = getLabelWidth($(this));

            widthCount += labelWidth;

            if (widthCount > availableWidth) {
                addLabelToMoreMenu($(this), $moreMenu);
                moreMenuLabelVisible = true;
                // Keep track of how many tabs have been "moved" into the menu
                contentTabsHidden++;
            } else {
                removeLabelFromMoreMenu($(this), $moreMenu);
            }
        });

        if (moreMenuLabelVisible) {
            $tabs.addClass(moreMenuVisibleClass);
        } else {
            $tabs.removeClass(moreMenuVisibleClass);
        }

        // When all tabs are hidden, default to just the "more" menu and replace the "more" text with the selected item's label. Works more like a dropdown
        if (contentTabsHidden === contentTabsCount) {
            enableAllTabsHiddenState($tabs);
        } else {
            disableAllTabsHiddenState($tabs);
        }

        setMoreMenuSelectedItem($tabs);
        setMoreMenuDropdownActiveState($tabs);
    }

    function setMoreMenuPosition($tabs) {
        var $moreMenu = $tabs.find(moreMenuSelector),
            $moreMenuLabel = $tabs.find(moreMenuTabLabelSelector),
            menuWidth = $moreMenu.outerWidth(),
            menuLabelLeftPosition = $moreMenuLabel.position().left;

        if (menuWidth > menuLabelLeftPosition) {
            $moreMenu.addClass("comet-tabs__more-menu--left-aligned");
        } else {
            $moreMenu.removeClass("comet-tabs__more-menu--left-aligned");
        }
    }

    function setMoreMenuSelectedItem($tabs) {
        var activeTabID = $tabs.find("." + tabLabelSelectedClass).attr("for"),
            $moreMenu = $tabs.find(moreMenuSelector);
        // Set "active/selected" state for more menu item
        $moreMenu.find("." + moreMenuItemSelectedClass).removeClass(moreMenuItemSelectedClass);
        $moreMenu.find("[href='#" + activeTabID + "']").closest(".comet-list-group__row").addClass(moreMenuItemSelectedClass);
    }

    function resetMoreLabel($tabs) {
        var $moreMenuLabel = $tabs.find(moreMenuTabLabelSelector),
            $moreMenuLabelTextWrap = $moreMenuLabel.find(".comet-tab__label-text--more"),
            moreMenuLabelDefaultText = $tabs.attr("data-comet-more-menu-default-label");
            $moreMenuLabelTextWrap.text(moreMenuLabelDefaultText);
    }

    function swapMoreLabelForSelectedTab($tabs) {
        var $moreMenuLabel = $tabs.find(moreMenuTabLabelSelector),
            $moreMenuLabelTextWrap = $moreMenuLabel.find(".comet-tab__label-text--more"),
            moreMenuLabelDefaultText = $moreMenuLabelTextWrap.text(),
            activeTabText = $tabs.find("." + tabLabelSelectedClass + ":not(" + moreMenuTabLabelSelector + ")").text();
        // Save more menu label text to DOM
        if (typeof $tabs.attr("data-comet-more-menu-default-label") === 'undefined') {
          $tabs.attr("data-comet-more-menu-default-label", moreMenuLabelDefaultText);
        } else {
          moreMenuLabelDefaultText = $tabs.attr("data-comet-more-menu-default-label");
        }

        $moreMenuLabelTextWrap.text(activeTabText);
    }

    function setMoreMenuDropdownActiveState($tabs) {
        var $moreMenuLabel = $tabs.find(moreMenuTabLabelSelector),
            $moreMenu = $tabs.find(moreMenuSelector);

        if ($moreMenu.find(".comet-tabs__more-menu-item--visible.comet-list-group__row--selected").length > 0) {
            $moreMenuLabel.addClass(moreMenuLabelSelectedClass);
        } else {
            $moreMenuLabel.removeClass(moreMenuLabelSelectedClass);
        }
    }

    function setMoreMenuEventListeners($tabs) {
        var $tabInputs = getTabInputs($tabs);

        $tabs.on("click", moreMenuLinkSelector, function(e){
            e.preventDefault();

            // Trigger a click on the corresponding tab label
            var tabID = $(this).attr("href").substr(1);
            $tabs.find("[for='" + tabID + "']").trigger("click");
        });

        $tabInputs.on("change", function(e){
            e.stopPropagation();
            setMoreMenuSelectedItem($tabs);

            // If only the "more" dropdown is being shown, swap the "more" label for the selected tab label
            if ($tabs.hasClass(moreMenuAllTabsHiddenClass)) {
                swapMoreLabelForSelectedTab($tabs);
            }

            // Add a highlight under the "More" Tab
            setMoreMenuDropdownActiveState($tabs);
        });
    }

    function setHorizontalSlidingEventListeners($tabs) {
        $(horizontalSlidingTabsLeftButtonSelector).on("click", function(e){
            e.preventDefault();
            scrollHorizontalTabs('left', $(this).closest(horizontalSlidingTabsSelector));
        });

        $(horizontalSlidingTabsRightButtonSelector).on("click", function(e){
            e.preventDefault();
            scrollHorizontalTabs('right', $(this).closest(horizontalSlidingTabsSelector));
        });

        $tabs.find(horizontalSlidingWrapSelector).on('scroll', function(){
            setHorizontalSlidingAffordances($(this));
        });
    }

    function tabLabelsWiderThanComponent($tabs) {
        var labelsWidth = 0,
            $labels = $tabs.find("." + tabLabelClass),
            componentWidth = $tabs.outerWidth(),
            marginOfError = 20,
            storedLabelsWidth = $tabs.attr("data-comet-tab-labels-width");

        if (typeof storedLabelsWidth === 'undefined') {
            $labels.each(function(){
                labelsWidth += $(this).outerWidth() + parseInt($(this).css("margin-left"), 10) + parseInt($(this).css("margin-right"), 10);
            });
            labelsWidth += marginOfError;
            $tabs.attr("data-comet-tab-labels-width", labelsWidth);
        } else {
            labelsWidth = storedLabelsWidth;
        }

        if (labelsWidth > componentWidth) {
            return true;
        } else {
            return false;
        }
    }

    function setHorizontalSlidingState($tabs) {
        if (tabLabelsWiderThanComponent($tabs)) {
            // Yes horizontal scrolling
            $tabs.addClass(horizontalSlidingTabsVisibleClass);
        } else {
            // No horizontal scrolling
            $tabs.removeClass(horizontalSlidingTabsVisibleClass);
        }
    }

    function prependTabLabelsToPanels($tabs) {
        $tabs.find("." + tabLabelClass).each(function(){
            var tabInputID = $(this).attr("for"),
                label = $(this).text();
            $("#" + tabInputID).next(".comet-tab__panel").prepend("<h3 class='comet-tab__panel-header'>" + label + "</h3>");
        });
    }

    function getTabInputs($tabs) {
        var tabPanelsSelector = "";
        $tabs.find("." + tabLabelClass).each(function(){
            var tabInputID = $(this).attr("for");
            tabPanelsSelector += "#" + tabInputID + ", ";
        });
        tabPanelsSelector = tabPanelsSelector.slice(0, -2);
        return $(tabPanelsSelector);
    }

    function setStackingState($tabs) {
        var $tabPanels = getTabInputs($tabs);
        if (tabLabelsWiderThanComponent($tabs)) {
            $tabs.addClass(stackingTabsStackedClass);
            $tabPanels.addClass(stackingTabsStackedClass);
        } else {
            $tabs.removeClass(stackingTabsStackedClass);
            $tabPanels.removeClass(stackingTabsStackedClass);
        }
    }

    function scrollActiveTabIntoView($tabs) {
        var $horizontalTabs = $tabs.find(horizontalSlidingWrapSelector),
            $activeTab = $horizontalTabs.find("." + tabLabelSelectedClass),
            maxScroll = $horizontalTabs[0].scrollWidth - $tabs.outerWidth(),
            scrollButtonOffset = 40,
            scrollPosition;

        if ($activeTab.length > 0) {
            var activeTabLeft = $activeTab.position().left;

            if (activeTabLeft < 0) {
                scrollPosition = 0;
            } else if (activeTabLeft > maxScroll) {
                scrollPosition = maxScroll - (scrollButtonOffset - (activeTabLeft - maxScroll));
            } else {
                scrollPosition = activeTabLeft - scrollButtonOffset;
            }

            $horizontalTabs.scrollLeft(scrollPosition);
            setHorizontalSlidingAffordances($horizontalTabs);
        }
    }

    function setHorizontalSlidingAffordances($horizontalTabs) {
        var leftScrollPosition = $horizontalTabs.scrollLeft(),
            $tabs = $horizontalTabs.closest(horizontalSlidingTabsSelector),
            maxScrollLeft = $horizontalTabs[0].scrollWidth - $horizontalTabs[0].clientWidth;

        if (leftScrollPosition > 0) {
            // Show the left scroll button
            $tabs.addClass(horizontalSlidingTabsLeftAffordanceClass);
        } else {
            $tabs.removeClass(horizontalSlidingTabsLeftAffordanceClass);
        }

        if (leftScrollPosition < maxScrollLeft) {
            // Show the right scroll button
            $tabs.addClass(horizontalSlidingTabsRightAffordanceClass);
        } else {
            $tabs.removeClass(horizontalSlidingTabsRightAffordanceClass);
        }
    }

    function scrollHorizontalTabs(direction, $tabs) {
        var $horizontalTabs = $tabs.find(horizontalSlidingWrapSelector),
            currentScrollPosition = $horizontalTabs.scrollLeft(),
            maxScrollLeft = $horizontalTabs[0].scrollWidth - $horizontalTabs[0].clientWidth,
            distance = $horizontalTabs[0].clientWidth - 80,
            newScrollPosition;

        if (direction === 'left') {
            distance = -distance;
            newScrollPosition = currentScrollPosition + distance;
            if (newScrollPosition <= 0) {
              newScrollPosition = 0;
            }
        } else {
            newScrollPosition = currentScrollPosition + distance;
            if (newScrollPosition >= maxScrollLeft) {
              newScrollPosition = maxScrollLeft;
            }
        }
        $horizontalTabs.stop().animate({ "scrollLeft": newScrollPosition}, 400);
        // $horizontalTabs.scrollLeft(newScrollPosition);
        setHorizontalSlidingAffordances($horizontalTabs);
    }

    function setActiveLabel($tabInput) {
        if ($tabInput.is(":checked")) {
            var id = $tabInput.attr("id"),
                $label = $("label[for='" + id + "']");

            $label.closest(tabsWrapperSelector).find("." + tabLabelSelectedClass).removeClass(tabLabelSelectedClass);
            $label.addClass(tabLabelSelectedClass);
        }
    };

    var refreshTabStates = function refreshTabStates() {
        $(moreMenuTabsSelector).each(function(){
            setMoreMenuTabState($(this));
            setMoreMenuPosition($(this));
        });

        $(horizontalSlidingTabsSelector).each(function(){
            setHorizontalSlidingState($(this));
            scrollActiveTabIntoView($(this));
        });

        $(stackingTabsSelector).each(function(){
            setStackingState($(this));
        });
    };

    // Update more menu tabs on window resize
    $(window).on('resize', refreshTabStates);

    var init = function init() {
        $(tabInputSelector).on("change", function(){
            setActiveLabel($(this));
            refreshTabStates();
        });

        $(tabInputSelector + ":checked").each(function(){
            setActiveLabel($(this));
        });

        $(moreMenuTabsSelector).each(function(){
            setMoreMenuTabState($(this));
            setMoreMenuEventListeners($(this));
            setMoreMenuPosition($(this));
        });

        $(horizontalSlidingTabsSelector).each(function(){
            $(this).addClass(horizontalSlidingTabsVisibleClass);
            setHorizontalSlidingState($(this));
            scrollActiveTabIntoView($(this));
            setHorizontalSlidingEventListeners($(this));
        });

        $(stackingTabsSelector).each(function(){
            prependTabLabelsToPanels($(this));
            setStackingState($(this));
        });
    };

    var publicVars = {
        'init': init,
        'refreshTabStates': refreshTabStates
    };

    return publicVars;
}();


$(document).ready(function(){
    'use strict';
    Comet.Tab.init();
});
