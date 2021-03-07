const Task = require("../models/Task");
const fs = require("fs");
const path = require("path");
const userController = require("../controllers/userController");

exports.extractFilenames = function(tasks) {
    if (tasks.length) {
        for (let i = 0; i < tasks.length; i++)
            if (tasks[i].files)
                for (let j = 0; j < tasks[i].files.length; j++)
                    tasks[i].files[j] = path.basename(tasks[i].files[j]);
    } 
    else if (tasks.files) {
        for (let i = 0; i < tasks.files.length; i++)
            tasks.files[i] = path.basename(tasks.files[i]);
    }
    return tasks;
}

exports.add = async function(taskData, userId) {
    const taskItem = new Task({
        user: userId,
        name: taskData.name, 
        status: taskData.status,
        start: taskData.start, 
        stop: taskData.stop
    });
    return await taskItem.save();
}

exports.update = async function(taskId, taskData, userId) {
    const updatingTask = await Task.findOne({_id: taskId});

    if (updatingTask.user != userId) 
        return null;

    const newFiles = updatingTask.files.filter(item => {
        let fileName = path.basename(item);
        if (!taskData.savedFiles.includes(fileName)) {
            fs.unlinkSync(item);
            return false;
        }
        else {
            return true;
        }
    });

    return await Task.findOneAndUpdate(
        {_id: taskId}, {$set: {name: taskData.name, status: taskData.status, start: taskData.start, stop: taskData.stop, files: newFiles}}, {new: true}
    );
}

exports.addFile = async function(taskId, uploadedFile) {
    return await Task.findOneAndUpdate({_id: taskId}, {$push: {files: uploadedFile.pathName}}, {new: true});
}

exports.addFiles = async function(taskId, uploadedFiles) {
    return await Task.findOneAndUpdate({_id: taskId}, {$push: {files: {$each: Array.from(uploadedFiles, item => item.path)}}}, {new: true});
}

exports.getAll = async function(userId) {
    return await Task.find({ user: userId });
}

exports.getByStatus = async function(taskStatus, userId) {
    return await Task.find({status: taskStatus, user: userId});
}

exports.getById = async function(id) {
    return await Task.findOne({_id: id});
}

exports.deleteById = async function(id, userId) {
    const task = await Task.findOne({_id: id});

    if (task.user != userId)
        return null;

    for (const fileName of task.files)
        fs.unlinkSync(fileName);
    return await Task.findByIdAndRemove({_id: id});
}
