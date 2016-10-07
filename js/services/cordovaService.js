/// <reference path="../_references.ts"/>
/// <reference path="../models/models.ts"/>
var MorfologiApp;
(function (MorfologiApp) {
    var Services;
    (function (Services) {
        "use strict";
        var CordovaService = (function () {
            function CordovaService($window, $timeout) {
                this.$window = $window;
                this.$timeout = $timeout;
                this.recordingAttempts = 0;
                // If using a desktop browser, we will set up storage in memory for testing purposes
                this.desktopBrowserTesting = !$window.cordova;
                this.desktopBrowserStorage = null;
                this.recordingTimer = 0;
                if (!this.desktopBrowserTesting) {
                    this.createTrackingDirectory();
                }
            }
            CordovaService.prototype.getUUID = function () {
                return '';
            };
            CordovaService.prototype.setStorageFilename = function (name) {
            };
            /**
             * Check for the existance of the Storage, if not initialise it and call writeStorage
             *
             * @param setupModel
             * @param username
             * @param sFunc
             * @param eFunc
             */
            CordovaService.prototype.storageExists = function (setupModel, username, sFunc, eFunc) {
            };
            CordovaService.prototype.getStorage = function (sFunc, eFunc) {
            };
            CordovaService.prototype.writeStorage = function (storageModel, sFunc, eFunc, backup) {
            };
            CordovaService.prototype.writeStorageBackup = function (jsonifiedStorage, sFunc, eFunc) {
            };
            CordovaService.prototype.getFreeDiskSpace = function (sFunc, eFunc) {
            };
            CordovaService.prototype.clearStorage = function () {
            };
            CordovaService.prototype.captureVideo = function (sFunc, eFunc, filename) {
            };
            CordovaService.prototype.startTrackingRecording = function (filename) {
            };
            CordovaService.prototype.stopTrackingRecording = function (filename) {
            };
            // Retrieve a Tracking audio file for use as 'blob' to send to Nettskjema
            CordovaService.prototype.getTrackingAudioFile = function (filename, sFunc, eFunc) {
            };
            CordovaService.prototype.checkFile = function (filename, sFunc, eFunc) {
            };
            CordovaService.prototype.deleteOldAudioFiles = function (mediaList, trackingList, lifespan) {
            };
            CordovaService.prototype.removeFile = function (path, filename, sFunc, eFunc) {
            };
            CordovaService.prototype.createTrackingDirectory = function () {
            };
            CordovaService.prototype.startCaptureAudio = function (taskFilename, sFunc, eFunc) {
            };
            CordovaService.prototype.stopCaptureAudio = function (taskFilename, currentUsage, newTrackingAudioFilename, sFunc, eFunc) {
            };
            CordovaService.prototype.getDeviceID = function () {
                return '';
            };
            CordovaService.prototype.getAppVersion = function (callback) {
            };
            CordovaService.$inject = ['$window', '$timeout'];
            return CordovaService;
        }());
        Services.CordovaService = CordovaService;
    })(Services = MorfologiApp.Services || (MorfologiApp.Services = {}));
})(MorfologiApp || (MorfologiApp = {}));
//# sourceMappingURL=cordovaService.js.map