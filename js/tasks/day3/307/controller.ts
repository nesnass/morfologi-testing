/// <reference path="../../../../js/_references.ts"/>
/// <reference path="../../../../js/models/models.ts"/>
/// <reference path="../../../services/dataService.ts"/>

module ISPApp.Controllers {
    "use strict";
    import IScope = angular.IScope;
    import ITimeoutService = angular.ITimeoutService;
    import IDataService = ISPApp.Services.DataService;

    export class Task307Controller {
        static $inject = ['$scope', '$timeout', 'DataService'];

        private word: string;
        private task: Task;
        private weekIndex: number;
        private videoUrl: string;
        private posterUrl: string;
        private played: boolean;
        private showPointer: boolean;
        private videoActive: {
            active: boolean,
            playing: boolean
        };

        constructor(private $scope: IScope, private $timeout: ITimeoutService, private dataService: IDataService) {
            this.word = $scope['wpC'].word;
            this.task = dataService.getTask();
            this.weekIndex = dataService.getWeek();
            this.videoActive = { active: true, playing: false };
            var storage_mode = dataService.getStorageMode();
            this.videoUrl = '';
            this.played = false;

            dataService.checkFile('week' + this.weekIndex + '-' + storage_mode + '-video.MOV', (success) => {
                this.videoUrl = success['nativeURL'];
            }, (error) => {
                this.videoUrl = '';
                console.log('check file error: ' + error);
            });
            //this.posterUrl = 'content/common/images/default-poster.jpg';
            this.posterUrl = '';

            var handle = this;
            this.dataService.setInteractionEndActivateTaskCallback(() => {
                handle.showPointer = true;
            });
            this.dataService.setupAudioIntroduction('content/common/audio/day3-task8.mp3');
            this.dataService.playAudioIntroduction(3000);

            if (dataService.getDesktopBrowserTesting()) {
                $timeout(() => {
                    this.videoPlayed();
                }, 2000);
            }
        }

        playVideo() {
            this.played = true;
            this.videoActive.playing = true;
            this.$timeout(() => {
                this.$scope['wpC'].taskFinished();
            }, 10000);
        }

        videoPlaying() {
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
            this.videoActive.playing = false;
        }

    }
}
