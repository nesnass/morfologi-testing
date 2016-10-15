/// <reference path="_references.ts"/>

namespace MorfologiApp {
    import ILocationService = angular.ILocationService;
    import IWindowService = angular.IWindowService;
    "use strict";

    /**
     * Application-wide overall run function
     * @param $window  Used for configuring cordova plugins options.
     * @param $location  Re-route if storage is reloaded
     */
    export function runApp($window: IWindowService, $location: ILocationService) {

    }

    runApp.$inject = ["$window", "$location", "DataService"];

}
