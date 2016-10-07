/// <reference path="../_references.ts"/>

module MorfologiApp {

    "use strict";
    import MomentDuration = moment.Duration;

    interface Serializable<T> {
        deserialise(input: Object): T;
    }


    class Audio {
        task_guidance_100: string;

        deserialise(input) {
            for (var key in input) {
                if (input.hasOwnProperty(key)) {
                    this[key] = input[key];
                }
            }
            return this;
        }

        getKey(key) {
            if (this.hasOwnProperty(key)) {
                return this[key];
            }
        }

    }

    class Video {

        deserialise(input) {
            for (var key in input) {
                if (input.hasOwnProperty(key)) {
                    this[key] = input[key];
                }
            }
            return this;
        }

        getKey(key) {
            if (this.hasOwnProperty(key)) {
                return this[key];
            }
        }
    }

    class Image {
        move_forward: string;
        move_backward: string;
        exit_to_menu: string;

        deserialise(input) {
            for (var key in input) {
                if (input.hasOwnProperty(key)) {
                    this[key] = input[key];
                }
            }
            return this;
        }

        getKey(key) {
            if (this.hasOwnProperty(key)) {
                return this[key];
            }
        }
    }

    export class Common {
        revision: number;
        audio: Audio;
        video: Video;
        image: Image;

        constructor() {
            this.audio = new Audio();
            this.video = new Video();
            this.image = new Image();
        }
    }

    export class Reward {
        weekIndex: number;        // Used to reference the file name. Equates to the 'current day' index.  *COMPULSORY*
        dayIndex: number;
        type: string;
        xpos: number;
        ypos: number;
        width: number;
        height: number;

        constructor(week: number, day: number, type: string) {
            this.type = type;
            this.dayIndex = day;
            this.weekIndex = week;
            this.width = 50;
            this.height = 50;
        }
    }

    export class Achievement {  // As the weeks are completed linearly, we only keep track of the highest
        avatar: number;
        weekIndex: number;        // Index of the most recent week completed
        dayIndex: number;         // Index of the most recent day completed
        taskIndex: number;        // Index of the most recent task completed
        rewards: Reward[];        // Each reward 'src' should be created to match the week and day indexes
                                  // e.g. found in the form /common/images/rewards/week-<weekIndex>/<dayIndex>.gif

        constructor() {
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
        hasCollectedReward(week, day): boolean {
            for (var r = 0; r < this.rewards.length; r++) {
                if (this.rewards[r].weekIndex === week && this.rewards[r].dayIndex === day) {
                    return true;
                }
            }
            return false;
        }

        completeTask(weekIndex, dayIndex, taskIndex) {
            if (weekIndex > this.weekIndex && dayIndex > this.dayIndex && taskIndex > this.taskIndex) {
                this.taskIndex = taskIndex;
            }
        }

        completeDay(weekIndex, dayIndex) {
            if (weekIndex > this.weekIndex && dayIndex > this.dayIndex) {
                this.dayIndex = dayIndex;
                this.taskIndex = -1;
            }
        }

        completeWeek(weekIndex) {
            if (weekIndex > this.weekIndex) {
                this.weekIndex = weekIndex;
                this.dayIndex = this.taskIndex = -1;
            }
        }

    }

    export class Overlay {
        id: number;               // Used to reference the file name.   *COMPULSORY*
        type: string;             // File type. matches file extension  *COMPULSORY*
        sequence: number;         // This image is part of a sequence that must be viewed in order.
        description: string;
        start: {
            x: number,
            y: number,
            w: number,
            h: number
        };
        transition: {
            x: number,
            y: number,
            scale: number,
            duration: number
        };
        map: {                   // Defines clickable area (used for Focus Image)
            x: number,
            y: number,
            w: number,
            h: number
        };
        pointer: {
            x: number,
            y: number,
            retain: boolean
        };
        opacity: number;
        visible_before: boolean;  // Zoomable images. Show the image before zooming up.
        visible_after: boolean;   // Zoomable images. Continue to show the image after zooming down
        auto_return: boolean;     // Zoomable images.  Zoom back down again
        allow_return: boolean;    // Zoomable images. Allow zoom back down.
        auto_start: boolean;      // Activate this Overlay automatically
        timeout: number;          // in seconds.  Time before hiding
        delay: number;            // in seconds.  Delay time before showing
        active: boolean;          // Currently clickable. Shows bouncing arrow.
        completed: boolean;       // The function of this Overlay is deemed 'complete'

