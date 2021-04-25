const mongoose = require("mongoose");
const taskController = require("../controllers/taskController");
const extracter = taskController.extractFilenames;
const auth = require("../middlewares/authMiddleware");

exports.getAllTasks = async function (args, request) {
    const valid = auth.verifyToken(request);
    if (valid.error) 
        return valid.error;

    const saved = await taskController.getAll(valid.id);
    if (saved) {
        return extracter(saved);
    }
}

exports.getFilteredTasks = async function (args, request) {
    const valid = auth.verifyToken(request);
    if (valid.error) 
        return null;

    const saved = await taskController.getByStatus(args.status, valid.id);
    if (saved) {
        return extracter(saved);
    }
}

exports.addTask = async function (args, request) {
    const valid = auth.verifyToken(request);
    if (valid.error) 
        return null;

    const saved = await taskController.add({ 
        name: args.name,
        status: args.status,
        start: args.start,
        stop: args.stop,
    }, valid.id);
    if (saved) {
        return extracter(saved);
    }
}

exports.updateTask = async function(args, request) {
    const valid = auth.verifyToken(request);
    if (valid.error) 
        return null;

    const saved = await taskController.update(mongoose.Types.ObjectId(args.taskId), {
        name: args.name,
        status: args.status,
        start: args.start,
        stop: args.stop,
        savedFiles: args.savedFiles
    }, valid.id);

    if (saved) {
        return extracter(saved);
    }
}

exports.deleteTask = async function (args, request) {
    const valid = auth.verifyToken(request);
    if (valid.error) 
        return null;

    const saved = await taskController.deleteById(mongoose.Types.ObjectId(args.taskId), valid.id);
    if (saved) {
        return extracter(saved);
    }
}

exports.uploadFiles = async function (args, request) {
    const fileList = args.files[0];
    const resultPathList = [];
    for (let i = 0; i < 20; i++) {
        if (!fileList[i.toString()])
            break;
        const { filename, mimetype, createReadStream } = fileList[i.toString()].file;
        const stream = createReadStream();
        const pathObj = await taskController.storeFile(stream, filename);
        if (pathObj) 
            resultPathList.push(pathObj);
    }
    const saved = await taskController.addFiles(args.taskId, resultPathList);
    if (saved) {
        return "files uploaded";
    }
}