/// <reference path="../typings/index.d.ts"/> 

/// <reference path="_references.ts"/>
var MorfologiApp;
(function (MorfologiApp) {
    'use strict';
    /**
     * Application-wide overall configuration
     * @param $stateProvider  Used for ionic internal routing.g /reward
     * @param $urlRouterProvider  Used for defining default route.
     * @param $httpProvider  Used for registering an interceptor (TokenInterceptor).
     */
    function configApp($stateProvider, $urlRouterProvider, $httpProvider, $controllerProvider, $sceDelegateProvider, $translateProvider) {
        //define routing
        $stateProvider
            .state('main', {
            name: 'main',
            url: '/main',
            templateUrl: './js/views/mainpanel/mainpanel.html'
        })
            .state('tasks', {
            name: 'test',
            url: '/test',
            templateUrl: './js/views/testpanel/testpanel.html'
        });
        $urlRouterProvider.otherwise('/main');
        $httpProvider.defaults.withCredentials = true;
        $sceDelegateProvider.resourceUrlWhitelist([
            'self',
            'https://nettskjema.uio.no/**',
            'cdvfile://localhost/documents/**',
            'file:///var/**'
        ]);
        // Translation
        $translateProvider.useSanitizeValueStrategy('escaped');
        $translateProvider.useStaticFilesLoader({
            prefix: './languages/',
            suffix: '.json'
        });
        var lang = null;
        if (navigator['languages']) {
            lang = navigator['languages'][0];
        }
        else {
            lang = navigator.language || navigator.userLanguage;
        }
        if (lang.indexOf('nn') > -1 || lang.indexOf('nb') > -1) {
            $translateProvider.preferredLanguage('nb');
            sessionStorage['lang'] = 'nb';
        }
        else {
            $translateProvider.preferredLanguage('en');
            sessionStorage['lang'] = 'en';
        }
        // Force to norwegian - remove if using multiple languages
        $translateProvider.preferredLanguage('nb');
    }
    MorfologiApp.configApp = configApp;
    configApp.$inject = ["$stateProvider", "$urlRouterProvider", "$httpProvider",
        "$controllerProvider", "$sceDelegateProvider", "$translateProvider"];
})(MorfologiApp || (MorfologiApp = {}));

/// <reference path='_references.ts'/>
var MorfologiApp;
(function (MorfologiApp) {
    'use strict';
    var MorfologiConstants = (function () {
        function MorfologiConstants() {
        }
        Object.defineProperty(MorfologiConstants, "constants", {
            get: function () {
                // Release number should be updated accordingly on new app releases  e.g.  isp_setup_r1.json, isp_storage_r1_sample.json
                return {
                    SETUP_FILE_PATH: "content/",
                    SETUP_FILE_NAME: "isp_setup_",
                    STORAGE_FILE_NAME: "isp_storage",
                    RELEASE_NUMBER: "r1",
                    SKIP_DAY_PASSWORD: "frosk",
                    FORMAL_TEST_DATE: new Date('September 18, 2016 23:59:59'),
                    SAMPLE_TEST_NAME: 'sample',
                    FORMAL_TEST_NAME: 'formal',
                    RECORDING_LIFESPAN: 2592000000,
                    SHOW_CHEATS: true
                };
            },
            enumerable: true,
            configurable: true
        });
        ;
        return MorfologiConstants;
    }());
    MorfologiApp.MorfologiConstants = MorfologiConstants;
})(MorfologiApp || (MorfologiApp = {}));

/// <reference path="_references.ts"/>
var MorfologiApp;
(function (MorfologiApp) {
    'use strict';
    /**
     * Application-wide overall run function
     * @param $window  Used for configuring cordova plugins options.
     * @param $location  Re-route if storage is reloaded
     * @param $state  Used to reload the state
     * @param dataService Call to storage loading check
     */
    function runApp($window, $location) {
    }
    MorfologiApp.runApp = runApp;
    runApp.$inject = ["$window", "$location", 'DataService'];
})(MorfologiApp || (MorfologiApp = {}));

