/**
 * Created by richardnesnass on 24/06/16.
 */

/// <reference path="../../_references.ts"/>
/// <reference path="../../services/dataservice.ts"/>

/**
 * On click, shows a semi-transparent image that zooms to the centre of screen, then zooms back again to disappear
 *
 * Use this directive in the form:
 * <div isp-zoomableimage isp-zoomableimage-image-url="xC.book" isp-zoomableimage-visible-before="false"
 * isp-zoomableimage-visible-after="true" isp-zoomableimage-auto-return="true" isp-zoomableimage-opacity="0.5"
 * isp-zoomableimage-overlay-data="Overlay" isp-zoomableimage-on-completed="parent callback fn"></div>
 */
module ISPApp.Directives {
    import ITimeoutService = angular.ITimeoutService;
    import IDataService = ISPApp.Services.IDataService;
    "use strict";

    //isolated scope interface
    export interface IISPZoomableImageDirectiveScope extends ng.IScope {
        ispData: Overlay;
        ispImageUrl: string;
        ispBouncePointer: string;
        ispDelayStart: string;
        ispOnCompleted(): void;
        zoomUp(): void;
        zoomDown(): void;
    }

    class ZoomableImageController {
        static $inject: string[] = ['$scope', '$timeout', 'DataService'];

        private overlayData: Overlay;
        private imageUrl = "";
        private zoomedUp = false;
        private showImage = false;
        private bounce = false;
        private showBounce = false;
        private styleSet = {};
        private opacity = 1;
        private finishedZooming = true;
        private overlayActive = false;

        constructor(private isolatedScope: IISPZoomableImageDirectiveScope, private $timeout: ITimeoutService) {

            this.overlayData = this.isolatedScope.ispData;
            this.imageUrl = this.isolatedScope.ispImageUrl;
            this.showImage = this.overlayData.visible_before;
            this.opacity = this.overlayData.opacity;
            this.resetStyles();
            var delay = parseInt(isolatedScope.ispDelayStart) * 1000;
            this.$timeout(() => {
                this.setup();
            }, delay)
        };

        setup() {
            this.isolatedScope.$watch(() => { return this.overlayData.active }, (newValue) => {
                if (newValue === true) {
                    if (this.isolatedScope.ispBouncePointer === 'true') {
                        this.bounce = true;
                    }
                    this.showBounce = true;
                    this.$timeout(() => {
                        this.bounce = false;
                    }, 5000)
                }
            });

            if (this.overlayData.auto_start) {
                this.showBounce = false;
                this.$timeout(() => {
                    this.clickImage();
                }, 1000);
            }

            // If not part of a sequence, begin bouncing the arrow
            if (this.overlayData.sequence === -1 && this.overlayData.active) {
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
            if (this.finishedZooming && this.overlayData.active || this.overlayData.sequence === -1) {
                this.bounce = false;
                this.showBounce = false;
                this.zoomedUp = !this.zoomedUp;
                var duration = this.isolatedScope['ispData']['transition']['duration'] * 1000;

                // Zooming down after showing image
                if (!this.zoomedUp && this.showImage && this.overlayData.allow_return) {
                    this.finishedZooming = false;
                    this.isolatedScope.zoomDown();
                    this.$timeout(() => {
                        this.finishedZooming = true;
                        this.showImage = this.overlayData.visible_after;
                        this.overlayData.completed = true;
                        this.isolatedScope.ispOnCompleted();
                    }, duration);

                // Zooming up
                } else {
                    this.finishedZooming = false;
                    this.isolatedScope.zoomUp();
                    this.showImage = true;
                    this.$timeout(() => {
                        this.finishedZooming = true;
                        if (!this.overlayData.allow_return) {
                            this.isolatedScope.ispOnCompleted();
                        }
                        if (this.overlayData.auto_return) {
                            this.clickImage();
                        }
                    }, duration)
                }
            }
        }
    }

    function linker(isolatedScope: IISPZoomableImageDirectiveScope , element: ng.IAugmentedJQuery) {

        let dataKey = 'ispData', transitionKey = 'transition';
        let xKey = 'x', yKey = 'y', scaleKey = 'scale', durationKey = 'duration';

        var end_x = isolatedScope[dataKey][transitionKey][xKey];
        var end_y = isolatedScope[dataKey][transitionKey][yKey];
        var scale = isolatedScope[dataKey][transitionKey][scaleKey];
        var duration = isolatedScope[dataKey][transitionKey][durationKey];

        element.css({
            '-webkit-transition': duration + 's linear',
            '-moz-transition': duration + 's linear',
            '-o-transition': duration + 's linear',
            'transition': duration + 's linear'
        });

        isolatedScope.zoomUp = function() {
            element.css({
                '-webkit-transform': 'scale(' + scale + ',' + scale + ') translate(' + end_x + 'px,' + end_y + 'px)', // Safari
                'transform': 'scale(' + scale + ',' + scale + ') translate(' + end_x + 'px,' + end_y + 'px)' // Standard syntax
            });
        };

        isolatedScope.zoomDown = function() {
            element.css({
                '-webkit-transform': 'scale(1,1) translate(0px,0px)',
                'transform': 'scale(1,1) translate(0px,0px)'
            });
        };

    }

    //directive declaration
    export function ispZoomableimage(): ng.IDirective {
        return {
            restrict: 'A',
            controller: ZoomableImageController,
            controllerAs: 'ziC',
            replace: true,
            templateUrl: 'js/components/zoomableoverlay/zoomableoverlay.html',
            scope: {
                ispImageUrl: '@',
                ispBouncePointer: '@',
                ispData: '=',
                ispOnCompleted: '&',
                ispDelayStart: '@'
            },
            link: linker
        };
    }
}
