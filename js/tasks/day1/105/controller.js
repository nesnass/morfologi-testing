/// <reference path="../../../../js/_references.ts"/>
/// <reference path="../../../../js/models/models.ts"/>
/// <reference path="../../../services/dataService.ts"/>
var ISPApp;
(function (ISPApp) {
    var Controllers;
    (function (Controllers) {
        "use strict";
        var Task105Controller = (function () {
            function Task105Controller($scope, $timeout, dataService) {
                var _this = this;
                this.$scope = $scope;
                this.$timeout = $timeout;
                this.dataService = dataService;
                this.word = this.$scope['wpC'].word;
                this.letterImageUrl = 'content/' + this.word + '/first-sound/day1/letter.png';
                this.mainImageUrl = 'content/' + this.word + '/main.jpg';
                dataService.externalCallDisableInteractionCallback(true, true);
                $timeout(function () {
                    var audio1 = new Audio('content/' + _this.word + '/first-sound/day1/letter-part1.mp3');
                    audio1.addEventListener('ended', function () {
                        var audio2 = new Audio('content/' + _this.word + '/first-sound/day1/letter-part2.mp3');
                        audio2.addEventListener('ended', function () {
                            _this.dataService.externalCallDisableInteractionCallback(false, true);
                        });
                        audio2.play();
                        _this.hightlightMainImage();
                        var audioUrl = 'content/' + _this.word + '/first-sound/day1/instruction1.mp3';
                        dataService.setupAudioIntroduction(audioUrl);
                    });
                    audio1.play();
                    _this.highlightLetter();
                }, 3000);
            }
            Task105Controller.prototype.clickImage = function () {
                var audio = new Audio('content/' + this.word + '/main.mp3');
                audio.play();
                //this.hightlightMainImage();
            };
            Task105Controller.prototype.clickLetter = function () {
                var audio = new Audio('content/' + this.word + '/first-sound/correct.mp3');
                audio.play();
                // this.highlightLetter();
            };
            Task105Controller.prototype.highlightLetter = function () {
                var _this = this;
                this.lightLetter = true;
                this.$timeout(function () {
                    _this.lightLetter = false;
                }, 1000);
            };
            Task105Controller.prototype.hightlightMainImage = function () {
                var _this = this;
                this.lightMainImage = true;
                this.$timeout(function () {
                    _this.lightMainImage = false;
                    if (_this.dataService.getTask().type === '105') {
                        _this.$scope['wpC'].taskFinished();
                    }
                }, 1000);
            };
            Task105Controller.$inject = ['$scope', '$timeout', 'DataService'];
            return Task105Controller;
        })();
        Controllers.Task105Controller = Task105Controller;
    })(Controllers = ISPApp.Controllers || (ISPApp.Controllers = {}));
})(ISPApp || (ISPApp = {}));
//# sourceMappingURL=controller.js.map