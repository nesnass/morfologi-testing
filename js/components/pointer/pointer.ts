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
    "use strict";

    export interface IISPPulseDirectiveScope extends ng.IScope {
        ispPointerStyle: {};
        ispTimeout: string;
        ispDelay: string;       // in milliseconds
        ispHideAfter: string;
    }

    class PointerController {
        static $inject: string[] = ['$scope', '$timeout'];

        private pulse: boolean = true;
        private hideMe: boolean;

        constructor(private isolatedScope: IISPPulseDirectiveScope, private $timeout: ITimeoutService) {

            this.hideMe = false;
            var timeToHide = (typeof isolatedScope.ispTimeout !== 'undefined') ? parseInt(isolatedScope.ispTimeout) : 6000;
            var delay = (typeof isolatedScope.ispDelay !== 'undefined') ? parseInt(isolatedScope.ispDelay) : 0;

            $timeout( () => {
                isolatedScope.$watch(() => {
                    return this.isolatedScope.ispPointerStyle
                }, () => {
                    this.hideMe = false;
                    this.pulse = true;
                    $timeout(() => {
                        this.pulse = false;
                        if (isolatedScope.ispHideAfter === 'true') {
                            this.hideMe = true;
                        }
                    }, timeToHide);
                })
            }, delay)
        };
    }

    //directive declaration
    export function ispPointer(): ng.IDirective {
        return {
            restrict: 'A',
            controller: PointerController,
            controllerAs: 'pC',
            replace: true,
            templateUrl: 'js/components/pointer/pointer.html',
            scope: {
                ispPointerStyle: '=',
                ispTimeout: '@',
                ispDelay: '@',
                ispHideAfter: '@'
            }
        };
    }
}
