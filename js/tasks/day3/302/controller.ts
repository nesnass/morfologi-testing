/// <reference path="../../../../js/_references.ts"/>
/// <reference path="../../../../js/models/models.ts"/>
/// <reference path="../../../services/dataService.ts"/>

module ISPApp.Controllers {
    "use strict";
    import IScope = angular.IScope;
    import IDataService = ISPApp.Services.DataService;
    import ITimeoutService = angular.ITimeoutService;

    export class Task302Controller {
        static $inject = ['$scope', '$timeout', 'DataService'];

        private clickedFlippys = [];
        private word: string;
        private item0;
        private item1;
        private item2;
        private item3;
        private selectedItem: {};
        private activate: boolean;
        private enlargeFlippy: {};
        private showShrink: boolean;

        constructor(private $scope: IScope, private $timeout: ITimeoutService, private dataService: IDataService) {
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

            var images = [1,2,3];
            var randomOne = Math.floor(Math.random() * 3);

            // Randomise the three flip cards
            var firstItemPick = images.splice(randomOne,1);
            var secondItemPick = Math.random() > 0.5 ? images[0] : images[1];
            var thirdItemPick = secondItemPick === images[0] ? images[1] : images[0];

            images = [1,2,3];
            randomOne = Math.floor(Math.random() * 3);

            // Pick two of three from the Day 1 images. The remaining flip card will be assigned a 'distractor' image
            var firstImagePick = images.splice(randomOne,1);
            var secondImagePick = Math.random() > 0.5 ? images[0] : images[1];
            var thirdImagePick = secondImagePick === images[0] ? images[1] : images[0];

            this['item'+firstItemPick] = {
                image: 'content/' + this.word + '/category/day1/' + firstImagePick + '.jpg',
                audio: 'content/' + this.word + '/category/day1/' + firstImagePick + '.mp3',
                flipped: false,
                style: {
                    'width': '0',
                    'height': '0',
                    'top': '380px',
                    'left': '500px'
                }
            };
            this['item'+secondItemPick] = {
                image: 'content/' + this.word + '/category/day1/' + secondImagePick + '.jpg',
                audio: 'content/' + this.word + '/category/day1/' + secondImagePick + '.mp3',
                flipped: false,
                style: {
                    'width': '0',
                    'height': '0',
                    'top': '380px',
                    'left': '500px'
                }
            };

            this['item'+thirdItemPick] = {
                image: 'content/' + this.word + '/category/day1/' + thirdImagePick + '.jpg',
                audio: 'content/' + this.word + '/category/day1/' + thirdImagePick + '.mp3',
                flipped: false,
                style: {
                    'width': '0',
                    'height': '0',
                    'top': '380px',
                    'left': '500px'
                }
            };

            // This should be run at the end of the constructor
            dataService.setupAudioIntroduction('content/common/audio/day3-task1+task3.mp3');
            dataService.playAudioIntroduction(3000);
        }



        clickMainImage() {
            var audio = new Audio('content/' + this.word + '/category/category.mp3');
            audio.play();
        }

        clickDetailImage() {
            new Audio(this.selectedItem['audio']).play();
        }

        clickFlippy(index) {
            this.selectedItem = this['item'+index];
            if (this.clickedFlippys.indexOf(index) === -1) {
                this.clickedFlippys.push(index);
            }

            if(!this.selectedItem['flipped']) {
                this.$timeout(() => {
                    this.selectedItem['flipped'] = true;
                    this.selectedItem['style'] = {
                        'width': '800px',
                        'top': '50px',
                        'left': '0'
                    };
                    this.activate = false;
                    this.showShrink = true;
                    this.$scope['wpC'].setAndShowOnetimeInternalForwardArrowCallback(() => {
                        this.shrinkFlippy();
                    })
                }, 1000);
            } else {
                new Audio(this.selectedItem['audio']).play();
            }
        }

        shrinkFlippy() {
            this.selectedItem['style'] = {
                'width': '0',
                'top': '380px',
                'left': '500px'
            };
            //this.selectedItem['flipped'] = false;
            this.showShrink = false;
            this.$timeout(() => {
                if (this.clickedFlippys.length === 4) {
                    let workPanelController = 'wpC';
                    this.$scope[workPanelController].taskFinished();
                }
                this.activate = true;
            }, 1000);
        }

        getBackgroundImage(index) {
            return {
                'background-image': 'url(\'' + this['item'+index]['image'] + '\')'
            };
        }

    }
}
