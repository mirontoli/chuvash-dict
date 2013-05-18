// For an introduction to the Blank template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkId=232509
(function () {
    "use strict";

    WinJS.Binding.optimizeBindingReferences = true;

    var app = WinJS.Application;
    var activation = Windows.ApplicationModel.Activation;
    var nav = WinJS.Navigation;

    app.onactivated = function (args) {
        app.words = null;
        app.wordsList = null;

        //start loading the words
        app.wordsLoaded = loadWordsAsync();

        if (args.detail.kind === activation.ActivationKind.launch) {
            if (args.detail.previousExecutionState !== activation.ApplicationExecutionState.terminated) {
                // TODO: This application has been newly launched. Initialize
                // your application here.
            } else {
                // TODO: This application has been reactivated from suspension.
                // Restore application state here.
            }
            if (app.sessionState.history) {
                nav.history = app.sessionState.history;
            }
            args.setPromise(WinJS.UI.processAll().then(function () {
                if (nav.location) {
                    nav.history.current.initialPlaceholder = true;
                    return nav.navigate(nav.location, nav.state);
                } else {
                    return nav.navigate(Application.navigator.home);
                }
            }));
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

    app.onready = function (e) {
        addSearchContract();
    };

    app.onsettings = function(e) {
        e.detail.applicationcommands = {
            // Add the Privacy statement command. 
            //http://jessefreeman.com/articles/windows-store-privacy-statement/
            //Follow the blog: http://geekswithblogs.net/comando/archive/2013/01/21/solving-the-myth-of-privacy-policy-in-javascript-windows-8.aspx
            //Example: https://github.com/gamecook/super-jetroid-starter-kit/
            priv: { title: "Privacy Policy", href: "/pages/privacy/privacy.html" }
        };
        WinJS.UI.SettingsFlyout.populateSettings(e);
    };


    function loadWordsAsync() {
        var promise = WinJS.xhr({ url: "words/words-part001.csv" });
        promise.then(function (request) {
            app.words = request.responseText.split("\r\n");
            app.wordsList = new WinJS.Binding.List(app.words)
                .createGrouped(app.utils.getGroupKey, app.utils.getGroupData, app.utils.compareGroups);
            //.createSorted(function (a, b) { return (a.toLowerCase() < b.toLowerCase() ? -1 : 1); });


        });
        return promise;
    }

    function addSearchContract() {
        var searchPane = Windows.ApplicationModel.Search.SearchPane.getForCurrentView();

        //make sure demos have been loaded and then make search terms out of their keywords
        app.wordsLoaded.then(function () {
            var keywords = app.words;

            searchPane.onsuggestionsrequested = function (e) {
                var matchingKeywords = keywords.filter(function (k) {
                     return k.toLowerCase().match(new RegExp(e.queryText));
                });
                e.request.searchSuggestionCollection.appendQuerySuggestions(matchingKeywords);
            };

            searchPane.onquerysubmitted = function (e) {
                WinJS.Navigation.navigate("/pages/home/home.html", { queryText: e.queryText });
            };

        });
    }

    app.start();
})();
