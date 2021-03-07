import socketIOClient from "socket.io-client";
import {Cookies} from "react-cookie";
var SocketIOFileUpload = require('socketio-file-upload');

const apiPrefix = "http://localhost:3000";

const options = { transportOptions: {'documentCookie' : document.cookie} };
var socket = socketIOClient(apiPrefix, options);

function dispatchResponse(data) {
    if (data.status === 200) {
        return data.result;
    } 
    else {
        return {
            err: true,
            status: data.status,
            text: data.text,
        };
    }
}

function dispatchUserResponse(data) {
    return data;
}

function ReconnectSocket(socket) {
    socket.close();
    socket.open();
}

function setAuthCookie(data, socket) {
    if (data.result)
        socket.io.engine.opts.transportOptions.documentCookie = `auth-token=${data.result}`;
    const cookies = new Cookies();
    cookies.set('auth-token', data.result, {maxAge: 180});
    ReconnectSocket(socket);
}

function checkAuthCookie() {
    if (socket.io.engine.opts.transportOptions.documentCookie !== document.cookie)
        ReconnectSocket(socket);
}

export default {

    GetTasks() {
        checkAuthCookie();
        return new Promise((resolve, reject) => {
            socket.emit("all", (data) => {
                resolve(dispatchResponse(data));
            });
        });
    },

    GetTasksByFilter(statusFilter) {
        checkAuthCookie();
        return new Promise((resolve, reject) => {
            socket.emit("filter", statusFilter, (data) => {
                resolve(dispatchResponse(data));
            });
        });
    },

    async UploadTaskFiles(selectedFiles, taskId) {
        checkAuthCookie();
        var uploader = new SocketIOFileUpload(socket);
        uploader.addEventListener("start", function(event) {
            event.file.meta.taskId = taskId;
        });
        uploader.submitFiles(selectedFiles);
        await new Promise(resolve => setTimeout(resolve, selectedFiles.length * 100));
    },

    async CreateTask(taskName, taskStatus, startDate, stopDate, selectedFiles) {
        checkAuthCookie();
        var body = {
            name: taskName,
            status: taskStatus,
            start: (new Date(startDate) < Date.now() ? Date.now() : startDate),
            stop: stopDate
        };

        const created = await new Promise((resolve, reject) => {
            socket.emit("add", body, (data) => {
                resolve(dispatchResponse(data));
            });
        }).then(function(data) { return data; });

        if (selectedFiles.length && !created.err) {
            await this.UploadTaskFiles(selectedFiles, created._id);
        }
    },

    async UpdateTask(taskId, taskName, taskStatus, startDate, stopDate, selectedFiles, editedFiles) {
        checkAuthCookie();
        var body = {
            name: taskName,
            status: taskStatus,
            start: startDate,
            stop: stopDate,
            savedFiles: editedFiles
        };

        const updated = await new Promise((resolve, reject) => {
            socket.emit("update", taskId, body, (data) => {
                resolve(dispatchResponse(data));
            });
        }).then(function(data) { return data; });

        if (selectedFiles.length && !updated.err) {
            await this.UploadTaskFiles(selectedFiles, updated._id);
        }
    },

    DeleteTask(taskId) {
        checkAuthCookie();
        return new Promise((resolve, reject) => {
            socket.emit("delete", taskId, (data) => {
                resolve(dispatchResponse(data));
            });
        });
    },

    LoginUser(email, password) {
        return new Promise((resolve, reject) => {
            socket.emit("login", email, password, (data) => {
                setAuthCookie(data, socket);
                resolve(dispatchUserResponse(data));
            });
        });
    },

    RegisterUser(username, email, password) {
        return new Promise((resolve, reject) => {
            socket.emit("register", username, email, password, (data) => {
                setAuthCookie(data, socket);
                resolve(dispatchUserResponse(data));
            });
        });
    },

    GetCurrent() {
        return new Promise((resolve, reject) => {
            socket.emit("current", (data) => {
                resolve(dispatchUserResponse(data));
            });
        });
    },

    DownloadFile(taskId, filename) {
        checkAuthCookie();
        return new Promise((resolve, reject) => {
            socket.emit("download", taskId, filename, (data) => {
                resolve(dispatchResponse(data));
            });
        });
    },
}