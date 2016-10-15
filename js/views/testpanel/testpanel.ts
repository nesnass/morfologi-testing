/// <reference path="../../_references"/>
/// <reference path="../../models/models"/>

namespace MorfologiApp.Controllers {
    import ILocationService = angular.ILocationService;
    import IScope = angular.IScope;

    "use strict";

    export class TestPanelController {
        static $inject = ["$http", "$location", "$scope"];

        private language = "";

        constructor( private $http: ng.IHttpService,
                     private $location: ILocationService,
                     private $scope: IScope) {

            this.initialise();
        }

        initialise() {
           // this.language = this.dataService.getLanguage();
        }

    }
}
