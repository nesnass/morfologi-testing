/// <reference path="../../../../js/_references.ts"/>
/// <reference path="../../../../js/models/models.ts"/>
/// <reference path="../../../services/dataService.ts"/>
var ISPApp;
(function (ISPApp) {
    var Controllers;
    (function (Controllers) {
        "use strict";
        var Task100Controller = (function () {
            function Task100Controller($scope, $timeout, dataService) {
                this.$scope = $scope;
                this.$timeout = $timeout;
                this.dataService = dataService;
                this.clickedFlippys = [];
                this.word = this.$scope['wpC'].word;
                var audioUrl = 'content/common/audio/day1-task1.mp3';
                dataService.setupAudioIntroduction(audioUrl);
                dataService.playAudioIntroduction(3000);
            }
            Task100Controller.prototype.clickFlippy = function (index) {
                var _this = this;
                if (this.clickedFlippys.indexOf(index) === -1) {
                    this.clickedFlippys.push(index);
                }
                var path = index == 0 ? 'content/' + this.word + '/main.mp3'
                    : 'content/' + this.word + '/variation/day1/' + index + '.mp3';
                this.$timeout(function () {
                    new Audio(path).play();
                }, 1000);
                if (this.clickedFlippys.length === 4) {
                    this.$timeout(function () {
                        _this.$scope['wpC'].taskFinished();
                    }, 2000);
                }
            };
            Task100Controller.prototype.getBackgroundImage = function (index) {
                var path = index == 0 ? 'content/' + this.word + '/main.jpg'
                    : 'content/' + this.word + '/variation/day1/' + index + '.jpg';
                return {
                    'background-image': 'url(\'' + path + '\')'
                };
            };
            Task100Controller.$inject = ['$scope', '$timeout', 'DataService'];
            return Task100Controller;
        })();
        Controllers.Task100Controller = Task100Controller;
    })(Controllers = ISPApp.Controllers || (ISPApp.Controllers = {}));
})(ISPApp || (ISPApp = {}));
//# sourceMappingURL=controller.js.map