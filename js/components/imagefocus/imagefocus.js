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
        var ImageFocusController = (function () {
            function ImageFocusController(isolatedScope, $timeout) {
                var _this = this;
                this.isolatedScope = isolatedScope;
                this.$timeout = $timeout;
                this.imageUrl = "";
                this.focusStyle = {};
                this.highlightStyle = {};
                this.mapStyle = null;
                this.bounce = false;
                this.showBounce = false;
                this.imageUrl = this.isolatedScope.ispImageUrl;
                var delay = parseInt(isolatedScope.ispDelayStart) * 1000;
                this.$timeout(function () {
                    _this.setup();
                }, delay);
            }
            ;
            ImageFocusController.prototype.setup = function () {
                var _this = this;
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
                    this.$timeout(function () {
                        _this.bounce = false;
                        if (_this.isolatedScope.ispData['pointer']['retain'] === 'false') {
                            _this.showBounce = false;
                        }
                    }, 5000);
                }
                else {
                    if (this.isolatedScope.ispData['auto_start']) {
                        this.$timeout(function () {
                            _this.isolatedScope.startFocus();
                            if (_this.isolatedScope.ispData['show_highlight']) {
                                _this.$timeout(function () {
                                    _this.isolatedScope.drawCircle();
                                }, 2000);
                            }
                        }, 2000);
                    }
                }
                this.resetStyles();
            };
            ImageFocusController.prototype.startFocus = function () {
                var _this = this;
                this.showBounce = false;
                this.isolatedScope.startFocus();
                if (typeof this.isolatedScope.ispOnCompleted !== 'undefined' && this.isolatedScope.ispOnCompleted !== null) {
                    this.$timeout(function () {
                        _this.isolatedScope.ispOnCompleted();
                    }, 2000);
                }
            };
            ImageFocusController.prototype.resetStyles = function () {
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
                    };
                }
            };
            ImageFocusController.$inject = ['$scope', '$timeout'];
            return ImageFocusController;
        })();
        function linker(isolatedScope, element) {
            var dataKey = 'ispData', transitionKey = 'transition';
            var xKey = 'x', yKey = 'y', scaleKey = 'scale', durationKey = 'duration';
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
            isolatedScope.startFocus = function () {
                image.css({
                    '-webkit-transform': 'scale(' + scale + ',' + scale + ') translate(' + end_x + 'px,' + end_y + 'px)',
                    'transform': 'scale(' + scale + ',' + scale + ') translate(' + end_x + 'px,' + end_y + 'px)' /* Standard syntax */
                });
            };
            isolatedScope.drawCircle = function () {
                var circle = angular.element(element.children()[1]);
                circle.css({
                    'display': 'block'
                });
                circle.addClass("animate");
            };
        }
        //directive declaration
        function ispImagefocus() {
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
        Directives.ispImagefocus = ispImagefocus;
    })(Directives = ISPApp.Directives || (ISPApp.Directives = {}));
})(ISPApp || (ISPApp = {}));
//# sourceMappingURL=imagefocus.js.map