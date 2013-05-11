(function () {
    "use strict";
    
    var app = WinJS.Application;
    var appView = Windows.UI.ViewManagement.ApplicationView;
    var appViewState = Windows.UI.ViewManagement.ApplicationViewState;
    var nav = WinJS.Navigation;
    var ui = WinJS.UI;

    //global words var
    var words = ["hej", "hå"];
    var wordCloud;

    ui.Pages.define("/pages/home/home.html", {

        ready: function (element, options) {
            wordCloud = document.getElementById("wordCloud").winControl;
            wordCloud.onloadingstatechanged = function() {
                if (app.sessionState.homeScrollPosition && wordCloud.loadingState == "viewPortLoaded") {
                    wordCloud.scrollPosition = app.sessionState.homeScrollPosition;
                    app.sessionState.homeScrollPosition = null;
                }
            };
            bindWordCloud();           

        },

        updateLayout: function () {

        },
        unload: function () {
            //http://www.codefoster.com/post/2013/01/08/loadingstates
            //Remember the scroll position of the listview
            app.sessionState.homeScrollPosition = wordCloud.scrollPosition;
        }

    });
    // This function is run once on page load
    function bindWordCloud() {
        // Add WinJS Control For Listview
        wordCloud.template = document.getElementById("wordTemplate");
        wordCloud.loadingBehavior = "incremental";
        wordCloud.selectionMode = "single";


        // Bind datas
        WinJS.xhr({ url: "words/words.csv" }).then(function (request) {
            words = request.responseText.split("\r\n");
            var listItems = new WinJS.Binding.List(words);;
            wordCloud.itemDataSource = listItems.dataSource;
            wordCloud.oniteminvoked = function (e) {
                //http://code.msdn.microsoft.com/windowsapps/Navigation-sample-cf242faa/sourcecode?fileId=44084&pathId=1713588077
                e.detail.itemPromise.then(function (item) {
                    return WinJS.Navigation.navigate("/pages/detail/detail.html", item.data);
                });
            };
        });


    }

})();

