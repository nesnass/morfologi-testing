/// <reference path="../../../js/_references"/>
/// <reference path="../../models/models"/>
/// <reference path="../../services/dataService"/>
var MorfologiApp;
(function (MorfologiApp) {
    var Controllers;
    (function (Controllers) {
        "use strict";
        var Task1Controller = (function () {
            function Task1Controller($scope, $timeout, dataService) {
                var _this = this;
                this.$scope = $scope;
                this.$timeout = $timeout;
                this.dataService = dataService;
                this.opacity = 0;
                // this.setupItems();
                $timeout(function () {
                    _this.opacity = 1;
                }, 1000);
            }
            Task1Controller.$inject = ["$scope", "$timeout", "DataService"];
            return Task1Controller;
        }());
        Controllers.Task1Controller = Task1Controller;
    })(Controllers = MorfologiApp.Controllers || (MorfologiApp.Controllers = {}));
})(MorfologiApp || (MorfologiApp = {}));
//# sourceMappingURL=controller.js.map