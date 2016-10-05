/// <reference path="../../../../js/_references.ts"/>
/// <reference path="../../../../js/models/models.ts"/>
/// <reference path="../../../services/dataService.ts"/>

module ISPApp.Controllers {
    import IDataService = ISPApp.Services.IDataService;
    import ITimeoutService = angular.ITimeoutService;
    "use strict";
    import IScope = angular.IScope;

    export class Task102Controller {
        static $inject = ['$scope', '$timeout', 'DataService'];

        private clickedFlippys = [];
        private word: string;

        constructor(private $scope: IScope, private $timeout: ITimeoutService, private dataService: IDataService) {
            this.word = this.$scope['wpC'].word;
            this.clickedFlippys = [];

            var audioUrl = 'content/' + this.word + '/category/day1/instruction.mp3';
            dataService.setupAudioIntroduction(audioUrl);
            dataService.playAudioIntroduction(3000);
        }

        clickFlippy(index) {
            var path = index == 0 ? 'content/' + this.word + '/main.mp3'
                : 'content/' + this.word + '/category/day1/' + index + '.mp3';
            var audio = new Audio(path);
            this.$timeout(() => {
                audio.play();
            }, 1000);
            if (this.clickedFlippys.indexOf(index) === -1) {
                this.clickedFlippys.push(index);
            }
            if (this.clickedFlippys.length === 4) {
                let workPanelController = 'wpC';
                this.$scope[workPanelController].taskFinished();
            }
        }

        getBackgroundImage(index) {
            var path = index == 0 ? 'content/' + this.word + '/main.jpg'
                : 'content/' + this.word + '/category/day1/' + index + '.jpg';
            return {'background-image': 'url(\'' + path + '\')'};
        }

        clickMainImage() {
            var audio = new Audio('content/' + this.word + '/category/category.mp3');
            audio.play();
        }

    }
}
