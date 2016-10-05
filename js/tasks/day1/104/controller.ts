/// <reference path="../../../../js/_references.ts"/>
/// <reference path="../../../../js/models/models.ts"/>
/// <reference path="../../../services/dataService.ts"/>

module ISPApp.Controllers {
    import IDataService = ISPApp.Services.IDataService;
    import ITimeoutService = angular.ITimeoutService;
    "use strict";
    import IScope = angular.IScope;

    export class Task104Controller {
        static $inject = ['$scope', '$timeout', 'DataService'];

        private word: string;
        private videoUrl: string;
        private posterUrl: string;
        private imageUrl: string;
        private playCount: number;
        private videoActive: {
            active: boolean
        };

        constructor(private $scope: IScope, private $timeout: ITimeoutService, private dataService: IDataService) {
            this.playCount = 0;
            this.word = this.$scope['wpC'].word;
            this.videoUrl = 'content/' + this.word + '/articulation/1.mp4';
            this.posterUrl = 'content/' + this.word + '/articulation/poster.jpg';
            this.imageUrl = 'content/' + this.word + '/main.jpg';
            this.videoActive = {
                active: false
            };

            var handle = this;
            dataService.setInteractionEndActivateTaskCallback(() => {
                handle.videoActive.active = true;
            });
            dataService.setupAudioIntroduction('content/common/audio/day1-task5-1.mp3');
            dataService.playAudioIntroduction(3000);
        }

        clickImage() {
            var audio = new Audio('content/' + this.word + '/main.mp3');
            audio.play();
        }

        videoFinished() {
            this.playCount++;
            if (this.playCount === 1) {
                this.videoActive = {
                    active: false
                };
                var handle = this;
                this.dataService.setInteractionEndActivateTaskCallback(() => {
                    handle.videoActive.active = true;
                });
                this.dataService.setupAudioIntroduction('content/common/audio/day1-task5-2.mp3');
                this.dataService.playAudioIntroduction(2000);
            }
            if (this.playCount === 2) {
                this.$scope['wpC'].taskFinished();
                this.$scope.$digest();
            }
        }


    }
}
