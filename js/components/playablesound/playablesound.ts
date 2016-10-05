/**
 * Created by richardnesnass on 24/06/16.
 */

/// <reference path="../../_references.ts"/>
/// <reference path="../../services/dataservice.ts"/>

/**
 * On click, plays a sound.
 *
 * Use this directive in the form:
 * <div isp-playablesound isp-playablesound-overlay-data="overlay" isp-playablesound-url="url"
 * isp-playablesound-on-completed="parent callback fn"></div>
 */
module ISPApp.Directives {
    import IDataService = ISPApp.Services.IDataService;
    import ITimeoutService = angular.ITimeoutService;
    "use strict";

    //isolated scope interface
    export interface IISPPlayableSoundDirectiveScope extends ng.IScope {
        ispPlayablesoundUrl: string;
        ispBouncePointer: string;
        ispDelayStart: string;
        ispPlayablesoundOverlayData: Overlay;
        ispPlayablesoundOnCompleted(): void;
    }

    class PlayableSoundController {
        static $inject: string[] = ['$scope', '$timeout', 'DataService'];

        private overlayData;
        private audioUrl = "";
        private bounce = false;
        private styleSet = {};
        private audio: HTMLAudioElement;
        private showBounce: boolean = false;
        private overlayActive = false;

        constructor(private isolatedScope: IISPPlayableSoundDirectiveScope, private $timeout: ITimeoutService) {

            this.audioUrl = isolatedScope.ispPlayablesoundUrl;
            this.overlayData = this.isolatedScope.ispPlayablesoundOverlayData;
            this.resetStyles();
            var delay = parseInt(isolatedScope.ispDelayStart) * 1000;
            if (this.overlayData.hasOwnProperty('delay') && this.overlayData['delay'] > 0) {
                delay += this.overlayData['delay'] * 1000;
            }
            this.$timeout(() => {
                this.setup();
            }, delay)
        };

        setup() {
            this.audio = new Audio(this.audioUrl);
            this.audio.load();
            this.audio.addEventListener('ended', () => {
                this.isolatedScope.ispPlayablesoundOnCompleted();
            });

            // Trigger the bouncing arrow when this image is activated (used during a sequence)
            this.isolatedScope.$watch(() => { return this.overlayData.active }, (newValue) => {
                if (newValue === true) {
                    if (this.isolatedScope.ispBouncePointer === 'true') {
                        this.bounce = true;
                    }
                    var delay = 0;
                    if (this.overlayData.pointer.hasOwnProperty('delay') && this.overlayData.pointer['delay'] > 0) {
                        delay = this.overlayData.pointer['delay'] * 1000;
                    }
                    this.$timeout(() => {
                        this.showBounce = true;
                        this.$timeout(() => {
                            this.bounce = false;
                            if (!this.overlayData.pointer.retain) {
                                this.showBounce = false;
                            }
                        }, 3000)
                    }, delay);
                }
            });

            // PLay the sound automatically, if requested, after a specified delay
            if(this.overlayData.auto_start) {
                this.$timeout(() => {
                    this.clickAudio();
                }, this.overlayData.delay * 1000)
            }

            // If not part of a sequence, begin bouncing the arrow
            if (this.overlayData.sequence === -1 && this.overlayData.active) {
                this.showBounce = true;
                if (this.isolatedScope.ispBouncePointer === 'true') {
                    this.bounce = true;
                }
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

        clickAudio() {
            if (!this.overlayActive) {
                return;
            }
            if (this.overlayData.active || this.overlayData.sequence === -1) {
                this.bounce = false;
                this.audio.play();
                this.$timeout(() => {
                    this.showBounce = false;
                }, 0);
            }
        }
    }

    //directive declaration
    export function ispPlayablesound(): ng.IDirective {
        return {
            restrict: 'A',
            controller: PlayableSoundController,
            controllerAs: 'psC',
            replace: true,
            templateUrl: 'js/components/playablesound/playablesound.html',
            scope: {
                ispPlayablesoundUrl: '@',
                ispBouncePointer: '@',
                ispPlayablesoundOverlayData: '=',
                ispPlayablesoundOnCompleted: '&',
                ispDelayStart: '@'
            }
        };
    }
}
