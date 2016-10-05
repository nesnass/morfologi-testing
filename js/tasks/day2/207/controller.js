/// <reference path="../../../../js/_references.ts"/>
/// <reference path="../../../../js/models/models.ts"/>
/// <reference path="../../../services/dataService.ts"/>
var ISPApp;
(function (ISPApp) {
    var Controllers;
    (function (Controllers) {
        "use strict";
        var Task207Controller = (function () {
            function Task207Controller($scope, $timeout, dataService) {
                var _this = this;
                this.$scope = $scope;
                this.$timeout = $timeout;
                this.dataService = dataService;
                this.word = $scope['wpC'].word;
                this.task = dataService.getTask();
                this.videoUrl = '';
                this.weekIndex = dataService.getWeek();
                this.posterUrl = 'content/common/images/film.png';
                this.videoActive = { active: true };
                this.playing = false;
                this.showPointer = false;
                this.checkForVideo();
                var handle = this;
                this.dataService.setInteractionEndActivateTaskCallback(function () {
                    handle.showPointer = true;
                });
                dataService.setupAudioIntroduction('content/' + this.word + '/present-past/day2/instruction.mp3');
                dataService.playAudioIntroduction(3000);
                if (dataService.getDesktopBrowserTesting()) {
                    $timeout(function () {
                        _this.videoPlayed();
                    }, 2000);
                }
                /*
                $timeout(() => {
                    this.videoPlayed();
                }, 20000);
                */
            }
            Task207Controller.prototype.checkForVideo = function () {
                var _this = this;
                var storage_mode = this.dataService.getStorageMode();
                this.dataService.checkFile('week' + this.weekIndex + '-' + storage_mode + '-video.MOV', function (success) {
                    _this.videoUrl = success['nativeURL'];
                }, function (error) {
                    _this.videoUrl = '';
                    console.log('Video not found: ' + error);
                });
            };
            Task207Controller.prototype.captureVideo = function () {
                var _this = this;
                this.dataService.captureVideo(function () {
                    _this.checkForVideo();
                    _this.$scope['wpC'].taskFinished();
                }, function () {
                    console.log('Video capture error');
                });
            };
            Task207Controller.prototype.videoPlaying = function () {
                this.playing = true;
                /*
                 var a = new Audio('content/' + this.word + '/role/day1/1.mp3');
                 this.$timeout(() => {
                 a.play();
                 }, 2000)
                 */
            };
            Task207Controller.prototype.videoPlayed = function () {
                this.$scope['wpC'].taskFinished();
                this.$scope.$digest();
                this.playing = false;
            };
            Task207Controller.$inject = ['$scope', '$timeout', 'DataService'];
            return Task207Controller;
        }());
        Controllers.Task207Controller = Task207Controller;
    })(Controllers = ISPApp.Controllers || (ISPApp.Controllers = {}));
})(ISPApp || (ISPApp = {}));
//# sourceMappingURL=controller.js.map