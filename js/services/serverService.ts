/// <reference path="../_references.ts"/>
/// <reference path="../models/models"/>

module MorfologiApp.Services {

    import ITimeoutService = angular.ITimeoutService;
    "use strict";
    export interface IServerService {

    }

    export class ServerService implements IServerService {
        static $inject = ['$window', '$timeout'];

        private storageFileName: string;
        private audioFile: Media;
        private day3AudioFile: Media;
        private desktopBrowserTesting: boolean;
        private desktopBrowserStorage: Storage;
        private recordingAttempts: number = 0;
        private recordingTimer: number;
        private day3RecordingTimer: number;

        constructor(private $window: ng.IWindowService,
                    private $cordovaDevice: any,
                    private $cordovaFile: any,
                    private $cordovaCapture: any,
                    private $cordovaMedia: any,
                    private $cordovaAppVersion: any,
                    private $timeout: ITimeoutService) {

            // If using a desktop browser, we will set up storage in memory for testing purposes
            this.desktopBrowserTesting = !$window.cordova;
            this.desktopBrowserStorage = null;
            this.recordingTimer = 0;

            if (!this.desktopBrowserTesting) {
                this.createTrackingDirectory();
            }
        }

        getUUID(): string {
            if (this.$window.cordova !== undefined) {
                return this.$cordovaDevice.getUUID();
            } else {
                return 'No mobile device';
            }
        }

        setStorageFilename(name: string) {
            this.storageFileName = name;
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
            if (this.desktopBrowserTesting) {
                if (this.desktopBrowserStorage === null || (this.desktopBrowserStorage.hasOwnProperty('pseudoFilename')
                    && this.desktopBrowserStorage['pseudoFilename'] !== this.storageFileName)) {     // Storage does not exist yet, create it
                        var newStorage = new Storage().initialise(setupModel, username);
                        this.writeStorage(newStorage, sFunc, eFunc, false);
                } else {
                    if(sFunc !== null) {
                        sFunc();
                    }
                }
            } else {
                this.$cordovaFile.checkFile(cordova.file.documentsDirectory, this.storageFileName)
                    .then(() => {
                        if(sFunc !== null) {
                            sFunc();
                        }
                    }, () => {        // Storage does not exist yet, create it
                        this.writeStorage(new Storage().initialise(setupModel, username), sFunc, eFunc, false);
                    });
            }
        }

        getStorage(sFunc, eFunc): void {
            if (this.desktopBrowserTesting) {
                sFunc(this.desktopBrowserStorage);
            } else {
                this.$cordovaFile.readAsText(cordova.file.documentsDirectory, this.storageFileName)
                    .then((success) => {

                        // Sometimes the cordova writefile routine appends rather than overwites, need to check for this problem..
                        var cleanedData, endIndex, deJson, newStorage;
                        endIndex = success.lastIndexOf('\{"weeks"\:\[');
                        if (endIndex !== 0) {
                            console.log('Data was corrupted - index was: ' + endIndex);
                            cleanedData = success.substr(0, endIndex);
                        } else {
                            console.log('Data is clean to read');
                            cleanedData = success;
                        }

                        // Attempt to deserialise the data.  JSON.parse() used by angular.fromJson throwds a syntax error on failure
                        try {
                            deJson = angular.fromJson(cleanedData);
                        } catch (e) {

                            // If read fails, attempt to read the backup file instead
                            console.log('Regular storage could not be read, trying backup file..');
                            this.$cordovaFile.readAsText(cordova.file.documentsDirectory, 'storageBackup.json')
                                .then((success) => {

                                    // Sometimes the cordova writefile routine appends rather than overwites, need to check for this problem..
                                    var cleanedData, endIndex, deJson, newStorage;
                                    endIndex = success.lastIndexOf('\{"weeks"\:\[');
                                    if (endIndex !== 0) {
                                        console.log('Data was corrupted - index was: ' + endIndex);
                                        cleanedData = success.substr(0, endIndex);
                                    } else {
                                        console.log('Data is clean to read');
                                        cleanedData = success;
                                    }
                                    try {
                                        deJson = angular.fromJson(cleanedData);
                                    } catch(e) {

                                        // If we arrive here, the read of data file failed completely. Create a new one.
                                        console.log('Backup storage could not be read. Renaming old storage..');
                                        this.$cordovaFile.moveFile( cordova.file.documentsDirectory,
                                            this.storageFileName,
                                            cordova.file.documentsDirectory,
                                                this.storageFileName.slice(0, -5) + '-stashed-' + Date.now() + '.json')
                                            .then(() => {

                                                // The return to DataService with this error will cause a new data file to be created
                                                eFunc('create_new_storage');
                                            }, () => {
                                                console.log('Rename old storage file error!');
                                            })
                                    } finally {
                                        if (typeof deJson !== 'undefined' && deJson != null) {
                                            newStorage = new Storage().deserialise(deJson);
                                            console.log('Storage recovered from backup');
                                            if (sFunc !== null) {
                                                sFunc(newStorage);
                                            }
                                        }
                                    }
                                    if(sFunc !== null) {
                                        sFunc(newStorage);
                                    }
                                }, () => {
                                    console.log('Error reading backup storage file using readAsText');
                                });
                        } finally {
                            if (typeof deJson !== 'undefined' && deJson != null) {
                                newStorage = new Storage().deserialise(deJson);
                                console.log('Storage loaded');
                                if (sFunc !== null) {
                                    sFunc(newStorage);
                                }
                            }
                        }
                    }, () => {
                        console.log('Error reading main storage file using readAsText');
                    });
            }
        }

