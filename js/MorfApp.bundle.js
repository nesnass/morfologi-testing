/// <reference path="../typings/index.d.ts"/> 

/// <reference path="_references.ts"/>
var MorfologiApp;
(function (MorfologiApp) {
    "use strict";
    /**
     * Application-wide overall configuration
     * @param $stateProvider  Used for ionic internal routing.g /reward
     * @param $urlRouterProvider  Used for defining default route.
     * @param $httpProvider  Used for registering an interceptor (TokenInterceptor).
     */
    function configApp($stateProvider, $urlRouterProvider, $httpProvider, $controllerProvider, $sceDelegateProvider, $translateProvider) {
        $stateProvider
            .state("main", {
            name: "main",
            url: "/main",
            templateUrl: "./js/views/mainpanel/mainpanel.html"
        })
            .state("tasks", {
            name: "test",
            url: "/test",
            templateUrl: "./js/views/testpanel/testpanel.html"
        });
        $urlRouterProvider.otherwise("/main");
        $httpProvider.defaults.withCredentials = true;
        $sceDelegateProvider.resourceUrlWhitelist([
            "self",
            "https://nettskjema.uio.no/**",
            "cdvfile://localhost/documents/**",
            "file:///var/**"
        ]);
        // Translation
        $translateProvider.useSanitizeValueStrategy("escaped");
        $translateProvider.useStaticFilesLoader({
            prefix: "./languages/",
            suffix: ".json"
        });
        var lang = null;
        if (navigator["languages"]) {
            lang = navigator["languages"][0];
        }
        else {
            lang = navigator.language || navigator.userLanguage;
        }
        if (lang.indexOf("nn") > -1 || lang.indexOf("nb") > -1) {
            $translateProvider.preferredLanguage("nb");
            sessionStorage["lang"] = "nb";
        }
        else {
            $translateProvider.preferredLanguage("en");
            sessionStorage["lang"] = "en";
        }
        // Force to norwegian - remove if using multiple languages
        $translateProvider.preferredLanguage("nb");
    }
    MorfologiApp.configApp = configApp;
    configApp.$inject = ["$stateProvider", "$urlRouterProvider", "$httpProvider",
        "$controllerProvider", "$sceDelegateProvider", "$translateProvider"];
})(MorfologiApp || (MorfologiApp = {}));

/// <reference path="_references.ts"/>
var MorfologiApp;
(function (MorfologiApp) {
    "use strict";
    var MorfologiConstants = (function () {
        function MorfologiConstants() {
        }
        Object.defineProperty(MorfologiConstants, "constants", {
            get: function () {
                // Release number should be updated accordingly on new app releases  e.g.  isp_setup_r1.json, isp_storage_r1_sample.json
                return {
                    USER_FILE: "samples/users.json",
                    SESSION_FILE: "samples/sessions.json",
                    MORF_FILE: "samples/morfer.json",
                };
            },
            enumerable: true,
            configurable: true
        });
        ;
        return MorfologiConstants;
    }());
    MorfologiApp.MorfologiConstants = MorfologiConstants;
})(MorfologiApp || (MorfologiApp = {}));

/// <reference path="_references.ts"/>
var MorfologiApp;
(function (MorfologiApp) {
    "use strict";
    /**
     * Application-wide overall run function
     * @param $window  Used for configuring cordova plugins options.
     * @param $location  Re-route if storage is reloaded
     */
    function runApp($window, $location) {
    }
    MorfologiApp.runApp = runApp;
    runApp.$inject = ["$window", "$location", "DataService"];
})(MorfologiApp || (MorfologiApp = {}));

