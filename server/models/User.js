const mongoose = require("mongoose");

const userScheme = mongoose.Schema({
    username: {
        type: String,
        required: true,
        maxlength: 100,
    },
    email: {
        type: String,
        required: true,
        maxlength: 100,
    },
    hash: {
        type: String,
        required: true,
        maxlength: 100,
    }
});

module.exports = mongoose.model("User", userScheme);