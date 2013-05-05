﻿(function () {
    "use strict";

    var appView = Windows.UI.ViewManagement.ApplicationView;
    var appViewState = Windows.UI.ViewManagement.ApplicationViewState;
    var nav = WinJS.Navigation;
    var ui = WinJS.UI;

    //global words var
    var words = ["hej", "hå"];

    ui.Pages.define("/pages/home/home.html", {

        ready: function (element, options) {


            exampleDataBind();

        },

        updateLayout: function () {

        }

    });
    // This function is run once on page load
    function exampleDataBind() {
        // Add WinJS Control For Listview
        var wordCloud = document.getElementById("wordCloud").winControl;
        wordCloud.template = document.getElementById("wordTemplate");
        wordCloud.loadingBehavior = "incremental";
        wordCloud.selectionMode = "single";


        // Bind datas
        WinJS.xhr({ url: "words/words-part001.csv" }).then(function (request) {
            words = request.responseText.split("\r\n");
            var listItems = new WinJS.Binding.List(words);;
            wordCloud.itemDataSource = listItems.dataSource;
            wordCloud.oniteminvoked = function (e) {
                //http://code.msdn.microsoft.com/windowsapps/Navigation-sample-cf242faa/sourcecode?fileId=44084&pathId=1713588077
                e.detail.itemPromise.then(function (item) {
                    //tmp(item.data);
                    return WinJS.Navigation.navigate("/pages/detail/detail.html", item.data);
                });
            };

        });


    }
    //WinJS.Navigation.addEventListener("navigating", function (e) {
    //    //window.location = e.detail.location;
    //    //return;
    //    WinJS.UI.Animation.exitPage().then(function () {
    //        //WinJS.Utilities.empty(elem);
    //        WinJS.UI.Pages.render(e.detail.location)
    //            .then(function () {
    //                return WinJS.UI.Animation.enterPage();
    //            });
    //    });
    //});

})();

