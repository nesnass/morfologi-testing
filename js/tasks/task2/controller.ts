/// <reference path="../../../js/_references"/>
/// <reference path="../../models/models"/>
/// <reference path="../../services/dataService"/>

namespace MorfologiApp.Controllers {
    "use strict";
    import IScope = angular.IScope;
    import ITimeoutService = angular.ITimeoutService;
    import IDataService = MorfologiApp.Services.DataService;

    export class Task2Controller {
        static $inject = ["$scope", "$timeout", "DataService"];

        private word: string;
        private dayWord: string;
        private dayIndex: number;
        private stage: string;
        private correctCounter: number;
        private stageOne: {}[];
        private stageTwo: {}[];

        constructor(private $scope: IScope, private $timeout: ITimeoutService, private dataService: IDataService) {

            this.stage = "stageOne";
            this.correctCounter = 0;

            let correctToShuffle = [];
            let incorrectToShuffle = [];

            for (let i = 1; i < 25; i++) {
                let item = {
                    image: "content/" + this.word + "/" + this.dayWord + "/correct/" + i + ".jpg",
                    audio: "content/" + this.word + "/" + this.dayWord + "/correct/" + i + ".mp3",
                    correct: true,
                    highlighted: false
                };
                correctToShuffle.push(item);
            }

            for (let i = 1; i < 7; i++) {
                let item = {
                    image: "content/" + this.word + "/" + this.dayWord + "/incorrect/" + i + ".jpg",
                    audio: "content/" + this.word + "/" + this.dayWord + "/incorrect/" + i + ".mp3",
                    correct: false,
                    highlighted: false
                };
                incorrectToShuffle.push(item);
            }

            let stageTwoCorrect = correctToShuffle.splice(12, 12);
            let stageTwoIncorrect = incorrectToShuffle.splice(3, 3);

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

        /*

        activateTask() {

        }

        clickItem(item) {
            this.$timeout(() => {
                new Audio(item["audio"]).play();
            }, 250);
            if (item["highlighted"]) {
                return;
            }
            item["highlighted"] = true;
            if (!item.correct) {
                this.$timeout(() => {
                    item["highlighted"] = false;
                }, 2000);
            } else {
                this.correctCounter++;
            }
            if (this.correctCounter === 12) {
                if (this.stage === "stageOne") {
                    this.$scope["wpC"].setAndShowOnetimeInternalForwardArrowCallback( () => {
                        this.startStageTwo();
                    });
                } else {
                    this.$scope["wpC"].taskFinished();
                }
            }
        }

        startStageTwo() {
            this.stage = "stageTwo";
            this.correctCounter = 0;
            new Audio("content/" + this.word + "/task1/instruction-" + this.dayWord + ".mp3").play();
        }

        */

    }
}
