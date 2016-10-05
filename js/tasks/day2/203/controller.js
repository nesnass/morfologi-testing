/// <reference path="../../../../js/_references.ts"/>
/// <reference path="../../../../js/models/models.ts"/>
/// <reference path="../../../services/dataService.ts"/>
var ISPApp;
(function (ISPApp) {
    var Controllers;
    (function (Controllers) {
        "use strict";
        var Task203Controller = (function () {
            function Task203Controller($scope, $timeout, dataService) {
                this.$scope = $scope;
                this.$timeout = $timeout;
                this.dataService = dataService;
                this.word = $scope['wpC'].word;
                this.task = dataService.getTask();
                this.borderAActive = false;
                this.borderBActive = false;
                this.readyForClick = false;
                this.showImages = false;
                this.videoUrl = 'content/' + this.word + '/role/1.mp4';
                this.posterUrl = 'content/' + this.word + '/role/poster.jpg';
                this.videoActive = {
                    active: false
                };
                this.plays = 0;
                this.repeats = 0;
                this.itemA = { file: '', audio: '', correct: true };
                this.itemB = { file: '', audio: '', correct: false };
                var firstpick = Math.random() > 0.5 ? 'itemA' : 'itemB';
                var secondpick = firstpick === 'itemA' ? 'itemB' : 'itemA';
                this[firstpick] = {
                    file: 'content/' + this.word + '/role/day2/incorrect/1.jpg',
                    audio: 'content/' + this.word + '/role/day2/incorrect/1.mp3',
                    correct: false
                };
                this[secondpick] = {
                    file: 'content/' + this.word + '/role/day2/correct/1.jpg',
                    audio: 'content/' + this.word + '/role/day2/correct/1.mp3',
                    correct: true
                };
                // This should be run at the end of the constructor
                var handle = this;
                dataService.setInteractionEndActivateTaskCallback(function () {
                    handle.videoActive.active = true;
                });
                dataService.setupAudioIntroduction('content/common/audio/day1-task4.mp3');
                dataService.playAudioIntroduction(3000);
            }
            Task203Controller.prototype.runHighlight = function (handle, delay) {
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
                                _this.readyForClick = true;
                            }, 1000);
                        }, 1000);
                    }, 1000);
                }, delay);
            };
            Task203Controller.prototype.clickItemA = function () {
                if (this.readyForClick) {
                    this.borderAActive = true;
                    this.processItem(this.itemA);
                }
            };
            Task203Controller.prototype.clickItemB = function () {
                if (this.readyForClick) {
                    this.borderBActive = true;
                    this.processItem(this.itemB);
                }
            };
            Task203Controller.prototype.processItem = function (item) {
                var _this = this;
                var audio = new Audio(item['audio']);
                audio.play();
                if (item['correct']) {
                    this.$timeout(function () {
                        _this.$timeout(function () {
                            _this.$scope['wpC'].taskFinished();
                        }, 1500);
                    }, 1500);
                }
                else {
                    this.$timeout(function () {
                        _this.borderAActive = false;
                        _this.borderBActive = false;
                        var rand = Math.floor(Math.random() * 4);
                        var audio = new Audio('content/common/audio/tryagain' + rand + '.mp3');
                        audio.play();
                    }, 2000);
                }
            };
            Task203Controller.prototype.videoPlaying = function () {
                var a = new Audio('content/' + this.word + '/role/day1/1.mp3');
                this.$timeout(function () {
                    a.play();
                }, 2000);
            };
            Task203Controller.prototype.videoPlayed = function () {
                var _this = this;
                this.showImages = true;
                this.dataService.setInteractionEndActivateTaskCallback(function () {
                    _this.videoActive.active = false;
                    _this.runHighlight(_this, 1500);
                });
                this.dataService.setupAudioIntroduction('content/' + this.word + '/role/day2/instruction.mp3');
                this.dataService.playAudioIntroduction(0);
            };
            Task203Controller.$inject = ['$scope', '$timeout', 'DataService'];
            return Task203Controller;
        })();
        Controllers.Task203Controller = Task203Controller;
    })(Controllers = ISPApp.Controllers || (ISPApp.Controllers = {}));
})(ISPApp || (ISPApp = {}));
//# sourceMappingURL=controller.js.map