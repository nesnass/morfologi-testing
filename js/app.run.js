/// <reference path="_references.ts"/>
var MorfologiApp;
(function (MorfologiApp) {
    "use strict";
    /**
     * Application-wide overall run function
     * @param $window  Used for configuring cordova plugins options.
     * @param $location  Re-route if storage is reloaded
     */
    function runApp($window, $location) {
    }
    MorfologiApp.runApp = runApp;
    runApp.$inject = ["$window", "$location", "DataService"];
})(MorfologiApp || (MorfologiApp = {}));
//# sourceMappingURL=app.run.js.map