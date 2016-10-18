/// <reference path="../_references.ts"/>
/// <reference path="../models/models"/>

namespace MorfologiApp.Services {

    import ITimeoutService = angular.ITimeoutService;
    "use strict";
    export interface IServerService {

    }

    export class ServerService implements IServerService {
        static $inject = ["$window", "$timeout"];


        constructor(private $window: ng.IWindowService,
                    private $timeout: ITimeoutService) {

        }


    }

}
