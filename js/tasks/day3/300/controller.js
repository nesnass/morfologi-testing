/// <reference path="../../../../js/_references.ts"/>
/// <reference path="../../../../js/models/models.ts"/>
/// <reference path="../../../services/dataService.ts"/>
var ISPApp;
(function (ISPApp) {
    var Controllers;
    (function (Controllers) {
        "use strict";
        var Task300Controller = (function () {
            function Task300Controller($scope, $timeout, dataService) {
                var _this = this;
                this.$scope = $scope;
                this.$timeout = $timeout;
                this.dataService = dataService;
                this.clickedFlippys = [];
                this.word = this.$scope['wpC'].word;
                this.enlargeFlippy = {};
                this.showShrink = false;
                this.activate = true;
                this.item0 = {
                    image: 'content/' + this.word + '/main.jpg',
                    audio: 'content/' + this.word + '/main.mp3',
                    flipped: false,
                    style: {
                        'width': '0',
                        'height': '0',
                        'top': '380px',
                        'left': '500px'
                    }
                };
                this.selectedItem = this.item0;
                var images = [1, 2, 3];
                var randomOne = Math.floor(Math.random() * 3);
                // Randomise the three flip cards
                var firstItemPick = images.splice(randomOne, 1);
                var secondItemPick = Math.random() > 0.5 ? images[0] : images[1];
                var thirdItemPick = secondItemPick === images[0] ? images[1] : images[0];
                images = [1, 2, 3];
                randomOne = Math.floor(Math.random() * 3);
                // Pick two of three from the Day 1 images. The remaining flip card will be assigned a 'distractor' image
                var firstImagePick = images.splice(randomOne, 1);
                var secondImagePick = Math.random() > 0.5 ? images[0] : images[1];
                this['item' + firstItemPick] = {
                    image: 'content/' + this.word + '/variation/day1/' + firstImagePick + '.jpg',
                    audio: 'content/' + this.word + '/variation/day1/' + firstImagePick + '.mp3',
                    flipped: false,
                    style: {
                        'width': '0',
                        'height': '0',
                        'top': '380px',
                        'left': '500px'
                    }
                };
                this['item' + secondItemPick] = {
                    image: 'content/' + this.word + '/variation/day1/' + secondImagePick + '.jpg',
                    audio: 'content/' + this.word + '/variation/day1/' + secondImagePick + '.mp3',
                    flipped: false,
                    style: {
                        'width': '0',
                        'height': '0',
                        'top': '380px',
                        'left': '500px'
                    }
                };
                // Distractor image and sound
                this['item' + thirdItemPick] = {
                    image: 'content/' + this.word + '/variation/day3/1.jpg',
                    audio: 'content/' + this.word + '/variation/day3/1.mp3',
                    flipped: false,
                    style: {
                        'width': '0',
                        'height': '0',
                        'top': '380px',
                        'left': '500px'
                    }
                };
                // This should be run at the end of the constructor
                var handle = this;
                dataService.setInteractionEndActivateTaskCallback(function () {
                    _this.activateTask(handle);
                });
                dataService.setupAudioIntroduction('content/common/audio/day3-task1+task3.mp3');
                dataService.playAudioIntroduction(3000);
            }
            Task300Controller.prototype.activateTask = function (handle) {
            };
            Task300Controller.prototype.clickLargeImage = function () {
                new Audio(this.selectedItem['audio']).play();
            };
            Task300Controller.prototype.clickFlippy = function (index) {
                var _this = this;
                this.selectedItem = this['item' + index];
                if (this.clickedFlippys.indexOf(index) === -1) {
                    this.clickedFlippys.push(index);
                }
                if (!this.selectedItem['flipped']) {
                    this.$timeout(function () {
                        _this.selectedItem['flipped'] = true;
                        _this.selectedItem['style'] = {
                            'top': '50px',
                            'left': '0',
                            'width': '800px'
                        };
                        _this.activate = false;
                        _this.showShrink = true;
                        _this.$scope['wpC'].setAndShowOnetimeInternalForwardArrowCallback(function () {
                            _this.shrinkFlippy();
                        });
                    }, 1000);
                }
                else {
                    new Audio(this.selectedItem['audio']).play();
                }
            };
            Task300Controller.prototype.shrinkFlippy = function () {
                var _this = this;
                this.selectedItem['style'] = {
                    'top': '380px',
                    'left': '500px',
                    'width': '0'
                };
                //this.selectedItem['flipped'] = false;
                this.showShrink = false;
                this.$timeout(function () {
                    _this.activate = true;
                    if (_this.clickedFlippys.length === 4) {
                        _this.$scope['wpC'].taskFinished();
                    }
                }, 1000);
            };
            Task300Controller.prototype.getBackgroundImage = function (index) {
                return {
                    'background-image': 'url(\'' + this['item' + index]['image'] + '\')'
                };
            };
            Task300Controller.$inject = ['$scope', '$timeout', 'DataService'];
            return Task300Controller;
        })();
        Controllers.Task300Controller = Task300Controller;
    })(Controllers = ISPApp.Controllers || (ISPApp.Controllers = {}));
})(ISPApp || (ISPApp = {}));
//# sourceMappingURL=controller.js.map