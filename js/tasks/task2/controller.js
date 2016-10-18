/// <reference path="../../../js/_references"/>
/// <reference path="../../models/models"/>
/// <reference path="../../services/dataService"/>
var MorfologiApp;
(function (MorfologiApp) {
    var Controllers;
    (function (Controllers) {
        "use strict";
        var Task2Controller = (function () {
            function Task2Controller($scope, $timeout, dataService) {
                this.$scope = $scope;
                this.$timeout = $timeout;
                this.dataService = dataService;
                this.stage = "stageOne";
                this.correctCounter = 0;
                var correctToShuffle = [];
                var incorrectToShuffle = [];
                for (var i = 1; i < 25; i++) {
                    var item = {
                        image: "content/" + this.word + "/" + this.dayWord + "/correct/" + i + ".jpg",
                        audio: "content/" + this.word + "/" + this.dayWord + "/correct/" + i + ".mp3",
                        correct: true,
                        highlighted: false
                    };
                    correctToShuffle.push(item);
                }
                for (var i = 1; i < 7; i++) {
                    var item = {
                        image: "content/" + this.word + "/" + this.dayWord + "/incorrect/" + i + ".jpg",
                        audio: "content/" + this.word + "/" + this.dayWord + "/incorrect/" + i + ".mp3",
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
                let handle = this;
                dataService.setInteractionEndActivateTaskCallback(() => {
                    this.activateTask(handle);
                });
                */
                dataService.setupAudioIntroduction("content/" + this.word + "/task1/instruction-" + this.dayWord + ".mp3");
                dataService.playAudioIntroduction(3000);
            }
            Task2Controller.$inject = ["$scope", "$timeout", "DataService"];
            return Task2Controller;
        }());
        Controllers.Task2Controller = Task2Controller;
    })(Controllers = MorfologiApp.Controllers || (MorfologiApp.Controllers = {}));
})(MorfologiApp || (MorfologiApp = {}));
//# sourceMappingURL=controller.js.map