        constructor() {
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

        setItem(key, value) {
            if (this.hasOwnProperty(key) && typeof value !== 'undefined') {
                this[key] = value;
            }
        }
    }

    export class Overlays {
        display_delay: number;              // How long the overlay for this page delays before activating
        zoomable_images: Overlay[];
        appearing_images: Overlay[];
        playable_audio: Overlay[];
        focus_images: Overlay[];           // Focus is using the background image, so only one Overlay in this array

        constructor() {
            this.display_delay = 0;
            this.zoomable_images = [];
            this.appearing_images = [];
            this.playable_audio = [];
            this.focus_images = [];
        }
    }

    export class Book {
        reference: string;
        label_en: string;
        thumbnail: number;
        record_audio: boolean;
        backgrounds: number[];
        completed: boolean;
        overlays: { [id: string]: Overlays };       // 'id' references the page number in 'backgrounds'

        constructor() {
            this.reference = '';
            this.label_en = '';
            this.thumbnail = -1;
            this.record_audio = false;
            this.backgrounds= [];
            this.completed = false;
            this.overlays = {};
        }

        setItem(key, value) {
            if (this.hasOwnProperty(key) && typeof value !== 'undefined') {
                this[key] = value;
            }
        }
    }

    export class Task {
        type: string;
        record_audio: boolean;
        completed: boolean;
        structure: {};
        play_introduction: boolean;

        constructor() {
            this.type = '100';
            this.record_audio = false;
            this.completed = false;
            this.play_introduction = true;
        }
    }

    class Day {
        completed: boolean;
        tasks: Task[];

        constructor() {
            this.completed = false;
            this.tasks = [];
        }
    }

    export class Week {
        word_en: string;
        word_no: string;
        book_index: number;
        completed: boolean;
        days: Day[];

        constructor() {
            this.completed = false;
            this.days = [];
        }
    }

    export class Setup {
        common: Common;
        books: Book[];
        weeks: Week[];

        constructor() {
            this.books = [];
            this.weeks = [];
        }

        deserialise(input) {
            let commonKey = 'common', imageKey = 'image', audioKey = 'audio', videoKey = 'video';

            let booksKey = 'books', referenceKey = 'reference', backgroundKey = 'backgrounds', overlaysKey = 'overlays';
            let labelEnKey = 'label_en', labelNoKey = 'label_no', thumbnailKey = 'thumbnail', revisionKey = 'revision';
            let idKey = 'id', sequenceKey = 'sequence', descriptionKey = 'description', delayKey = 'delay';
            let startKey = 'start', transitionKey = 'transition', xKey = 'x', yKey = 'y', wKey = 'w', hKey = 'h';
            let opacityKey = 'opacity', visibleBeforeKey = 'visible_before', visibleAfterKey = 'visible_after';
            let autoReturnKey = 'auto_return', typeKey = 'type', timeoutKey = 'timeout', autoStartKey = 'auto_start';
            let allowReturnKey = 'allow_return', scaleKey = 'scale', durationKey = 'duration', mapKey = 'map';

            let weeksKey = 'weeks', wordEnKey = 'word_en', wordNoKey = 'word_no', bookIndexKey = 'book_index';
            let daysKey = 'days', tasksKey = 'tasks', recordAudioKey = 'record_audio', focusKey = 'focus';
            let playIntroKey = 'play_introduction', activeKey = 'active', structureKey = 'structure';
            let pointerKey = 'pointer', retainKey = 'retain', displayDelayKey = 'display_delay';

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
                                } else {
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
        }


        /**
         * Mark the specified Task as complete
         *
         * @param w
         * @param d
         * @param t
         */
        markTaskAsCompleted(w: number, d: number, t: number) {
            this.weeks[w].days[d].tasks[t].completed = true;
        }

        /**
         * Mark the specified Day as complete
         *
         * @param w
         * @param d
         */
        markDayAsCompleted(w: number, d: number) {
            this.weeks[w].days[d].completed = true;
        }

