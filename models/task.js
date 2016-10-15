var mongoose = require("mongoose");

var options = { discriminatorKey: 'kind' };

var taskSchema = new mongoose.Schema({
    kind: {
        type: String,
        required: true,
        enum: ["TaskType1", "TaskType2", "TaskType3", "TaskType4", "TaskType5", "TaskType6", "TaskType7"]
    },
    // The morph details for the task
    morph: { type: String, default: "" },
    affix: { type: String, default: "prefix", enum: ["prefix", "suffix"] },
    stem:  { type: String, default: "" },
    xform: { type: String, default: "" }
}, options);


// Export Models
var Task = mongoose.model('Task', taskSchema);

module.exports = Task;