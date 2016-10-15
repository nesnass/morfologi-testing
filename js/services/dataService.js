/// <reference path="../_references"/>
/// <reference path="../app.constants.ts"/>
/// <reference path="../models/models"/>
/// <reference path="./nettskjemaService"/>
var MorfologiApp;
(function (MorfologiApp) {
    var Services;
    (function (Services) {
        "use strict";
        var DataService = (function () {
            function DataService($http, $window, $timeout, nettsckjemaService, constants) {
                var _this = this;
                this.$http = $http;
                this.$window = $window;
                this.$timeout = $timeout;
                this.nettsckjemaService = nettsckjemaService;
                this.constants = constants;
                this.currentLanguage = "en";
                this.setupComplete = false;
                this.morfer = {};
                this.status = {
                    online: navigator.onLine || false,
                    posting_data: false,
                    unsynced_data: false
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
                this.activateTaskStartCallback = null;
                this.activateTaskEndCallback = null;
            }
            DataService.prototype.getStatus = function () {
                return this.status;
            };
            DataService.prototype.automaticallySendData = function () {
                this.attemptToPostUsageData();
            };
            // Make an attempt to post any new usage data to Nettskjema
            DataService.prototype.attemptToPostUsageData = function () {
                var _this = this;
                // If we receive a token, and are running on tablet, it is safe to assume we can then post to Nettskjema
                this.$http.get("http://nettskjema.uio.no/ping.html")
                    .then(function (success) {
                    console.log("Connected to Nettskjema");
                    _this.nettsckjemaService.setNettskjemaToken(success.data.toString());
                    if (_this.status.unsynced_data && !_this.status.posting_data) {
                        _this.postUsageData();
                    }
                }, function () {
                    _this.status.online = false;
                    console.log("Unable to connect to Nettskjema");
                });
            };
            DataService.prototype.setupAfterLogin = function () {
                var _this = this;
                if (!this.setupComplete) {
                    // Load session and morf files
                    this.$http.get(this.constants.constants["MORF_FILE"])
                        .then(function (morfData) {
                        console.log("Loaded morf file");
                        _this.morfer = morfData;
                        _this.$http.get(_this.constants.constants["SESSION_FILE"])
                            .then(function (sessionData) {
                            console.log("Loaded session file");
                            if (sessionData.hasOwnProperty(_this.user.sessionId)) {
                                _this.session = MorfologiApp.Session.fromData(sessionData[_this.user.sessionId]);
                                _this.createTasks();
                            }
                            _this.setupComplete = true;
                        }, function () {
                            console.log("Unable to load morf file");
                        });
                    }, function () {
                        console.log("Unable to load sessions file");
                    });
                }
            };
            DataService.prototype.login = function (username) {
                var _this = this;
                this.$http.get(this.constants.constants["USER_FILE"])
                    .then(function (users) {
                    console.log("Loaded user file");
                    if (users.hasOwnProperty(username)) {
                        _this.user = new MorfologiApp.User(username, users[username]["sessionId"]);
                        _this.setupAfterLogin();
                    }
                }, function () {
                    console.log("Unable to load user file");
                });
            };
            DataService.prototype.createTasks = function () {
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
            DataService.prototype.postUsageData = function () {
                var _this = this;
                this.status.posting_data = true;
                var postData = [];
                var postRemainingData = function () {
                    if (postData.length > 0) {
                        _this.nettsckjemaService.postTrackingDataItem(postData.pop(), function (data) {
                            console.log("Successful Nettskjema submission: " + data);
                            postRemainingData();
                        }, function (data) {
                            console.log("Error during Nettskjema submission: " + data);
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
                if (typeof this.introductionAudio !== "undefined") {
                    this.introductionAudio.pause();
                }
                this.$timeout(function () {
                    _this.introductionAudio = new Audio(url);
                    _this.introductionAudio.load();
                    _this.introductionAudio.addEventListener("ended", function () {
                        _this.disableInteractionCallback(false, true);
                        if (_this.activateTaskEndCallback !== null) {
                            _this.activateTaskEndCallback();
                        }
                    });
                }, 0);
            };
            DataService.prototype.playAudioIntroduction = function (delay) {
                var _this = this;
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
                        console.log("No introduction audio source found");
                        _this.disableInteractionCallback(false, true);
                        if (_this.activateTaskEndCallback !== null) {
                            _this.activateTaskEndCallback();
                        }
                    }
                }, delay);
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
            // Return a new array that is a shuffle of the provided array
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
            DataService.$inject = ["$http", "$window", "$timeout", "NettskjemaService", "MorfologiConstants"];
            return DataService;
        }());
        Services.DataService = DataService;
    })(Services = MorfologiApp.Services || (MorfologiApp.Services = {}));
})(MorfologiApp || (MorfologiApp = {}));
//# sourceMappingURL=dataService.js.map