/// <reference path="../../_references.ts"/>
/// <reference path="../../models/models.ts"/>
/// <reference path="../../services/dataService.ts"/>

module ISPApp.Controllers {
    import IDataService = ISPApp.Services.IDataService;
    import IScope = angular.IScope;
    import ITimeoutService = angular.ITimeoutService;
    import ILocationService = angular.ILocationService;
    import IonicSlideBoxDelegate = ionic.slideBox.IonicSlideBoxDelegate;

    import IStateParamsService = angular.ui.IStateParamsService;
    "use strict";

    /*
     interface IDraggablesScope extends IScope {
     centerAnchor: boolean;
     draggableObjects: Reward[];
     droppedObjects: Reward[];
     onDropComplete(data, event);
     onDragSuccess(data, event);
     }
     */

    export class RewardPanelController {
        static $inject = ['$location', '$stateParams', '$timeout', '$scope', 'DataService'];

        private showingPanel: string = 'none';
        private achievement: Achievement;
        private newReward: Reward;
        private showStars: boolean;

        private centerAnchor: boolean;
        private draggableObjects: Reward[];
        private droppedObjects: Reward[];

        constructor(private $location: ILocationService, private $stateParams: IStateParamsService,
                    private $timeout: ITimeoutService, private $scope: IScope, private dataService: IDataService )
        {
            $scope.$on('$ionicView.enter', () => {
                this.initialise();
            });
        }

        initialise() {
            this.centerAnchor = true;
            this.draggableObjects = [];
            this.droppedObjects = [];
            this.newReward = null;
            this.achievement = this.dataService.getAchievement();

            // Place previous rewards onto the display
            this.achievement.rewards.forEach((reward) => {
                this.droppedObjects.push(reward);
            });

            // Place the new reward, if not already used
            var week = this.dataService.getWeek();
            var day = this.dataService.getDay();
            if (!this.achievement.hasCollectedReward(week, day)) {
                this.newReward = new Reward(week, day, "gif");
                this.draggableObjects.push(this.newReward);
                this.showingPanel = 'present';
                this.showStars = true;
                this.$timeout(() => {
                    this.showingPanel = 'reward';
                }, 6000)
            } else {
                this.showingPanel = 'reward';
            }
        }

        onDropComplete = function(data: Reward, evt) {
            var xpos = evt.x - data.width;
            var ypos = evt.y - data.height;

           // if(xpos < 100 && ypos < 100) { xpos = 100; ypos = 100; }      // Move away from reward box

            data.xpos = xpos;
            data.ypos = ypos;

            var index = this.droppedObjects.indexOf(data);
            if (index == -1) {
                this.droppedObjects.push(data);
            }
            var index2 = this.draggableObjects.indexOf(data);
            if (index2 > -1) {
                this.showStars = false;
                this.draggableObjects.splice(index2, 1);
            }
        };

        onDragSuccess = function(data: Reward, evt) {
            data.xpos = evt.x - data.width;
            data.ypos = evt.y - data.height;
        };

        getRewardCoordinates(obj: Reward) {
            return { left: obj.xpos + 'px', top: obj.ypos + 'px' };
        }

        completeReward() {
            if (this.newReward !== null && this.newReward.xpos) {
                this.achievement.rewards.push(this.newReward);
            }
            // Write reward to storage and also create a backup
            this.dataService.writeStorage(() => {
                this.showingPanel = 'none';
                if (this.achievement.dayIndex === -1) {
                    this.$location.path("/home/");
                } else {
                    this.$location.path("/home/" + (this.achievement.weekIndex+1));
                }
            }, null, true);

        }

    }
}
