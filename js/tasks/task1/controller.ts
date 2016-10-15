/// <reference path="../../../js/_references"/>
/// <reference path="../../models/models"/>
/// <reference path="../../services/dataService"/>

namespace MorfologiApp.Controllers {
    "use strict";
    import IScope = angular.IScope;
    import ITimeoutService = angular.ITimeoutService;
    import IDataService = MorfologiApp.Services.DataService;

    export class Task1Controller {
        static $inject = ["$scope", "$timeout", "DataService"];

        private itemA;
        private itemB;
        private opacity: number;

        constructor(private $scope: IScope, private $timeout: ITimeoutService, private dataService: IDataService) {
            this.opacity = 0;
            // this.setupItems();

            $timeout(() => {
                this.opacity = 1;
            }, 1000);

        }
/*
        setupItems() {
            let firstItem = Math.random() > 0.5 ? "itemA" : "itemB";
            let secondItem = firstItem === "itemA" ? "itemB" : "itemA";
            let firstImage = Math.random() > 0.5 ? "correct.jpg" : "incorrect.jpg";
            let secondImage = firstImage === "correct.jpg" ? "incorrect.jpg" : "correct.jpg";

            this[firstItem] = {
                file: "content/" + this.word + "/articulation/day2/" + firstImage,
                correct: firstCorrect,
                highlight: false
            };
            this[secondItem] = {
                file: "content/" + this.word + "/articulation/day2/" + secondImage,
                correct: secondCorrect,
                highlight: false
            };
        }

        activateTask(handle) {
            this.dataService.externalCallDisableInteractionCallback(true, false);
            this.playingSequence = true;
            this.opacity = 1;
            handle.$timeout(() => {
                let audio = new Audio(handle.itemA["audio"]);
                audio.play();
                handle.itemA["highlight"] = true;
                handle.$timeout(() => {
                    handle.itemA["highlight"] = false;
                }, 1000);
                handle.$timeout(() => {
                    let audio = new Audio(handle.itemB["audio"]);
                    audio.play();
                    handle.itemB["highlight"] = true;
                    handle.$timeout(() => {
                        handle.itemB["highlight"] = false;
                        this.playingSequence = false;
                        this.dataService.externalCallDisableInteractionCallback(false, false);
                    }, 1000);
                }, 2000);
            }, 1500);
        }

        clickEarA() {
            let audio = new Audio(this.itemA["audio"]);
            audio.play();
        }

        clickEarB() {
            let audio = new Audio(this.itemB["audio"]);
            audio.play();
        }

        clickItemA() {
            this.itemA.highlight = true;
            this.itemB.highlight = false;
            if (this.itemA["correct"]) {
                if (this.round === this.repeats) {
                    this.$scope["wpC"].taskFinished();
                } else {
                    this.$scope["wpC"].setAndShowOnetimeInternalForwardArrowCallback( () => {
                        this.clickForwardArrow();
                    });
                }
            } else {
                let rand = Math.floor(Math.random() * 4);
                let audio = new Audio("content/common/audio/tryagain" + rand + ".mp3");
                audio.play();
                this.$timeout(() => {
                    this.itemA.highlight = false;
                }, 2000);
            }
        }

        clickItemB() {
            this.itemB.highlight = true;
            this.itemA.highlight = false;
            if (this.itemB["correct"]) {
                if (this.round === this.repeats) {
                    this.$scope["wpC"].taskFinished();
                } else {
                    this.$scope["wpC"].setAndShowOnetimeInternalForwardArrowCallback( () => {
                        this.clickForwardArrow();
                    });
                }
            } else {
                let rand = Math.floor(Math.random() * 4);
                let audio = new Audio("content/common/audio/tryagain" + rand + ".mp3");
                audio.play();
                this.$timeout(() => {
                    this.itemB.highlight = false;
                }, 2000);
            }
        }

        clickForwardArrow() {
            this.opacity = 0;
            this.round++;
            this.itemA.highlight = false;
            this.itemB.highlight = false;
            this.showForwardArrow = false;
            this.$timeout(() => {
                this.randomiseItems();
                this.activateTask(this);
            }, 1000);
        }

    */

    }
}
