const mongoose = require("mongoose");
const taskController = require("../controllers/taskController");
const extracter = taskController.extractFilenames;

exports.getAllTasks = async function (request) {
    const saved = await taskController.getAll(mongoose.Types.ObjectId(request.userId));
    if (saved) {
        return extracter(saved);
    }
}

exports.getFilteredTasks = async function (request) {
    const saved = await taskController.getByStatus(request.status, mongoose.Types.ObjectId(request.userId));
    if (saved) {
        return extracter(saved);
    }
}

exports.addTask = async function (request) {
    const saved = await taskController.add({ 
        name: request.name,
        status: request.status,
        start: request.start,
        stop: request.stop,
    }, mongoose.Types.ObjectId(request.userId));
    if (saved) {
        return extracter(saved);
    }
}