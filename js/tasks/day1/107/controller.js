/// <reference path="../../../../js/_references.ts"/>
/// <reference path="../../../../js/models/models.ts"/>
/// <reference path="../../../services/dataService.ts"/>
var ISPApp;
(function (ISPApp) {
    var Controllers;
    (function (Controllers) {
        "use strict";
        var Task107Controller = (function () {
            function Task107Controller($scope, $timeout, dataService) {
                this.$scope = $scope;
                this.$timeout = $timeout;
                this.dataService = dataService;
                this.showingPanel = 'choice';
                this.word = this.$scope['wpC'].word;
                this.task = dataService.getTask();
                this.path = 'content/' + this.word + '/present-past/day1/';
                this.stage = 1;
                this.activated = false;
                var audioUrl = 'content/common/audio/day1-task8.mp3';
                var handle = this;
                dataService.setInteractionEndActivateTaskCallback(function () {
                    handle.activated = true;
                });
                dataService.setupAudioIntroduction(audioUrl);
                dataService.playAudioIntroduction(3000);
                this.image1_p1 = this.path + this.task.structure['page1'][0]['file'];
                this.image2_p1 = this.path + this.task.structure['page1'][1]['file'];
                this.image1_p2 = this.path + this.task.structure['page2'][0]['file'];
                this.image2_p2 = this.path + this.task.structure['page2'][1]['file'];
                this.image1_p1_mode = this.task.structure['page1'][0]['mode'];
                this.image2_p1_mode = this.task.structure['page1'][1]['mode'];
                this.image1_p2_mode = this.task.structure['page2'][0]['mode'];
                this.image2_p2_mode = this.task.structure['page2'][1]['mode'];
                this.image1_p1_data = this.image1_p1_mode === 'none' ? {} : this.task.structure['page1'][0][this.image1_p1_mode];
                this.image2_p1_data = this.image2_p1_mode === 'none' ? {} : this.task.structure['page1'][1][this.image2_p1_mode];
                this.image1_p2_data = this.image1_p2_mode === 'none' ? {} : this.task.structure['page2'][0][this.image1_p2_mode];
                this.image2_p2_data = this.image2_p2_mode === 'none' ? {} : this.task.structure['page2'][1][this.image2_p2_mode];
            }
            Task107Controller.prototype.clickPresentImage = function () {
                var _this = this;
                if (this.stage === 1) {
                    this.showingPanel = 'one';
                    this.$timeout(function () {
                        new Audio('content/' + _this.word + '/present-past/day1/1.mp3').play();
                    }, 1500);
                    this.$timeout(function () {
                        _this.$scope['wpC'].setAndShowOnetimeInternalForwardArrowCallback(function () {
                            _this.clickReturn();
                        });
                    }, 3000);
                }
            };
            Task107Controller.prototype.clickPastImage = function () {
                var _this = this;
                if (this.stage === 2) {
                    this.showingPanel = 'two';
                    this.$timeout(function () {
                        new Audio('content/' + _this.word + '/present-past/day1/2.mp3').play();
                    }, 1500);
                    this.$timeout(function () {
                        _this.$scope['wpC'].taskFinished();
                    }, 3000);
                }
            };
            Task107Controller.prototype.clickReturn = function () {
                this.showingPanel = 'choice';
                this.stage = 2;
            };
            Task107Controller.$inject = ['$scope', '$timeout', 'DataService'];
            return Task107Controller;
        }());
        Controllers.Task107Controller = Task107Controller;
    })(Controllers = ISPApp.Controllers || (ISPApp.Controllers = {}));
})(ISPApp || (ISPApp = {}));
//# sourceMappingURL=controller.js.map