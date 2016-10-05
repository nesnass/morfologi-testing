/// <reference path="../../../../js/_references.ts"/>
/// <reference path="../../../../js/models/models.ts"/>
/// <reference path="../../../services/dataService.ts"/>

module ISPApp.Controllers {
    "use strict";
    import IScope = angular.IScope;
    import ITimeoutService = angular.ITimeoutService;
    import IDataService = ISPApp.Services.DataService;

    export class TaskC101Controller {
        static $inject = ['$scope', '$timeout', 'DataService'];

        private word: string;
        private dayWord: string;
        private dayIndex: number;
        private page: number;
        private round: number;
        private attempts: number;
        private showReturnBuzzer: boolean;
        private answerImage: string;

        private displayImages: string[];
        private displayImageIndex: number;

        private highlightIknow: boolean;
        private highlightIdontknow: boolean;
        private highlightBuzzer: boolean;
        private showAnswer: boolean;

        constructor(private $scope: IScope, private $timeout: ITimeoutService, private dataService: IDataService) {
            this.word = dataService.getWord();
            this.dayWord = dataService.getWordForConsolidationDay();
            this.dayIndex = dataService.getDay();
            this.showReturnBuzzer = false;
            this.attempts = 0;
            this.page = 1;
            this.round = 1;
            this.displayImages = [];
            this.displayImageIndex = 0;
            this.highlightIdontknow = false;
            this.highlightIknow = false;
            this.showAnswer = false;
            this.displayImages.push('content/common/images/questionmark.png');

            this.activateTask();
        }

        activateTask() {
            var handle = this;
            this.dataService.setInteractionEndActivateTaskCallback(() => {
                this.dataService.externalCallDisableInteractionCallback(true, false);
                handle.$timeout(() => {
                    handle.dataService.externalCallDisableInteractionCallback(false, false);
                    handle.attemptRound();
                }, 1500);
            });
            this.dataService.setupAudioIntroduction('content/' + this.word + '/task2/instruction.mp3');
            this.dataService.playAudioIntroduction(3000);

            this.$timeout(() => {
                this.highlightBuzzer = true;
                this.$timeout(() => {
                    this.highlightBuzzer = false;
                }, 1000)
            }, 1800)
        }

        attemptRound() {
            this.attempts++;
            this.displayImages = [];
            this.displayImageIndex = 0;
            var path = 'content/' + this.word + '/task2/day' + (this.dayIndex+1) + '/round' + this.round + '/';
            this.displayImages.push(path + (this.displayImageIndex+1) + '.jpg');
            new Audio(path + (this.displayImageIndex+1) + '.mp3').play();

            var timeoutAndAddImage = () => {
                if (this.page !== 1) {
                    return;
                }
                this.$timeout(() => {
                    this.displayImageIndex++;
                    if (this.page > 1) {
                        this.showReturnBuzzer = true;
                        return;
                    } else if (this.displayImageIndex > 5) {
                        this.showReturnBuzzer = true;
                        this.pushBuzzerPage1();
                    } else {
                        this.showReturnBuzzer = false;
                        var path = 'content/' + this.word + '/task2/day' + (this.dayIndex+1) + '/round' + this.round + '/';
                        this.displayImages.push(path + (this.displayImageIndex+1) + '.jpg');
                        new Audio(path + (this.displayImageIndex+1) + '.mp3').play();
                        timeoutAndAddImage();
                    }
                }, 4000)
            };
            timeoutAndAddImage();
        }

        pushBuzzerPage1() {
            this.page = 2;
            this.showAnswer = false;

            this.dataService.externalCallDisableInteractionCallback(true, false);

            this.$timeout(() => {
                this.highlightIknow = true;
                new Audio('content/common/audio/consolidation/iknowtheword.mp3').play();
                this.$timeout(() => {
                    this.highlightIknow = false;
                }, 1000)
            }, 2000);

            if (this.attempts < 2) {
                this.$timeout(() => {
                    this.highlightIdontknow = true;
                    new Audio('content/common/audio/consolidation/ineedhelp.mp3').play();
                    this.$timeout(() => {
                        this.highlightIdontknow = false;
                        this.dataService.externalCallDisableInteractionCallback(false, false);
                    }, 1000)
                }, 4500)
            }
        }

        pushBuzzerPage2() {
            if(this.attempts < 2) {
                this.page = 1;
                this.attemptRound();
            }
        }

        pushAnswer() {
            this.page = 3;
            this.answerImage = '';
            var path = 'content/' + this.word + '/task2/day' + (this.dayIndex+1) + '/round' + this.round + '/';
            this.answerImage = path + 'answer.jpg';
        }

        clickFlippy() {
            this.$scope['wpC'].taskFinished();
        }

        clickItem(index) {
            new Audio('content/' + this.word + '/task2/day' + (this.dayIndex+1) + '/round' + this.round + '/' + (index+1) + '.mp3').play();
        }

        showTheAnswer() {
            this.showAnswer = true;
            this.$timeout(() => {
                new Audio('content/' + this.word + '/task2/day' + (this.dayIndex+1) + '/round' + this.round + '/answer.mp3').play();
            }, 1000);
            if(this.round === 1) {
                this.$scope['wpC'].setAndShowOnetimeInternalForwardArrowCallback(() => {
                    this.round = 2;
                    this.page = 1;
                    this.attempts = 0;
                    this.displayImages = [];
                    this.displayImageIndex = 0;
                    this.displayImages.push('content/common/images/questionmark.png');
                    this.activateTask();
                })
            } else {
                this.$scope['wpC'].taskFinished();
            }
        }
    }
}
