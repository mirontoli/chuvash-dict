(function () {
    "use strict";
    
    var app = WinJS.Application;
    var appView = Windows.UI.ViewManagement.ApplicationView;
    var appViewState = Windows.UI.ViewManagement.ApplicationViewState;
    var nav = WinJS.Navigation;
    var ui = WinJS.UI;
    var transfer = Windows.ApplicationModel.DataTransfer;

    //global words var
    var words = app.words;
    var wordCloud;
    var options;

    ui.Pages.define("/pages/home/home.html", {

        ready: function (element, o) {
            options = o || {};
            wordCloud = document.getElementById("wordCloud").winControl;
            wordCloud.onloadingstatechanged = function() {
                if (app.sessionState.homeScrollPosition && wordCloud.loadingState == "viewPortLoaded") {
                    wordCloud.scrollPosition = app.sessionState.homeScrollPosition;
                    app.sessionState.homeScrollPosition = null;
                }
            };
            bindWordCloud();           
            addShareContract();
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
        wordCloud.itemTemplate = document.getElementById("wordTemplate");
        //wordCloud.itemHeaderTemplate = document.getElementById("headerTemplate");
        //wordCloud.loadingBehavior = "incremental";
        wordCloud.selectionMode = "single";
        wordCloud.oniteminvoked = function (e) {
            //http://code.msdn.microsoft.com/windowsapps/Navigation-sample-cf242faa/sourcecode?fileId=44084&pathId=1713588077
            e.detail.itemPromise.then(function (item) {
                return WinJS.Navigation.navigate("/pages/detail/detail.html", item.data);
            });
        };

        app.wordsLoaded.then(function() {
            var wordsList = !options.queryText ? app.wordsList : app.wordsList.createFiltered(function(k) {
                return k.toLowerCase().match(new RegExp(options.queryText));
            });
            wordCloud.itemDataSource = wordsList.dataSource;
            wordCloud.groupDataSource = wordsList.groups.dataSource;
        });


    }
    function addShareContract() {
        //http://msdn.microsoft.com/en-us/library/windows/apps/hh758310.aspx
        transfer.DataTransferManager.getForCurrentView().ondatarequested = function (e) {
            var html = "<div><h1><a href='http://bit.ly/ZQ2fDM'>Chuvash Dictionary</a></h1>Chuvash to Russian and Russian to Chuvash. In the future it can be extended to more languages. Traditionally the most dictionaries are Chuvash-Russian. It doesn't mean it is only useful for Russian speaking people. If you are intrested in Chuvash, for now you must use Russian. In the future, other dictionary sources will be added.</div>";
            var htmlFormat = transfer.HtmlFormatHelper.createHtmlFormat(html);
            e.request.data.setHtmlFormat(htmlFormat);
            e.request.data.properties.title = "Check out the Chuvash Dictionary, windows 8 app http://bit.ly/ZQ2fDM";
        };
    }
})();

