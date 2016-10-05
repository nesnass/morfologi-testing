/// <reference path="../_references"/>
/// <reference path="../app.constants.ts"/>
/// <reference path="../models/models"/>
/// <reference path="./cordovaService"/>
/// <reference path="./nettskjemaService"/>
var ISPApp;
(function (ISPApp) {
    var Services;
    (function (Services) {
        "use strict";
        var DataService = (function () {
            function DataService($http, $window, $timeout, cordovaService, nettsckjemaService, constants) {
                var _this = this;
                this.$http = $http;
                this.$window = $window;
                this.$timeout = $timeout;
                this.cordovaService = cordovaService;
                this.nettsckjemaService = nettsckjemaService;
                this.constants = constants;
                this.currentLanguage = "en";
                this.username = '';
                this.selectedWeekIndex = 0;
                this.selectedBookIndex = 0;
                this.selectedDayIndex = 0;
                this.selectedTaskIndex = 0;
                this.setupComplete = false;
                this.deviceReady = false;
                this.status = {
                    online: navigator.onLine || false,
                    posting_data: false,
                    unsynced_data: false,
                    disk_space: NaN
                };
                // *** AUTO SENDING IS INTENDED TO BE SET TO true IN PRODUCTION
                this.settings = {
                    automatic_send_data: true,
                    storage_mode: 'sample'
                };
                this.$window.addEventListener("offline", function () {
                    _this.status.online = false;
                }, false);
                this.$window.addEventListener("online", function () {
                    if (!_this.status.online) {
                        _this.status.online = true;
                        _this.automaticallySendData();
                    }
                }, false);
                this.desktopBrowserTesting = !$window.cordova;
                this.activateTaskStartCallback = null;
                this.activateTaskEndCallback = null;
            }
            DataService.prototype.getDeviceReady = function () {
                return this.deviceReady;
            };
            DataService.prototype.setDeviceReady = function (setMe) {
                this.deviceReady = setMe;
            };
            DataService.prototype.getFormalStartDate = function () {
                return this.constants.constants['FORMAL_TEST_DATE'];
            };
            DataService.prototype.getShowCheats = function () {
                return this.constants.constants['SHOW_CHEATS'];
            };
            DataService.prototype.getStatus = function () {
                return this.status;
            };
            DataService.prototype.getDesktopBrowserTesting = function () {
                return this.desktopBrowserTesting;
            };
            DataService.prototype.updateFreeDiskSpace = function () {
                var _this = this;
                this.cordovaService.getFreeDiskSpace(function (space) {
                    _this.status.disk_space = Math.floor(parseInt(space) / 1048576);
                }, function () {
                    console.log('Error obtaining disk space');
                });
            };
            // Takes the 'achievement' to the next day, but marks day as skipped.
            // The day to skip is considered as the avatar's current location
            DataService.prototype.skipToday = function (password) {
                var passKey = 'SKIP_DAY_PASSWORD';
                if (this.constants.constants[passKey] === password) {
                    var uncompletedWeekIndex = this.storageModel.achievement.weekIndex + 1;
                    var uncompletedDayIndex = this.storageModel.achievement.dayIndex + 1;
                    this.storageModel.markDayAsSkipped(uncompletedWeekIndex, uncompletedDayIndex);
                    if (uncompletedDayIndex === 2) {
                        this.setupModel.markWeekAsCompleted(uncompletedWeekIndex);
                        this.storageModel.markWeekAsCompleted(uncompletedWeekIndex);
                        this.storageModel.achievement.completeWeek(uncompletedWeekIndex);
                    }
                    else {
                        this.storageModel.achievement.completeDay(uncompletedWeekIndex, uncompletedDayIndex);
                    }
                }
            };
            DataService.prototype.getSettings = function () {
                return this.settings;
            };
            DataService.prototype.automaticallySendData = function () {
                if (this.settings.automatic_send_data) {
                    this.attemptToPostUsageData();
                }
            };
            // Make an attempt to post any new usage data to Nettskjema
            DataService.prototype.attemptToPostUsageData = function () {
                var _this = this;
                // If we receive a token, and are running on tablet, it is safe to assume we can then post to Nettskjema
                if (this.desktopBrowserTesting) {
                    return;
                }
                this.$http.get('http://nettskjema.uio.no/ping.html')
                    .then(function (success) {
                    console.log('Connected to Nettskjema');
                    _this.nettsckjemaService.setNettskjemaToken(success.data.toString());
                    if (_this.status.unsynced_data && !_this.status.posting_data) {
                        _this.postUsageData();
                    }
                }, function (error) {
                    _this.status.online = false;
                    console.log('Unable to connect to Nettskjema');
                });
            };
            // Load in the setup file to manage tasks and picturebooks
            DataService.prototype.requestSetupModel = function (successCallback) {
                var _this = this;
                var setupPathKey = 'SETUP_FILE_PATH', setupFilenameKey = 'SETUP_FILE_NAME', setupRevisionKey = 'RELEASE_NUMBER';
                return this.$http.get(this.constants.constants[setupPathKey] + this.constants.constants[setupFilenameKey] +
                    this.constants.constants[setupRevisionKey] + '.json')
                    .then(function (res) {
                    _this.setupModel = new ISPApp.Setup().deserialise(res.data);
                    if (successCallback !== null) {
                        successCallback(res.data);
                    }
                });
            };
            // Load in the current saved status from local tablet storage
            DataService.prototype.requestSavedState = function (sFunc) {
                var _this = this;
                this.cordovaService.storageExists(this.setupModel, this.username, function () {
                    _this.cordovaService.getStorage(function (model) {
                        _this.storageModel = model;
                        if (sFunc !== null) {
                            sFunc(model);
                        }
                    }, function (error) {
                        // If there was a terminal error reading from the storage file, try to create a new one
                        if (typeof error !== 'undefined' && error !== null && error === 'create_new_storage') {
                            _this.cordovaService.writeStorage(new ISPApp.Storage().initialise(_this.setupModel, _this.username), function () {
                                console.log('Created fresh storage after read fail');
                                _this.cordovaService.getStorage(function (model) {
                                    _this.storageModel = model;
                                    if (sFunc !== null) {
                                        sFunc(model);
                                    }
                                }, null);
                            }, null, false);
                        }
                        console.log('Error getting storage');
                    });
                }, function () {
                    console.log('Error checking storage exists');
                });
            };
            DataService.prototype.getStorageMode = function () {
                return this.settings.storage_mode;
            };
            // If before the 'formal date' set in Constants we use 'sample' storage. After this date, we use 'formal' storage
            DataService.prototype.checkStorageAndSetup = function (successCallback) {
                console.log('Checking storage...');
                var storageFilenameKey = 'STORAGE_FILE_NAME', revisionKey = 'RELEASE_NUMBER';
                var formalNameKey = 'FORMAL_TEST_NAME', sampleNameKey = 'SAMPLE_TEST_NAME', formalDateKey = 'FORMAL_TEST_DATE';
                var formalDate = this.constants.constants[formalDateKey];
                var dateNow = new Date();
                var newMode = this.constants.constants[sampleNameKey];
                if (dateNow.getTime() > formalDate.getTime()) {
                    newMode = this.constants.constants[formalNameKey];
                }
                console.log('Using storage: ' + newMode);
                this.updateFreeDiskSpace();
                // Called from a 'resume' and storage state has changed, or this is the first launch
                if ((this.setupComplete && this.settings.storage_mode !== newMode) || !this.setupComplete) {
                    this.setupComplete = false;
                    this.settings.storage_mode = newMode;
                    // If switching from 'sample' to 'formal' we must copy the same identifier
                    var identifier = '';
                    if (typeof this.storageModel !== 'undefined' && this.storageModel !== null) {
                        identifier = this.storageModel.username;
                    }
                    var filename = this.constants.constants[storageFilenameKey] + '_' +
                        this.constants.constants[revisionKey] + '_' + newMode + '.json';
                    this.cordovaService.setStorageFilename(filename);
                    this.setup(function (return_to_home) {
                        // Due to teachers entering student names during training period (this is not allowed)
                        // we are not copying the identifier across. Instead it must be asked for again.
                        /*
                        if (identifier !== '') {
                            this.storageModel.username = identifier;
                        }
                        */
                        successCallback(return_to_home);
                    });
                }
                else {
                    successCallback(false);
                }
            };
            // Save the current status to local tablet storage
            DataService.prototype.writeStorage = function (sFunc, eFunc, backup) {
                var _this = this;
                if (this.deviceReady) {
                    this.cordovaService.writeStorage(this.storageModel, function () {
                        _this.updateFreeDiskSpace();
                        console.log('Saved to storage file');
                        if (sFunc !== null) {
                            sFunc();
                        }
                    }, function () {
                        console.log('Error writing storage');
                    }, backup);
                }
                else {
                    eFunc('Device not ready');
                }
            };
            DataService.prototype.setup = function (successCallback) {
                var _this = this;
                if (!this.setupComplete) {
                    console.log('Loading setup...');
                    this.requestSetupModel(function () {
                        console.log('Loading storage...');
                        _this.requestSavedState(function () {
                            console.log('Marking completions...');
                            _this.markSetupCompletions();
                            // console.log('Deleting old recordings...');
                            // this.deleteOldRecordings();
                            _this.setupComplete = true;
                            if (successCallback !== null) {
                                successCallback(true);
                            }
                        });
                    });
                }
                else if (successCallback !== null) {
                    successCallback(false);
                }
            };
            /**
             * For each setup task, if completed in the storage, mark them in memory
             */
            DataService.prototype.markSetupCompletions = function () {
                var _this = this;
                this.storageModel.weeks.forEach(function (week, weekIndex) {
                    if (week.completed_on !== null) {
                        _this.setupModel.weeks[weekIndex].completed = true;
                    }
                    week.days.forEach(function (day, dayIndex) {
                        if (day.completed_on !== null) {
                            _this.setupModel.weeks[weekIndex].days[dayIndex].completed = true;
                        }
                        day.tasks.forEach(function (task, taskIndex) {
                            if (task.completed_on !== null) {
                                _this.setupModel.weeks[weekIndex].days[dayIndex].tasks[taskIndex].completed = true;
                            }
                        });
                    });
                });
            };
            DataService.prototype.setAvatar = function (avatarIndex) {
                this.storageModel.achievement.avatar = avatarIndex;
            };
            DataService.prototype.getUsername = function () {
                return this.storageModel.username;
            };
            DataService.prototype.setUsername = function (username) {
                this.storageModel.username = username;
            };
            DataService.prototype.getResizableDivSize = function () {
                return this.resizableDivSize;
            };
            DataService.prototype.setResizableDivSize = function (newSize) {
                this.resizableDivSize = newSize;
            };
            DataService.prototype.getLanguage = function () {
                return this.currentLanguage;
            };
            ;
            DataService.prototype.setLanguage = function (type) {
                this.currentLanguage = type;
            };
            ;
            // Books
            DataService.prototype.getBookList = function (successCallback, errorCallback) {
                var booklistKey = 'books';
                if (typeof this.setupModel === 'undefined') {
                    this.requestSetupModel(function (data) {
                        successCallback(data[booklistKey]);
                    });
                }
                else {
                    successCallback(this.setupModel[booklistKey]);
                }
            };
            DataService.prototype.getBook = function () {
                return this.setupModel.books[this.setupModel.weeks[this.selectedWeekIndex].book_index];
            };
            // Tasks
            DataService.prototype.getWeeks = function () {
                var weeksKey = 'weeks';
                return this.setupModel[weeksKey];
            };
            DataService.prototype.getWeek = function () {
                return this.selectedWeekIndex;
            };
            DataService.prototype.getDay = function () {
                return this.selectedDayIndex;
            };
            DataService.prototype.getTaskIndex = function () {
                return this.selectedTaskIndex;
            };
            DataService.prototype.getTasks = function () {
                return this.setupModel.weeks[this.selectedWeekIndex].days[this.selectedDayIndex]
                    .tasks;
            };
            DataService.prototype.getTask = function () {
                return this.setupModel.weeks[this.selectedWeekIndex].days[this.selectedDayIndex]
                    .tasks[this.selectedTaskIndex];
            };
            DataService.prototype.getWord = function () {
                var wordKey = 'word_en';
                return this.setupModel.weeks[this.selectedWeekIndex][wordKey];
            };
            DataService.prototype.getWordForConsolidationDay = function () {
                var wordKey = 'word_en', dayKey = 'days', tasksKey = 'tasks', structureKey = 'structure', weeksKey = 'weeks', weekKey = 'week';
                var weekIndex = this.setupModel[weeksKey][this.selectedWeekIndex][dayKey][this.selectedDayIndex][tasksKey][this.selectedTaskIndex][structureKey][weekKey];
                return this.setupModel.weeks[weekIndex][wordKey];
            };
            DataService.prototype.getAchievement = function () {
                return this.storageModel.achievement;
            };
            DataService.prototype.setWeek = function (weekIndex) {
                this.selectedWeekIndex = weekIndex;
                this.selectedBookIndex = this.setupModel.weeks[weekIndex].book_index;
            };
            DataService.prototype.setDay = function (dateIndex) {
                this.selectedDayIndex = dateIndex;
            };
            DataService.prototype.startBook = function () {
                this.storageModel.addBookUsage(this.selectedWeekIndex, new Date(), 0, '');
                this.status.unsynced_data = true;
                if (this.setupModel.books[this.selectedBookIndex].record_audio) {
                    this.startTrackingRecording('book');
                }
            };
            DataService.prototype.setTask = function (taskIndex) {
                this.activateTaskStartCallback = null;
                this.activateTaskEndCallback = null;
                this.selectedTaskIndex = taskIndex;
                this.storageModel.addTaskUsage(this.selectedWeekIndex, this.selectedDayIndex, this.selectedTaskIndex, new Date(), 0, '');
                this.status.unsynced_data = true;
                if (this.setupModel.weeks[this.selectedWeekIndex].days[this.selectedDayIndex].tasks[this.selectedTaskIndex].record_audio) {
                    this.startTrackingRecording('task');
                }
            };
            DataService.prototype.getBookReadToday = function () {
                return this.storageModel.weeks[this.selectedWeekIndex].days[this.selectedDayIndex].book_read;
            };
            DataService.prototype.setBookReadToday = function () {
                this.storageModel.weeks[this.selectedWeekIndex].days[this.selectedDayIndex].book_read = true;
            };
            // Do not set record_audio for Day 3 Task 5 or 6, as those tasks record the child's voice instead
            DataService.prototype.completeCurrentUsageRecord = function (type) {
                var currentUsage;
                // Complete recording if running
                if (type === 'task') {
                    currentUsage = this.storageModel.weeks[this.selectedWeekIndex].days[this.selectedDayIndex].tasks[this.selectedTaskIndex].currentUsage;
                    if (currentUsage !== null) {
                        var startedOn = moment(currentUsage.accessed);
                        var finishedOn = moment();
                        currentUsage.duration = moment.duration(finishedOn.diff(startedOn)).asSeconds();
                        if (this.setupModel.weeks[this.selectedWeekIndex].days[this.selectedDayIndex].tasks[this.selectedTaskIndex].record_audio) {
                            this.cordovaService.stopTrackingRecording(currentUsage.audio_file);
                        }
                        this.storageModel.weeks[this.selectedWeekIndex].days[this.selectedDayIndex].tasks[this.selectedTaskIndex].currentUsage = null;
                    }
                }
                else if (type === 'book') {
                    currentUsage = this.storageModel.weeks[this.selectedWeekIndex].book.currentUsage;
                    if (currentUsage !== null) {
                        var startedOn = moment(currentUsage.accessed);
                        var finishedOn = moment();
                        currentUsage.duration = moment.duration(finishedOn.diff(startedOn)).asSeconds();
                        if (this.setupModel.books[this.selectedBookIndex].record_audio) {
                            this.cordovaService.stopTrackingRecording(currentUsage.audio_file);
                        }
                        this.storageModel.weeks[this.selectedWeekIndex].book.currentUsage = null;
                    }
                }
            };
            DataService.prototype.completeSelectedBook = function () {
                var book = this.selectedBookIndex, week = this.selectedWeekIndex;
                this.setBookReadToday();
                // save state to Setup and Storage
                if (typeof this.setupModel.books[book] !== 'undefined' && !this.setupModel.books[book].completed) {
                    this.setupModel.markBookAsCompleted(week);
                    this.storageModel.markBookAsCompleted(week);
                }
                // Complete the outstanding usage record
                this.completeCurrentUsageRecord('book');
            };
            DataService.prototype.completeSelectedTask = function () {
                var week = this.selectedWeekIndex, day = this.selectedDayIndex, task = this.selectedTaskIndex;
                // save state to Setup and Storage
                this.setupModel.markTaskAsCompleted(week, day, task);
                this.storageModel.markTaskAsCompleted(week, day, task);
                this.storageModel.achievement.completeTask(week, day, task);
            };
            DataService.prototype.completeSelectedDay = function () {
                var week = this.selectedWeekIndex, day = this.selectedDayIndex;
                if (this.setupModel.weeks[this.selectedWeekIndex].book_index !== -1) {
                    this.setupModel.markBookAsCompleted(week);
                    this.storageModel.markBookAsCompleted(week);
                }
                this.setupModel.markDayAsCompleted(week, day);
                this.storageModel.markDayAsCompleted(week, day);
                this.storageModel.achievement.completeDay(week, day);
                if (day === 2) {
                    this.completeSelectedWeek();
                }
            };
            DataService.prototype.completeSelectedWeek = function () {
                this.setupModel.markWeekAsCompleted(this.selectedWeekIndex);
                this.storageModel.markWeekAsCompleted(this.selectedWeekIndex);
                this.storageModel.achievement.completeWeek(this.selectedWeekIndex);
            };
            /*
            getUUID(): string {
                return this.cordovaService.getUUID();
            }
            */
            DataService.prototype.getCommon = function () {
                var commonKey = 'common';
                return this.setupModel[commonKey];
            };
            DataService.prototype.removeStorage = function () {
                this.cordovaService.clearStorage();
            };
            /*
            getVideoMedia(source): Media {
                return this.cordovaService.getVideoFile(source);
            }
            */
            // Audio recording for tracking purposes
            // Do not set record_audio for Day 3 Task 5 or 6, as those tasks record the child's voice instead
            DataService.prototype.startTrackingRecording = function (type) {
                if (this.desktopBrowserTesting) {
                    return;
                }
                var currentUsage;
                // Check disk space first
                if (this.status.disk_space < 100) {
                    return;
                }
                else if (type === 'task') {
                    currentUsage = this.storageModel.weeks[this.selectedWeekIndex].days[this.selectedDayIndex].tasks[this.selectedTaskIndex].currentUsage;
                    var d = currentUsage.accessed;
                    currentUsage.audio_file = 'w' + (this.selectedWeekIndex + 1) + '_d' + (this.selectedDayIndex + 1) +
                        '_t' + (this.selectedTaskIndex + 1) + '-' + d.getFullYear() + '_' + (d.getMonth() + 1) + '_' + d.getDate() +
                        '-' + d.getHours() + '_' + d.getMinutes() + '_' + d.getSeconds() + '.m4a';
                }
                else if (type === 'book') {
                    currentUsage = this.storageModel.weeks[this.selectedWeekIndex].book.currentUsage;
                    var d = currentUsage.accessed;
                    currentUsage.audio_file = 'w' + (this.selectedWeekIndex + 1) + '_b' + (this.selectedBookIndex + 1) +
                        '-' + d.getFullYear() + '_' + (d.getMonth() + 1) + '_' + d.getDate() +
                        '-' + d.getHours() + '_' + d.getMinutes() + '_' + d.getSeconds() + '.m4a';
                }
                this.cordovaService.startTrackingRecording(currentUsage.audio_file);
            };
            DataService.prototype.getTaskUsage = function () {
                return this.storageModel.weeks[this.selectedWeekIndex].days[this.selectedDayIndex]
                    .tasks[this.selectedTaskIndex].usage;
            };
            DataService.prototype.postUsageData = function () {
                var _this = this;
                this.status.posting_data = true;
                var postData = this.storageModel.asPostableUsageData();
                var postRemainingData = function () {
                    if (postData.length > 0) {
                        _this.nettsckjemaService.postTrackingDataItem(postData.pop(), function (data) {
                            console.log('Successful Nettskjema submission: ' + data);
                            postRemainingData();
                        }, function (data) {
                            console.log('Error during Nettskjema submission: ' + data);
                        });
                    }
                    else {
                        _this.status.posting_data = false;
                        _this.status.unsynced_data = false;
                    }
                };
                postRemainingData();
            };
            DataService.prototype.setupAudioIntroduction = function (url) {
                var _this = this;
                if (typeof this.introductionAudio !== 'undefined') {
                    this.introductionAudio.pause();
                }
                this.$timeout(function () {
                    _this.introductionAudio = new Audio(url);
                    _this.introductionAudio.load();
                    _this.introductionAudio.addEventListener('ended', function () {
                        _this.disableInteractionCallback(false, true);
                        if (_this.activateTaskEndCallback !== null) {
                            _this.activateTaskEndCallback();
                        }
                    });
                }, 0);
            };
            DataService.prototype.playAudioIntroduction = function (delay) {
                var _this = this;
                if (this.desktopBrowserTesting) {
                    delay = 10;
                }
                if (delay > 0) {
                    this.disableInteractionCallback(true, true);
                }
                this.$timeout(function () {
                    if (_this.activateTaskStartCallback !== null) {
                        _this.activateTaskStartCallback();
                    }
                    try {
                        _this.introductionAudio.play();
                    }
                    catch (error) {
                        console.log('No introduction audio source found');
                        _this.disableInteractionCallback(false, true);
                        if (_this.activateTaskEndCallback !== null) {
                            _this.activateTaskEndCallback();
                        }
                    }
                }, delay);
            };
            DataService.prototype.deleteOldRecordings = function () {
                var mediaFiles = [];
                var weekTotal = this.setupModel.weeks.length;
                var w = 0;
                while (w < weekTotal) {
                    // Each week has thre 'user made' recordings - two audio and one video
                    mediaFiles.push('week' + (w + 1) + '-task6-' + this.constants.constants['FORMAL_TEST_NAME'] + '-audio.m4a');
                    mediaFiles.push('week' + (w + 1) + '-task5-' + this.constants.constants['FORMAL_TEST_NAME'] + '-audio.m4a');
                    mediaFiles.push('week' + w + '-' + this.constants.constants['FORMAL_TEST_NAME'] + '-video.MOV');
                }
                this.cordovaService.deleteOldAudioFiles(mediaFiles, this.storageModel.getTrackingFileList(), this.constants.constants['RECORDING_LIFESPAN']);
            };
            DataService.prototype.setDisableInteractionCallback = function (callback) {
                this.disableInteractionCallback = callback;
            };
            DataService.prototype.setInteractionEndActivateTaskCallback = function (callback) {
                this.activateTaskEndCallback = callback;
            };
            DataService.prototype.clearInteractionEndActivateTaskCallback = function () {
                this.activateTaskEndCallback = null;
            };
            DataService.prototype.setInteractionStartActivateTaskCallback = function (callback) {
                this.activateTaskStartCallback = callback;
            };
            DataService.prototype.externalCallDisableInteractionCallback = function (setMe, showSpeaker) {
                if (this.disableInteractionCallback !== null) {
                    this.disableInteractionCallback(setMe, showSpeaker);
                }
            };
            DataService.prototype.shuffleArray = function (array) {
                var newArray = angular.copy(array);
                var currentIndex = newArray.length, temporaryValue, randomIndex;
                // While there remain elements to shuffle...
                while (0 !== currentIndex) {
                    // Pick a remaining element...
                    randomIndex = Math.floor(Math.random() * currentIndex);
                    currentIndex -= 1;
                    // And swap it with the current element.
                    temporaryValue = newArray[currentIndex];
                    newArray[currentIndex] = newArray[randomIndex];
                    newArray[randomIndex] = temporaryValue;
                }
                return newArray;
            };
            DataService.prototype.captureVideo = function (sFunc, eFunc) {
                var filename = 'week' + this.selectedWeekIndex + '-' + this.settings.storage_mode + '-video.MOV';
                this.cordovaService.captureVideo(sFunc, eFunc, filename);
            };
            // Day 3 task 5 & 6 audio recording of the child's voice
            DataService.prototype.startCaptureAudio = function () {
                var taskFilename = 'week' + (this.selectedWeekIndex + 1) + '-task' + (this.selectedTaskIndex + 1) + '-' + this.settings.storage_mode + '-audio.m4a';
                this.cordovaService.startCaptureAudio(taskFilename, function () {
                    console.log('Begin recording voice..');
                }, function (error) {
                    console.log('Error recording voice..' + error);
                });
            };
            // For Day 3 Task 5 & 6 a new recording always overwrites previous for this week, but one audio for each UsageStorage is copied.
            DataService.prototype.stopCaptureAudio = function (sFunc, eFunc) {
                var currentUsage = this.storageModel.weeks[this.selectedWeekIndex].days[this.selectedDayIndex].tasks[this.selectedTaskIndex].currentUsage;
                var d = currentUsage.accessed;
                var newTrackingAudioFilename = 'w' + (this.selectedWeekIndex + 1) + '_d' + (this.selectedDayIndex + 1) +
                    '_t' + (this.selectedTaskIndex + 1) + '-' + d.getFullYear() + '_' + (d.getMonth() + 1) + '_' + d.getDate() +
                    '-' + d.getHours() + '_' + d.getMinutes() + '_' + d.getSeconds() + '.m4a';
                var taskFilename = 'week' + (this.selectedWeekIndex + 1) + '-task' + (this.selectedTaskIndex + 1) + '-' + this.settings.storage_mode + '-audio.m4a';
                this.cordovaService.stopCaptureAudio(taskFilename, currentUsage, newTrackingAudioFilename, function (success) {
                    console.log('Finished recording voice..');
                    sFunc(success);
                }, function (error) {
                    eFunc(error);
                });
            };
            DataService.prototype.checkFile = function (filename, sFunc, eFunc) {
                if (this.desktopBrowserTesting) {
                    eFunc('');
                }
                else {
                    this.cordovaService.checkFile(filename, sFunc, eFunc);
                }
            };
            DataService.prototype.getAppVersion = function (callback) {
                this.cordovaService.getAppVersion(callback);
            };
            DataService.$inject = ['$http', '$window', '$timeout', 'CordovaService', 'NettskjemaService', 'ISPConstants'];
            return DataService;
        }());
        Services.DataService = DataService;
    })(Services = ISPApp.Services || (ISPApp.Services = {}));
})(ISPApp || (ISPApp = {}));
//# sourceMappingURL=dataService.js.map