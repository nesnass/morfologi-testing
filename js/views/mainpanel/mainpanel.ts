/// <reference path="../../_references.ts"/>
/// <reference path="../../models/models.ts"/>
/// <reference path="../../services/dataService.ts"/>

module ISPApp.Controllers {
    import IonicLoadingService = ionic.loading.IonicLoadingService;
    import IonicPopupService = ionic.popup.IonicPopupService;
    import ILocationService = angular.ILocationService;
    import IStateParamsService = ng.ui.IStateParamsService;
    import IDataService = ISPApp.Services.IDataService;
    import IonicPlatformService = ionic.platform.IonicPlatformService;
    import IonicActionSheetService = ionic.actionSheet.IonicActionSheetService;
    import IScope = angular.IScope;

    "use strict";

    export class MainPanelController {
        static $inject = ['$http', '$ionicPlatform', '$ionicLoading', '$ionicPopup', '$location', '$stateParams', '$scope', 'DataService'];

        private weeks = null;
        private weekSelected: boolean;
        private selectedWeekIndex: number;
        private language = "";
        private showingPanel = 'weeks';
        private pathIndex: number;
        private username: string;
        private formalStartDate: Date;
        private showSkipDay: boolean = false;
        private now: Date;
        private skipDayPassword: string;
        private consolidation: boolean;
        private didUserHoldForThreeSeconds: number = 0;
        private appVersion: string = ''; // cordova plugin add https://github.com/whiteoctober/cordova-plugin-app-version.git
        private showCheats: boolean = false;

        private achievement: Achievement;
        private common: Common;

        constructor( private $http:ng.IHttpService,
                     private $ionicPlatform: IonicPlatformService,
                     private $ionicLoading:IonicLoadingService,
                     private $ionicPopup:IonicPopupService,
                     private $location: ILocationService,
                     private $stateParams: IStateParamsService,
                     private $scope: IScope,
                     private dataService: IDataService) {

            $ionicPlatform.ready(() => {
                if (!dataService.getDeviceReady()) {
                    dataService.setDeviceReady(true);
                    console.log('Init from device ready');
                    this.initialise();
                }
            });

            $scope.$on('$ionicView.enter', () => {
                if (dataService.getDeviceReady() || dataService.getDesktopBrowserTesting()) {
                    console.log('Init from view entry');
                    this.initialise();
                }
            });
        }

        initialise() {
            this.dataService.getAppVersion((version) => {
                this.appVersion = version;
            });
            this.language = this.dataService.getLanguage();
            this.formalStartDate = this.dataService.getFormalStartDate();
            this.now = new Date();
            this.showCheats = this.dataService.getShowCheats();
            this.skipDayPassword = '';
            this.weekSelected = false;
            this.consolidation = false;
            this.setup();
        }

        setup() {
            let weekKey = 'week';
            this.dataService.checkStorageAndSetup((return_to_home) => {
                this.username = this.dataService.getUsername();
                this.common = this.dataService.getCommon();
                this.weeks = this.dataService.getWeeks();
                this.achievement = this.dataService.getAchievement();
                this.selectedWeekIndex = this.dataService.getWeek();
                if (this.username === '') {
                    this.showingPanel = 'username';
                } else if (this.achievement.avatar === -1) {
                    this.showingPanel = 'avatar';
                } else {
                    this.showingPanel = 'weeks';
                }
                var selectWeek = return_to_home ? Number.NaN : parseInt(this.$stateParams[weekKey], 10);
                if (!isNaN(selectWeek) && selectWeek >= 0 && selectWeek < this.weeks.length) {
                    this.selectWeek(selectWeek);
                }
                this.dataService.automaticallySendData();
            })
        }


        beginHoldSkipDay(event) {
            var e = event['timeStamp'] ? event : event.gesture;
            this.didUserHoldForThreeSeconds = e.timeStamp;
        };
        releaseToSkipDay(event) {
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

        skipToday(password) {
            if (typeof password !== 'undefined' && password !== null && password !== '') {
                this.skipDayPassword = password;
            }
            this.dataService.skipToday(this.skipDayPassword);
            this.skipDayPassword = '';
            this.showSkipDay = false;
            this.selectWeek(this.selectedWeekIndex);
        }

        setUsername() {
            if (this.username !== '') {
                this.dataService.setUsername(this.username);
                this.dataService.writeStorage(null, null, false);
                this.showingPanel = this.achievement.avatar === -1 ? 'avatar' : 'weeks';
            }
        }

        getWeekStyle(weekIndex) {
            var style = {
                'border': '10px solid black !important',
                'border-radius': '20px !important',
                'margin': '10px !important'
            };
            if (this.achievement.weekIndex === weekIndex - 1) {
                style['-webkit-box-shadow'] =  '0 0 15px 5px rgba(255,255,0,1)';
                style['box-shadow'] = '0 0 1px 5px ' + 'yellow' + ', ' +
                    '0 0 8px 8px ' + 'black' + ', ' +
                    '0 0 1px 15px ' + 'yellow';
            }
            return style;
        }

        selectWeek(weekIndex) {
            if (weekIndex > this.achievement.weekIndex + 1) {
                return;
            } else {
                this.dataService.setWeek(weekIndex);
                this.selectedWeekIndex = weekIndex;
                this.weekSelected = true;
                this.consolidation = this.dataService.getWord().indexOf('consolidation') > -1;
                if (this.achievement.weekIndex >= weekIndex) {
                    this.pathIndex = 3;
                } else {
                    this.pathIndex = this.achievement.dayIndex + 1;
                }
            }
        }

        selectDay(dayIndex, event) {
            event.stopImmediatePropagation();
            this.dataService.setDay(dayIndex);
            this.$location.path("/tasks");
        }

        selectAvatar(avatarIndex) {
            this.dataService.setAvatar(avatarIndex);
            this.dataService.writeStorage(null, null, false);
            this.showingPanel = 'weeks';
        }

        backToWeeks() {
            this.weekSelected = false;
            this.consolidation = false;
        }

        rewardMe() {
            this.$location.path("/reward");
        }

        // TESTING ONLY!!
        enableAllWeeks() {
            var totalWeeks = this.dataService.getWeeks().length;
            var selectedWeek = this.dataService.getAchievement().weekIndex;
            while(selectedWeek < totalWeeks - 1) {
                this.skipToday('frosk');
                selectedWeek = this.dataService.getAchievement().weekIndex;
            }
            this.backToWeeks();
        }

    }
}