/// <reference path="../_references.ts"/>
var MorfologiApp;
(function (MorfologiApp) {
    "use strict";
    var Morf = (function () {
        function Morf(key, root, morphed, position) {
            this.key = key;
            this.root = root;
            this.morphed = morphed;
            this.position = position;
        }
        return Morf;
    }());
    MorfologiApp.Morf = Morf;
    // Represents one task in a set that is produced for a user session
    var Task = (function () {
        function Task() {
            this.morf = null;
            this.template = 0;
            this.completed = false;
            this.attempts = 0;
            this.answeredCorrectly = false;
        }
        Task.prototype.begin = function () {
            this.started = new Date();
        };
        Task.prototype.attempt = function () {
            this.attempts++;
        };
        Task.prototype.complete = function (correctlyAnswered) {
            this.completed = true;
            this.answeredCorrectly = correctlyAnswered;
            this.finished = new Date();
            var startedOn = moment(this.started);
            var finishedOn = moment(this.finished);
            this.duration = moment.duration(finishedOn.diff(startedOn)).asSeconds();
        };
        return Task;
    }());
    MorfologiApp.Task = Task;
    // This holds a construction of the tasks the user will go through in the current session
    var Session = (function () {
        function Session(name, shuffle, unforgiving) {
            this.name = name;
            this.shuffle = shuffle;
            this.unforgiving = unforgiving;
            this.tasks = [];
            this.inactivePeriods = [];
            this.selectedTask = 0;
            this.started = null;
            this.finished = null;
            this.duration = 0;
        }
        Session.prototype.selectTask = function (index) {
            if (index > -1 && index < this.tasks.length) {
                this.selectedTask = index;
            }
        };
        Session.prototype.begin = function () {
            this.started = new Date();
        };
        Session.prototype.complete = function () {
            this.finished = new Date();
            var startedOn = moment(this.started);
            var finishedOn = moment(this.finished);
            this.duration = moment.duration(finishedOn.diff(startedOn)).asSeconds();
        };
        // Record inactive period if above a specified duration
        Session.prototype.inactive = function (duration) {
            if (duration > 30) {
                this.inactivePeriods.push(duration);
            }
        };
        Session.prototype.completeSelectedTask = function (correctlyAnswered) {
            this.tasks[this.selectedTask].complete(correctlyAnswered);
        };
        Session.fromData = function (data) {
            return new this(data.name, data.shuffle, data.unforgiving);
        };
        return Session;
    }());
    MorfologiApp.Session = Session;
    var Avatar = (function () {
        function Avatar() {
        }
        return Avatar;
    }());
    MorfologiApp.Avatar = Avatar;
    var User = (function () {
        function User(username, sessionId) {
            this.username = username;
            this.sessionId = sessionId;
            this.userID = "";
            this.avatar = null;
            this.seenMorfs = [];
        }
        return User;
    }());
    MorfologiApp.User = User;
})(MorfologiApp || (MorfologiApp = {}));

/// <reference path="../_references.ts"/>
/// <reference path="../app.constants.ts"/>
/// <reference path="../models/models.ts"/>
var MorfologiApp;
(function (MorfologiApp) {
    var Services;
    (function (Services) {
        "use strict";
        var NettskjemaService = (function () {
            function NettskjemaService($http) {
                this.$http = $http;
                this.token = "";
                this.UUID = "";
            }
            NettskjemaService.prototype.setNettskjemaToken = function (token) {
                this.token = token;
            };
            NettskjemaService.prototype.postTrackingDataItem = function (item, sFunc, eFunc) {
                var _this = this;
                var postItem = function (item, audio_file) {
                    var form_data = item.asFormDataWithAttachment(audio_file, _this.UUID);
                    _this.$http.post("https://nettskjema.uio.no/answer/deliver.json?formId=74195", form_data, {
                        transformRequest: angular.identity,
                        headers: {
                            "Content-Type": undefined,
                            "NETTSKJEMA_CSRF_PREVENTION": _this.token
                        }
                    }).then(function (success) {
                        var data = success.data;
                        if (success.status !== 200 || data.indexOf("success") === -1 || data.indexOf("failure") > -1) {
                            eFunc(data);
                        }
                        else {
                            item.markAsSynced();
                            sFunc(data);
                        }
                    }, function () {
                        eFunc("Error sending usage data to server - no status response");
                    });
                };
                postItem(item, null);
            };
            NettskjemaService.$inject = ["$http", "CordovaService"];
            return NettskjemaService;
        }());
        Services.NettskjemaService = NettskjemaService;
    })(Services = MorfologiApp.Services || (MorfologiApp.Services = {}));
})(MorfologiApp || (MorfologiApp = {}));

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