/// <reference path="../_references.ts"/>
var MorfologiApp;
(function (MorfologiApp) {
    "use strict";
    var Audio = (function () {
        function Audio() {
        }
        Audio.prototype.deserialise = function (input) {
            for (var key in input) {
                if (input.hasOwnProperty(key)) {
                    this[key] = input[key];
                }
            }
            return this;
        };
        Audio.prototype.getKey = function (key) {
            if (this.hasOwnProperty(key)) {
                return this[key];
            }
        };
        return Audio;
    }());
    var Video = (function () {
        function Video() {
        }
        Video.prototype.deserialise = function (input) {
            for (var key in input) {
                if (input.hasOwnProperty(key)) {
                    this[key] = input[key];
                }
            }
            return this;
        };
        Video.prototype.getKey = function (key) {
            if (this.hasOwnProperty(key)) {
                return this[key];
            }
        };
        return Video;
    }());
    var Image = (function () {
        function Image() {
        }
        Image.prototype.deserialise = function (input) {
            for (var key in input) {
                if (input.hasOwnProperty(key)) {
                    this[key] = input[key];
                }
            }
            return this;
        };
        Image.prototype.getKey = function (key) {
            if (this.hasOwnProperty(key)) {
                return this[key];
            }
        };
        return Image;
    }());
    var Common = (function () {
        function Common() {
            this.audio = new Audio();
            this.video = new Video();
            this.image = new Image();
        }
        return Common;
    }());
    MorfologiApp.Common = Common;
    var Reward = (function () {
        function Reward(week, day, type) {
            this.type = type;
            this.dayIndex = day;
            this.weekIndex = week;
            this.width = 50;
            this.height = 50;
        }
        return Reward;
    }());
    MorfologiApp.Reward = Reward;
    var Achievement = (function () {
        // e.g. found in the form /common/images/rewards/week-<weekIndex>/<dayIndex>.gif
        function Achievement() {
            this.avatar = -1;
            this.weekIndex = -1;
            this.dayIndex = -1;
            this.taskIndex = -1;
            this.rewards = [];
        }
        //  Old completion functions
        /*
                completeCurrentWeek() {
                    this.weekIndex++;
                    this.dayIndex = this.taskIndex = -1;
                }
        
                completeCurrentDay() {
                    if (this.dayIndex < 2) {
                        this.dayIndex++;
                    } else {
                        this.dayIndex = -1;
                    }
                    this.taskIndex = -1;
                }
        
                completeCurrentTask() {
                    this.taskIndex++;
                    if (this.taskIndex > 6) {
                        this.taskIndex = -1;
                    }
                }
        */
        Achievement.prototype.hasCollectedReward = function (week, day) {
            for (var r = 0; r < this.rewards.length; r++) {
                if (this.rewards[r].weekIndex === week && this.rewards[r].dayIndex === day) {
                    return true;
                }
            }
            return false;
        };
        Achievement.prototype.completeTask = function (weekIndex, dayIndex, taskIndex) {
            if (weekIndex > this.weekIndex && dayIndex > this.dayIndex && taskIndex > this.taskIndex) {
                this.taskIndex = taskIndex;
            }
        };
        Achievement.prototype.completeDay = function (weekIndex, dayIndex) {
            if (weekIndex > this.weekIndex && dayIndex > this.dayIndex) {
                this.dayIndex = dayIndex;
                this.taskIndex = -1;
            }
        };
        Achievement.prototype.completeWeek = function (weekIndex) {
            if (weekIndex > this.weekIndex) {
                this.weekIndex = weekIndex;
                this.dayIndex = this.taskIndex = -1;
            }
        };
        return Achievement;
    }());
    MorfologiApp.Achievement = Achievement;
    var Overlay = (function () {
        function Overlay() {
            this.id = -1;
            this.type = 'png';
            this.sequence = -1;
            this.start = { x: 0, y: 0, w: 0, h: 0 };
            this.transition = { x: 0, y: 0, scale: 1, duration: 1 };
            this.map = { x: 0, y: 0, w: 0, h: 0 };
            this.pointer = { x: 0, y: 0, retain: true };
            this.opacity = 1;
            this.visible_before = false;
            this.visible_after = false;
            this.auto_start = false;
            this.auto_return = false;
            this.allow_return = true;
            this.timeout = 0;
            this.delay = 0;
            this.active = false;
            this.completed = false;
        }
        Overlay.prototype.setItem = function (key, value) {
            if (this.hasOwnProperty(key) && typeof value !== 'undefined') {
                this[key] = value;
            }
        };
        return Overlay;
    }());
    MorfologiApp.Overlay = Overlay;
    var Overlays = (function () {
        function Overlays() {
            this.display_delay = 0;
            this.zoomable_images = [];
            this.appearing_images = [];
            this.playable_audio = [];
            this.focus_images = [];
        }
        return Overlays;
    }());
    MorfologiApp.Overlays = Overlays;
    var Book = (function () {
        function Book() {
            this.reference = '';
            this.label_en = '';
            this.thumbnail = -1;
            this.record_audio = false;
            this.backgrounds = [];
            this.completed = false;
            this.overlays = {};
        }
        Book.prototype.setItem = function (key, value) {
            if (this.hasOwnProperty(key) && typeof value !== 'undefined') {
                this[key] = value;
            }
        };
        return Book;
    }());
    MorfologiApp.Book = Book;
    var Task = (function () {
        function Task() {
            this.type = '100';
            this.record_audio = false;
            this.completed = false;
            this.play_introduction = true;
        }
        return Task;
    }());
    MorfologiApp.Task = Task;
    var Day = (function () {
        function Day() {
            this.completed = false;
            this.tasks = [];
        }
        return Day;
    }());
    var Week = (function () {
        function Week() {
            this.completed = false;
            this.days = [];
        }
        return Week;
    }());
    MorfologiApp.Week = Week;
    var Setup = (function () {
        function Setup() {
            this.books = [];
            this.weeks = [];
        }
        Setup.prototype.deserialise = function (input) {
            var commonKey = 'common', imageKey = 'image', audioKey = 'audio', videoKey = 'video';
            var booksKey = 'books', referenceKey = 'reference', backgroundKey = 'backgrounds', overlaysKey = 'overlays';
            var labelEnKey = 'label_en', labelNoKey = 'label_no', thumbnailKey = 'thumbnail', revisionKey = 'revision';
            var idKey = 'id', sequenceKey = 'sequence', descriptionKey = 'description', delayKey = 'delay';
            var startKey = 'start', transitionKey = 'transition', xKey = 'x', yKey = 'y', wKey = 'w', hKey = 'h';
            var opacityKey = 'opacity', visibleBeforeKey = 'visible_before', visibleAfterKey = 'visible_after';
            var autoReturnKey = 'auto_return', typeKey = 'type', timeoutKey = 'timeout', autoStartKey = 'auto_start';
            var allowReturnKey = 'allow_return', scaleKey = 'scale', durationKey = 'duration', mapKey = 'map';
            var weeksKey = 'weeks', wordEnKey = 'word_en', wordNoKey = 'word_no', bookIndexKey = 'book_index';
            var daysKey = 'days', tasksKey = 'tasks', recordAudioKey = 'record_audio', focusKey = 'focus';
            var playIntroKey = 'play_introduction', activeKey = 'active', structureKey = 'structure';
            var pointerKey = 'pointer', retainKey = 'retain', displayDelayKey = 'display_delay';
            this.common = new Common();
            this.common.image.deserialise(input[commonKey][imageKey]);
            this.common.audio.deserialise(input[commonKey][audioKey]);
            this.common.video.deserialise(input[commonKey][videoKey]);
            this.common.revision = input[commonKey][revisionKey];
            for (var b = 0; b < input[booksKey].length; b++) {
                var book = new Book();
                book.setItem(referenceKey, input[booksKey][b][referenceKey]);
                book.setItem(labelEnKey, input[booksKey][b][labelEnKey]);
                book.setItem(labelNoKey, input[booksKey][b][labelNoKey]);
                book.setItem(thumbnailKey, input[booksKey][b][thumbnailKey]);
                book.setItem(recordAudioKey, input[booksKey][b][recordAudioKey]);
                book.setItem(backgroundKey, input[booksKey][b][backgroundKey]);
                for (var o in input[booksKey][b][overlaysKey]) {
                    if (input[booksKey][b][overlaysKey].hasOwnProperty(o)) {
                        var newOverlays = new Overlays();
                        for (var oType in input[booksKey][b][overlaysKey][o]) {
                            if (input[booksKey][b][overlaysKey][o].hasOwnProperty(oType) && newOverlays.hasOwnProperty(oType)) {
                                if (oType === displayDelayKey) {
                                    newOverlays[displayDelayKey] = input[booksKey][b][overlaysKey][o][oType];
                                }
                                else {
                                    for (var oi = 0; oi < input[booksKey][b][overlaysKey][o][oType].length; oi++) {
                                        var inputRef = input[booksKey][b][overlaysKey][o][oType][oi];
                                        var overlay_item = new Overlay();
                                        overlay_item.setItem(idKey, inputRef[idKey]);
                                        overlay_item.setItem(typeKey, inputRef[typeKey]);
                                        overlay_item.setItem(sequenceKey, inputRef[sequenceKey]);
                                        overlay_item.setItem(descriptionKey, inputRef[descriptionKey]);
                                        if (typeof inputRef[startKey] !== 'undefined') {
                                            overlay_item.setItem(startKey, {
                                                x: inputRef[startKey][xKey],
                                                y: inputRef[startKey][yKey],
                                                w: inputRef[startKey][wKey],
                                                h: inputRef[startKey][hKey]
                                            });
                                        }
                                        if (typeof inputRef[transitionKey] !== 'undefined') {
                                            overlay_item.setItem(transitionKey, {
                                                x: inputRef[transitionKey][xKey],
                                                y: inputRef[transitionKey][yKey],
                                                scale: inputRef[transitionKey][scaleKey],
                                                duration: inputRef[transitionKey][durationKey]
                                            });
                                        }
                                        if (typeof inputRef[mapKey] !== 'undefined') {
                                            overlay_item.setItem(mapKey, {
                                                x: inputRef[mapKey][xKey],
                                                y: inputRef[mapKey][yKey],
                                                w: inputRef[mapKey][wKey],
                                                h: inputRef[mapKey][hKey]
                                            });
                                        }
                                        if (typeof inputRef[pointerKey] !== 'undefined') {
                                            overlay_item.setItem(pointerKey, {
                                                x: inputRef[pointerKey][xKey],
                                                y: inputRef[pointerKey][yKey],
                                                retain: inputRef[pointerKey][retainKey]
                                            });
                                        }
                                        overlay_item.setItem(opacityKey, inputRef[opacityKey]);
                                        overlay_item.setItem(visibleBeforeKey, inputRef[visibleBeforeKey]);
                                        overlay_item.setItem(visibleAfterKey, inputRef[visibleAfterKey]);
                                        overlay_item.setItem(autoReturnKey, inputRef[autoReturnKey]);
                                        overlay_item.setItem(autoStartKey, inputRef[autoStartKey]);
                                        overlay_item.setItem(allowReturnKey, inputRef[allowReturnKey]);
                                        overlay_item.setItem(delayKey, inputRef[delayKey]);
                                        overlay_item.setItem(timeoutKey, inputRef[timeoutKey]);
                                        // 'active' and 'completed' attribute are for internal use only
                                        newOverlays[oType].push(overlay_item);
                                    }
                                }
                            }
                        }
                        book[overlaysKey][o] = newOverlays;
                    }
                }
                this.books.push(book);
            }
            for (var w = 0; w < input[weeksKey].length; w++) {
                var week = new Week();
                week[wordEnKey] = input[weeksKey][w][wordEnKey];
                week[wordNoKey] = input[weeksKey][w][wordNoKey];
                week[bookIndexKey] = input[weeksKey][w][bookIndexKey];
                for (var d = 0; d < input[weeksKey][w][daysKey].length; d++) {
                    var day = new Day();
                    for (var t = 0; t < input[weeksKey][w][daysKey][d][tasksKey].length; t++) {
                        var task = new Task();
                        task[typeKey] = input[weeksKey][w][daysKey][d][tasksKey][t][typeKey];
                        task[recordAudioKey] = input[weeksKey][w][daysKey][d][tasksKey][t][recordAudioKey];
                        task[playIntroKey] = input[weeksKey][w][daysKey][d][tasksKey][t][playIntroKey];
                        // Defines a task specific structure for the layout, 'Image Focus' and file names / types etc.
                        if (typeof input[weeksKey][w][daysKey][d][tasksKey][t][structureKey] !== 'undefined') {
                            task[structureKey] = input[weeksKey][w][daysKey][d][tasksKey][t][structureKey];
                        }
                        day[tasksKey].push(task);
                    }
                    week[daysKey].push(day);
                }
                this.weeks.push(week);
            }
            return this;
        };
        /**
         * Mark the specified Task as complete
         *
         * @param w
         * @param d
         * @param t
         */
        Setup.prototype.markTaskAsCompleted = function (w, d, t) {
            this.weeks[w].days[d].tasks[t].completed = true;
        };
        /**
         * Mark the specified Day as complete
         *
         * @param w
         * @param d
         */
        Setup.prototype.markDayAsCompleted = function (w, d) {
            this.weeks[w].days[d].completed = true;
        };
        /**
         * Mark the specified Week as complete
         *
         * @param w
         */
        Setup.prototype.markWeekAsCompleted = function (w) {
            this.weeks[w].completed = true;
        };
        /**
         * Mark the specified Book as complete
         *
         * @param book_index
         */
        Setup.prototype.markBookAsCompleted = function (week) {
            // Not all weeks have books
            if (this.weeks[week].book_index !== -1) {
                this.books[this.weeks[week].book_index].completed = true;
            }
        };
        return Setup;
    }());
    MorfologiApp.Setup = Setup;
    var UsagePostData = (function () {
        function UsagePostData(user, week_index, word_en, word_no, day_index, task_index, book_reference, completed_on, skipped, accessed, duration, audio_file, usage_record) {
            this.user = user;
            this.word_en = word_en;
            this.word_no = word_no;
            this.week = week_index;
            this.day = day_index;
            this.task = task_index;
            this.book = book_reference;
            this.completed_on = completed_on;
            this.day_skipped = skipped;
            this.accessed = accessed;
            this.duration = duration;
            this.audio_file = audio_file;
            this.usage_record = usage_record;
        }
        UsagePostData.prototype.asFormDataWithAttachment = function (file, UUID) {
            var fd = new FormData();
            fd.append('answersAsMap[557095].textAnswer', this.user);
            fd.append('answersAsMap[558089].textAnswer', this.week);
            fd.append('answersAsMap[558090].textAnswer', this.word_en);
            fd.append('answersAsMap[558093].textAnswer', this.word_no);
            fd.append('answersAsMap[558091].textAnswer', this.day);
            fd.append('answersAsMap[558092].textAnswer', this.task);
            fd.append('answersAsMap[559630].textAnswer', this.book);
            if (this.completed_on !== null) {
                fd.append('answersAsMap[560777].textAnswer', this.asNettskjemaDateFormat(this.completed_on));
            }
            else {
                fd.append('answersAsMap[560777].textAnswer', '');
            }
            fd.append('answersAsMap[559416].textAnswer', this.day_skipped);
            fd.append('answersAsMap[557046].textAnswer', this.asNettskjemaDateFormat(this.accessed));
            fd.append('answersAsMap[557047].textAnswer', this.duration);
            if (file !== null) {
                var blob = new Blob([file], { type: "audio/x-m4a" });
                fd.append('answersAsMap[559418].attachment.upload', blob, this.audio_file);
            }
            fd.append('answersAsMap[576155].textAnswer', UUID);
            return fd;
        };
        UsagePostData.prototype.markAsSynced = function () {
            this.usage_record.synced = true;
        };
        UsagePostData.prototype.asNettskjemaDateFormat = function (d) {
            return d.getDate() + '.' + (d.getMonth() + 1) + '.' + d.getFullYear() + ' ' +
                d.getHours() + ':' + d.getMinutes();
        };
        return UsagePostData;
    }());
    MorfologiApp.UsagePostData = UsagePostData;
    var UsageStorage = (function () {
        function UsageStorage() {
            this.duration = 0;
            this.synced = false;
            this.audio_file = '';
        }
        UsageStorage.prototype.deserialise = function (input) {
            var accessedKey = 'accessed', durationKey = 'duration', syncedKey = 'synced', audioKey = 'audio_file';
            this.accessed = new Date(input[accessedKey]);
            this.duration = input[durationKey];
            this.audio_file = input[audioKey];
            this.synced = input[syncedKey];
            return this;
        };
        return UsageStorage;
    }());
    MorfologiApp.UsageStorage = UsageStorage;
    var BookStorage = (function () {
        function BookStorage() {
            this.completed_on = null;
            this.usage = [];
            this.currentUsage = null;
        }
        BookStorage.prototype.setItem = function (key, value) {
            if (this.hasOwnProperty(key) && typeof value !== 'undefined' && value !== null) {
                this[key] = value;
            }
        };
        return BookStorage;
    }());
    var TaskStorage = (function () {
        function TaskStorage() {
            this.completed_on = null;
            this.usage = [];
            this.currentUsage = null;
        }
        TaskStorage.prototype.setItem = function (key, value) {
            if (this.hasOwnProperty(key) && typeof value !== 'undefined' && value !== null) {
                this[key] = value;
            }
        };
        return TaskStorage;
    }());
    var DayStorage = (function () {
        function DayStorage() {
            this.completed_on = null;
            this.skipped = false;
            this.tasks = [];
            this.book_read = false;
        }
        DayStorage.prototype.setItem = function (key, value) {
            if (this.hasOwnProperty(key) && typeof value !== 'undefined' && value !== null) {
                this[key] = value;
            }
        };
        return DayStorage;
    }());
    var WeekStorage = (function () {
        function WeekStorage() {
            this.completed_on = null;
            this.days = [];
        }
        WeekStorage.prototype.setItem = function (key, value) {
            if (this.hasOwnProperty(key) && typeof value !== 'undefined' && value !== null) {
                this[key] = value;
            }
        };
        return WeekStorage;
    }());
    MorfologiApp.WeekStorage = WeekStorage;
    var Storage = (function () {
        function Storage() {
            this.weeks = [];
            this.achievement = new Achievement();
        }
        /**
         * Create tracking objects to match the current Setup
         *
         * @param setup
         * @param username
         */
        Storage.prototype.initialise = function (setup, username) {
            var _this = this;
            var commonKey = 'common', revisionKey = 'revision';
            var weeksKey = 'weeks', wordEnKey = 'word_en', wordNoKey = 'word_no', bookKey = 'book', booksKey = 'books';
            var daysKey = 'days', tasksKey = 'tasks', bookIndexKey = 'book_index', referenceKey = 'reference';
            this.username = username;
            this.revision = setup[commonKey][revisionKey];
            setup[weeksKey].forEach(function (w) {
                var newWeek = new WeekStorage();
                newWeek[wordEnKey] = w[wordEnKey];
                newWeek[wordNoKey] = w[wordNoKey];
                var bookIndex = w[bookIndexKey];
                newWeek[bookKey] = new BookStorage();
                if (bookIndex !== -1) {
                    newWeek[bookKey][referenceKey] = setup[booksKey][bookIndex][referenceKey];
                }
                else {
                    newWeek[bookKey][referenceKey] = 'consolidation';
                }
                w[daysKey].forEach(function (d) {
                    var newDay = new DayStorage();
                    d[tasksKey].forEach(function (t) {
                        var newTask = new TaskStorage();
                        newDay[tasksKey].push(newTask);
                    });
                    newWeek[daysKey].push(newDay);
                });
                _this.weeks.push(newWeek);
            });
            return this;
        };
        Storage.prototype.deserialise = function (input) {
            var usageKey = 'usage', usernameKey = 'username', completedOnKey = 'completed_on', revisionKey = 'revision';
            var achievementKey = 'achievement', avatarKey = 'avatar', taskIndexKey = 'taskIndex', dayIndexKey = 'dayIndex', weekIndexKey = 'weekIndex';
            var weeksKey = 'weeks', wordEnKey = 'word_en', wordNoKey = 'word_no', bookKey = 'book', labelKey = 'label_en';
            var daysKey = 'days', tasksKey = 'tasks', referenceKey = 'reference', bookReadKey = 'book_read';
            var rewardsKey = 'rewards', rewardIdKey = 'id', rewardTypeKey = 'type', rewardXKey = 'xpos', rewardYKey = 'ypos';
            this.username = input[usernameKey];
            this.revision = input[revisionKey];
            this.achievement = new Achievement();
            this.achievement[avatarKey] = input[achievementKey][avatarKey];
            this.achievement[taskIndexKey] = input[achievementKey][taskIndexKey];
            this.achievement[dayIndexKey] = input[achievementKey][dayIndexKey];
            this.achievement[weekIndexKey] = input[achievementKey][weekIndexKey];
            // Bug fix one time only..
            if (this.achievement[weekIndexKey] === 0 && this.achievement[dayIndexKey] >= 2) {
                this.achievement[dayIndexKey] = 1;
            }
            else if (this.achievement[weekIndexKey] === 1 && this.achievement[dayIndexKey] >= 2) {
                this.achievement[dayIndexKey] = 0;
            }
            //
            for (var r = 0; r < input[achievementKey][rewardsKey].length; r++) {
                var reward = new Reward(input[achievementKey][rewardsKey][r][weekIndexKey], input[achievementKey][rewardsKey][r][dayIndexKey], input[achievementKey][rewardsKey][r][rewardTypeKey]);
                reward[rewardXKey] = input[achievementKey][rewardsKey][r][rewardXKey];
                reward[rewardYKey] = input[achievementKey][rewardsKey][r][rewardYKey];
                this.achievement[rewardsKey].push(reward);
            }
            for (var w = 0; w < input[weeksKey].length; w++) {
                var week = new WeekStorage();
                if (input[weeksKey][w][completedOnKey] !== null) {
                    week[completedOnKey] = new Date(input[weeksKey][w][completedOnKey]);
                }
                week[wordEnKey] = input[weeksKey][w][wordEnKey];
                week[wordNoKey] = input[weeksKey][w][wordNoKey];
                var book = new BookStorage();
                if (input[weeksKey][w][bookKey][completedOnKey] !== null) {
                    book[completedOnKey] = new Date(input[weeksKey][w][bookKey][completedOnKey]);
                }
                for (var bu = 0; bu < input[weeksKey][w][bookKey][usageKey].length; bu++) {
                    book[usageKey].push(new UsageStorage()
                        .deserialise(input[weeksKey][w][bookKey][usageKey][bu]));
                }
                book[referenceKey] = input[weeksKey][w][bookKey][referenceKey];
                week[bookKey] = book;
                for (var d = 0; d < input[weeksKey][w][daysKey].length; d++) {
                    var day = new DayStorage();
                    if (input[weeksKey][w][daysKey][d][completedOnKey] !== null) {
                        day[completedOnKey] = new Date(input[weeksKey][w][daysKey][d][completedOnKey]);
                    }
                    day[bookReadKey] = input[weeksKey][w][daysKey][d][bookReadKey];
                    for (var t = 0; t < input[weeksKey][w][daysKey][d][tasksKey].length; t++) {
                        var task = new TaskStorage();
                        if (input[weeksKey][w][daysKey][d][tasksKey][t][completedOnKey] !== null) {
                            task[completedOnKey] = new Date(input[weeksKey][w][daysKey][d][tasksKey][t][completedOnKey]);
                        }
                        for (var u = 0; u < input[weeksKey][w][daysKey][d][tasksKey][t][usageKey].length; u++) {
                            task[usageKey].push(new UsageStorage()
                                .deserialise(input[weeksKey][w][daysKey][d][tasksKey][t][usageKey][u]));
                        }
                        day[tasksKey].push(task);
                    }
                    week[daysKey].push(day);
                }
                this.weeks.push(week);
            }
            return this;
        };
        /**
         * get a list of all tracking files previously created
         */
        Storage.prototype.getTrackingFileList = function () {
            var list = [];
            this.weeks.forEach(function (week) {
                week.days.forEach(function (day) {
                    day.tasks.forEach(function (task) {
                        task.usage.forEach(function (usage) {
                            if (usage.audio_file !== '') {
                                list.push(usage.audio_file);
                            }
                        });
                    });
                });
            });
            return list;
        };
        /**
         * Flattens the data structure appropriate for posting to Nettskjema
         */
        Storage.prototype.asPostableUsageData = function () {
            var postArray = [];
            for (var w = 0; w < this.weeks.length; w++) {
                // Task usage
                for (var d = 0; d < this.weeks[w].days.length; d++) {
                    for (var t = 0; t < this.weeks[w].days[d].tasks.length; t++) {
                        for (var u = 0; u < this.weeks[w].days[d].tasks[t].usage.length; u++) {
                            if (!this.weeks[w].days[d].tasks[t].usage[u].synced) {
                                postArray.push(new UsagePostData(this.username, w, this.weeks[w].word_en, this.weeks[w].word_no, d, t, '-', this.weeks[w].days[d].tasks[t].completed_on, this.weeks[w].days[d].skipped, this.weeks[w].days[d].tasks[t].usage[u].accessed, this.weeks[w].days[d].tasks[t].usage[u].duration, this.weeks[w].days[d].tasks[t].usage[u].audio_file, this.weeks[w].days[d].tasks[t].usage[u]));
                            }
                        }
                    }
                }
                // Book usage
                for (var bu = 0; bu < this.weeks[w].book.usage.length; bu++) {
                    if (!this.weeks[w].book.usage[bu].synced) {
                        postArray.push(new UsagePostData(this.username, w, this.weeks[w].word_en, this.weeks[w].word_no, -1, -1, this.weeks[w].book.reference, this.weeks[w].book.completed_on, false, this.weeks[w].book.usage[bu].accessed, this.weeks[w].book.usage[bu].duration, this.weeks[w].book.usage[bu].audio_file, this.weeks[w].book.usage[bu]));
                    }
                }
            }
            return postArray;
        };
        /**
         * Add a new Usage to a Task with access datestamp and duration
         *
         * @param w
         * @param d
         * @param t
         * @param accessed
         * @param duration
         * @param audio_file
         */
        Storage.prototype.addTaskUsage = function (w, d, t, accessed, duration, audio_file) {
            var usageStorage = new UsageStorage();
            usageStorage.accessed = accessed;
            usageStorage.duration = duration;
            usageStorage.audio_file = audio_file;
            this.weeks[w].days[d].tasks[t].usage.push(usageStorage);
            this.weeks[w].days[d].tasks[t].currentUsage = usageStorage;
        };
        /**
         * Add a new Usage to a Book with access datestamp and duration
         *
         * @param w
         * @param accessed
         * @param duration
         * @param audio_file
         */
        Storage.prototype.addBookUsage = function (w, accessed, duration, audio_file) {
            var usageStorage = new UsageStorage();
            usageStorage.accessed = accessed;
            usageStorage.duration = duration;
            usageStorage.audio_file = audio_file;
            this.weeks[w].book.usage.push(usageStorage);
            this.weeks[w].book.currentUsage = usageStorage;
        };
        /**
         * Mark the specified TaskStorage as complete
         *
         * @param w
         * @param d
         * @param t
         */
        Storage.prototype.markTaskAsCompleted = function (w, d, t) {
            if (this.weeks[w].days[d].tasks[t].completed_on == null) {
                this.weeks[w].days[d].tasks[t].completed_on = new Date();
            }
        };
        /**
         * Mark the specified Day as complete
         *
         * @param w
         * @param d
         */
        Storage.prototype.markDayAsCompleted = function (w, d) {
            if (this.weeks[w].days[d].completed_on == null) {
                this.weeks[w].days[d].completed_on = new Date();
            }
        };
        /**
         * Mark the specified Week as complete
         *
         * @param w
         */
        Storage.prototype.markWeekAsCompleted = function (w) {
            if (this.weeks[w].completed_on == null) {
                this.weeks[w].completed_on = new Date();
            }
        };
        /**
         * Mark the specified BookStorage as complete
         *
         * @param w
         */
        Storage.prototype.markBookAsCompleted = function (w) {
            if (this.weeks[w].book.completed_on == null) {
                this.weeks[w].book.completed_on = new Date();
            }
        };
        /**
         * Mark the specified day as 'skipped'
         *
         * @param w
         * @param d
         */
        Storage.prototype.markDayAsSkipped = function (w, d) {
            this.weeks[w].days[d].skipped = true;
        };
        /**
         * Mark all of the current set as 'synced' after a successful POST to Nettskjema
         */
        Storage.prototype.markAllAsSynced = function () {
            for (var w = 0; w < this.weeks.length; w++) {
                for (var d = 0; d < this.weeks[w].days.length; d++) {
                    for (var t = 0; t < this.weeks[w].days[d].tasks.length; t++) {
                        for (var u = 0; u < this.weeks[w].days[d].tasks[t].usage.length; u++) {
                            this.weeks[w].days[d].tasks[t].usage[u].synced = true;
                        }
                    }
                }
                for (var bu = 0; bu < this.weeks[w].book.usage.length; bu++) {
                    this.weeks[w].book.usage[bu].synced = true;
                }
            }
        };
        return Storage;
    }());
    MorfologiApp.Storage = Storage;
})(MorfologiApp || (MorfologiApp = {}));

