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

    UploadTaskFiles_(selectedFiles, taskId) {
        checkAuthCookie();
        if (selectedFiles.length) {
           socket.emit("upload", taskId, (data) => {
                var uploader = new SocketIOFileUpload(socket);
                uploader.submitFiles(selectedFiles);
                dispatchResponse(data);
            });
        }
    },

    CreateTask(taskName, taskStatus, startDate, stopDate, selectedFiles) {
        checkAuthCookie();
        var body = {
            name: taskName,
            status: taskStatus,
            start: (new Date(startDate) < Date.now() ? Date.now() : startDate),
            stop: stopDate
        };

        socket.emit("add", body, (data) => {
            dispatchResponse(data);
        });

        this.UploadTaskFiles_(selectedFiles, 0);
    },

    UpdateTask(taskId, taskName, taskStatus, startDate, stopDate, selectedFiles, editedFiles) {
        checkAuthCookie();
        var body = {
            name: taskName,
            status: taskStatus,
            start: startDate,
            stop: stopDate,
            savedFiles: editedFiles
        };

        socket.emit("update", taskId, body, (data) => {
            dispatchResponse(data);
        });

        this.UploadTaskFiles_(selectedFiles, taskId);
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

    async UploadTaskFiles(response, selectedFiles) {
        if (response.ok === true) {
            const task = await response.json();

            if (selectedFiles.length) {
                const formData = new FormData();
                for (let i = 0; i < selectedFiles.length; i++)
                    formData.append("filedata", selectedFiles[i]);
                const responseUpload = await fetch(`${apiPrefix}/api/tasks/upload/${task._id}`, {
                    method: "POST",
                    body: formData,
                });
    
                return dispatchResponse(responseUpload);
            }
            else {
                return task;
            }
        }
        else {
            return {
                status: response.status,
                msg: await response.text(),
            };
        }
    },
}