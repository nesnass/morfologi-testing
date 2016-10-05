/// <reference path="../../../../js/_references.ts"/>
/// <reference path="../../../../js/models/models.ts"/>
/// <reference path="../../../services/dataService.ts"/>
var ISPApp;
(function (ISPApp) {
    var Controllers;
    (function (Controllers) {
        "use strict";
        var Task306Controller = (function () {
            function Task306Controller($scope, $timeout, dataService) {
                this.$scope = $scope;
                this.$timeout = $timeout;
                this.dataService = dataService;
                this.clickedFlippys = [];
                this.word = this.$scope['wpC'].word;
                this.enlargeFlippy = {};
                this.activate = true;
                this.showStone = false;
                var randomOne = Math.floor(Math.random() * 4);
                var randomTwo = Math.floor(Math.random() * 3);
                var randomThree = Math.floor(Math.random() * 2);
                // Randomise the contents
                var images = [1, 2, 3, 4];
                var firstItemPick = images.splice(randomOne, 1)[0];
                var secondItemPick = images.splice(randomTwo, 1)[0];
                var thirdItemPick = images.splice(randomThree, 1)[0];
                var fourthItemPick = images[0];
                randomOne = Math.floor(Math.random() * 4);
                randomTwo = Math.floor(Math.random() * 3);
                randomThree = Math.floor(Math.random() * 2);
                // Randomise the presents
                var presents = [0, 1, 2, 3];
                var firstPresentPick = presents.splice(randomOne, 1)[0];
                var secondPresentPick = presents.splice(randomTwo, 1)[0];
                var thirdPresentPick = presents.splice(randomThree, 1)[0];
                var fourthPresentPick = presents[0];
                this['item' + firstPresentPick] = {
                    closedImage: 'content/common/images/gift-closed-grey1.png',
                    openImage: 'content/common/images/gift-opened-grey1.png',
                    image: 'content/' + this.word + '/singular-plural/' + firstItemPick + '.png',
                    audio: 'content/' + this.word + '/singular-plural/' + firstItemPick + '-short.mp3',
                    opened: false,
                    style: {
                        'width': '0',
                        'height': '0',
                        'top': '380px',
                        'left': '500px'
                    }
                };
                this['item' + secondPresentPick] = {
                    closedImage: 'content/common/images/gift-closed-grey2.png',
                    openImage: 'content/common/images/gift-opened-grey2.png',
                    image: 'content/' + this.word + '/singular-plural/' + secondItemPick + '.png',
                    audio: 'content/' + this.word + '/singular-plural/' + secondItemPick + '-short.mp3',
                    opened: false,
                    style: {
                        'width': '0',
                        'height': '0',
                        'top': '380px',
                        'left': '500px'
                    }
                };
                this['item' + thirdPresentPick] = {
                    closedImage: 'content/common/images/gift-closed-pink.png',
                    openImage: 'content/common/images/gift-opened-pink.png',
                    image: 'content/' + this.word + '/singular-plural/' + thirdItemPick + '.png',
                    audio: 'content/' + this.word + '/singular-plural/' + thirdItemPick + '-short.mp3',
                    opened: false,
                    style: {
                        'width': '0',
                        'height': '0',
                        'top': '380px',
                        'left': '500px'
                    }
                };
                this['item' + fourthPresentPick] = {
                    closedImage: 'content/common/images/gift-closed-blue.png',
                    openImage: 'content/common/images/gift-opened-blue.png',
                    image: 'content/' + this.word + '/singular-plural/' + fourthItemPick + '.png',
                    audio: 'content/' + this.word + '/singular-plural/' + fourthItemPick + '-short.mp3',
                    opened: false,
                    style: {
                        'width': '0',
                        'height': '0',
                        'top': '380px',
                        'left': '500px'
                    }
                };
                this.selectedItem = this.item0;
                dataService.setupAudioIntroduction('content/common/audio/day3-task7-1.mp3');
                dataService.playAudioIntroduction(3000);
            }
            Task306Controller.prototype.clickImage = function (index) {
                var _this = this;
                var item = this['item' + index];
                if (this.clickedFlippys.indexOf(index) === -1) {
                    this.clickedFlippys.push(index);
                }
                new Audio('content/common/audio/day3-task7-2.mp3').play();
                item['style'] = {
                    'width': '600px',
                    'top': '50px',
                    'left': '120px'
                };
                this.$timeout(function () {
                    _this.showStone = true;
                }, 1000);
                this.selectedItem = item;
                this.activate = false;
                this.$timeout(function () {
                    _this.$scope['wpC'].setAndShowOnetimeInternalForwardArrowCallback(function () {
                        _this.shrink();
                    }, 2000);
                }, 3000);
            };
            Task306Controller.prototype.clickGift = function () {
                new Audio(this.selectedItem['audio']).play();
            };
            Task306Controller.prototype.shrink = function () {
                var _this = this;
                this.selectedItem['style'] = {
                    'width': '0',
                    'top': '380px',
                    'left': '500px'
                };
                this.showStone = false;
                this.selectedItem['opened'] = true;
                this.$timeout(function () {
                    _this.activate = true;
                }, 1000);
                if (this.clickedFlippys.length === 4) {
                    var workPanelController = 'wpC';
                    this.$scope[workPanelController].taskFinished();
                }
            };
            Task306Controller.$inject = ['$scope', '$timeout', 'DataService'];
            return Task306Controller;
        })();
        Controllers.Task306Controller = Task306Controller;
    })(Controllers = ISPApp.Controllers || (ISPApp.Controllers = {}));
})(ISPApp || (ISPApp = {}));
//# sourceMappingURL=controller.js.map