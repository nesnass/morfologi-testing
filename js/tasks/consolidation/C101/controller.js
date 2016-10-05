/// <reference path="../../../../js/_references.ts"/>
/// <reference path="../../../../js/models/models.ts"/>
/// <reference path="../../../services/dataService.ts"/>
var ISPApp;
(function (ISPApp) {
    var Controllers;
    (function (Controllers) {
        "use strict";
        var TaskC101Controller = (function () {
            function TaskC101Controller($scope, $timeout, dataService) {
                this.$scope = $scope;
                this.$timeout = $timeout;
                this.dataService = dataService;
                this.word = dataService.getWord();
                this.dayWord = dataService.getWordForConsolidationDay();
                this.dayIndex = dataService.getDay();
                this.showReturnBuzzer = false;
                this.attempts = 0;
                this.page = 1;
                this.round = 1;
                this.displayImages = [];
                this.displayImageIndex = 0;
                this.highlightIdontknow = false;
                this.highlightIknow = false;
                this.showAnswer = false;
                this.displayImages.push('content/common/images/questionmark.png');
                this.activateTask();
            }
            TaskC101Controller.prototype.activateTask = function () {
                var _this = this;
                var handle = this;
                this.dataService.setInteractionEndActivateTaskCallback(function () {
                    _this.dataService.externalCallDisableInteractionCallback(true, false);
                    handle.$timeout(function () {
                        handle.dataService.externalCallDisableInteractionCallback(false, false);
                        handle.attemptRound();
                    }, 1500);
                });
                this.dataService.setupAudioIntroduction('content/' + this.word + '/task2/instruction.mp3');
                this.dataService.playAudioIntroduction(3000);
                this.$timeout(function () {
                    _this.highlightBuzzer = true;
                    _this.$timeout(function () {
                        _this.highlightBuzzer = false;
                    }, 1000);
                }, 1800);
            };
            TaskC101Controller.prototype.attemptRound = function () {
                var _this = this;
                this.attempts++;
                this.displayImages = [];
                this.displayImageIndex = 0;
                var path = 'content/' + this.word + '/task2/day' + (this.dayIndex + 1) + '/round' + this.round + '/';
                this.displayImages.push(path + (this.displayImageIndex + 1) + '.jpg');
                new Audio(path + (this.displayImageIndex + 1) + '.mp3').play();
                var timeoutAndAddImage = function () {
                    if (_this.page !== 1) {
                        return;
                    }
                    _this.$timeout(function () {
                        _this.displayImageIndex++;
                        if (_this.page > 1) {
                            _this.showReturnBuzzer = true;
                            return;
                        }
                        else if (_this.displayImageIndex > 5) {
                            _this.showReturnBuzzer = true;
                            _this.pushBuzzerPage1();
                        }
                        else {
                            _this.showReturnBuzzer = false;
                            var path = 'content/' + _this.word + '/task2/day' + (_this.dayIndex + 1) + '/round' + _this.round + '/';
                            _this.displayImages.push(path + (_this.displayImageIndex + 1) + '.jpg');
                            new Audio(path + (_this.displayImageIndex + 1) + '.mp3').play();
                            timeoutAndAddImage();
                        }
                    }, 4000);
                };
                timeoutAndAddImage();
            };
            TaskC101Controller.prototype.pushBuzzerPage1 = function () {
                var _this = this;
                this.page = 2;
                this.showAnswer = false;
                this.dataService.externalCallDisableInteractionCallback(true, false);
                this.$timeout(function () {
                    _this.highlightIknow = true;
                    new Audio('content/common/audio/consolidation/iknowtheword.mp3').play();
                    _this.$timeout(function () {
                        _this.highlightIknow = false;
                    }, 1000);
                }, 2000);
                if (this.attempts < 2) {
                    this.$timeout(function () {
                        _this.highlightIdontknow = true;
                        new Audio('content/common/audio/consolidation/ineedhelp.mp3').play();
                        _this.$timeout(function () {
                            _this.highlightIdontknow = false;
                            _this.dataService.externalCallDisableInteractionCallback(false, false);
                        }, 1000);
                    }, 4500);
                }
            };
            TaskC101Controller.prototype.pushBuzzerPage2 = function () {
                if (this.attempts < 2) {
                    this.page = 1;
                    this.attemptRound();
                }
            };
            TaskC101Controller.prototype.pushAnswer = function () {
                this.page = 3;
                this.answerImage = '';
                var path = 'content/' + this.word + '/task2/day' + (this.dayIndex + 1) + '/round' + this.round + '/';
                this.answerImage = path + 'answer.jpg';
            };
            TaskC101Controller.prototype.clickFlippy = function () {
                this.$scope['wpC'].taskFinished();
            };
            TaskC101Controller.prototype.clickItem = function (index) {
                new Audio('content/' + this.word + '/task2/day' + (this.dayIndex + 1) + '/round' + this.round + '/' + (index + 1) + '.mp3').play();
            };
            TaskC101Controller.prototype.showTheAnswer = function () {
                var _this = this;
                this.showAnswer = true;
                this.$timeout(function () {
                    new Audio('content/' + _this.word + '/task2/day' + (_this.dayIndex + 1) + '/round' + _this.round + '/answer.mp3').play();
                }, 1000);
                if (this.round === 1) {
                    this.$scope['wpC'].setAndShowOnetimeInternalForwardArrowCallback(function () {
                        _this.round = 2;
                        _this.page = 1;
                        _this.attempts = 0;
                        _this.displayImages = [];
                        _this.displayImageIndex = 0;
                        _this.displayImages.push('content/common/images/questionmark.png');
                        _this.activateTask();
                    });
                }
                else {
                    this.$scope['wpC'].taskFinished();
                }
            };
            TaskC101Controller.$inject = ['$scope', '$timeout', 'DataService'];
            return TaskC101Controller;
        }());
        Controllers.TaskC101Controller = TaskC101Controller;
    })(Controllers = ISPApp.Controllers || (ISPApp.Controllers = {}));
})(ISPApp || (ISPApp = {}));
//# sourceMappingURL=controller.js.map