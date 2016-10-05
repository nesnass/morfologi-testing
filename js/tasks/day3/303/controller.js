/// <reference path="../../../../js/_references.ts"/>
/// <reference path="../../../../js/models/models.ts"/>
/// <reference path="../../../services/dataService.ts"/>
var ISPApp;
(function (ISPApp) {
    var Controllers;
    (function (Controllers) {
        "use strict";
        var Task303Controller = (function () {
            function Task303Controller($scope, $timeout, dataService) {
                this.$scope = $scope;
                this.$timeout = $timeout;
                this.dataService = dataService;
                this.word = this.$scope['wpC'].word;
                this.showQuestion = false;
                this.pulse = false;
                this.videoUrl = 'content/' + this.word + '/role/1.mp4';
                this.posterUrl = 'content/' + this.word + '/role/poster.jpg';
                this.videoActive = {
                    active: false
                };
                this.plays = 0;
                var handle = this;
                dataService.setInteractionEndActivateTaskCallback(function () {
                    handle.videoActive.active = true;
                });
                dataService.setupAudioIntroduction('content/common/audio/day1-task4.mp3');
                dataService.playAudioIntroduction(3000);
            }
            Task303Controller.prototype.videoPlaying = function () {
                /*
                var a = new Audio('content/' + this.word + '/role/day1/1.mp3');
                this.$timeout(() => {
                    a.play();
                }, 2000)
                */
            };
            Task303Controller.prototype.videoPlayed = function () {
                var _this = this;
                this.showQuestion = true;
                this.pulse = true;
                this.dataService.setupAudioIntroduction('content/' + this.word + '/role/day3/question.mp3');
                this.dataService.playAudioIntroduction(0);
                this.$scope.$digest();
                this.$timeout(function () {
                    _this.pulse = false;
                }, 3000);
            };
            Task303Controller.prototype.clickAnswer = function () {
                var _this = this;
                new Audio('content/' + this.word + '/role/day3/answer.mp3').play();
                this.$timeout(function () {
                    _this.$scope['wpC'].taskFinished();
                }, 3000);
            };
            Task303Controller.$inject = ['$scope', '$timeout', 'DataService'];
            return Task303Controller;
        })();
        Controllers.Task303Controller = Task303Controller;
    })(Controllers = ISPApp.Controllers || (ISPApp.Controllers = {}));
})(ISPApp || (ISPApp = {}));
//# sourceMappingURL=controller.js.map