        writeStorage(storageModel, sFunc, eFunc, backup): void {
            if (this.desktopBrowserTesting) {
                this.desktopBrowserStorage = storageModel;
                this.desktopBrowserStorage['pseudoFilename'] = this.storageFileName;
                if(sFunc !== null) {
                    sFunc();
                }
            } else {
                var jsonified = angular.toJson(storageModel);
                this.$cordovaFile.createFile(cordova.file.documentsDirectory, this.storageFileName, true)
                    .then(() => {

                        // TESTING!
                        //var jsonifiedBad = jsonified + 'blah blah' + '\{"weeks"\:\[';

                        this.$cordovaFile.writeFile(cordova.file.documentsDirectory, this.storageFileName, jsonified, true)
                            .then(() => {
                                if (backup) {
                                    this.writeStorageBackup(jsonified, sFunc, eFunc);
                                } else if (sFunc !== null) {
                                    sFunc();
                                }
                            }, () => {
                                console.log('Unable to write storage file');
                                eFunc();
                            });
                    }, () => {
                        console.log('Unable to create storage file');
                    });
            }
        }

        writeStorageBackup(jsonifiedStorage, sFunc, eFunc): void {
            if (this.desktopBrowserTesting) {
                if(sFunc !== null) {
                    sFunc();
                }
            } else {
                this.$cordovaFile.createFile(cordova.file.documentsDirectory, 'storageBackup.json', true)
                    .then(() => {
                        this.$cordovaFile.writeFile(cordova.file.documentsDirectory, 'storageBackup.json', jsonifiedStorage, true)
                            .then(() => {
                                console.log('Wrote storage backup file');
                                if (sFunc !== null) {
                                    sFunc();
                                }
                            }, () => {
                                console.log('Unable to write backup storage file');
                                eFunc();
                            });
                    }, () => {
                        console.log('Unable to create backup storage file');
                    });
            }
        }

        getFreeDiskSpace(sFunc, eFunc): void {
            if (this.desktopBrowserTesting) {
                sFunc('no tablet device!');
            } else {
                this.$cordovaFile.getFreeDiskSpace()
                    .then((success) => {
                        sFunc(success);
                    }, (error) => {
                        eFunc(error);
                    })
            }
        }

        clearStorage(): void {
            this.$cordovaFile.removeFile(cordova.file.documentsDirectory, this.storageFileName)
                .then(() => {
                    console.log('Storage file deleted');
                }, () => {
                    console.log('Unable to write storage file');
                });
        }

        captureVideo(sFunc, eFunc, filename) {
            var options = {limit: 1, duration: 60};
            console.log('Capturing video...');
            this.$cordovaCapture.captureVideo(options).then((videoData) => {

                    var tmpFileDir = 'file:///' + videoData[0].fullPath.substring(0, videoData[0].fullPath.lastIndexOf('/'));

                    this.$cordovaFile.moveFile(tmpFileDir, videoData[0].name, cordova.file.documentsDirectory, filename)
                        .then( (success) => {
                            console.log('Finished capturing video. Moved video.');
                            sFunc(success['nativeURL']);
                    });
            }, (error) => {
                console.log('Video capture error: ' + error);
                eFunc(error);
            });
        }

        startTrackingRecording(filename: string) {
            if (this.desktopBrowserTesting) {
                return;
            }
            if (this.recordingTimer === 0) {
                this.recordingAttempts = 0;
                // https://github.com/remoorejr/cordova-plugin-media-with-compression
                var options = {
                    SampleRate: 16000,
                    NumberOfChannels: 1,
                    duration: 60
                };
                this.audioFile = new Media("documents://tracking/" + filename, () => {
                    console.log('Recording tracking audio...');
                }, (error) => {
                    console.log('Record tracking audio error: ' + error.code);
                });
                this.recordingTimer = Date.now();
                this.audioFile.startRecordWithCompression(options);
            } else if (this.recordingAttempts < 3) {
                this.recordingAttempts++;
                this.$timeout(() => {
                    this.startTrackingRecording(filename);
                }, 1000);
            } else {
                this.recordingAttempts = 0;
                console.log('Attempted record failed 3 times. Stopping.');
            }
        }

        stopTrackingRecording(filename: string): void {
            if (this.desktopBrowserTesting) {
                return;
            }
            if (typeof this.audioFile !== 'undefined' && this.audioFile !== null) {
                this.audioFile.stopRecord();
                this.audioFile.release();
                console.log('Finished recording tracking audio.');
                if (Date.now() - this.recordingTimer < 3000) {
                    this.removeFile(cordova.file.documentsDirectory + 'tracking/', filename, () => {
                        console.log('Too short tracking audio file removed');
                    }, () => {
                        console.log('Error removing short tracking audio file');
                    });
                }
                this.recordingTimer = 0;
            }
            //this.audioFile = null;
        }