/// <reference path="../../_references.ts"/>
/// <reference path="../../services/dataService"/>
var MorfologiApp;
(function (MorfologiApp) {
    var Directives;
    (function (Directives) {
        "use strict";
        var ResizeController = (function () {
            function ResizeController(dataService, $window) {
                this.dataService = dataService;
                this.$window = $window;
            }
            ;
            ResizeController.$inject = ["DataService", "$window"];
            return ResizeController;
        }());
        function linker(scope, element, ctrl) {
            var w = angular.element(ctrl.$window);
            scope.getWindowDimensions = function () {
                return {
                    "VIEW_HEIGHT": element.prop("offsetHeight"),
                    "VIEW_WIDTH": element.prop("offsetWidth")
                };
            };
            scope.$watch(scope.getWindowDimensions, function (newValue) {
                ctrl.dataService.setResizableDivSize(newValue);
            }, true);
            w.bind("resize", function () {
                scope.$apply();
            });
            ctrl.dataService.setResizableDivSize(scope.getWindowDimensions());
        }
        function ispResize() {
            return {
                restrict: "A",
                controller: ResizeController,
                link: linker
            };
        }
        Directives.ispResize = ispResize;
    })(Directives = MorfologiApp.Directives || (MorfologiApp.Directives = {}));
})(MorfologiApp || (MorfologiApp = {}));

/// <reference path="../../../js/_references"/>
/// <reference path="../../models/models"/>
/// <reference path="../../services/dataService"/>
var MorfologiApp;
(function (MorfologiApp) {
    var Controllers;
    (function (Controllers) {
        "use strict";
        var Task1Controller = (function () {
            function Task1Controller($scope, $timeout, dataService) {
                var _this = this;
                this.$scope = $scope;
                this.$timeout = $timeout;
                this.dataService = dataService;
                this.opacity = 0;
                // this.setupItems();
                $timeout(function () {
                    _this.opacity = 1;
                }, 1000);
            }
            Task1Controller.$inject = ["$scope", "$timeout", "DataService"];
            return Task1Controller;
        }());
        Controllers.Task1Controller = Task1Controller;
    })(Controllers = MorfologiApp.Controllers || (MorfologiApp.Controllers = {}));
})(MorfologiApp || (MorfologiApp = {}));

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
var MorfologiApp;
(function (MorfologiApp) {
    "use strict";
    /**
     * Array of dependencies to be injected in the application "dependencies".
     */
    var dependencies = [
        "ui.router",
        "pascalprecht.translate",
        "ngDraggable",
        "angular-flippy"
    ];
    angular.module("MorfologiApp", dependencies)
        .constant("MorfologiConstants", MorfologiApp.MorfologiConstants)
        .service(MorfologiApp.Services)
        .directive(MorfologiApp.Directives)
        .controller(MorfologiApp.Controllers)
        .config(MorfologiApp.configApp)
        .run(MorfologiApp.runApp);
})(MorfologiApp || (MorfologiApp = {}));

/// <reference path="../_references.ts"/>
/// <reference path="../models/models"/>
var MorfologiApp;
(function (MorfologiApp) {
    var Services;
    (function (Services) {
        "use strict";
        var ServerService = (function () {
            function ServerService($window, $timeout) {
                this.$window = $window;
                this.$timeout = $timeout;
            }
            ServerService.$inject = ["$window", "$timeout"];
            return ServerService;
        }());
        Services.ServerService = ServerService;
    })(Services = MorfologiApp.Services || (MorfologiApp.Services = {}));
})(MorfologiApp || (MorfologiApp = {}));

/// <reference path="../../_references.ts"/>
/// <reference path="../../services/dataService"/>
/**
 * On click, plays a video
 * On end, activates the next task
 *
 * Use this directive in the form:
 * <div isp-video-player></div>
 */
