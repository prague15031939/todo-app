const mongoose = require("mongoose");

const taskScheme = new mongoose.Schema({
    name: {
        type: String, 
        required: true,
        maxlength: 4096
    },
    status: {
        type: Number,
        min: 0,
        max: 5,
        default: 0,
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