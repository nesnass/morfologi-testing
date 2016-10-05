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
var ISPApp;
(function (ISPApp) {
    var Directives;
    (function (Directives) {
        "use strict";
        var AppearingImageController = (function () {
            function AppearingImageController(isolatedScope, $timeout, dataService) {
                var _this = this;
                this.isolatedScope = isolatedScope;
                this.$timeout = $timeout;
                this.dataService = dataService;
                this.imageUrl = "";
                this.showImage = false;
                this.opacity = 1;
                this.bounce = false;
                this.showBounce = false;
                this.styleSet = {};
                this.overlayActive = false;
                this.imageUrl = '';
                this.overlayData = isolatedScope.ispData;
                this.opacity = this.overlayData.opacity;
                this.resetStyles();
                var delay = parseInt(isolatedScope.ispDelayStart) * 1000;
                this.$timeout(function () {
                    _this.setup();
                }, delay);
            }
            ;
            AppearingImageController.prototype.setup = function () {
                var _this = this;
                // Trigger the bouncing arrow when this image is activated (used during a sequence)
                this.isolatedScope.$watch(function () { return _this.overlayData.active; }, function (newValue, oldValue) {
                    if (newValue === true && oldValue === false) {
                        if (_this.isolatedScope.ispBouncePointer === 'true') {
                            _this.bounce = true;
                        }
                        _this.showBounce = true;
                        _this.$timeout(function () {
                            _this.bounce = false;
                            if (!_this.overlayData.pointer.retain) {
                                _this.showBounce = false;
                            }
                        }, 5000);
                    }
                });
                // Click the image automatically, if requested, after a specified delay
                if (this.overlayData.auto_start) {
                    this.$timeout(function () {
                        _this.clickImage();
                    }, this.overlayData.delay * 1000);
                }
                // If not part of a sequence, or first in a sequence, begin bouncing the arrow
                if (this.overlayData.sequence < 1 && this.overlayData.active) {
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
            AppearingImageController.prototype.resetStyles = function () {
                this.styleSet = {
                    width: this.overlayData.start.w + 'px',
                    height: this.overlayData.start.h + 'px',
                    top: this.overlayData.start.y + 'px',
                    left: this.overlayData.start.x + 'px',
                };
            };
            AppearingImageController.prototype.clickImage = function () {
                var _this = this;
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
                        this.$timeout(function () {
                            _this.showImage = false;
                            _this.isolatedScope.ispOnCompleted();
                        }, this.overlayData.timeout * 1000);
                    }
                    else {
                        this.isolatedScope.ispOnCompleted();
                    }
                }
            };
            AppearingImageController.$inject = ['$scope', '$timeout', 'DataService'];
            return AppearingImageController;
        }());
        //directive declaration
        function ispAppearingimage() {
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
        Directives.ispAppearingimage = ispAppearingimage;
    })(Directives = ISPApp.Directives || (ISPApp.Directives = {}));
})(ISPApp || (ISPApp = {}));
//# sourceMappingURL=appearingimage.js.map