var MorfologiApp;
(function (MorfologiApp) {
    var Directives;
    (function (Directives) {
        "use strict";
        var VideoPlayerController = (function () {
            function VideoPlayerController(isolatedScope, $sce) {
                var _this = this;
                this.isolatedScope = isolatedScope;
                this.$sce = $sce;
                this.posterUrl = "";
                this.videoUrl = "";
                this.playing = false;
                this.playImage = "1";
                this.videoUrl = this.$sce.getTrustedResourceUrl(this.isolatedScope.ispVideoUrl);
                this.posterUrl = this.isolatedScope.ispPosterUrl;
                if (typeof this.isolatedScope.ispType !== "undefined" && this.isolatedScope.ispType != null) {
                    if (this.isolatedScope.ispType === "task8") {
                        this.playImage = "2";
                    }
                    else if (this.isolatedScope.ispType === "none") {
                        this.playImage = "";
                    }
                    else {
                        this.playImage = "1";
                    }
                }
                isolatedScope.$watch(function () { return isolatedScope.ispActive["playing"]; }, function (newValue) {
                    if (newValue === true) {
                        if (isolatedScope.ispActive["playing"] === true) {
                            _this.playVideo();
                        }
                    }
                });
            }
            ;
            VideoPlayerController.prototype.playVideo = function () {
                if (this.isolatedScope.ispActive["active"]) {
                    this.playing = true;
                    this.video.load();
                    this.video.play();
                    this.isolatedScope.ispOnPlay();
                }
            };
            VideoPlayerController.$inject = ["$scope", "$sce"];
            return VideoPlayerController;
        }());
        function linker(isolatedScope, element, attributes, ctrl) {
            var c = element.children();
            ctrl.video = c[0];
            ctrl.video.autoplay = false;
            ctrl.video.addEventListener("ended", function () {
                ctrl.playing = false;
                isolatedScope.ispActive["playing"] = false;
                isolatedScope.ispOnCompleted();
                isolatedScope.$digest();
            });
        }
        // directive declaration
        function ispVideoPlayer() {
            return {
                restrict: "A",
                controller: VideoPlayerController,
                controllerAs: "vpC",
                replace: true,
                templateUrl: "js/components/videoplayer/videoplayer.html",
                scope: {
                    ispVideoUrl: "@",
                    ispPosterUrl: "@",
                    ispOnCompleted: "&",
                    ispActive: "=",
                    ispOnPlay: "&",
                    ispType: "@"
                },
                link: linker
            };
        }
        Directives.ispVideoPlayer = ispVideoPlayer;
        // Html5 video fix
        function html5videofix() {
            return {
                restrict: "A",
                link: function (isolatedScope, element, attr) {
                    attr.$set("src", attr["vsrc"]);
                    attr.$set("poster", attr["psrc"]);
                    attr.$set("autoplay", false);
                    attr.$set("webkit-playsinline", "");
                    attr.$set("playsinline", "");
                }
            };
        }
        Directives.html5videofix = html5videofix;
    })(Directives = MorfologiApp.Directives || (MorfologiApp.Directives = {}));
})(MorfologiApp || (MorfologiApp = {}));

/// <reference path="../../_references"/>
/// <reference path="../../models/models"/>
var MorfologiApp;
(function (MorfologiApp) {
    var Controllers;
    (function (Controllers) {
        "use strict";
        var MainPanelController = (function () {
            function MainPanelController($http, $location, $scope) {
                this.$http = $http;
                this.$location = $location;
                this.$scope = $scope;
                this.language = "";
                this.initialise();
            }
            MainPanelController.prototype.initialise = function () {
                // this.language = this.dataService.getLanguage();
            };
            MainPanelController.prototype.selectTask = function (taskType) {
                this.taskTemplateUrl = "js/tasks/task" + taskType + "/template.html";
            };
            MainPanelController.$inject = ["$http", "$location", "$scope"];
            return MainPanelController;
        }());
        Controllers.MainPanelController = MainPanelController;
    })(Controllers = MorfologiApp.Controllers || (MorfologiApp.Controllers = {}));
})(MorfologiApp || (MorfologiApp = {}));

/// <reference path="../../_references"/>
/// <reference path="../../models/models"/>
var MorfologiApp;
(function (MorfologiApp) {
    var Controllers;
    (function (Controllers) {
        "use strict";
        var TestPanelController = (function () {
            function TestPanelController($http, $location, $scope) {
                this.$http = $http;
                this.$location = $location;
                this.$scope = $scope;
                this.language = "";
                this.initialise();
            }
            TestPanelController.prototype.initialise = function () {
                // this.language = this.dataService.getLanguage();
            };
            TestPanelController.$inject = ["$http", "$location", "$scope"];
            return TestPanelController;
        }());
        Controllers.TestPanelController = TestPanelController;
    })(Controllers = MorfologiApp.Controllers || (MorfologiApp.Controllers = {}));
})(MorfologiApp || (MorfologiApp = {}));

