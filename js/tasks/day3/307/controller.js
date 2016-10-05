/// <reference path="../../../../js/_references.ts"/>
/// <reference path="../../../../js/models/models.ts"/>
/// <reference path="../../../services/dataService.ts"/>
var ISPApp;
(function (ISPApp) {
    var Controllers;
    (function (Controllers) {
        "use strict";
        var Task307Controller = (function () {
            function Task307Controller($scope, $timeout, dataService) {
                var _this = this;
                this.$scope = $scope;
                this.$timeout = $timeout;
                this.dataService = dataService;
                this.word = $scope['wpC'].word;
                this.task = dataService.getTask();
                this.weekIndex = dataService.getWeek();
                this.videoActive = { active: true, playing: false };
                var storage_mode = dataService.getStorageMode();
                this.videoUrl = '';
                this.played = false;
                dataService.checkFile('week' + this.weekIndex + '-' + storage_mode + '-video.MOV', function (success) {
                    _this.videoUrl = success['nativeURL'];
                }, function (error) {
                    _this.videoUrl = '';
                    console.log('check file error: ' + error);
                });
                //this.posterUrl = 'content/common/images/default-poster.jpg';
                this.posterUrl = '';
                var handle = this;
                this.dataService.setInteractionEndActivateTaskCallback(function () {
                    handle.showPointer = true;
                });
                this.dataService.setupAudioIntroduction('content/common/audio/day3-task8.mp3');
                this.dataService.playAudioIntroduction(3000);
                if (dataService.getDesktopBrowserTesting()) {
                    $timeout(function () {
                        _this.videoPlayed();
                    }, 2000);
                }
            }
            Task307Controller.prototype.playVideo = function () {
                var _this = this;
                this.played = true;
                this.videoActive.playing = true;
                this.$timeout(function () {
                    _this.$scope['wpC'].taskFinished();
                }, 10000);
            };
            Task307Controller.prototype.videoPlaying = function () {
                /*
                var a = new Audio('content/' + this.word + '/role/day1/1.mp3');
                this.$timeout(() => {
                    a.play();
                }, 2000)
                */
            };
            Task307Controller.prototype.videoPlayed = function () {
                this.$scope['wpC'].taskFinished();
                this.$scope.$digest();
                this.videoActive.playing = false;
            };
            Task307Controller.$inject = ['$scope', '$timeout', 'DataService'];
            return Task307Controller;
        })();
        Controllers.Task307Controller = Task307Controller;
    })(Controllers = ISPApp.Controllers || (ISPApp.Controllers = {}));
})(ISPApp || (ISPApp = {}));
//# sourceMappingURL=controller.js.map