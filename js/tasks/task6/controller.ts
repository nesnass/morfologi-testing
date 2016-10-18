/// <reference path="../../../js/_references"/>
/// <reference path="../../models/models"/>
/// <reference path="../../services/dataService"/>

namespace MorfologiApp.Controllers {
    "use strict";
    import IScope = angular.IScope;
    import ITimeoutService = angular.ITimeoutService;
    import IDataService = MorfologiApp.Services.DataService;

    export class Task6Controller {
        static $inject = ["$scope", "$timeout", "DataService"];

        private word: string;
        private dayWord: string;
        private dayIndex: number;
        private page: number;
        private round: number;
        private familyCharacter: string;
        private pageOneImageData: {};
        private pageThreeImageData: {};
        private draggableObjects1: {}[];
        private draggableObjects2: {}[];
        private draggableObjects3: {}[];
        private droppedObjects: {}[];

        private iHeight: number = 111;
        private iWidth: number = 148;

        private vanIsClosed: boolean;
        private opacity: number;

        constructor(private $scope: IScope, private $timeout: ITimeoutService, private dataService: IDataService) {

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

            let correctToShuffle = [];
            let incorrectToShuffle = [];

            for (let i = 1; i < 25; i++) {
                let item = {
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

            for (let i = 1; i < 7; i++) {
                let item = {
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

            let correctShuffled = dataService.shuffleArray(correctToShuffle);
            let incorrectShuffled = dataService.shuffleArray(incorrectToShuffle);

            this.draggableObjects1 = dataService.shuffleArray(correctShuffled.splice(0, 8).concat(incorrectShuffled.splice(0, 2)));
            this.draggableObjects2 = dataService.shuffleArray(correctShuffled.splice(0, 8).concat(incorrectShuffled.splice(0, 2)));
            this.draggableObjects3 = dataService.shuffleArray(correctShuffled.concat(incorrectShuffled));

            this.dataService.setInteractionEndActivateTaskCallback(() => {
                this.dataService.clearInteractionEndActivateTaskCallback();
                this.dataService.setupAudioIntroduction("content/common/audio/consolidation/task3/instruction.mp3");
                this.dataService.playAudioIntroduction(1000);
            });
            this.dataService.setupAudioIntroduction("content/common/audio/consolidation/task3/van-stopping.mp3");
            this.dataService.playAudioIntroduction(1000);
        }

        /*


        introduction() {
            let audioFile = "";
            this.round++;

            this.setupImages();

            this.$timeout(() => {
                if (this.round === 1) {
                    this.familyCharacter = "mother.png";
                    audioFile = "content/" + this.word + "/task3/" + this.dayWord + "/mother.mp3";
                } else if (this.round === 2) {
                    this.familyCharacter = "father.png";
                    audioFile = "content/" + this.word + "/task3/" + this.dayWord + "/father.mp3";
                } else {
                    this.familyCharacter = "daughter.png";
                    audioFile = "content/" + this.word + "/task3/" + this.dayWord + "/daughter.mp3";
                }
                this.dataService.setupAudioIntroduction(audioFile);
            }, 1000);

            this.$timeout(() => {
                this.opacity = 1;
                this.dataService.playAudioIntroduction(0);
            }, 2000);

            this.$timeout(() => {
                this.enlargeImages();
            }, 4000);

        }

        setupImages() {
            let vGap = 10, hGap = 10;

            for (let n = 1; n < 4 ; n++) {
                let list = this["draggableObjects" + n];

                    for (let position = 0; position < list.length; position++) {

                        // Prepare the images for popping up from their center points
                        list[position]["style"] = {
                            "position": "absolute",
                            "top": (this.iHeight + vGap) * Math.floor(position / 5) + Math.floor(this.iHeight / 2) + "px",
                            "left": (this.iWidth + hGap) * (position % 5) + Math.floor(this.iWidth / 2) + "px",
                            "width": "0",
                            "height": "0"
                        };
                }
            }
        }

        enlargeImages() {     // After a timeout to allow digest of the previous style, set the style to "enlarge" the images
            let vGap = 10, hGap = 10;
            let items = this["draggableObjects" + this.round];
            for (let position = 0; position < items.length; position++) {
                items[position]["style"] = {
                    "position": "absolute",
                    "top": (this.iHeight + vGap) * Math.floor(position / 5) + "px",
                    "left": (this.iWidth + hGap) * (position % 5) + "px",
                    "width": this.iWidth + "px",
                    "height": this.iHeight + "px"
                };
            }
            this.$timeout(() => {
                for (let position = 0; position < items.length; position++) {
                    items[position]["transition"] = false;      // Transition effects dragging, so turn it off now
                }
            }, 1000);
        }

        driveOnPageOneCompleted() {
            this.$scope["wpC"].setAndShowOnetimeInternalForwardArrowCallback( () => {
                this.page = 2;
                this.introduction();
            });
        }

        driveOffPageThreeCompleted() {
            this.$scope["wpC"].taskFinished();
        }

        static clickImage(filename) {
            new Audio(filename).play();
        }

        closeVan() {
            this.$timeout(() => {
                this.vanIsClosed = true;
                new Audio("content/common/audio/consolidation/task3/van-door.mp3").play();
                this.$timeout(() => {
                    this.page = 3;
                    new Audio("content/common/audio/consolidation/task3/van-driving.mp3").play();
                }, 500);
            }, 1500);
        }

        onDropComplete = function(item: {}) {
            new Audio(item["audio"]).play();
            if (item["correct"]) {
                let iWidth = 80, iHeight = 60, leftOffset = 90, topOffset = 122, shiftFactor = 1.5;
                this.droppedObjects.push(item);
                let itemIndex = this["draggableObjects" + this.round].indexOf(item);
                this["draggableObjects" + this.round].splice(itemIndex, 1);
                let i = this.droppedObjects.length - 1;
                item["style"] = {
                    "position" : "absolute",
                    "top" : topOffset + i * shiftFactor + "px",
                    "left" : leftOffset - i * shiftFactor + "px",
                    "width" : iWidth + (2 * i * shiftFactor) + "px",
                    "height" : iHeight + (2 * i * shiftFactor) + "px",
                    "transform": "none"
                };
                if (this.droppedObjects.length === 24) {
                    this.opacity = 0;
                    this.closeVan();
                } else if (this.droppedObjects.length === 8 || this.droppedObjects.length === 16) {
                    this.opacity = 0;
                    this.introduction();
                }
            }

        };

        */

    }
}