        /**
         * Mark the specified Week as complete
         *
         * @param w
         */
        markWeekAsCompleted(w: number) {
            this.weeks[w].completed = true;
        }

        /**
         * Mark the specified Book as complete
         *
         * @param book_index
         */
        markBookAsCompleted(week: number) {
            // Not all weeks have books
            if (this.weeks[week].book_index !== -1) {
                this.books[this.weeks[week].book_index].completed = true;
            }
        }

    }


    export class UsagePostData {
        user: string;
        word_en: string;
        word_no: string;
        week: number;
        day: number;
        task: number;
        book: string;
        completed_on: Date;
        day_skipped: boolean;
        accessed: Date;
        duration: number;
        audio_file: string;
        usage_record: UsageStorage;

        constructor(user: string, week_index: number, word_en: string, word_no: string, day_index: number,
                    task_index: number, book_reference: string, completed_on: Date, skipped: boolean, accessed: Date,
                    duration: number, audio_file: string, usage_record: UsageStorage) {
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

        asFormDataWithAttachment(file: File, UUID: string): FormData {
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
            } else {
                fd.append('answersAsMap[560777].textAnswer', '');
            }
            fd.append('answersAsMap[559416].textAnswer', this.day_skipped);
            fd.append('answersAsMap[557046].textAnswer', this.asNettskjemaDateFormat(this.accessed));
            fd.append('answersAsMap[557047].textAnswer', this.duration);
            if (file !== null) {
                var blob = new Blob([file], { type: "audio/x-m4a"});
                fd.append('answersAsMap[559418].attachment.upload', blob, this.audio_file);
            }
            fd.append('answersAsMap[576155].textAnswer', UUID);
            return fd;
        }

        markAsSynced() {
            this.usage_record.synced = true;
        }

        asNettskjemaDateFormat(d: Date): string {
            return d.getDate() + '.' + (d.getMonth() + 1) + '.' + d.getFullYear() + ' ' +
                d.getHours() + ':' + d.getMinutes();
        }
    }

    export class UsageStorage implements Serializable<UsageStorage> {
        accessed: Date;
        duration: number;     // in seconds
        audio_file: string;
        synced: boolean;

        constructor() {
            this.duration = 0;
            this.synced = false;
            this.audio_file = '';
        }

        deserialise(input: any) {
            let accessedKey = 'accessed', durationKey = 'duration', syncedKey = 'synced', audioKey = 'audio_file';
            this.accessed = new Date(input[accessedKey]);
            this.duration = input[durationKey];
            this.audio_file = input[audioKey];
            this.synced = input[syncedKey];
            return this;
        }

    }

    class BookStorage {
        reference: string;
        completed_on: Date;
        usage: UsageStorage[];
        currentUsage: UsageStorage;

        constructor() {
            this.completed_on = null;
            this.usage = [];
            this.currentUsage = null;
        }

        setItem(key, value) {
            if (this.hasOwnProperty(key) && typeof value !== 'undefined' && value !== null) {
                this[key] = value;
            }
        }
    }

    class TaskStorage {
        completed_on: Date;
        usage: UsageStorage[];
        currentUsage: UsageStorage;

        constructor() {
            this.completed_on = null;
            this.usage = [];
            this.currentUsage = null;
        }

        setItem(key, value) {
            if (this.hasOwnProperty(key) && typeof value !== 'undefined' && value !== null) {
                this[key] = value;
            }
        }
    }

    class DayStorage {
        completed_on: Date;
        skipped: boolean;
        tasks: TaskStorage[];
        book_read: boolean;

        constructor() {
            this.completed_on = null;
            this.skipped = false;
            this.tasks = [];
            this.book_read = false;
        }

        setItem(key, value) {
            if (this.hasOwnProperty(key) && typeof value !== 'undefined' && value !== null) {
                this[key] = value;
            }
        }
    }

    export class WeekStorage {
        word_en: string;
        word_no: string;
        completed_on: Date;
        book: BookStorage;
        days: DayStorage[];

        constructor() {
            this.completed_on = null;
            this.days = [];
        }

        setItem(key, value) {
            if (this.hasOwnProperty(key) && typeof value !== 'undefined' && value !== null) {
                this[key] = value;
            }
        }
    }

