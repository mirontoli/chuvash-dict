(function () {
    "use strict";

    var appView = Windows.UI.ViewManagement.ApplicationView;
    var nav = WinJS.Navigation;

    WinJS.Namespace.define("Application.models", {
        Translation: WinJS.Class.define(function() {
                
        },
            { Word: "", Explanation: "" }
        ),
        Book: WinJS.Class.define(function() {
        }, { Translations: [] })
    });
})();
