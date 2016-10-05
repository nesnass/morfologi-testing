/// <reference path="../../_references.ts"/>
/// <reference path="../../models/models.ts"/>
/// <reference path="../../services/dataService.ts"/>
var ISPApp;
(function (ISPApp) {
    var Controllers;
    (function (Controllers) {
        "use strict";
        var MainPanelController = (function () {
            function MainPanelController($http, $ionicPlatform, $ionicLoading, $ionicPopup, $location, $stateParams, $scope, dataService) {
                var _this = this;
                this.$http = $http;
                this.$ionicPlatform = $ionicPlatform;
                this.$ionicLoading = $ionicLoading;
                this.$ionicPopup = $ionicPopup;
                this.$location = $location;
                this.$stateParams = $stateParams;
                this.$scope = $scope;
                this.dataService = dataService;
                this.weeks = null;
                this.language = "";
                this.showingPanel = 'weeks';
                this.showSkipDay = false;
                this.didUserHoldForThreeSeconds = 0;
                this.appVersion = ''; // cordova plugin add https://github.com/whiteoctober/cordova-plugin-app-version.git
                this.showCheats = false;
                $ionicPlatform.ready(function () {
                    if (!dataService.getDeviceReady()) {
                        dataService.setDeviceReady(true);
                        console.log('Init from device ready');
                        _this.initialise();
                    }
                });
                $scope.$on('$ionicView.enter', function () {
                    if (dataService.getDeviceReady() || dataService.getDesktopBrowserTesting()) {
                        console.log('Init from view entry');
                        _this.initialise();
                    }
                });
            }
            MainPanelController.prototype.initialise = function () {
                var _this = this;
                this.dataService.getAppVersion(function (version) {
                    _this.appVersion = version;
                });
                this.language = this.dataService.getLanguage();
                this.formalStartDate = this.dataService.getFormalStartDate();
                this.now = new Date();
                this.showCheats = this.dataService.getShowCheats();
                this.skipDayPassword = '';
                this.weekSelected = false;
                this.consolidation = false;
                this.setup();
            };
            MainPanelController.prototype.setup = function () {
                var _this = this;
                var weekKey = 'week';
                this.dataService.checkStorageAndSetup(function (return_to_home) {
                    _this.username = _this.dataService.getUsername();
                    _this.common = _this.dataService.getCommon();
                    _this.weeks = _this.dataService.getWeeks();
                    _this.achievement = _this.dataService.getAchievement();
                    _this.selectedWeekIndex = _this.dataService.getWeek();
                    if (_this.username === '') {
                        _this.showingPanel = 'username';
                    }
                    else if (_this.achievement.avatar === -1) {
                        _this.showingPanel = 'avatar';
                    }
                    else {
                        _this.showingPanel = 'weeks';
                    }
                    var selectWeek = return_to_home ? Number.NaN : parseInt(_this.$stateParams[weekKey], 10);
                    if (!isNaN(selectWeek) && selectWeek >= 0 && selectWeek < _this.weeks.length) {
                        _this.selectWeek(selectWeek);
                    }
                    _this.dataService.automaticallySendData();
                });
            };
            MainPanelController.prototype.beginHoldSkipDay = function (event) {
                var e = event['timeStamp'] ? event : event.gesture;
                this.didUserHoldForThreeSeconds = e.timeStamp;
            };
            ;
            MainPanelController.prototype.releaseToSkipDay = function (event) {
                if (this.didUserHoldForThreeSeconds === 0) {
                    return;
                }
                var e = event['timeStamp'] ? event : event.gesture;
                if (e.timeStamp - this.didUserHoldForThreeSeconds > 4000) {
                    this.showSkipDay = true;
                    this.now = new Date();
                }
                this.didUserHoldForThreeSeconds = 0; // reset after each release
            };
            ;
            MainPanelController.prototype.skipToday = function (password) {
                if (typeof password !== 'undefined' && password !== null && password !== '') {
                    this.skipDayPassword = password;
                }
                this.dataService.skipToday(this.skipDayPassword);
                this.skipDayPassword = '';
                this.showSkipDay = false;
                this.selectWeek(this.selectedWeekIndex);
            };
            MainPanelController.prototype.setUsername = function () {
                if (this.username !== '') {
                    this.dataService.setUsername(this.username);
                    this.dataService.writeStorage(null, null, false);
                    this.showingPanel = this.achievement.avatar === -1 ? 'avatar' : 'weeks';
                }
            };
            MainPanelController.prototype.getWeekStyle = function (weekIndex) {
                var style = {
                    'border': '10px solid black !important',
                    'border-radius': '20px !important',
                    'margin': '10px !important'
                };
                if (this.achievement.weekIndex === weekIndex - 1) {
                    style['-webkit-box-shadow'] = '0 0 15px 5px rgba(255,255,0,1)';
                    style['box-shadow'] = '0 0 1px 5px ' + 'yellow' + ', ' +
                        '0 0 8px 8px ' + 'black' + ', ' +
                        '0 0 1px 15px ' + 'yellow';
                }
                return style;
            };
            MainPanelController.prototype.selectWeek = function (weekIndex) {
                if (weekIndex > this.achievement.weekIndex + 1) {
                    return;
                }
                else {
                    this.dataService.setWeek(weekIndex);
                    this.selectedWeekIndex = weekIndex;
                    this.weekSelected = true;
                    this.consolidation = this.dataService.getWord().indexOf('consolidation') > -1;
                    if (this.achievement.weekIndex >= weekIndex) {
                        this.pathIndex = 3;
                    }
                    else {
                        this.pathIndex = this.achievement.dayIndex + 1;
                    }
                }
            };
            MainPanelController.prototype.selectDay = function (dayIndex, event) {
                event.stopImmediatePropagation();
                this.dataService.setDay(dayIndex);
                this.$location.path("/tasks");
            };
            MainPanelController.prototype.selectAvatar = function (avatarIndex) {
                this.dataService.setAvatar(avatarIndex);
                this.dataService.writeStorage(null, null, false);
                this.showingPanel = 'weeks';
            };
            MainPanelController.prototype.backToWeeks = function () {
                this.weekSelected = false;
                this.consolidation = false;
            };
            MainPanelController.prototype.rewardMe = function () {
                this.$location.path("/reward");
            };
            // TESTING ONLY!!
            MainPanelController.prototype.enableAllWeeks = function () {
                var totalWeeks = this.dataService.getWeeks().length;
                var selectedWeek = this.dataService.getAchievement().weekIndex;
                while (selectedWeek < totalWeeks - 1) {
                    this.skipToday('frosk');
                    selectedWeek = this.dataService.getAchievement().weekIndex;
                }
                this.backToWeeks();
            };
            MainPanelController.$inject = ['$http', '$ionicPlatform', '$ionicLoading', '$ionicPopup', '$location', '$stateParams', '$scope', 'DataService'];
            return MainPanelController;
        }());
        Controllers.MainPanelController = MainPanelController;
    })(Controllers = ISPApp.Controllers || (ISPApp.Controllers = {}));
})(ISPApp || (ISPApp = {}));
//# sourceMappingURL=mainpanel.js.map