/// <reference path="../_references.ts"/>
/// <reference path="../models/models"/>
var MorfologiApp;
(function (MorfologiApp) {
    var Services;
    (function (Services) {
        "use strict";
        var ServerService = (function () {
            function ServerService($window, $timeout) {
                this.$window = $window;
                this.$timeout = $timeout;
            }
            ServerService.$inject = ["$window", "$timeout"];
            return ServerService;
        }());
        Services.ServerService = ServerService;
    })(Services = MorfologiApp.Services || (MorfologiApp.Services = {}));
})(MorfologiApp || (MorfologiApp = {}));
//# sourceMappingURL=serverService.js.map