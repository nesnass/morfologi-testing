/// <reference path="../../../../js/_references.ts"/>
/// <reference path="../../../../js/models/models.ts"/>
/// <reference path="../../../services/dataService.ts"/>
var ISPApp;
(function (ISPApp) {
    var Controllers;
    (function (Controllers) {
        "use strict";
        var Task206Controller = (function () {
            function Task206Controller($scope, $timeout, dataService) {
                this.$scope = $scope;
                this.$timeout = $timeout;
                this.dataService = dataService;
                this.word = $scope['wpC'].word;
                this.task = dataService.getTask();
                this.showPointer = false;
                this.highlightA = false;
                this.highlightB = false;
                this.correctChosen = false;
                this.videoActive = {
                    active: false
                };
                this.round = 0;
                this.repeats = 1;
                this.randomiseItems();
                this.selectedVideo = this.videoA;
                this.runTask(3000);
            }
            Task206Controller.prototype.runTask = function (delay) {
                // This should be run at the end of the constructor
                var handle = this;
                this.dataService.setInteractionEndActivateTaskCallback(function () {
                    handle.showPointer = true;
                    handle.videoActive.active = true;
                });
                this.dataService.setupAudioIntroduction('content/common/audio/day2-task7.mp3');
                this.dataService.playAudioIntroduction(delay);
            };
            Task206Controller.prototype.randomiseItems = function () {
                var firstItemPick = Math.random() > 0.5 ? 'itemA' : 'itemB';
                var secondItemPick = firstItemPick === 'itemA' ? 'itemB' : 'itemA';
                var firstVideoPick = Math.random() > 0.5 ? 'videoA' : 'videoB';
                var secondVideoPick = firstVideoPick === 'videoA' ? 'videoB' : 'videoA';
                var firstVideo = Math.random() > 0.5 ? 'singular' : 'plural';
                var secondVideo = firstVideo === 'singular' ? 'plural' : 'singular';
                var secondImage = Math.random() > 0.5 ? '2.png' : '4.png';
                var secondAudio = secondImage === '2.png' ? '2-short.mp3' : '4-short.mp3';
                this[firstItemPick] = {
                    file: 'content/' + this.word + '/singular-plural/1.png',
                    audio: 'content/' + this.word + '/singular-plural/1-short.mp3',
                    highlighted: false
                };
                this[secondItemPick] = {
                    file: 'content/' + this.word + '/singular-plural/' + secondImage,
                    audio: 'content/' + this.word + '/singular-plural/' + secondAudio,
                    highlighted: false
                };
                this[firstVideoPick] = {
                    file: 'content/' + this.word + '/singular-plural/day2/' + firstVideo + '.mp4',
                    poster: 'content/' + this.word + '/singular-plural/day2/' + firstVideo + '-poster.jpg',
                    correctItem: firstVideo === 'singular' ? this[firstItemPick] : this[secondItemPick],
                    incorrectItem: firstVideo === 'plural' ? this[firstItemPick] : this[secondItemPick]
                };
                this[secondVideoPick] = {
                    file: 'content/' + this.word + '/singular-plural/day2/' + secondVideo + '.mp4',
                    poster: 'content/' + this.word + '/singular-plural/day2/' + secondVideo + '-poster.jpg',
                    correctItem: secondVideo === 'singular' ? this[firstItemPick] : this[secondItemPick],
                    incorrectItem: secondVideo === 'plural' ? this[firstItemPick] : this[secondItemPick]
                };
            };
            Task206Controller.prototype.clickItemA = function () {
                var _this = this;
                if (this.readyForClick) {
                    this.itemB['highlighted'] = false;
                    this.highlightB = false;
                    this.highlightA = true;
                    this.processClick(this.itemA);
                    this.$timeout(function () {
                        if (_this.itemA != _this.selectedVideo['correctItem']) {
                            _this.itemA['highlighted'] = false;
                            _this.highlightA = false;
                        }
                    }, 3000);
                }
            };
            Task206Controller.prototype.clickItemB = function () {
                var _this = this;
                if (this.readyForClick) {
                    this.itemA['highlighted'] = false;
                    this.highlightA = false;
                    this.highlightB = true;
                    this.processClick(this.itemB);
                    this.$timeout(function () {
                        if (_this.itemB != _this.selectedVideo['correctItem']) {
                            _this.itemB['highlighted'] = false;
                            _this.highlightB = false;
                        }
                    }, 3000);
                }
            };
            Task206Controller.prototype.processClick = function (item) {
                var _this = this;
                item['highlighted'] = true;
                new Audio(item['audio']).play();
                if (item == this.selectedVideo['correctItem']) {
                    this.correctChosen = true;
                    this.$timeout(function () {
                        if (_this.repeats === _this.round) {
                            _this.$scope['wpC'].taskFinished();
                        }
                        else {
                            _this.$scope['wpC'].setAndShowOnetimeInternalForwardArrowCallback(function () {
                                _this.clickForwardArrow();
                            });
                        }
                    }, 1000);
                }
                else if (!this.correctChosen) {
                    this.$timeout(function () {
                        var rand = Math.floor(Math.random() * 4);
                        new Audio('content/common/audio/tryagain' + rand + '.mp3').play();
                    }, 3000);
                }
            };
            Task206Controller.prototype.videoPlaying = function () {
                this.showPointer = false;
            };
            Task206Controller.prototype.clickForwardArrow = function () {
                var _this = this;
                this.showPointer = false;
                this.round++;
                this.correctChosen = false;
                this.readyForClick = false;
                this.itemB['highlighted'] = false;
                this.highlightB = false;
                this.itemA['highlighted'] = false;
                this.highlightA = false;
                this.selectedVideo = '';
                this.$timeout(function () {
                    _this.selectedVideo = _this.videoB;
                    _this.runTask(2000);
                }, 500);
            };
            Task206Controller.prototype.videoPlayed = function () {
                this.readyForClick = true;
            };
            Task206Controller.$inject = ['$scope', '$timeout', 'DataService'];
            return Task206Controller;
        })();
        Controllers.Task206Controller = Task206Controller;
    })(Controllers = ISPApp.Controllers || (ISPApp.Controllers = {}));
})(ISPApp || (ISPApp = {}));
//# sourceMappingURL=controller.js.map