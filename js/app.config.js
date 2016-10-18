/// <reference path="_references.ts"/>
var MorfologiApp;
(function (MorfologiApp) {
    "use strict";
    /**
     * Application-wide overall configuration
     * @param $stateProvider  Used for ionic internal routing.g /reward
     * @param $urlRouterProvider  Used for defining default route.
     * @param $httpProvider  Used for registering an interceptor (TokenInterceptor).
     */
    function configApp($stateProvider, $urlRouterProvider, $httpProvider, $controllerProvider, $sceDelegateProvider, $translateProvider) {
        $stateProvider
            .state("main", {
            name: "main",
            url: "/main",
            templateUrl: "./js/views/mainpanel/mainpanel.html"
        })
            .state("tasks", {
            name: "test",
            url: "/test",
            templateUrl: "./js/views/testpanel/testpanel.html"
        });
        $urlRouterProvider.otherwise("/main");
        $httpProvider.defaults.withCredentials = true;
        $sceDelegateProvider.resourceUrlWhitelist([
            "self",
            "https://nettskjema.uio.no/**",
            "cdvfile://localhost/documents/**",
            "file:///var/**"
        ]);
        // Translation
        $translateProvider.useSanitizeValueStrategy("escaped");
        $translateProvider.useStaticFilesLoader({
            prefix: "./languages/",
            suffix: ".json"
        });
        var lang = null;
        if (navigator["languages"]) {
            lang = navigator["languages"][0];
        }
        else {
            lang = navigator.language || navigator.userLanguage;
        }
        if (lang.indexOf("nn") > -1 || lang.indexOf("nb") > -1) {
            $translateProvider.preferredLanguage("nb");
            sessionStorage["lang"] = "nb";
        }
        else {
            $translateProvider.preferredLanguage("en");
            sessionStorage["lang"] = "en";
        }
        // Force to norwegian - remove if using multiple languages
        $translateProvider.preferredLanguage("nb");
    }
    MorfologiApp.configApp = configApp;
    configApp.$inject = ["$stateProvider", "$urlRouterProvider", "$httpProvider",
        "$controllerProvider", "$sceDelegateProvider", "$translateProvider"];
})(MorfologiApp || (MorfologiApp = {}));
//# sourceMappingURL=app.config.js.map