/// <reference path="../../../../js/_references.ts"/>
/// <reference path="../../../../js/models/models.ts"/>
/// <reference path="../../../services/dataService.ts"/>

module ISPApp.Controllers {
    "use strict";
    import IScope = angular.IScope;
    import ITimeoutService = angular.ITimeoutService;
    import IDataService = ISPApp.Services.DataService;

    export class Task201Controller {
        static $inject = ['$scope', '$timeout', 'DataService'];

        private imageUrl;
        private highlightActive: boolean;
        private word: string;
        private task: Task;
        private index: number;
        private items: Array<any>;
        private droppedBoxObjects: {}[];
        private droppedTrashObjects: {}[];
        private totalCorrectItems: number;

        constructor(private $scope: IScope, private $timeout: ITimeoutService, private dataService: IDataService) {
            this.word = $scope['wpC'].word;
            this.task = dataService.getTask();
            this.index = 0;
            this.droppedBoxObjects = [];
            this.droppedTrashObjects = [];
            this.totalCorrectItems = 0;

            //this.items = dataService.shuffleArray(this.task.structure['images']);


            var temp = [];
            for(var i = 1; i < 3; i++) {
                var item1 = {
                    "file": "content/" + this.word + "/related/day2/correct/" + i + ".jpg",
                    "audio": "content/" + this.word + "/related/day2/correct/"  + i + ".mp3",
                    "correct": true
                };
                var item2 = {
                    "file": "content/" + this.word + "/related/day2/incorrect/" + i + ".jpg",
                    "audio": "content/" + this.word + "/related/day2/incorrect/" + i + ".mp3",
                    "correct": false
                };
                this.totalCorrectItems++;
                temp.push(item1);
                temp.push(item2);
            }

            this.items = dataService.shuffleArray(temp);

            // This should be run at the end of the constructor
            dataService.setupAudioIntroduction('content/' + this.word + '/related/day2/instruction.mp3');
            dataService.playAudioIntroduction(3000);
        }

        clickImage(filename) {
            new Audio(filename).play();
        }

        onDropBoxComplete = function(data: {}) {
            var index = this.droppedBoxObjects.indexOf(data);
            if (index == -1 && data['correct']) {
                this.droppedBoxObjects.push(data);
                data['style'] = {
                    'width': '100px',
                    'top': (Math.floor(Math.random() * 50) + 100) + 'px',
                    'left': (Math.floor(Math.random() * 150) + 100) + 'px',
                    'transform': 'rotateZ(' + (Math.random() * 90) + 'deg)'
                }
            }
            var index2 = this.items.indexOf(data);
            if (index2 > -1 && data['correct']) {
                this.items.splice(index2, 1);
            }
            if (this.droppedBoxObjects.length === this.totalCorrectItems) {
                this.items.forEach((item) => {
                    this.droppedTrashObjects.push(item);
                    item['style'] = {
                        'width': '75px',
                        'top': '0',
                        'left': (Math.floor(Math.random() * 20) + 50) + 'px',
                        'transform': 'rotateZ(' + (Math.random() * 90) + 'deg)'
                    };
                    this.items = [];
                });
                this.$scope['wpC'].taskFinished();
            }
        };

        onDropTrashComplete = function(data: {}) {
            var index = this.droppedTrashObjects.indexOf(data);
            if (index == -1 && !data['correct']) {
                this.droppedTrashObjects.push(data);
                data['style'] = {
                    'width': '75px',
                    'top': '0',
                    'left': (Math.floor(Math.random() * 20) + 50) + 'px',
                    'transform': 'rotateZ(' + (Math.random() * 90) + 'deg)'
                }
            }
            var index2 = this.items.indexOf(data);
            if (index2 > -1 && !data['correct']) {
                this.items.splice(index2, 1);
            }
            if (this.items.length === 0) {
                this.$scope['wpC'].taskFinished();
            }
        };

    }
}
