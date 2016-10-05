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
var ISPApp;
(function (ISPApp) {
    var Directives;
    (function (Directives) {
        "use strict";
        var ZoomableImageController = (function () {
            function ZoomableImageController(isolatedScope, $timeout) {
                var _this = this;
                this.isolatedScope = isolatedScope;
                this.$timeout = $timeout;
                this.imageUrl = "";
                this.zoomedUp = false;
                this.showImage = false;
                this.bounce = false;
                this.showBounce = false;
                this.styleSet = {};
                this.opacity = 1;
                this.finishedZooming = true;
                this.overlayActive = false;
                this.overlayData = this.isolatedScope.ispData;
                this.imageUrl = this.isolatedScope.ispImageUrl;
                this.showImage = this.overlayData.visible_before;
                this.opacity = this.overlayData.opacity;
                this.resetStyles();
                var delay = parseInt(isolatedScope.ispDelayStart) * 1000;
                this.$timeout(function () {
                    _this.setup();
                }, delay);
            }
            ;
            ZoomableImageController.prototype.setup = function () {
                var _this = this;
                this.isolatedScope.$watch(function () { return _this.overlayData.active; }, function (newValue) {
                    if (newValue === true) {
                        if (_this.isolatedScope.ispBouncePointer === 'true') {
                            _this.bounce = true;
                        }
                        _this.showBounce = true;
                        _this.$timeout(function () {
                            _this.bounce = false;
                        }, 5000);
                    }
                });
                if (this.overlayData.auto_start) {
                    this.showBounce = false;
                    this.$timeout(function () {
                        _this.clickImage();
                    }, 1000);
                }
                // If not part of a sequence, begin bouncing the arrow
                if (this.overlayData.sequence === -1 && this.overlayData.active) {
                    if (this.isolatedScope.ispBouncePointer === 'true') {
                        this.bounce = true;
                    }
                    this.showBounce = true;
                    this.$timeout(function () {
                        _this.bounce = false;
                        if (!_this.overlayData.pointer.retain) {
                            _this.showBounce = false;
                        }
                    }, 5000);
                }
                this.overlayActive = true;
            };
            ZoomableImageController.prototype.resetStyles = function () {
                this.styleSet = {
                    width: this.overlayData.start.w + 'px',
                    height: this.overlayData.start.h + 'px',
                    top: this.overlayData.start.y + 'px',
                    left: this.overlayData.start.x + 'px',
                };
            };
            ZoomableImageController.prototype.clickImage = function () {
                var _this = this;
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
                        this.$timeout(function () {
                            _this.finishedZooming = true;
                            _this.showImage = _this.overlayData.visible_after;
                            _this.overlayData.completed = true;
                            _this.isolatedScope.ispOnCompleted();
                        }, duration);
                    }
                    else {
                        this.finishedZooming = false;
                        this.isolatedScope.zoomUp();
                        this.showImage = true;
                        this.$timeout(function () {
                            _this.finishedZooming = true;
                            if (!_this.overlayData.allow_return) {
                                _this.isolatedScope.ispOnCompleted();
                            }
                            if (_this.overlayData.auto_return) {
                                _this.clickImage();
                            }
                        }, duration);
                    }
                }
            };
            ZoomableImageController.$inject = ['$scope', '$timeout', 'DataService'];
            return ZoomableImageController;
        }());
        function linker(isolatedScope, element) {
            var dataKey = 'ispData', transitionKey = 'transition';
            var xKey = 'x', yKey = 'y', scaleKey = 'scale', durationKey = 'duration';
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
            isolatedScope.zoomUp = function () {
                element.css({
                    '-webkit-transform': 'scale(' + scale + ',' + scale + ') translate(' + end_x + 'px,' + end_y + 'px)',
                    'transform': 'scale(' + scale + ',' + scale + ') translate(' + end_x + 'px,' + end_y + 'px)' // Standard syntax
                });
            };
            isolatedScope.zoomDown = function () {
                element.css({
                    '-webkit-transform': 'scale(1,1) translate(0px,0px)',
                    'transform': 'scale(1,1) translate(0px,0px)'
                });
            };
        }
        //directive declaration
        function ispZoomableimage() {
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
        Directives.ispZoomableimage = ispZoomableimage;
    })(Directives = ISPApp.Directives || (ISPApp.Directives = {}));
})(ISPApp || (ISPApp = {}));
//# sourceMappingURL=zoomableoverlay.js.map