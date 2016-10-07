/// <reference path="../../../js/_references"/>
/// <reference path="../../models/models"/>
/// <reference path="../../services/dataService"/>
var MorfologiApp;
(function (MorfologiApp) {
    var Controllers;
    (function (Controllers) {
        "use strict";
        var Task5Controller = (function () {
            function Task5Controller($scope, $timeout, dataService) {
                var _this = this;
                this.$scope = $scope;
                this.$timeout = $timeout;
                this.dataService = dataService;
                this.iHeight = 111;
                this.iWidth = 148;
                this.onDropComplete = function (item) {
                    new Audio(item['audio']).play();
                    if (item['correct']) {
                        var iWidth = 80, iHeight = 60, leftOffset = 90, topOffset = 122, shiftFactor = 1.5;
                        this.droppedObjects.push(item);
                        var itemIndex = this['draggableObjects' + this.round].indexOf(item);
                        this['draggableObjects' + this.round].splice(itemIndex, 1);
                        var i = this.droppedObjects.length - 1;
                        item['style'] = {
                            'position': 'absolute',
                            'top': topOffset + i * shiftFactor + 'px',
                            'left': leftOffset - i * shiftFactor + 'px',
                            'width': iWidth + (2 * i * shiftFactor) + 'px',
                            'height': iHeight + (2 * i * shiftFactor) + 'px',
                            'transform': 'none'
                        };
                        if (this.droppedObjects.length === 24) {
                            this.opacity = 0;
                            this.closeVan();
                        }
                        else if (this.droppedObjects.length === 8 || this.droppedObjects.length === 16) {
                            this.opacity = 0;
                            this.introduction();
                        }
                    }
                };
                this.word = dataService.getWord();
                this.dayWord = dataService.getWordForConsolidationDay();
                this.dayIndex = dataService.getDay();
                this.page = 1;
                this.round = 0;
                this.familyCharacter = '';
                this.droppedObjects = [];
                this.draggableObjects1 = [];
                this.draggableObjects2 = [];
                this.draggableObjects3 = [];
                this.vanIsClosed = false;
                this.opacity = 0;
                this.pageOneImageData = {
                    "code": "zoomable-image",
                    "id": 11,
                    "sequence": -1,
                    "description": "car drives on to screen",
                    "start": {
                        "x": -900,
                        "y": 100,
                        "w": 800,
                        "h": 600
                    },
                    "transition": {
                        "x": 900,
                        "y": 0,
                        "scale": 1,
                        "duration": 5
                    },
                    "opacity": 1,
                    "visible_before": true,
                    "visible_after": true,
                    "auto_start": true,
                    "auto_return": false,
                    "allow_return": false,
                    "type": "png"
                };
                this.pageThreeImageData = {
                    "code": "zoomable-image",
                    "id": 11,
                    "sequence": -1,
                    "description": "car drives off screen",
                    "start": {
                        "x": -900,
                        "y": 100,
                        "w": 800,
                        "h": 600
                    },
                    "transition": {
                        "x": 1900,
                        "y": 0,
                        "scale": 1,
                        "duration": 6
                    },
                    "opacity": 1,
                    "visible_before": true,
                    "visible_after": true,
                    "auto_start": true,
                    "auto_return": false,
                    "allow_return": false,
                    "type": "png"
                };
                var correctToShuffle = [];
                var incorrectToShuffle = [];
                for (var i = 1; i < 25; i++) {
                    var item = {
                        image: 'content/' + this.word + '/' + this.dayWord + '/correct/' + i + '.jpg',
                        audio: 'content/' + this.word + '/' + this.dayWord + '/correct/' + i + '.mp3',
                        correct: true,
                        style: {
                            'top': 0,
                            'left': 0,
                            'width': 0,
                            'height': 0
                        },
                        highlighted: false,
                        draggable: true,
                        transition: true,
                        position: 0
                    };
                    correctToShuffle.push(item);
                }
                for (var i = 1; i < 7; i++) {
                    var item = {
                        image: 'content/' + this.word + '/' + this.dayWord + '/incorrect/' + i + '.jpg',
                        audio: 'content/' + this.word + '/' + this.dayWord + '/incorrect/' + i + '.mp3',
                        correct: false,
                        style: {
                            'top': 0,
                            'left': 0,
                            'width': 0,
                            'height': 0
                        },
                        highlighted: false,
                        draggable: true,
                        transition: true,
                        position: 0
                    };
                    incorrectToShuffle.push(item);
                }
                var correctShuffled = dataService.shuffleArray(correctToShuffle);
                var incorrectShuffled = dataService.shuffleArray(incorrectToShuffle);
                this.draggableObjects1 = dataService.shuffleArray(correctShuffled.splice(0, 8).concat(incorrectShuffled.splice(0, 2)));
                this.draggableObjects2 = dataService.shuffleArray(correctShuffled.splice(0, 8).concat(incorrectShuffled.splice(0, 2)));
                this.draggableObjects3 = dataService.shuffleArray(correctShuffled.concat(incorrectShuffled));
                this.dataService.setInteractionEndActivateTaskCallback(function () {
                    _this.dataService.clearInteractionEndActivateTaskCallback();
                    _this.dataService.setupAudioIntroduction('content/common/audio/consolidation/task3/instruction.mp3');
                    _this.dataService.playAudioIntroduction(1000);
                });
                this.dataService.setupAudioIntroduction('content/common/audio/consolidation/task3/van-stopping.mp3');
                this.dataService.playAudioIntroduction(1000);
            }
            Task5Controller.prototype.introduction = function () {
                var _this = this;
                var audioFile = '';
                this.round++;
                this.setupImages();
                this.$timeout(function () {
                    if (_this.round === 1) {
                        _this.familyCharacter = 'mother.png';
                        audioFile = 'content/' + _this.word + '/task3/' + _this.dayWord + '/mother.mp3';
                    }
                    else if (_this.round === 2) {
                        _this.familyCharacter = 'father.png';
                        audioFile = 'content/' + _this.word + '/task3/' + _this.dayWord + '/father.mp3';
                    }
                    else {
                        _this.familyCharacter = 'daughter.png';
                        audioFile = 'content/' + _this.word + '/task3/' + _this.dayWord + '/daughter.mp3';
                    }
                    _this.dataService.setupAudioIntroduction(audioFile);
                }, 1000);
                this.$timeout(function () {
                    _this.opacity = 1;
                    _this.dataService.playAudioIntroduction(0);
                }, 2000);
                this.$timeout(function () {
                    _this.enlargeImages();
                }, 4000);
            };
            Task5Controller.prototype.setupImages = function () {
                var vGap = 10, hGap = 10;
                for (var n = 1; n < 4; n++) {
                    var list = this['draggableObjects' + n];
                    for (var position = 0; position < list.length; position++) {
                        // Prepare the images for popping up from their center points
                        list[position]['style'] = {
                            'position': 'absolute',
                            'top': (this.iHeight + vGap) * Math.floor(position / 5) + Math.floor(this.iHeight / 2) + 'px',
                            'left': (this.iWidth + hGap) * (position % 5) + Math.floor(this.iWidth / 2) + 'px',
                            'width': '0',
                            'height': '0'
                        };
                    }
                }
            };
            Task5Controller.prototype.enlargeImages = function () {
                var vGap = 10, hGap = 10;
                var items = this['draggableObjects' + this.round];
                for (var position = 0; position < items.length; position++) {
                    items[position]['style'] = {
                        'position': 'absolute',
                        'top': (this.iHeight + vGap) * Math.floor(position / 5) + 'px',
                        'left': (this.iWidth + hGap) * (position % 5) + 'px',
                        'width': this.iWidth + 'px',
                        'height': this.iHeight + 'px'
                    };
                }
                this.$timeout(function () {
                    for (var position = 0; position < items.length; position++) {
                        items[position]['transition'] = false; // Transition effects dragging, so turn it off now
                    }
                }, 1000);
            };
            Task5Controller.prototype.driveOnPageOneCompleted = function () {
                var _this = this;
                this.$scope['wpC'].setAndShowOnetimeInternalForwardArrowCallback(function () {
                    _this.page = 2;
                    _this.introduction();
                });
            };
            Task5Controller.prototype.driveOffPageThreeCompleted = function () {
                this.$scope['wpC'].taskFinished();
            };
            Task5Controller.clickImage = function (filename) {
                new Audio(filename).play();
            };
            Task5Controller.prototype.closeVan = function () {
                var _this = this;
                this.$timeout(function () {
                    _this.vanIsClosed = true;
                    new Audio('content/common/audio/consolidation/task3/van-door.mp3').play();
                    _this.$timeout(function () {
                        _this.page = 3;
                        new Audio('content/common/audio/consolidation/task3/van-driving.mp3').play();
                    }, 500);
                }, 1500);
            };
            Task5Controller.$inject = ['$scope', '$timeout', 'DataService'];
            return Task5Controller;
        }());
        Controllers.Task5Controller = Task5Controller;
    })(Controllers = MorfologiApp.Controllers || (MorfologiApp.Controllers = {}));
})(MorfologiApp || (MorfologiApp = {}));
//# sourceMappingURL=controller.js.map