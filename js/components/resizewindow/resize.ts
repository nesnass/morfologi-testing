/// <reference path="../../_references.ts"/>
/// <reference path="../../services/dataService"/>

namespace MorfologiApp.Directives {
    import DataService = MorfologiApp.Services.DataService;
    import IWindowService = angular.IWindowService;
    "use strict";

    // Custom scope interface must include any vars defined on the scope
    export interface IISPFeatureDirectiveScope extends ng.IScope {
        getWindowDimensions(): {};
    }

    class ResizeController {
        static $inject: string[] = ["DataService", "$window"];
        constructor(public dataService: DataService, public $window: IWindowService) {
        };
    }

    function linker(scope: IISPFeatureDirectiveScope, element: ng.IAugmentedJQuery, ctrl: ResizeController) {
        let w = angular.element(ctrl.$window);
        scope.getWindowDimensions = function () {
            return {
                "VIEW_HEIGHT": element.prop("offsetHeight"),
                "VIEW_WIDTH": element.prop("offsetWidth")
            };
        };
        scope.$watch(scope.getWindowDimensions, function (newValue) {
            ctrl.dataService.setResizableDivSize(newValue);
        }, true);

        w.bind("resize", function () {
            scope.$apply();
        });

        ctrl.dataService.setResizableDivSize(scope.getWindowDimensions());
    }

    export function ispResize(): ng.IDirective {
        return {
            restrict: "A",
            controller: ResizeController,
            link: linker
        };
    }
}
