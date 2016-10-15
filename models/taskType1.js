var mongoose = require("mongoose");
var Task = require('../models/task');

var taskType1Schema = new mongoose.Schema({
        instruction: { type: String, default: "" },
        image1: { type: String, default: "" },
        audio1: { type: String, default: "" },
        image2: { type: String, default: "" },
        audio2: { type: String, default: "" }
}, options);

var TaskType1 = Task.discriminator('TaskType1', taskType1Schema);
module.exports = TaskType1;