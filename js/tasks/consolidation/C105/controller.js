/// <reference path="../../../../js/_references.ts"/>
/// <reference path="../../../../js/models/models.ts"/>
/// <reference path="../../../services/dataService.ts"/>
var ISPApp;
(function (ISPApp) {
    var Controllers;
    (function (Controllers) {
        "use strict";
        var TaskC105Controller = (function () {
            function TaskC105Controller($scope, $timeout, dataService) {
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
                var temp = [];
                for (var i = 1; i < 4; i++) {
                    var item1 = {
                        "file": "content/" + this.word + "/task6/" + this.dayWord + "/correct/" + i + ".jpg",
                        "audio": "content/" + this.word + "/task6/" + this.dayWord + "/correct/" + i + ".mp3",
                        "correct": true
                    };
                    var item2 = {
                        "file": "content/" + this.word + "/task6/" + this.dayWord + "/incorrect/" + i + ".jpg",
                        "audio": "content/" + this.word + "/task6/" + this.dayWord + "/incorrect/" + i + ".mp3",
                        "correct": false
                    };
                    temp.push(item1);
                    temp.push(item2);
                }
                this.items = dataService.shuffleArray(temp);
                this.imageUrl = this.items[this.index]['file'];
                var rand = Math.floor(Math.random() * 3) + 1;
                var handle = this;
                this.dataService.setInteractionEndActivateTaskCallback(function () {
                    TaskC105Controller.activateTask(handle);
                });
                this.dataService.setupAudioIntroduction('content/' + this.word + '/task6/' + this.dayWord + '/instruction1.mp3');
                this.dataService.playAudioIntroduction(3000);
            }
            TaskC105Controller.prototype.run = function (audio_delay) {
                // This should be run at the end of the constructor
                var rand = Math.floor(Math.random() * 3) + 1;
                var handle = this;
                this.dataService.setInteractionEndActivateTaskCallback(function () {
                    TaskC105Controller.activateTask(handle);
                });
                this.dataService.setupAudioIntroduction('content/' + this.word + '/task6/' + this.dayWord + '/instruction' + rand + '.mp3');
                this.dataService.playAudioIntroduction(audio_delay);
            };
            TaskC105Controller.activateTask = function (handle) {
                handle.showImage = true;
            };
            TaskC105Controller.prototype.clickImage = function () {
                new Audio(this.items[this.index]['audio']).play();
            };
            TaskC105Controller.prototype.clickChoice = function (selection) {
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
            TaskC105Controller.$inject = ['$scope', '$timeout', 'DataService'];
            return TaskC105Controller;
        }());
        Controllers.TaskC105Controller = TaskC105Controller;
    })(Controllers = ISPApp.Controllers || (ISPApp.Controllers = {}));
})(ISPApp || (ISPApp = {}));
//# sourceMappingURL=controller.js.map