/// <reference path="../../../js/_references"/>
/// <reference path="../../models/models"/>
/// <reference path="../../services/dataService"/>
var MorfologiApp;
(function (MorfologiApp) {
    var Controllers;
    (function (Controllers) {
        "use strict";
        var Task2Controller = (function () {
            function Task2Controller($scope, $timeout, dataService) {
                this.$scope = $scope;
                this.$timeout = $timeout;
                this.dataService = dataService;
                this.stage = "stageOne";
                this.correctCounter = 0;
                var correctToShuffle = [];
                var incorrectToShuffle = [];
                for (var i = 1; i < 25; i++) {
                    var item = {
                        image: "content/" + this.word + "/" + this.dayWord + "/correct/" + i + ".jpg",
                        audio: "content/" + this.word + "/" + this.dayWord + "/correct/" + i + ".mp3",
                        correct: true,
                        highlighted: false
                    };
                    correctToShuffle.push(item);
                }
                for (var i = 1; i < 7; i++) {
                    var item = {
                        image: "content/" + this.word + "/" + this.dayWord + "/incorrect/" + i + ".jpg",
                        audio: "content/" + this.word + "/" + this.dayWord + "/incorrect/" + i + ".mp3",
                        correct: false,
                        highlighted: false
                    };
                    incorrectToShuffle.push(item);
                }
                var stageTwoCorrect = correctToShuffle.splice(12, 12);
                var stageTwoIncorrect = incorrectToShuffle.splice(3, 3);
                this.stageOne = dataService.shuffleArray(correctToShuffle.concat(incorrectToShuffle));
                this.stageTwo = dataService.shuffleArray(stageTwoCorrect.concat(stageTwoIncorrect));
                // This should be run at the end of the constructor
                /*
                let handle = this;
                dataService.setInteractionEndActivateTaskCallback(() => {
                    this.activateTask(handle);
                });
                */
                dataService.setupAudioIntroduction("content/" + this.word + "/task1/instruction-" + this.dayWord + ".mp3");
                dataService.playAudioIntroduction(3000);
            }
            Task2Controller.$inject = ["$scope", "$timeout", "DataService"];
            return Task2Controller;
        }());
        Controllers.Task2Controller = Task2Controller;
    })(Controllers = MorfologiApp.Controllers || (MorfologiApp.Controllers = {}));
})(MorfologiApp || (MorfologiApp = {}));

