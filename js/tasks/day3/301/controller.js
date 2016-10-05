/// <reference path="../../../../js/_references.ts"/>
/// <reference path="../../../../js/models/models.ts"/>
/// <reference path="../../../services/dataService.ts"/>
var ISPApp;
(function (ISPApp) {
    var Controllers;
    (function (Controllers) {
        "use strict";
        var Task301Controller = (function () {
            function Task301Controller($scope, $timeout, dataService) {
                var _this = this;
                this.$scope = $scope;
                this.$timeout = $timeout;
                this.dataService = dataService;
                this.currentIndex = 0;
                this.showDetail = false;
                this.task = dataService.getTask();
                this.word = $scope['wpC'].word;
                this.showPointer = false;
                this.activated = false;
                this.finished = false;
                var handle = this;
                dataService.setInteractionEndActivateTaskCallback(function () {
                    _this.activateTask(handle);
                });
                dataService.setupAudioIntroduction('content/common/audio/day3-task2.mp3');
                dataService.playAudioIntroduction(3000);
            }
            Task301Controller.prototype.activateTask = function (handle) {
                handle.$timeout(function () {
                    handle.dataService.setInteractionEndActivateTaskCallback(function () {
                        handle.showPointer = true;
                        handle.activated = true;
                    });
                    handle.dataService.setupAudioIntroduction('content/' + handle.word + '/related/day3/page1/1.mp3');
                    handle.dataService.playAudioIntroduction(0);
                }, 1500);
            };
            Task301Controller.prototype.clickMainImage = function () {
                if (!this.activated) {
                    return;
                }
                var audio = new Audio('content/' + this.word + '/main.mp3');
                audio.play();
            };
            Task301Controller.prototype.clickDetailImage = function () {
                var audioUrl = 'content/' + this.word + '/related/day3/page2/' + (this.currentIndex + 1) + '.mp3';
                var audio = new Audio(audioUrl);
                audio.play();
            };
            Task301Controller.prototype.clickRelatedImage = function () {
                var _this = this;
                if (!this.activated || this.finished) {
                    return;
                }
                this.showPointer = false;
                this.page2_mode = this.task.structure['page2'][this.currentIndex]['mode'];
                this.page2imageUrl = 'content/' + this.word + '/related/day3/page2/' + this.task.structure['page2'][this.currentIndex]['file'];
                if (this.page2_mode === 'focus') {
                    this.focusData = this.task.structure['focus'][this.currentIndex.toString()];
                }
                else if (this.page2_mode === 'overlay') {
                    this.customOverlay = this.task.structure['overlay'][this.currentIndex.toString()];
                }
                this.showDetail = true;
                this.$timeout(function () {
                    _this.$scope['wpC'].setAndShowOnetimeInternalForwardArrowCallback(function () {
                        _this.clickBackToImages();
                    });
                }, 500);
            };
            Task301Controller.prototype.clickBackToImages = function () {
                this.activated = false;
                if (this.currentIndex < this.task.structure['page2'].length - 1) {
                    this.currentIndex++;
                    var handle = this;
                    this.dataService.setInteractionEndActivateTaskCallback(function () {
                        handle.showPointer = true;
                        handle.activated = true;
                    });
                    this.dataService.setupAudioIntroduction('content/' + this.word + '/related/day3/page1/' + (this.currentIndex + 1) + '.mp3');
                    this.dataService.playAudioIntroduction(3000);
                }
                else {
                    this.showPointer = false;
                    this.finished = true;
                    this.$scope['wpC'].taskFinished();
                }
                this.showDetail = false;
            };
            Task301Controller.prototype.getBackgroundImage = function (index) {
                return {
                    'background-image': 'url(\'content/' + this.word + '/related/day3/page1/' + this.task.structure['page1'][this.currentIndex]['file'] + '\')',
                    'border': 'solid ' + this.$scope['wpC'].taskColour,
                    'background-size': 'cover'
                };
            };
            Task301Controller.$inject = ['$scope', '$timeout', 'DataService'];
            return Task301Controller;
        })();
        Controllers.Task301Controller = Task301Controller;
    })(Controllers = ISPApp.Controllers || (ISPApp.Controllers = {}));
})(ISPApp || (ISPApp = {}));
//# sourceMappingURL=controller.js.map