/// <reference path="../_references.ts"/>
/// <reference path="../models/models.ts"/>
var MorfologiApp;
(function (MorfologiApp) {
    var Services;
    (function (Services) {
        "use strict";
        var CordovaService = (function () {
            function CordovaService($window, $timeout) {
                this.$window = $window;
                this.$timeout = $timeout;
                this.recordingAttempts = 0;
                // If using a desktop browser, we will set up storage in memory for testing purposes
                this.desktopBrowserTesting = !$window.cordova;
                this.desktopBrowserStorage = null;
                this.recordingTimer = 0;
                if (!this.desktopBrowserTesting) {
                    this.createTrackingDirectory();
                }
            }
            CordovaService.prototype.getUUID = function () {
                return '';
            };
            CordovaService.prototype.setStorageFilename = function (name) {
            };
            /**
             * Check for the existance of the Storage, if not initialise it and call writeStorage
             *
             * @param setupModel
             * @param username
             * @param sFunc
             * @param eFunc
             */
            CordovaService.prototype.storageExists = function (setupModel, username, sFunc, eFunc) {
            };
            CordovaService.prototype.getStorage = function (sFunc, eFunc) {
            };
            CordovaService.prototype.writeStorage = function (storageModel, sFunc, eFunc, backup) {
            };
            CordovaService.prototype.writeStorageBackup = function (jsonifiedStorage, sFunc, eFunc) {
            };
            CordovaService.prototype.getFreeDiskSpace = function (sFunc, eFunc) {
            };
            CordovaService.prototype.clearStorage = function () {
            };
            CordovaService.prototype.captureVideo = function (sFunc, eFunc, filename) {
            };
            CordovaService.prototype.startTrackingRecording = function (filename) {
            };
            CordovaService.prototype.stopTrackingRecording = function (filename) {
            };
            // Retrieve a Tracking audio file for use as 'blob' to send to Nettskjema
            CordovaService.prototype.getTrackingAudioFile = function (filename, sFunc, eFunc) {
            };
            CordovaService.prototype.checkFile = function (filename, sFunc, eFunc) {
            };
            CordovaService.prototype.deleteOldAudioFiles = function (mediaList, trackingList, lifespan) {
            };
            CordovaService.prototype.removeFile = function (path, filename, sFunc, eFunc) {
            };
            CordovaService.prototype.createTrackingDirectory = function () {
            };
            CordovaService.prototype.startCaptureAudio = function (taskFilename, sFunc, eFunc) {
            };
            CordovaService.prototype.stopCaptureAudio = function (taskFilename, currentUsage, newTrackingAudioFilename, sFunc, eFunc) {
            };
            CordovaService.prototype.getDeviceID = function () {
                return '';
            };
            CordovaService.prototype.getAppVersion = function (callback) {
            };
            CordovaService.$inject = ['$window', '$timeout'];
            return CordovaService;
        }());
        Services.CordovaService = CordovaService;
    })(Services = MorfologiApp.Services || (MorfologiApp.Services = {}));
})(MorfologiApp || (MorfologiApp = {}));

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

