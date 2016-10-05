/// <reference path="../_references.ts"/>
/// <reference path="../models/models.ts"/>
var ISPApp;
(function (ISPApp) {
    var Services;
    (function (Services) {
        "use strict";
        var CordovaService = (function () {
            function CordovaService($window, $cordovaDevice, $cordovaFile, $cordovaCapture, $cordovaMedia, $cordovaAppVersion, $timeout) {
                this.$window = $window;
                this.$cordovaDevice = $cordovaDevice;
                this.$cordovaFile = $cordovaFile;
                this.$cordovaCapture = $cordovaCapture;
                this.$cordovaMedia = $cordovaMedia;
                this.$cordovaAppVersion = $cordovaAppVersion;
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
                if (this.$window.cordova !== undefined) {
                    return this.$cordovaDevice.getUUID();
                }
                else {
                    return 'No mobile device';
                }
            };
            CordovaService.prototype.setStorageFilename = function (name) {
                this.storageFileName = name;
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
                var _this = this;
                if (this.desktopBrowserTesting) {
                    if (this.desktopBrowserStorage === null || (this.desktopBrowserStorage.hasOwnProperty('pseudoFilename')
                        && this.desktopBrowserStorage['pseudoFilename'] !== this.storageFileName)) {
                        var newStorage = new ISPApp.Storage().initialise(setupModel, username);
                        this.writeStorage(newStorage, sFunc, eFunc, false);
                    }
                    else {
                        if (sFunc !== null) {
                            sFunc();
                        }
                    }
                }
                else {
                    this.$cordovaFile.checkFile(cordova.file.documentsDirectory, this.storageFileName)
                        .then(function () {
                        if (sFunc !== null) {
                            sFunc();
                        }
                    }, function () {
                        _this.writeStorage(new ISPApp.Storage().initialise(setupModel, username), sFunc, eFunc, false);
                    });
                }
            };
            CordovaService.prototype.getStorage = function (sFunc, eFunc) {
                var _this = this;
                if (this.desktopBrowserTesting) {
                    sFunc(this.desktopBrowserStorage);
                }
                else {
                    this.$cordovaFile.readAsText(cordova.file.documentsDirectory, this.storageFileName)
                        .then(function (success) {
                        // Sometimes the cordova writefile routine appends rather than overwites, need to check for this problem..
                        var cleanedData, endIndex, deJson, newStorage;
                        endIndex = success.lastIndexOf('\{"weeks"\:\[');
                        if (endIndex !== 0) {
                            console.log('Data was corrupted - index was: ' + endIndex);
                            cleanedData = success.substr(0, endIndex);
                        }
                        else {
                            console.log('Data is clean to read');
                            cleanedData = success;
                        }
                        // Attempt to deserialise the data.  JSON.parse() used by angular.fromJson throwds a syntax error on failure
                        try {
                            deJson = angular.fromJson(cleanedData);
                        }
                        catch (e) {
                            // If read fails, attempt to read the backup file instead
                            console.log('Regular storage could not be read, trying backup file..');
                            _this.$cordovaFile.readAsText(cordova.file.documentsDirectory, 'storageBackup.json')
                                .then(function (success) {
                                // Sometimes the cordova writefile routine appends rather than overwites, need to check for this problem..
                                var cleanedData, endIndex, deJson, newStorage;
                                endIndex = success.lastIndexOf('\{"weeks"\:\[');
                                if (endIndex !== 0) {
                                    console.log('Data was corrupted - index was: ' + endIndex);
                                    cleanedData = success.substr(0, endIndex);
                                }
                                else {
                                    console.log('Data is clean to read');
                                    cleanedData = success;
                                }
                                try {
                                    deJson = angular.fromJson(cleanedData);
                                }
                                catch (e) {
                                    // If we arrive here, the read of data file failed completely. Create a new one.
                                    console.log('Backup storage could not be read. Renaming old storage..');
                                    _this.$cordovaFile.moveFile(cordova.file.documentsDirectory, _this.storageFileName, cordova.file.documentsDirectory, _this.storageFileName.slice(0, -5) + '-stashed-' + Date.now() + '.json')
                                        .then(function () {
                                        // The return to DataService with this error will cause a new data file to be created
                                        eFunc('create_new_storage');
                                    }, function () {
                                        console.log('Rename old storage file error!');
                                    });
                                }
                                finally {
                                    if (typeof deJson !== 'undefined' && deJson != null) {
                                        newStorage = new ISPApp.Storage().deserialise(deJson);
                                        console.log('Storage recovered from backup');
                                        if (sFunc !== null) {
                                            sFunc(newStorage);
                                        }
                                    }
                                }
                                if (sFunc !== null) {
                                    sFunc(newStorage);
                                }
                            }, function () {
                                console.log('Error reading backup storage file using readAsText');
                            });
                        }
                        finally {
                            if (typeof deJson !== 'undefined' && deJson != null) {
                                newStorage = new ISPApp.Storage().deserialise(deJson);
                                console.log('Storage loaded');
                                if (sFunc !== null) {
                                    sFunc(newStorage);
                                }
                            }
                        }
                    }, function () {
                        console.log('Error reading main storage file using readAsText');
                    });
                }
            };
            CordovaService.prototype.writeStorage = function (storageModel, sFunc, eFunc, backup) {
                var _this = this;
                if (this.desktopBrowserTesting) {
                    this.desktopBrowserStorage = storageModel;
                    this.desktopBrowserStorage['pseudoFilename'] = this.storageFileName;
                    if (sFunc !== null) {
                        sFunc();
                    }
                }
                else {
                    var jsonified = angular.toJson(storageModel);
                    this.$cordovaFile.createFile(cordova.file.documentsDirectory, this.storageFileName, true)
                        .then(function () {
                        // TESTING!
                        //var jsonifiedBad = jsonified + 'blah blah' + '\{"weeks"\:\[';
                        _this.$cordovaFile.writeFile(cordova.file.documentsDirectory, _this.storageFileName, jsonified, true)
                            .then(function () {
                            if (backup) {
                                _this.writeStorageBackup(jsonified, sFunc, eFunc);
                            }
                            else if (sFunc !== null) {
                                sFunc();
                            }
                        }, function () {
                            console.log('Unable to write storage file');
                            eFunc();
                        });
                    }, function () {
                        console.log('Unable to create storage file');
                    });
                }
            };
            CordovaService.prototype.writeStorageBackup = function (jsonifiedStorage, sFunc, eFunc) {
                var _this = this;
                if (this.desktopBrowserTesting) {
                    if (sFunc !== null) {
                        sFunc();
                    }
                }
                else {
                    this.$cordovaFile.createFile(cordova.file.documentsDirectory, 'storageBackup.json', true)
                        .then(function () {
                        _this.$cordovaFile.writeFile(cordova.file.documentsDirectory, 'storageBackup.json', jsonifiedStorage, true)
                            .then(function () {
                            console.log('Wrote storage backup file');
                            if (sFunc !== null) {
                                sFunc();
                            }
                        }, function () {
                            console.log('Unable to write backup storage file');
                            eFunc();
                        });
                    }, function () {
                        console.log('Unable to create backup storage file');
                    });
                }
            };
            CordovaService.prototype.getFreeDiskSpace = function (sFunc, eFunc) {
                if (this.desktopBrowserTesting) {
                    sFunc('no tablet device!');
                }
                else {
                    this.$cordovaFile.getFreeDiskSpace()
                        .then(function (success) {
                        sFunc(success);
                    }, function (error) {
                        eFunc(error);
                    });
                }
            };
            CordovaService.prototype.clearStorage = function () {
                this.$cordovaFile.removeFile(cordova.file.documentsDirectory, this.storageFileName)
                    .then(function () {
                    console.log('Storage file deleted');
                }, function () {
                    console.log('Unable to write storage file');
                });
            };
            CordovaService.prototype.captureVideo = function (sFunc, eFunc, filename) {
                var _this = this;
                var options = { limit: 1, duration: 60 };
                console.log('Capturing video...');
                this.$cordovaCapture.captureVideo(options).then(function (videoData) {
                    var tmpFileDir = 'file:///' + videoData[0].fullPath.substring(0, videoData[0].fullPath.lastIndexOf('/'));
                    _this.$cordovaFile.moveFile(tmpFileDir, videoData[0].name, cordova.file.documentsDirectory, filename)
                        .then(function (success) {
                        console.log('Finished capturing video. Moved video.');
                        sFunc(success['nativeURL']);
                    });
                }, function (error) {
                    console.log('Video capture error: ' + error);
                    eFunc(error);
                });
            };
            CordovaService.prototype.startTrackingRecording = function (filename) {
                var _this = this;
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
                    this.audioFile = new Media("documents://tracking/" + filename, function () {
                        console.log('Recording tracking audio...');
                    }, function (error) {
                        console.log('Record tracking audio error: ' + error.code);
                    });
                    this.recordingTimer = Date.now();
                    this.audioFile.startRecordWithCompression(options);
                }
                else if (this.recordingAttempts < 3) {
                    this.recordingAttempts++;
                    this.$timeout(function () {
                        _this.startTrackingRecording(filename);
                    }, 1000);
                }
                else {
                    this.recordingAttempts = 0;
                    console.log('Attempted record failed 3 times. Stopping.');
                }
            };
            CordovaService.prototype.stopTrackingRecording = function (filename) {
                if (this.desktopBrowserTesting) {
                    return;
                }
                if (typeof this.audioFile !== 'undefined' && this.audioFile !== null) {
                    this.audioFile.stopRecord();
                    this.audioFile.release();
                    console.log('Finished recording tracking audio.');
                    if (Date.now() - this.recordingTimer < 3000) {
                        this.removeFile(cordova.file.documentsDirectory + 'tracking/', filename, function () {
                            console.log('Too short tracking audio file removed');
                        }, function () {
                            console.log('Error removing short tracking audio file');
                        });
                    }
                    this.recordingTimer = 0;
                }
                //this.audioFile = null;
            };
            // Retrieve a Tracking audio file for use as 'blob' to send to Nettskjema
            CordovaService.prototype.getTrackingAudioFile = function (filename, sFunc, eFunc) {
                if (this.desktopBrowserTesting) {
                    eFunc();
                }
                else {
                    this.$cordovaFile.readAsArrayBuffer(cordova.file.documentsDirectory + 'tracking/', filename)
                        .then(function (success) {
                        if (sFunc !== null) {
                            sFunc(success);
                        }
                    }, function () {
                        if (eFunc !== null) {
                            eFunc('Error reading MP3 file: ' + filename);
                        }
                    });
                }
            };
            /*
            getVideoFile(source: string): Media {
                return this.$cordovaMedia.newMedia(source);
            }
            */
            CordovaService.prototype.checkFile = function (filename, sFunc, eFunc) {
                this.$cordovaFile.checkFile(cordova.file.documentsDirectory, filename)
                    .then(function (file) {
                    sFunc(file);
                }, function (error) {
                    eFunc(error);
                });
            };
            CordovaService.prototype.deleteOldAudioFiles = function (mediaList, trackingList, lifespan) {
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
            };
            CordovaService.prototype.removeFile = function (path, filename, sFunc, eFunc) {
                this.$cordovaFile.removeFile(path, filename)
                    .then(function () {
                    sFunc();
                }, function () {
                    eFunc();
                });
            };
            CordovaService.prototype.createTrackingDirectory = function () {
                this.$cordovaFile.createDir(cordova.file.documentsDirectory, "tracking", false)
                    .then(function () {
                    console.log('Created new tracking directory');
                }, function (error) {
                    // Directory already exists
                    console.log('Tracking directory exists' + error);
                });
            };
            CordovaService.prototype.startCaptureAudio = function (taskFilename, sFunc, eFunc) {
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
                    this.day3AudioFile = new Media("documents://" + taskFilename, function () {
                        console.log('Recording Task audio...');
                        sFunc();
                    }, function (error) {
                        console.log('Record Task audio error: ' + error.code);
                        eFunc();
                    });
                    this.day3RecordingTimer = Date.now();
                    this.day3AudioFile.startRecordWithCompression(options);
                }
            };
            CordovaService.prototype.stopCaptureAudio = function (taskFilename, currentUsage, newTrackingAudioFilename, sFunc, eFunc) {
                var _this = this;
                if (this.desktopBrowserTesting) {
                    return;
                }
                if (typeof this.day3AudioFile !== 'undefined' && this.day3AudioFile !== null) {
                    this.day3AudioFile.stopRecord();
                    this.day3AudioFile.release();
                    if (currentUsage.audio_file !== '') {
                        this.removeFile(cordova.file.documentsDirectory + 'tracking/', currentUsage.audio_file, function () {
                            console.log('Older audio recording removed for this Tracking');
                            currentUsage.audio_file = '';
                        }, function (error) {
                            eFunc(error);
                        });
                    }
                    if (Date.now() - this.day3RecordingTimer < 1000) {
                        this.removeFile(cordova.file.documentsDirectory, taskFilename, function () {
                            console.log('Too short Tracking audio file removed');
                            sFunc(null);
                        }, function (error) {
                            eFunc(error);
                        });
                    }
                    else {
                        this.$cordovaFile.copyFile(cordova.file.documentsDirectory, taskFilename, cordova.file.documentsDirectory + 'tracking/', newTrackingAudioFilename)
                            .then(function () {
                            currentUsage.audio_file = newTrackingAudioFilename;
                            _this.checkFile(taskFilename, sFunc, eFunc);
                        }, function (error) {
                            console.log('Copy Tracking audio error' + error);
                        });
                    }
                }
                else {
                    currentUsage.audio_file = '';
                    this.checkFile(taskFilename, sFunc, eFunc);
                }
            };
            CordovaService.prototype.getDeviceID = function () {
                if (this.desktopBrowserTesting) {
                    return 'desktop device';
                }
                else {
                    return this.$cordovaDevice.getUUID();
                }
            };
            CordovaService.prototype.getAppVersion = function (callback) {
                if (this.desktopBrowserTesting) {
                    callback('desktop');
                }
                else {
                    this.$cordovaAppVersion.getVersionNumber()
                        .then(function (version) {
                        callback(version);
                    });
                }
            };
            CordovaService.$inject = ['$window', '$cordovaDevice', '$cordovaFile', '$cordovaCapture', '$cordovaMedia', '$cordovaAppVersion', '$timeout'];
            return CordovaService;
        }());
        Services.CordovaService = CordovaService;
    })(Services = ISPApp.Services || (ISPApp.Services = {}));
})(ISPApp || (ISPApp = {}));
//# sourceMappingURL=cordovaService.js.map