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

exports.deleteById = async function(id) {
    return await Task.findByIdAndRemove({_id: id});
}

exports.addFiles = async function(taskId, uploadedFiles) {
    return await Task.findOneAndUpdate({_id: taskId}, {files: Array.from(uploadedFiles, item => item.path)}, {new: true});
}