/// <reference path="../_references"/>
/// <reference path="../app.constants.ts"/>
/// <reference path="../models/models"/>
/// <reference path="./nettskjemaService"/>
/// <reference path="./cordovaService"/>
var MorfologiApp;
(function (MorfologiApp) {
    var Services;
    (function (Services) {
        "use strict";
        var DataService = (function () {
            function DataService($http, $window, $timeout, nettsckjemaService, cordovaService, constants) {
                var _this = this;
                this.$http = $http;
                this.$window = $window;
                this.$timeout = $timeout;
                this.nettsckjemaService = nettsckjemaService;
                this.cordovaService = cordovaService;
                this.constants = constants;
                this.currentLanguage = "en";
                this.username = '';
                this.selectedWeekIndex = 0;
                this.selectedBookIndex = 0;
                this.selectedDayIndex = 0;
                this.selectedTaskIndex = 0;
                this.setupComplete = false;
                this.deviceReady = false;
                this.status = {
                    online: navigator.onLine || false,
                    posting_data: false,
                    unsynced_data: false,
                    disk_space: NaN
                };
                // *** AUTO SENDING IS INTENDED TO BE SET TO true IN PRODUCTION
                this.settings = {
                    automatic_send_data: true,
                    storage_mode: 'sample'
                };
                this.$window.addEventListener("offline", function () {
                    _this.status.online = false;
                }, false);
                this.$window.addEventListener("online", function () {
                    if (!_this.status.online) {
                        _this.status.online = true;
                        _this.automaticallySendData();
                    }
                }, false);
                this.desktopBrowserTesting = !$window.cordova;
                this.activateTaskStartCallback = null;
                this.activateTaskEndCallback = null;
            }
            DataService.prototype.getDeviceReady = function () {
                return this.deviceReady;
            };
            DataService.prototype.setDeviceReady = function (setMe) {
                this.deviceReady = setMe;
            };
            DataService.prototype.getFormalStartDate = function () {
                return this.constants.constants['FORMAL_TEST_DATE'];
            };
            DataService.prototype.getShowCheats = function () {
                return this.constants.constants['SHOW_CHEATS'];
            };
            DataService.prototype.getStatus = function () {
                return this.status;
            };
            DataService.prototype.getDesktopBrowserTesting = function () {
                return this.desktopBrowserTesting;
            };
            // Takes the 'achievement' to the next day, but marks day as skipped.
            // The day to skip is considered as the avatar's current location
            DataService.prototype.skipToday = function (password) {
                var passKey = 'SKIP_DAY_PASSWORD';
                if (this.constants.constants[passKey] === password) {
                    var uncompletedWeekIndex = this.storageModel.achievement.weekIndex + 1;
                    var uncompletedDayIndex = this.storageModel.achievement.dayIndex + 1;
                    this.storageModel.markDayAsSkipped(uncompletedWeekIndex, uncompletedDayIndex);
                    if (uncompletedDayIndex === 2) {
                        this.setupModel.markWeekAsCompleted(uncompletedWeekIndex);
                        this.storageModel.markWeekAsCompleted(uncompletedWeekIndex);
                        this.storageModel.achievement.completeWeek(uncompletedWeekIndex);
                    }
                    else {
                        this.storageModel.achievement.completeDay(uncompletedWeekIndex, uncompletedDayIndex);
                    }
                }
            };
            DataService.prototype.getSettings = function () {
                return this.settings;
            };
            DataService.prototype.automaticallySendData = function () {
                if (this.settings.automatic_send_data) {
                    this.attemptToPostUsageData();
                }
            };
            // Make an attempt to post any new usage data to Nettskjema
            DataService.prototype.attemptToPostUsageData = function () {
                var _this = this;
                // If we receive a token, and are running on tablet, it is safe to assume we can then post to Nettskjema
                if (this.desktopBrowserTesting) {
                    return;
                }
                this.$http.get('http://nettskjema.uio.no/ping.html')
                    .then(function (success) {
                    console.log('Connected to Nettskjema');
                    _this.nettsckjemaService.setNettskjemaToken(success.data.toString());
                    if (_this.status.unsynced_data && !_this.status.posting_data) {
                        _this.postUsageData();
                    }
                }, function (error) {
                    _this.status.online = false;
                    console.log('Unable to connect to Nettskjema');
                });
            };
            // Load in the setup file to manage tasks and picturebooks
            DataService.prototype.requestSetupModel = function (successCallback) {
                var _this = this;
                var setupPathKey = 'SETUP_FILE_PATH', setupFilenameKey = 'SETUP_FILE_NAME', setupRevisionKey = 'RELEASE_NUMBER';
                return this.$http.get(this.constants.constants[setupPathKey] + this.constants.constants[setupFilenameKey] +
                    this.constants.constants[setupRevisionKey] + '.json')
                    .then(function (res) {
                    _this.setupModel = new MorfologiApp.Setup().deserialise(res.data);
                    if (successCallback !== null) {
                        successCallback(res.data);
                    }
                });
            };
            // Load in the current saved status from local tablet storage
            DataService.prototype.requestSavedState = function (sFunc) {
                var _this = this;
                this.cordovaService.storageExists(this.setupModel, this.username, function () {
                    _this.cordovaService.getStorage(function (model) {
                        _this.storageModel = model;
                        if (sFunc !== null) {
                            sFunc(model);
                        }
                    }, function (error) {
                        // If there was a terminal error reading from the storage file, try to create a new one
                        if (typeof error !== 'undefined' && error !== null && error === 'create_new_storage') {
                            _this.cordovaService.writeStorage(new MorfologiApp.Storage().initialise(_this.setupModel, _this.username), function () {
                                console.log('Created fresh storage after read fail');
                                _this.cordovaService.getStorage(function (model) {
                                    _this.storageModel = model;
                                    if (sFunc !== null) {
                                        sFunc(model);
                                    }
                                }, null);
                            }, null, false);
                        }
                        console.log('Error getting storage');
                    });
                }, function () {
                    console.log('Error checking storage exists');
                });
            };
            DataService.prototype.getStorageMode = function () {
                return this.settings.storage_mode;
            };
            // If before the 'formal date' set in Constants we use 'sample' storage. After this date, we use 'formal' storage
            DataService.prototype.checkStorageAndSetup = function (successCallback) {
                console.log('Checking storage...');
                var storageFilenameKey = 'STORAGE_FILE_NAME', revisionKey = 'RELEASE_NUMBER';
                var formalNameKey = 'FORMAL_TEST_NAME', sampleNameKey = 'SAMPLE_TEST_NAME', formalDateKey = 'FORMAL_TEST_DATE';
                var formalDate = this.constants.constants[formalDateKey];
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
                    this.setup(function (return_to_home) {
                        // Due to teachers entering student names during training period (this is not allowed)
                        // we are not copying the identifier across. Instead it must be asked for again.
                        /*
                        if (identifier !== '') {
                            this.storageModel.username = identifier;
                        }
                        */
                        successCallback(return_to_home);
                    });
                }
                else {
                    successCallback(false);
                }
            };
            // Save the current status to local tablet storage
            DataService.prototype.writeStorage = function (sFunc, eFunc, backup) {
                if (this.deviceReady) {
                    this.cordovaService.writeStorage(this.storageModel, function () {
                        console.log('Saved to storage file');
                        if (sFunc !== null) {
                            sFunc();
                        }
                    }, function () {
                        console.log('Error writing storage');
                    }, backup);
                }
                else {
                    eFunc('Device not ready');
                }
            };
            DataService.prototype.setup = function (successCallback) {
                var _this = this;
                if (!this.setupComplete) {
                    console.log('Loading setup...');
                    this.requestSetupModel(function () {
                        console.log('Loading storage...');
                        _this.requestSavedState(function () {
                            console.log('Marking completions...');
                            _this.markSetupCompletions();
                            // console.log('Deleting old recordings...');
                            // this.deleteOldRecordings();
                            _this.setupComplete = true;
                            if (successCallback !== null) {
                                successCallback(true);
                            }
                        });
                    });
                }
                else if (successCallback !== null) {
                    successCallback(false);
                }
            };
            /**
             * For each setup task, if completed in the storage, mark them in memory
             */
            DataService.prototype.markSetupCompletions = function () {
                var _this = this;
                this.storageModel.weeks.forEach(function (week, weekIndex) {
                    if (week.completed_on !== null) {
                        _this.setupModel.weeks[weekIndex].completed = true;
                    }
                    week.days.forEach(function (day, dayIndex) {
                        if (day.completed_on !== null) {
                            _this.setupModel.weeks[weekIndex].days[dayIndex].completed = true;
                        }
                        day.tasks.forEach(function (task, taskIndex) {
                            if (task.completed_on !== null) {
                                _this.setupModel.weeks[weekIndex].days[dayIndex].tasks[taskIndex].completed = true;
                            }
                        });
                    });
                });
            };
            DataService.prototype.setAvatar = function (avatarIndex) {
                this.storageModel.achievement.avatar = avatarIndex;
            };
            DataService.prototype.getUsername = function () {
                return this.storageModel.username;
            };
            DataService.prototype.setUsername = function (username) {
                this.storageModel.username = username;
            };
            DataService.prototype.getResizableDivSize = function () {
                return this.resizableDivSize;
            };
            DataService.prototype.setResizableDivSize = function (newSize) {
                this.resizableDivSize = newSize;
            };
            DataService.prototype.getLanguage = function () {
                return this.currentLanguage;
            };
            ;
            DataService.prototype.setLanguage = function (type) {
                this.currentLanguage = type;
            };
            ;
            // Books
            DataService.prototype.getBookList = function (successCallback, errorCallback) {
                var booklistKey = 'books';
                if (typeof this.setupModel === 'undefined') {
                    this.requestSetupModel(function (data) {
                        successCallback(data[booklistKey]);
                    });
                }
                else {
                    successCallback(this.setupModel[booklistKey]);
                }
            };
            DataService.prototype.getBook = function () {
                return this.setupModel.books[this.setupModel.weeks[this.selectedWeekIndex].book_index];
            };
            // Tasks
            DataService.prototype.getWeeks = function () {
                var weeksKey = 'weeks';
                return this.setupModel[weeksKey];
            };
            DataService.prototype.getWeek = function () {
                return this.selectedWeekIndex;
            };
            DataService.prototype.getDay = function () {
                return this.selectedDayIndex;
            };
            DataService.prototype.getTaskIndex = function () {
                return this.selectedTaskIndex;
            };
            DataService.prototype.getTasks = function () {
                return this.setupModel.weeks[this.selectedWeekIndex].days[this.selectedDayIndex]
                    .tasks;
            };
            DataService.prototype.getTask = function () {
                return this.setupModel.weeks[this.selectedWeekIndex].days[this.selectedDayIndex]
                    .tasks[this.selectedTaskIndex];
            };
            DataService.prototype.getWord = function () {
                var wordKey = 'word_en';
                return this.setupModel.weeks[this.selectedWeekIndex][wordKey];
            };
            DataService.prototype.getWordForConsolidationDay = function () {
                var wordKey = 'word_en', dayKey = 'days', tasksKey = 'tasks', structureKey = 'structure', weeksKey = 'weeks', weekKey = 'week';
                var weekIndex = this.setupModel[weeksKey][this.selectedWeekIndex][dayKey][this.selectedDayIndex][tasksKey][this.selectedTaskIndex][structureKey][weekKey];
                return this.setupModel.weeks[weekIndex][wordKey];
            };
            DataService.prototype.getAchievement = function () {
                return this.storageModel.achievement;
            };
            DataService.prototype.setWeek = function (weekIndex) {
                this.selectedWeekIndex = weekIndex;
                this.selectedBookIndex = this.setupModel.weeks[weekIndex].book_index;
            };
            DataService.prototype.setDay = function (dateIndex) {
                this.selectedDayIndex = dateIndex;
            };
            DataService.prototype.startBook = function () {
                this.storageModel.addBookUsage(this.selectedWeekIndex, new Date(), 0, '');
                this.status.unsynced_data = true;
                if (this.setupModel.books[this.selectedBookIndex].record_audio) {
                    this.startTrackingRecording('book');
                }
            };
            DataService.prototype.setTask = function (taskIndex) {
                this.activateTaskStartCallback = null;
                this.activateTaskEndCallback = null;
                this.selectedTaskIndex = taskIndex;
                this.storageModel.addTaskUsage(this.selectedWeekIndex, this.selectedDayIndex, this.selectedTaskIndex, new Date(), 0, '');
                this.status.unsynced_data = true;
                if (this.setupModel.weeks[this.selectedWeekIndex].days[this.selectedDayIndex].tasks[this.selectedTaskIndex].record_audio) {
                    this.startTrackingRecording('task');
                }
            };
            DataService.prototype.getBookReadToday = function () {
                return this.storageModel.weeks[this.selectedWeekIndex].days[this.selectedDayIndex].book_read;
            };
            DataService.prototype.setBookReadToday = function () {
                this.storageModel.weeks[this.selectedWeekIndex].days[this.selectedDayIndex].book_read = true;
            };
            // Do not set record_audio for Day 3 Task 5 or 6, as those tasks record the child's voice instead
            DataService.prototype.completeCurrentUsageRecord = function (type) {
                var currentUsage;
                // Complete recording if running
                if (type === 'task') {
                    currentUsage = this.storageModel.weeks[this.selectedWeekIndex].days[this.selectedDayIndex].tasks[this.selectedTaskIndex].currentUsage;
                    if (currentUsage !== null) {
                        var startedOn = moment(currentUsage.accessed);
                        var finishedOn = moment();
                        currentUsage.duration = moment.duration(finishedOn.diff(startedOn)).asSeconds();
                        if (this.setupModel.weeks[this.selectedWeekIndex].days[this.selectedDayIndex].tasks[this.selectedTaskIndex].record_audio) {
                            this.cordovaService.stopTrackingRecording(currentUsage.audio_file);
                        }
                        this.storageModel.weeks[this.selectedWeekIndex].days[this.selectedDayIndex].tasks[this.selectedTaskIndex].currentUsage = null;
                    }
                }
                else if (type === 'book') {
                    currentUsage = this.storageModel.weeks[this.selectedWeekIndex].book.currentUsage;
                    if (currentUsage !== null) {
                        var startedOn = moment(currentUsage.accessed);
                        var finishedOn = moment();
                        currentUsage.duration = moment.duration(finishedOn.diff(startedOn)).asSeconds();
                        if (this.setupModel.books[this.selectedBookIndex].record_audio) {
                            this.cordovaService.stopTrackingRecording(currentUsage.audio_file);
                        }
                        this.storageModel.weeks[this.selectedWeekIndex].book.currentUsage = null;
                    }
                }
            };
            DataService.prototype.completeSelectedBook = function () {
                var book = this.selectedBookIndex, week = this.selectedWeekIndex;
                this.setBookReadToday();
                // save state to Setup and Storage
                if (typeof this.setupModel.books[book] !== 'undefined' && !this.setupModel.books[book].completed) {
                    this.setupModel.markBookAsCompleted(week);
                    this.storageModel.markBookAsCompleted(week);
                }
                // Complete the outstanding usage record
                this.completeCurrentUsageRecord('book');
            };
            DataService.prototype.completeSelectedTask = function () {
                var week = this.selectedWeekIndex, day = this.selectedDayIndex, task = this.selectedTaskIndex;
                // save state to Setup and Storage
                this.setupModel.markTaskAsCompleted(week, day, task);
                this.storageModel.markTaskAsCompleted(week, day, task);
                this.storageModel.achievement.completeTask(week, day, task);
            };
            DataService.prototype.completeSelectedDay = function () {
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
            };
            DataService.prototype.completeSelectedWeek = function () {
                this.setupModel.markWeekAsCompleted(this.selectedWeekIndex);
                this.storageModel.markWeekAsCompleted(this.selectedWeekIndex);
                this.storageModel.achievement.completeWeek(this.selectedWeekIndex);
            };
            /*
            getUUID(): string {
                return this.cordovaService.getUUID();
            }
            */
            DataService.prototype.getCommon = function () {
                var commonKey = 'common';
                return this.setupModel[commonKey];
            };
            DataService.prototype.removeStorage = function () {
                this.cordovaService.clearStorage();
            };
            /*
            getVideoMedia(source): Media {
                return this.cordovaService.getVideoFile(source);
            }
            */
            // Audio recording for tracking purposes
            // Do not set record_audio for Day 3 Task 5 or 6, as those tasks record the child's voice instead
            DataService.prototype.startTrackingRecording = function (type) {
                if (this.desktopBrowserTesting) {
                    return;
                }
                var currentUsage;
                // Check disk space first
                if (this.status.disk_space < 100) {
                    return;
                }
                else if (type === 'task') {
                    currentUsage = this.storageModel.weeks[this.selectedWeekIndex].days[this.selectedDayIndex].tasks[this.selectedTaskIndex].currentUsage;
                    var d = currentUsage.accessed;
                    currentUsage.audio_file = 'w' + (this.selectedWeekIndex + 1) + '_d' + (this.selectedDayIndex + 1) +
                        '_t' + (this.selectedTaskIndex + 1) + '-' + d.getFullYear() + '_' + (d.getMonth() + 1) + '_' + d.getDate() +
                        '-' + d.getHours() + '_' + d.getMinutes() + '_' + d.getSeconds() + '.m4a';
                }
                else if (type === 'book') {
                    currentUsage = this.storageModel.weeks[this.selectedWeekIndex].book.currentUsage;
                    var d = currentUsage.accessed;
                    currentUsage.audio_file = 'w' + (this.selectedWeekIndex + 1) + '_b' + (this.selectedBookIndex + 1) +
                        '-' + d.getFullYear() + '_' + (d.getMonth() + 1) + '_' + d.getDate() +
                        '-' + d.getHours() + '_' + d.getMinutes() + '_' + d.getSeconds() + '.m4a';
                }
                this.cordovaService.startTrackingRecording(currentUsage.audio_file);
            };
            DataService.prototype.getTaskUsage = function () {
                return this.storageModel.weeks[this.selectedWeekIndex].days[this.selectedDayIndex]
                    .tasks[this.selectedTaskIndex].usage;
            };
            DataService.prototype.postUsageData = function () {
                var _this = this;
                this.status.posting_data = true;
                var postData = this.storageModel.asPostableUsageData();
                var postRemainingData = function () {
                    if (postData.length > 0) {
                        _this.nettsckjemaService.postTrackingDataItem(postData.pop(), function (data) {
                            console.log('Successful Nettskjema submission: ' + data);
                            postRemainingData();
                        }, function (data) {
                            console.log('Error during Nettskjema submission: ' + data);
                        });
                    }
                    else {
                        _this.status.posting_data = false;
                        _this.status.unsynced_data = false;
                    }
                };
                postRemainingData();
            };
            DataService.prototype.setupAudioIntroduction = function (url) {
                var _this = this;
                if (typeof this.introductionAudio !== 'undefined') {
                    this.introductionAudio.pause();
                }
                this.$timeout(function () {
                    _this.introductionAudio = new Audio(url);
                    _this.introductionAudio.load();
                    _this.introductionAudio.addEventListener('ended', function () {
                        _this.disableInteractionCallback(false, true);
                        if (_this.activateTaskEndCallback !== null) {
                            _this.activateTaskEndCallback();
                        }
                    });
                }, 0);
            };
            DataService.prototype.playAudioIntroduction = function (delay) {
                var _this = this;
                if (this.desktopBrowserTesting) {
                    delay = 10;
                }
                if (delay > 0) {
                    this.disableInteractionCallback(true, true);
                }
                this.$timeout(function () {
                    if (_this.activateTaskStartCallback !== null) {
                        _this.activateTaskStartCallback();
                    }
                    try {
                        _this.introductionAudio.play();
                    }
                    catch (error) {
                        console.log('No introduction audio source found');
                        _this.disableInteractionCallback(false, true);
                        if (_this.activateTaskEndCallback !== null) {
                            _this.activateTaskEndCallback();
                        }
                    }
                }, delay);
            };
            DataService.prototype.deleteOldRecordings = function () {
                var mediaFiles = [];
                var weekTotal = this.setupModel.weeks.length;
                var w = 0;
                while (w < weekTotal) {
                    // Each week has thre 'user made' recordings - two audio and one video
                    mediaFiles.push('week' + (w + 1) + '-task6-' + this.constants.constants['FORMAL_TEST_NAME'] + '-audio.m4a');
                    mediaFiles.push('week' + (w + 1) + '-task5-' + this.constants.constants['FORMAL_TEST_NAME'] + '-audio.m4a');
                    mediaFiles.push('week' + w + '-' + this.constants.constants['FORMAL_TEST_NAME'] + '-video.MOV');
                }
                this.cordovaService.deleteOldAudioFiles(mediaFiles, this.storageModel.getTrackingFileList(), this.constants.constants['RECORDING_LIFESPAN']);
            };
            DataService.prototype.setDisableInteractionCallback = function (callback) {
                this.disableInteractionCallback = callback;
            };
            DataService.prototype.setInteractionEndActivateTaskCallback = function (callback) {
                this.activateTaskEndCallback = callback;
            };
            DataService.prototype.clearInteractionEndActivateTaskCallback = function () {
                this.activateTaskEndCallback = null;
            };
            DataService.prototype.setInteractionStartActivateTaskCallback = function (callback) {
                this.activateTaskStartCallback = callback;
            };
            DataService.prototype.externalCallDisableInteractionCallback = function (setMe, showSpeaker) {
                if (this.disableInteractionCallback !== null) {
                    this.disableInteractionCallback(setMe, showSpeaker);
                }
            };
            DataService.prototype.shuffleArray = function (array) {
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
            };
            DataService.prototype.captureVideo = function (sFunc, eFunc) {
                var filename = 'week' + this.selectedWeekIndex + '-' + this.settings.storage_mode + '-video.MOV';
                this.cordovaService.captureVideo(sFunc, eFunc, filename);
            };
            // Day 3 task 5 & 6 audio recording of the child's voice
            DataService.prototype.startCaptureAudio = function () {
                var taskFilename = 'week' + (this.selectedWeekIndex + 1) + '-task' + (this.selectedTaskIndex + 1) + '-' + this.settings.storage_mode + '-audio.m4a';
                this.cordovaService.startCaptureAudio(taskFilename, function () {
                    console.log('Begin recording voice..');
                }, function (error) {
                    console.log('Error recording voice..' + error);
                });
            };
            // For Day 3 Task 5 & 6 a new recording always overwrites previous for this week, but one audio for each UsageStorage is copied.
            DataService.prototype.stopCaptureAudio = function (sFunc, eFunc) {
                var currentUsage = this.storageModel.weeks[this.selectedWeekIndex].days[this.selectedDayIndex].tasks[this.selectedTaskIndex].currentUsage;
                var d = currentUsage.accessed;
                var newTrackingAudioFilename = 'w' + (this.selectedWeekIndex + 1) + '_d' + (this.selectedDayIndex + 1) +
                    '_t' + (this.selectedTaskIndex + 1) + '-' + d.getFullYear() + '_' + (d.getMonth() + 1) + '_' + d.getDate() +
                    '-' + d.getHours() + '_' + d.getMinutes() + '_' + d.getSeconds() + '.m4a';
                var taskFilename = 'week' + (this.selectedWeekIndex + 1) + '-task' + (this.selectedTaskIndex + 1) + '-' + this.settings.storage_mode + '-audio.m4a';
                this.cordovaService.stopCaptureAudio(taskFilename, currentUsage, newTrackingAudioFilename, function (success) {
                    console.log('Finished recording voice..');
                    sFunc(success);
                }, function (error) {
                    eFunc(error);
                });
            };
            DataService.prototype.checkFile = function (filename, sFunc, eFunc) {
                if (this.desktopBrowserTesting) {
                    eFunc('');
                }
                else {
                    this.cordovaService.checkFile(filename, sFunc, eFunc);
                }
            };
            DataService.prototype.getAppVersion = function (callback) {
                this.cordovaService.getAppVersion(callback);
            };
            DataService.$inject = ['$http', '$window', '$timeout', 'CordovaService', 'NettskjemaService', 'MorfologiConstants'];
            return DataService;
        }());
        Services.DataService = DataService;
    })(Services = MorfologiApp.Services || (MorfologiApp.Services = {}));
})(MorfologiApp || (MorfologiApp = {}));