    export class Storage implements Serializable<Storage> {
        username: string;
        revision: number;
        achievement: Achievement;
        weeks: WeekStorage[];

        constructor() {
            this.weeks = [];
            this.achievement = new Achievement();
        }

        /**
         * Create tracking objects to match the current Setup
         *
         * @param setup
         * @param username
         */
        initialise(setup: Setup, username: string) {
            let commonKey = 'common', revisionKey = 'revision';
            let weeksKey = 'weeks', wordEnKey = 'word_en', wordNoKey = 'word_no', bookKey = 'book', booksKey = 'books';
            let daysKey = 'days', tasksKey = 'tasks', bookIndexKey = 'book_index', referenceKey = 'reference';

            this.username = username;
            this.revision = setup[commonKey][revisionKey];

            setup[weeksKey].forEach((w) => {
                var newWeek = new WeekStorage();
                newWeek[wordEnKey] = w[wordEnKey];
                newWeek[wordNoKey] = w[wordNoKey];
                var bookIndex = w[bookIndexKey];
                newWeek[bookKey] = new BookStorage();
                if (bookIndex !== -1) {
                    newWeek[bookKey][referenceKey] = setup[booksKey][bookIndex][referenceKey];
                } else {
                    newWeek[bookKey][referenceKey] = 'consolidation';
                }
                w[daysKey].forEach((d) => {
                    var newDay = new DayStorage();
                    d[tasksKey].forEach((t) => {
                        var newTask = new TaskStorage();
                        newDay[tasksKey].push(newTask);
                    });
                    newWeek[daysKey].push(newDay);
                });
                this.weeks.push(newWeek);
            });
            return this;
        }


