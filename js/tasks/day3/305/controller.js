/// <reference path="../../../../js/_references.ts"/>
/// <reference path="../../../../js/models/models.ts"/>
/// <reference path="../../../services/dataService.ts"/>
var ISPApp;
(function (ISPApp) {
    var Controllers;
    (function (Controllers) {
        "use strict";
        var Task305Controller = (function () {
            function Task305Controller($scope, $timeout, dataService) {
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
                this.audioMedia = null;
                // This should be run at the end of the constructor
                var handle = this;
                this.dataService.setInteractionEndActivateTaskCallback(function () {
                    Task305Controller.activateParrot(handle, false, false);
                });
                this.dataService.setInteractionStartActivateTaskCallback(function () {
                    Task305Controller.activateParrot(handle, true, false);
                });
                this.dataService.setupAudioIntroduction('content/' + this.word + '/first-sound/day3/instruction.mp3');
                this.dataService.playAudioIntroduction(3000);
                if (dataService.getDesktopBrowserTesting()) {
                    $timeout(function () {
                        _this.$scope['wpC'].taskFinished();
                    }, 2000);
                }
            }
            Task305Controller.prototype.clickImage = function () {
                var audio = new Audio('content/' + this.word + '/main.mp3');
                audio.play();
            };
            Task305Controller.prototype.clickLetter = function () {
                var audio = new Audio('content/' + this.word + '/first-sound/correct.mp3');
                audio.play();
            };
            Task305Controller.activateParrot = function (handle, activate, speak) {
                if (activate) {
                    handle.growStyle = {
                        'width': '250px'
                    };
                    if (speak) {
                        handle.parrotUrl = 'content/common/images/parrot.gif';
                    }
                }
                else {
                    handle.growStyle = {
                        'width': '200px'
                    };
                    if (speak) {
                        handle.parrotUrl = 'content/common/images/parrot.png';
                    }
                }
            };
            Task305Controller.prototype.captureAudio = function () {
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
            Task305Controller.prototype.replayAudio = function () {
                var _this = this;
                if (this.audioMedia !== null) {
                    this.audioMedia.addEventListener('ended', function () {
                        _this.$timeout(function () {
                            Task305Controller.activateParrot(_this, false, true);
                            _this.$scope['wpC'].taskFinished();
                        });
                    });
                    Task305Controller.activateParrot(this, true, true);
                    this.audioMedia.play();
                }
            };
            Task305Controller.$inject = ['$scope', '$timeout', 'DataService'];
            return Task305Controller;
        })();
        Controllers.Task305Controller = Task305Controller;
    })(Controllers = ISPApp.Controllers || (ISPApp.Controllers = {}));
})(ISPApp || (ISPApp = {}));
//# sourceMappingURL=controller.js.map