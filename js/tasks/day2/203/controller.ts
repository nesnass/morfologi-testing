/// <reference path="../../../../js/_references.ts"/>
/// <reference path="../../../../js/models/models.ts"/>
/// <reference path="../../../services/dataService.ts"/>

module ISPApp.Controllers {
    "use strict";
    import IScope = angular.IScope;
    import ITimeoutService = angular.ITimeoutService;
    import IDataService = ISPApp.Services.DataService;

    export class Task203Controller {
        static $inject = ['$scope', '$timeout', 'DataService'];

        private word: string;
        private task: Task;
        private showImages: boolean;
        private readyForClick: boolean;
        private borderAActive: boolean;
        private borderBActive: boolean;
        private videoUrl: string;
        private posterUrl: string;
        private repeats: number;
        private itemA;
        private itemB;
        private videoActive: {
            active: boolean
        };
        private plays: number;


        constructor(private $scope: IScope, private $timeout: ITimeoutService, private dataService: IDataService) {
            this.word = $scope['wpC'].word;
            this.task = dataService.getTask();
            this.borderAActive = false;
            this.borderBActive = false;
            this.readyForClick = false;
            this.showImages = false;
            this.videoUrl = 'content/' + this.word + '/role/1.mp4';
            this.posterUrl = 'content/' + this.word + '/role/poster.jpg';
            this.videoActive = {
                active: false
            };
            this.plays = 0;
            this.repeats = 0;

            this.itemA = { file: '', audio: '', correct: true };
            this.itemB = { file: '', audio: '', correct: false };

            var firstpick = Math.random() > 0.5 ? 'itemA' : 'itemB';
            var secondpick = firstpick === 'itemA' ? 'itemB' : 'itemA';

            this[firstpick] = {
                file: 'content/' + this.word + '/role/day2/incorrect/1.jpg',
                audio: 'content/' + this.word + '/role/day2/incorrect/1.mp3',
                correct: false
            };
            this[secondpick] = {
                file: 'content/' + this.word + '/role/day2/correct/1.jpg',
                audio: 'content/' + this.word + '/role/day2/correct/1.mp3',
                correct: true
            };

            // This should be run at the end of the constructor
            var handle = this;
            dataService.setInteractionEndActivateTaskCallback(() => {
                handle.videoActive.active = true;
            });
            dataService.setupAudioIntroduction('content/common/audio/day1-task4.mp3');
            dataService.playAudioIntroduction(3000);
        }

        runHighlight(handle, delay) {
            handle.$timeout(() => {
                handle['itemA']['highlight'] = true;
                var audio = new Audio(handle['itemA']['audio']);
                audio.play();
                handle.$timeout(() => {         // 1 second delay in-between sounds
                    handle['itemA']['highlight'] = false;
                    handle.$timeout(() => {
                        handle['itemB']['highlight'] = true;
                        var audio = new Audio(handle['itemB']['audio']);
                        audio.play();
                        handle.$timeout(() => {
                            handle['itemB']['highlight'] = false;
                            this.readyForClick = true;
                        }, 1000);
                    }, 1000)
                }, 1000)
            }, delay)
        }

        clickItemA() {
            if (this.readyForClick) {
                this.borderAActive = true;
                this.processItem(this.itemA);
            }
        }

        clickItemB() {
            if (this.readyForClick) {
                this.borderBActive = true;
                this.processItem(this.itemB);
            }
        }

        processItem(item) {
            var audio = new Audio(item['audio']);
            audio.play();

            if (item['correct']) {
                this.$timeout(() => {
                    this.$timeout(() => {
                        this.$scope['wpC'].taskFinished();
                    }, 1500)
                }, 1500)
            } else {
                this.$timeout(() => {
                    this.borderAActive = false;
                    this.borderBActive = false;
                    var rand = Math.floor(Math.random() * 4);
                    var audio = new Audio('content/common/audio/tryagain' + rand + '.mp3');
                    audio.play();
                }, 2000);
            }
        }

        videoPlaying() {
            var a = new Audio('content/' + this.word + '/role/day1/1.mp3');
            this.$timeout(() => {
                a.play();
            }, 2000)
        }

        videoPlayed() {
            this.showImages = true;
            this.dataService.setInteractionEndActivateTaskCallback(() => {
                this.videoActive.active = false;
                this.runHighlight(this, 1500);
            });
            this.dataService.setupAudioIntroduction('content/' + this.word + '/role/day2/instruction.mp3');
            this.dataService.playAudioIntroduction(0);
        }

    }
}
