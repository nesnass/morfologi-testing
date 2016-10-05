/// <reference path="../../../../js/_references.ts"/>
/// <reference path="../../../../js/models/models.ts"/>
/// <reference path="../../../services/dataService.ts"/>

module ISPApp.Controllers {
    "use strict";
    import IScope = angular.IScope;
    import ITimeoutService = angular.ITimeoutService;
    import IDataService = ISPApp.Services.DataService;

    export class TaskC105Controller {
        static $inject = ['$scope', '$timeout', 'DataService'];

        private word: string;
        private dayWord: string;
        private dayIndex: number;


        private imageUrl;
        private highlightCorrect: boolean;
        private highlightIncorrect: boolean;
        private task: Task;
        private index: number;
        private items: Array<any>;
        private showImage: boolean;
        private readyForAction: boolean;

        constructor(private $scope: IScope, private $timeout: ITimeoutService, private dataService: IDataService) {
            this.word = dataService.getWord();
            this.dayWord = dataService.getWordForConsolidationDay();
            this.dayIndex = dataService.getDay();

            this.task = dataService.getTask();
            this.index = 0;
            this.showImage = false;
            this.readyForAction = false;

            var temp = [];
            for(var i = 1; i < 4; i++) {
                var item1 = {
                    "file": "content/" + this.word + "/task6/" + this.dayWord + "/correct/" + i + ".jpg",
                    "audio": "content/" + this.word + "/task6/" + this.dayWord + "/correct/"  + i + ".mp3",
                    "correct": true
                };
                var item2 = {
                    "file": "content/" + this.word + "/task6/" + this.dayWord + "/incorrect/" + i + ".jpg",
                    "audio": "content/" + this.word + "/task6/" + this.dayWord + "/incorrect/" + i + ".mp3",
                    "correct": false
                };
                temp.push(item1);
                temp.push(item2);
            }

            this.items = dataService.shuffleArray(temp);

            this.imageUrl = this.items[this.index]['file'];
            var rand = Math.floor(Math.random() * 3) + 1;
            var handle = this;
            this.dataService.setInteractionEndActivateTaskCallback(() => {
                TaskC105Controller.activateTask(handle);
            });
            this.dataService.setupAudioIntroduction('content/' + this.word + '/task6/' + this.dayWord + '/instruction1.mp3');
            this.dataService.playAudioIntroduction(3000);
        }

        run(audio_delay) {
            // This should be run at the end of the constructor
            var rand = Math.floor(Math.random() * 3) + 1;
            var handle = this;
            this.dataService.setInteractionEndActivateTaskCallback(() => {
                TaskC105Controller.activateTask(handle);
            });
            this.dataService.setupAudioIntroduction('content/' + this.word + '/task6/' + this.dayWord + '/instruction' + rand + '.mp3');
            this.dataService.playAudioIntroduction(audio_delay);
        }

        static activateTask(handle) {
            handle.showImage = true;
        }

        clickImage() {
            new Audio(this.items[this.index]['audio']).play();
        }

        clickChoice(selection: boolean) {
            if ((selection && this.items[this.index]['correct']) || (!selection && !this.items[this.index]['correct'])) {
                this.highlightCorrect = true;
                /*
                this.$timeout(() => {
                    new Audio(this.items[this.index]['audio']).play();
                }, 800);
                */
                if (this.index === this.items.length-1) {
                    this.$scope['wpC'].taskFinished();
                } else {
                    this.$timeout(() => {
                        this.highlightCorrect = false;
                        this.index++;
                        this.imageUrl = this.items[this.index]['file'];
                        this.run(1000);
                    }, 3000)
                }
            } else {
                this.highlightIncorrect = true;
                var rand = Math.floor(Math.random() * 4);
                var audio = new Audio('content/common/audio/tryagain' + rand + '.mp3');
                audio.play();
                this.$timeout(() => {
                    this.highlightIncorrect = false;
                }, 2000);
            }
        }

    }
}
