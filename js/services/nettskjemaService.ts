/// <reference path="../_references.ts"/>
/// <reference path="../app.constants.ts"/>
/// <reference path="../models/models.ts"/>
/// <reference path="./cordovaService"/>

module ISPApp.Services {
    "use strict";

    export interface INettskjemaService {
        setNettskjemaToken(token: string): void
        postTrackingDataItem(item: UsagePostData, sFunc: (videoData) => void, eFunc: (error) => void): void;
    }

    export class NettskjemaService implements INettskjemaService {
        static $inject = ['$http', 'CordovaService', 'ISPConstants'];

        private token: string;
        private UUID: string;

        constructor(private $http: ng.IHttpService, private cordovaService: ICordovaService) {
            this.token = '';
            this.UUID = cordovaService.getDeviceID();
        }

        setNettskjemaToken(token) {
            this.token = token;
        }


        postTrackingDataItem(item: UsagePostData, sFunc, eFunc) {
            var postItem = (item, audio_file) => {
                var form_data = item.asFormDataWithAttachment(audio_file, this.UUID);

                this.$http.post('https://nettskjema.uio.no/answer/deliver.json?formId=74195', form_data, {
                    transformRequest: angular.identity,
                    headers: {
                        'Content-Type': undefined,
                        'NETTSKJEMA_CSRF_PREVENTION': this.token
                    }
                }).then( (success) => {
                    var data = success.data as string;
                    if (success.status !== 200 || data.indexOf('success') === -1 || data.indexOf('failure') > -1) {
                        eFunc(data);
                    } else {
                        item.markAsSynced();
                        sFunc(data);
                    }
                }, () => {
                    eFunc('Error sending usage data to server - no status response');
                });
            };

            if (item.audio_file !== '') {
                this.cordovaService.getTrackingAudioFile(item.audio_file, (audio_file) => {
                    postItem(item, audio_file);
                }, (error) => {
                    console.log(error);
                });
            } else {
                postItem(item, null);
            }
        }


    }

}
