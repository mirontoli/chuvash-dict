(function () {
    "use strict";
    var app = WinJS.Application;
    
    //The four additional Chuvash letters are sorted wrong, because
    //there is no definition for their order
    //All groups are upper case
    //the lower case letters have automatically higher "code"
    //To sort, we have to fake those characters
    //Ccedilla -> c, Abreve -> a, Yuml -> y, Ebreve -> e
    function fakeLetterIfNeeded(letter) {
        switch(letter) {
            case "Ç":
                return "с";
            case "Ӳ":
                return "у";
            case "Ĕ":
                return "е";
            case "Ă":
                return "а";
            default:
                return letter;
        }
    }

    app.utils = app.utils || {};
    app.utils.getGroupKey = function (w) {
        return w ? w.slice(0, 1).toUpperCase() : "";
    };
    app.utils.getGroupData = function (w) {
        return w ? w.slice(0, 1).toUpperCase() : "";
    };
    app.utils.compareGroups = function (left, right) {
        if (left === right) {
            return 0;
        }
        left = fakeLetterIfNeeded(left);
        right = fakeLetterIfNeeded(right);
        return left.toUpperCase().charCodeAt(0) - right.toUpperCase().charCodeAt(0);
    };
})();