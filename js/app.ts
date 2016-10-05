/// <reference path="_references.ts"/>
/// <reference path="app.config.ts"/>
/// <reference path="app.constants.ts"/>
/// <reference path="app.run.ts"/>
/// <reference path="models/models.ts"/>
/// <reference path="services/dataService.ts"/>
/// <reference path="services/cordovaService.ts"/>
/// <reference path="views/workpanel/workpanel.ts"/>
/// <reference path="components/zoomableoverlay/zoomableoverlay.ts"/>


/**
 * ISP core application module.
 * @preferred
 */
module ISPApp {
  'use strict';

  /**
   * Array of dependencies to be injected in the application "dependencies".
   */
  var dependencies = [
    'ionic',
    'pascalprecht.translate',
    'ngCordova',
    'ngDraggable',
    'angular-flippy'
  ];

  angular.module('ISPApp', dependencies)
        .constant('ISPConstants', ISPConstants)
        .service(ISPApp.Services)
        .directive(ISPApp.Directives)
        .controller(ISPApp.Controllers)
        .config(configApp)
        .run(runApp)
}


// Bootstrap Angular after Ionic has loaded. Ensure controllers can call services, and services can call Cordova

window['ionic'].Platform.ready(function() {
  angular.bootstrap(document, ['ISPApp']);
});