/// <reference path="../../_references.ts"/>
/// <reference path="../../services/dataService"/>
var MorfologiApp;
(function (MorfologiApp) {
    var Directives;
    (function (Directives) {
        "use strict";
        var ResizeController = (function () {
            function ResizeController(dataService, $window) {
                this.dataService = dataService;
                this.$window = $window;
            }
            ;
            ResizeController.$inject = ['DataService', '$window'];
            return ResizeController;
        }());
        function linker(scope, element, ctrl) {
            var w = angular.element(ctrl.$window);
            scope.getWindowDimensions = function () {
                return {
                    'VIEW_HEIGHT': element.prop('offsetHeight'),
                    'VIEW_WIDTH': element.prop('offsetWidth')
                };
            };
            scope.$watch(scope.getWindowDimensions, function (newValue) {
                ctrl.dataService.setResizableDivSize(newValue);
            }, true);
            w.bind('resize', function () {
                scope.$apply();
            });
            ctrl.dataService.setResizableDivSize(scope.getWindowDimensions());
        }
        function ispResize() {
            return {
                restrict: 'A',
                controller: ResizeController,
                link: linker
            };
        }
        Directives.ispResize = ispResize;
    })(Directives = MorfologiApp.Directives || (MorfologiApp.Directives = {}));
})(MorfologiApp || (MorfologiApp = {}));

/// <reference path="../../../js/_references"/>
/// <reference path="../../models/models"/>
/// <reference path="../../services/dataService"/>
var MorfologiApp;
(function (MorfologiApp) {
    var Controllers;
    (function (Controllers) {
        "use strict";
        var Task1Controller = (function () {
            function Task1Controller($scope, $timeout, dataService) {
                var _this = this;
                this.$scope = $scope;
                this.$timeout = $timeout;
                this.dataService = dataService;
                this.word = $scope['wpC'].word;
                this.task = dataService.getTask();
                this.showingPanel = 'choice';
                this.showForwardArrow = false;
                this.playingSequence = false;
                this.round = 0;
                this.repeats = 1;
                this.opacity = 0;
                this.itemA = { file: '', audio: '', correct: true, highlight: false };
                this.itemB = { file: '', audio: '', correct: false, highlight: false };
                this.randomiseItems();
                $timeout(function () {
                    _this.opacity = 1;
                }, 1000);
                // This should be run at the end of the constructor
                var handle = this;
                dataService.setInteractionEndActivateTaskCallback(function () {
                    _this.activateTask(handle);
                });
                dataService.setupAudioIntroduction('content/' + this.word + '/articulation/day2/instruction.mp3');
                dataService.playAudioIntroduction(3000);
            }
            Task1Controller.prototype.randomiseItems = function () {
                var firstItem = Math.random() > 0.5 ? 'itemA' : 'itemB';
                var secondItem = firstItem === 'itemA' ? 'itemB' : 'itemA';
                var firstImage = Math.random() > 0.5 ? 'correct.jpg' : 'incorrect.jpg';
                var secondImage = firstImage === 'correct.jpg' ? 'incorrect.jpg' : 'correct.jpg';
                var firstAudio = firstImage === 'correct.jpg' ? 'correct.mp3' : 'incorrect.mp3';
                var secondAudio = firstImage === 'correct.jpg' ? 'incorrect.mp3' : 'correct.mp3';
                var firstCorrect = firstAudio === 'correct.mp3';
                var secondCorrect = !firstCorrect;
                this[firstItem] = {
                    file: 'content/' + this.word + '/articulation/day2/' + firstImage,
                    audio: 'content/' + this.word + '/articulation/day2/' + firstAudio,
                    correct: firstCorrect,
                    highlight: false
                };
                this[secondItem] = {
                    file: 'content/' + this.word + '/articulation/day2/' + secondImage,
                    audio: 'content/' + this.word + '/articulation/day2/' + secondAudio,
                    correct: secondCorrect,
                    highlight: false
                };
            };
            Task1Controller.prototype.activateTask = function (handle) {
                var _this = this;
                this.dataService.externalCallDisableInteractionCallback(true, false);
                this.playingSequence = true;
                this.opacity = 1;
                handle.$timeout(function () {
                    var audio = new Audio(handle.itemA['audio']);
                    audio.play();
                    handle.itemA['highlight'] = true;
                    handle.$timeout(function () {
                        handle.itemA['highlight'] = false;
                    }, 1000);
                    handle.$timeout(function () {
                        var audio = new Audio(handle.itemB['audio']);
                        audio.play();
                        handle.itemB['highlight'] = true;
                        handle.$timeout(function () {
                            handle.itemB['highlight'] = false;
                            _this.playingSequence = false;
                            _this.dataService.externalCallDisableInteractionCallback(false, false);
                        }, 1000);
                    }, 2000);
                }, 1500);
            };
            Task1Controller.prototype.clickEarA = function () {
                var audio = new Audio(this.itemA['audio']);
                audio.play();
            };
            Task1Controller.prototype.clickEarB = function () {
                var audio = new Audio(this.itemB['audio']);
                audio.play();
            };
            Task1Controller.prototype.clickItemA = function () {
                var _this = this;
                this.itemA.highlight = true;
                this.itemB.highlight = false;
                if (this.itemA['correct']) {
                    if (this.round === this.repeats) {
                        this.$scope['wpC'].taskFinished();
                    }
                    else {
                        this.$scope['wpC'].setAndShowOnetimeInternalForwardArrowCallback(function () {
                            _this.clickForwardArrow();
                        });
                    }
                }
                else {
                    var rand = Math.floor(Math.random() * 4);
                    var audio = new Audio('content/common/audio/tryagain' + rand + '.mp3');
                    audio.play();
                    this.$timeout(function () {
                        _this.itemA.highlight = false;
                    }, 2000);
                }
            };
            Task1Controller.prototype.clickItemB = function () {
                var _this = this;
                this.itemB.highlight = true;
                this.itemA.highlight = false;
                if (this.itemB['correct']) {
                    if (this.round === this.repeats) {
                        this.$scope['wpC'].taskFinished();
                    }
                    else {
                        this.$scope['wpC'].setAndShowOnetimeInternalForwardArrowCallback(function () {
                            _this.clickForwardArrow();
                        });
                    }
                }
                else {
                    var rand = Math.floor(Math.random() * 4);
                    var audio = new Audio('content/common/audio/tryagain' + rand + '.mp3');
                    audio.play();
                    this.$timeout(function () {
                        _this.itemB.highlight = false;
                    }, 2000);
                }
            };
            Task1Controller.prototype.clickForwardArrow = function () {
                var _this = this;
                this.opacity = 0;
                this.round++;
                this.itemA.highlight = false;
                this.itemB.highlight = false;
                this.showForwardArrow = false;
                this.$timeout(function () {
                    _this.randomiseItems();
                    _this.activateTask(_this);
                }, 1000);
            };
            Task1Controller.$inject = ['$scope', '$timeout', 'DataService'];
            return Task1Controller;
        }());
        Controllers.Task1Controller = Task1Controller;
    })(Controllers = MorfologiApp.Controllers || (MorfologiApp.Controllers = {}));
})(MorfologiApp || (MorfologiApp = {}));

/// <reference path="_references"/>
/// <reference path="./app.config.ts"/>
/// <reference path="./app.constants.ts"/>
/// <reference path="./app.run.ts"/>
/// <reference path="components/resizewindow/resize"/>
/// <reference path="tasks/task1/controller"/>
/**
 * Morfologi core application module.
 * @preferred
 */
