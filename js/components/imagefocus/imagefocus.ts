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
    "use strict";

    //isolated scope interface
    export interface IISPImageFocusDirectiveScope extends ng.IScope {
        ispData: {};
        ispImageUrl: string;
        ispBouncePointer: string;
        ispDelayStart: string;
        ispOnCompleted(): void;
        startFocus(): void
        drawCircle(): void;
    }

    class ImageFocusController {
        static $inject: string[] = ['$scope', '$timeout'];

        private imageUrl = "";
        private focusStyle = {};
        private highlightStyle = {};
        private mapStyle = null;
        private bounce: boolean = false;
        private showBounce: boolean = false;

        constructor(private isolatedScope: IISPImageFocusDirectiveScope, private $timeout: ITimeoutService) {
            this.imageUrl = this.isolatedScope.ispImageUrl;
            var delay = parseInt(isolatedScope.ispDelayStart) * 1000;
            this.$timeout(() => {
                this.setup();
            }, delay)
        };

        setup() {
            // Provided with Overlay data -> this is for a Picturebook
            if (typeof this.isolatedScope.ispData['id'] !== 'undefined') {
                this.mapStyle = {
                    position: 'absolute',
                    top: this.isolatedScope.ispData['map']['y'] + 'px',
                    left: this.isolatedScope.ispData['map']['x'] + 'px',
                    width: this.isolatedScope.ispData['map']['w'] + 'px',
                    height: this.isolatedScope.ispData['map']['y'] + 'px'
                };
                this.showBounce = true;
                if (this.isolatedScope.ispBouncePointer === 'true') {
                    this.bounce = true;
                }
                this.$timeout(() => {
                    this.bounce = false;
                    if (this.isolatedScope.ispData['pointer']['retain'] === 'false') {
                        this.showBounce = false;
                    }
                }, 5000);

                // Provided with regular data -> this is for a Task
            } else {
                if (this.isolatedScope.ispData['auto_start']) {
                    this.$timeout(() => {
                        this.isolatedScope.startFocus();
                        if (this.isolatedScope.ispData['show_highlight']) {
                            this.$timeout(() => {
                                this.isolatedScope.drawCircle();
                            }, 2000)
                        }
                    }, 2000);
                }
            }
            this.resetStyles();
        }

        startFocus() {
            this.showBounce = false;
            this.isolatedScope.startFocus();
            if(typeof this.isolatedScope.ispOnCompleted !== 'undefined' && this.isolatedScope.ispOnCompleted !== null) {
                this.$timeout(() => {
                    this.isolatedScope.ispOnCompleted();
                }, 2000);
            }
        }

        resetStyles() {
            this.focusStyle = {
                //width: '100%',
                //height: '100%',
                top: '0',
                left: '0',
            };
            if (this.isolatedScope.ispData['show_highlight']) {
                this.highlightStyle = {
                    display: 'none',
                    top: this.isolatedScope.ispData['highlight_location']['y'] + 'px',
                    left: this.isolatedScope.ispData['highlight_location']['x'] + 'px',
                    width: this.isolatedScope.ispData['highlight_size']['width'] + 'px',
                    height: this.isolatedScope.ispData['highlight_size']['height'] + 'px',
                }
            }
        }

    }

    function linker(isolatedScope: IISPImageFocusDirectiveScope , element: ng.IAugmentedJQuery) {

        let dataKey = 'ispData', transitionKey = 'transition';
        let xKey = 'x', yKey = 'y', scaleKey = 'scale', durationKey = 'duration';

        var end_x = isolatedScope[dataKey][transitionKey][xKey];
        var end_y = isolatedScope[dataKey][transitionKey][yKey];
        var scale = isolatedScope[dataKey][transitionKey][scaleKey];
        var duration = isolatedScope[dataKey][transitionKey][durationKey];

        var image = angular.element(element.children()[0]);
        image.css({
            '-webkit-transition': duration + 's linear',
            '-moz-transition': duration + 's linear',
            '-o-transition': duration + 's linear',
            'transition': duration + 's linear',
        });

        isolatedScope.startFocus = () => {
            image.css({
                '-webkit-transform': 'scale(' + scale + ',' + scale + ') translate(' + end_x + 'px,' + end_y + 'px)', /* Safari */
                'transform': 'scale(' + scale + ',' + scale + ') translate(' + end_x + 'px,' + end_y + 'px)' /* Standard syntax */
            });
        };

        isolatedScope.drawCircle = () => {
            var circle = angular.element(element.children()[1]);
            circle.css({
                'display': 'block'
            });
            circle.addClass("animate");
        };

    }

    //directive declaration
    export function ispImagefocus(): ng.IDirective {

        return {
            restrict: 'A',
            controller: ImageFocusController,
            controllerAs: 'ifC',
            replace: true,
            templateUrl: 'js/components/imagefocus/imagefocus.html',
            scope: {
                ispImageUrl: '@',
                ispData: '=',
                ispBouncePointer: '@',
                ispOnCompleted: '&',
                ispDelayStart: '@'
            },
            link: linker
        };
    }
}
