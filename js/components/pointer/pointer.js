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
        var PointerController = (function () {
            function PointerController(isolatedScope, $timeout) {
                var _this = this;
                this.isolatedScope = isolatedScope;
                this.$timeout = $timeout;
                this.pulse = true;
                this.hideMe = false;
                var timeToHide = (typeof isolatedScope.ispTimeout !== 'undefined') ? parseInt(isolatedScope.ispTimeout) : 6000;
                var delay = (typeof isolatedScope.ispDelay !== 'undefined') ? parseInt(isolatedScope.ispDelay) : 0;
                $timeout(function () {
                    isolatedScope.$watch(function () {
                        return _this.isolatedScope.ispPointerStyle;
                    }, function () {
                        _this.hideMe = false;
                        _this.pulse = true;
                        $timeout(function () {
                            _this.pulse = false;
                            if (isolatedScope.ispHideAfter === 'true') {
                                _this.hideMe = true;
                            }
                        }, timeToHide);
                    });
                }, delay);
            }
            ;
            PointerController.$inject = ['$scope', '$timeout'];
            return PointerController;
        })();
        //directive declaration
        function ispPointer() {
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
        Directives.ispPointer = ispPointer;
    })(Directives = ISPApp.Directives || (ISPApp.Directives = {}));
})(ISPApp || (ISPApp = {}));
//# sourceMappingURL=pointer.js.map