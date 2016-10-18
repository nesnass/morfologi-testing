/// <reference path="../_references"/>
/// <reference path="../app.constants.ts"/>
/// <reference path="../models/models"/>
/// <reference path="./nettskjemaService"/>

namespace MorfologiApp.Services {
    import Moment = moment.Moment;
    "use strict";

    export interface IDataService {
        /**
         * get the current language
         * @return string
         */
        getLanguage(): string;
        /**
         * set the current language
         * @param type The language code
         */
        setLanguage(type: string): void;
        /**
         * Given an array, return a new array containing shuffled values
         * @param array
         */
        shuffleArray(array: Array<any>): Array<any>;

        /* Window resize */
        getResizableDivSize(): {};
        setResizableDivSize(anything): void;

        /*  Callback setup that disables interaction with an invisible overlay
            intended for use during task introduction audio */
        setDisableInteractionCallback(callback: (setMe: boolean, showSpeaker: boolean) => void): void;
        setInteractionEndActivateTaskCallback(callback: (setMe: boolean) => void): void;
        setInteractionStartActivateTaskCallback(callback: (setMe: boolean) => void): void;
        clearInteractionEndActivateTaskCallback(): void;
        externalCallDisableInteractionCallback(setMe: boolean, showSpeaker: boolean): void;

        /* Tracking */
        automaticallySendData(): void;

        playAudioIntroduction(delay: number): void;
        setupAudioIntroduction(url: string): void;
    }

    export class DataService implements IDataService {
        static $inject = ["$http", "$window", "$timeout", "NettskjemaService", "MorfologiConstants"];

        private currentLanguage: string = "en";
        private user: User;
        private morfer: {};
        private session: Session;

        private status: {
            online: boolean;
            posting_data: boolean;
            unsynced_data: boolean;
        };

        private setupComplete: boolean = false;

        private resizableDivSize: {};
        private disableInteractionCallback: (setMe: boolean, showSpeaker: boolean) => void;   // callback function
        private activateTaskStartCallback: () => void;   // callback function
        private activateTaskEndCallback: () => void;   // callback function
        private introductionAudio;


        constructor(private $http: ng.IHttpService, private $window: ng.IWindowService, private $timeout: ng.ITimeoutService,
                    private nettsckjemaService: INettskjemaService, private constants: IMorfologiConstants) {

            this.morfer = {};
            this.status = {
                online : navigator.onLine || false,
                posting_data: false,
                unsynced_data: false
            };

            this.$window.addEventListener("offline", () => {
                this.status.online = false;
            }, false);

            this.$window.addEventListener("online", () => {
                if (!this.status.online) {
                    this.status.online = true;
                    this.automaticallySendData();
                }
            }, false);

            this.activateTaskStartCallback = null;
            this.activateTaskEndCallback = null;

        }

        getStatus(): {} {
            return this.status;
        }

        automaticallySendData() {
            this.attemptToPostUsageData();
        }

        // Make an attempt to post any new usage data to Nettskjema
        attemptToPostUsageData(): void {
            // If we receive a token, and are running on tablet, it is safe to assume we can then post to Nettskjema
            this.$http.get("http://nettskjema.uio.no/ping.html")
                .then((success) => {
                    console.log("Connected to Nettskjema");
                    this.nettsckjemaService.setNettskjemaToken(success.data.toString());
                    if (this.status.unsynced_data && !this.status.posting_data) {
                        this.postUsageData();
                    }
                }, () => {
                    this.status.online = false;
                    console.log("Unable to connect to Nettskjema");
                });
        }

        setupAfterLogin() {
            if (!this.setupComplete) {
                // Load session and morf files
                this.$http.get(this.constants.constants["MORF_FILE"])
                    .then((morfData) => {
                        console.log("Loaded morf file");
                        this.morfer = morfData;
                        this.$http.get(this.constants.constants["SESSION_FILE"])
                            .then((sessionData) => {
                                console.log("Loaded session file");
                                if (sessionData.hasOwnProperty(this.user.sessionId)) {
                                    this.session = Session.fromData(sessionData[this.user.sessionId]);
                                    this.createTasks();
                                }
                                this.setupComplete = true;
                            }, () => {
                                console.log("Unable to load morf file");
                            });
                    }, () => {
                        console.log("Unable to load sessions file");
                    });
            }
        }

