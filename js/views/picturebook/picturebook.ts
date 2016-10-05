/// <reference path="../../_references.ts"/>
/// <reference path="../../models/models.ts"/>
/// <reference path="../../services/dataService.ts"/>

module ISPApp.Controllers {
    import IDataService = ISPApp.Services.IDataService;
    import IScope = angular.IScope;
    import ILocationService = angular.ILocationService;
    import IonicSlideBoxDelegate = ionic.slideBox.IonicSlideBoxDelegate;
    import SwiperOptions = Swiper.SwiperOptions;
    import IStateParamsService = angular.ui.IStateParamsService;
    import ITimeoutService = angular.ITimeoutService;
    "use strict";

    export class PictureBookController {
        static $inject = ['$scope', '$timeout', '$location', '$stateParams', 'DataService'];

        private slider: {
            sliderDelegate: Swiper;
            sliderOptions: {};
        };
        private sliding: boolean;
        private selectedDayIndex: number;
        private pulseForwardArrow: boolean;
        private activePageIndex: number;
        private previousPageIndex: number;
        private highestPageSeen: number;
        private lockSwipeBeforeOverlaysCompleted: boolean = true;

        private book: Book;
        private pageOverlays: Overlays;
        private compulsoryOverlays: Array<Overlay>;
        private activeCompulsoryOverlayIndex: number;
        private bouncePointer: boolean = true;
        private displayDelay: number;
        private reachedEnd: boolean;

        constructor(private $scope: IScope,
                    private $timeout: ITimeoutService,
                    private $location: ILocationService,
                    private $stateParams: IStateParamsService,
                    private dataService: IDataService) {

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
                    direction: 'horizontal', //or 'vertical'
                    speed: 300, //0.3s transition
                    onTouchMove: () => {
                        this.sliding = true;
                        this.$scope.$digest();
                    },
                    onTouchEnd: () => {
                        this.$timeout(() => {
                            this.sliding = false
                        }, 1000);
                    },
                    onReachEnd: () => {
                        this.reachedEnd = true;
                    }
                }
            };

            // This event should fire before $ionicView.enter
            $scope.$on("$ionicSlides.sliderInitialized", (event, data) => {
                // data.slider is the instance of Swiper
                handle.slider.sliderDelegate = data.slider;
                handle.slider.sliderDelegate.on('slideChangeEnd', () => {
                    this.sliding = false;
                    this.activePageIndex = this.slider.sliderDelegate.activeIndex;
                    this.previousPageIndex = this.slider.sliderDelegate.previousIndex;
                    if (this.activePageIndex < this.book.backgrounds.length-1) {
                        this.reachedEnd = false;
                    }
                    if (this.activePageIndex > this.highestPageSeen) {
                        this.highestPageSeen = this.activePageIndex;
                        this.bouncePointer = true;
                    } else {
                        this.bouncePointer = false;
                    }
                    this.pageSetup();
                    //use $scope.$apply() to refresh any content external to the slider
                    this.$scope.$apply();
                });
            });

            $scope.$on('$ionicView.enter', () => {
                handle.initialise();
            });

        }

        initialise() {
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
        }

        pageSliding(s: boolean) {
            if (!s) {
                this.$timeout(() => {
                    this.sliding = s;
                }, 1000)
            } else {
                this.sliding = s;
            }
        }

        // Triggered by an overlaid component when it has been deemed 'complete'
        overlayOnCompleted(overlay: Overlay): void {
            overlay.active = false;
            var index = this.compulsoryOverlays.indexOf(overlay);
            if( index > -1 && index === this.activeCompulsoryOverlayIndex) {
                this.activeCompulsoryOverlayIndex++;
                this.$timeout(() => {
                    if (this.activeCompulsoryOverlayIndex < this.compulsoryOverlays.length) {
                        this.compulsoryOverlays[this.activeCompulsoryOverlayIndex].active = true;
                    } else if (this.lockSwipeBeforeOverlaysCompleted) {
                        this.slider.sliderDelegate.unlockSwipeToNext();
                    }
                }, 0);
            }
        }


        // Here customise the overlays and other setup depending on the page selected.
        // For this book, compulsory overlays are activated one at a time, after the previous is completed.
        // Finally, the user is able to drag to the next page.
        pageSetup() {
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
                        } else if (overlayType !== 'display_delay') {
                            this.pageOverlays[overlayType].forEach((overlay) => {
                                if (overlay.sequence > -1) {
                                    this.compulsoryOverlays.push(overlay);
                                } else if (!overlay.auto_start) {
                                    overlay.active = true;
                                }
                            })
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
                if(this.lockSwipeBeforeOverlaysCompleted && this.highestPageSeen == this.activePageIndex) {
                    this.slider.sliderDelegate.lockSwipeToNext();
                }

            }
        }

        completeBook() {
            this.dataService.completeSelectedBook();
            this.$location.path("/tasks");
        }

    }
}
