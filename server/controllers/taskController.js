const Task = require("../models/Task");
const fs = require("fs");
const path = require("path");

exports.extractFilenames = function(tasks) {
    if (tasks.length) {
        for (let i = 0; i < tasks.length; i++)
            if (tasks[i].files)
                for (let j = 0; j < tasks[i].files.length; j++)
                    tasks[i].files[j] = path.basename(tasks[i].files[j]);
    } 
    else {
        for (let i = 0; i < tasks.files.length; i++)
            tasks.files[i] = path.basename(tasks.files[i]);
    }
    return tasks;
}

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

exports.getById = async function(id) {
    return await Task.findOne({_id: id});
}

exports.deleteById = async function(id) {
    const task = await Task.findOne({_id: id});
    for (const fileName of task.files)
        fs.unlinkSync(fileName);
    return await Task.findByIdAndRemove({_id: id});
}
