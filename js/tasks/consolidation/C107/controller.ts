/// <reference path="../../../../js/_references.ts"/>
/// <reference path="../../../../js/models/models.ts"/>
/// <reference path="../../../services/dataService.ts"/>

module ISPApp.Controllers {
    "use strict";
    import IScope = angular.IScope;
    import ITimeoutService = angular.ITimeoutService;
    import IDataService = ISPApp.Services.DataService;

    export class TaskC107Controller {
        static $inject = ['$scope', '$timeout', 'DataService'];

        private word:string;
        private dayWord:string;
        private dayIndex:number;

        private index:number;
        private activateDrag:boolean;
        private chosen: number;
        private droppedItems:{}[];
        private draggableItems:{};

        constructor(private $scope:IScope, private $timeout:ITimeoutService, private dataService:IDataService) {
            this.word = dataService.getWord();
            this.dayWord = dataService.getWordForConsolidationDay();
            this.dayIndex = dataService.getDay();
            this.chosen = 0;

            // This should be run at the end of the constructor

            var handle = this;
            dataService.setInteractionEndActivateTaskCallback(() => {
                handle.activateDrag = true;
            });
            dataService.setupAudioIntroduction('content/' + this.word + '/task8/instruction.mp3');
            dataService.playAudioIntroduction(3000);


            this.setup();
        }

        setup() {
            this.droppedItems = [
                {
                    file: 'content/common/images/empty-frame.png',
                    audio: '',
                    chosen: false
                },
                {
                    file: 'content/common/images/empty-frame.png',
                    audio: '',
                    chosen: false
                },
                {
                    file: 'content/common/images/empty-frame.png',
                    audio: '',
                    chosen: false
                },
                {
                    file: 'content/common/images/empty-frame.png',
                    audio: '',
                    chosen: false
                }
            ];

            this.draggableItems = {
                1: {},
                2: {},
                3: {},
                4: {}
            };

            var items = [];
            for (var i = 0; i < 4; i++) {
                var item = {
                    file: 'content/' + this.word + '/task8/day' + (this.dayIndex + 1) + '/' + (i+1) + '.jpg',
                    audio: 'content/' + this.word + '/task8/day' + (this.dayIndex + 1) + '/' + (i+1) + '.mp3',
                    position: i,
                    highlight: false,
                    rotate: 90 * Math.random() - 45
                };
                items.push(item);
            }
            var shuffledItems = this.dataService.shuffleArray(items);

            shuffledItems.forEach((item, index) => {
                this.draggableItems[index] = item;
            })

        }

        clickMainImage() {
            var audio = new Audio('content/' + this.word + '/category/category.mp3');
            audio.play();
        }

        clickImage(src) {
            if (src !== '') {
                new Audio(src).play();
            }
        }

        onDropComplete = function (position, data:{}) {
            // Check item not already dropped here
            if (position && this.droppedItems[position]['chosen']) {
                return;
            } else {
                if (position === data['position']) {
                    this.droppedItems[position]['file'] = data['file'];
                    this.droppedItems[position]['audio'] = data['audio'];
                    this.droppedItems[position]['chosen'] = true;
                    data['file'] = '';
                    this.chosen++;
                    new Audio(this.droppedItems[position]['audio']).play();
                    if (this.chosen === 4) {
                        this.$scope['wpC'].taskFinished();
                    }

                } else {
                    var rand = Math.floor(Math.random() * 4);
                    var audio = new Audio('content/common/audio/tryagain' + rand + '.mp3');
                    audio.play();
                }
            }
        }




    }
}
