/// <reference path="../../../../js/_references.ts"/>
/// <reference path="../../../../js/models/models.ts"/>
/// <reference path="../../../services/dataService.ts"/>

module ISPApp.Controllers {
    "use strict";
    import IScope = angular.IScope;
    import ITimeoutService = angular.ITimeoutService;
    import IDataService = ISPApp.Services.DataService;

    export class TaskC106Controller {
        static $inject = ['$scope', '$timeout', 'DataService'];

        private word: string;
        private dayWord: string;
        private dayIndex: number;
        private page: number;
        private alienData: {};

        private showAlienPlatform: boolean;
        private showAlien: boolean;
        private showAntennae: boolean;
        private finishAntennae: boolean;
        private opacity: number;
        private round: number;
        private attempts: number;

        private mainHelpPic: string;
        private helpItems: {}[];

        private highlightIknow: boolean;
        private highlightIdontknow: boolean;

        constructor(private $scope: IScope, private $timeout: ITimeoutService, private dataService: IDataService) {
            this.word = dataService.getWord();
            this.dayWord = dataService.getWordForConsolidationDay();
            this.dayIndex = dataService.getDay();
            this.showAlienPlatform = false;
            this.showAlien = false;
            this.showAntennae = false;
            this.finishAntennae = false;
            this.opacity = 0;
            this.page = 1;
            this.round = 1;
            this.attempts = 0;
            this.highlightIdontknow = false;
            this.highlightIknow = false;

            this.alienData = {
                ship: {
                    "code": "zoomable-image",
                    "id": 13,
                    "sequence": -1,
                    "description": "alien lands on screen",
                    "start": {
                        "x": 400,
                        "y": -500,
                        "w": 415,
                        "h": 299
                    },
                    "transition": {
                        "x": -400,
                        "y": 700,
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
                },
                platform: {
                    "code": "zoomable-image",
                    "id": 14,
                    "sequence": -1,
                    "description": "alien platform out",
                    "start": {
                        "x": 230,
                        "y": 350,
                        "w": 22,
                        "h": 18
                    },
                    "transition": {
                        "x": 7,
                        "y": 5,
                        "scale": 10,
                        "duration": 1
                    },
                    "opacity": 1,
                    "visible_before": true,
                    "visible_after": true,
                    "auto_start": true,
                    "auto_return": false,
                    "allow_return": false,
                    "type": "png"
                }
            };

            this.dataService.setupAudioIntroduction('content/common/audio/consolidation/task7/spaceshiplanding.mp3');
            this.dataService.playAudioIntroduction(100);
        }

        shipLanded() {
            this.showAlienPlatform = true;
        }

        platformOpen() {
            var handle = this;
            this.showAlien = true;

            var antennaFlash = () => {
                this.showAntennae = true;
                this.$timeout(() => {
                    this.showAntennae = false;
                    if (!this.finishAntennae) {
                        this.$timeout(() => {
                            antennaFlash();
                        }, 1000)
                    }
                }, 1000)
            };
             antennaFlash();

            this.opacity = 1;
            this.highlightButtons();

            handle.dataService.setInteractionEndActivateTaskCallback(() => {
                handle.dataService.clearInteractionEndActivateTaskCallback();
                handle.dataService.setupAudioIntroduction('content/' + this.word + '/task7/' + this.dayWord + '/instruction.mp3');
                handle.dataService.playAudioIntroduction(1000);
            });
            this.dataService.setupAudioIntroduction('content/common/audio/consolidation/task7/imrobben.mp3');
            this.dataService.playAudioIntroduction(500);
        }

        highlightButtons() {
            this.dataService.externalCallDisableInteractionCallback(true, false);
            this.$timeout(() => {
                this.highlightIknow = true;
                new Audio('content/common/audio/consolidation/iknowtheanswer.mp3').play();
                this.$timeout(() => {
                    this.highlightIknow = false;
                    this.$timeout(() => {
                        this.highlightIdontknow = true;
                        new Audio('content/common/audio/consolidation/ineedhelp.mp3').play();
                        this.$timeout(() => {
                            this.highlightIdontknow = false;
                            this.dataService.externalCallDisableInteractionCallback(false, false);
                        }, 1000)
                    }, 1500);
                }, 1000)
            }, 16500);
        }

        goToHelpScreen() {
            this.attempts++;
            this.page = 2;
            var items = [
                {
                    image: "content/" + this.word + "/task7/" + this.dayWord + "/round" + this.round + "/incorrect/1.jpg",
                    audio: "content/" + this.word + "/task7/" + this.dayWord + "/round" + this.round + "/incorrect/1.mp3",
                    correct: false,
                    highlighted: false,
                    focussed: false
                },
                {
                    image: "content/" + this.word + "/task7/" + this.dayWord + "/round" + this.round + "/incorrect/2.jpg",
                    audio: "content/" + this.word + "/task7/" + this.dayWord + "/round" + this.round + "/incorrect/2.mp3",
                    correct: false,
                    highlighted: false,
                    focussed: false
                },
                {
                    image: "content/" + this.word + "/task7/" + this.dayWord + "/round" + this.round + "/correct/1.jpg",
                    audio: "content/" + this.word + "/task7/" + this.dayWord + "/round" + this.round + "/correct/1.mp3",
                    correct: true,
                    highlighted: false,
                    focussed: false
                }
            ];

            this.helpItems = this.dataService.shuffleArray(items);
            this.mainHelpPic = 'content/' + this.dayWord + '/main.jpg';

            var handle = this;
            var focusItem = function(item) {
                item['focussed'] = true;
                new Audio(item['audio']).play();
                handle.$timeout(() => {
                    item['focussed'] = false;
                }, 1000);
            };

            this.dataService.setInteractionEndActivateTaskCallback(() => {
                handle.dataService.externalCallDisableInteractionCallback(true, false);
                handle.$timeout(() => {
                    focusItem(handle.helpItems[0]);
                    handle.$timeout(() => {
                        focusItem(handle.helpItems[1]);
                        handle.$timeout(() => {
                            focusItem(handle.helpItems[2]);
                            handle.dataService.externalCallDisableInteractionCallback(false, false);
                        }, 2000);
                    }, 2000);
                }, 2000);
            });

            this.dataService.setupAudioIntroduction('content/' + this.word + '/task7/' + this.dayWord + '/round' + this.round + '/question.mp3');
            this.dataService.playAudioIntroduction(1500);
        }

        goToAnswerScreen() {
            this.page = 3;
            this.dataService.clearInteractionEndActivateTaskCallback();
            this.dataService.setupAudioIntroduction('content/' + this.word + '/task7/' + this.dayWord + '/question.mp3');
            this.dataService.playAudioIntroduction(1500);
        }

        goToFinalScreen() {
            this.page = 4;
            this.dataService.setupAudioIntroduction('content/' + this.word + '/task7/' + this.dayWord + '/thanks.mp3');
            this.dataService.playAudioIntroduction(1500);
            this.$scope['wpC'].taskFinished();
        }

        clickItem(item) {
            if (item['highlighted']) {
                return;
            }
            item['highlighted'] = true;
            if(item['correct']) {
                new Audio('content/' + this.word + '/task7/' + this.dayWord + '/round' + this.round + '/answer.mp3').play();
                this.$scope['wpC'].setAndShowOnetimeInternalForwardArrowCallback( () => {
                    if (this.round === 1) {
                        this.round = 2;
                        this.goToHelpScreen();
                    } else {
                        this.round = 1;
                        this.goToAnswerScreen();
                    }
                })
            } else {
                var rand = Math.floor(Math.random() * 4);
                new Audio('content/common/audio/tryagain' + rand + '.mp3').play();
                this.$timeout(() => {
                    item['highlighted'] = false;
                }, 2000)
            }
        }


    }
}