var MorfologiApp;
(function (MorfologiApp) {
    'use strict';
    /**
     * Array of dependencies to be injected in the application "dependencies".
     */
    var dependencies = [
        'ui.router',
        'pascalprecht.translate',
        'ngDraggable',
        'angular-flippy'
    ];
    angular.module('MorfologiApp', dependencies)
        .constant('MorfologiConstants', MorfologiApp.MorfologiConstants)
        .service(MorfologiApp.Services)
        .directive(MorfologiApp.Directives)
        .controller(MorfologiApp.Controllers)
        .config(MorfologiApp.configApp)
        .run(MorfologiApp.runApp);
})(MorfologiApp || (MorfologiApp = {}));

/// <reference path="../_references.ts"/>
var MorfologiApp;
(function (MorfologiApp) {
    "use strict";
})(MorfologiApp || (MorfologiApp = {}));

/// <reference path="../_references.ts"/>
/// <reference path="../models/models"/>
var MorfologiApp;
(function (MorfologiApp) {
    var Services;
    (function (Services) {
        "use strict";
        var ServerService = (function () {
            function ServerService($window, $cordovaDevice, $cordovaFile, $cordovaCapture, $cordovaMedia, $cordovaAppVersion, $timeout) {
                this.$window = $window;
                this.$cordovaDevice = $cordovaDevice;
                this.$cordovaFile = $cordovaFile;
                this.$cordovaCapture = $cordovaCapture;
                this.$cordovaMedia = $cordovaMedia;
                this.$cordovaAppVersion = $cordovaAppVersion;
                this.$timeout = $timeout;
                this.recordingAttempts = 0;
                // If using a desktop browser, we will set up storage in memory for testing purposes
                this.desktopBrowserTesting = !$window.cordova;
                this.desktopBrowserStorage = null;
                this.recordingTimer = 0;
                if (!this.desktopBrowserTesting) {
                    this.createTrackingDirectory();
                }
            }
            ServerService.prototype.getUUID = function () {
                if (this.$window.cordova !== undefined) {
                    return this.$cordovaDevice.getUUID();
                }
                else {
                    return 'No mobile device';
                }
            };
            ServerService.prototype.setStorageFilename = function (name) {
                this.storageFileName = name;
            };
            /**
             * Check for the existance of the Storage, if not initialise it and call writeStorage
             *
             * @param setupModel
             * @param username
             * @param sFunc
             * @param eFunc
             */
            ServerService.prototype.storageExists = function (setupModel, username, sFunc, eFunc) {
                var _this = this;
                if (this.desktopBrowserTesting) {
                    if (this.desktopBrowserStorage === null || (this.desktopBrowserStorage.hasOwnProperty('pseudoFilename')
                        && this.desktopBrowserStorage['pseudoFilename'] !== this.storageFileName)) {
                        var newStorage = new MorfologiApp.Storage().initialise(setupModel, username);
                        this.writeStorage(newStorage, sFunc, eFunc, false);
                    }
                    else {
                        if (sFunc !== null) {
                            sFunc();
                        }
                    }
                }
                else {
                    this.$cordovaFile.checkFile(cordova.file.documentsDirectory, this.storageFileName)
                        .then(function () {
                        if (sFunc !== null) {
                            sFunc();
                        }
                    }, function () {
                        _this.writeStorage(new MorfologiApp.Storage().initialise(setupModel, username), sFunc, eFunc, false);
                    });
                }
            };
            ServerService.prototype.getStorage = function (sFunc, eFunc) {
                var _this = this;
                if (this.desktopBrowserTesting) {
                    sFunc(this.desktopBrowserStorage);
                }
                else {
                    this.$cordovaFile.readAsText(cordova.file.documentsDirectory, this.storageFileName)
                        .then(function (success) {
                        // Sometimes the cordova writefile routine appends rather than overwites, need to check for this problem..
                        var cleanedData, endIndex, deJson, newStorage;
                        endIndex = success.lastIndexOf('\{"weeks"\:\[');
                        if (endIndex !== 0) {
                            console.log('Data was corrupted - index was: ' + endIndex);
                            cleanedData = success.substr(0, endIndex);
                        }
                        else {
                            console.log('Data is clean to read');
                            cleanedData = success;
                        }
                        // Attempt to deserialise the data.  JSON.parse() used by angular.fromJson throwds a syntax error on failure
                        try {
                            deJson = angular.fromJson(cleanedData);
                        }
                        catch (e) {
                            // If read fails, attempt to read the backup file instead
                            console.log('Regular storage could not be read, trying backup file..');
                            _this.$cordovaFile.readAsText(cordova.file.documentsDirectory, 'storageBackup.json')
                                .then(function (success) {
                                // Sometimes the cordova writefile routine appends rather than overwites, need to check for this problem..
                                var cleanedData, endIndex, deJson, newStorage;
                                endIndex = success.lastIndexOf('\{"weeks"\:\[');
                                if (endIndex !== 0) {
                                    console.log('Data was corrupted - index was: ' + endIndex);
                                    cleanedData = success.substr(0, endIndex);
                                }
                                else {
                                    console.log('Data is clean to read');
                                    cleanedData = success;
                                }
                                try {
                                    deJson = angular.fromJson(cleanedData);
                                }
                                catch (e) {
                                    // If we arrive here, the read of data file failed completely. Create a new one.
                                    console.log('Backup storage could not be read. Renaming old storage..');
                                    _this.$cordovaFile.moveFile(cordova.file.documentsDirectory, _this.storageFileName, cordova.file.documentsDirectory, _this.storageFileName.slice(0, -5) + '-stashed-' + Date.now() + '.json')
                                        .then(function () {
                                        // The return to DataService with this error will cause a new data file to be created
                                        eFunc('create_new_storage');
                                    }, function () {
                                        console.log('Rename old storage file error!');
                                    });
                                }
                                finally {
                                    if (typeof deJson !== 'undefined' && deJson != null) {
                                        newStorage = new MorfologiApp.Storage().deserialise(deJson);
                                        console.log('Storage recovered from backup');
                                        if (sFunc !== null) {
                                            sFunc(newStorage);
                                        }
                                    }
                                }
                                if (sFunc !== null) {
                                    sFunc(newStorage);
                                }
                            }, function () {
                                console.log('Error reading backup storage file using readAsText');
                            });
                        }
                        finally {
                            if (typeof deJson !== 'undefined' && deJson != null) {
                                newStorage = new MorfologiApp.Storage().deserialise(deJson);
                                console.log('Storage loaded');
                                if (sFunc !== null) {
                                    sFunc(newStorage);
                                }
                            }
                        }
                    }, function () {
                        console.log('Error reading main storage file using readAsText');
                    });
                }
            };
            ServerService.prototype.writeStorage = function (storageModel, sFunc, eFunc, backup) {
                var _this = this;
                if (this.desktopBrowserTesting) {
                    this.desktopBrowserStorage = storageModel;
                    this.desktopBrowserStorage['pseudoFilename'] = this.storageFileName;
                    if (sFunc !== null) {
                        sFunc();
                    }
                }
                else {
                    var jsonified = angular.toJson(storageModel);
                    this.$cordovaFile.createFile(cordova.file.documentsDirectory, this.storageFileName, true)
                        .then(function () {
                        // TESTING!
                        //var jsonifiedBad = jsonified + 'blah blah' + '\{"weeks"\:\[';
                        _this.$cordovaFile.writeFile(cordova.file.documentsDirectory, _this.storageFileName, jsonified, true)
                            .then(function () {
                            if (backup) {
                                _this.writeStorageBackup(jsonified, sFunc, eFunc);
                            }
                            else if (sFunc !== null) {
                                sFunc();
                            }
                        }, function () {
                            console.log('Unable to write storage file');
                            eFunc();
                        });
                    }, function () {
                        console.log('Unable to create storage file');
                    });
                }
            };
            ServerService.prototype.writeStorageBackup = function (jsonifiedStorage, sFunc, eFunc) {
                var _this = this;
                if (this.desktopBrowserTesting) {
                    if (sFunc !== null) {
                        sFunc();
                    }
                }
                else {
                    this.$cordovaFile.createFile(cordova.file.documentsDirectory, 'storageBackup.json', true)
                        .then(function () {
                        _this.$cordovaFile.writeFile(cordova.file.documentsDirectory, 'storageBackup.json', jsonifiedStorage, true)
                            .then(function () {
                            console.log('Wrote storage backup file');
                            if (sFunc !== null) {
                                sFunc();
                            }
                        }, function () {
                            console.log('Unable to write backup storage file');
                            eFunc();
                        });
                    }, function () {
                        console.log('Unable to create backup storage file');
                    });
                }
            };
            ServerService.prototype.getFreeDiskSpace = function (sFunc, eFunc) {
                if (this.desktopBrowserTesting) {
                    sFunc('no tablet device!');
                }
                else {
                    this.$cordovaFile.getFreeDiskSpace()
                        .then(function (success) {
                        sFunc(success);
                    }, function (error) {
                        eFunc(error);
                    });
                }
            };
            ServerService.prototype.clearStorage = function () {
                this.$cordovaFile.removeFile(cordova.file.documentsDirectory, this.storageFileName)
                    .then(function () {
                    console.log('Storage file deleted');
                }, function () {
                    console.log('Unable to write storage file');
                });
            };
            ServerService.prototype.captureVideo = function (sFunc, eFunc, filename) {
                var _this = this;
                var options = { limit: 1, duration: 60 };
                console.log('Capturing video...');
                this.$cordovaCapture.captureVideo(options).then(function (videoData) {
                    var tmpFileDir = 'file:///' + videoData[0].fullPath.substring(0, videoData[0].fullPath.lastIndexOf('/'));
                    _this.$cordovaFile.moveFile(tmpFileDir, videoData[0].name, cordova.file.documentsDirectory, filename)
                        .then(function (success) {
                        console.log('Finished capturing video. Moved video.');
                        sFunc(success['nativeURL']);
                    });
                }, function (error) {
                    console.log('Video capture error: ' + error);
                    eFunc(error);
                });
            };
            ServerService.prototype.startTrackingRecording = function (filename) {
                var _this = this;
                if (this.desktopBrowserTesting) {
                    return;
                }
                if (this.recordingTimer === 0) {
                    this.recordingAttempts = 0;
                    // https://github.com/remoorejr/cordova-plugin-media-with-compression
                    var options = {
                        SampleRate: 16000,
                        NumberOfChannels: 1,
                        duration: 60
                    };
                    this.audioFile = new Media("documents://tracking/" + filename, function () {
                        console.log('Recording tracking audio...');
                    }, function (error) {
                        console.log('Record tracking audio error: ' + error.code);
                    });
                    this.recordingTimer = Date.now();
                    this.audioFile.startRecordWithCompression(options);
                }
                else if (this.recordingAttempts < 3) {
                    this.recordingAttempts++;
                    this.$timeout(function () {
                        _this.startTrackingRecording(filename);
                    }, 1000);
                }
                else {
                    this.recordingAttempts = 0;
                    console.log('Attempted record failed 3 times. Stopping.');
                }
            };
            ServerService.prototype.stopTrackingRecording = function (filename) {
                if (this.desktopBrowserTesting) {
                    return;
                }
                if (typeof this.audioFile !== 'undefined' && this.audioFile !== null) {
                    this.audioFile.stopRecord();
                    this.audioFile.release();
                    console.log('Finished recording tracking audio.');
                    if (Date.now() - this.recordingTimer < 3000) {
                        this.removeFile(cordova.file.documentsDirectory + 'tracking/', filename, function () {
                            console.log('Too short tracking audio file removed');
                        }, function () {
                            console.log('Error removing short tracking audio file');
                        });
                    }
                    this.recordingTimer = 0;
                }
                //this.audioFile = null;
            };
            // Retrieve a Tracking audio file for use as 'blob' to send to Nettskjema
            ServerService.prototype.getTrackingAudioFile = function (filename, sFunc, eFunc) {
                if (this.desktopBrowserTesting) {
                    eFunc();
                }
                else {
                    this.$cordovaFile.readAsArrayBuffer(cordova.file.documentsDirectory + 'tracking/', filename)
                        .then(function (success) {
                        if (sFunc !== null) {
                            sFunc(success);
                        }
                    }, function () {
                        if (eFunc !== null) {
                            eFunc('Error reading MP3 file: ' + filename);
                        }
                    });
                }
            };
            /*
            getVideoFile(source: string): Media {
                return this.$cordovaMedia.newMedia(source);
            }
            */
            ServerService.prototype.checkFile = function (filename, sFunc, eFunc) {
                this.$cordovaFile.checkFile(cordova.file.documentsDirectory, filename)
                    .then(function (file) {
                    sFunc(file);
                }, function (error) {
                    eFunc(error);
                });
            };
            ServerService.prototype.deleteOldAudioFiles = function (mediaList, trackingList, lifespan) {
                var index = 0;
                /*
                            function checkAndRemove() {
                                this.$window.resolveLocalFileSystemURL(cordova.file.documentsDirectory + mediaList[index], (fileEntry) => {
                                    var fileModificationDate = new Date(file.lastModifiedDate);
                                }, (error) => {
                                    console.log('Filesystem error: ' + error);
                                });
                            }
                
                            mediaList.forEach((media) => {
                                this.$window.resolveLocalFileSystemURL(cordova.file.documentsDirectory + media, gotFile, fail);
                            });
                            this.$window.resolveLocalFileSystemURL(cordova.file.documentsDirectory + '/tracking/' + "www/index.html", gotFile, fail);
                */
            };
            ServerService.prototype.removeFile = function (path, filename, sFunc, eFunc) {
                this.$cordovaFile.removeFile(path, filename)
                    .then(function () {
                    sFunc();
                }, function () {
                    eFunc();
                });
            };
            ServerService.prototype.createTrackingDirectory = function () {
                this.$cordovaFile.createDir(cordova.file.documentsDirectory, "tracking", false)
                    .then(function () {
                    console.log('Created new tracking directory');
                }, function (error) {
                    // Directory already exists
                    console.log('Tracking directory exists' + error);
                });
            };
            ServerService.prototype.startCaptureAudio = function (taskFilename, sFunc, eFunc) {
                if (this.desktopBrowserTesting) {
                    return;
                }
                else {
                    // https://github.com/remoorejr/cordova-plugin-media-with-compression
                    var options = {
                        SampleRate: 32000,
                        NumberOfChannels: 1,
                        duration: 60
                    };
                    this.day3AudioFile = new Media("documents://" + taskFilename, function () {
                        console.log('Recording Task audio...');
                        sFunc();
                    }, function (error) {
                        console.log('Record Task audio error: ' + error.code);
                        eFunc();
                    });
                    this.day3RecordingTimer = Date.now();
                    this.day3AudioFile.startRecordWithCompression(options);
                }
            };
            ServerService.prototype.stopCaptureAudio = function (taskFilename, currentUsage, newTrackingAudioFilename, sFunc, eFunc) {
                var _this = this;
                if (this.desktopBrowserTesting) {
                    return;
                }
                if (typeof this.day3AudioFile !== 'undefined' && this.day3AudioFile !== null) {
                    this.day3AudioFile.stopRecord();
                    this.day3AudioFile.release();
                    if (currentUsage.audio_file !== '') {
                        this.removeFile(cordova.file.documentsDirectory + 'tracking/', currentUsage.audio_file, function () {
                            console.log('Older audio recording removed for this Tracking');
                            currentUsage.audio_file = '';
                        }, function (error) {
                            eFunc(error);
                        });
                    }
                    if (Date.now() - this.day3RecordingTimer < 1000) {
                        this.removeFile(cordova.file.documentsDirectory, taskFilename, function () {
                            console.log('Too short Tracking audio file removed');
                            sFunc(null);
                        }, function (error) {
                            eFunc(error);
                        });
                    }
                    else {
                        this.$cordovaFile.copyFile(cordova.file.documentsDirectory, taskFilename, cordova.file.documentsDirectory + 'tracking/', newTrackingAudioFilename)
                            .then(function () {
                            currentUsage.audio_file = newTrackingAudioFilename;
                            _this.checkFile(taskFilename, sFunc, eFunc);
                        }, function (error) {
                            console.log('Copy Tracking audio error' + error);
                        });
                    }
                }
                else {
                    currentUsage.audio_file = '';
                    this.checkFile(taskFilename, sFunc, eFunc);
                }
            };
            ServerService.prototype.getDeviceID = function () {
                if (this.desktopBrowserTesting) {
                    return 'desktop device';
                }
                else {
                    return this.$cordovaDevice.getUUID();
                }
            };
            ServerService.prototype.getAppVersion = function (callback) {
                if (this.desktopBrowserTesting) {
                    callback('desktop');
                }
                else {
                    this.$cordovaAppVersion.getVersionNumber()
                        .then(function (version) {
                        callback(version);
                    });
                }
            };
            ServerService.$inject = ['$window', '$timeout'];
            return ServerService;
        }());
        Services.ServerService = ServerService;
    })(Services = MorfologiApp.Services || (MorfologiApp.Services = {}));
})(MorfologiApp || (MorfologiApp = {}));

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

