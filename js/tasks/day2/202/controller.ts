/// <reference path="../../../../js/_references.ts"/>
/// <reference path="../../../../js/models/models.ts"/>
/// <reference path="../../../services/dataService.ts"/>

module ISPApp.Controllers {
    "use strict";
    import IScope = angular.IScope;
    import ITimeoutService = angular.ITimeoutService;
    import IDataService = ISPApp.Services.DataService;

    export class Task202Controller {
        static $inject = ['$scope', '$timeout', 'DataService'];

        private word: string;
        private task: Task;
        private index: number;
        private activateDrag: boolean;
        private itemA;
        private itemB;
        private finished: boolean;
        private droppedItems: {
            '0': {
                file: string,
                audio: string,
                chosen: boolean
            },
            '1': {
                file: string,
                audio: string,
                chosen: boolean
            },
            '2': {
                file: string,
                audio: string,
                chosen: boolean
            },
            '3': {
                file: string,
                audio: string,
                chosen: boolean
            }
        };

        constructor(private $scope: IScope, private $timeout: ITimeoutService, private dataService: IDataService) {
            this.word = $scope['wpC'].word;
            this.task = dataService.getTask();
            this.index = 0;
            this.finished = false;

            this.itemA = { file: '', audio: '', correct: true, highlight: false };
            this.itemB = { file: '', audio: '', correct: false,  highlight: false };

            this.droppedItems = {
                '0': {
                    file: 'content/common/images/empty-frame.png',
                    audio: '',
                    chosen: false
                },
                '1': {
                    file: 'content/common/images/empty-frame.png',
                    audio: '',
                    chosen: false
                },
                '2': {
                    file: 'content/common/images/empty-frame.png',
                    audio: '',
                    chosen: false
                },
                '3': {
                    file: 'content/common/images/empty-frame.png',
                    audio: '',
                    chosen: false
                }
            };

            var firstpick = Math.random() > 0.5 ? 'itemA' : 'itemB';
            var secondpick = firstpick === 'itemA' ? 'itemB' : 'itemA';

            this[firstpick] = {
                file: 'content/' + this.word + '/category/day2/correct/1.jpg',
                audio: 'content/' + this.word + '/category/day2/correct/1.mp3',
                correct: true,
                highlight: false
            };
            this[secondpick] = {
                file: 'content/' + this.word + '/category/day2/incorrect/1.jpg',
                audio: 'content/' + this.word + '/category/day2/incorrect/1.mp3',
                correct: false,
                highlight: false
            };

            // This should be run at the end of the constructor
            var handle = this;
            dataService.setInteractionEndActivateTaskCallback(() => {
                this.activateTask(handle);
                handle.dataService.setInteractionEndActivateTaskCallback(null);
            });
            dataService.setupAudioIntroduction('content/' + this.word + '/category/day2/instruction.mp3');
            dataService.playAudioIntroduction(3000);
        }

        clickMainImage() {
            var audio = new Audio('content/' + this.word + '/category/category.mp3');
            audio.play();
        }

        clickImage(src) {
            if(src !== '') {
                var audio = new Audio(src);
                audio.play();
            }
        }

        activateTask(handle) {
            this.runHighlight(handle, 1000);
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
                            this.activateDrag = true;
                        }, 1000);
                    }, 1000)
                }, 1000)
            }, delay)
        }

        onDropComplete = function(indx, data: {}) {
            // Check item not already dropped here
            var i = indx.toString();
            if (i && this.droppedItems[i]['chosen']) {
                return;
            } else {
                if (data['correct']) {
                    this.activateDrag = false;
                    this.droppedItems[i]['file'] = data['file'];
                    this.droppedItems[i]['audio'] = data['audio'];
                    this.droppedItems[i]['chosen'] = true;
                    this.index++;
                    var firstpick = Math.random() > 0.5 ? 'itemA' : 'itemB';
                    var secondpick = firstpick === 'itemA' ? 'itemB' : 'itemA';
                    if (this.index < 4 ) {
                        this[firstpick] = {
                            file: 'content/' + this.word + '/category/day2/correct/' + (this.index + 1) + '.jpg',
                            audio: 'content/' + this.word + '/category/day2/correct/' + (this.index + 1) + '.mp3',
                            correct: true
                        };
                        this[secondpick] = {
                            file: 'content/' + this.word + '/category/day2/incorrect/' + (this.index + 1) + '.jpg',
                            audio: 'content/' + this.word + '/category/day2/incorrect/' + (this.index + 1) + '.mp3',
                            correct: false
                        };

                        this.runHighlight(this, 2500);

                    } else {
                        this[firstpick] = {
                            file: '',
                            audio: '',
                            correct: false
                        };
                        this[secondpick] = {
                            file: '',
                            audio: '',
                            correct: false
                        };
                        this.finished = true;
                        this.$scope['wpC'].taskFinished();
                    }
                } else {
                    var rand = Math.floor(Math.random() * 4);
                    var audio = new Audio('content/common/audio/tryagain' + rand + '.mp3');
                    audio.play();
                }
            }
        };

    }
}
