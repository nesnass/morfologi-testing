/// <reference path="../_references.ts"/>
var MorfologiApp;
(function (MorfologiApp) {
    "use strict";
    var Morf = (function () {
        function Morf(key, root, morphed, position) {
            this.key = key;
            this.root = root;
            this.morphed = morphed;
            this.position = position;
        }
        return Morf;
    }());
    MorfologiApp.Morf = Morf;
    // Represents one task in a set that is produced for a user session
    var Task = (function () {
        function Task() {
            this.morf = null;
            this.template = 0;
            this.completed = false;
            this.attempts = 0;
            this.answeredCorrectly = false;
        }
        Task.prototype.begin = function () {
            this.started = new Date();
        };
        Task.prototype.attempt = function () {
            this.attempts++;
        };
        Task.prototype.complete = function (correctlyAnswered) {
            this.completed = true;
            this.answeredCorrectly = correctlyAnswered;
            this.finished = new Date();
            var startedOn = moment(this.started);
            var finishedOn = moment(this.finished);
            this.duration = moment.duration(finishedOn.diff(startedOn)).asSeconds();
        };
        return Task;
    }());
    MorfologiApp.Task = Task;
    // This holds a construction of the tasks the user will go through in the current session
    var Session = (function () {
        function Session(name, shuffle, unforgiving) {
            this.name = name;
            this.shuffle = shuffle;
            this.unforgiving = unforgiving;
            this.tasks = [];
            this.inactivePeriods = [];
            this.selectedTask = 0;
            this.started = null;
            this.finished = null;
            this.duration = 0;
        }
        Session.prototype.selectTask = function (index) {
            if (index > -1 && index < this.tasks.length) {
                this.selectedTask = index;
            }
        };
        Session.prototype.begin = function () {
            this.started = new Date();
        };
        Session.prototype.complete = function () {
            this.finished = new Date();
            var startedOn = moment(this.started);
            var finishedOn = moment(this.finished);
            this.duration = moment.duration(finishedOn.diff(startedOn)).asSeconds();
        };
        // Record inactive period if above a specified duration
        Session.prototype.inactive = function (duration) {
            if (duration > 30) {
                this.inactivePeriods.push(duration);
            }
        };
        Session.prototype.completeSelectedTask = function (correctlyAnswered) {
            this.tasks[this.selectedTask].complete(correctlyAnswered);
        };
        Session.fromData = function (data) {
            return new this(data.name, data.shuffle, data.unforgiving);
        };
        return Session;
    }());
    MorfologiApp.Session = Session;
    var Avatar = (function () {
        function Avatar() {
        }
        return Avatar;
    }());
    MorfologiApp.Avatar = Avatar;
    var User = (function () {
        function User(username, sessionId) {
            this.username = username;
            this.sessionId = sessionId;
            this.userID = "";
            this.avatar = null;
            this.seenMorfs = [];
        }
        return User;
    }());
    MorfologiApp.User = User;
})(MorfologiApp || (MorfologiApp = {}));
//# sourceMappingURL=models.js.map