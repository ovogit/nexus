Comet.Tooltips = function() {

    "use strict";

    var initialize = function() {
        Comet.Popovers.initialize({}, true);
    };

    // initialize tooltips by default when DOM content has loaded
    $(document).ready(initialize);

    return {
        "initialize": initialize
    };
}();

