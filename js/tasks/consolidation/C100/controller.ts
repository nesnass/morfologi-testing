/// <reference path="../../../../js/_references.ts"/>
/// <reference path="../../../../js/models/models.ts"/>
/// <reference path="../../../services/dataService.ts"/>

module ISPApp.Controllers {
    "use strict";
    import IScope = angular.IScope;
    import ITimeoutService = angular.ITimeoutService;
    import IDataService = ISPApp.Services.DataService;

    export class TaskC100Controller {
        static $inject = ['$scope', '$timeout', 'DataService'];

        private word: string;
        private dayWord: string;
        private dayIndex: number;
        private stage: string;
        private correctCounter: number;
        private stageOne: {}[];
        private stageTwo: {}[];

        constructor(private $scope: IScope, private $timeout: ITimeoutService, private dataService: IDataService) {
            this.word = dataService.getWord();
            this.dayWord = dataService.getWordForConsolidationDay();
            this.dayIndex = dataService.getDay();
            this.stage = 'stageOne';
            this.correctCounter = 0;

            var correctToShuffle = [];
            var incorrectToShuffle = [];

            for(var i=1; i < 25; i++) {
                var item = {
                    image: 'content/' + this.word + '/' + this.dayWord + '/correct/' + i + '.jpg',
                    audio: 'content/' + this.word + '/' + this.dayWord + '/correct/' + i + '.mp3',
                    correct: true,
                    highlighted: false
                };
                correctToShuffle.push(item);
            }

            for(var i=1; i < 7; i++) {
                var item = {
                    image: 'content/' + this.word + '/' + this.dayWord + '/incorrect/' + i + '.jpg',
                    audio: 'content/' + this.word + '/' + this.dayWord + '/incorrect/' + i + '.mp3',
                    correct: false,
                    highlighted: false
                };
                incorrectToShuffle.push(item);
            }

            var stageTwoCorrect = correctToShuffle.splice(12, 12);
            var stageTwoIncorrect = incorrectToShuffle.splice(3, 3);

            this.stageOne = dataService.shuffleArray(correctToShuffle.concat(incorrectToShuffle));
            this.stageTwo = dataService.shuffleArray(stageTwoCorrect.concat(stageTwoIncorrect));

            // This should be run at the end of the constructor
            /*
            var handle = this;
            dataService.setInteractionEndActivateTaskCallback(() => {
                this.activateTask(handle);
            });
            */
            dataService.setupAudioIntroduction('content/' + this.word + '/task1/instruction-' + this.dayWord + '.mp3');
            dataService.playAudioIntroduction(3000);
        }

        activateTask(handle) {

        }

        clickItem(item) {
            this.$timeout(() => {
                new Audio(item['audio']).play();
            }, 250);
            if (item['highlighted']) {
                return;
            }
            item['highlighted'] = true;
            if (!item.correct) {
                this.$timeout(() => {
                    item['highlighted'] = false;
                }, 2000)
            } else {
                this.correctCounter++;
            }
            if (this.correctCounter === 12) {
                if(this.stage === 'stageOne') {
                    this.$scope['wpC'].setAndShowOnetimeInternalForwardArrowCallback( () => {
                        this.startStageTwo();
                    })
                } else {
                    this.$scope['wpC'].taskFinished();
                }
            }
        }

        startStageTwo() {
            this.stage = 'stageTwo';
            this.correctCounter = 0;
            new Audio('content/' + this.word + '/task1/instruction-' + this.dayWord + '.mp3').play();
        }


    }
}
