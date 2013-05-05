(function () {
    "use strict";

    var appView = Windows.UI.ViewManagement.ApplicationView;
    var nav = WinJS.Navigation;

    WinJS.Namespace.define("Application.models", {
        Translation: WinJS.Class.define(function(word, explanation) {
            this.word = word;
            this.explanation = explanation;
        },
            { word: "", explanation: "" }
        ),
        Book: WinJS.Class.define(function() {
        }, { translations: [] })
    });
})();
