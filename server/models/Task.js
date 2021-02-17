const mongoose = require("mongoose");

mongoose.set('useFindAndModify', false);

const taskScheme = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: false,
    },
    name: {
        type: String, 
        required: true,
        maxlength: 4096
    },
    status: {
        type: String,
        enum: ["not started", "in progress", "completed"],
        default: "not started",
        required: true
    },
    start: {
        type: Date,
        default: Date.now,
    },
    stop: {
        type: Date,
        required: true,
    },
    files: {
        type: [String],
        required: false
    }
});

module.exports = mongoose.model("Task", taskScheme);