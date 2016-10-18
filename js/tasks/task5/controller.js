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
                this.page = 1;
                this.round = 0;
                this.familyCharacter = "";
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
                        image: "content/" + this.word + "/" + this.dayWord + "/correct/" + i + ".jpg",
                        audio: "content/" + this.word + "/" + this.dayWord + "/correct/" + i + ".mp3",
                        correct: true,
                        style: {
                            "top": 0,
                            "left": 0,
                            "width": 0,
                            "height": 0
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
                        image: "content/" + this.word + "/" + this.dayWord + "/incorrect/" + i + ".jpg",
                        audio: "content/" + this.word + "/" + this.dayWord + "/incorrect/" + i + ".mp3",
                        correct: false,
                        style: {
                            "top": 0,
                            "left": 0,
                            "width": 0,
                            "height": 0
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
                    _this.dataService.setupAudioIntroduction("content/common/audio/consolidation/task3/instruction.mp3");
                    _this.dataService.playAudioIntroduction(1000);
                });
                this.dataService.setupAudioIntroduction("content/common/audio/consolidation/task3/van-stopping.mp3");
                this.dataService.playAudioIntroduction(1000);
            }
            Task5Controller.$inject = ["$scope", "$timeout", "DataService"];
            return Task5Controller;
        }());
        Controllers.Task5Controller = Task5Controller;
    })(Controllers = MorfologiApp.Controllers || (MorfologiApp.Controllers = {}));
})(MorfologiApp || (MorfologiApp = {}));
//# sourceMappingURL=controller.js.map