/// <reference path="../../_references.ts"/>
/// <reference path="../../services/dataService"/>

/**
 * On click, plays a video
 * On end, activates the next task
 *
 * Use this directive in the form:
 * <div isp-video-player></div>
 */
module MorfologiApp.Directives {
    import ISCEService = angular.ISCEService;
    "use strict";

    //isolated scope interface
    export interface IISPVideoPlayerDirectiveScope extends ng.IScope {
        ispVideoUrl: string;
        ispPosterUrl: string;
        ispActive: {};
        ispType: string;
        ispOnPlay(): void;
        ispOnCompleted(): void;
    }

    class VideoPlayerController {
        static $inject: string[] = ['$scope', '$sce'];

        private posterUrl: string = "";
        private videoUrl: string = "";
        public video: HTMLVideoElement;
        public playing: boolean;
        public playImage: string;

        constructor(private isolatedScope: IISPVideoPlayerDirectiveScope, private $sce: ISCEService) {
            this.playing = false;
            this.playImage = '1';
            this.videoUrl = this.$sce.getTrustedResourceUrl(this.isolatedScope.ispVideoUrl);
            this.posterUrl = this.isolatedScope.ispPosterUrl;
            if (typeof this.isolatedScope.ispType !== 'undefined' && this.isolatedScope.ispType != null) {
                if (this.isolatedScope.ispType === 'task8') {
                    this.playImage = '2';
                } else if (this.isolatedScope.ispType === 'none') {
                    this.playImage = '';
                } else {
                    this.playImage = '1';
                }
            }

            isolatedScope.$watch(() => { return isolatedScope.ispActive['playing'] }, (newValue) => {
                if (newValue === true) {
                   if (isolatedScope.ispActive['playing'] === true ) {
                       this.playVideo();
                   }
                }
            });
        };

        playVideo() {
            if (this.isolatedScope.ispActive['active']) {
                this.playing = true;
                this.video.load();
                this.video.play();
                this.isolatedScope.ispOnPlay();
            }
        }

    }

    function linker(isolatedScope: IISPVideoPlayerDirectiveScope , element: ng.IAugmentedJQuery,
                    attributes: ng.IAttributes, ctrl: VideoPlayerController) {

        var c = element.children();
        ctrl.video = <HTMLVideoElement> c[0];
        ctrl.video.autoplay = false;

        ctrl.video.addEventListener('ended', () => {
            ctrl.playing = false;
            isolatedScope.ispActive['playing'] = false;
            isolatedScope.ispOnCompleted();
            isolatedScope.$digest();
        });
    }

    //directive declaration
    export function ispVideoPlayer(): ng.IDirective {
        return {
            restrict: 'A',
            controller: VideoPlayerController,
            controllerAs: 'vpC',
            replace: true,
            templateUrl: 'js/components/videoplayer/videoplayer.html',
            scope: {
                ispVideoUrl: '@',
                ispPosterUrl: '@',
                ispOnCompleted: '&',
                ispActive: '=',
                ispOnPlay: '&',
                ispType: '@'
            },
            link: linker
        };
    }

    //Html5 video fix
    export function html5videofix(): ng.IDirective {
        return {
            restrict: 'A',
            link: function(isolatedScope: IISPVideoPlayerDirectiveScope, element, attr) {
                attr.$set('src', attr['vsrc']);
                attr.$set('poster', attr['psrc']);
                attr.$set('autoplay', false);
                attr.$set('webkit-playsinline', '');
                attr.$set('playsinline', '');
            }
        };
    }
}
