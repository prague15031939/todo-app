const Task = require("../models/Task");

exports.add = async function(taskData) {
    const taskItem = new Task({
        name: taskData.name, 
        status: taskData.status,
        start: taskData.start, 
        stop: taskData.stop
    });
    return await taskItem.save();
}

exports.getAll = async function() {
    return await Task.find({});
}