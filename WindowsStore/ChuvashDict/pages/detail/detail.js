(function () {
    "use strict";

    var appView = Windows.UI.ViewManagement.ApplicationView;
    var appViewState = Windows.UI.ViewManagement.ApplicationViewState;
    var nav = WinJS.Navigation;
    var ui = WinJS.UI;

    var progressElement;
    
    WinJS.UI.Pages.define("/pages/detail/detail.html", {
        // This function is called whenever a user navigates to this page. It
        // populates the page elements with the app's data.
        ready: function (element, options) {
            var word = nav.state;
            updateTitle(word);
            getTranslation(word);
        }
    });
    
    function updateTitle(word) {
        var titleElement = document.querySelector(".detail .pagetitle");
        if (word && titleElement) {

            titleElement.innerText = word;
        }
    }
    function getTranslation(word) {
        showLoading(true);
        var k = encodeURI("http://samah.chv.su/cgi-bin/_export.cgi?id=" + word);
        WinJS.xhr({ url: k })
            .then(function (xhr) {
                var s = xmlToJson(xhr.responseText);
                var t = JSON.stringify(s.export);
                showLoading(false);
                //var result = s.export.samahsem[0].samah["#text"];
            });
    }
    
    function showLoading(visible) {
        progressElement = progressElement || document.querySelector(".detail progress");
        progressElement.style.display = visible ? "block" : "none";
    }

})();
