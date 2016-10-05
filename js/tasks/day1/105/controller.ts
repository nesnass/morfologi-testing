/// <reference path="../../../../js/_references.ts"/>
/// <reference path="../../../../js/models/models.ts"/>
/// <reference path="../../../services/dataService.ts"/>

module ISPApp.Controllers {
    import IDataService = ISPApp.Services.IDataService;
    import ITimeoutService = angular.ITimeoutService;
    import IScope = angular.IScope;
    "use strict";

    export class Task105Controller {
        static $inject = ['$scope', '$timeout', 'DataService'];

        private word: string;
        private letterImageUrl: string;
        private mainImageUrl: string;

        private lightLetter: boolean;
        private lightMainImage: boolean;

        constructor(private $scope: IScope, private $timeout: ITimeoutService, private dataService: IDataService) {
            this.word = this.$scope['wpC'].word;
            this.letterImageUrl = 'content/' + this.word + '/first-sound/day1/letter.png';
            this.mainImageUrl = 'content/' + this.word + '/main.jpg';

            dataService.externalCallDisableInteractionCallback(true, true);
            $timeout(() => {
                var audio1 = new Audio('content/' + this.word + '/first-sound/day1/letter-part1.mp3');
                audio1.addEventListener('ended', () => {
                    var audio2 = new Audio('content/' + this.word + '/first-sound/day1/letter-part2.mp3');
                    audio2.addEventListener('ended', () => {
                        this.dataService.externalCallDisableInteractionCallback(false, true);
                    });
                    audio2.play();
                    this.hightlightMainImage();
                    var audioUrl = 'content/' + this.word + '/first-sound/day1/instruction1.mp3';
                    dataService.setupAudioIntroduction(audioUrl);
                });
                audio1.play();
                this.highlightLetter();
            }, 3000);

        }

        clickImage() {
            var audio = new Audio('content/' + this.word + '/main.mp3');
            audio.play();
            //this.hightlightMainImage();
        }

        clickLetter() {
            var audio = new Audio('content/' + this.word + '/first-sound/correct.mp3');
            audio.play();
           // this.highlightLetter();
        }

        highlightLetter() {
            this.lightLetter = true;
            this.$timeout(() => {
                this.lightLetter = false;
            }, 1000)
        }

        hightlightMainImage() {
            this.lightMainImage = true;
            this.$timeout(() => {
                this.lightMainImage = false;
                if (this.dataService.getTask().type === '105') {
                    this.$scope['wpC'].taskFinished();
                }
            }, 1000)
        }

    }
}