/// <reference path="../../../js/_references"/>
/// <reference path="../../models/models"/>
/// <reference path="../../services/dataService"/>
var MorfologiApp;
(function (MorfologiApp) {
    var Controllers;
    (function (Controllers) {
        "use strict";
        var Task2Controller = (function () {
            function Task2Controller($scope, $timeout, dataService) {
                this.$scope = $scope;
                this.$timeout = $timeout;
                this.dataService = dataService;
                this.word = dataService.getWord();
                this.dayWord = dataService.getWordForConsolidationDay();
                this.dayIndex = dataService.getDay();
                this.stage = 'stageOne';
                this.correctCounter = 0;
                var correctToShuffle = [];
                var incorrectToShuffle = [];
                for (var i = 1; i < 25; i++) {
                    var item = {
                        image: 'content/' + this.word + '/' + this.dayWord + '/correct/' + i + '.jpg',
                        audio: 'content/' + this.word + '/' + this.dayWord + '/correct/' + i + '.mp3',
                        correct: true,
                        highlighted: false
                    };
                    correctToShuffle.push(item);
                }
                for (var i = 1; i < 7; i++) {
                    var item = {
                        image: 'content/' + this.word + '/' + this.dayWord + '/incorrect/' + i + '.jpg',
                        audio: 'content/' + this.word + '/' + this.dayWord + '/incorrect/' + i + '.mp3',
                        correct: false,
                        highlighted: false
                    };
                    incorrectToShuffle.push(item);
                }
                var stageTwoCorrect = correctToShuffle.splice(12, 12);
                var stageTwoIncorrect = incorrectToShuffle.splice(3, 3);
                this.stageOne = dataService.shuffleArray(correctToShuffle.concat(incorrectToShuffle));
                this.stageTwo = dataService.shuffleArray(stageTwoCorrect.concat(stageTwoIncorrect));
                // This should be run at the end of the constructor
                /*
                var handle = this;
                dataService.setInteractionEndActivateTaskCallback(() => {
                    this.activateTask(handle);
                });
                */
                dataService.setupAudioIntroduction('content/' + this.word + '/task1/instruction-' + this.dayWord + '.mp3');
                dataService.playAudioIntroduction(3000);
            }
            Task2Controller.prototype.activateTask = function (handle) {
            };
            Task2Controller.prototype.clickItem = function (item) {
                var _this = this;
                this.$timeout(function () {
                    new Audio(item['audio']).play();
                }, 250);
                if (item['highlighted']) {
                    return;
                }
                item['highlighted'] = true;
                if (!item.correct) {
                    this.$timeout(function () {
                        item['highlighted'] = false;
                    }, 2000);
                }
                else {
                    this.correctCounter++;
                }
                if (this.correctCounter === 12) {
                    if (this.stage === 'stageOne') {
                        this.$scope['wpC'].setAndShowOnetimeInternalForwardArrowCallback(function () {
                            _this.startStageTwo();
                        });
                    }
                    else {
                        this.$scope['wpC'].taskFinished();
                    }
                }
            };
            Task2Controller.prototype.startStageTwo = function () {
                this.stage = 'stageTwo';
                this.correctCounter = 0;
                new Audio('content/' + this.word + '/task1/instruction-' + this.dayWord + '.mp3').play();
            };
            Task2Controller.$inject = ['$scope', '$timeout', 'DataService'];
            return Task2Controller;
        }());
        Controllers.Task2Controller = Task2Controller;
    })(Controllers = MorfologiApp.Controllers || (MorfologiApp.Controllers = {}));
})(MorfologiApp || (MorfologiApp = {}));

/// <reference path="../../../js/_references"/>
/// <reference path="../../models/models"/>
/// <reference path="../../services/dataService"/>
var MorfologiApp;
(function (MorfologiApp) {
    var Controllers;
    (function (Controllers) {
        "use strict";
        var Task3Controller = (function () {
            function Task3Controller($scope, $timeout, dataService) {
                var _this = this;
                this.$scope = $scope;
                this.$timeout = $timeout;
                this.dataService = dataService;
                this.iHeight = 111;
                this.iWidth = 148;
                this.onDropComplete = function (item) {
                    var _this = this;
                    new Audio(item['audio']).play();
                    if (item['correct']) {
                        var iWidth = 80, iHeight = 60, leftOffset = 90, topOffset = 122, shiftFactor = 1.5;
                        this.droppedObjects.push(item);
                        var itemIndex = this['draggableObjects' + this.round].indexOf(item);
                        this['draggableObjects' + this.round].splice(itemIndex, 1);
                        var i = this.droppedObjects.length - 1;
                        item['style'] = {
                            'position': 'absolute',
                            'top': topOffset + i * shiftFactor + 'px',
                            'left': leftOffset - i * shiftFactor + 'px',
                            'width': iWidth + (2 * i * shiftFactor) + 'px',
                            'height': iHeight + (2 * i * shiftFactor) + 'px',
                            'transform': 'none'
                        };
                        if (this.droppedObjects.length === 24) {
                            this.bounce = true;
                            this.$timeout(function () {
                                _this.page = 3;
                            }, 2000);
                        }
                        else if (this.droppedObjects.length === 8 || this.droppedObjects.length === 16) {
                            this.bounce = true;
                            this.$timeout(function () {
                                _this.bounce = false;
                                _this.page = 1;
                                _this.playMainIntro();
                            }, 2000);
                        }
                    }
                };
                this.word = dataService.getWord();
                this.dayWord = dataService.getWordForConsolidationDay();
                this.dayIndex = dataService.getDay();
                this.page = 1;
                this.round = 0;
                this.bounce = false;
                this.familyCharacter = '';
                this.droppedObjects = [];
                this.draggableObjects1 = [];
                this.draggableObjects2 = [];
                this.draggableObjects3 = [];
                this.vanIsClosed = false;
                this.activatePointer = false;
                this.kangarooData = [
                    {
                        body: {
                            width: '500px',
                            bottom: '100px',
                            left: '-80px'
                        },
                        pouch: {
                            width: '150px',
                            height: '150px',
                            left: '70px',
                            top: '300px'
                        },
                        pointer: {
                            left: '100px',
                            top: '400px'
                        },
                        pageThreeData: {
                            "code": "zoomable-image",
                            "id": 11,
                            "sequence": -1,
                            "description": "kangaroo jumps off screen",
                            "start": {
                                "x": -50,
                                "y": 250,
                                "w": 400,
                                "h": 400
                            },
                            "transition": {
                                "x": 1900,
                                "y": 800,
                                "scale": 1,
                                "duration": 4
                            },
                            "opacity": 1,
                            "visible_before": true,
                            "visible_after": true,
                            "auto_start": true,
                            "auto_return": false,
                            "allow_return": false,
                            "type": "png"
                        }
                    },
                    {
                        body: {
                            width: '500px',
                            bottom: '100px',
                            left: '-100px'
                        },
                        pouch: {
                            width: '150px',
                            height: '150px',
                            left: '65px',
                            top: '350px'
                        },
                        pointer: {
                            left: '350px',
                            top: '500px'
                        },
                        pageThreeData: {
                            "code": "zoomable-image",
                            "id": 12,
                            "sequence": -1,
                            "description": "kangaroo jumps off screen",
                            "start": {
                                "x": 250,
                                "y": 380,
                                "w": 300,
                                "h": 300
                            },
                            "transition": {
                                "x": -1900,
                                "y": -400,
                                "scale": 1,
                                "duration": 5
                            },
                            "opacity": 1,
                            "visible_before": true,
                            "visible_after": true,
                            "auto_start": true,
                            "auto_return": false,
                            "allow_return": false,
                            "type": "png"
                        }
                    },
                    {
                        body: {
                            width: '500px',
                            bottom: '100px',
                            left: '-100px'
                        },
                        pouch: {
                            width: '100px',
                            height: '100px',
                            left: '140px',
                            top: '400px'
                        },
                        pointer: {
                            left: '550px',
                            top: '450px'
                        },
                        pageThreeData: {
                            "code": "zoomable-image",
                            "id": 13,
                            "sequence": -1,
                            "description": "kangaroo jumps off screen",
                            "start": {
                                "x": 450,
                                "y": 300,
                                "w": 250,
                                "h": 250
                            },
                            "transition": {
                                "x": -1000,
                                "y": -1000,
                                "scale": 1,
                                "duration": 3
                            },
                            "opacity": 1,
                            "visible_before": true,
                            "visible_after": true,
                            "auto_start": true,
                            "auto_return": false,
                            "allow_return": false,
                            "type": "png"
                        }
                    }
                ];
                var correctToShuffle = [];
                var incorrectToShuffle = [];
                for (var i = 1; i < 25; i++) {
                    var item = {
                        image: 'content/' + this.word + '/' + this.dayWord + '/correct/' + i + '.jpg',
                        audio: 'content/' + this.word + '/' + this.dayWord + '/correct/' + i + '.mp3',
                        correct: true,
                        style: {
                            'top': 0,
                            'left': 0,
                            'width': 0,
                            'height': 0
                        },
                        highlighted: false,
                        draggable: true,
                        transition: true,
                        position: 0
                    };
                    correctToShuffle.push(item);
                }
                for (var i = 1; i < 7; i++) {
                    var item = {
                        image: 'content/' + this.word + '/' + this.dayWord + '/incorrect/' + i + '.jpg',
                        audio: 'content/' + this.word + '/' + this.dayWord + '/incorrect/' + i + '.mp3',
                        correct: false,
                        style: {
                            'top': 0,
                            'left': 0,
                            'width': 0,
                            'height': 0
                        },
                        highlighted: false,
                        draggable: true,
                        transition: true,
                        position: 0
                    };
                    incorrectToShuffle.push(item);
                }
                var correctShuffled = dataService.shuffleArray(correctToShuffle);
                var incorrectShuffled = dataService.shuffleArray(incorrectToShuffle);
                this.draggableObjects1 = dataService.shuffleArray(correctShuffled.splice(0, 8).concat(incorrectShuffled.splice(0, 2)));
                this.draggableObjects2 = dataService.shuffleArray(correctShuffled.splice(0, 8).concat(incorrectShuffled.splice(0, 2)));
                this.draggableObjects3 = dataService.shuffleArray(correctShuffled.concat(incorrectShuffled));
                //this.itemSource = dataService.shuffleArray(correctToShuffle.concat(incorrectToShuffle));
                this.dataService.setupAudioIntroduction('content/common/audio/consolidation/task5/introduction.mp3');
                this.dataService.playAudioIntroduction(2000);
                this.$timeout(function () {
                    _this.playMainIntro();
                }, 11000);
            }
            Task3Controller.prototype.playMainIntro = function () {
                var _this = this;
                this.dataService.setupAudioIntroduction('content/common/audio/consolidation/task5/introround' + (this.round + 1) + '.mp3');
                this.dataService.playAudioIntroduction(2000);
                this.$timeout(function () {
                    _this.activatePointer = true;
                }, 3000);
            };
            Task3Controller.prototype.clickKangaroo = function (index) {
                var _this = this;
                this.activatePointer = false;
                if (index === this.round + 1) {
                    this.bounce = true;
                    this.$timeout(function () {
                        _this.round = index;
                        _this.page = 2;
                        _this.bounce = false;
                        _this.introduction();
                    }, 2000);
                }
            };
            Task3Controller.prototype.introduction = function () {
                var _this = this;
                this.setupImages();
                this.dataService.setupAudioIntroduction('content/' + this.word + '/task5/' + this.dayWord + '.mp3');
                this.dataService.playAudioIntroduction(2000);
                this.$timeout(function () {
                    _this.enlargeImages();
                }, 1500);
            };
            Task3Controller.prototype.setupImages = function () {
                var vGap = 30, hGap = 30;
                for (var n = 1; n < 4; n++) {
                    var list = this['draggableObjects' + n];
                    for (var position = 0; position < list.length; position++) {
                        // Prepare the images for popping up from their center points
                        list[position]['style'] = {
                            'position': 'absolute',
                            'top': (this.iHeight + vGap) * Math.floor(position / 2) + Math.floor(this.iHeight / 2) + 'px',
                            'left': (this.iWidth + hGap) * (position % 2) + Math.floor(this.iWidth / 2) + 'px',
                            'width': '0',
                            'height': '0'
                        };
                    }
                }
            };
            Task3Controller.prototype.enlargeImages = function () {
                var vGap = 30, hGap = 30;
                var items = this['draggableObjects' + this.round];
                for (var position = 0; position < items.length; position++) {
                    items[position]['style'] = {
                        'position': 'absolute',
                        'top': (this.iHeight + vGap) * Math.floor(position / 2) + 'px',
                        'left': (this.iWidth + hGap) * (position % 2) + 'px',
                        'width': this.iWidth + 'px',
                        'height': this.iHeight + 'px'
                    };
                }
                this.$timeout(function () {
                    for (var position = 0; position < items.length; position++) {
                        items[position]['transition'] = false; // Transition effects dragging, so turn it off now
                    }
                }, 1000);
            };
            Task3Controller.prototype.jumpOffPageThreeCompleted = function () {
                this.$scope['wpC'].taskFinished();
            };
            Task3Controller.clickImage = function (filename) {
                new Audio(filename).play();
            };
            Task3Controller.$inject = ['$scope', '$timeout', 'DataService'];
            return Task3Controller;
        }());
        Controllers.Task3Controller = Task3Controller;
    })(Controllers = MorfologiApp.Controllers || (MorfologiApp.Controllers = {}));
})(MorfologiApp || (MorfologiApp = {}));

