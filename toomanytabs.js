(function ($) {
    $.fn.tooManyTabs = function (options) {

        var plugin = this;

        // default settings
        var defaults = {
            // moreTab is the element which will be shown when there is not enough space for tabs
            moreTabSelector: ".more-tab",
            // hidden tabs will be added to this drop down
            dropdownSelector: ".dropdown-menu",
            // selector for tabs which should be readjusted
            tabSelector: "li:not(.action-tab)",
            // exclude elements from tabSelector
            excludeSelector: ".action-tab:visible"
        };

        /**
         * readjustTabs method does all the logic and actual hiding/showing
         */
        plugin.readjustTabs = function () {

            // define helper elements
            plugin.$moreTab = $(plugin.config.moreTabSelector, this);
            plugin.$dropdown = $(plugin.config.dropdownSelector, this);

            // get $moreTab width and hide it, because we don't need it just yet
            var moreTabWidth = plugin.$moreTab.width();
            plugin.$moreTab.hide();

            // define $tabs
            var $tabs = $(plugin.config.tabSelector, this);

            // show all tabs
            $tabs.show();

            // calculate reserved space for other elements than tabs
            var reservedWidth = 0;
            $(plugin.config.excludeSelector, this).each(function () {
                reservedWidth += parseInt($(this).width());
            });

            // calculate width of wrapper element
            var outerWidth = $(this).width();

            // calculate available space for tabs
            var availableSpace = outerWidth - reservedWidth;

            // calculate total width of tabs
            var tabsWidth = 0;
            $tabs.each(function () {
                tabsWidth += parseInt($(this).width());
            });

            // check if there is enough space for tabs in available space
            if (tabsWidth > availableSpace) {

                // there is not enough space for all tabs, let's hide some and show them under $moreTab

                // reset moreTab
                plugin.$dropdown.html("");
                plugin.$moreTab.show();

                // reduce available space, because we need room for $moreTab
                availableSpace -= moreTabWidth;

                // hide tabs that do not fit
                $tabs.each(function () {
                    if (tabsWidth < availableSpace) {
                        // stop when enough tabs are removed
                        return false;
                    } else {

                        // reduce actual tabs width
                        tabsWidth -= $(this).width();

                        // append item to dropbox
                        plugin.addTabToDropdown($(this));

                        // hide tab
                        $(this).hide();
                    }
                });
            } else {
                // hide more tab, because there is space for all tabs
                plugin.$moreTab.hide();

                // show all tabs
                $tabs.show();
            }
        };

        /**
         * Add tab to dropdown menu (works for twitter bootstrap dropdown plugin)
         * This method can be overriden to provide custom logic
         * @param $el jQuery element to be be added to the Dropdown menu
         */
        plugin.addTabToDropdown = function ($el) {
            var $a = $el.find("a").clone();
            var $li = $("<li>").append($a);
            plugin.$dropdown.append($li);
        };

        /**
         * Bind events (resize)
         */
        plugin.bindEvents = function () {
            $(window).resize(function () {
                plugin.readjustTabs();
            });
        };

        /**
         * Main init method
         * @param options
         */
        var init = function (options) {
            plugin.config = $.extend({}, defaults, options);

            plugin.bindEvents();
            plugin.readjustTabs();
        };

        init(options);
    };
})(jQuery);
