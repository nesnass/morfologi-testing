/// <reference path="../../_references.ts"/>
/// <reference path="../../models/models.ts"/>
/// <reference path="../../services/dataService.ts"/>

module ISPApp.Controllers {
    import IonicLoadingService = ionic.loading.IonicLoadingService;
    import IonicPopupService = ionic.popup.IonicPopupService;
    import ILocationService = angular.ILocationService;
    import IDataService = ISPApp.Services.IDataService;
    import ITimeoutService = angular.ITimeoutService;
    import IScope = angular.IScope;
    "use strict";

    export class WorkPanelController {
        static $inject = ['$location', '$ionicLoading', '$ionicPopup', '$timeout', '$scope', 'DataService'];

        private word: string;
        private taskIndex: number = -1;
        private tasks: Task[];
        private book: Book;

        private common: Common;
        private achievement: Achievement;
        private consolidation: boolean;
        private taskColour = 'green';
        private bigRadius = 275;
        private smallRadius = 75;
        private showingPanel: string = 'none';
        private bookLinkActive: boolean = false;
        private pointerStyle: {};

        private selectedDayIndex: number;
        private selectedWeekIndex: number;
        private taskTemplateUrl: string;
        private taskIsFinished: boolean = false;
        private disableInteraction: boolean = false;
        private disableInteractionShowSpeaker: boolean = false;
        private showForwardReminderArrow: boolean;
        private pulseForwardArrow: boolean;

        private showInternalForwardArrow: boolean;
        private pulseInternalForwardArrow: boolean;
        private internalForwardArrowCallback: () => void;   // callback function

        private formalStartDate: Date;
        private now: Date;
        private showCheats: boolean = false;

        constructor(private $location: ILocationService, private $ionicLoading:IonicLoadingService,
                     private $ionicPopup:IonicPopupService, private $timeout:ITimeoutService,
                     private $scope: IScope, private dataService: IDataService )
        {
            $scope.$on('$ionicView.enter', () => {
                this.initialise();
            });
        }

        initialise() {
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
            } else {
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
            this.dataService.setDisableInteractionCallback((setMe: boolean, showSpeaker: boolean) => {
                this.$timeout(() => {
                    handle.disableInteractionShowSpeaker = showSpeaker;
                    handle.disableInteraction = setMe;
                },0);
            });

            // Show reminder if the book has been read and this is day 2 or 3 but not Consolidation
            var a: boolean = !this.dataService.getDesktopBrowserTesting();
            var b: boolean = this.selectedDayIndex > 0;
            var c: boolean = !this.dataService.getBookReadToday();
            var d: boolean = !this.consolidation;
            if (a && b && c && d) {
                this.showingPanel = 'reminder';
                this.showForwardReminderArrow = false;
                var handle = this;
                this.dataService.setInteractionEndActivateTaskCallback(() => {
                    handle.showForwardReminderArrow = true;
                });
                var audioUrl = 'content/common/audio/reminder.mp3';
                this.dataService.setupAudioIntroduction(audioUrl);
                this.dataService.playAudioIntroduction(2000);
            } else {
                this.showingPanel = 'circle';
            }
        }

