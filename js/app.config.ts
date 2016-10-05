/// <reference path="_references.ts"/>

module ISPApp {
    'use strict';

    /**
     * Application-wide overall configuration
     * @param $stateProvider  Used for ionic internal routing.g /reward
     * @param $urlRouterProvider  Used for defining default route.
     * @param $httpProvider  Used for registering an interceptor (TokenInterceptor).
     * @param $ionicConfigProvider  Used for defining view transitions.
     */
    export function configApp($stateProvider: ng.ui.IStateProvider, $urlRouterProvider: ng.ui.IUrlRouterProvider,
                              $httpProvider: ng.IHttpProvider, $ionicConfigProvider: ionic.utility.IonicConfigProvider,
                              $controllerProvider: ng.IControllerProvider, $sceDelegateProvider: ng.ISCEDelegateProvider,
                              $translateProvider: angular.translate.ITranslateProvider ) {

        //define routing
        $stateProvider
            .state('tasks', {
                url: '/tasks',
                templateUrl: './js/views/workpanel/workpanel.html'
            })
            .state('reward', {
                url: '/reward',
                templateUrl: './js/views/rewardpanel/rewardpanel.html',
            })
            .state('book', {
                url: '/book',
                templateUrl: './js/views/picturebook/picturebook.html'
            })
            .state('main', {
                url: '/home/:week',
                templateUrl: './js/views/mainpanel/mainpanel.html'
            });

        //set default route
        $urlRouterProvider.otherwise('/home/');

        //we can decide to enable the transitions if the app still performs well
        $ionicConfigProvider.views.transition('platform');
        $ionicConfigProvider.views.maxCache(10);
        $ionicConfigProvider.views.swipeBackEnabled(false);

        $httpProvider.defaults.withCredentials = true;

        $sceDelegateProvider.resourceUrlWhitelist([
            'self',
            'https://nettskjema.uio.no/**',
            'cdvfile://localhost/documents/**',
            'file:///var/**'
        ]);


        // Translation
        $translateProvider.useSanitizeValueStrategy('escaped');
        $translateProvider.useStaticFilesLoader({
            prefix: './languages/',
            suffix: '.json'
        });

        var lang = null;
        if (navigator['languages']) {
            lang = navigator['languages'][0];
        } else {
            lang = navigator.language || navigator.userLanguage;
        }

        if (lang.indexOf('nn') > -1 || lang.indexOf('nb') > -1) {
            $translateProvider.preferredLanguage('nb');
            sessionStorage['lang'] = 'nb';
        } else {
            $translateProvider.preferredLanguage('en');
            sessionStorage['lang'] = 'en';
        }

        // Force to norwegian - remove if using multiple languages
        $translateProvider.preferredLanguage('nb');

    }

    configApp.$inject = ["$stateProvider", "$urlRouterProvider", "$httpProvider", "$ionicConfigProvider",
            "$controllerProvider", "$sceDelegateProvider", "$translateProvider"];

}
