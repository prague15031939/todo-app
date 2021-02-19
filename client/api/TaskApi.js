const apiPrefix = "http://localhost:3000";

async function dispatchResponse(response) {
    if (response.ok === true) {
        return await response.json();
    } 
    else {
        return {
            status: response.status,
            text: await response.text(),
        };
    }
}

export default {

    async GetTasks() {
        const response = await fetch(`${apiPrefix}/api/tasks/all`, {
            method: "GET",
            headers: {
                "Accept": "application/json"
            }
        });

        return dispatchResponse(response);
    },

    async GetTasksByFilter(statusFilter) {
        const response = await fetch(`${apiPrefix}/api/tasks/all?status=${statusFilter}`, {
            method: "GET",
            headers: {
                "Accept": "application/json"
            }
        });

        return dispatchResponse(response);
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

    async CreateTask(taskName, taskStatus, startDate, stopDate, selectedFiles) {
        const response = await fetch(`${apiPrefix}/api/tasks/add`, {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name: taskName,
                status: taskStatus,
                start: (new Date(startDate) < Date.now() ? Date.now() : startDate),
                stop: stopDate
            })
        });
    
        return await this.UploadTaskFiles(response, selectedFiles);
    },

    async UpdateTask(taskId, taskName, taskStatus, startDate, stopDate, selectedFiles, editedFiles) {
        const response = await fetch(`${apiPrefix}/api/tasks/${taskId}`, {
            method: "PUT",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name: taskName,
                status: taskStatus,
                start: startDate,
                stop: stopDate,
                savedFiles: editedFiles
            })
        });

        return await this.UploadTaskFiles(response, selectedFiles);
    },

    async DeleteTask(id) {
        const response = await fetch(`${apiPrefix}/api/tasks/delete/${id}`, {
            method: "DELETE",
            headers: {
                "Accept": "application/json"
            }
        });

        return dispatchResponse(response);
    }
}