/// <reference path="../../../js/_references"/>
/// <reference path="../../models/models"/>
/// <reference path="../../services/dataService"/>
var MorfologiApp;
(function (MorfologiApp) {
    var Controllers;
    (function (Controllers) {
        "use strict";
        var Task3Controller = (function () {
            function Task3Controller($scope, $timeout, dataService) {
                this.$scope = $scope;
                this.$timeout = $timeout;
                this.dataService = dataService;
                this.iHeight = 111;
                this.iWidth = 148;
                this.page = 1;
                this.round = 0;
                this.bounce = false;
                this.familyCharacter = "";
                this.droppedObjects = [];
                this.draggableObjects1 = [];
                this.draggableObjects2 = [];
                this.draggableObjects3 = [];
                this.vanIsClosed = false;
                this.activatePointer = false;
                this.kangarooData = [
                    {
                        body: {
                            width: "500px",
                            bottom: "100px",
                            left: "-80px"
                        },
                        pouch: {
                            width: "150px",
                            height: "150px",
                            left: "70px",
                            top: "300px"
                        },
                        pointer: {
                            left: "100px",
                            top: "400px"
                        },
                        pageThreeData: {
                            "code": "zoomable-image",
                            "id": 11,
                            "sequence": -1,
                            "description": "kangaroo jumps off screen",
                            "start": {
                                "x": -50,
                                "y": 250,
                                "w": 400,
                                "h": 400
                            },
                            "transition": {
                                "x": 1900,
                                "y": 800,
                                "scale": 1,
                                "duration": 4
                            },
                            "opacity": 1,
                            "visible_before": true,
                            "visible_after": true,
                            "auto_start": true,
                            "auto_return": false,
                            "allow_return": false,
                            "type": "png"
                        }
                    },
                    {
                        body: {
                            width: "500px",
                            bottom: "100px",
                            left: "-100px"
                        },
                        pouch: {
                            width: "150px",
                            height: "150px",
                            left: "65px",
                            top: "350px"
                        },
                        pointer: {
                            left: "350px",
                            top: "500px"
                        },
                        pageThreeData: {
                            "code": "zoomable-image",
                            "id": 12,
                            "sequence": -1,
                            "description": "kangaroo jumps off screen",
                            "start": {
                                "x": 250,
                                "y": 380,
                                "w": 300,
                                "h": 300
                            },
                            "transition": {
                                "x": -1900,
                                "y": -400,
                                "scale": 1,
                                "duration": 5
                            },
                            "opacity": 1,
                            "visible_before": true,
                            "visible_after": true,
                            "auto_start": true,
                            "auto_return": false,
                            "allow_return": false,
                            "type": "png"
                        }
                    },
                    {
                        body: {
                            width: "500px",
                            bottom: "100px",
                            left: "-100px"
                        },
                        pouch: {
                            width: "100px",
                            height: "100px",
                            left: "140px",
                            top: "400px"
                        },
                        pointer: {
                            left: "550px",
                            top: "450px"
                        },
                        pageThreeData: {
                            "code": "zoomable-image",
                            "id": 13,
                            "sequence": -1,
                            "description": "kangaroo jumps off screen",
                            "start": {
                                "x": 450,
                                "y": 300,
                                "w": 250,
                                "h": 250
                            },
                            "transition": {
                                "x": -1000,
                                "y": -1000,
                                "scale": 1,
                                "duration": 3
                            },
                            "opacity": 1,
                            "visible_before": true,
                            "visible_after": true,
                            "auto_start": true,
                            "auto_return": false,
                            "allow_return": false,
                            "type": "png"
                        }
                    }
                ];
                var correctToShuffle = [];
                var incorrectToShuffle = [];
                for (var i = 1; i < 25; i++) {
                    var item = {
                        image: "content/" + this.word + "/" + this.dayWord + "/correct/" + i + ".jpg",
                        audio: "content/" + this.word + "/" + this.dayWord + "/correct/" + i + ".mp3",
                        correct: true,
                        style: {
                            "top": 0,
                            "left": 0,
                            "width": 0,
                            "height": 0
                        },
                        highlighted: false,
                        draggable: true,
                        transition: true,
                        position: 0
                    };
                    correctToShuffle.push(item);
                }
                for (var i = 1; i < 7; i++) {
                    var item = {
                        image: "content/" + this.word + "/" + this.dayWord + "/incorrect/" + i + ".jpg",
                        audio: "content/" + this.word + "/" + this.dayWord + "/incorrect/" + i + ".mp3",
                        correct: false,
                        style: {
                            "top": 0,
                            "left": 0,
                            "width": 0,
                            "height": 0
                        },
                        highlighted: false,
                        draggable: true,
                        transition: true,
                        position: 0
                    };
                    incorrectToShuffle.push(item);
                }
                var correctShuffled = dataService.shuffleArray(correctToShuffle);
                var incorrectShuffled = dataService.shuffleArray(incorrectToShuffle);
                this.draggableObjects1 = dataService.shuffleArray(correctShuffled.splice(0, 8).concat(incorrectShuffled.splice(0, 2)));
                this.draggableObjects2 = dataService.shuffleArray(correctShuffled.splice(0, 8).concat(incorrectShuffled.splice(0, 2)));
                this.draggableObjects3 = dataService.shuffleArray(correctShuffled.concat(incorrectShuffled));
                // this.itemSource = dataService.shuffleArray(correctToShuffle.concat(incorrectToShuffle));
                this.dataService.setupAudioIntroduction("content/common/audio/consolidation/task5/introduction.mp3");
                this.dataService.playAudioIntroduction(2000);
                this.$timeout(function () {
                    // this.playMainIntro();
                }, 11000);
            }
            Task3Controller.$inject = ["$scope", "$timeout", "DataService"];
            return Task3Controller;
        }());
        Controllers.Task3Controller = Task3Controller;
    })(Controllers = MorfologiApp.Controllers || (MorfologiApp.Controllers = {}));
})(MorfologiApp || (MorfologiApp = {}));

