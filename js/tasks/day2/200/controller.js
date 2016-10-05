/// <reference path="../../../../js/_references.ts"/>
/// <reference path="../../../../js/models/models.ts"/>
/// <reference path="../../../services/dataService.ts"/>
var ISPApp;
(function (ISPApp) {
    var Controllers;
    (function (Controllers) {
        "use strict";
        var Task200Controller = (function () {
            function Task200Controller($scope, $timeout, dataService) {
                this.$scope = $scope;
                this.$timeout = $timeout;
                this.dataService = dataService;
                this.word = $scope['wpC'].word;
                this.task = dataService.getTask();
                this.index = 0;
                this.showImage = false;
                //this.items = dataService.shuffleArray(this.task.structure['images']);
                this.highlightGreen = false;
                this.highlightRed = false;
                this.taskActive = false;
                var temp = [];
                for (var i = 1; i < 4; i++) {
                    var item1 = {
                        "file": "content/" + this.word + "/variation/day2/correct/" + i + ".jpg",
                        "audio": "content/" + this.word + "/variation/day2/correct/" + i + ".mp3",
                        "correct": true
                    };
                    var item2 = {
                        "file": "content/" + this.word + "/variation/day2/incorrect/" + i + ".jpg",
                        "audio": "content/" + this.word + "/variation/day2/incorrect/" + i + ".mp3",
                        "correct": false
                    };
                    temp.push(item1);
                    temp.push(item2);
                }
                this.items = dataService.shuffleArray(temp);
                this.imageUrl = this.items[this.index]['file'];
                this.showImage = true;
                this.run(3000);
            }
            Task200Controller.prototype.run = function (audio_delay) {
                // This should be run at the end of the constructor
                var _this = this;
                var handle = this;
                this.dataService.setInteractionEndActivateTaskCallback(function () {
                    _this.activateTask(handle);
                });
                this.dataService.setupAudioIntroduction('content/' + this.word + '/variation/day2/instruction-day2.mp3');
                this.dataService.playAudioIntroduction(audio_delay);
            };
            Task200Controller.prototype.activateTask = function (handle) {
                handle.taskActive = true;
            };
            Task200Controller.prototype.clickImage = function () {
                //new Audio(this.items[this.index]['audio']).play();
            };
            Task200Controller.prototype.clickChoice = function (selection) {
                var _this = this;
                if (!this.taskActive) {
                    return;
                }
                var audio = new Audio(this.items[this.index]['audio']);
                this.$timeout(function () {
                    audio.play();
                }, 1000);
                if ((selection && this.items[this.index]['correct']) || (!selection && !this.items[this.index]['correct'])) {
                    this.highlightGreen = true;
                    if (this.index === this.items.length - 1) {
                        this.$scope['wpC'].taskFinished();
                    }
                    else {
                        this.$timeout(function () {
                            _this.highlightGreen = false;
                            _this.index++;
                            _this.imageUrl = _this.items[_this.index]['file'];
                            _this.$timeout(function () {
                                _this.run(1000);
                            }, 2000);
                        }, 3000);
                    }
                }
                else {
                    this.highlightRed = true;
                    this.$timeout(function () {
                        var rand = Math.floor(Math.random() * 4);
                        new Audio('content/common/audio/tryagain' + rand + '.mp3').play();
                        _this.highlightRed = false;
                    }, 3000);
                }
            };
            Task200Controller.$inject = ['$scope', '$timeout', 'DataService'];
            return Task200Controller;
        })();
        Controllers.Task200Controller = Task200Controller;
    })(Controllers = ISPApp.Controllers || (ISPApp.Controllers = {}));
})(ISPApp || (ISPApp = {}));
//# sourceMappingURL=controller.js.map