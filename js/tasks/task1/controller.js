/// <reference path="../../../js/_references"/>
/// <reference path="../../models/models"/>
/// <reference path="../../services/dataService"/>
var MorfologiApp;
(function (MorfologiApp) {
    var Controllers;
    (function (Controllers) {
        "use strict";
        var Task1Controller = (function () {
            function Task1Controller($scope, $timeout, dataService) {
                var _this = this;
                this.$scope = $scope;
                this.$timeout = $timeout;
                this.dataService = dataService;
                this.word = $scope['wpC'].word;
                this.task = dataService.getTask();
                this.showingPanel = 'choice';
                this.showForwardArrow = false;
                this.playingSequence = false;
                this.round = 0;
                this.repeats = 1;
                this.opacity = 0;
                this.itemA = { file: '', audio: '', correct: true, highlight: false };
                this.itemB = { file: '', audio: '', correct: false, highlight: false };
                this.randomiseItems();
                $timeout(function () {
                    _this.opacity = 1;
                }, 1000);
                // This should be run at the end of the constructor
                var handle = this;
                dataService.setInteractionEndActivateTaskCallback(function () {
                    _this.activateTask(handle);
                });
                dataService.setupAudioIntroduction('content/' + this.word + '/articulation/day2/instruction.mp3');
                dataService.playAudioIntroduction(3000);
            }
            Task1Controller.prototype.randomiseItems = function () {
                var firstItem = Math.random() > 0.5 ? 'itemA' : 'itemB';
                var secondItem = firstItem === 'itemA' ? 'itemB' : 'itemA';
                var firstImage = Math.random() > 0.5 ? 'correct.jpg' : 'incorrect.jpg';
                var secondImage = firstImage === 'correct.jpg' ? 'incorrect.jpg' : 'correct.jpg';
                var firstAudio = firstImage === 'correct.jpg' ? 'correct.mp3' : 'incorrect.mp3';
                var secondAudio = firstImage === 'correct.jpg' ? 'incorrect.mp3' : 'correct.mp3';
                var firstCorrect = firstAudio === 'correct.mp3';
                var secondCorrect = !firstCorrect;
                this[firstItem] = {
                    file: 'content/' + this.word + '/articulation/day2/' + firstImage,
                    audio: 'content/' + this.word + '/articulation/day2/' + firstAudio,
                    correct: firstCorrect,
                    highlight: false
                };
                this[secondItem] = {
                    file: 'content/' + this.word + '/articulation/day2/' + secondImage,
                    audio: 'content/' + this.word + '/articulation/day2/' + secondAudio,
                    correct: secondCorrect,
                    highlight: false
                };
            };
            Task1Controller.prototype.activateTask = function (handle) {
                var _this = this;
                this.dataService.externalCallDisableInteractionCallback(true, false);
                this.playingSequence = true;
                this.opacity = 1;
                handle.$timeout(function () {
                    var audio = new Audio(handle.itemA['audio']);
                    audio.play();
                    handle.itemA['highlight'] = true;
                    handle.$timeout(function () {
                        handle.itemA['highlight'] = false;
                    }, 1000);
                    handle.$timeout(function () {
                        var audio = new Audio(handle.itemB['audio']);
                        audio.play();
                        handle.itemB['highlight'] = true;
                        handle.$timeout(function () {
                            handle.itemB['highlight'] = false;
                            _this.playingSequence = false;
                            _this.dataService.externalCallDisableInteractionCallback(false, false);
                        }, 1000);
                    }, 2000);
                }, 1500);
            };
            Task1Controller.prototype.clickEarA = function () {
                var audio = new Audio(this.itemA['audio']);
                audio.play();
            };
            Task1Controller.prototype.clickEarB = function () {
                var audio = new Audio(this.itemB['audio']);
                audio.play();
            };
            Task1Controller.prototype.clickItemA = function () {
                var _this = this;
                this.itemA.highlight = true;
                this.itemB.highlight = false;
                if (this.itemA['correct']) {
                    if (this.round === this.repeats) {
                        this.$scope['wpC'].taskFinished();
                    }
                    else {
                        this.$scope['wpC'].setAndShowOnetimeInternalForwardArrowCallback(function () {
                            _this.clickForwardArrow();
                        });
                    }
                }
                else {
                    var rand = Math.floor(Math.random() * 4);
                    var audio = new Audio('content/common/audio/tryagain' + rand + '.mp3');
                    audio.play();
                    this.$timeout(function () {
                        _this.itemA.highlight = false;
                    }, 2000);
                }
            };
            Task1Controller.prototype.clickItemB = function () {
                var _this = this;
                this.itemB.highlight = true;
                this.itemA.highlight = false;
                if (this.itemB['correct']) {
                    if (this.round === this.repeats) {
                        this.$scope['wpC'].taskFinished();
                    }
                    else {
                        this.$scope['wpC'].setAndShowOnetimeInternalForwardArrowCallback(function () {
                            _this.clickForwardArrow();
                        });
                    }
                }
                else {
                    var rand = Math.floor(Math.random() * 4);
                    var audio = new Audio('content/common/audio/tryagain' + rand + '.mp3');
                    audio.play();
                    this.$timeout(function () {
                        _this.itemB.highlight = false;
                    }, 2000);
                }
            };
            Task1Controller.prototype.clickForwardArrow = function () {
                var _this = this;
                this.opacity = 0;
                this.round++;
                this.itemA.highlight = false;
                this.itemB.highlight = false;
                this.showForwardArrow = false;
                this.$timeout(function () {
                    _this.randomiseItems();
                    _this.activateTask(_this);
                }, 1000);
            };
            Task1Controller.$inject = ['$scope', '$timeout', 'DataService'];
            return Task1Controller;
        }());
        Controllers.Task1Controller = Task1Controller;
    })(Controllers = MorfologiApp.Controllers || (MorfologiApp.Controllers = {}));
})(MorfologiApp || (MorfologiApp = {}));
//# sourceMappingURL=controller.js.map