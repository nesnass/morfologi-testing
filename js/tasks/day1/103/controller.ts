/// <reference path="../../../../js/_references.ts"/>
/// <reference path="../../../../js/models/models.ts"/>
/// <reference path="../../../services/dataService.ts"/>

module ISPApp.Controllers {
    import IDataService = ISPApp.Services.IDataService;
    import ITimeoutService = angular.ITimeoutService;
    "use strict";
    import IScope = angular.IScope;

    export class Task103Controller {
        static $inject = ['$scope', '$timeout', 'DataService'];

        private word: string;
        private videoUrl: string;
        private posterUrl: string;
        private videoActive: {
            active: boolean
        };
        private plays: number;

        constructor(private $scope: IScope, private $timeout: ITimeoutService, private dataService: IDataService) {
            this.word = this.$scope['wpC'].word;
            this.videoUrl = 'content/' + this.word + '/role/1.mp4';
            this.posterUrl = 'content/' + this.word + '/role/poster.jpg';
            this.videoActive = {
                active: false
            };
            this.plays = 0;
            var handle = this;
            dataService.setInteractionEndActivateTaskCallback(() => {
                handle.videoActive.active = true;
            });
            dataService.setupAudioIntroduction('content/common/audio/day1-task4.mp3');
            dataService.playAudioIntroduction(3000);
        }

        videoPlaying() {
            var a = new Audio('content/' + this.word + '/role/day1/1.mp3');
            this.$timeout(() => {
                a.play();
            }, 2000)
        }

        videoPlayed() {
            this.plays++;
            if (this.plays === 1) {
                this.$timeout(() => {
                    this.$scope['wpC'].taskFinished();
                }, 500);
            }
        }

    }
}
