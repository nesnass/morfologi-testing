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
namespace MorfologiApp {
    "use strict";

    /**
     * Array of dependencies to be injected in the application "dependencies".
     */
    let dependencies = [
        "ui.router",
        "pascalprecht.translate",
        "ngDraggable",
        "angular-flippy"
    ];

    angular.module("MorfologiApp", dependencies)
        .constant("MorfologiConstants", MorfologiConstants)
        .service(MorfologiApp.Services)
        .directive(MorfologiApp.Directives)
        .controller(MorfologiApp.Controllers)
        .config(configApp)
        .run(runApp);
}