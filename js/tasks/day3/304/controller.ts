/// <reference path="../../../../js/_references.ts"/>
/// <reference path="../../../../js/models/models.ts"/>
/// <reference path="../../../services/dataService.ts"/>

module ISPApp.Controllers {
    import IDataService = ISPApp.Services.IDataService;
    import ITimeoutService = angular.ITimeoutService;
    import IScope = angular.IScope;
    "use strict";

    export class Task304Controller {
        static $inject = ['$scope', '$timeout', 'DataService'];

        private word: string;
        private letterImageUrl: string;
        private mainImageUrl: string;
        private parrotUrl: string;
        private growStyle: {};
        private recordString: string;
        private recording: boolean;
        private audioMedia: HTMLAudioElement;

        constructor(private $scope: IScope, private $timeout: ITimeoutService, private dataService: IDataService) {
            this.word = this.$scope['wpC'].word;
            this.letterImageUrl = 'content/' + this.word + '/first-sound/day1/letter.png';
            this.mainImageUrl = 'content/' + this.word + '/main.jpg';
            this.parrotUrl = 'content/common/images/parrot.png';
            this.growStyle = {
                'width': '200px'
            };
            this.recordString = 'Start Recording';
            this.recording = false;

            // Load an existing audio file if already recorded
            var taskFilename = 'week' + dataService.getWeek() + '-task' + dataService.getTaskIndex() + '-audio.m4a';
            dataService.checkFile(taskFilename, (success) => {
                this.audioMedia = new Audio(success['nativeURL']);
            }, () => {
                console.log('No existing audio file found.');
                this.audioMedia = null;
            });

            // This should be run at the end of the constructor

            var handle = this;
            this.dataService.setInteractionEndActivateTaskCallback(() => {
                Task304Controller.activateParrot(handle, false, false);
            });
            this.dataService.setInteractionStartActivateTaskCallback(() => {
                Task304Controller.activateParrot(handle, true, false);
            });

            this.dataService.setupAudioIntroduction('content/common/audio/day3-task5.mp3');
            this.dataService.playAudioIntroduction(3000);

            if (dataService.getDesktopBrowserTesting()) {
                $timeout(() => {
                    this.$scope['wpC'].taskFinished();
                }, 2000);
            }
        }

        clickImage() {
            var audio = new Audio('content/' + this.word + '/main.mp3');
            audio.play();
        }

        clickLetter() {
            var audio = new Audio('content/' + this.word + '/first-sound/day1/correct.mp3');
            audio.play();
        }

        static activateParrot(handle, activate: boolean, speak: boolean) {
            if (activate) {
                handle.growStyle = {
                    'width': '350px'
                };
                if (speak) {
                    handle.parrotUrl = 'content/common/images/parrot.gif';
                }
            } else {
                handle.growStyle = {
                    'width': '275px'
                };
                if (speak) {
                    handle.parrotUrl = 'content/common/images/parrot.png';
                }
            }
        }

        captureAudio() {
            if (this.recording) {   // Stop recording
                this.recordString = 'Start Recording';
                this.recording = false;
                this.dataService.stopCaptureAudio((success) => {
                    if (success !== null) {
                        this.audioMedia = new Audio(success['nativeURL']);
                    } else {
                        this.audioMedia = null;
                    }
                }, () => {
                    this.audioMedia = null;
                })
            } else {        // Start recording
                this.recordString = 'Stop Recording';
                this.recording = true;
                this.dataService.startCaptureAudio();
            }
        }

        replayAudio() {
            if (this.audioMedia !== null) {
                this.audioMedia.addEventListener('ended', () => {
                    this.$timeout(() => {
                        Task304Controller.activateParrot(this, false, true);
                        this.$scope['wpC'].taskFinished();
                    })
                });
                Task304Controller.activateParrot(this, true, true);
                this.audioMedia.play();
            }
        }

    }
}
