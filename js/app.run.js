/// <reference path="_references.ts"/>
var MorfologiApp;
(function (MorfologiApp) {
    'use strict';
    /**
     * Application-wide overall run function
     * @param $window  Used for configuring cordova plugins options.
     * @param $location  Re-route if storage is reloaded
     * @param $state  Used to reload the state
     * @param dataService Call to storage loading check
     */
    function runApp($window, $location) {
    }
    MorfologiApp.runApp = runApp;
    runApp.$inject = ["$window", "$location", 'DataService'];
})(MorfologiApp || (MorfologiApp = {}));
//# sourceMappingURL=app.run.js.map