        selectTask(taskIndex) {
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
                } else {
                    this.taskTemplateUrl = 'js/tasks/day' + (this.selectedDayIndex + 1) + '/' +
                        this.tasks[this.taskIndex].type + '/template.html?updated=' + Date.now();
                }
            }
        }

        selectBook() {
            this.dataService.startBook();
            this.$location.path('/book');
        }

        goHome() {
            this.$location.path('/home/');
        }

        static stopThePropagation(event) {
            event.stopPropagation();
        }

        clickMapIsEnabled(taskIndex): boolean {
            var a: boolean = this.consolidation;
            var b: boolean = this.dataService.getBookReadToday();
            var c: boolean = taskIndex <= this.achievement.taskIndex + 1;
            var d: boolean = this.selectedDayIndex <= this.achievement.dayIndex;
            var e: boolean = this.selectedWeekIndex <= this.achievement.weekIndex;

            return (  (a || b) && ((c && !d && !e) || (d && !e) || e) );
        }

        taskCircleIsHighlighted(taskIndex): boolean {
            var a: boolean = taskIndex === this.achievement.taskIndex + 1;
            var b: boolean = this.selectedDayIndex == this.achievement.dayIndex + 1;
            var c: boolean = this.selectedWeekIndex == this.achievement.weekIndex + 1;
            var d: boolean = !this.bookLinkActive;

            return ( a && b && c && d );
        }

        getTaskCircleStyle(taskIndex) {
            var radians = taskIndex * 45 * (Math.PI/180);
            var style = {
                'background-color' : this.tasks[taskIndex].completed ? this.taskColour : 'white',
                'border': 'solid ' + this.taskColour,
                'left': (600 - this.bigRadius * Math.sin(-radians)) - 150 + 'px',
                'top': (450 - this.bigRadius * Math.cos(-radians)) - 150 + 'px',
                'position': 'absolute'
            };
            // Highlight this circle if it matches current progress state
            if (this.taskCircleIsHighlighted(taskIndex)) {
                    style['border'] = '10px solid ' + this.taskColour + ' !important';
                    style['border-radius'] = '50%';
                    style['-webkit-box-shadow'] =  '0 0 15px 5px rgba(255,255,0,1)';
                    style['-webkit-appearance'] = 'none';
                    style['box-shadow'] = '0 0 8px 8px ' + this.taskColour + ', ' +
                        '0 0 1px 15px ' + 'yellow';
            }
            return style;
        }

        getBookBackgroundImage() {
            return {
                'border': 'solid ' + this.taskColour,
                'background-image': 'url(\'content/picturebooks/' + this.book.reference + '/thumb.png\')'
            };
        }

        getBookCircleStyle() {
            var style = {
                'top': 250 + 'px',
                'left': 400 + 'px'
            };
            if (this.bookLinkActive) {
                style['border'] = '10px solid ' + this.taskColour + ' !important';
                style['border-radius'] = '50%';
                style['-webkit-box-shadow'] =  '0 0 15px 5px rgba(255,255,0,1)';
                style['-webkit-appearance'] = 'none';
                style['box-shadow'] = '0 0 8px 8px ' + this.taskColour + ', ' +
                    '0 0 1px 15px ' + 'yellow';
            }
            return style;
        }

        getLineCircleStyle(taskIndex) {
            var taskAngleRadians = taskIndex * 45 * (Math.PI/180);
            var lineAngleRadians = (taskIndex + 1) * 45 * (Math.PI/180);
            var xshift = this.smallRadius*1.15 * Math.cos(lineAngleRadians); //  + (75 * Math.sin(radians));
            var yshift = this.smallRadius*1.15 * Math.sin(lineAngleRadians); //- (75 * Math.sin(radians));
            return {
                'border-color': this.taskColour,
                'left': (600 - this.bigRadius *1.15 * Math.sin(-taskAngleRadians)) - 150 + 75 + xshift + 'px',
                'top': (450 - this.bigRadius* 1.15 * Math.cos(-taskAngleRadians)) - 150 + 75 + yshift + 'px',
                'transform': 'rotateZ(' + (taskIndex * 45 + 22.5) + 'deg)',
                'transform-origin': 'top left'
            };
        }

        getTaskLinearStyle(taskIndex) {
            var style = {
                'background-color' : this.tasks[taskIndex].completed ? this.taskColour : 'white',
                'border': '2px solid ' + this.taskColour,
                'left': 10 + 'px',
                'top': taskIndex * 95 + 10 + 'px',
                'position': 'absolute'
            };
            if (this.taskCircleIsHighlighted(taskIndex)) {
                style['border'] = '10px solid ' + this.taskColour + ' !important';
                style['border-radius'] = '50%';
                style['-webkit-box-shadow'] =  '0 0 15px 5px rgba(255,255,0,1)';
                style['-webkit-appearance'] = 'none';
                style['box-shadow'] = '0 0 8px 8px ' + this.taskColour + ', ' +
                    '0 0 1px 15px ' + 'yellow';
            }
            return style;
        }

        getLineLinearStyle(taskIndex) {
            return {
                'border-color': this.taskColour,
                'left': '46px',
                'top': (taskIndex * 95) + 75 + 'px'
            }
        }

        getArrowLinearStyle() {
            return {
                'border-right': '10px solid ' + this.taskColour
            }
        }

        getFinalLineCircleStyle() {
            //var lineAngleRadians = 90 * (Math.PI/180);
            return {
                'border-color': this.taskColour,
                'left': 445  + 'px',
                'top': (443 - this.bigRadius) + 'px',
                'transform': 'rotateZ(270deg)',
                'transform-origin': 'right bottom'
            }
        }

        getArrowCircleStyle() {
            return {
                'border-right': '10px solid ' + this.taskColour,
            }
        }

        getPointerStyle() {
            var style;
            if (this.bookLinkActive) {
                style = {
                    'left': 600 + 'px',
                    'top': 450 + 'px'
                };
            } else {
                var radians = (this.achievement.taskIndex + 1) * 45 * (Math.PI / 180);
                style = {
                    'left': (600 - this.bigRadius * Math.sin(-radians)) - 150 + 80 + 'px',
                    'top': (450 - this.bigRadius * Math.cos(-radians)) - 150 + 125 + 'px'
                };
            }
            this.pointerStyle = style;
            return style;
        }

        getIndicatorLocation() {
            return {
                'left': '-40px',
                'top': this.taskIndex * 95 + 5 + 'px',
            }
        }

        taskFinished() {
            this.showInternalForwardArrow = false;
            this.taskIsFinished = true;
            this.$timeout(() => {
                this.pulseForwardArrow = true;
            }, 1000);
            this.$timeout(() => {
               this.pulseForwardArrow = false;
            }, 5000);
        }

        setAndShowOnetimeInternalForwardArrowCallback(callback): void {
            this.internalForwardArrowCallback = callback;
            this.showInternalForwardArrow = true;
            this.pulseInternalForwardArrow = true;
            this.$timeout(() => {
                this.pulseInternalForwardArrow = false;
            }, 3000);
        }

        clickInternalForwardArrow() {
            if (typeof this.internalForwardArrowCallback !== 'undefined' && this.internalForwardArrowCallback !== null) {
                this.pulseInternalForwardArrow = false;
                this.showInternalForwardArrow = false;
                this.internalForwardArrowCallback();
            }
        }

        completeTask() {
            this.dataService.completeSelectedTask();
            this.dataService.writeStorage(() => {
                this.bookLinkActive = !this.consolidation && !this.dataService.getBookReadToday();
                this.getPointerStyle();
                this.$scope.$broadcast('FLIP_EVENT_OUT');
                this.dataService.completeCurrentUsageRecord('task');
                if (this.taskIndex < this.tasks.length -1) {
                    this.selectTask(this.taskIndex + 1);
                } else {
                    this.showingPanel = 'circle';
                    this.completeDay();
                }
            }, null, true);
        }

        completeDay() {
            this.taskIndex = -1;
            this.dataService.completeSelectedDay();
            this.dataService.writeStorage(null, null, false);
            this.showingPanel = 'none';
            this.$location.path('/reward');
        }

        /* TESTING ONLY */
        testCompleteBookAndTasks() {
            this.dataService.completeSelectedBook();
            this.tasks.forEach((task, index) => {
                this.dataService.setTask(index);
                this.taskIndex = index;
                this.dataService.completeSelectedTask();
                this.dataService.completeCurrentUsageRecord('task');
            });
            this.dataService.writeStorage(null, null, false);
            this.$scope.$broadcast('FLIP_EVENT_OUT');
            this.bookLinkActive = !this.consolidation && !this.dataService.getBookReadToday();
            this.getPointerStyle();
        }

        /* TESTING ONLY */
        testCompleteBook() {
            this.dataService.completeSelectedBook();
            this.bookLinkActive = !this.consolidation && !this.dataService.getBookReadToday();
            this.getPointerStyle();
        }

        backToPath() {
            this.showingPanel = 'none';
            this.$location.path("/home/" + this.dataService.getWeek());
        }

        backToCircle() {
            this.dataService.completeCurrentUsageRecord('task');
            this.taskIndex = -1;
            this.showingPanel = 'circle';
        }

        playIntroduction() {
            this.dataService.playAudioIntroduction(0);
        }

    }
}
