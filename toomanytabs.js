(function ($) {
    var reservedWidth = 0;
    var tabsWidth = 0;
    var $tabs;
    $.fn.tooManyTabs = function (options) {

        var plugin = this;

        // default settings
        var defaults = {
            // moreTab is the element which will be shown when there is not enough space for tabs
            moreTabSelector: ".more-tab",
            // hidden tabs will be added to this drop down
            dropdownSelector: ".more-tab .dropdown-menu",
            // selector for tabs which should be readjusted
            tabSelector: "ul.nav-tabs>li:not(.action-tab)",
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

            // restore tabs
            plugin.$dropdown.find("li")
              .insertBefore($(plugin.config.moreTabSelector));

            // calculate total width of tabs
            tabsWidth = 0;

            // @fixme poor performance, fix this
            $tabs.each(function () {
                tabsWidth += parseInt($(this).width());
            });

            // calculate width of wrapper element
            var outerWidth = $(this).width();

            // calculate available space for tabs
            var availableSpace = outerWidth - reservedWidth;

            // check if there is enough space for tabs in available space
            if (tabsWidth > availableSpace) {

                // there is not enough space for all tabs,
                // let's hide some and show them under $moreTab

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
                        // $(this).hide();
                    }
                });
            } else {
                // hide more tab, because there is space for all tabs
                plugin.$moreTab.hide();

                // restore tabs
                plugin.$dropdown.find("li")
                  .insertBefore($(plugin.config.moreTabSelector));
            }
        };

        /**
         * Add tab to dropdown menu (works for twitter bootstrap dropdown plugin)
         * This method can be overriden to provide custom logic
         * @param $el jQuery element to be be added to the Dropdown menu
         */
        plugin.addTabToDropdown = function ($el) {
            $el.appendTo(plugin.config.dropdownSelector);
        };

        /**
         * Bind events (resize)
         */
        plugin.bindEvents = function () {
            var rt;
            $(window).resize(function () {

                // clear resize timeout
                clearTimeout(rt);

                // readjusting tabs on every resize event is very costly
                // performance wise so we are adding 500ms timeout
                rt = setTimeout(function () {
                    // readjust tabs only if there is no resize event for more
                    // than 500ms
                    plugin.readjustTabs();
                }, 500);
            });
        };

        /**
         * Main init method
         * @param options
         */
        var init = function (options) {
            plugin.config = $.extend({}, defaults, options);

            // define $tabs and reverse them, because we want to start hiding from the right side
            $tabs = $($(plugin.config.tabSelector).get().reverse());

            // calculate reserved space for other elements than tabs
            reservedWidth = 0;
            $(plugin.config.excludeSelector).each(function () {
                reservedWidth += parseInt($(this).width());
            });

            // calculate total width of tabs
            tabsWidth = 0;
            $tabs.each(function () {
                tabsWidth += parseInt($(this).width());
            });

            plugin.bindEvents();
            plugin.readjustTabs();
        };

        init(options);
    };
})(jQuery);
