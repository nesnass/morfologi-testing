/// <reference path="_references.ts"/>

module MorfologiApp {
    import ILocationService = angular.ILocationService;
    import IWindowService = angular.IWindowService;
    'use strict';

    /**
     * Application-wide overall run function
     * @param $window  Used for configuring cordova plugins options.
     * @param $location  Re-route if storage is reloaded
     * @param $state  Used to reload the state
     * @param dataService Call to storage loading check
     */
    export function runApp($window: IWindowService, $location: ILocationService) {

    }

    runApp.$inject = ["$window", "$location", 'DataService'];

}
