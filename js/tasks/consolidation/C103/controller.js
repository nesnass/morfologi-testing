/// <reference path="../../../../js/_references.ts"/>
/// <reference path="../../../../js/models/models.ts"/>
/// <reference path="../../../services/dataService.ts"/>
var ISPApp;
(function (ISPApp) {
    var Controllers;
    (function (Controllers) {
        "use strict";
        var TaskC103Controller = (function () {
            function TaskC103Controller($scope, $timeout, dataService) {
                var _this = this;
                this.$scope = $scope;
                this.$timeout = $timeout;
                this.dataService = dataService;
                this.word = dataService.getWord();
                this.dayWord = dataService.getWordForConsolidationDay();
                this.dayIndex = dataService.getDay();
                this.task = dataService.getTask();
                this.index = 0;
                this.showImage = false;
                this.readyForAction = false;
                this.highlightSilly = false;
                this.highlightSensible = false;
                var temp = [];
                for (var i = 1; i < 4; i++) {
                    var item1 = {
                        "file": "content/" + this.word + "/task4/" + this.dayWord + "/correct/" + i + ".jpg",
                        "audio": "content/" + this.word + "/task4/" + this.dayWord + "/correct/" + i + ".mp3",
                        "correct": true
                    };
                    var item2 = {
                        "file": "content/" + this.word + "/task4/" + this.dayWord + "/incorrect/" + i + ".jpg",
                        "audio": "content/" + this.word + "/task4/" + this.dayWord + "/incorrect/" + i + ".mp3",
                        "correct": false
                    };
                    temp.push(item1);
                    temp.push(item2);
                }
                this.items = dataService.shuffleArray(temp);
                this.imageUrl = this.items[this.index]['file'];
                var handle = this;
                this.dataService.setInteractionEndActivateTaskCallback(function () {
                    TaskC103Controller.activateTask(handle);
                });
                this.dataService.setupAudioIntroduction('content/common/audio/consolidation/task4/instruction.mp3');
                this.dataService.playAudioIntroduction(3000);
                this.$timeout(function () {
                    _this.highlightSilly = true;
                    _this.$timeout(function () {
                        _this.highlightSilly = false;
                    }, 1000);
                }, 7000);
                this.$timeout(function () {
                    _this.highlightSensible = true;
                    _this.$timeout(function () {
                        _this.highlightSensible = false;
                    }, 1000);
                }, 11000);
            }
            TaskC103Controller.prototype.run = function (audio_delay) {
                // This should be run at the end of the constructor
                var handle = this;
                this.dataService.setInteractionEndActivateTaskCallback(function () {
                    TaskC103Controller.activateTask(handle);
                });
                this.dataService.setupAudioIntroduction('content/common/audio/consolidation/task4/instruction2.mp3');
                this.dataService.playAudioIntroduction(audio_delay);
            };
            TaskC103Controller.activateTask = function (handle) {
                handle.showImage = true;
            };
            TaskC103Controller.prototype.clickImage = function () {
                //new Audio(this.items[this.index]['audio']).play();
            };
            TaskC103Controller.prototype.clickChoice = function (selection) {
                var _this = this;
                if ((selection && this.items[this.index]['correct']) || (!selection && !this.items[this.index]['correct'])) {
                    this.highlightCorrect = true;
                    /*
                    this.$timeout(() => {
                        new Audio(this.items[this.index]['audio']).play();
                    }, 800);
                    */
                    if (this.index === this.items.length - 1) {
                        this.$scope['wpC'].taskFinished();
                    }
                    else {
                        this.$timeout(function () {
                            _this.highlightCorrect = false;
                            _this.index++;
                            _this.imageUrl = _this.items[_this.index]['file'];
                            _this.run(1000);
                        }, 3000);
                    }
                }
                else {
                    this.highlightIncorrect = true;
                    var rand = Math.floor(Math.random() * 4);
                    var audio = new Audio('content/common/audio/tryagain' + rand + '.mp3');
                    audio.play();
                    this.$timeout(function () {
                        _this.highlightIncorrect = false;
                    }, 2000);
                }
            };
            TaskC103Controller.$inject = ['$scope', '$timeout', 'DataService'];
            return TaskC103Controller;
        }());
        Controllers.TaskC103Controller = TaskC103Controller;
    })(Controllers = ISPApp.Controllers || (ISPApp.Controllers = {}));
})(ISPApp || (ISPApp = {}));
//# sourceMappingURL=controller.js.map