/// <reference path="../../../js/_references"/>
/// <reference path="../../models/models"/>
/// <reference path="../../services/dataService"/>
var MorfologiApp;
(function (MorfologiApp) {
    var Controllers;
    (function (Controllers) {
        "use strict";
        var Task5Controller = (function () {
            function Task5Controller($scope, $timeout, dataService) {
                var _this = this;
                this.$scope = $scope;
                this.$timeout = $timeout;
                this.dataService = dataService;
                this.iHeight = 111;
                this.iWidth = 148;
                this.page = 1;
                this.round = 0;
                this.familyCharacter = "";
                this.droppedObjects = [];
                this.draggableObjects1 = [];
                this.draggableObjects2 = [];
                this.draggableObjects3 = [];
                this.vanIsClosed = false;
                this.opacity = 0;
                this.pageOneImageData = {
                    "code": "zoomable-image",
                    "id": 11,
                    "sequence": -1,
                    "description": "car drives on to screen",
                    "start": {
                        "x": -900,
                        "y": 100,
                        "w": 800,
                        "h": 600
                    },
                    "transition": {
                        "x": 900,
                        "y": 0,
                        "scale": 1,
                        "duration": 5
                    },
                    "opacity": 1,
                    "visible_before": true,
                    "visible_after": true,
                    "auto_start": true,
                    "auto_return": false,
                    "allow_return": false,
                    "type": "png"
                };
                this.pageThreeImageData = {
                    "code": "zoomable-image",
                    "id": 11,
                    "sequence": -1,
                    "description": "car drives off screen",
                    "start": {
                        "x": -900,
                        "y": 100,
                        "w": 800,
                        "h": 600
                    },
                    "transition": {
                        "x": 1900,
                        "y": 0,
                        "scale": 1,
                        "duration": 6
                    },
                    "opacity": 1,
                    "visible_before": true,
                    "visible_after": true,
                    "auto_start": true,
                    "auto_return": false,
                    "allow_return": false,
                    "type": "png"
                };
                var correctToShuffle = [];
                var incorrectToShuffle = [];
                for (var i = 1; i < 25; i++) {
                    var item = {
                        image: "content/" + this.word + "/" + this.dayWord + "/correct/" + i + ".jpg",
                        audio: "content/" + this.word + "/" + this.dayWord + "/correct/" + i + ".mp3",
                        correct: true,
                        style: {
                            "top": 0,
                            "left": 0,
                            "width": 0,
                            "height": 0
                        },
                        highlighted: false,
                        draggable: true,
                        transition: true,
                        position: 0
                    };
                    correctToShuffle.push(item);
                }
                for (var i = 1; i < 7; i++) {
                    var item = {
                        image: "content/" + this.word + "/" + this.dayWord + "/incorrect/" + i + ".jpg",
                        audio: "content/" + this.word + "/" + this.dayWord + "/incorrect/" + i + ".mp3",
                        correct: false,
                        style: {
                            "top": 0,
                            "left": 0,
                            "width": 0,
                            "height": 0
                        },
                        highlighted: false,
                        draggable: true,
                        transition: true,
                        position: 0
                    };
                    incorrectToShuffle.push(item);
                }
                var correctShuffled = dataService.shuffleArray(correctToShuffle);
                var incorrectShuffled = dataService.shuffleArray(incorrectToShuffle);
                this.draggableObjects1 = dataService.shuffleArray(correctShuffled.splice(0, 8).concat(incorrectShuffled.splice(0, 2)));
                this.draggableObjects2 = dataService.shuffleArray(correctShuffled.splice(0, 8).concat(incorrectShuffled.splice(0, 2)));
                this.draggableObjects3 = dataService.shuffleArray(correctShuffled.concat(incorrectShuffled));
                this.dataService.setInteractionEndActivateTaskCallback(function () {
                    _this.dataService.clearInteractionEndActivateTaskCallback();
                    _this.dataService.setupAudioIntroduction("content/common/audio/consolidation/task3/instruction.mp3");
                    _this.dataService.playAudioIntroduction(1000);
                });
                this.dataService.setupAudioIntroduction("content/common/audio/consolidation/task3/van-stopping.mp3");
                this.dataService.playAudioIntroduction(1000);
            }
            Task5Controller.$inject = ["$scope", "$timeout", "DataService"];
            return Task5Controller;
        }());
        Controllers.Task5Controller = Task5Controller;
    })(Controllers = MorfologiApp.Controllers || (MorfologiApp.Controllers = {}));
})(MorfologiApp || (MorfologiApp = {}));

