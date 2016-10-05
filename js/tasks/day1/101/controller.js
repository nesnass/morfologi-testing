/// <reference path="../../../../js/_references.ts"/>
/// <reference path="../../../../js/models/models.ts"/>
/// <reference path="../../../services/dataService.ts"/>
var ISPApp;
(function (ISPApp) {
    var Controllers;
    (function (Controllers) {
        "use strict";
        var Task101Controller = (function () {
            function Task101Controller($scope, $timeout, dataService) {
                this.$scope = $scope;
                this.$timeout = $timeout;
                this.dataService = dataService;
                this.currentIndex = 0;
                this.showDetail = false;
                this.task = dataService.getTask();
                this.word = $scope['wpC'].word;
                this.showPointer = false;
                this.forceNewURI = Date.now();
                var handle = this;
                dataService.setInteractionEndActivateTaskCallback(function () {
                    handle.showPointer = true;
                });
                dataService.setupAudioIntroduction('content/' + this.word + '/related/day1/page1/1.mp3');
                dataService.playAudioIntroduction(3000);
            }
            Task101Controller.prototype.clickMainImage = function () {
                var audio = new Audio('content/' + this.word + '/main.mp3');
                audio.play();
            };
            Task101Controller.prototype.clickRelatedImage = function () {
                var _this = this;
                if (this.currentIndex === this.task.structure['page2'].length) {
                    return;
                }
                this.showPointer = false;
                this.page2_mode = this.task.structure['page2'][this.currentIndex]['mode'];
                this.page2imageUrl = 'content/' + this.word + '/related/day1/page2/' + this.task.structure['page2'][this.currentIndex]['file'] + '?rand=' + this.forceNewURI;
                var audioUrl = 'content/' + this.word + '/related/day1/page2/' + (this.currentIndex + 1) + '.mp3';
                this.$timeout(function () {
                    new Audio(audioUrl).play();
                }, 2000);
                if (this.page2_mode === 'focus') {
                    this.focusData = this.task.structure['focus'][this.currentIndex.toString()];
                }
                else if (this.page2_mode === 'overlay') {
                    this.customOverlay = this.task.structure['overlay'][this.currentIndex.toString()];
                }
                this.$timeout(function () {
                    _this.$scope['wpC'].setAndShowOnetimeInternalForwardArrowCallback(function () {
                        _this.clickBackToImages();
                    });
                }, 4000);
                this.showDetail = true;
            };
            Task101Controller.prototype.clickBackToImages = function () {
                this.currentIndex++;
                if (this.currentIndex < this.task.structure['page2'].length) {
                    var handle = this;
                    this.dataService.setInteractionEndActivateTaskCallback(function () {
                        handle.showPointer = true;
                    });
                    this.dataService.setupAudioIntroduction('content/' + this.word + '/related/day1/page1/' + (this.currentIndex + 1) + '.mp3');
                    this.dataService.playAudioIntroduction(3000);
                }
                else {
                    this.showPointer = false;
                    this.dataService.setInteractionEndActivateTaskCallback(null);
                    this.$scope['wpC'].taskFinished();
                }
                this.showDetail = false;
            };
            Task101Controller.prototype.clickDetailImage = function () {
                var audioUrl = 'content/' + this.word + '/related/day1/page2/' + (this.currentIndex + 1) + '.mp3';
                var audio = new Audio(audioUrl);
                audio.play();
            };
            Task101Controller.prototype.getBackgroundImage = function () {
                var index = this.currentIndex === this.task.structure['page2'].length ? this.currentIndex - 1 : this.currentIndex;
                return {
                    'background-image': 'url(\'content/' + this.word + '/related/day1/page1/' + this.task.structure['page1'][index]['file'] + '?rand=' + this.forceNewURI + '\')',
                    'border': 'solid ' + this.$scope['wpC'].taskColour,
                    'background-size': 'cover'
                };
            };
            Task101Controller.$inject = ['$scope', '$timeout', 'DataService'];
            return Task101Controller;
        }());
        Controllers.Task101Controller = Task101Controller;
    })(Controllers = ISPApp.Controllers || (ISPApp.Controllers = {}));
})(ISPApp || (ISPApp = {}));
//# sourceMappingURL=controller.js.map