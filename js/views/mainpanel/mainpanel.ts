/// <reference path="../../_references"/>
/// <reference path="../../models/models"/>

namespace MorfologiApp.Controllers {
    import ILocationService = angular.ILocationService;
    import IScope = angular.IScope;

    "use strict";

    export class MainPanelController {
        static $inject = ["$http", "$location", "$scope"];

        private language = "";
        private taskTemplateUrl: string;

        constructor( private $http: ng.IHttpService,
                     private $location: ILocationService,
                     private $scope: IScope) {

            this.initialise();
        }

        initialise() {
           // this.language = this.dataService.getLanguage();
        }

        selectTask(taskType) {
            this.taskTemplateUrl = "js/tasks/task" + taskType + "/template.html";
        }

    }
}
