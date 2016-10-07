/// <reference path="../_references.ts"/>
/// <reference path="../models/models.ts"/>

module MorfologiApp.Services {

    import ITimeoutService = angular.ITimeoutService;
    "use strict";
    export interface ICordovaService {
        /**
         * get the device ID
         * @return string
         */
        getUUID(): string;
        setStorageFilename(name: string): void;
        storageExists(setupModel: Setup, username: string, sFunc: () => void, eFunc: (error: {}) => void): void;
        getStorage(sFunc: (success: Storage) => void, eFunc: (error: {}) => void): void;
        writeStorage(storageModel: {}, sFunc: (success: {}) => void, eFunc: (error: {}) => void, backup: boolean): void;
        writeStorageBackup(storageJson: {}, sFunc: (success: {}) => void, eFunc: (error: {}) => void): void;

        getFreeDiskSpace(sFunc: (success: string) => void, eFunc: (error) => void): void;
        clearStorage(): void;

        startTrackingRecording(filename): void;
        stopTrackingRecording(filename): void;
        getTrackingAudioFile(filename: string, sFunc: (file: File) => void, eFunc: (message: string) => void): void;
        deleteOldAudioFiles(mediaFiles: string[], trackingFiles: string[], lifespan: number): void;

        captureVideo(sFunc: (videoData) => void, eFunc: (error) => void, filename: string): void;
        // getVideoFile(source: string): Media;
        checkFile(filename: string, sFunc: (videoData) => void, eFunc: (error) => void): void;

        startCaptureAudio(taskFilename: string, sFunc: (videoData) => void, eFunc: (error) => void): void;
        stopCaptureAudio(taskFilename: string, usageFilename: UsageStorage, newTrackingAudioFilename: string, sFunc: (videoData) => void, eFunc: (error) => void): void;

        removeFile(path: string, filename: string, sFunc: (videoData) => void, eFunc: (error) => void);

        getDeviceID(): string;
        getAppVersion(callback: (version) => void): void;
    }

    export class CordovaService implements ICordovaService {
        static $inject = ['$window', '$timeout'];

        private storageFileName: string;
        private audioFile: Media;
        private day3AudioFile: Media;
        private desktopBrowserTesting: boolean;
        private desktopBrowserStorage: Storage;
        private recordingAttempts: number = 0;
        private recordingTimer: number;
        private day3RecordingTimer: number;

        constructor(private $window: ng.IWindowService, private $timeout: ITimeoutService) {

            // If using a desktop browser, we will set up storage in memory for testing purposes
            this.desktopBrowserTesting = !$window.cordova;
            this.desktopBrowserStorage = null;
            this.recordingTimer = 0;

            if (!this.desktopBrowserTesting) {
                this.createTrackingDirectory();
            }
        }

        getUUID(): string {
            return '';
        }

        setStorageFilename(name: string) {

        }

        /**
         * Check for the existance of the Storage, if not initialise it and call writeStorage
         *
         * @param setupModel
         * @param username
         * @param sFunc
         * @param eFunc
         */
        storageExists(setupModel, username, sFunc, eFunc): void {

        }

        getStorage(sFunc, eFunc): void {

        }

        writeStorage(storageModel, sFunc, eFunc, backup): void {

        }

        writeStorageBackup(jsonifiedStorage, sFunc, eFunc): void {

        }

        getFreeDiskSpace(sFunc, eFunc): void {

        }

        clearStorage(): void {

        }

        captureVideo(sFunc, eFunc, filename) {

        }

        startTrackingRecording(filename: string) {

        }

        stopTrackingRecording(filename: string): void {

        }

        // Retrieve a Tracking audio file for use as 'blob' to send to Nettskjema
        getTrackingAudioFile(filename, sFunc, eFunc): void {

        }

        checkFile(filename: string, sFunc, eFunc) {

        }

        deleteOldAudioFiles(mediaList: string[], trackingList: string[], lifespan: number): void {

        }

        removeFile(path, filename, sFunc, eFunc): void {

        }

        createTrackingDirectory() {

        }

        startCaptureAudio(taskFilename: string, sFunc, eFunc) {

        }

        stopCaptureAudio(taskFilename: string, currentUsage: UsageStorage, newTrackingAudioFilename: string, sFunc, eFunc): void {

        }

        getDeviceID(): string {
          return '';
        }

        getAppVersion(callback): void {

        }

    }

}
