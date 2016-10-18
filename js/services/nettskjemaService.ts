/// <reference path="../_references.ts"/>
/// <reference path="../app.constants.ts"/>
/// <reference path="../models/models.ts"/>

namespace MorfologiApp.Services {
    "use strict";

    export interface INettskjemaService {
        setNettskjemaToken(token: string): void;
        postTrackingDataItem(item: Object, sFunc: (videoData) => void, eFunc: (error) => void): void;
    }

    export class NettskjemaService implements INettskjemaService {
        static $inject = ["$http", "CordovaService"];

        private token: string;
        private UUID: string;

        constructor(private $http: ng.IHttpService) {
            this.token = "";
            this.UUID = "";
        }

        setNettskjemaToken(token) {
            this.token = token;
        }


        postTrackingDataItem(item: Object, sFunc, eFunc) {
            let postItem = (item, audio_file) => {
                let form_data = item.asFormDataWithAttachment(audio_file, this.UUID);

                this.$http.post("https://nettskjema.uio.no/answer/deliver.json?formId=74195", form_data, {
                    transformRequest: angular.identity,
                    headers: {
                        "Content-Type": undefined,
                        "NETTSKJEMA_CSRF_PREVENTION": this.token
                    }
                }).then( (success) => {
                    let data = success.data as string;
                    if (success.status !== 200 || data.indexOf("success") === -1 || data.indexOf("failure") > -1) {
                        eFunc(data);
                    } else {
                        item.markAsSynced();
                        sFunc(data);
                    }
                }, () => {
                    eFunc("Error sending usage data to server - no status response");
                });
            };

            postItem(item, null);

        }


    }

}
