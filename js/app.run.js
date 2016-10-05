/// <reference path="_references.ts"/>
/// <reference path="services/dataService.ts"/>
var ISPApp;
(function (ISPApp) {
    'use strict';
    /**
     * Application-wide overall run function
     * @param $ionicPlatform  Used to detect when the ionic platform is ready.
     * @param $window  Used for configuring cordova plugins options.
     * @param $location  Re-route if storage is reloaded
     * @param $ionicPopup  Used to show a popup with a statsus message.
     * @param $state  Used to reload the state
     * @param dataService Call to storage loading check
     */
    function runApp($ionicPlatform, $window, $location, $ionicPopup, $state, dataService) {
        $ionicPlatform.ready(function () {
            if ($window.cordova && $window.cordova.plugins['Keyboard']) {
            }
            if ($window.StatusBar) {
            }
            $location.path("/home/");
        });
        // Check that we are using the correct storage file
        $ionicPlatform.on("resume", function (event) {
            dataService.checkStorageAndSetup(function (return_to_home) {
                if (return_to_home) {
                    if ($state.is('main')) {
                        $state.reload();
                    }
                    $location.path("/home/");
                }
            });
        });
        //intercept the click on the hardware back button on android devices
        $ionicPlatform.registerBackButtonAction(function (event) {
            if (true) {
                $ionicPopup.confirm({
                    title: 'ISP System Warning',
                    template: 'Are you sure you want to exit the application? Note that your current active visitors or incomplete surveys will be lost.'
                }).then(function (res) {
                    if (res) {
                        ionic.Platform.exitApp();
                    }
                });
            }
        }, 100);
    }
    ISPApp.runApp = runApp;
    runApp.$inject = ["$ionicPlatform", "$window", "$location", "$ionicPopup", "$state", 'DataService'];
})(ISPApp || (ISPApp = {}));
//# sourceMappingURL=app.run.js.map