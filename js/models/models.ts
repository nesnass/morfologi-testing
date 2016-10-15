/// <reference path="../_references.ts"/>

namespace MorfologiApp {
    import Moment = moment.Moment;
    import MomentDuration = moment.Duration;
    "use strict";

    interface DeSerializable<T> {
        deSerialise(input: Object): T;
    }

    export class Morf {
        key: string;
        root: string;
        morphed: string;
        position: string;

        constructor(key, root, morphed, position) {
            this.key = key;
            this.root = root;
            this.morphed = morphed;
            this.position = position;
        }
    }

    // Represents one task in a set that is produced for a user session
    export class Task {
        morf: Morf;           // index of the Morf in Session 'morfs' array
        template: number;
        completed: boolean;
        started: Date;
        finished: Date;
        duration: number;
        attempts: number;
        answeredCorrectly: boolean;

        constructor() {
            this.morf = null;
            this.template = 0;
            this.completed = false;
            this.attempts = 0;
            this.answeredCorrectly = false;
        }

        begin() {
            this.started = new Date();
        }

        attempt() {
            this.attempts++;
        }

        complete(correctlyAnswered: boolean) {
            this.completed = true;
            this.answeredCorrectly = correctlyAnswered;
            this.finished = new Date();
            let startedOn: Moment = moment(this.started);
            let finishedOn: Moment = moment(this.finished);
            this.duration = moment.duration(finishedOn.diff(startedOn)).asSeconds();
        }

    }

    interface SessionData {
        name: string;
        shuffle: boolean;
        unforgiving: boolean;
    }

    // This holds a construction of the tasks the user will go through in the current session
    export class Session {
        private tasks: Task[];
        private inactivePeriods: number[];
        private selectedTask: number;       // index
        private started: Date;
        private finished: Date;
        private duration: number;

        constructor(
            public name: string,
            public shuffle: boolean,
            public unforgiving: boolean
        ) {
            this.tasks = [];
            this.inactivePeriods = [];
            this.selectedTask = 0;
            this.started = null;
            this.finished = null;
            this.duration = 0;
        }

        selectTask(index) {
            if (index > -1 && index < this.tasks.length) {
                this.selectedTask = index;
            }
        }

        begin() {
            this.started = new Date();
        }

        complete() {
            this.finished = new Date();
            let startedOn: Moment = moment(this.started);
            let finishedOn: Moment = moment(this.finished);
            this.duration = moment.duration(finishedOn.diff(startedOn)).asSeconds();
        }

        // Record inactive period if above a specified duration
        inactive(duration: number) {
            if (duration > 30) {
                this.inactivePeriods.push(duration);
            }
        }

        completeSelectedTask(correctlyAnswered: boolean) {
            this.tasks[this.selectedTask].complete(correctlyAnswered);
        }

        static fromData(data: SessionData) {
            return new this(data.name, data.shuffle, data.unforgiving);
        }
    }

    export class Avatar {
    }

    export class User {
        private userID: string;
        private avatar: Avatar;
        private seenMorfs: Morf[];

        constructor(public username: string, public sessionId: string) {
            this.userID = "";
            this.avatar = null;
            this.seenMorfs = [];
        }


    }




}