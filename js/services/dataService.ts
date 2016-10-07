/// <reference path="../_references"/>
/// <reference path="../app.constants.ts"/>
/// <reference path="../models/models"/>
/// <reference path="./nettskjemaService"/>
/// <reference path="./cordovaService"/>


module MorfologiApp.Services {
    import Moment = moment.Moment;
    "use strict";

    export interface IDataService {
        /**
         * Return the current status object
         */
        getStatus(): {};
        /**
         * Return the current settings object
         */
        getSettings(): {};
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
         * get the book list
         * @return object
         */
        getBookList(sFunc: (bookList: Array<Book>) => void, eFunc: (error: {}) => void): void;
        /**
         * skip the current day if password is correct
         * @param password
         */
        skipToday(password: string): void;
        /**
         * get the selected book
         * @return Book
         */
        getBook(): Book;
        /**
         * get the task list
         * @return Task[]
         */
        getTasks(): Task[];
        /**
         * get the week list
         * @return Week[]
         */
        getWeeks(): Week[];
        /**
         * get the selected word
         * @return word
         */
        getWord(): string;
        /**
         * for the current Consolidation day, get the word we need to use
         */
        getWordForConsolidationDay(): string;
        /**
         * get the selected week index
         */
        getWeek(): number;
        /**
         * get the selected day index
         */
        getDay(): number;
        /**
         * Get the current Task index
         */
        getTaskIndex(): number;
        /**
         * Get the current Task details
         */
        getTask(): Task;
        /**
         * Get the achievement status of the user
         */
        getAchievement(): Achievement;
        /**
         * select a week
         * @param weekIndex The week index starting from 0
         */
        setWeek(weekIndex: number): void;
        /**
         * select a day
         * @param dayIndex The day index starting from 0
         */
        setDay(dayIndex: number): void;
        /**
         * select a task
         * @param taskIndex The task index starting from 0
         */
        setTask(taskIndex: number): void;
        /**
         * Begin reading the selected book
         */
        startBook(): void;
        /**
         * Return that the book was read on the selected day
         */
        getBookReadToday(): boolean;
        /**
         * Set that the book was read on the selected day
         */
        setBookReadToday(): void;
        /**
         * get the common resources object
         * @return object
         */
        getCommon(): Common;

        /**
         * Return the Username property
         */
        getUsername(): string;
        /**
         * Set yhe Username property
         */
        setUsername(username: string): void;

        /**
         * Given an array, return a new array containing shuffled values
         * @param array
         */
        shuffleArray(array: Array<any>): Array<any>;

        /* Window resize */
        getResizableDivSize(): {};
        setResizableDivSize(any): void;

        getDesktopBrowserTesting(): boolean;

        /*  Callback setup that disables interaction with an invisible overlay
            intended for use during task introduction audio */
        setDisableInteractionCallback(callback: (setMe: boolean, showSpeaker: boolean) => void): void;
        setInteractionEndActivateTaskCallback(callback: (setMe: boolean) => void): void;
        setInteractionStartActivateTaskCallback(callback: (setMe: boolean) => void): void;
        clearInteractionEndActivateTaskCallback(): void;
        externalCallDisableInteractionCallback(setMe: boolean, showSpeaker: boolean): void;

        /* Completion */
        completeSelectedTask(): void;
        completeSelectedDay(): void;
        completeSelectedWeek(): void;
        completeSelectedBook(): void;
        completeCurrentUsageRecord(type: string): void;

        setAvatar(avatarIndex: number): void;

        /* Tracking (audio recording) */
        startTrackingRecording(type: string): void;
        getTaskUsage(): UsageStorage[];
        automaticallySendData(): void;

        getStorageMode(): string;
        checkStorageAndSetup(sFunc: (return_to_home: boolean) => void): void;
        writeStorage(sFunc: () => void, eFunc: () => void, backup: boolean): void;
        removeStorage(): void;

        playAudioIntroduction(delay: number): void;
        setupAudioIntroduction(url: string): void;

