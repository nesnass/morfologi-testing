/// <reference path="../../../../js/_references.ts"/>
/// <reference path="../../../../js/models/models.ts"/>
/// <reference path="../../../services/dataService.ts"/>
var ISPApp;
(function (ISPApp) {
    var Controllers;
    (function (Controllers) {
        "use strict";
        var Task106Controller = (function () {
            function Task106Controller($scope, $timeout, dataService) {
                var _this = this;
                this.$scope = $scope;
                this.$timeout = $timeout;
                this.dataService = dataService;
                this.imageToShow = 1;
                this.word = this.$scope['wpC'].word;
                this.imageUrl = 'content/' + this.word + '/singular-plural/1.png';
                var handle = this;
                dataService.setInteractionEndActivateTaskCallback(function () {
                    _this.$timeout(function () {
                        new Audio('content/' + handle.word + '/singular-plural/1.mp3').play();
                        $timeout(function () {
                            handle.$scope['wpC'].setAndShowOnetimeInternalForwardArrowCallback(function () {
                                handle.clickForward();
                            });
                        }, 3000);
                    }, 1500);
                });
                dataService.setupAudioIntroduction('content/common/audio/day1-task7.mp3');
                dataService.playAudioIntroduction(3000);
            }
            Task106Controller.prototype.clickImage = function () {
                new Audio('content/' + this.word + '/singular-plural/' + this.imageToShow + '.mp3').play();
            };
            Task106Controller.prototype.clickForward = function () {
                var _this = this;
                if (this.imageToShow < 4) {
                    this.imageToShow++;
                    this.imageUrl = 'content/' + this.word + '/singular-plural/' + this.imageToShow + '.png';
                    this.$timeout(function () {
                        new Audio('content/' + _this.word + '/singular-plural/' + _this.imageToShow + '.mp3').play();
                        _this.$timeout(function () {
                            if (_this.imageToShow < 4) {
                                _this.$scope['wpC'].setAndShowOnetimeInternalForwardArrowCallback(function () {
                                    _this.clickForward();
                                });
                            }
                        }, 3000);
                    }, 1500);
                }
                if (this.imageToShow === 4) {
                    this.$timeout(function () {
                        _this.$scope['wpC'].taskFinished();
                        _this.$scope.$digest();
                    }, 3000);
                }
            };
            Task106Controller.$inject = ['$scope', '$timeout', 'DataService'];
            return Task106Controller;
        })();
        Controllers.Task106Controller = Task106Controller;
    })(Controllers = ISPApp.Controllers || (ISPApp.Controllers = {}));
})(ISPApp || (ISPApp = {}));
//# sourceMappingURL=controller.js.map