        login(username: string) {
            this.$http.get(this.constants.constants["USER_FILE"])
                .then((users) => {
                    console.log("Loaded user file");
                    if (users.hasOwnProperty(username)) {
                        this.user = new User(username, users[username]["sessionId"]);
                        this.setupAfterLogin();
                    }
                }, () => {
                    console.log("Unable to load user file");
                });
        }

        createTasks() {

        }

        getResizableDivSize() {
            return this.resizableDivSize;
        }
        setResizableDivSize(newSize: any): void {
            this.resizableDivSize = newSize;
        }

        getLanguage() {
            return this.currentLanguage;
        };

        setLanguage(type) {
            this.currentLanguage = type;
        };

        postUsageData(): void {
            this.status.posting_data = true;
            let postData = [];

            let postRemainingData = () => {
                if (postData.length > 0) {
                    this.nettsckjemaService.postTrackingDataItem(postData.pop(), (data) => {
                        console.log("Successful Nettskjema submission: " + data);
                        postRemainingData();
                    }, (data) => {
                        console.log("Error during Nettskjema submission: " + data);
                    });
                } else {
                    this.status.posting_data = false;
                    this.status.unsynced_data = false;
                }
            };
            postRemainingData();
        }

        setupAudioIntroduction(url: string): void {
            if (typeof this.introductionAudio !== "undefined") {
                this.introductionAudio.pause();
            }
            this.$timeout(() => {
                this.introductionAudio = new Audio(url);
                this.introductionAudio.load();
                this.introductionAudio.addEventListener("ended", () => {
                    this.disableInteractionCallback(false, true);
                    if (this.activateTaskEndCallback !== null) {
                        this.activateTaskEndCallback();
                    }
                });
            }, 0);
        }

        playAudioIntroduction(delay: number): void {
            if (delay > 0) {
                this.disableInteractionCallback(true, true);
            }
            this.$timeout(() => {
                if (this.activateTaskStartCallback !== null) {
                    this.activateTaskStartCallback();
                }
                try {
                    this.introductionAudio.play();
                } catch (error) {     // In case no source is found, enable interaction
                    console.log("No introduction audio source found");
                    this.disableInteractionCallback(false, true);
                    if (this.activateTaskEndCallback !== null) {
                        this.activateTaskEndCallback();
                    }
                }
            }, delay);
        }

        setDisableInteractionCallback(callback): void {
            this.disableInteractionCallback = callback;
        }
        setInteractionEndActivateTaskCallback(callback): void {
            this.activateTaskEndCallback = callback;
        }
        clearInteractionEndActivateTaskCallback(): void {
            this.activateTaskEndCallback = null;
        }
        setInteractionStartActivateTaskCallback(callback): void {
            this.activateTaskStartCallback = callback;
        }
        externalCallDisableInteractionCallback(setMe: boolean, showSpeaker: boolean): void {
            if (this.disableInteractionCallback !== null) {
                this.disableInteractionCallback(setMe, showSpeaker);
            }
        }

        // Return a new array that is a shuffle of the provided array
        shuffleArray(array: Array<any>) {
            let newArray = angular.copy(array);
            let currentIndex = newArray.length, temporaryValue, randomIndex;

            // While there remain elements to shuffle...
            while (0 !== currentIndex) {

                // Pick a remaining element...
                randomIndex = Math.floor(Math.random() * currentIndex);
                currentIndex -= 1;

                // And swap it with the current element.
                temporaryValue = newArray[currentIndex];
                newArray[currentIndex] = newArray[randomIndex];
                newArray[randomIndex] = temporaryValue;
            }

            return newArray;
        }

    }

}
