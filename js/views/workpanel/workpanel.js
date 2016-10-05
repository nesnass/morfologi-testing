/// <reference path="../../_references.ts"/>
/// <reference path="../../models/models.ts"/>
/// <reference path="../../services/dataService.ts"/>
var ISPApp;
(function (ISPApp) {
    var Controllers;
    (function (Controllers) {
        "use strict";
        var WorkPanelController = (function () {
            function WorkPanelController($location, $ionicLoading, $ionicPopup, $timeout, $scope, dataService) {
                var _this = this;
                this.$location = $location;
                this.$ionicLoading = $ionicLoading;
                this.$ionicPopup = $ionicPopup;
                this.$timeout = $timeout;
                this.$scope = $scope;
                this.dataService = dataService;
                this.taskIndex = -1;
                this.taskColour = 'green';
                this.bigRadius = 275;
                this.smallRadius = 75;
                this.showingPanel = 'none';
                this.bookLinkActive = false;
                this.taskIsFinished = false;
                this.disableInteraction = false;
                this.disableInteractionShowSpeaker = false;
                this.showCheats = false;
                $scope.$on('$ionicView.enter', function () {
                    _this.initialise();
                });
            }
            WorkPanelController.prototype.initialise = function () {
                var _this = this;
                this.disableInteraction = false;
                this.disableInteractionShowSpeaker = false;
                this.pulseForwardArrow = false;
                this.pulseInternalForwardArrow = false;
                this.showInternalForwardArrow = false;
                this.common = this.dataService.getCommon();
                this.word = this.dataService.getWord();
                this.tasks = this.dataService.getTasks();
                this.achievement = this.dataService.getAchievement();
                this.taskIndex = -1;
                this.selectedDayIndex = this.dataService.getDay();
                this.selectedWeekIndex = this.dataService.getWeek();
                this.consolidation = this.dataService.getWord().indexOf('consolidation') > -1;
                this.formalStartDate = this.dataService.getFormalStartDate();
                this.now = new Date();
                this.showCheats = this.dataService.getShowCheats();
                if (this.consolidation) {
                    switch (this.selectedDayIndex) {
                        case 0:
                            this.taskColour = '#C6ACFF';
                            break;
                        case 1:
                            this.taskColour = '#A700F6';
                            break;
                        case 2:
                            this.taskColour = '#5A147A';
                            break;
                    }
                }
                else {
                    switch (this.selectedDayIndex) {
                        case 0:
                            this.taskColour = '#29A44C';
                            break;
                        case 1:
                            this.taskColour = '#FD7F36';
                            break;
                        case 2:
                            this.taskColour = '#1AA3E4';
                            break;
                    }
                }
                this.book = this.dataService.getBook();
                this.bookLinkActive = !this.consolidation && !this.dataService.getBookReadToday();
                this.getPointerStyle();
                var handle = this;
                this.dataService.setDisableInteractionCallback(function (setMe, showSpeaker) {
                    _this.$timeout(function () {
                        handle.disableInteractionShowSpeaker = showSpeaker;
                        handle.disableInteraction = setMe;
                    }, 0);
                });
                // Show reminder if the book has been read and this is day 2 or 3 but not Consolidation
                var a = !this.dataService.getDesktopBrowserTesting();
                var b = this.selectedDayIndex > 0;
                var c = !this.dataService.getBookReadToday();
                var d = !this.consolidation;
                if (a && b && c && d) {
                    this.showingPanel = 'reminder';
                    this.showForwardReminderArrow = false;
                    var handle = this;
                    this.dataService.setInteractionEndActivateTaskCallback(function () {
                        handle.showForwardReminderArrow = true;
                    });
                    var audioUrl = 'content/common/audio/reminder.mp3';
                    this.dataService.setupAudioIntroduction(audioUrl);
                    this.dataService.playAudioIntroduction(2000);
                }
                else {
                    this.showingPanel = 'circle';
                }
            };
            WorkPanelController.prototype.selectTask = function (taskIndex) {
                this.internalForwardArrowCallback = null;
                this.showInternalForwardArrow = false;
                this.pulseInternalForwardArrow = false;
                if (this.showingPanel === 'circle' || taskIndex !== this.taskIndex) {
                    this.$scope.$broadcast('FLIP_EVENT_OUT');
                    this.taskIsFinished = false;
                    this.pulseForwardArrow = false;
                    this.dataService.setTask(taskIndex);
                    this.taskIndex = taskIndex;
                    this.showingPanel = 'task';
                    if (this.consolidation) {
                        this.taskTemplateUrl = 'js/tasks/consolidation/' +
                            this.tasks[this.taskIndex].type + '/template.html?updated=' + Date.now();
                    }
                    else {
                        this.taskTemplateUrl = 'js/tasks/day' + (this.selectedDayIndex + 1) + '/' +
                            this.tasks[this.taskIndex].type + '/template.html?updated=' + Date.now();
                    }
                }
            };
            WorkPanelController.prototype.selectBook = function () {
                this.dataService.startBook();
                this.$location.path('/book');
            };
            WorkPanelController.prototype.goHome = function () {
                this.$location.path('/home/');
            };
            WorkPanelController.stopThePropagation = function (event) {
                event.stopPropagation();
            };
            WorkPanelController.prototype.clickMapIsEnabled = function (taskIndex) {
                var a = this.consolidation;
                var b = this.dataService.getBookReadToday();
                var c = taskIndex <= this.achievement.taskIndex + 1;
                var d = this.selectedDayIndex <= this.achievement.dayIndex;
                var e = this.selectedWeekIndex <= this.achievement.weekIndex;
                return ((a || b) && ((c && !d && !e) || (d && !e) || e));
            };
            WorkPanelController.prototype.taskCircleIsHighlighted = function (taskIndex) {
                var a = taskIndex === this.achievement.taskIndex + 1;
                var b = this.selectedDayIndex == this.achievement.dayIndex + 1;
                var c = this.selectedWeekIndex == this.achievement.weekIndex + 1;
                var d = !this.bookLinkActive;
                return (a && b && c && d);
            };
            WorkPanelController.prototype.getTaskCircleStyle = function (taskIndex) {
                var radians = taskIndex * 45 * (Math.PI / 180);
                var style = {
                    'background-color': this.tasks[taskIndex].completed ? this.taskColour : 'white',
                    'border': 'solid ' + this.taskColour,
                    'left': (600 - this.bigRadius * Math.sin(-radians)) - 150 + 'px',
                    'top': (450 - this.bigRadius * Math.cos(-radians)) - 150 + 'px',
                    'position': 'absolute'
                };
                // Highlight this circle if it matches current progress state
                if (this.taskCircleIsHighlighted(taskIndex)) {
                    style['border'] = '10px solid ' + this.taskColour + ' !important';
                    style['border-radius'] = '50%';
                    style['-webkit-box-shadow'] = '0 0 15px 5px rgba(255,255,0,1)';
                    style['-webkit-appearance'] = 'none';
                    style['box-shadow'] = '0 0 8px 8px ' + this.taskColour + ', ' +
                        '0 0 1px 15px ' + 'yellow';
                }
                return style;
            };
            WorkPanelController.prototype.getBookBackgroundImage = function () {
                return {
                    'border': 'solid ' + this.taskColour,
                    'background-image': 'url(\'content/picturebooks/' + this.book.reference + '/thumb.png\')'
                };
            };
            WorkPanelController.prototype.getBookCircleStyle = function () {
                var style = {
                    'top': 250 + 'px',
                    'left': 400 + 'px'
                };
                if (this.bookLinkActive) {
                    style['border'] = '10px solid ' + this.taskColour + ' !important';
                    style['border-radius'] = '50%';
                    style['-webkit-box-shadow'] = '0 0 15px 5px rgba(255,255,0,1)';
                    style['-webkit-appearance'] = 'none';
                    style['box-shadow'] = '0 0 8px 8px ' + this.taskColour + ', ' +
                        '0 0 1px 15px ' + 'yellow';
                }
                return style;
            };
            WorkPanelController.prototype.getLineCircleStyle = function (taskIndex) {
                var taskAngleRadians = taskIndex * 45 * (Math.PI / 180);
                var lineAngleRadians = (taskIndex + 1) * 45 * (Math.PI / 180);
                var xshift = this.smallRadius * 1.15 * Math.cos(lineAngleRadians); //  + (75 * Math.sin(radians));
                var yshift = this.smallRadius * 1.15 * Math.sin(lineAngleRadians); //- (75 * Math.sin(radians));
                return {
                    'border-color': this.taskColour,
                    'left': (600 - this.bigRadius * 1.15 * Math.sin(-taskAngleRadians)) - 150 + 75 + xshift + 'px',
                    'top': (450 - this.bigRadius * 1.15 * Math.cos(-taskAngleRadians)) - 150 + 75 + yshift + 'px',
                    'transform': 'rotateZ(' + (taskIndex * 45 + 22.5) + 'deg)',
                    'transform-origin': 'top left'
                };
            };
            WorkPanelController.prototype.getTaskLinearStyle = function (taskIndex) {
                var style = {
                    'background-color': this.tasks[taskIndex].completed ? this.taskColour : 'white',
                    'border': '2px solid ' + this.taskColour,
                    'left': 10 + 'px',
                    'top': taskIndex * 95 + 10 + 'px',
                    'position': 'absolute'
                };
                if (this.taskCircleIsHighlighted(taskIndex)) {
                    style['border'] = '10px solid ' + this.taskColour + ' !important';
                    style['border-radius'] = '50%';
                    style['-webkit-box-shadow'] = '0 0 15px 5px rgba(255,255,0,1)';
                    style['-webkit-appearance'] = 'none';
                    style['box-shadow'] = '0 0 8px 8px ' + this.taskColour + ', ' +
                        '0 0 1px 15px ' + 'yellow';
                }
                return style;
            };
            WorkPanelController.prototype.getLineLinearStyle = function (taskIndex) {
                return {
                    'border-color': this.taskColour,
                    'left': '46px',
                    'top': (taskIndex * 95) + 75 + 'px'
                };
            };
            WorkPanelController.prototype.getArrowLinearStyle = function () {
                return {
                    'border-right': '10px solid ' + this.taskColour
                };
            };
            WorkPanelController.prototype.getFinalLineCircleStyle = function () {
                //var lineAngleRadians = 90 * (Math.PI/180);
                return {
                    'border-color': this.taskColour,
                    'left': 445 + 'px',
                    'top': (443 - this.bigRadius) + 'px',
                    'transform': 'rotateZ(270deg)',
                    'transform-origin': 'right bottom'
                };
            };
            WorkPanelController.prototype.getArrowCircleStyle = function () {
                return {
                    'border-right': '10px solid ' + this.taskColour,
                };
            };
            WorkPanelController.prototype.getPointerStyle = function () {
                var style;
                if (this.bookLinkActive) {
                    style = {
                        'left': 600 + 'px',
                        'top': 450 + 'px'
                    };
                }
                else {
                    var radians = (this.achievement.taskIndex + 1) * 45 * (Math.PI / 180);
                    style = {
                        'left': (600 - this.bigRadius * Math.sin(-radians)) - 150 + 80 + 'px',
                        'top': (450 - this.bigRadius * Math.cos(-radians)) - 150 + 125 + 'px'
                    };
                }
                this.pointerStyle = style;
                return style;
            };
            WorkPanelController.prototype.getIndicatorLocation = function () {
                return {
                    'left': '-40px',
                    'top': this.taskIndex * 95 + 5 + 'px',
                };
            };
            WorkPanelController.prototype.taskFinished = function () {
                var _this = this;
                this.showInternalForwardArrow = false;
                this.taskIsFinished = true;
                this.$timeout(function () {
                    _this.pulseForwardArrow = true;
                }, 1000);
                this.$timeout(function () {
                    _this.pulseForwardArrow = false;
                }, 5000);
            };
            WorkPanelController.prototype.setAndShowOnetimeInternalForwardArrowCallback = function (callback) {
                var _this = this;
                this.internalForwardArrowCallback = callback;
                this.showInternalForwardArrow = true;
                this.pulseInternalForwardArrow = true;
                this.$timeout(function () {
                    _this.pulseInternalForwardArrow = false;
                }, 3000);
            };
            WorkPanelController.prototype.clickInternalForwardArrow = function () {
                if (typeof this.internalForwardArrowCallback !== 'undefined' && this.internalForwardArrowCallback !== null) {
                    this.pulseInternalForwardArrow = false;
                    this.showInternalForwardArrow = false;
                    this.internalForwardArrowCallback();
                }
            };
            WorkPanelController.prototype.completeTask = function () {
                var _this = this;
                this.dataService.completeSelectedTask();
                this.dataService.writeStorage(function () {
                    _this.bookLinkActive = !_this.consolidation && !_this.dataService.getBookReadToday();
                    _this.getPointerStyle();
                    _this.$scope.$broadcast('FLIP_EVENT_OUT');
                    _this.dataService.completeCurrentUsageRecord('task');
                    if (_this.taskIndex < _this.tasks.length - 1) {
                        _this.selectTask(_this.taskIndex + 1);
                    }
                    else {
                        _this.showingPanel = 'circle';
                        _this.completeDay();
                    }
                }, null, true);
            };
            WorkPanelController.prototype.completeDay = function () {
                this.taskIndex = -1;
                this.dataService.completeSelectedDay();
                this.dataService.writeStorage(null, null, false);
                this.showingPanel = 'none';
                this.$location.path('/reward');
            };
            /* TESTING ONLY */
            WorkPanelController.prototype.testCompleteBookAndTasks = function () {
                var _this = this;
                this.dataService.completeSelectedBook();
                this.tasks.forEach(function (task, index) {
                    _this.dataService.setTask(index);
                    _this.taskIndex = index;
                    _this.dataService.completeSelectedTask();
                    _this.dataService.completeCurrentUsageRecord('task');
                });
                this.dataService.writeStorage(null, null, false);
                this.$scope.$broadcast('FLIP_EVENT_OUT');
                this.bookLinkActive = !this.consolidation && !this.dataService.getBookReadToday();
                this.getPointerStyle();
            };
            /* TESTING ONLY */
            WorkPanelController.prototype.testCompleteBook = function () {
                this.dataService.completeSelectedBook();
                this.bookLinkActive = !this.consolidation && !this.dataService.getBookReadToday();
                this.getPointerStyle();
            };
            WorkPanelController.prototype.backToPath = function () {
                this.showingPanel = 'none';
                this.$location.path("/home/" + this.dataService.getWeek());
            };
            WorkPanelController.prototype.backToCircle = function () {
                this.dataService.completeCurrentUsageRecord('task');
                this.taskIndex = -1;
                this.showingPanel = 'circle';
            };
            WorkPanelController.prototype.playIntroduction = function () {
                this.dataService.playAudioIntroduction(0);
            };
            WorkPanelController.$inject = ['$location', '$ionicLoading', '$ionicPopup', '$timeout', '$scope', 'DataService'];
            return WorkPanelController;
        }());
        Controllers.WorkPanelController = WorkPanelController;
    })(Controllers = ISPApp.Controllers || (ISPApp.Controllers = {}));
})(ISPApp || (ISPApp = {}));
//# sourceMappingURL=workpanel.js.map