/// <reference path="../../../js/_references"/>
/// <reference path="../../models/models"/>
/// <reference path="../../services/dataService"/>
var MorfologiApp;
(function (MorfologiApp) {
    var Controllers;
    (function (Controllers) {
        "use strict";
        var Task6Controller = (function () {
            function Task6Controller($scope, $timeout, dataService) {
                var _this = this;
                this.$scope = $scope;
                this.$timeout = $timeout;
                this.dataService = dataService;
                this.iHeight = 111;
                this.iWidth = 148;
                this.page = 1;
                this.round = 0;
                this.familyCharacter = "";
                this.droppedObjects = [];
                this.draggableObjects1 = [];
                this.draggableObjects2 = [];
                this.draggableObjects3 = [];
                this.vanIsClosed = false;
                this.opacity = 0;
                this.pageOneImageData = {
                    "code": "zoomable-image",
                    "id": 11,
                    "sequence": -1,
                    "description": "car drives on to screen",
                    "start": {
                        "x": -900,
                        "y": 100,
                        "w": 800,
                        "h": 600
                    },
                    "transition": {
                        "x": 900,
                        "y": 0,
                        "scale": 1,
                        "duration": 5
                    },
                    "opacity": 1,
                    "visible_before": true,
                    "visible_after": true,
                    "auto_start": true,
                    "auto_return": false,
                    "allow_return": false,
                    "type": "png"
                };
                this.pageThreeImageData = {
                    "code": "zoomable-image",
                    "id": 11,
                    "sequence": -1,
                    "description": "car drives off screen",
                    "start": {
                        "x": -900,
                        "y": 100,
                        "w": 800,
                        "h": 600
                    },
                    "transition": {
                        "x": 1900,
                        "y": 0,
                        "scale": 1,
                        "duration": 6
                    },
                    "opacity": 1,
                    "visible_before": true,
                    "visible_after": true,
                    "auto_start": true,
                    "auto_return": false,
                    "allow_return": false,
                    "type": "png"
                };
                var correctToShuffle = [];
                var incorrectToShuffle = [];
                for (var i = 1; i < 25; i++) {
                    var item = {
                        image: "content/" + this.word + "/" + this.dayWord + "/correct/" + i + ".jpg",
                        audio: "content/" + this.word + "/" + this.dayWord + "/correct/" + i + ".mp3",
                        correct: true,
                        style: {
                            "top": 0,
                            "left": 0,
                            "width": 0,
                            "height": 0
                        },
                        highlighted: false,
                        draggable: true,
                        transition: true,
                        position: 0
                    };
                    correctToShuffle.push(item);
                }
                for (var i = 1; i < 7; i++) {
                    var item = {
                        image: "content/" + this.word + "/" + this.dayWord + "/incorrect/" + i + ".jpg",
                        audio: "content/" + this.word + "/" + this.dayWord + "/incorrect/" + i + ".mp3",
                        correct: false,
                        style: {
                            "top": 0,
                            "left": 0,
                            "width": 0,
                            "height": 0
                        },
                        highlighted: false,
                        draggable: true,
                        transition: true,
                        position: 0
                    };
                    incorrectToShuffle.push(item);
                }
                var correctShuffled = dataService.shuffleArray(correctToShuffle);
                var incorrectShuffled = dataService.shuffleArray(incorrectToShuffle);
                this.draggableObjects1 = dataService.shuffleArray(correctShuffled.splice(0, 8).concat(incorrectShuffled.splice(0, 2)));
                this.draggableObjects2 = dataService.shuffleArray(correctShuffled.splice(0, 8).concat(incorrectShuffled.splice(0, 2)));
                this.draggableObjects3 = dataService.shuffleArray(correctShuffled.concat(incorrectShuffled));
                this.dataService.setInteractionEndActivateTaskCallback(function () {
                    _this.dataService.clearInteractionEndActivateTaskCallback();
                    _this.dataService.setupAudioIntroduction("content/common/audio/consolidation/task3/instruction.mp3");
                    _this.dataService.playAudioIntroduction(1000);
                });
                this.dataService.setupAudioIntroduction("content/common/audio/consolidation/task3/van-stopping.mp3");
                this.dataService.playAudioIntroduction(1000);
            }
            Task6Controller.$inject = ["$scope", "$timeout", "DataService"];
            return Task6Controller;
        }());
        Controllers.Task6Controller = Task6Controller;
    })(Controllers = MorfologiApp.Controllers || (MorfologiApp.Controllers = {}));
})(MorfologiApp || (MorfologiApp = {}));

//# sourceMappingURL=MorfApp.bundle.js.map
