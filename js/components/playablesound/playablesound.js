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
var ISPApp;
(function (ISPApp) {
    var Directives;
    (function (Directives) {
        "use strict";
        var PlayableSoundController = (function () {
            function PlayableSoundController(isolatedScope, $timeout) {
                var _this = this;
                this.isolatedScope = isolatedScope;
                this.$timeout = $timeout;
                this.audioUrl = "";
                this.bounce = false;
                this.styleSet = {};
                this.showBounce = false;
                this.overlayActive = false;
                this.audioUrl = isolatedScope.ispPlayablesoundUrl;
                this.overlayData = this.isolatedScope.ispPlayablesoundOverlayData;
                this.resetStyles();
                var delay = parseInt(isolatedScope.ispDelayStart) * 1000;
                if (this.overlayData.hasOwnProperty('delay') && this.overlayData['delay'] > 0) {
                    delay += this.overlayData['delay'] * 1000;
                }
                this.$timeout(function () {
                    _this.setup();
                }, delay);
            }
            ;
            PlayableSoundController.prototype.setup = function () {
                var _this = this;
                this.audio = new Audio(this.audioUrl);
                this.audio.load();
                this.audio.addEventListener('ended', function () {
                    _this.isolatedScope.ispPlayablesoundOnCompleted();
                });
                // Trigger the bouncing arrow when this image is activated (used during a sequence)
                this.isolatedScope.$watch(function () { return _this.overlayData.active; }, function (newValue) {
                    if (newValue === true) {
                        if (_this.isolatedScope.ispBouncePointer === 'true') {
                            _this.bounce = true;
                        }
                        var delay = 0;
                        if (_this.overlayData.pointer.hasOwnProperty('delay') && _this.overlayData.pointer['delay'] > 0) {
                            delay = _this.overlayData.pointer['delay'] * 1000;
                        }
                        _this.$timeout(function () {
                            _this.showBounce = true;
                            _this.$timeout(function () {
                                _this.bounce = false;
                                if (!_this.overlayData.pointer.retain) {
                                    _this.showBounce = false;
                                }
                            }, 3000);
                        }, delay);
                    }
                });
                // PLay the sound automatically, if requested, after a specified delay
                if (this.overlayData.auto_start) {
                    this.$timeout(function () {
                        _this.clickAudio();
                    }, this.overlayData.delay * 1000);
                }
                // If not part of a sequence, begin bouncing the arrow
                if (this.overlayData.sequence === -1 && this.overlayData.active) {
                    this.showBounce = true;
                    if (this.isolatedScope.ispBouncePointer === 'true') {
                        this.bounce = true;
                    }
                    this.$timeout(function () {
                        _this.bounce = false;
                        if (!_this.overlayData.pointer.retain) {
                            _this.showBounce = false;
                        }
                    }, 5000);
                }
                this.overlayActive = true;
            };
            PlayableSoundController.prototype.resetStyles = function () {
                this.styleSet = {
                    width: this.overlayData.start.w + 'px',
                    height: this.overlayData.start.h + 'px',
                    top: this.overlayData.start.y + 'px',
                    left: this.overlayData.start.x + 'px',
                };
            };
            PlayableSoundController.prototype.clickAudio = function () {
                var _this = this;
                if (!this.overlayActive) {
                    return;
                }
                if (this.overlayData.active || this.overlayData.sequence === -1) {
                    this.bounce = false;
                    this.audio.play();
                    this.$timeout(function () {
                        _this.showBounce = false;
                    }, 0);
                }
            };
            PlayableSoundController.$inject = ['$scope', '$timeout', 'DataService'];
            return PlayableSoundController;
        }());
        //directive declaration
        function ispPlayablesound() {
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
        Directives.ispPlayablesound = ispPlayablesound;
    })(Directives = ISPApp.Directives || (ISPApp.Directives = {}));
})(ISPApp || (ISPApp = {}));
//# sourceMappingURL=playablesound.js.map