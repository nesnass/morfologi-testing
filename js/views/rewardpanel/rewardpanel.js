/// <reference path="../../_references.ts"/>
/// <reference path="../../models/models.ts"/>
/// <reference path="../../services/dataService.ts"/>
var ISPApp;
(function (ISPApp) {
    var Controllers;
    (function (Controllers) {
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
        var RewardPanelController = (function () {
            function RewardPanelController($location, $stateParams, $timeout, $scope, dataService) {
                var _this = this;
                this.$location = $location;
                this.$stateParams = $stateParams;
                this.$timeout = $timeout;
                this.$scope = $scope;
                this.dataService = dataService;
                this.showingPanel = 'none';
                this.onDropComplete = function (data, evt) {
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
                this.onDragSuccess = function (data, evt) {
                    data.xpos = evt.x - data.width;
                    data.ypos = evt.y - data.height;
                };
                $scope.$on('$ionicView.enter', function () {
                    _this.initialise();
                });
            }
            RewardPanelController.prototype.initialise = function () {
                var _this = this;
                this.centerAnchor = true;
                this.draggableObjects = [];
                this.droppedObjects = [];
                this.newReward = null;
                this.achievement = this.dataService.getAchievement();
                // Place previous rewards onto the display
                this.achievement.rewards.forEach(function (reward) {
                    _this.droppedObjects.push(reward);
                });
                // Place the new reward, if not already used
                var week = this.dataService.getWeek();
                var day = this.dataService.getDay();
                if (!this.achievement.hasCollectedReward(week, day)) {
                    this.newReward = new ISPApp.Reward(week, day, "gif");
                    this.draggableObjects.push(this.newReward);
                    this.showingPanel = 'present';
                    this.showStars = true;
                    this.$timeout(function () {
                        _this.showingPanel = 'reward';
                    }, 6000);
                }
                else {
                    this.showingPanel = 'reward';
                }
            };
            RewardPanelController.prototype.getRewardCoordinates = function (obj) {
                return { left: obj.xpos + 'px', top: obj.ypos + 'px' };
            };
            RewardPanelController.prototype.completeReward = function () {
                var _this = this;
                if (this.newReward !== null && this.newReward.xpos) {
                    this.achievement.rewards.push(this.newReward);
                }
                // Write reward to storage and also create a backup
                this.dataService.writeStorage(function () {
                    _this.showingPanel = 'none';
                    if (_this.achievement.dayIndex === -1) {
                        _this.$location.path("/home/");
                    }
                    else {
                        _this.$location.path("/home/" + (_this.achievement.weekIndex + 1));
                    }
                }, null, true);
            };
            RewardPanelController.$inject = ['$location', '$stateParams', '$timeout', '$scope', 'DataService'];
            return RewardPanelController;
        }());
        Controllers.RewardPanelController = RewardPanelController;
    })(Controllers = ISPApp.Controllers || (ISPApp.Controllers = {}));
})(ISPApp || (ISPApp = {}));
//# sourceMappingURL=rewardpanel.js.map