/// <reference path="../../../../js/_references.ts"/>
/// <reference path="../../../../js/models/models.ts"/>
/// <reference path="../../../services/dataService.ts"/>
var ISPApp;
(function (ISPApp) {
    var Controllers;
    (function (Controllers) {
        "use strict";
        var Task202Controller = (function () {
            function Task202Controller($scope, $timeout, dataService) {
                var _this = this;
                this.$scope = $scope;
                this.$timeout = $timeout;
                this.dataService = dataService;
                this.onDropComplete = function (indx, data) {
                    // Check item not already dropped here
                    var i = indx.toString();
                    if (i && this.droppedItems[i]['chosen']) {
                        return;
                    }
                    else {
                        if (data['correct']) {
                            this.activateDrag = false;
                            this.droppedItems[i]['file'] = data['file'];
                            this.droppedItems[i]['audio'] = data['audio'];
                            this.droppedItems[i]['chosen'] = true;
                            this.index++;
                            var firstpick = Math.random() > 0.5 ? 'itemA' : 'itemB';
                            var secondpick = firstpick === 'itemA' ? 'itemB' : 'itemA';
                            if (this.index < 4) {
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
                            }
                            else {
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
                        }
                        else {
                            var rand = Math.floor(Math.random() * 4);
                            var audio = new Audio('content/common/audio/tryagain' + rand + '.mp3');
                            audio.play();
                        }
                    }
                };
                this.word = $scope['wpC'].word;
                this.task = dataService.getTask();
                this.index = 0;
                this.finished = false;
                this.itemA = { file: '', audio: '', correct: true, highlight: false };
                this.itemB = { file: '', audio: '', correct: false, highlight: false };
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
                dataService.setInteractionEndActivateTaskCallback(function () {
                    _this.activateTask(handle);
                    handle.dataService.setInteractionEndActivateTaskCallback(null);
                });
                dataService.setupAudioIntroduction('content/' + this.word + '/category/day2/instruction.mp3');
                dataService.playAudioIntroduction(3000);
            }
            Task202Controller.prototype.clickMainImage = function () {
                var audio = new Audio('content/' + this.word + '/category/category.mp3');
                audio.play();
            };
            Task202Controller.prototype.clickImage = function (src) {
                if (src !== '') {
                    var audio = new Audio(src);
                    audio.play();
                }
            };
            Task202Controller.prototype.activateTask = function (handle) {
                this.runHighlight(handle, 1000);
            };
            Task202Controller.prototype.runHighlight = function (handle, delay) {
                var _this = this;
                handle.$timeout(function () {
                    handle['itemA']['highlight'] = true;
                    var audio = new Audio(handle['itemA']['audio']);
                    audio.play();
                    handle.$timeout(function () {
                        handle['itemA']['highlight'] = false;
                        handle.$timeout(function () {
                            handle['itemB']['highlight'] = true;
                            var audio = new Audio(handle['itemB']['audio']);
                            audio.play();
                            handle.$timeout(function () {
                                handle['itemB']['highlight'] = false;
                                _this.activateDrag = true;
                            }, 1000);
                        }, 1000);
                    }, 1000);
                }, delay);
            };
            Task202Controller.$inject = ['$scope', '$timeout', 'DataService'];
            return Task202Controller;
        })();
        Controllers.Task202Controller = Task202Controller;
    })(Controllers = ISPApp.Controllers || (ISPApp.Controllers = {}));
})(ISPApp || (ISPApp = {}));
//# sourceMappingURL=controller.js.map