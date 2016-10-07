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
//# sourceMappingURL=models.js.map