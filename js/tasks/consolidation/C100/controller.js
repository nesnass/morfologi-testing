/// <reference path="../../../../js/_references.ts"/>
/// <reference path="../../../../js/models/models.ts"/>
/// <reference path="../../../services/dataService.ts"/>
var ISPApp;
(function (ISPApp) {
    var Controllers;
    (function (Controllers) {
        "use strict";
        var TaskC100Controller = (function () {
            function TaskC100Controller($scope, $timeout, dataService) {
                this.$scope = $scope;
                this.$timeout = $timeout;
                this.dataService = dataService;
                this.word = dataService.getWord();
                this.dayWord = dataService.getWordForConsolidationDay();
                this.dayIndex = dataService.getDay();
                this.stage = 'stageOne';
                this.correctCounter = 0;
                var correctToShuffle = [];
                var incorrectToShuffle = [];
                for (var i = 1; i < 25; i++) {
                    var item = {
                        image: 'content/' + this.word + '/' + this.dayWord + '/correct/' + i + '.jpg',
                        audio: 'content/' + this.word + '/' + this.dayWord + '/correct/' + i + '.mp3',
                        correct: true,
                        highlighted: false
                    };
                    correctToShuffle.push(item);
                }
                for (var i = 1; i < 7; i++) {
                    var item = {
                        image: 'content/' + this.word + '/' + this.dayWord + '/incorrect/' + i + '.jpg',
                        audio: 'content/' + this.word + '/' + this.dayWord + '/incorrect/' + i + '.mp3',
                        correct: false,
                        highlighted: false
                    };
                    incorrectToShuffle.push(item);
                }
                var stageTwoCorrect = correctToShuffle.splice(12, 12);
                var stageTwoIncorrect = incorrectToShuffle.splice(3, 3);
                this.stageOne = dataService.shuffleArray(correctToShuffle.concat(incorrectToShuffle));
                this.stageTwo = dataService.shuffleArray(stageTwoCorrect.concat(stageTwoIncorrect));
                // This should be run at the end of the constructor
                /*
                var handle = this;
                dataService.setInteractionEndActivateTaskCallback(() => {
                    this.activateTask(handle);
                });
                */
                dataService.setupAudioIntroduction('content/' + this.word + '/task1/instruction-' + this.dayWord + '.mp3');
                dataService.playAudioIntroduction(3000);
            }
            TaskC100Controller.prototype.activateTask = function (handle) {
            };
            TaskC100Controller.prototype.clickItem = function (item) {
                var _this = this;
                this.$timeout(function () {
                    new Audio(item['audio']).play();
                }, 250);
                if (item['highlighted']) {
                    return;
                }
                item['highlighted'] = true;
                if (!item.correct) {
                    this.$timeout(function () {
                        item['highlighted'] = false;
                    }, 2000);
                }
                else {
                    this.correctCounter++;
                }
                if (this.correctCounter === 12) {
                    if (this.stage === 'stageOne') {
                        this.$scope['wpC'].setAndShowOnetimeInternalForwardArrowCallback(function () {
                            _this.startStageTwo();
                        });
                    }
                    else {
                        this.$scope['wpC'].taskFinished();
                    }
                }
            };
            TaskC100Controller.prototype.startStageTwo = function () {
                this.stage = 'stageTwo';
                this.correctCounter = 0;
                new Audio('content/' + this.word + '/task1/instruction-' + this.dayWord + '.mp3').play();
            };
            TaskC100Controller.$inject = ['$scope', '$timeout', 'DataService'];
            return TaskC100Controller;
        }());
        Controllers.TaskC100Controller = TaskC100Controller;
    })(Controllers = ISPApp.Controllers || (ISPApp.Controllers = {}));
})(ISPApp || (ISPApp = {}));
//# sourceMappingURL=controller.js.map