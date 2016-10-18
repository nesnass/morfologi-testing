/// <reference path="../../../js/_references"/>
/// <reference path="../../models/models"/>
/// <reference path="../../services/dataService"/>
var MorfologiApp;
(function (MorfologiApp) {
    var Controllers;
    (function (Controllers) {
        "use strict";
        var Task3Controller = (function () {
            function Task3Controller($scope, $timeout, dataService) {
                this.$scope = $scope;
                this.$timeout = $timeout;
                this.dataService = dataService;
                this.iHeight = 111;
                this.iWidth = 148;
                this.page = 1;
                this.round = 0;
                this.bounce = false;
                this.familyCharacter = "";
                this.droppedObjects = [];
                this.draggableObjects1 = [];
                this.draggableObjects2 = [];
                this.draggableObjects3 = [];
                this.vanIsClosed = false;
                this.activatePointer = false;
                this.kangarooData = [
                    {
                        body: {
                            width: "500px",
                            bottom: "100px",
                            left: "-80px"
                        },
                        pouch: {
                            width: "150px",
                            height: "150px",
                            left: "70px",
                            top: "300px"
                        },
                        pointer: {
                            left: "100px",
                            top: "400px"
                        },
                        pageThreeData: {
                            "code": "zoomable-image",
                            "id": 11,
                            "sequence": -1,
                            "description": "kangaroo jumps off screen",
                            "start": {
                                "x": -50,
                                "y": 250,
                                "w": 400,
                                "h": 400
                            },
                            "transition": {
                                "x": 1900,
                                "y": 800,
                                "scale": 1,
                                "duration": 4
                            },
                            "opacity": 1,
                            "visible_before": true,
                            "visible_after": true,
                            "auto_start": true,
                            "auto_return": false,
                            "allow_return": false,
                            "type": "png"
                        }
                    },
                    {
                        body: {
                            width: "500px",
                            bottom: "100px",
                            left: "-100px"
                        },
                        pouch: {
                            width: "150px",
                            height: "150px",
                            left: "65px",
                            top: "350px"
                        },
                        pointer: {
                            left: "350px",
                            top: "500px"
                        },
                        pageThreeData: {
                            "code": "zoomable-image",
                            "id": 12,
                            "sequence": -1,
                            "description": "kangaroo jumps off screen",
                            "start": {
                                "x": 250,
                                "y": 380,
                                "w": 300,
                                "h": 300
                            },
                            "transition": {
                                "x": -1900,
                                "y": -400,
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
                        }
                    },
                    {
                        body: {
                            width: "500px",
                            bottom: "100px",
                            left: "-100px"
                        },
                        pouch: {
                            width: "100px",
                            height: "100px",
                            left: "140px",
                            top: "400px"
                        },
                        pointer: {
                            left: "550px",
                            top: "450px"
                        },
                        pageThreeData: {
                            "code": "zoomable-image",
                            "id": 13,
                            "sequence": -1,
                            "description": "kangaroo jumps off screen",
                            "start": {
                                "x": 450,
                                "y": 300,
                                "w": 250,
                                "h": 250
                            },
                            "transition": {
                                "x": -1000,
                                "y": -1000,
                                "scale": 1,
                                "duration": 3
                            },
                            "opacity": 1,
                            "visible_before": true,
                            "visible_after": true,
                            "auto_start": true,
                            "auto_return": false,
                            "allow_return": false,
                            "type": "png"
                        }
                    }
                ];
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
                // this.itemSource = dataService.shuffleArray(correctToShuffle.concat(incorrectToShuffle));
                this.dataService.setupAudioIntroduction("content/common/audio/consolidation/task5/introduction.mp3");
                this.dataService.playAudioIntroduction(2000);
                this.$timeout(function () {
                    // this.playMainIntro();
                }, 11000);
            }
            Task3Controller.$inject = ["$scope", "$timeout", "DataService"];
            return Task3Controller;
        }());
        Controllers.Task3Controller = Task3Controller;
    })(Controllers = MorfologiApp.Controllers || (MorfologiApp.Controllers = {}));
})(MorfologiApp || (MorfologiApp = {}));
//# sourceMappingURL=controller.js.map