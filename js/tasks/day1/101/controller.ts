/// <reference path="../../../../js/_references.ts"/>
/// <reference path="../../../../js/models/models.ts"/>
/// <reference path="../../../services/dataService.ts"/>

module ISPApp.Controllers {
    "use strict";
    import IScope = angular.IScope;
    import IDataService = ISPApp.Services.IDataService;
    import ITimeoutService = angular.ITimeoutService;

    export class Task101Controller {
        static $inject = ['$scope', '$timeout', 'DataService'];

        private currentIndex: number;
        private showDetail: boolean;
        private showPointer: boolean;
        private task: Task;
        private word: string;
        private focusData: {};
        private page2imageUrl: string;
        private page2_mode: string;
        private customOverlay: {};
        private forceNewURI: number;

        constructor(private $scope: IScope, private $timeout: ITimeoutService, private dataService: IDataService) {
            this.currentIndex = 0;
            this.showDetail = false;
            this.task = dataService.getTask();
            this.word = $scope['wpC'].word;
            this.showPointer = false;
            this.forceNewURI = Date.now();

            var handle = this;
            dataService.setInteractionEndActivateTaskCallback(() => {
                handle.showPointer = true;
            });
            dataService.setupAudioIntroduction('content/' + this.word + '/related/day1/page1/1.mp3');
            dataService.playAudioIntroduction(3000);
        }

        clickMainImage() {
            var audio = new Audio('content/' + this.word + '/main.mp3');
            audio.play();
        }

        clickRelatedImage() {
            if (this.currentIndex === this.task.structure['page2'].length) {
                return;
            }
            this.showPointer = false;
            this.page2_mode = this.task.structure['page2'][this.currentIndex]['mode'];
            this.page2imageUrl = 'content/' + this.word + '/related/day1/page2/' + this.task.structure['page2'][this.currentIndex]['file']  + '?rand=' + this.forceNewURI;
            var audioUrl = 'content/' + this.word + '/related/day1/page2/' + (this.currentIndex + 1) + '.mp3';
            this.$timeout(() => {
                new Audio(audioUrl).play();
            }, 2000);

            if (this.page2_mode === 'focus') {
                this.focusData = this.task.structure['focus'][this.currentIndex.toString()];
            } else if (this.page2_mode === 'overlay') {
                this.customOverlay =  this.task.structure['overlay'][this.currentIndex.toString()];
            }
            this.$timeout(() => {
                this.$scope['wpC'].setAndShowOnetimeInternalForwardArrowCallback( () => {
                    this.clickBackToImages();
                })
            }, 4000);
            this.showDetail = true;
        }

        clickBackToImages() {
            this.currentIndex++;
            if (this.currentIndex < this.task.structure['page2'].length) {
                var handle = this;
                this.dataService.setInteractionEndActivateTaskCallback(() => {
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
        }

        clickDetailImage() {
            var audioUrl = 'content/' + this.word + '/related/day1/page2/' + (this.currentIndex + 1) + '.mp3';
            var audio = new Audio(audioUrl);
            audio.play();
        }

        getBackgroundImage() {
            var index = this.currentIndex === this.task.structure['page2'].length ? this.currentIndex -1 : this.currentIndex;
            return {
                'background-image': 'url(\'content/' + this.word + '/related/day1/page1/' + this.task.structure['page1'][index]['file'] + '?rand=' + this.forceNewURI + '\')',
                'border': 'solid ' + this.$scope['wpC'].taskColour,
                'background-size': 'cover'
            };
        }


    }
}