/// <reference path="../../../js/_references"/>
/// <reference path="../../models/models"/>
/// <reference path="../../services/dataService"/>
var MorfologiApp;
(function (MorfologiApp) {
    var Controllers;
    (function (Controllers) {
        "use strict";
        var Task5Controller = (function () {
            function Task5Controller($scope, $timeout, dataService) {
                var _this = this;
                this.$scope = $scope;
                this.$timeout = $timeout;
                this.dataService = dataService;
                this.iHeight = 111;
                this.iWidth = 148;
                this.onDropComplete = function (item) {
                    new Audio(item['audio']).play();
                    if (item['correct']) {
                        var iWidth = 80, iHeight = 60, leftOffset = 90, topOffset = 122, shiftFactor = 1.5;
                        this.droppedObjects.push(item);
                        var itemIndex = this['draggableObjects' + this.round].indexOf(item);
                        this['draggableObjects' + this.round].splice(itemIndex, 1);
                        var i = this.droppedObjects.length - 1;
                        item['style'] = {
                            'position': 'absolute',
                            'top': topOffset + i * shiftFactor + 'px',
                            'left': leftOffset - i * shiftFactor + 'px',
                            'width': iWidth + (2 * i * shiftFactor) + 'px',
                            'height': iHeight + (2 * i * shiftFactor) + 'px',
                            'transform': 'none'
                        };
                        if (this.droppedObjects.length === 24) {
                            this.opacity = 0;
                            this.closeVan();
                        }
                        else if (this.droppedObjects.length === 8 || this.droppedObjects.length === 16) {
                            this.opacity = 0;
                            this.introduction();
                        }
                    }
                };
                this.word = dataService.getWord();
                this.dayWord = dataService.getWordForConsolidationDay();
                this.dayIndex = dataService.getDay();
                this.page = 1;
                this.round = 0;
                this.familyCharacter = '';
                this.droppedObjects = [];
                this.draggableObjects1 = [];
                this.draggableObjects2 = [];
                this.draggableObjects3 = [];
                this.vanIsClosed = false;
                this.opacity = 0;
                this.pageOneImageData = {
                    "code": "zoomable-image",
                    "id": 11,
                    "sequence": -1,
                    "description": "car drives on to screen",
                    "start": {
                        "x": -900,
                        "y": 100,
                        "w": 800,
                        "h": 600
                    },
                    "transition": {
                        "x": 900,
                        "y": 0,
                        "scale": 1,
                        "duration": 5
                    },
                    "opacity": 1,
                    "visible_before": true,
                    "visible_after": true,
                    "auto_start": true,
                    "auto_return": false,
                    "allow_return": false,
                    "type": "png"
                };
                this.pageThreeImageData = {
                    "code": "zoomable-image",
                    "id": 11,
                    "sequence": -1,
                    "description": "car drives off screen",
                    "start": {
                        "x": -900,
                        "y": 100,
                        "w": 800,
                        "h": 600
                    },
                    "transition": {
                        "x": 1900,
                        "y": 0,
                        "scale": 1,
                        "duration": 6
                    },
                    "opacity": 1,
                    "visible_before": true,
                    "visible_after": true,
                    "auto_start": true,
                    "auto_return": false,
                    "allow_return": false,
                    "type": "png"
                };
                var correctToShuffle = [];
                var incorrectToShuffle = [];
                for (var i = 1; i < 25; i++) {
                    var item = {
                        image: 'content/' + this.word + '/' + this.dayWord + '/correct/' + i + '.jpg',
                        audio: 'content/' + this.word + '/' + this.dayWord + '/correct/' + i + '.mp3',
                        correct: true,
                        style: {
                            'top': 0,
                            'left': 0,
                            'width': 0,
                            'height': 0
                        },
                        highlighted: false,
                        draggable: true,
                        transition: true,
                        position: 0
                    };
                    correctToShuffle.push(item);
                }
                for (var i = 1; i < 7; i++) {
                    var item = {
                        image: 'content/' + this.word + '/' + this.dayWord + '/incorrect/' + i + '.jpg',
                        audio: 'content/' + this.word + '/' + this.dayWord + '/incorrect/' + i + '.mp3',
                        correct: false,
                        style: {
                            'top': 0,
                            'left': 0,
                            'width': 0,
                            'height': 0
                        },
                        highlighted: false,
                        draggable: true,
                        transition: true,
                        position: 0
                    };
                    incorrectToShuffle.push(item);
                }
                var correctShuffled = dataService.shuffleArray(correctToShuffle);
                var incorrectShuffled = dataService.shuffleArray(incorrectToShuffle);
                this.draggableObjects1 = dataService.shuffleArray(correctShuffled.splice(0, 8).concat(incorrectShuffled.splice(0, 2)));
                this.draggableObjects2 = dataService.shuffleArray(correctShuffled.splice(0, 8).concat(incorrectShuffled.splice(0, 2)));
                this.draggableObjects3 = dataService.shuffleArray(correctShuffled.concat(incorrectShuffled));
                this.dataService.setInteractionEndActivateTaskCallback(function () {
                    _this.dataService.clearInteractionEndActivateTaskCallback();
                    _this.dataService.setupAudioIntroduction('content/common/audio/consolidation/task3/instruction.mp3');
                    _this.dataService.playAudioIntroduction(1000);
                });
                this.dataService.setupAudioIntroduction('content/common/audio/consolidation/task3/van-stopping.mp3');
                this.dataService.playAudioIntroduction(1000);
            }
            Task5Controller.prototype.introduction = function () {
                var _this = this;
                var audioFile = '';
                this.round++;
                this.setupImages();
                this.$timeout(function () {
                    if (_this.round === 1) {
                        _this.familyCharacter = 'mother.png';
                        audioFile = 'content/' + _this.word + '/task3/' + _this.dayWord + '/mother.mp3';
                    }
                    else if (_this.round === 2) {
                        _this.familyCharacter = 'father.png';
                        audioFile = 'content/' + _this.word + '/task3/' + _this.dayWord + '/father.mp3';
                    }
                    else {
                        _this.familyCharacter = 'daughter.png';
                        audioFile = 'content/' + _this.word + '/task3/' + _this.dayWord + '/daughter.mp3';
                    }
                    _this.dataService.setupAudioIntroduction(audioFile);
                }, 1000);
                this.$timeout(function () {
                    _this.opacity = 1;
                    _this.dataService.playAudioIntroduction(0);
                }, 2000);
                this.$timeout(function () {
                    _this.enlargeImages();
                }, 4000);
            };
            Task5Controller.prototype.setupImages = function () {
                var vGap = 10, hGap = 10;
                for (var n = 1; n < 4; n++) {
                    var list = this['draggableObjects' + n];
                    for (var position = 0; position < list.length; position++) {
                        // Prepare the images for popping up from their center points
                        list[position]['style'] = {
                            'position': 'absolute',
                            'top': (this.iHeight + vGap) * Math.floor(position / 5) + Math.floor(this.iHeight / 2) + 'px',
                            'left': (this.iWidth + hGap) * (position % 5) + Math.floor(this.iWidth / 2) + 'px',
                            'width': '0',
                            'height': '0'
                        };
                    }
                }
            };
            Task5Controller.prototype.enlargeImages = function () {
                var vGap = 10, hGap = 10;
                var items = this['draggableObjects' + this.round];
                for (var position = 0; position < items.length; position++) {
                    items[position]['style'] = {
                        'position': 'absolute',
                        'top': (this.iHeight + vGap) * Math.floor(position / 5) + 'px',
                        'left': (this.iWidth + hGap) * (position % 5) + 'px',
                        'width': this.iWidth + 'px',
                        'height': this.iHeight + 'px'
                    };
                }
                this.$timeout(function () {
                    for (var position = 0; position < items.length; position++) {
                        items[position]['transition'] = false; // Transition effects dragging, so turn it off now
                    }
                }, 1000);
            };
            Task5Controller.prototype.driveOnPageOneCompleted = function () {
                var _this = this;
                this.$scope['wpC'].setAndShowOnetimeInternalForwardArrowCallback(function () {
                    _this.page = 2;
                    _this.introduction();
                });
            };
            Task5Controller.prototype.driveOffPageThreeCompleted = function () {
                this.$scope['wpC'].taskFinished();
            };
            Task5Controller.clickImage = function (filename) {
                new Audio(filename).play();
            };
            Task5Controller.prototype.closeVan = function () {
                var _this = this;
                this.$timeout(function () {
                    _this.vanIsClosed = true;
                    new Audio('content/common/audio/consolidation/task3/van-door.mp3').play();
                    _this.$timeout(function () {
                        _this.page = 3;
                        new Audio('content/common/audio/consolidation/task3/van-driving.mp3').play();
                    }, 500);
                }, 1500);
            };
            Task5Controller.$inject = ['$scope', '$timeout', 'DataService'];
            return Task5Controller;
        }());
        Controllers.Task5Controller = Task5Controller;
    })(Controllers = MorfologiApp.Controllers || (MorfologiApp.Controllers = {}));
})(MorfologiApp || (MorfologiApp = {}));

/// <reference path="../../_references"/>
/// <reference path="../../models/models"/>
var MorfologiApp;
(function (MorfologiApp) {
    var Controllers;
    (function (Controllers) {
        "use strict";
        var MainPanelController = (function () {
            function MainPanelController($http, $location, $scope) {
                this.$http = $http;
                this.$location = $location;
                this.$scope = $scope;
                this.language = "";
                this.initialise();
            }
            MainPanelController.prototype.initialise = function () {
                // this.language = this.dataService.getLanguage();
            };
            MainPanelController.$inject = ['$http', '$location', '$scope'];
            return MainPanelController;
        }());
        Controllers.MainPanelController = MainPanelController;
    })(Controllers = MorfologiApp.Controllers || (MorfologiApp.Controllers = {}));
})(MorfologiApp || (MorfologiApp = {}));

/// <reference path="../../_references"/>
/// <reference path="../../models/models"/>
var MorfologiApp;
(function (MorfologiApp) {
    var Controllers;
    (function (Controllers) {
        "use strict";
        var TestPanelController = (function () {
            function TestPanelController($http, $location, $scope) {
                this.$http = $http;
                this.$location = $location;
                this.$scope = $scope;
                this.language = "";
                this.initialise();
            }
            TestPanelController.prototype.initialise = function () {
                // this.language = this.dataService.getLanguage();
            };
            TestPanelController.$inject = ['$http', '$location', '$scope'];
            return TestPanelController;
        }());
        Controllers.TestPanelController = TestPanelController;
    })(Controllers = MorfologiApp.Controllers || (MorfologiApp.Controllers = {}));
})(MorfologiApp || (MorfologiApp = {}));

//# sourceMappingURL=MorfApp.bundle.js.map
