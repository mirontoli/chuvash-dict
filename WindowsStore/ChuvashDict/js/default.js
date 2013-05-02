// For an introduction to the Blank template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkId=232509
(function () {
    "use strict";

    WinJS.Binding.optimizeBindingReferences = true;

    var app = WinJS.Application;
    var activation = Windows.ApplicationModel.Activation;

    app.onactivated = function (args) {
        if (args.detail.kind === activation.ActivationKind.launch) {
            if (args.detail.previousExecutionState !== activation.ApplicationExecutionState.terminated) {
                // TODO: This application has been newly launched. Initialize
                // your application here.
            } else {
                // TODO: This application has been reactivated from suspension.
                // Restore application state here.
            }
            args.setPromise(WinJS.UI.processAll());
            var textSearch = document.getElementById("textSearch");
            var btnSearch = document.getElementById("btnSearch");
            var resultArea = document.getElementById("resultArea");
            btnSearch.addEventListener("click", function () {
                WinJS.xhr({ url: "http://samah.chv.su/cgi-bin/_export.cgi?id=%D1%87%C4%83%D0%B2%D0%B0%D1%88" })
                    .then(function (xhr) {
                        var s = xmlToJson(xhr.responseText);

                        resultArea.innerText = s.export.samahsem[0].samah["#text"];
                });
                
            });
        }
    };

    app.oncheckpoint = function (args) {
        // TODO: This application is about to be suspended. Save any state
        // that needs to persist across suspensions here. You might use the
        // WinJS.Application.sessionState object, which is automatically
        // saved and restored across suspension. If you need to complete an
        // asynchronous operation before your application is suspended, call
        // args.setPromise().
    };

    app.start();
})();
