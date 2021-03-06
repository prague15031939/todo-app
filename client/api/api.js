import socketIOClient from "socket.io-client";
import {Cookies} from "react-cookie";

const apiPrefix = "http://localhost:3000";
var socket = socketIOClient(apiPrefix);

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

export default {

    GetTasks() {
        return new Promise((resolve, reject) => {
            socket.emit("all", (data) => {
                resolve(dispatchResponse(data));
            });
        });
    },

    GetTasksByFilter(statusFilter) {
        return new Promise((resolve, reject) => {
            socket.emit("filter", statusFilter, (data) => {
                resolve(dispatchResponse(data));
            });
        });
    },

    CreateTask(taskName, taskStatus, startDate, stopDate, selectedFiles) {
        var body = {
            name: taskName,
            status: taskStatus,
            start: (new Date(startDate) < Date.now() ? Date.now() : startDate),
            stop: stopDate
        };

        socket.emit("add", body, (data) => {
            dispatchResponse(data);
        });
    },

    UpdateTask(taskId, taskName, taskStatus, startDate, stopDate, selectedFiles, editedFiles) {
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
    },

    DeleteTask(taskId) {
        return new Promise((resolve, reject) => {
            socket.emit("delete", taskId, (data) => {
                resolve(dispatchResponse(data));
            });
        });
    },

    LoginUser(email, password) {
        return new Promise((resolve, reject) => {
            socket.emit("login", email, password, (data) => {
                const cookies = new Cookies();
                cookies.set('auth-token', data.result, {maxAge: 180});
                socket.close();
                socket.open();
                //if (data.result)
                    //socket.io.engine.opts.transportOptions.polling.extraHeaders.user_cookie = `auth-token=${data.result}`;
                resolve(dispatchUserResponse(data));
            });
        });
    },

    RegisterUser(username, email, password) {
        return new Promise((resolve, reject) => {
            socket.emit("register", username, email, password, (data) => {
                //if (data.result)
                    //socket.io.engine.opts.transportOptions.polling.extraHeaders.user_cookie = `auth-token=${data.result}`;
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