        /*  Video and Audio recording  */
        captureVideo(sFunc: () => void, eFunc: () => void): void;
        //getVideoMedia(source: string): Media;
        checkFile(filename: string, sFunc: (videoData) => void, eFunc: (error) => void): void;
        startCaptureAudio();
        stopCaptureAudio(sFunc: (videoData) => void, eFunc: (error) => void);

        getFormalStartDate(): Date;
        getAppVersion(callback: (version) => void): void;
        getShowCheats(): boolean;

        getDeviceReady(): boolean;
        setDeviceReady(setMe: boolean): void;
    }

    export class DataService implements IDataService {
        static $inject = ['$http', '$window', '$timeout', 'CordovaService', 'NettskjemaService', 'MorfologiConstants'];

        private currentLanguage: string = "en";
        private username: string = '';

        private status: {
            online: boolean;
            posting_data: boolean;
            unsynced_data: boolean;
            disk_space: number;
        };

        private settings: {
            // Attempt to send data to Nettskjema automatically
            automatic_send_data: boolean;

            // Switch that determines 'sample' or 'formal' modes for data storage
            storage_mode: string;
        };

        private selectedWeekIndex: number = 0;
        private selectedBookIndex: number = 0;
        private selectedDayIndex: number = 0;
        private selectedTaskIndex: number = 0;

        private setupModel: Setup;             // data structure representing entire Task set
        private storageModel: Storage;  // structure representing Task tracked data set
        private setupComplete: boolean = false;

        private resizableDivSize: {};
        private disableInteractionCallback: (setMe: boolean, showSpeaker: boolean) => void;   // callback function
        private activateTaskStartCallback: () => void;   // callback function
        private activateTaskEndCallback: () => void;   // callback function

        private introductionAudio;
        private desktopBrowserTesting;

        private deviceReady: boolean;

