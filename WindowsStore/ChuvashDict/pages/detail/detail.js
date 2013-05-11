(function () {
    "use strict";

    var appView = Windows.UI.ViewManagement.ApplicationView;
    var appViewState = Windows.UI.ViewManagement.ApplicationViewState;
    var nav = WinJS.Navigation;
    var ui = WinJS.UI;
    var transfer = Windows.ApplicationModel.DataTransfer;

    var progressElement;
    var explanationList;
    var word;
    
    WinJS.UI.Pages.define("/pages/detail/detail.html", {
        // This function is called whenever a user navigates to this page. It
        // populates the page elements with the app's data.
        ready: function (element, options) {
            word = nav.state;
            explanationList = document.getElementById("explanationList");
            updateTitle();
            getTranslation();
            addShareContract();
        }
    });
    
    function updateTitle() {
        var titleElement = document.querySelector(".detail .pagetitle");
        if (word && titleElement) {

            titleElement.innerText = word;
        }
    }
    function getTranslation() {
        showLoading(true);
        var k = encodeURI("http://samah.chv.su/cgi-bin/_export.cgi?id=" + word);
        WinJS.xhr({ url: k })
            .then(function (xhr) {
                showLoading(false);
                var s = xmlToJson(xhr.responseText);
                if (!s.export) {
                    showError("The result from samah.chv.su could not be read");
                }
                else if (s.export.error && s.export.error["#text"]) {
                    var error = s.export.error["#text"];
                    if (error === "--Not Found-") {
                        showError("Oops, samah.chv.su says there is no such word!");
                    } else {
                        showError("Hmpf. We've got an error from samah.chv.su. The code is: " + error);
                    }
                } else if (s.export.samahsem) {
                    showResult(s.export.samahsem);
                }
                
            }, function (error) {
                showLoading(false);
                showError("Some error occured in the transmission of the data");
            });
    }
    
    function showLoading(visible) {
        progressElement = progressElement || document.querySelector(".detail progress");
        progressElement.style.display = visible ? "block" : "none";
    }

    function showError(msg) {
        var errorElement = document.querySelector("#error-section");
        WinJS.Utilities.removeClass(errorElement, "win-hidden");
        errorElement.innerText = msg;
    }
    function showResult(rawWords) {
        if (!Array.isArray(rawWords)) {
            rawWords = [rawWords];
        }
        var translations = [];
        var len = rawWords.length;
        var i = 0;
        for (i; i < len; i++) {
            translations.push(new Application.models.Translation(rawWords[i].samah["#text"], rawWords[i].anla["#text"]));
        }
        bindExplanationList(translations);
    }
    // This function is run once on page load
    function bindExplanationList(translations) {
        var explanationHtml = "";
        translations.forEach(function (t) {
            var html = '<div class="explanation">' + t.explanation + '</div>';
            explanationHtml += html;
        });
        WinJS.Binding.processAll(explanationList, explanationHtml);
    }
    
    function addShareContract() {
        //http://msdn.microsoft.com/en-us/library/windows/apps/hh758310.aspx
        transfer.DataTransferManager.getForCurrentView().ondatarequested = function (e) {
            var html = explanationList.innerHTML;
            var url = "http://samah.chv.su/cgi-bin/s.cgi?a=s&word=" + word;
            var appUrl = "http://apps.microsoft.com/windows/en-US/app/a004715c-768c-4f54-b38c-31f8f0ae4a69";
            html += "<br><br>This word (<a href=" + url + "'>" + word +  "</a>) is shared through <a href='" + appUrl + "'>Chuvash Dictionary</a>, a Windows 8 app";
            var htmlFormat = transfer.HtmlFormatHelper.createHtmlFormat(html);
            e.request.data.setHtmlFormat(htmlFormat);
            e.request.data.properties.title = "Chuvash Dictionary: " + word + " " + url; 
        };
    }
})();
