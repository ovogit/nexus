Comet = Comet || {};

Comet.Utils = function() {
    "use strict";

    return {

        "debounceFunction": function(func, wait) {
            // func: function to be debounced
            // wait: debounce time in milliseconds
            var timeout = null;

            return function() {
                var later = function() {
                    timeout = null;
                    func();
                };

                var callNow = !timeout;
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);

                if (callNow) {
                    func();
                }
            };
        },

        "hasScrollBar": function(el) {
            return el.get(0).scrollHeight > el.innerHeight();
        }
    };
}();
