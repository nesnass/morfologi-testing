/// <reference path="_references"/>
/// <reference path="./app.config.ts"/>
/// <reference path="./app.constants.ts"/>
/// <reference path="./app.run.ts"/>
/// <reference path="components/resizewindow/resize"/>
/// <reference path="tasks/task1/controller"/>
/**
 * Morfologi core application module.
 * @preferred
 */
var MorfologiApp;
(function (MorfologiApp) {
    "use strict";
    /**
     * Array of dependencies to be injected in the application "dependencies".
     */
    var dependencies = [
        "ui.router",
        "pascalprecht.translate",
        "ngDraggable",
        "angular-flippy"
    ];
    angular.module("MorfologiApp", dependencies)
        .constant("MorfologiConstants", MorfologiApp.MorfologiConstants)
        .service(MorfologiApp.Services)
        .directive(MorfologiApp.Directives)
        .controller(MorfologiApp.Controllers)
        .config(MorfologiApp.configApp)
        .run(MorfologiApp.runApp);
})(MorfologiApp || (MorfologiApp = {}));
//# sourceMappingURL=app.js.map