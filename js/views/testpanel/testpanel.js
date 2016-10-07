/// <reference path="../../_references"/>
/// <reference path="../../models/models"/>
var MorfologiApp;
(function (MorfologiApp) {
    var Controllers;
    (function (Controllers) {
        "use strict";
        var TestPanelController = (function () {
            function TestPanelController($http, $location, $scope) {
                this.$http = $http;
                this.$location = $location;
                this.$scope = $scope;
                this.language = "";
                this.initialise();
            }
            TestPanelController.prototype.initialise = function () {
                // this.language = this.dataService.getLanguage();
            };
            TestPanelController.$inject = ['$http', '$location', '$scope'];
            return TestPanelController;
        }());
        Controllers.TestPanelController = TestPanelController;
    })(Controllers = MorfologiApp.Controllers || (MorfologiApp.Controllers = {}));
})(MorfologiApp || (MorfologiApp = {}));
//# sourceMappingURL=testpanel.js.map