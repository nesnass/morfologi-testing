/// <reference path="../../../../js/_references.ts"/>
/// <reference path="../../../../js/models/models.ts"/>
/// <reference path="../../../services/dataService.ts"/>

module ISPApp.Controllers {
    "use strict";
    import IScope = angular.IScope;
    import ITimeoutService = angular.ITimeoutService;
    import IDataService = ISPApp.Services.DataService;

    export class Task206Controller {
        static $inject = ['$scope', '$timeout', 'DataService'];

        private word: string;
        private task: Task;
        private showPointer: boolean;
        private readyForClick: boolean;
        private itemA;
        private itemB;
        private videoA;
        private videoB;
        private highlightA;
        private highlightB;
        private selectedVideo;
        private videoActive: {
            active: boolean
        };
        private round: number;
        private repeats: number;
        private correctChosen: boolean;

        constructor(private $scope: IScope, private $timeout: ITimeoutService, private dataService: IDataService) {
            this.word = $scope['wpC'].word;
            this.task = dataService.getTask();
            this.showPointer = false;
            this.highlightA = false;
            this.highlightB = false;
            this.correctChosen = false;
            this.videoActive = {
                active: false
            };
            this.round = 0;
            this.repeats = 1;

            this.randomiseItems();
            this.selectedVideo = this.videoA;
            this.runTask(3000);
        }

        runTask(delay) {
            // This should be run at the end of the constructor
            var handle = this;
            this.dataService.setInteractionEndActivateTaskCallback(() => {
                handle.showPointer = true;
                handle.videoActive.active = true;
            });
            this.dataService.setupAudioIntroduction('content/common/audio/day2-task7.mp3');
            this.dataService.playAudioIntroduction(delay);
        }

        randomiseItems() {
            var firstItemPick = Math.random() > 0.5 ? 'itemA' : 'itemB';
            var secondItemPick = firstItemPick === 'itemA' ? 'itemB' : 'itemA';
            var firstVideoPick = Math.random() > 0.5 ? 'videoA' : 'videoB';
            var secondVideoPick = firstVideoPick === 'videoA' ? 'videoB' : 'videoA';

            var firstVideo = Math.random() > 0.5 ? 'singular' : 'plural';
            var secondVideo = firstVideo === 'singular' ? 'plural' : 'singular';

            var secondImage = Math.random() > 0.5 ? '2.png' : '4.png';
            var secondAudio = secondImage === '2.png' ? '2-short.mp3' : '4-short.mp3';

            this[firstItemPick] = {
                file: 'content/' + this.word + '/singular-plural/1.png',
                audio: 'content/' + this.word + '/singular-plural/1-short.mp3',
                highlighted: false
            };
            this[secondItemPick] = {
                file: 'content/' + this.word + '/singular-plural/' + secondImage,
                audio: 'content/' + this.word + '/singular-plural/' + secondAudio,
                highlighted: false
            };

            this[firstVideoPick] = {
                file: 'content/' + this.word + '/singular-plural/day2/' + firstVideo + '.mp4',
                poster: 'content/' + this.word + '/singular-plural/day2/' + firstVideo + '-poster.jpg',
                correctItem: firstVideo === 'singular' ? this[firstItemPick] : this[secondItemPick],
                incorrectItem: firstVideo === 'plural' ? this[firstItemPick] : this[secondItemPick]
            };
            this[secondVideoPick] = {
                file: 'content/' + this.word + '/singular-plural/day2/' + secondVideo + '.mp4',
                poster: 'content/' + this.word + '/singular-plural/day2/' + secondVideo + '-poster.jpg',
                correctItem: secondVideo === 'singular' ? this[firstItemPick] : this[secondItemPick],
                incorrectItem: secondVideo === 'plural' ? this[firstItemPick] : this[secondItemPick]
            };

        }

        clickItemA() {
            if (this.readyForClick) {
                this.itemB['highlighted'] = false;
                this.highlightB = false;
                this.highlightA = true;
                this.processClick(this.itemA);
                this.$timeout(() => {
                    if (this.itemA != this.selectedVideo['correctItem']) {
                        this.itemA['highlighted'] = false;
                        this.highlightA = false;
                    }
                }, 3000)
            }
        }

        clickItemB() {
            if (this.readyForClick) {
                this.itemA['highlighted'] = false;
                this.highlightA = false;
                this.highlightB = true;
                this.processClick(this.itemB);
                this.$timeout(() => {
                    if (this.itemB != this.selectedVideo['correctItem']) {
                        this.itemB['highlighted'] = false;
                        this.highlightB = false;
                    }
                }, 3000)
            }
        }

        processClick(item) {
            item['highlighted'] = true;
            new Audio(item['audio']).play();
            if (item == this.selectedVideo['correctItem']) {
                this.correctChosen = true;
                this.$timeout(() => {
                    if (this.repeats === this.round) {
                        this.$scope['wpC'].taskFinished();
                    } else {
                        this.$scope['wpC'].setAndShowOnetimeInternalForwardArrowCallback( () => {
                            this.clickForwardArrow();
                        })
                    }
                }, 1000);
            } else if (!this.correctChosen) {
                this.$timeout(() => {
                    var rand = Math.floor(Math.random() * 4);
                    new Audio('content/common/audio/tryagain' + rand + '.mp3').play();
                }, 3000)
            }

        }

        videoPlaying() {
            this.showPointer = false;
        }

        clickForwardArrow() {
            this.showPointer = false;
            this.round++;
            this.correctChosen = false;
            this.readyForClick = false;
            this.itemB['highlighted'] = false;
            this.highlightB = false;
            this.itemA['highlighted'] = false;
            this.highlightA = false;
            this.selectedVideo = '';
            this.$timeout(() => {
                this.selectedVideo = this.videoB;
                this.runTask(2000);
            }, 500)
        }

        videoPlayed() {
            this.readyForClick = true;
        }

    }
}
