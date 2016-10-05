/// <reference path="../../_references.ts"/>
/// <reference path="../../models/models.ts"/>
/// <reference path="../../services/dataService.ts"/>
var ISPApp;
(function (ISPApp) {
    var Controllers;
    (function (Controllers) {
        "use strict";
        var PictureBookController = (function () {
            function PictureBookController($scope, $timeout, $location, $stateParams, dataService) {
                var _this = this;
                this.$scope = $scope;
                this.$timeout = $timeout;
                this.$location = $location;
                this.$stateParams = $stateParams;
                this.dataService = dataService;
                this.lockSwipeBeforeOverlaysCompleted = true;
                this.bouncePointer = true;
                var handle = this;
                this.slider = {
                    sliderDelegate: null,
                    sliderOptions: {
                        initialSlide: 0,
                        loop: false,
                        lazyLoading: true,
                        lazyLoadingOnTransitionStart: true,
                        pagination: false,
                        allowSwipeToNext: true,
                        longSwipesRatio: 0.25,
                        direction: 'horizontal',
                        speed: 300,
                        onTouchMove: function () {
                            _this.sliding = true;
                            _this.$scope.$digest();
                        },
                        onTouchEnd: function () {
                            _this.$timeout(function () {
                                _this.sliding = false;
                            }, 1000);
                        },
                        onReachEnd: function () {
                            _this.reachedEnd = true;
                        }
                    }
                };
                // This event should fire before $ionicView.enter
                $scope.$on("$ionicSlides.sliderInitialized", function (event, data) {
                    // data.slider is the instance of Swiper
                    handle.slider.sliderDelegate = data.slider;
                    handle.slider.sliderDelegate.on('slideChangeEnd', function () {
                        _this.sliding = false;
                        _this.activePageIndex = _this.slider.sliderDelegate.activeIndex;
                        _this.previousPageIndex = _this.slider.sliderDelegate.previousIndex;
                        if (_this.activePageIndex < _this.book.backgrounds.length - 1) {
                            _this.reachedEnd = false;
                        }
                        if (_this.activePageIndex > _this.highestPageSeen) {
                            _this.highestPageSeen = _this.activePageIndex;
                            _this.bouncePointer = true;
                        }
                        else {
                            _this.bouncePointer = false;
                        }
                        _this.pageSetup();
                        //use $scope.$apply() to refresh any content external to the slider
                        _this.$scope.$apply();
                    });
                });
                $scope.$on('$ionicView.enter', function () {
                    handle.initialise();
                });
            }
            PictureBookController.prototype.initialise = function () {
                this.activePageIndex = 0;
                this.previousPageIndex = -1;
                this.reachedEnd = false;
                this.highestPageSeen = 0;
                this.selectedDayIndex = this.dataService.getDay();
                this.book = this.dataService.getBook();
                this.pulseForwardArrow = false;
                this.sliding = false;
                this.displayDelay = 0;
                this.pageSetup();
            };
            PictureBookController.prototype.pageSliding = function (s) {
                var _this = this;
                if (!s) {
                    this.$timeout(function () {
                        _this.sliding = s;
                    }, 1000);
                }
                else {
                    this.sliding = s;
                }
            };
            // Triggered by an overlaid component when it has been deemed 'complete'
            PictureBookController.prototype.overlayOnCompleted = function (overlay) {
                var _this = this;
                overlay.active = false;
                var index = this.compulsoryOverlays.indexOf(overlay);
                if (index > -1 && index === this.activeCompulsoryOverlayIndex) {
                    this.activeCompulsoryOverlayIndex++;
                    this.$timeout(function () {
                        if (_this.activeCompulsoryOverlayIndex < _this.compulsoryOverlays.length) {
                            _this.compulsoryOverlays[_this.activeCompulsoryOverlayIndex].active = true;
                        }
                        else if (_this.lockSwipeBeforeOverlaysCompleted) {
                            _this.slider.sliderDelegate.unlockSwipeToNext();
                        }
                    }, 0);
                }
            };
            // Here customise the overlays and other setup depending on the page selected.
            // For this book, compulsory overlays are activated one at a time, after the previous is completed.
            // Finally, the user is able to drag to the next page.
            PictureBookController.prototype.pageSetup = function () {
                var _this = this;
                var backgroundReference = this.book.backgrounds[this.activePageIndex].toString();
                this.compulsoryOverlays = [];
                this.activeCompulsoryOverlayIndex = 0;
                this.pageOverlays = null;
                this.slider.sliderDelegate.unlockSwipeToNext();
                this.displayDelay = 0;
                // Configure all overlays
                if (this.book.overlays.hasOwnProperty(backgroundReference)) {
                    this.pageOverlays = this.book.overlays[backgroundReference];
                    // Set variables for state tracking and set up compulsory overlays
                    for (var overlayType in this.pageOverlays) {
                        if (this.pageOverlays.hasOwnProperty(overlayType)) {
                            if (overlayType === 'display_delay' && this.highestPageSeen == this.activePageIndex) {
                                this.displayDelay = this.pageOverlays[overlayType];
                            }
                            else if (overlayType !== 'display_delay') {
                                this.pageOverlays[overlayType].forEach(function (overlay) {
                                    if (overlay.sequence > -1) {
                                        _this.compulsoryOverlays.push(overlay);
                                    }
                                    else if (!overlay.auto_start) {
                                        overlay.active = true;
                                    }
                                });
                            }
                        }
                    }
                    if (this.compulsoryOverlays.length > 0) {
                        // Sort compulsory overlays by sequence
                        this.compulsoryOverlays.sort(function (overlay1, overlay2) {
                            return overlay1.sequence - overlay2.sequence;
                        });
                        // Set first overlay item on the page to active
                        this.compulsoryOverlays[0].active = true;
                    }
                    // If requested, lock the next page control
                    if (this.lockSwipeBeforeOverlaysCompleted && this.highestPageSeen == this.activePageIndex) {
                        this.slider.sliderDelegate.lockSwipeToNext();
                    }
                }
            };
            PictureBookController.prototype.completeBook = function () {
                this.dataService.completeSelectedBook();
                this.$location.path("/tasks");
            };
            PictureBookController.$inject = ['$scope', '$timeout', '$location', '$stateParams', 'DataService'];
            return PictureBookController;
        }());
        Controllers.PictureBookController = PictureBookController;
    })(Controllers = ISPApp.Controllers || (ISPApp.Controllers = {}));
})(ISPApp || (ISPApp = {}));
//# sourceMappingURL=picturebook.js.map