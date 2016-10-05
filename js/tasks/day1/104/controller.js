/// <reference path="../../../../js/_references.ts"/>
/// <reference path="../../../../js/models/models.ts"/>
/// <reference path="../../../services/dataService.ts"/>
var ISPApp;
(function (ISPApp) {
    var Controllers;
    (function (Controllers) {
        "use strict";
        var Task104Controller = (function () {
            function Task104Controller($scope, $timeout, dataService) {
                this.$scope = $scope;
                this.$timeout = $timeout;
                this.dataService = dataService;
                this.playCount = 0;
                this.word = this.$scope['wpC'].word;
                this.videoUrl = 'content/' + this.word + '/articulation/1.mp4';
                this.posterUrl = 'content/' + this.word + '/articulation/poster.jpg';
                this.imageUrl = 'content/' + this.word + '/main.jpg';
                this.videoActive = {
                    active: false
                };
                var handle = this;
                dataService.setInteractionEndActivateTaskCallback(function () {
                    handle.videoActive.active = true;
                });
                dataService.setupAudioIntroduction('content/common/audio/day1-task5-1.mp3');
                dataService.playAudioIntroduction(3000);
            }
            Task104Controller.prototype.clickImage = function () {
                var audio = new Audio('content/' + this.word + '/main.mp3');
                audio.play();
            };
            Task104Controller.prototype.videoFinished = function () {
                this.playCount++;
                if (this.playCount === 1) {
                    this.videoActive = {
                        active: false
                    };
                    var handle = this;
                    this.dataService.setInteractionEndActivateTaskCallback(function () {
                        handle.videoActive.active = true;
                    });
                    this.dataService.setupAudioIntroduction('content/common/audio/day1-task5-2.mp3');
                    this.dataService.playAudioIntroduction(2000);
                }
                if (this.playCount === 2) {
                    this.$scope['wpC'].taskFinished();
                    this.$scope.$digest();
                }
            };
            Task104Controller.$inject = ['$scope', '$timeout', 'DataService'];
            return Task104Controller;
        })();
        Controllers.Task104Controller = Task104Controller;
    })(Controllers = ISPApp.Controllers || (ISPApp.Controllers = {}));
})(ISPApp || (ISPApp = {}));
//# sourceMappingURL=controller.js.map