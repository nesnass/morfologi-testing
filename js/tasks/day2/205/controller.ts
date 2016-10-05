/// <reference path="../../../../js/_references.ts"/>
/// <reference path="../../../../js/models/models.ts"/>
/// <reference path="../../../services/dataService.ts"/>

module ISPApp.Controllers {
    "use strict";
    import IScope = angular.IScope;
    import ITimeoutService = angular.ITimeoutService;
    import IDataService = ISPApp.Services.DataService;

    export class Task205Controller {
        static $inject = ['$scope', '$timeout', 'DataService'];

        private word: string;
        private task: Task;
        private showForwardArrow: boolean;
        private playingSequence: boolean;
        private itemA;
        private itemB;
        private round: number;
        private repeats: number;
        private opacity: number;

        constructor(private $scope: IScope, private $timeout: ITimeoutService, private dataService: IDataService) {
            this.word = $scope['wpC'].word;
            this.task = dataService.getTask();
            this.showForwardArrow = false;
            this.playingSequence = false;
            this.round = 0;
            this.repeats = 1;
            this.opacity = 0;

            this.itemA = { file: '', audio: '', correct: true, highlight: false };
            this.itemB = { file: '', audio: '', correct: false, highlight: false };

            this.randomiseItems();
            $timeout(() => {
                this.opacity = 1;
            }, 1000);

            // This should be run at the end of the constructor
            var handle = this;
            dataService.setInteractionEndActivateTaskCallback(() => {
                this.activateTask(handle);
            });
                dataService.setupAudioIntroduction('content/' + this.word + '/first-sound/day2/instruction.mp3');
            dataService.playAudioIntroduction(3000);
        }

        randomiseItems() {
            var firstItem = Math.random() > 0.5 ? 'itemA' : 'itemB';
            var secondItem = firstItem === 'itemA' ? 'itemB' : 'itemA';
            var firstImage = Math.random() > 0.5 ? 'correct.jpg' : 'incorrect.jpg';
            var secondImage = firstImage === 'correct.jpg' ? 'incorrect.jpg' : 'correct.jpg';
            var firstAudio = firstImage === 'correct.jpg' ? 'correct.mp3' : 'incorrect.mp3';
            var secondAudio = firstImage === 'correct.jpg' ? 'incorrect.mp3' : 'correct.mp3';
            var firstCorrect = firstAudio === 'correct.mp3';
            var secondCorrect = !firstCorrect;

            this[firstItem] = {
                file: 'content/' + this.word + '/first-sound/day2/' + firstImage,
                audio: 'content/' + this.word + '/first-sound/' + firstAudio,
                correct: firstCorrect,
                highlight: false
            };
            this[secondItem] = {
                file: 'content/' + this.word + '/first-sound/day2/' + secondImage,
                audio: 'content/' + this.word + '/first-sound/' + secondAudio,
                correct: secondCorrect,
                highlight: false
            };
        }

        activateTask(handle) {
            this.dataService.externalCallDisableInteractionCallback(true, false);
            this.playingSequence = true;
            this.opacity = 1;
            handle.$timeout(() => {
                var audio = new Audio(handle.itemA['audio']);
                audio.play();
                handle.itemA['highlight'] = true;
                handle.$timeout(() => {
                    handle.itemA['highlight'] = false;
                }, 1000);
                handle.$timeout(() => {
                    var audio = new Audio(handle.itemB['audio']);
                    audio.play();
                    handle.itemB['highlight'] = true;
                    handle.$timeout(() => {
                        handle.itemB['highlight'] = false;
                        this.playingSequence = false;
                        this.dataService.externalCallDisableInteractionCallback(false, false);
                    }, 1000);
                }, 2000)
            }, 1500);
        }

        clickEarA() {
            var audio = new Audio(this.itemA['audio']);
            audio.play();
        }

        clickEarB() {
            var audio = new Audio(this.itemB['audio']);
            audio.play();
        }

        clickItemA() {
            this.itemA.highlight = true;
            this.itemB.highlight = false;
            if (this.itemA['correct']) {
                if (this.round === this.repeats) {
                    this.$scope['wpC'].taskFinished();
                } else {
                    this.$scope['wpC'].setAndShowOnetimeInternalForwardArrowCallback( () => {
                        this.clickForwardArrow();
                    })
                }
            } else {
                var rand = Math.floor(Math.random() * 4);
                var audio = new Audio('content/common/audio/tryagain' + rand + '.mp3');
                audio.play();
                this.$timeout(() => {
                    this.itemA.highlight = false;
                }, 2000)
            }
        }

        clickItemB() {
            this.itemB.highlight = true;
            this.itemA.highlight = false;
            if (this.itemB['correct']) {
                if (this.round === this.repeats) {
                    this.$scope['wpC'].taskFinished();
                } else {
                    this.$scope['wpC'].setAndShowOnetimeInternalForwardArrowCallback( () => {
                        this.clickForwardArrow();
                    })
                }
            } else {
                var rand = Math.floor(Math.random() * 4);
                var audio = new Audio('content/common/audio/tryagain' + rand + '.mp3');
                audio.play();
                this.$timeout(() => {
                    this.itemB.highlight = false;
                }, 2000)
            }
        }

        clickForwardArrow() {
            this.opacity = 0;
            this.round++;
            this.itemA.highlight = false;
            this.itemB.highlight = false;
            this.showForwardArrow = false;
            this.$timeout(() => {
                this.randomiseItems();
                this.activateTask(this);
            }, 1000);
        }


    }
}