        constructor(private $http:ng.IHttpService, private $window: ng.IWindowService, private $timeout: ng.ITimeoutService,
                    private nettsckjemaService: INettskjemaService, private cordovaService: ICordovaService, private constants: IMorfologiConstants) {

            this.deviceReady = false;

            this.status = {
                online : navigator.onLine || false,
                posting_data: false,
                unsynced_data: false,
                disk_space: NaN
            };

            // *** AUTO SENDING IS INTENDED TO BE SET TO true IN PRODUCTION
            this.settings = {
                automatic_send_data: true,
                storage_mode: 'sample'
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

            this.desktopBrowserTesting = !$window.cordova;
            this.activateTaskStartCallback = null;
            this.activateTaskEndCallback = null;

        }

        getDeviceReady() {
            return this.deviceReady;
        }

        setDeviceReady(setMe: boolean) {
            this.deviceReady = setMe;
        }

        getFormalStartDate(): Date {
            return this.constants.constants['FORMAL_TEST_DATE'];
        }

        getShowCheats(): boolean {
            return this.constants.constants['SHOW_CHEATS'];
        }

        getStatus(): {} {
            return this.status;
        }

        getDesktopBrowserTesting(): boolean {
            return this.desktopBrowserTesting;
        }


        // Takes the 'achievement' to the next day, but marks day as skipped.
        // The day to skip is considered as the avatar's current location
        skipToday(password: string) {
            let passKey = 'SKIP_DAY_PASSWORD';
            if (this.constants.constants[passKey] === password) {
                var uncompletedWeekIndex = this.storageModel.achievement.weekIndex + 1;
                var uncompletedDayIndex = this.storageModel.achievement.dayIndex + 1;
                this.storageModel.markDayAsSkipped(uncompletedWeekIndex, uncompletedDayIndex);
                if (uncompletedDayIndex === 2) {
                    this.setupModel.markWeekAsCompleted(uncompletedWeekIndex);
                    this.storageModel.markWeekAsCompleted(uncompletedWeekIndex);
                    this.storageModel.achievement.completeWeek(uncompletedWeekIndex);
                } else {
                    this.storageModel.achievement.completeDay(uncompletedWeekIndex, uncompletedDayIndex);
                }
            }

        }

        getSettings(): {} {
            return this.settings;
        }

        automaticallySendData() {
            if (this.settings.automatic_send_data) {
                this.attemptToPostUsageData();
            }
        }

        // Make an attempt to post any new usage data to Nettskjema
        attemptToPostUsageData(): void {
            // If we receive a token, and are running on tablet, it is safe to assume we can then post to Nettskjema
            if (this.desktopBrowserTesting) {
                return;
            }
            this.$http.get('http://nettskjema.uio.no/ping.html')
                .then((success) => {
                    console.log('Connected to Nettskjema');
                    this.nettsckjemaService.setNettskjemaToken(success.data.toString());
                    if (this.status.unsynced_data && !this.status.posting_data) {
                        this.postUsageData();
                    }
                }, (error) => {
                    this.status.online = false;
                    console.log('Unable to connect to Nettskjema');
                })
        }

        // Load in the setup file to manage tasks and picturebooks
        requestSetupModel(successCallback) {
            let setupPathKey = 'SETUP_FILE_PATH', setupFilenameKey = 'SETUP_FILE_NAME', setupRevisionKey = 'RELEASE_NUMBER';
            return this.$http.get(this.constants.constants[setupPathKey] + this.constants.constants[setupFilenameKey] +
                    this.constants.constants[setupRevisionKey] + '.json')
                .then((res) => {
                    this.setupModel = new Setup().deserialise(res.data);
                    if(successCallback !== null) {
                        successCallback(res.data);
                    }
                });
        }

        // Load in the current saved status from local tablet storage
        requestSavedState(sFunc) {
            this.cordovaService.storageExists(this.setupModel, this.username, () => {
                this.cordovaService.getStorage((model) => {
                    this.storageModel = model;
                    if (sFunc !== null) {
                        sFunc(model);
                    }
                }, (error) => {
                    // If there was a terminal error reading from the storage file, try to create a new one
                    if (typeof error !== 'undefined' && error !== null && error === 'create_new_storage') {
                        this.cordovaService.writeStorage(new Storage().initialise(this.setupModel, this.username), () => {
                            console.log('Created fresh storage after read fail');
                            this.cordovaService.getStorage((model) => {
                                this.storageModel = model;
                                if (sFunc !== null) {
                                    sFunc(model);
                                }
                            }, null);
                        }, null, false);
                    }
                    console.log('Error getting storage');
                })
            }, () => {
                console.log('Error checking storage exists');
            })
        }

        getStorageMode(): string {
            return this.settings.storage_mode;
        }

        // If before the 'formal date' set in Constants we use 'sample' storage. After this date, we use 'formal' storage
        checkStorageAndSetup(successCallback) {
            console.log('Checking storage...');
            let storageFilenameKey = 'STORAGE_FILE_NAME', revisionKey = 'RELEASE_NUMBER';
            let formalNameKey = 'FORMAL_TEST_NAME', sampleNameKey = 'SAMPLE_TEST_NAME', formalDateKey = 'FORMAL_TEST_DATE';
            var formalDate: Date = this.constants.constants[formalDateKey];
            var dateNow = new Date();
            var newMode = this.constants.constants[sampleNameKey];

            if (dateNow.getTime() > formalDate.getTime()) {
                newMode = this.constants.constants[formalNameKey];
            }
            console.log('Using storage: ' + newMode);


            // Called from a 'resume' and storage state has changed, or this is the first launch
            if ((this.setupComplete && this.settings.storage_mode !== newMode) || !this.setupComplete) {
                this.setupComplete = false;
                this.settings.storage_mode = newMode;

                // If switching from 'sample' to 'formal' we must copy the same identifier
                var identifier = '';
                if (typeof this.storageModel !== 'undefined' && this.storageModel !== null) {
                    identifier = this.storageModel.username;
                }
                var filename = this.constants.constants[storageFilenameKey] + '_' +
                    this.constants.constants[revisionKey] + '_' + newMode + '.json';
                this.cordovaService.setStorageFilename(filename);
                this.setup((return_to_home) => {
                    // Due to teachers entering student names during training period (this is not allowed)
                    // we are not copying the identifier across. Instead it must be asked for again.
                    /*
                    if (identifier !== '') {
                        this.storageModel.username = identifier;
                    }
                    */
                    successCallback(return_to_home);
                });
            } else {
                successCallback(false);
            }
        }

        // Save the current status to local tablet storage
        writeStorage(sFunc, eFunc, backup) {
            if (this.deviceReady) {
                this.cordovaService.writeStorage(this.storageModel, () => {
                    console.log('Saved to storage file');
                    if (sFunc !== null) {
                        sFunc();
                    }
                }, () => {
                    console.log('Error writing storage');
                }, backup);
            } else {
                eFunc('Device not ready');
            }
        }

        setup(successCallback) {
            if (!this.setupComplete) {
                console.log('Loading setup...');
                this.requestSetupModel(() => {
                    console.log('Loading storage...');
                    this.requestSavedState(() => {
                        console.log('Marking completions...');
                        this.markSetupCompletions();
                        // console.log('Deleting old recordings...');
                       // this.deleteOldRecordings();
                        this.setupComplete = true;
                        if(successCallback !== null) {
                            successCallback(true);
                        }
                    })
                })
            } else if (successCallback !== null) {
                successCallback(false);
            }
        }

        /**
         * For each setup task, if completed in the storage, mark them in memory
         */
        markSetupCompletions() {
            this.storageModel.weeks.forEach((week, weekIndex) => {
                if (week.completed_on !== null) {
                    this.setupModel.weeks[weekIndex].completed = true;
                    //this.storageModel.achievement.weekIndex = weekIndex;
                }
                week.days.forEach((day, dayIndex) => {
                    if (day.completed_on !== null) {
                        this.setupModel.weeks[weekIndex].days[dayIndex].completed = true;
                        //this.storageModel.achievement.dayIndex = dayIndex;
                    }
                    day.tasks.forEach((task, taskIndex) => {
                        if (task.completed_on !== null) {
                            this.setupModel.weeks[weekIndex].days[dayIndex].tasks[taskIndex].completed = true;
                            //this.storageModel.achievement.taskIndex = taskIndex;
                        }
                    })
                })
            })
        }

        setAvatar(avatarIndex: number): void {
            this.storageModel.achievement.avatar = avatarIndex;
        }

        getUsername(): string {
            return this.storageModel.username;
        }

        setUsername(username: string): void {
            this.storageModel.username = username;
        }

        getResizableDivSize() {
            return this.resizableDivSize;
        }
        setResizableDivSize(newSize: any): void {
            this.resizableDivSize = newSize;
        }

        getLanguage(){
            return this.currentLanguage;
        };
        setLanguage(type){
            this.currentLanguage = type;
        };


        // Books

        getBookList(successCallback, errorCallback) {
            let booklistKey = 'books';
            if (typeof this.setupModel === 'undefined') {
                this.requestSetupModel(function(data) {
                    successCallback(data[booklistKey]);
                })
            } else {
                successCallback(this.setupModel[booklistKey]);
            }
        }

        getBook(): Book {
            return this.setupModel.books[this.setupModel.weeks[this.selectedWeekIndex].book_index];
        }

        // Tasks

        getWeeks() {
            let weeksKey = 'weeks';
            return this.setupModel[weeksKey];
        }

        getWeek(): number {
            return this.selectedWeekIndex;
        }

        getDay(): number {
            return this.selectedDayIndex;
        }

        getTaskIndex(): number {
            return this.selectedTaskIndex;
        }
        getTasks(): Task[] {
            return this.setupModel.weeks[this.selectedWeekIndex].days[this.selectedDayIndex]
                .tasks;
        }
        getTask(): Task {
            return this.setupModel.weeks[this.selectedWeekIndex].days[this.selectedDayIndex]
                .tasks[this.selectedTaskIndex];
        }
        getWord(): string {
            let wordKey = 'word_en';
            return this.setupModel.weeks[this.selectedWeekIndex][wordKey];
        }
        getWordForConsolidationDay(): string {
            let wordKey = 'word_en', dayKey = 'days', tasksKey = 'tasks', structureKey = 'structure', weeksKey = 'weeks', weekKey = 'week';
            var weekIndex = this.setupModel[weeksKey][this.selectedWeekIndex][dayKey][this.selectedDayIndex][tasksKey][this.selectedTaskIndex][structureKey][weekKey];
            return this.setupModel.weeks[weekIndex][wordKey];
        }

        getAchievement(): Achievement {
            return this.storageModel.achievement;
        }

        setWeek(weekIndex) {
            this.selectedWeekIndex = weekIndex;
            this.selectedBookIndex = this.setupModel.weeks[weekIndex].book_index;
        }

        setDay(dateIndex) {
            this.selectedDayIndex = dateIndex;
        }

        startBook() {
            this.storageModel.addBookUsage(this.selectedWeekIndex, new Date(), 0, '');
            this.status.unsynced_data = true;
            if (this.setupModel.books[this.selectedBookIndex].record_audio) {
                this.startTrackingRecording('book');
            }
        }

        setTask(taskIndex) {
            this.activateTaskStartCallback = null;
            this.activateTaskEndCallback = null;
            this.selectedTaskIndex = taskIndex;
            this.storageModel.addTaskUsage(this.selectedWeekIndex, this.selectedDayIndex, this.selectedTaskIndex, new Date(), 0, '');
            this.status.unsynced_data = true;
            if (this.setupModel.weeks[this.selectedWeekIndex].days[this.selectedDayIndex].tasks[this.selectedTaskIndex].record_audio) {
                this.startTrackingRecording('task');
            }
        }

        getBookReadToday(): boolean {
            return this.storageModel.weeks[this.selectedWeekIndex].days[this.selectedDayIndex].book_read;
        }

        setBookReadToday(): void {
            this.storageModel.weeks[this.selectedWeekIndex].days[this.selectedDayIndex].book_read = true;
        }

        // Do not set record_audio for Day 3 Task 5 or 6, as those tasks record the child's voice instead
        completeCurrentUsageRecord(type: string): void {
            var currentUsage;

            // Complete recording if running
            if (type === 'task') {
                currentUsage = this.storageModel.weeks[this.selectedWeekIndex].days[this.selectedDayIndex].tasks[this.selectedTaskIndex].currentUsage;
                if (currentUsage !== null) {
                    var startedOn:Moment = moment(currentUsage.accessed);
                    var finishedOn:Moment = moment();
                    currentUsage.duration = moment.duration(finishedOn.diff(startedOn)).asSeconds();
                    if (this.setupModel.weeks[this.selectedWeekIndex].days[this.selectedDayIndex].tasks[this.selectedTaskIndex].record_audio) {
                        this.cordovaService.stopTrackingRecording(currentUsage.audio_file);
                    }
                    this.storageModel.weeks[this.selectedWeekIndex].days[this.selectedDayIndex].tasks[this.selectedTaskIndex].currentUsage = null;
                }
            } else if (type === 'book') {
                currentUsage = this.storageModel.weeks[this.selectedWeekIndex].book.currentUsage;
                if (currentUsage !== null) {
                    var startedOn:Moment = moment(currentUsage.accessed);
                    var finishedOn:Moment = moment();
                    currentUsage.duration = moment.duration(finishedOn.diff(startedOn)).asSeconds();
                    if (this.setupModel.books[this.selectedBookIndex].record_audio) {
                        this.cordovaService.stopTrackingRecording(currentUsage.audio_file);
                    }
                    this.storageModel.weeks[this.selectedWeekIndex].book.currentUsage = null;
                }
            }
        }

        completeSelectedBook(): void {
            var book = this.selectedBookIndex, week = this.selectedWeekIndex;
            this.setBookReadToday();

            // save state to Setup and Storage
            if (typeof this.setupModel.books[book] !== 'undefined' && !this.setupModel.books[book].completed) {
                this.setupModel.markBookAsCompleted(week);
                this.storageModel.markBookAsCompleted(week);
            }

            // Complete the outstanding usage record
            this.completeCurrentUsageRecord('book');
        }

        completeSelectedTask(): void {
            var week = this.selectedWeekIndex, day = this.selectedDayIndex, task = this.selectedTaskIndex;

            // save state to Setup and Storage
            this.setupModel.markTaskAsCompleted(week, day, task);
            this.storageModel.markTaskAsCompleted(week, day, task);
            this.storageModel.achievement.completeTask(week, day, task);
        }

        completeSelectedDay(): void {
            var week = this.selectedWeekIndex, day = this.selectedDayIndex;

            if (this.setupModel.weeks[this.selectedWeekIndex].book_index !== -1) {
                this.setupModel.markBookAsCompleted(week);
                this.storageModel.markBookAsCompleted(week);
            }
            this.setupModel.markDayAsCompleted(week, day);
            this.storageModel.markDayAsCompleted(week, day);
            this.storageModel.achievement.completeDay(week, day);

            if (day === 2) {
                this.completeSelectedWeek();
            }
        }

        completeSelectedWeek(): void {
            this.setupModel.markWeekAsCompleted(this.selectedWeekIndex);
            this.storageModel.markWeekAsCompleted(this.selectedWeekIndex);
            this.storageModel.achievement.completeWeek(this.selectedWeekIndex);
        }

        /*
        getUUID(): string {
            return this.cordovaService.getUUID();
        }
        */

        getCommon(): Common {
            let commonKey = 'common';
            return this.setupModel[commonKey];
        }

        removeStorage(): void {
            this.cordovaService.clearStorage();
        }

        /*
        getVideoMedia(source): Media {
            return this.cordovaService.getVideoFile(source);
        }
        */

        // Audio recording for tracking purposes
        // Do not set record_audio for Day 3 Task 5 or 6, as those tasks record the child's voice instead
        startTrackingRecording(type: string): void {
            if (this.desktopBrowserTesting) {
                return;
            }
            var currentUsage;

            // Check disk space first
            if (this.status.disk_space < 100 ) {  // Mb
                return;
            }  else if (type === 'task') {
                currentUsage = this.storageModel.weeks[this.selectedWeekIndex].days[this.selectedDayIndex].tasks[this.selectedTaskIndex].currentUsage;
                var d = currentUsage.accessed;
                currentUsage.audio_file = 'w' + (this.selectedWeekIndex+1) + '_d' + (this.selectedDayIndex+1) +
                    '_t' + (this.selectedTaskIndex+1) + '-' + d.getFullYear() + '_' + (d.getMonth() + 1) + '_' + d.getDate() +
                    '-' + d.getHours() + '_' + d.getMinutes() + '_' + d.getSeconds() + '.m4a';
            } else if (type === 'book') {
                currentUsage = this.storageModel.weeks[this.selectedWeekIndex].book.currentUsage;
                var d = currentUsage.accessed;
                currentUsage.audio_file = 'w' + (this.selectedWeekIndex+1) + '_b' + (this.selectedBookIndex+1) +
                    '-' + d.getFullYear() + '_' + (d.getMonth() + 1) + '_' + d.getDate() +
                    '-' + d.getHours() + '_' + d.getMinutes() + '_' + d.getSeconds() + '.m4a';
            }
            this.cordovaService.startTrackingRecording(currentUsage.audio_file);
        }

        getTaskUsage(): UsageStorage[] {
            return this.storageModel.weeks[this.selectedWeekIndex].days[this.selectedDayIndex]
                .tasks[this.selectedTaskIndex].usage;
        }

        postUsageData(): void {
            this.status.posting_data = true;
            var postData = this.storageModel.asPostableUsageData();

            var postRemainingData = () => {
                if (postData.length > 0) {
                    this.nettsckjemaService.postTrackingDataItem(postData.pop(), (data) => {
                        console.log('Successful Nettskjema submission: ' + data);
                        postRemainingData();
                    }, (data) => {
                        console.log('Error during Nettskjema submission: ' + data);
                    });
                } else {
                    this.status.posting_data = false;
                    this.status.unsynced_data = false;
                }
            };
            postRemainingData();
        }

        setupAudioIntroduction(url: string): void {
            if (typeof this.introductionAudio !== 'undefined') {
                this.introductionAudio.pause();
            }
            this.$timeout(() => {
                this.introductionAudio = new Audio(url);
                this.introductionAudio.load();
                this.introductionAudio.addEventListener('ended', () => {
                    this.disableInteractionCallback(false, true);
                    if (this.activateTaskEndCallback !== null) {
                        this.activateTaskEndCallback();
                    }
                })
            }, 0);
        }

        playAudioIntroduction(delay: number): void {
            if (this.desktopBrowserTesting) {
                delay = 10;
            }
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
                    console.log('No introduction audio source found');
                    this.disableInteractionCallback(false, true);
                    if (this.activateTaskEndCallback !== null) {
                        this.activateTaskEndCallback();
                    }
                }
            }, delay);
        }

        deleteOldRecordings(): void {
            var mediaFiles = [];
            var weekTotal = this.setupModel.weeks.length;
            var w = 0;
            while(w < weekTotal) {
                // Each week has thre 'user made' recordings - two audio and one video
                mediaFiles.push('week' + (w+1) + '-task6-' + this.constants.constants['FORMAL_TEST_NAME'] + '-audio.m4a');
                mediaFiles.push('week' + (w+1) + '-task5-' + this.constants.constants['FORMAL_TEST_NAME'] + '-audio.m4a');
                mediaFiles.push('week' + w + '-' + this.constants.constants['FORMAL_TEST_NAME'] + '-video.MOV');
            }
            this.cordovaService.deleteOldAudioFiles(mediaFiles, this.storageModel.getTrackingFileList(), this.constants.constants['RECORDING_LIFESPAN']);
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

        shuffleArray(array: Array<any>) {
            var newArray = angular.copy(array);
            var currentIndex = newArray.length, temporaryValue, randomIndex;

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

        captureVideo(sFunc, eFunc) {
            var filename = 'week' + this.selectedWeekIndex + '-' + this.settings.storage_mode + '-video.MOV';
            this.cordovaService.captureVideo(sFunc, eFunc, filename);
        }

        // Day 3 task 5 & 6 audio recording of the child's voice
        startCaptureAudio() {
            var taskFilename = 'week' + (this.selectedWeekIndex+1) + '-task' + (this.selectedTaskIndex+1) + '-' + this.settings.storage_mode + '-audio.m4a';
            this.cordovaService.startCaptureAudio(taskFilename, () => {
                console.log('Begin recording voice..');
            }, (error) => {
                console.log('Error recording voice..' + error);
            })
        }

        // For Day 3 Task 5 & 6 a new recording always overwrites previous for this week, but one audio for each UsageStorage is copied.
        stopCaptureAudio(sFunc, eFunc) {
            var currentUsage = this.storageModel.weeks[this.selectedWeekIndex].days[this.selectedDayIndex].tasks[this.selectedTaskIndex].currentUsage;
            var d = currentUsage.accessed;
            var newTrackingAudioFilename = 'w' + (this.selectedWeekIndex+1) + '_d' + (this.selectedDayIndex+1) +
                '_t' + (this.selectedTaskIndex+1) + '-' + d.getFullYear() + '_' + (d.getMonth() + 1) + '_' + d.getDate() +
                '-' + d.getHours() + '_' + d.getMinutes() + '_' + d.getSeconds() + '.m4a';
            var taskFilename = 'week' + (this.selectedWeekIndex+1) + '-task' + (this.selectedTaskIndex+1) + '-' + this.settings.storage_mode + '-audio.m4a';
            this.cordovaService.stopCaptureAudio(taskFilename, currentUsage, newTrackingAudioFilename, (success) => {
                console.log('Finished recording voice..');
                sFunc(success);
            }, (error) => {
                eFunc(error);
            })
        }

        checkFile(filename, sFunc, eFunc) {
            if (this.desktopBrowserTesting) {
                eFunc('');
            } else {
                this.cordovaService.checkFile(filename, sFunc, eFunc);
            }
        }

        getAppVersion(callback): void {
            this.cordovaService.getAppVersion(callback);
        }

    }

}
