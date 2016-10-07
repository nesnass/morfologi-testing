/// <reference path="../../_references.ts"/>
/// <reference path="../../services/dataService"/>
/**
 * On click, plays a video
 * On end, activates the next task
 *
 * Use this directive in the form:
 * <div isp-video-player></div>
 */
var MorfologiApp;
(function (MorfologiApp) {
    var Directives;
    (function (Directives) {
        "use strict";
        var VideoPlayerController = (function () {
            function VideoPlayerController(isolatedScope, $sce) {
                var _this = this;
                this.isolatedScope = isolatedScope;
                this.$sce = $sce;
                this.posterUrl = "";
                this.videoUrl = "";
                this.playing = false;
                this.playImage = '1';
                this.videoUrl = this.$sce.getTrustedResourceUrl(this.isolatedScope.ispVideoUrl);
                this.posterUrl = this.isolatedScope.ispPosterUrl;
                if (typeof this.isolatedScope.ispType !== 'undefined' && this.isolatedScope.ispType != null) {
                    if (this.isolatedScope.ispType === 'task8') {
                        this.playImage = '2';
                    }
                    else if (this.isolatedScope.ispType === 'none') {
                        this.playImage = '';
                    }
                    else {
                        this.playImage = '1';
                    }
                }
                isolatedScope.$watch(function () { return isolatedScope.ispActive['playing']; }, function (newValue) {
                    if (newValue === true) {
                        if (isolatedScope.ispActive['playing'] === true) {
                            _this.playVideo();
                        }
                    }
                });
            }
            ;
            VideoPlayerController.prototype.playVideo = function () {
                if (this.isolatedScope.ispActive['active']) {
                    this.playing = true;
                    this.video.load();
                    this.video.play();
                    this.isolatedScope.ispOnPlay();
                }
            };
            VideoPlayerController.$inject = ['$scope', '$sce'];
            return VideoPlayerController;
        }());
        function linker(isolatedScope, element, attributes, ctrl) {
            var c = element.children();
            ctrl.video = c[0];
            ctrl.video.autoplay = false;
            ctrl.video.addEventListener('ended', function () {
                ctrl.playing = false;
                isolatedScope.ispActive['playing'] = false;
                isolatedScope.ispOnCompleted();
                isolatedScope.$digest();
            });
        }
        //directive declaration
        function ispVideoPlayer() {
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
        Directives.ispVideoPlayer = ispVideoPlayer;
        //Html5 video fix
        function html5videofix() {
            return {
                restrict: 'A',
                link: function (isolatedScope, element, attr) {
                    attr.$set('src', attr['vsrc']);
                    attr.$set('poster', attr['psrc']);
                    attr.$set('autoplay', false);
                    attr.$set('webkit-playsinline', '');
                    attr.$set('playsinline', '');
                }
            };
        }
        Directives.html5videofix = html5videofix;
    })(Directives = MorfologiApp.Directives || (MorfologiApp.Directives = {}));
})(MorfologiApp || (MorfologiApp = {}));
//# sourceMappingURL=videoplayer.js.map