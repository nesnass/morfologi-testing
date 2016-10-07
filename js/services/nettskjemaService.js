/// <reference path="../_references.ts"/>
/// <reference path="../app.constants.ts"/>
/// <reference path="../models/models.ts"/>
/// <reference path="./cordovaService"/>
var MorfologiApp;
(function (MorfologiApp) {
    var Services;
    (function (Services) {
        "use strict";
        var NettskjemaService = (function () {
            function NettskjemaService($http, cordovaService) {
                this.$http = $http;
                this.cordovaService = cordovaService;
                this.token = '';
                this.UUID = cordovaService.getDeviceID();
            }
            NettskjemaService.prototype.setNettskjemaToken = function (token) {
                this.token = token;
            };
            NettskjemaService.prototype.postTrackingDataItem = function (item, sFunc, eFunc) {
                var _this = this;
                var postItem = function (item, audio_file) {
                    var form_data = item.asFormDataWithAttachment(audio_file, _this.UUID);
                    _this.$http.post('https://nettskjema.uio.no/answer/deliver.json?formId=74195', form_data, {
                        transformRequest: angular.identity,
                        headers: {
                            'Content-Type': undefined,
                            'NETTSKJEMA_CSRF_PREVENTION': _this.token
                        }
                    }).then(function (success) {
                        var data = success.data;
                        if (success.status !== 200 || data.indexOf('success') === -1 || data.indexOf('failure') > -1) {
                            eFunc(data);
                        }
                        else {
                            item.markAsSynced();
                            sFunc(data);
                        }
                    }, function () {
                        eFunc('Error sending usage data to server - no status response');
                    });
                };
                if (item.audio_file !== '') {
                    this.cordovaService.getTrackingAudioFile(item.audio_file, function (audio_file) {
                        postItem(item, audio_file);
                    }, function (error) {
                        console.log(error);
                    });
                }
                else {
                    postItem(item, null);
                }
            };
            NettskjemaService.$inject = ['$http', 'CordovaService'];
            return NettskjemaService;
        }());
        Services.NettskjemaService = NettskjemaService;
    })(Services = MorfologiApp.Services || (MorfologiApp.Services = {}));
})(MorfologiApp || (MorfologiApp = {}));
//# sourceMappingURL=nettskjemaService.js.map