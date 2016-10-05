/// <reference path="../../../../js/_references.ts"/>
/// <reference path="../../../../js/models/models.ts"/>
/// <reference path="../../../services/dataService.ts"/>
var ISPApp;
(function (ISPApp) {
    var Controllers;
    (function (Controllers) {
        "use strict";
        var Task103Controller = (function () {
            function Task103Controller($scope, $timeout, dataService) {
                this.$scope = $scope;
                this.$timeout = $timeout;
                this.dataService = dataService;
                this.word = this.$scope['wpC'].word;
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
            Task103Controller.prototype.videoPlaying = function () {
                var a = new Audio('content/' + this.word + '/role/day1/1.mp3');
                this.$timeout(function () {
                    a.play();
                }, 2000);
            };
            Task103Controller.prototype.videoPlayed = function () {
                var _this = this;
                this.plays++;
                if (this.plays === 1) {
                    this.$timeout(function () {
                        _this.$scope['wpC'].taskFinished();
                    }, 500);
                }
            };
            Task103Controller.$inject = ['$scope', '$timeout', 'DataService'];
            return Task103Controller;
        })();
        Controllers.Task103Controller = Task103Controller;
    })(Controllers = ISPApp.Controllers || (ISPApp.Controllers = {}));
})(ISPApp || (ISPApp = {}));
//# sourceMappingURL=controller.js.map