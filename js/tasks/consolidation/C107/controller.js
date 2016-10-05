/// <reference path="../../../../js/_references.ts"/>
/// <reference path="../../../../js/models/models.ts"/>
/// <reference path="../../../services/dataService.ts"/>
var ISPApp;
(function (ISPApp) {
    var Controllers;
    (function (Controllers) {
        "use strict";
        var TaskC107Controller = (function () {
            function TaskC107Controller($scope, $timeout, dataService) {
                this.$scope = $scope;
                this.$timeout = $timeout;
                this.dataService = dataService;
                this.onDropComplete = function (position, data) {
                    // Check item not already dropped here
                    if (position && this.droppedItems[position]['chosen']) {
                        return;
                    }
                    else {
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
                        }
                        else {
                            var rand = Math.floor(Math.random() * 4);
                            var audio = new Audio('content/common/audio/tryagain' + rand + '.mp3');
                            audio.play();
                        }
                    }
                };
                this.word = dataService.getWord();
                this.dayWord = dataService.getWordForConsolidationDay();
                this.dayIndex = dataService.getDay();
                this.chosen = 0;
                // This should be run at the end of the constructor
                var handle = this;
                dataService.setInteractionEndActivateTaskCallback(function () {
                    handle.activateDrag = true;
                });
                dataService.setupAudioIntroduction('content/' + this.word + '/task8/instruction.mp3');
                dataService.playAudioIntroduction(3000);
                this.setup();
            }
            TaskC107Controller.prototype.setup = function () {
                var _this = this;
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
                        file: 'content/' + this.word + '/task8/day' + (this.dayIndex + 1) + '/' + (i + 1) + '.jpg',
                        audio: 'content/' + this.word + '/task8/day' + (this.dayIndex + 1) + '/' + (i + 1) + '.mp3',
                        position: i,
                        highlight: false,
                        rotate: 90 * Math.random() - 45
                    };
                    items.push(item);
                }
                var shuffledItems = this.dataService.shuffleArray(items);
                shuffledItems.forEach(function (item, index) {
                    _this.draggableItems[index] = item;
                });
            };
            TaskC107Controller.prototype.clickMainImage = function () {
                var audio = new Audio('content/' + this.word + '/category/category.mp3');
                audio.play();
            };
            TaskC107Controller.prototype.clickImage = function (src) {
                if (src !== '') {
                    new Audio(src).play();
                }
            };
            TaskC107Controller.$inject = ['$scope', '$timeout', 'DataService'];
            return TaskC107Controller;
        }());
        Controllers.TaskC107Controller = TaskC107Controller;
    })(Controllers = ISPApp.Controllers || (ISPApp.Controllers = {}));
})(ISPApp || (ISPApp = {}));
//# sourceMappingURL=controller.js.map