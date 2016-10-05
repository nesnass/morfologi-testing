/// <reference path="../../../../js/_references.ts"/>
/// <reference path="../../../../js/models/models.ts"/>
/// <reference path="../../../services/dataService.ts"/>

module ISPApp.Controllers {
    "use strict";
    import IScope = angular.IScope;
    import ITimeoutService = angular.ITimeoutService;
    import IDataService = ISPApp.Services.DataService;

    export class Task200Controller {
        static $inject = ['$scope', '$timeout', 'DataService'];

        private imageUrl;
        private highlightGreen: boolean;
        private highlightRed: boolean;
        private word: string;
        private task: Task;
        private index: number;
        private items: Array<any>;
        private showImage: boolean;
        private taskActive: boolean;

        constructor(private $scope: IScope, private $timeout: ITimeoutService, private dataService: IDataService) {
            this.word = $scope['wpC'].word;
            this.task = dataService.getTask();
            this.index = 0;
            this.showImage = false;
            //this.items = dataService.shuffleArray(this.task.structure['images']);
            this.highlightGreen = false;
            this.highlightRed = false;
            this.taskActive = false;

            var temp = [];
            for(var i = 1; i < 4; i++) {
                var item1 = {
                    "file": "content/" + this.word + "/variation/day2/correct/" + i + ".jpg",
                    "audio": "content/" + this.word + "/variation/day2/correct/"  + i + ".mp3",
                    "correct": true
                };
                var item2 = {
                    "file": "content/" + this.word + "/variation/day2/incorrect/" + i + ".jpg",
                    "audio": "content/" + this.word + "/variation/day2/incorrect/" + i + ".mp3",
                    "correct": false
                };
                temp.push(item1);
                temp.push(item2);
            }

            this.items = dataService.shuffleArray(temp);

            this.imageUrl = this.items[this.index]['file'];
            this.showImage = true;
            this.run(3000);
        }

        run(audio_delay) {
            // This should be run at the end of the constructor

            var handle = this;
            this.dataService.setInteractionEndActivateTaskCallback(() => {
                this.activateTask(handle);
            });
            this.dataService.setupAudioIntroduction('content/' + this.word + '/variation/day2/instruction-day2.mp3');
            this.dataService.playAudioIntroduction(audio_delay);
        }

        activateTask(handle) {
            handle.taskActive = true;
        }

        clickImage() {
            //new Audio(this.items[this.index]['audio']).play();
        }

        clickChoice(selection: boolean) {
            if (!this.taskActive) {
                return;
            }
            var audio = new Audio(this.items[this.index]['audio']);
            this.$timeout(() => {
                audio.play();
            }, 1000);
            if ((selection && this.items[this.index]['correct']) || (!selection && !this.items[this.index]['correct'])) {
                this.highlightGreen = true;
                if (this.index === this.items.length-1) {
                    this.$scope['wpC'].taskFinished();
                } else {
                    this.$timeout(() => {
                        this.highlightGreen = false;
                        this.index++;
                        this.imageUrl = this.items[this.index]['file'];
                        this.$timeout(() => {
                            this.run(1000);
                        }, 2000);
                    }, 3000)
                }
            } else {
                this.highlightRed = true;
                this.$timeout(() => {
                    var rand = Math.floor(Math.random() * 4);
                    new Audio('content/common/audio/tryagain' + rand + '.mp3').play();
                    this.highlightRed = false;
                }, 3000);

            }
        }


    }
}
