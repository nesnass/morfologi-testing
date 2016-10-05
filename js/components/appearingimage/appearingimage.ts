/**
 * Created by richardnesnass on 24/06/16.
 */

/// <reference path="../../_references.ts"/>
/// <reference path="../../services/dataservice.ts"/>

/**
 * On click, shows an image. Optional timer to hide the image.
 *
 * Use this directive in the form:
 * <div isp-appearingimage isp-image-path="xC.book" isp-hide-after-timeout="x seconds"></div>
 */
module ISPApp.Directives {
    import ITimeoutService = angular.ITimeoutService;
    import IDataService = ISPApp.Services.IDataService;
    "use strict";

    //isolated scope interface
    export interface IISPAppearingImageDirectiveScope extends ng.IScope {
        ispData: Overlay;
        ispBouncePointer: string;
        ispDelayStart: string;
        ispImageUrl: string;
        ispOnCompleted(): void;
    }

    class AppearingImageController {
        static $inject: string[] = ['$scope', '$timeout', 'DataService'];

        private overlayData: Overlay;
        private imageUrl = "";
        private showImage = false;
        private opacity = 1;
        private bounce = false;
        private showBounce = false;
        private styleSet = {};
        private overlayActive = false;

        constructor(private isolatedScope: IISPAppearingImageDirectiveScope, private $timeout: ITimeoutService,
        private dataService: IDataService) {
            this.imageUrl = '';
            this.overlayData = isolatedScope.ispData;
            this.opacity = this.overlayData.opacity;
            this.resetStyles();
            var delay = parseInt(isolatedScope.ispDelayStart) * 1000;
            this.$timeout(() => {
                this.setup();
            }, delay)

        };

        setup() {

            // Trigger the bouncing arrow when this image is activated (used during a sequence)
            this.isolatedScope.$watch(() => { return this.overlayData.active }, (newValue, oldValue) => {
                if (newValue === true && oldValue === false) {
                    if (this.isolatedScope.ispBouncePointer === 'true') {
                        this.bounce = true;
                    }
                    this.showBounce = true;
                    this.$timeout(() => {
                        this.bounce = false;
                        if (!this.overlayData.pointer.retain) {
                            this.showBounce = false;
                        }
                    }, 5000)
                }
            });

            // Click the image automatically, if requested, after a specified delay
            if(this.overlayData.auto_start) {
                this.$timeout(() => {
                    this.clickImage();
                }, this.overlayData.delay * 1000)
            }

            // If not part of a sequence, or first in a sequence, begin bouncing the arrow
            if (this.overlayData.sequence < 1 && this.overlayData.active) {
                if (this.isolatedScope.ispBouncePointer === 'true') {
                    this.bounce = true;
                }
                this.showBounce = true;
                this.$timeout(() => {
                    this.bounce = false;
                    if (!this.overlayData.pointer.retain) {
                        this.showBounce = false;
                    }
                }, 5000)
            }
            this.overlayActive = true;
        }

        resetStyles() {
            this.styleSet = {
                width: this.overlayData.start.w+'px',
                height: this.overlayData.start.h+'px',
                top: this.overlayData.start.y+'px',
                left: this.overlayData.start.x+'px',
            }
        }

        clickImage() {
            if (!this.overlayActive) {
                return;
            }
            if (this.showImage && !this.overlayData.allow_return) {
                return;
            }
            if (this.overlayData.active || this.overlayData.sequence === -1) {
                this.bounce = false;
                this.showBounce = false;
                this.imageUrl = this.isolatedScope.ispImageUrl + '?' + Math.random();
                this.showImage = !this.showImage;
                if (this.showImage && this.overlayData.timeout > 0) {
                    this.$timeout(() => {
                        this.showImage = false;
                        this.isolatedScope.ispOnCompleted();
                    }, this.overlayData.timeout * 1000);
                } else {
                    this.isolatedScope.ispOnCompleted();
                }
            }
        }
    }

    //directive declaration
    export function ispAppearingimage(): ng.IDirective {
        return {
            restrict: 'A',
            controller: AppearingImageController,
            controllerAs: 'aiC',
            replace: true,
            templateUrl: 'js/components/appearingimage/appearingimage.html',
            scope: {
                ispData: '=',
                ispBouncePointer: '@',
                ispOnCompleted: '&',
                ispDelayStart: '@',
                ispImageUrl: '@'
            }
        };
    }
}
