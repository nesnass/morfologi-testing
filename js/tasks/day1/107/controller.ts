/// <reference path="../../../../js/_references.ts"/>
/// <reference path="../../../../js/models/models.ts"/>
/// <reference path="../../../services/dataService.ts"/>

module ISPApp.Controllers {
    import IDataService = ISPApp.Services.IDataService;
    import IScope = angular.IScope;
    import ITimeoutService = angular.ITimeoutService;
    "use strict";

    export class Task107Controller {
        static $inject = ['$scope', '$timeout', 'DataService'];

        private word: string;
        private path: string;
        private task: Task;

        public showingPanel: string;
        private stage: number;
        private activated: boolean;

        private image1_p1: string;
        private image2_p1: string;
        private image1_p2: string;
        private image2_p2: string;

        private image1_p1_mode: string;
        private image2_p1_mode: string;
        private image1_p2_mode: string;
        private image2_p2_mode: string;

        private image1_p1_data: {};
        private image2_p1_data: {};
        private image1_p2_data: {};
        private image2_p2_data: {};

        constructor(private $scope: IScope, private $timeout: ITimeoutService, private dataService: IDataService) {
            this.showingPanel = 'choice';
            this.word = this.$scope['wpC'].word;
            this.task = dataService.getTask();
            this.path = 'content/' + this.word + '/present-past/day1/';
            this.stage = 1;
            this.activated = false;

            var audioUrl = 'content/common/audio/day1-task8.mp3';
            var handle = this;
            dataService.setInteractionEndActivateTaskCallback(() => {
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

        clickPresentImage() {
            if (this.stage === 1) {
                this.showingPanel = 'one';
                this.$timeout(() => {
                    new Audio('content/' + this.word + '/present-past/day1/1.mp3').play();
                }, 1500);
                this.$timeout(() => {
                    this.$scope['wpC'].setAndShowOnetimeInternalForwardArrowCallback( () => {
                        this.clickReturn();
                    })
                }, 3000)
            }
        }

        clickPastImage() {
            if (this.stage === 2) {
                this.showingPanel = 'two';
                this.$timeout(() => {
                    new Audio('content/' + this.word + '/present-past/day1/2.mp3').play();
                }, 1500);
                this.$timeout(() => {
                    this.$scope['wpC'].taskFinished();
                }, 3000)
            }
        }

        clickReturn() {
            this.showingPanel = 'choice';
            this.stage = 2;
        }

    }
}