        deserialise(input) {
            let usageKey = 'usage', usernameKey = 'username', completedOnKey = 'completed_on', revisionKey = 'revision';
            let achievementKey = 'achievement', avatarKey = 'avatar', taskIndexKey = 'taskIndex', dayIndexKey = 'dayIndex', weekIndexKey = 'weekIndex';
            let weeksKey = 'weeks', wordEnKey = 'word_en', wordNoKey = 'word_no', bookKey = 'book', labelKey = 'label_en';
            let daysKey = 'days', tasksKey = 'tasks', referenceKey = 'reference', bookReadKey = 'book_read';
            let rewardsKey = 'rewards', rewardIdKey = 'id', rewardTypeKey = 'type', rewardXKey = 'xpos', rewardYKey = 'ypos';

            this.username = input[usernameKey];
            this.revision = input[revisionKey];

            this.achievement = new Achievement();
            this.achievement[avatarKey] = input[achievementKey][avatarKey];
            this.achievement[taskIndexKey] =  input[achievementKey][taskIndexKey];
            this.achievement[dayIndexKey] = input[achievementKey][dayIndexKey];
            this.achievement[weekIndexKey] = input[achievementKey][weekIndexKey];

            // Bug fix one time only..

            if (this.achievement[weekIndexKey] === 0 && this.achievement[dayIndexKey] >= 2) {
                this.achievement[dayIndexKey] = 1;
            } else if (this.achievement[weekIndexKey] === 1 && this.achievement[dayIndexKey] >= 2) {
                this.achievement[dayIndexKey] = 0;
            }

            //

            for ( var r = 0; r < input[achievementKey][rewardsKey].length; r++) {
                var reward = new Reward(input[achievementKey][rewardsKey][r][weekIndexKey],
                    input[achievementKey][rewardsKey][r][dayIndexKey],
                    input[achievementKey][rewardsKey][r][rewardTypeKey]);
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
        }

        /**
         * get a list of all tracking files previously created
         */
        getTrackingFileList(): string[] {
            var list: string[] = [];
            this.weeks.forEach((week: WeekStorage) => {
                week.days.forEach((day: DayStorage) => {
                    day.tasks.forEach((task: TaskStorage) => {
                        task.usage.forEach((usage: UsageStorage) => {
                            if(usage.audio_file !== '') {
                                list.push(usage.audio_file);
                            }
                        })
                    })
                })
            });
            return list;
        }

        /**
         * Flattens the data structure appropriate for posting to Nettskjema
         */
        asPostableUsageData() {
            var postArray = [];
            for (var w = 0; w < this.weeks.length; w++) {
                // Task usage
                for (var d = 0; d < this.weeks[w].days.length; d++) {
                    for (var t = 0; t < this.weeks[w].days[d].tasks.length; t++) {
                        for (var u = 0; u < this.weeks[w].days[d].tasks[t].usage.length; u++) {
                            if(!this.weeks[w].days[d].tasks[t].usage[u].synced) {
                                postArray.push(new UsagePostData(
                                    this.username, w, this.weeks[w].word_en, this.weeks[w].word_no, d, t, '-',
                                    this.weeks[w].days[d].tasks[t].completed_on,
                                    this.weeks[w].days[d].skipped,
                                    this.weeks[w].days[d].tasks[t].usage[u].accessed,
                                    this.weeks[w].days[d].tasks[t].usage[u].duration,
                                    this.weeks[w].days[d].tasks[t].usage[u].audio_file,
                                    this.weeks[w].days[d].tasks[t].usage[u]));
                            }
                        }
                    }
                }
                // Book usage
                for (var bu = 0; bu < this.weeks[w].book.usage.length; bu++) {
                    if(!this.weeks[w].book.usage[bu].synced) {
                        postArray.push(new UsagePostData(
                            this.username, w, this.weeks[w].word_en, this.weeks[w].word_no, -1, -1, this.weeks[w].book.reference,
                            this.weeks[w].book.completed_on, false,
                            this.weeks[w].book.usage[bu].accessed,
                            this.weeks[w].book.usage[bu].duration,
                            this.weeks[w].book.usage[bu].audio_file,
                            this.weeks[w].book.usage[bu]));
                    }
                }
            }
            return postArray;
        }

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
        addTaskUsage(w: number, d: number, t: number, accessed: Date, duration: number, audio_file: string ) {
            var usageStorage = new UsageStorage();
            usageStorage.accessed = accessed;
            usageStorage.duration = duration;
            usageStorage.audio_file = audio_file;
            this.weeks[w].days[d].tasks[t].usage.push(usageStorage);
            this.weeks[w].days[d].tasks[t].currentUsage = usageStorage;
        }

        /**
         * Add a new Usage to a Book with access datestamp and duration
         *
         * @param w
         * @param accessed
         * @param duration
         * @param audio_file
         */
        addBookUsage(w: number, accessed: Date, duration: number, audio_file: string ) {
            var usageStorage = new UsageStorage();
            usageStorage.accessed = accessed;
            usageStorage.duration = duration;
            usageStorage.audio_file = audio_file;
            this.weeks[w].book.usage.push(usageStorage);
            this.weeks[w].book.currentUsage = usageStorage;
        }

        /**
         * Mark the specified TaskStorage as complete
         *
         * @param w
         * @param d
         * @param t
         */
        markTaskAsCompleted(w: number, d: number, t: number) {
            if (this.weeks[w].days[d].tasks[t].completed_on == null) {
                this.weeks[w].days[d].tasks[t].completed_on = new Date();
            }
        }

        /**
         * Mark the specified Day as complete
         *
         * @param w
         * @param d
         */
        markDayAsCompleted(w: number, d: number) {
            if (this.weeks[w].days[d].completed_on == null) {
                this.weeks[w].days[d].completed_on = new Date();
            }
        }

        /**
         * Mark the specified Week as complete
         *
         * @param w
         */
        markWeekAsCompleted(w: number) {
            if (this.weeks[w].completed_on == null) {
                this.weeks[w].completed_on = new Date();
            }
        }

        /**
         * Mark the specified BookStorage as complete
         *
         * @param w
         */
        markBookAsCompleted(w: number) {
            if (this.weeks[w].book.completed_on == null) {
                this.weeks[w].book.completed_on = new Date();
            }
        }

        /**
         * Mark the specified day as 'skipped'
         *
         * @param w
         * @param d
         */
        markDayAsSkipped(w: number, d: number) {
            this.weeks[w].days[d].skipped = true;
        }

        /**
         * Mark all of the current set as 'synced' after a successful POST to Nettskjema
         */
        markAllAsSynced() {
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
        }


    }

}
