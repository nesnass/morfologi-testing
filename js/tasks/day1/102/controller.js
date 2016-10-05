/// <reference path="../../../../js/_references.ts"/>
/// <reference path="../../../../js/models/models.ts"/>
/// <reference path="../../../services/dataService.ts"/>
var ISPApp;
(function (ISPApp) {
    var Controllers;
    (function (Controllers) {
        "use strict";
        var Task102Controller = (function () {
            function Task102Controller($scope, $timeout, dataService) {
                this.$scope = $scope;
                this.$timeout = $timeout;
                this.dataService = dataService;
                this.clickedFlippys = [];
                this.word = this.$scope['wpC'].word;
                this.clickedFlippys = [];
                var audioUrl = 'content/' + this.word + '/category/day1/instruction.mp3';
                dataService.setupAudioIntroduction(audioUrl);
                dataService.playAudioIntroduction(3000);
            }
            Task102Controller.prototype.clickFlippy = function (index) {
                var path = index == 0 ? 'content/' + this.word + '/main.mp3'
                    : 'content/' + this.word + '/category/day1/' + index + '.mp3';
                var audio = new Audio(path);
                this.$timeout(function () {
                    audio.play();
                }, 1000);
                if (this.clickedFlippys.indexOf(index) === -1) {
                    this.clickedFlippys.push(index);
                }
                if (this.clickedFlippys.length === 4) {
                    var workPanelController = 'wpC';
                    this.$scope[workPanelController].taskFinished();
                }
            };
            Task102Controller.prototype.getBackgroundImage = function (index) {
                var path = index == 0 ? 'content/' + this.word + '/main.jpg'
                    : 'content/' + this.word + '/category/day1/' + index + '.jpg';
                return { 'background-image': 'url(\'' + path + '\')' };
            };
            Task102Controller.prototype.clickMainImage = function () {
                var audio = new Audio('content/' + this.word + '/category/category.mp3');
                audio.play();
            };
            Task102Controller.$inject = ['$scope', '$timeout', 'DataService'];
            return Task102Controller;
        })();
        Controllers.Task102Controller = Task102Controller;
    })(Controllers = ISPApp.Controllers || (ISPApp.Controllers = {}));
})(ISPApp || (ISPApp = {}));
//# sourceMappingURL=controller.js.map