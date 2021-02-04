const Task = require("../models/Task");
const fs = require("fs");

exports.add = async function(taskData) {
    const taskItem = new Task({
        name: taskData.name, 
        status: taskData.status,
        start: taskData.start, 
        stop: taskData.stop
    });
    return await taskItem.save();
}

exports.addFiles = async function(taskId, uploadedFiles) {
    return await Task.findOneAndUpdate({_id: taskId}, {files: Array.from(uploadedFiles, item => item.path)}, {new: true});
}

exports.getAll = async function() {
    return await Task.find({});
}

exports.getByStatus = async function(taskStatus) {
    return await Task.find({status: taskStatus});
}

exports.deleteById = async function(id) {
    const task = await Task.findOne({_id: id});
    for (const fileName of task.files)
        fs.unlinkSync(fileName);
    return await Task.findByIdAndRemove({_id: id});
}