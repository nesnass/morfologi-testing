/// <reference path="../../../js/_references"/>
/// <reference path="../../models/models"/>
/// <reference path="../../services/dataService"/>

namespace MorfologiApp.Controllers {
    "use strict";
    import IScope = angular.IScope;
    import ITimeoutService = angular.ITimeoutService;
    import IDataService = MorfologiApp.Services.DataService;

    export class Task3Controller {
        static $inject = ["$scope", "$timeout", "DataService"];

        private word: string;
        private dayWord: string;
        private dayIndex: number;
        private page: number;
        private round: number;
        private bounce: boolean;
        private pointerStyle: {};
        private familyCharacter: string;
        private kangarooData: {};
        private draggableObjects1: {}[];
        private draggableObjects2: {}[];
        private draggableObjects3: {}[];
        private droppedObjects: {}[];

        private iHeight: number = 111;
        private iWidth: number = 148;

        private vanIsClosed: boolean;
        private activatePointer: boolean;

        constructor(private $scope: IScope, private $timeout: ITimeoutService, private dataService: IDataService) {

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

            // this.itemSource = dataService.shuffleArray(correctToShuffle.concat(incorrectToShuffle));

            this.dataService.setupAudioIntroduction("content/common/audio/consolidation/task5/introduction.mp3");
            this.dataService.playAudioIntroduction(2000);
            this.$timeout(() => {
                // this.playMainIntro();
            }, 11000);
        }

        /*

        playMainIntro() {
            this.dataService.setupAudioIntroduction("content/common/audio/consolidation/task5/introround" + (this.round + 1) + ".mp3");
            this.dataService.playAudioIntroduction(2000);
            this.$timeout(() => {
                this.activatePointer = true;
            }, 3000);
        }

        clickKangaroo(index: number) {
            this.activatePointer = false;
            if (index === this.round + 1) {
                this.bounce = true;
                this.$timeout(() => {
                    this.round = index;
                    this.page = 2;
                    this.bounce = false;
                    this.introduction();
                }, 2000);
            }
        }


        introduction() {
            this.setupImages();
            this.dataService.setupAudioIntroduction("content/" + this.word + "/task5/" + this.dayWord + ".mp3");
            this.dataService.playAudioIntroduction(2000);
            this.$timeout(() => {
                this.enlargeImages();
            }, 1500);
        }

        setupImages() {
            let vGap = 30, hGap = 30;

            for (let n = 1; n < 4 ; n++) {
                let list = this["draggableObjects" + n];

                    for (let position = 0; position < list.length; position++) {

                        // Prepare the images for popping up from their center points
                        list[position]["style"] = {
                            "position": "absolute",
                            "top": (this.iHeight + vGap) * Math.floor(position / 2) + Math.floor(this.iHeight / 2) + "px",
                            "left": (this.iWidth + hGap) * (position % 2) + Math.floor(this.iWidth / 2) + "px",
                            "width": "0",
                            "height": "0"
                        };
                }
            }
        }

        enlargeImages() {     // After a timeout to allow digest of the previous style, set the style to "enlarge" the images
            let vGap = 30, hGap = 30;
            let items = this["draggableObjects" + this.round];
            for (let position = 0; position < items.length; position++) {
                items[position]["style"] = {
                    "position": "absolute",
                    "top": (this.iHeight + vGap) * Math.floor(position / 2) + "px",
                    "left": (this.iWidth + hGap) * (position % 2) + "px",
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

        jumpOffPageThreeCompleted() {
            this.$scope["wpC"].taskFinished();
        }

        static clickImage(filename) {
            new Audio(filename).play();
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
                    this.bounce = true;
                    this.$timeout(() => {
                        this.page = 3;
                    }, 2000);
                } else if (this.droppedObjects.length === 8 || this.droppedObjects.length === 16) {
                    this.bounce = true;
                    this.$timeout(() => {
                        this.bounce = false;
                        this.page = 1;
                        this.playMainIntro();
                    }, 2000);
                }

            }

        };

        */

    }
}