        // Retrieve a Tracking audio file for use as 'blob' to send to Nettskjema
        getTrackingAudioFile(filename, sFunc, eFunc): void {
            if (this.desktopBrowserTesting) {
                eFunc();
            } else {
                this.$cordovaFile.readAsArrayBuffer(cordova.file.documentsDirectory + 'tracking/', filename)
                    .then((success) => {
                        if(sFunc !== null) {
                            sFunc(success);
                        }
                    }, () => {
                        if(eFunc !== null) {
                            eFunc('Error reading MP3 file: ' + filename);
                        }
                    });
            }
        }

        /*
        getVideoFile(source: string): Media {
            return this.$cordovaMedia.newMedia(source);
        }
        */

        checkFile(filename: string, sFunc, eFunc) {
            this.$cordovaFile.checkFile(cordova.file.documentsDirectory, filename)
                .then((file) => {
                        sFunc(file);
                    }, (error) => {
                        eFunc(error);
                    }
                )
        }

        deleteOldAudioFiles(mediaList: string[], trackingList: string[], lifespan: number): void {
            var index = 0;
/*
            function checkAndRemove() {
                this.$window.resolveLocalFileSystemURL(cordova.file.documentsDirectory + mediaList[index], (fileEntry) => {
                    var fileModificationDate = new Date(file.lastModifiedDate);
                }, (error) => {
                    console.log('Filesystem error: ' + error);
                });
            }

            mediaList.forEach((media) => {
                this.$window.resolveLocalFileSystemURL(cordova.file.documentsDirectory + media, gotFile, fail);
            });
            this.$window.resolveLocalFileSystemURL(cordova.file.documentsDirectory + '/tracking/' + "www/index.html", gotFile, fail);
*/
        }

        removeFile(path, filename, sFunc, eFunc): void {
            this.$cordovaFile.removeFile(path, filename)
                .then(function () {
                    sFunc();
                }, function () {
                    eFunc();
                });
        }

        createTrackingDirectory() {
            this.$cordovaFile.createDir(cordova.file.documentsDirectory, "tracking", false)
                .then(function () {
                    console.log('Created new tracking directory');
                }, function (error) {
                    // Directory already exists
                    console.log('Tracking directory exists' + error);
                });
        }

        startCaptureAudio(taskFilename: string, sFunc, eFunc) {
            if (this.desktopBrowserTesting) {
                return;
            }
            else {
                // https://github.com/remoorejr/cordova-plugin-media-with-compression
                var options = {
                    SampleRate: 32000,
                    NumberOfChannels: 1,
                    duration: 60
                };
                this.day3AudioFile = new Media("documents://" + taskFilename, () => {
                    console.log('Recording Task audio...');
                    sFunc();
                }, (error) => {
                    console.log('Record Task audio error: ' + error.code);
                    eFunc();
                });
                this.day3RecordingTimer = Date.now();
                this.day3AudioFile.startRecordWithCompression(options);
            }
        }

        stopCaptureAudio(taskFilename: string, currentUsage: UsageStorage, newTrackingAudioFilename: string, sFunc, eFunc): void {
            if (this.desktopBrowserTesting) {
                return;
            }
            if (typeof this.day3AudioFile !== 'undefined' && this.day3AudioFile !== null) {
                this.day3AudioFile.stopRecord();
                this.day3AudioFile.release();
                if (currentUsage.audio_file !== '') {
                    this.removeFile(cordova.file.documentsDirectory + 'tracking/', currentUsage.audio_file , () => {
                        console.log('Older audio recording removed for this Tracking');
                        currentUsage.audio_file = '';
                    }, (error) => {
                        eFunc(error);
                    });
                }
                if (Date.now() - this.day3RecordingTimer < 1000) {
                    this.removeFile(cordova.file.documentsDirectory , taskFilename, () => {
                        console.log('Too short Tracking audio file removed');
                        sFunc(null);
                    }, (error) => {
                        eFunc(error);
                    });
                } else {
                    this.$cordovaFile.copyFile(cordova.file.documentsDirectory, taskFilename, cordova.file.documentsDirectory + 'tracking/', newTrackingAudioFilename)
                        .then( () => {
                            currentUsage.audio_file = newTrackingAudioFilename;
                            this.checkFile(taskFilename, sFunc, eFunc);
                        }, (error) => {
                            console.log('Copy Tracking audio error' + error);
                        });
                }
            } else {
                currentUsage.audio_file = '';
                this.checkFile(taskFilename, sFunc, eFunc);
            }
        }

        getDeviceID(): string {
            if(this.desktopBrowserTesting) {
                return 'desktop device';
            } else {
                return this.$cordovaDevice.getUUID();
            }
        }

        getAppVersion(callback): void {
            if(this.desktopBrowserTesting) {
                callback('desktop');
            } else {
                this.$cordovaAppVersion.getVersionNumber()
                    .then((version) => {
                            callback(version);
                        }
                    );
            }
        }

    }

}
