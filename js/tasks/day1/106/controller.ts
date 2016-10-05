/// <reference path="../../../../js/_references.ts"/>
/// <reference path="../../../../js/models/models.ts"/>
/// <reference path="../../../services/dataService.ts"/>

module ISPApp.Controllers {
    import IDataService = ISPApp.Services.IDataService;
    import ITimeoutService = angular.ITimeoutService;
    import IScope = angular.IScope;
    "use strict";

    export class Task106Controller {
        static $inject = ['$scope', '$timeout', 'DataService'];

        private word: string;
        private imageUrl: string;
        private imageToShow: number = 1;

        constructor(private $scope: IScope, private $timeout: ITimeoutService, private dataService: IDataService) {
            this.word = this.$scope['wpC'].word;
            this.imageUrl = 'content/' + this.word + '/singular-plural/1.png';

            var handle = this;
            dataService.setInteractionEndActivateTaskCallback(() => {
                this.$timeout(() => {
                new Audio('content/' + handle.word + '/singular-plural/1.mp3').play();
                    $timeout(() => {
                        handle.$scope['wpC'].setAndShowOnetimeInternalForwardArrowCallback( () => {
                            handle.clickForward();
                        })
                    }, 3000)
                }, 1500);
            });
            dataService.setupAudioIntroduction('content/common/audio/day1-task7.mp3');
            dataService.playAudioIntroduction(3000);
        }

        clickImage() {
            new Audio('content/' + this.word + '/singular-plural/' + this.imageToShow + '.mp3').play();
        }

        clickForward() {
            if (this.imageToShow < 4) {
                this.imageToShow++;
                this.imageUrl = 'content/' + this.word + '/singular-plural/' + this.imageToShow + '.png';
                this.$timeout(() => {
                    new Audio('content/' + this.word + '/singular-plural/' + this.imageToShow + '.mp3').play();
                    this.$timeout(() => {
                        if (this.imageToShow < 4) {
                            this.$scope['wpC'].setAndShowOnetimeInternalForwardArrowCallback( () => {
                                this.clickForward();
                            })
                        }
                    }, 3000);
                }, 1500);
            }
            if (this.imageToShow === 4) {
                this.$timeout(() => {
                    this.$scope['wpC'].taskFinished();
                    this.$scope.$digest();
                }, 3000);
            }
        }

    }
}
