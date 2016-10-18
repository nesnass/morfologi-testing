/// <reference path="../../_references"/>
/// <reference path="../../models/models"/>
var MorfologiApp;
(function (MorfologiApp) {
    var Controllers;
    (function (Controllers) {
        "use strict";
        var MainPanelController = (function () {
            function MainPanelController($http, $location, $scope) {
                this.$http = $http;
                this.$location = $location;
                this.$scope = $scope;
                this.language = "";
                this.initialise();
            }
            MainPanelController.prototype.initialise = function () {
                // this.language = this.dataService.getLanguage();
            };
            MainPanelController.prototype.selectTask = function (taskType) {
                this.taskTemplateUrl = "js/tasks/task" + taskType + "/template.html";
            };
            MainPanelController.$inject = ["$http", "$location", "$scope"];
            return MainPanelController;
        }());
        Controllers.MainPanelController = MainPanelController;
    })(Controllers = MorfologiApp.Controllers || (MorfologiApp.Controllers = {}));
})(MorfologiApp || (MorfologiApp = {}));
//# sourceMappingURL=mainpanel.js.map