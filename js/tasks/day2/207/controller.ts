/// <reference path="../../../../js/_references.ts"/>
/// <reference path="../../../../js/models/models.ts"/>
/// <reference path="../../../services/dataService.ts"/>

module ISPApp.Controllers {
    "use strict";
    import IScope = angular.IScope;
    import ITimeoutService = angular.ITimeoutService;
    import IDataService = ISPApp.Services.DataService;

    export class Task207Controller {
        static $inject = ['$scope', '$timeout', 'DataService'];

        private word: string;
        private task: Task;
        private weekIndex: number;
        private videoUrl: string;
        private posterUrl: string;
        private playing: boolean;
        private showPointer: boolean;
        private videoActive: {
            active: boolean
        };

        constructor(private $scope: IScope, private $timeout: ITimeoutService, private dataService: IDataService) {
            this.word = $scope['wpC'].word;
            this.task = dataService.getTask();
            this.videoUrl = '';
            this.weekIndex = dataService.getWeek();
            this.posterUrl = 'content/common/images/film.png';
            this.videoActive = { active: true };
            this.playing = false;
            this.showPointer = false;

            this.checkForVideo();

            var handle = this;
            this.dataService.setInteractionEndActivateTaskCallback(() => {
                handle.showPointer = true;
            });
            dataService.setupAudioIntroduction('content/' + this.word + '/present-past/day2/instruction.mp3');
            dataService.playAudioIntroduction(3000);

            if (dataService.getDesktopBrowserTesting()) {
                $timeout(() => {
                    this.videoPlayed();
                }, 2000);
            }

            /*
            $timeout(() => {
                this.videoPlayed();
            }, 20000);
            */
        }

        checkForVideo() {
            var storage_mode = this.dataService.getStorageMode();
            this.dataService.checkFile('week' + this.weekIndex + '-' + storage_mode + '-video.MOV', (success) => {
                this.videoUrl = success['nativeURL'];
            }, (error) => {
                this.videoUrl = '';
                console.log('Video not found: ' + error);
            });

        }

        captureVideo() {
            this.dataService.captureVideo(() => {
                this.checkForVideo();
                this.$scope['wpC'].taskFinished();
            }, () => {
                console.log('Video capture error');
            });
        }

        videoPlaying() {
            this.playing = true;
            /*
             var a = new Audio('content/' + this.word + '/role/day1/1.mp3');
             this.$timeout(() => {
             a.play();
             }, 2000)
             */
        }

        videoPlayed() {
            this.$scope['wpC'].taskFinished();
            this.$scope.$digest();
            this.playing = false;
        }

    }
}
