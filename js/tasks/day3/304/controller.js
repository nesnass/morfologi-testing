/// <reference path="../../../../js/_references.ts"/>
/// <reference path="../../../../js/models/models.ts"/>
/// <reference path="../../../services/dataService.ts"/>
var ISPApp;
(function (ISPApp) {
    var Controllers;
    (function (Controllers) {
        "use strict";
        var Task304Controller = (function () {
            function Task304Controller($scope, $timeout, dataService) {
                var _this = this;
                this.$scope = $scope;
                this.$timeout = $timeout;
                this.dataService = dataService;
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
                dataService.checkFile(taskFilename, function (success) {
                    _this.audioMedia = new Audio(success['nativeURL']);
                }, function () {
                    console.log('No existing audio file found.');
                    _this.audioMedia = null;
                });
                // This should be run at the end of the constructor
                var handle = this;
                this.dataService.setInteractionEndActivateTaskCallback(function () {
                    Task304Controller.activateParrot(handle, false, false);
                });
                this.dataService.setInteractionStartActivateTaskCallback(function () {
                    Task304Controller.activateParrot(handle, true, false);
                });
                this.dataService.setupAudioIntroduction('content/common/audio/day3-task5.mp3');
                this.dataService.playAudioIntroduction(3000);
                if (dataService.getDesktopBrowserTesting()) {
                    $timeout(function () {
                        _this.$scope['wpC'].taskFinished();
                    }, 2000);
                }
            }
            Task304Controller.prototype.clickImage = function () {
                var audio = new Audio('content/' + this.word + '/main.mp3');
                audio.play();
            };
            Task304Controller.prototype.clickLetter = function () {
                var audio = new Audio('content/' + this.word + '/first-sound/day1/correct.mp3');
                audio.play();
            };
            Task304Controller.activateParrot = function (handle, activate, speak) {
                if (activate) {
                    handle.growStyle = {
                        'width': '350px'
                    };
                    if (speak) {
                        handle.parrotUrl = 'content/common/images/parrot.gif';
                    }
                }
                else {
                    handle.growStyle = {
                        'width': '275px'
                    };
                    if (speak) {
                        handle.parrotUrl = 'content/common/images/parrot.png';
                    }
                }
            };
            Task304Controller.prototype.captureAudio = function () {
                var _this = this;
                if (this.recording) {
                    this.recordString = 'Start Recording';
                    this.recording = false;
                    this.dataService.stopCaptureAudio(function (success) {
                        if (success !== null) {
                            _this.audioMedia = new Audio(success['nativeURL']);
                        }
                        else {
                            _this.audioMedia = null;
                        }
                    }, function () {
                        _this.audioMedia = null;
                    });
                }
                else {
                    this.recordString = 'Stop Recording';
                    this.recording = true;
                    this.dataService.startCaptureAudio();
                }
            };
            Task304Controller.prototype.replayAudio = function () {
                var _this = this;
                if (this.audioMedia !== null) {
                    this.audioMedia.addEventListener('ended', function () {
                        _this.$timeout(function () {
                            Task304Controller.activateParrot(_this, false, true);
                            _this.$scope['wpC'].taskFinished();
                        });
                    });
                    Task304Controller.activateParrot(this, true, true);
                    this.audioMedia.play();
                }
            };
            Task304Controller.$inject = ['$scope', '$timeout', 'DataService'];
            return Task304Controller;
        })();
        Controllers.Task304Controller = Task304Controller;
    })(Controllers = ISPApp.Controllers || (ISPApp.Controllers = {}));
})(ISPApp || (ISPApp = {}));
//# sourceMappingURL=controller.js.map